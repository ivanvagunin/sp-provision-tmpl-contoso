param(
    [string]$url = "https://<tenant>.sharepoint.com",
    [string]$package = ".\built\Contoso.pnp",
    [string]$providers = $null
)

Connect-PnPOnline $url
Set-PnPTraceLog -On -Level Information
if($providers) {
	Add-Type -Path (Resolve-Path $providers)
}
Apply-PnPProvisioningTemplate -Path (Resolve-Path $package)
