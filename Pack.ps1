param(
	[string]$path = "./sitetemplates",
	[string]$resources = "./resources",
	[string]$output = "./built",
	[string]$providers = $null

)

$fullPath = Resolve-Path $path
$templateFiles = Get-Item (Join-Path $fullPath "*.xml")

function ConvertTo-OpenXML ($template, $resx, $out) {
	#add localization info for resource files
	if($resx) {
		$resx | ForEach-Object {
			$resxName = [System.IO.Path]::GetFileNameWithoutExtension($_.FullName);
			$culture = @{ LCID=1033; Name = "us US"};
			if($resxName.IndexOf('.') -gt 0) {
				$index = $resxName.LastIndexOf(".");
				$cultureName = $resxName.Substring($index + 1, $resxName.Length - $index - 1);
				$cultureInfo = New-Object System.Globalization.CultureInfo($cultureName);
				$culture.LCID = $cultureInfo.LCID;
				$culture.Name = $cultureInfo.Name.Replace("-", " ");
			}
		
			$localization = New-Object OfficeDevPnP.Core.Framework.Provisioning.Model.Localization;
			$localization.LCID = $culture.LCID;
			$localization.Name = $culture.Name
			$localization.ResourceFile = [System.IO.Path]::GetFileName($_.FullName);
			$template.Localizations.Add($localization);
		}
	}

	Save-PnPProvisioningTemplate -InputInstance $template -Out $out -Force

	#add resx files to package
	if($resx) {
		$resx | ForEach-Object {
			Add-PnPFileToProvisioningTemplate -Path $out -Source $_.FullName -Folder "\"
		}
	}

	#add referenced files to package
	if($template.Files -and $template.Files.Count -gt 0) {
		$filesToAdd = New-Object System.Collections.ArrayList;
		$template.Files | ForEach-Object {
			$filesToAdd.Add($_);
		}
		$template.Files.Clear();

		$filesToAdd | ForEach-Object {
			Add-PnPFileToProvisioningTemplate -Path $out -Source (Join-Path (Resolve-Path ".\") $_.Src) -Container ([System.IO.Path]::GetDirectoryName($_.Src)) -Folder $_.Folder
		}
	}
}

#load custom providers assembly
if($providers) {
	Add-Type -Path (Resolve-Path $providers).Path
}

$templateFiles | ForEach-Object {
	$templateFile = $_.FullName;
	try {
		$template = Load-PnPProvisioningTemplate $templateFile
		$out = Join-Path $output ([System.IO.Path]::GetFileNameWithoutExtension($_.Name) + ".pnp")
		$resx = Get-Item (Join-Path $resources ([System.IO.Path]::GetFileNameWithoutExtension($_.Name) + "*.resx"))
		ConvertTo-OpenXML $template $resx $out 
	}
	catch {
		$error = $_.Exception.Message
		Write-Error("Failed to load XML template {0}: {1}" -f $templateFile, $error);
	}
}


