Set-SmbClientConfiguration -RequireSecuritySignature 0 -EnableSecuritySignature 0 -Confirm -Force
mkdir C:\Common
echo "$password = ConvertTo-SecureString 'UberSecurePassword' -AsPlainText -Force`n$credential = New-Object System.Management.Automation.PSCredential ('administrator', $password)`nInvoke-Command -ComputerName . -Credential $credential -ScriptBlock { Restart-Service -Name 'DNS Server' }" > C:\Common\DNSrestart.ps1
New-SmbShare -Name Common -Path C:\Common -FullAccess Everyone
Enable-LocalUser -Name "Guest"
$acl = Get-Acl C:\Common
$AccessRule = New-Object System.Security.AccessControl.FileSystemAccessRule("Guest","FullControl","Allow")
$acl.SetAccessRule($AccessRule)
$acl | Set-Acl C:\Common
Set-Itemproperty -path 'HKLM:\SYSTEM\CurrentControlSet\Control\Lsa' -Name 'EveryoneIncludesAnonymous' -value '1'
New-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters' -name "NullSessionShares" -PropertyType MultiString -value "C:\Common"
# Import Active Directory module (Ensure RSAT tools are installed)
Import-Module ActiveDirectory

# Create the new domain user 'Alice.Wonderland' with the password 'P@ssw0rd!'
New-ADUser -SamAccountName "Alice.Wonderland" `
           -UserPrincipalName "Alice.Wonderland@domain.com" `
           -Name "Alice Wonderland" `
           -GivenName "Alice" `
           -Surname "Wonderland" `
           -DisplayName "Alice Wonderland" `
           -PasswordNeverExpires $true `
           -AccountPassword (ConvertTo-SecureString "P@ssw0rd!" -AsPlainText -Force) `
           -Enabled $true `
           -PassThru

# Set Kerberos Pre-Authentication to Disabled for the user
Set-ADUser -Identity "Alice.Wonderland" -KerberosPreAuthenticationDisabled $true

Write-Host "User Alice.Wonderland created and Kerberos pre-authentication disabled."
# Import Active Directory module (Ensure RSAT tools are installed)
Import-Module ActiveDirectory

# Define the domain controller account
$domainController = "DC01" # Replace with the name of your domain controller

# Create a service account for the mssql service
$serviceAccountName = "mssql_service"
$servicePassword = "Password123!@#"

# Create the service account in Active Directory
New-ADUser -SamAccountName $serviceAccountName `
           -UserPrincipalName "$serviceAccountName@maraudersec.local" `
           -Name "mssql service account" `
           -GivenName "mssql" `
           -Surname "service" `
           -DisplayName "mssql service" `
           -PasswordNeverExpires $true `
           -AccountPassword (ConvertTo-SecureString $servicePassword -AsPlainText -Force) `
           -Enabled $true `
           -PassThru

# Set SPN for the mssql service
$spn = "mssql/$domainController"

# Set the CIFS SPN for the service account
Set-ADUser -Identity $serviceAccountName -ServicePrincipalNames $spn

# Set the CIFS service principal name (ensure the domain controller's CIFS SPN is added)
Set-ADUser -Identity $serviceAccountName -ServicePrincipalNames "cifs/$domainController"

Write-Host "Service Principal Name (SPN) for mssql service has been set with CIFS permissions."
# Allow all inbound and outbound connections by configuring the firewall
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True -DefaultInboundAction Allow -DefaultOutboundAction Allow

# Disable Windows Defender real-time monitoring (antivirus protection)
Set-MpPreference -DisableRealtimeMonitoring $true

# Optionally, you can also disable Windows Defender completely, if needed
# Set-MpPreference -DisableAntiSpyware $true
netsh advfirewall set allprofiles state off

Write-Host "Firewall configured to allow all connections and real-time monitoring disabled."
$Dcname = Get-ADDomain | Select-Object -ExpandProperty DistinguishedName
$Adsi = 'LDAP://CN=Directory Service,CN=Windows NT,CN=Services,CN=Configuration,' + $Dcname
$AnonADSI = [ADSI]$Adsi
$AnonADSI.Put("dSHeuristics","0000002")
$AnonADSI.SetInfo()
$ADSI = [ADSI]('LDAP://CN=Users,' + $Dcname)
$Anon = New-Object System.Security.Principal.NTAccount("ANONYMOUS LOGON")
$SID = $Anon.Translate([System.Security.Principal.SecurityIdentifier])
$adRights = [System.DirectoryServices.ActiveDirectoryRights] "GenericRead"
$type = [System.Security.AccessControl.AccessControlType] "Allow"
$inheritanceType = [System.DirectoryServices.ActiveDirectorySecurityInheritance] "All"
$ace = New-Object System.DirectoryServices.ActiveDirectoryAccessRule $SID,$adRights,$type,$inheritanceType
$ADSI.PSBase.ObjectSecurity.ModifyAccessRule([System.Security.AccessControl.AccessControlModification]::Add,$ace,[ref]$false)
$ADSI.PSBase.CommitChanges()
# Allow anonymous binding to LDAP (null access)
Set-ADDomainController -Identity "DC01" -LdapBindAnonymous $true

# Modify LDAP Server to allow null access for anonymous users
$domainController = "DC01.maraudersec.local"
$nullAccess = "LDAP://$domainController"
$ldapConnection = New-Object DirectoryServices.DirectorySearcher
$ldapConnection.SearchRoot = New-Object DirectoryServices.DirectorySearcher
$ldapConnection.Filter = "(objectClass=*)"
$ldapConnection.Properties.PropertyNames | ForEach-Object {
    Write-Host "Access granted for: $_"
}

# Set up a firewall rule to allow LDAP on port 389 for null access
New-NetFirewallRule -DisplayName "Allow LDAP Null Access" -Direction Inbound -Protocol TCP -LocalPort 389 -Action Allow
New-NetFirewallRule -DisplayName "Allow LDAP Null Access" -Direction Outbound -Protocol TCP -LocalPort 389 -Action Allow

# Import the Active Directory module (if not already imported)
Import-Module ActiveDirectory

# Disable password complexity
Set-ADDefaultDomainPasswordPolicy -Identity "maraudersec.local" -ComplexityEnabled $false

# Set the minimum password length to 6 characters (you can change this value)
Set-ADDefaultDomainPasswordPolicy -Identity "maraudersec.local" -MinPasswordLength 6

# Set the maximum password age to 90 days (you can change this value)
Set-ADDefaultDomainPasswordPolicy -Identity "maraudersec.local" -MaxPasswordAge (New-TimeSpan -Days 90)

# Set the minimum password age to 0 days (users can change password immediately)
Set-ADDefaultDomainPasswordPolicy -Identity "maraudersec.local" -MinPasswordAge (New-TimeSpan -Days 0)

# Set the number of passwords to remember (set to 0 to disable history requirement)
Set-ADDefaultDomainPasswordPolicy -Identity "maraudersec.local" -PasswordHistoryCount 0

# Disable account lockout policy (if desired, not recommended for production environments)
Set-ADDefaultDomainPasswordPolicy -Identity "maraudersec.local" -LockoutThreshold 0

Write-Host "Password policy updated successfully!"

Write-Host "LDAP null access allowed and firewall configured."
# List of passwords to choose from
# Set the password policy to allow simple passwords
# Set the password policy to allow simple passwords
$Domain = "maraudersec.local"

# Set the password policy to allow simple passwords (remove complexity requirement)
$Domain = "maraudersec.local"

# Set the minimum password length and disable complexity requirements
Set-ADDefaultDomainPasswordPolicy -Identity $Domain -MinPasswordLength 4 -ComplexityEnabled $false

# List of usernames and their corresponding passwords
$users = @(
    @{Username = "john.doe"; Password = "1234"},
    @{Username = "jane.smith"; Password = "password"},
    @{Username = "michael.brown"; Password = "qwerty"},
    @{Username = "susan.johnson"; Password = "iloveyou"},
    @{Username = "robert.miller"; Password = "12345"},
    @{Username = "patricia.taylor"; Password = "letmein"},
    @{Username = "james.moore"; Password = "monkey"},
    @{Username = "mary.jackson"; Password = "123456"},
    @{Username = "david.white"; Password = "welcome"},
    @{Username = "linda.harris"; Password = "football"}
)

# Select two users to set the password in their description and require a password change
$usersToUpdate = @("john.doe", "jane.smith")

# Loop through each user
foreach ($user in $users) {
    # Check if user already exists in Active Directory
    try {
        # Query the user by SamAccountName (Username)
        $adUser = Get-ADUser -Filter {SamAccountName -eq $user.Username} -ErrorAction Stop
        Write-Host "User $($user.Username) exists."
        
        # If the user is in the list of users to update, modify their description and set the "password must change"
        if ($usersToUpdate -contains $user.Username) {
            # Set the password in the description
            Set-ADUser -Identity $adUser -Description $user.Password
            
            # Set the flag for the user to change password at next logon
            Set-ADUser -Identity $adUser -ChangePasswordAtLogon $true
            Write-Host "User $($user.Username) updated with password in description and set to change password at next logon."
        }
    }
    catch {
        Write-Host "User $($user.Username) does not exist."
        # If the user doesn't exist, create them
        New-ADUser -SamAccountName $user.Username -UserPrincipalName "$($user.Username)@maraudersec.local" `
                   -Name "$($user.Username)" -GivenName $user.Username.Split('.')[0] -Surname $user.Username.Split('.')[1] `
                   -AccountPassword (ConvertTo-SecureString $user.Password -AsPlainText -Force) `
                   -Enabled $true -PassThru
        Write-Host "User $($user.Username) created with password $($user.Password)."
    }
}
# Define the groups to create
$groups = @("IT Helpdesk", "IT Admins", "HR", "Management", "Floor")

# Create groups if they do not exist
foreach ($group in $groups) {
    if (-not (Get-ADGroup -Filter {Name -eq $group})) {
        Write-Host "Creating group: $group"
        New-ADGroup -Name $group -GroupScope Global -PassThru
    }
    else {
        Write-Host "Group $group already exists."
    }
}

# Add Alice.Wonderland to the 'Floor' group
Add-ADGroupMember -Identity "Floor" -Members "Alice.Wonderland"
Write-Host "Added Alice.Wonderland to Floor group."

# Group assignments
$usersGroupAssignment = @{
    "Administrator" = "IT Admins"
    "Alice.Wonderland" = "Floor"
    "Bob.Builder" = "Floor"
    "Charlie.Brown" = "HR"
    "david.white" = "HR"
    "Guest" = "HR"
    "james.moore" = "Management"
    "jane.smith" = "Management"
    "john.doe" = "Management"
    "krbtgt" = "Floor"
    "linda.harris" = "IT Helpdesk"
    "mary.jackson" = "IT Helpdesk"
    "michael.brown" = "Floor"
    "mssql_service" = "Domain Admins"  # Add mssql_service to Domain Admins
    "patricia.taylor" = "Floor"
    "robert.miller" = "Floor"
    "susan.johnson" = "Floor"
}

# Assign users to their respective groups
foreach ($user in $usersGroupAssignment.GetEnumerator()) {
    Add-ADGroupMember -Identity $user.Value -Members $user.Key
    Write-Host "Added $($user.Key) to $($user.Value) group."
}

Add-Type -AssemblyName "System.DirectoryServices"

function Add-DACLAbuse {
    param (
        [string]$targetName,
        [string]$targetType,
        [string]$permission,
        [string]$userName
    )

    Write-Host "Debug: targetName = $targetName, targetType = $targetType, permission = $permission, userName = $userName"

    # Check if any of the parameters are null or empty
    if (-not $targetName -or -not $targetType -or -not $permission) {
        Write-Host "Error: Missing parameter(s)"
        return
    }

    # Debugging output before processing permission
    Write-Host "Target: $targetName, Type: $targetType, Permission: $permission"

    # Ensure the SID is retrieved from the user
    $user = Get-ADUser -Identity $userName
    $sid = $user.SID

    switch ($permission) {
        "GenericAll" {
            $accessRule = New-Object System.DirectoryServices.ActiveDirectoryAccessRule(
                $sid, 
                [System.DirectoryServices.ActiveDirectoryRights]::GenericAll,
                [System.Security.AccessControl.AccessControlType]::Allow
            )
        }
        "WriteOwner" {
            $accessRule = New-Object System.DirectoryServices.ActiveDirectoryAccessRule(
                $sid, 
                [System.DirectoryServices.ActiveDirectoryRights]::WriteOwner,
                [System.Security.AccessControl.AccessControlType]::Allow
            )
        }
        "Owns" {
            $accessRule = New-Object System.DirectoryServices.ActiveDirectoryAccessRule(
                $sid, 
                [System.DirectoryServices.ActiveDirectoryRights]::WriteOwner,
                [System.Security.AccessControl.AccessControlType]::Allow
            )
        }
        "WriteDACL" {
            $accessRule = New-Object System.DirectoryServices.ActiveDirectoryAccessRule(
                $sid, 
                [System.DirectoryServices.ActiveDirectoryRights]::WriteDACL,
                [System.Security.AccessControl.AccessControlType]::Allow
            )
        }
        "GenericWrite" {
            $accessRule = New-Object System.DirectoryServices.ActiveDirectoryAccessRule(
                $sid, 
                [System.DirectoryServices.ActiveDirectoryRights]::WriteProperty,
                [System.Security.AccessControl.AccessControlType]::Allow
            )
        }
        "ForceChangePassword" {
            $accessRule = New-Object System.DirectoryServices.ActiveDirectoryAccessRule(
                $sid, 
                [System.DirectoryServices.ActiveDirectoryRights]::WriteOwner,
                [System.Security.AccessControl.AccessControlType]::Allow
            )
        }
        "AddUserToGroup" {
            Write-Host "AddUserToGroup requires special handling. Skipping for now."
            return
        }
        "TargetedKerberos" {
            Write-Host "TargetedKerberos requires special handling. Skipping for now."
            return
        }
        "GetChanges" {
            $accessRule = New-Object System.DirectoryServices.ActiveDirectoryAccessRule(
                $sid, 
                [System.DirectoryServices.ActiveDirectoryRights]::GenericRead,
                [System.Security.AccessControl.AccessControlType]::Allow
            )
        }
        default {
            Write-Host "Unknown permission: $permission"
            return
        }
    }

    Write-Host "Access rule created for $permission"
}

# Example of calling the function
Add-DACLAbuse -targetName "HR" -targetType "group" -permission "GenericAll" -userName "bob.builder"
Add-DACLAbuse -targetName "alice.wonderland" -targetType "user" -permission "GenericWrite" -userName "bob.builder"
Add-DACLAbuse -targetName "Management" -targetType "group" -permission "WriteOwner" -userName "alice.wonderland"
Add-DACLAbuse -targetName "john.doe" -targetType "user" -permission "Owns" -userName "alice.wonderland"
Add-DACLAbuse -targetName "IT Admins" -targetType "group" -permission "WriteDACL" -userName "alice.wonderland"
Add-DACLAbuse -targetName "krbtgt" -targetType "user" -permission "ForceChangePassword" -userName "bob.builder"
Add-DACLAbuse -targetName "HR" -targetType "group" -permission "AddUserToGroup" -userName "bob.builder"
Add-DACLAbuse -targetName "alice.wonderland" -targetType "user" -permission "TargetedKerberos" -userName "bob.builder"
Add-DACLAbuse -targetName "john.doe" -targetType "user" -permission "GetChanges" -userName "alice.wonderland"

net localgroup "backup operators" /add maraudersec.local\alice.wonderland
net localgroup "Server Operators" /add maraudersec.local\alice.wonderland
net localgroup "DNSAdmins" /add maraudersec.local\alice.wonderland
net localgroup "Account Operators" /add maraudersec.local\alice.wonderland
wget https://raw.githubusercontent.com/blakedrumm/SCOM-Scripts-and-SQL/refs/heads/master/Powershell/General%20Functions/Set-UserRights.ps1 -o a.ps1
. ./a.ps1 -Username maraudersec.local\alice.wonderland -UserRight "SeBackupPrivilege", "SeRestorePrivilege", "SeDebugPrivilege", "SeTcbPrivilege", "SeTakeOwnershipPrivilege", "SeSecurityPrivilege", "SeShutdownPrivilege", "SeRemoteShutdownPrivilege", "SeSystemEnvironmentPrivilege", "SeLoadDriverPrivilege", "SeCreateSymbolicLinkPrivilege", "SeDelegateSessionUserImpersonatePrivilege", "SeEnableDelegationPrivilege", "SeImpersonatePrivilege" -AddRight
del a.ps1
                    
Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Force
Install-Module -Name PS2EXE -Force -Scope CurrentUser
# PowerShell Script to simulate unquoted service path vulnerability

# Define path and filename
$servicePath = "C:\Program Files\CompanyName\Some Service\unquoted.exe"
$serviceExecutable = "C:\Program Files\CompanyName\Some Service\unquoted.ps1"

# Create a folder path if it doesn't exist
$folderPath = "C:\Program Files\CompanyName\Some Service"
If (!(Test-Path -Path $folderPath)) {
    New-Item -ItemType Directory -Force -Path $folderPath
}

# Create a simple payload executable (e.g., simple reverse shell or message box for demonstration)
$payload = @'
Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public class MessageBox {
    [DllImport("user32.dll", CharSet = CharSet.Auto)]
    public static extern int MessageBeep(int uType);
}
"@
[MessageBox]::MessageBeep(0)
'@

# Save the payload as a .ps1 script to be executed as part of the unquoted vulnerability
$payload | Out-File -FilePath $serviceExecutable -Encoding ascii

# Simulate creating an unquoted service path vulnerability (write the unquoted path to registry)
$regPath = "HKLM:\SYSTEM\CurrentControlSet\Services\UnquotedService"
New-Item -Path $regPath -Force
Set-ItemProperty -Path $regPath -Name "ImagePath" -Value $servicePath

Write-Host "Unquoted service path vulnerability created successfully."
PS2EXE -Verbose "C:\Program Files\CompanyName\Some Service\unquoted.ps1" "C:\Program Files\CompanyName\Some Service\unquoted.exe"
PS2EXE -Verbose "C:\Program Files\CompanyName\Some Service\unquoted.ps1" "C:\Program Files\CompanyName\Some Service\unquoted.exe"
del 'C:\Program Files\CompanyName\Some Service\unquoted.ps1'
$targetDir = "C:\Program Files\SomeApp"

# Ensure the directory exists
if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force
}

# Grant "Everyone" full control over the directory
$acl = Get-Acl $targetDir
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule("Everyone", "FullControl", "ContainerInherit, ObjectInherit", "None", "Allow")
$acl.SetAccessRule($rule)
Set-Acl -Path $targetDir -AclObject $acl

Write-Host "Directory created and permissions granted to Everyone."
& "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe" /out:"C:\Program Files\SomeApp\Example.exe" "C:\Program Files\SomeApp\Example.cs"
# Grant "Everyone" full control over the executable
$acl = Get-Acl $exeOutputPath
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule("Everyone", "FullControl", "Allow")
$acl.SetAccessRule($rule)
Set-Acl -Path $exeOutputPath -AclObject $acl

Write-Host "Permissions updated: Everyone has full control over $exeOutputPath"
$Action = New-ScheduledTaskAction -Execute "C:\Program Files\SomeApp\Example.exe"

$Trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 1) -RepetitionDuration (New-TimeSpan -Days 9999)

$Principal = New-ScheduledTaskPrincipal -UserId "Administrator" -LogonType Password -RunLevel Highest

$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -DontStopOnIdleEnd

$Task = New-ScheduledTask -Action $Action -Principal $Principal -Trigger $Trigger -Settings $Settings

Register-ScheduledTask -TaskName "RunExampleEveryMinute" -InputObject $Task -User "Administrator" -Password "1qaz2wsx!QAZ@WSX"
