param(
    [Parameter(Mandatory = $true)]
    [string]$PackDirectory
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$sourcePath = Join-Path $PackDirectory 'complete-dark-archive.zip'
$targetPath = Join-Path $PackDirectory 'complete-dark-archive-commercial.zip'
$licensePath = Join-Path $PackDirectory 'COMMERCIAL-LICENSE.txt'

if (-not (Test-Path -LiteralPath $sourcePath)) { throw "Source archive not found: $sourcePath" }
if (-not (Test-Path -LiteralPath $licensePath)) { throw "Commercial licence not found: $licensePath" }
if (Test-Path -LiteralPath $targetPath) { throw "Target already exists: $targetPath" }

$readme = @'
GIANNI PERUGINI DIGITAL ART - COMPLETE COMMERCIAL ARCHIVE

This download contains 168 artworks in two wallpaper formats:
- desktop: 3840 x 2160 pixels (4K, 16:9)
- mobile: 1440 x 2560 pixels (9:16)

The included STANDARD COMMERCIAL LICENSE permits use in business websites,
social posts, digital advertisements, presentations, videos, stream graphics,
and flattened client work. It does not permit resale or redistribution of the
source files, merchandise, print-on-demand, publishing or book covers, logos,
trademarks, NFTs, or AI training/evaluation.

Read COMMERCIAL-LICENSE.txt before using the artwork. For expanded rights,
contact Gianni Perugini through https://gianniperugini.com/.
'@

$source = [System.IO.Compression.ZipFile]::OpenRead($sourcePath)
$target = [System.IO.Compression.ZipFile]::Open($targetPath, 'Create')
try {
    foreach ($entry in $source.Entries) {
        if ($entry.FullName -in @('PERSONAL-LICENSE.txt', 'README.txt')) { continue }
        $newEntry = $target.CreateEntry($entry.FullName, 'Optimal')
        $inputStream = $entry.Open()
        $outputStream = $newEntry.Open()
        try { $inputStream.CopyTo($outputStream) }
        finally { $outputStream.Dispose(); $inputStream.Dispose() }
    }

    $licenseEntry = $target.CreateEntry('COMMERCIAL-LICENSE.txt', 'Optimal')
    $licenseInput = [System.IO.File]::OpenRead($licensePath)
    $licenseOutput = $licenseEntry.Open()
    try { $licenseInput.CopyTo($licenseOutput) }
    finally { $licenseOutput.Dispose(); $licenseInput.Dispose() }

    $readmeEntry = $target.CreateEntry('README.txt', 'Optimal')
    $writer = New-Object System.IO.StreamWriter($readmeEntry.Open(), (New-Object System.Text.UTF8Encoding($false)))
    try { $writer.Write($readme) }
    finally { $writer.Dispose() }
}
catch {
    $target.Dispose()
    $source.Dispose()
    if (Test-Path -LiteralPath $targetPath) { Remove-Item -LiteralPath $targetPath }
    throw
}
finally {
    if ($target) { $target.Dispose() }
    if ($source) { $source.Dispose() }
}

$check = [System.IO.Compression.ZipFile]::OpenRead($targetPath)
try {
    $entries = @($check.Entries.FullName)
    if ($entries -contains 'PERSONAL-LICENSE.txt') { throw 'Personal licence remained in commercial archive.' }
    if ($entries -notcontains 'COMMERCIAL-LICENSE.txt') { throw 'Commercial licence is missing.' }
    if ($entries -notcontains 'README.txt') { throw 'Commercial README is missing.' }
    $imageCount = @($entries | Where-Object { $_ -match '\.(jpg|jpeg|png|webp)$' }).Count
    if ($imageCount -ne 336) { throw "Expected 336 images, found $imageCount." }
}
finally {
    $check.Dispose()
}

Get-Item -LiteralPath $targetPath | Select-Object FullName, Length, LastWriteTime
