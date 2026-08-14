Add-Type -AssemblyName System.Drawing

$src = "C:\Users\sonis\.gemini\antigravity-ide\brain\780ec397-9342-4dbc-ae42-0ca6f2d3998f\know_round_logo_1786687055681.jpg"
if (Test-Path $src) {
    $img = [System.Drawing.Image]::FromFile($src)
    $destDir = "c:\Users\sonis\Desktop\Focus\media\icons"
    if (-not (Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    }
    $p1 = Join-Path $destDir "know-icon.png"
    $p2 = Join-Path $destDir "dsa-focus-icon.png"
    
    $img.Save($p1, [System.Drawing.Imaging.ImageFormat]::Png)
    $img.Save($p2, [System.Drawing.Imaging.ImageFormat]::Png)
    $img.Dispose()
    Write-Output "Successfully saved $p1 and $p2"
} else {
    Write-Error "Source file not found: $src"
}
