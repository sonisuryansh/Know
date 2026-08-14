Add-Type -AssemblyName System.Drawing

$uploadedFolder = "$env:USERPROFILE\.gemini\antigravity-ide\brain\780ec397-9342-4dbc-ae42-0ca6f2d3998f\.user_uploaded"
$srcFile = (Get-ChildItem -Path $uploadedFolder -Filter *.png | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName

if (-not $srcFile) {
    Write-Error "No uploaded PNG found"
    exit 1
}

Write-Output "Processing uploaded image: $srcFile"

$srcBitmap = [System.Drawing.Bitmap]::FromFile($srcFile)
$w = $srcBitmap.Width
$h = $srcBitmap.Height

# Output size: 512x512
$outSize = 512
$destBitmap = New-Object System.Drawing.Bitmap($outSize, $outSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [System.Drawing.Graphics]::FromImage($destBitmap)

$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.Clear([System.Drawing.Color]::Transparent)

# Create a circle clipping path
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddEllipse(2, 2, $outSize - 4, $outSize - 4)
$graphics.SetClip($path)

# Fill circle background with white/clean background matching the logo's inner background
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$graphics.FillEllipse($brush, 2, 2, $outSize - 4, $outSize - 4)

# Draw image centered inside the circular clipping path
# Let's crop slightly tighter on the central logo mark and text or full centered
$destRect = New-Object System.Drawing.Rectangle(0, 0, $outSize, $outSize)
$graphics.DrawImage($srcBitmap, $destRect, 0, 0, $w, $h, [System.Drawing.GraphicsUnit]::Pixel)

$graphics.ResetClip()

# Draw a subtle clean border
$pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(230, 230, 230), 2)
$graphics.DrawEllipse($pen, 2, 2, $outSize - 4, $outSize - 4)

$destDir = "c:\Users\sonis\Desktop\Focus\media\icons"
if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}

$destPathPng = Join-Path $destDir "know-icon.png"
$destPathDsa = Join-Path $destDir "dsa-focus-icon.png"

$destBitmap.Save($destPathPng, [System.Drawing.Imaging.ImageFormat]::Png)
$destBitmap.Save($destPathDsa, [System.Drawing.Imaging.ImageFormat]::Png)

$graphics.Dispose()
$destBitmap.Dispose()
$srcBitmap.Dispose()

Write-Output "Successfully created circular icon at $destPathPng and $destPathDsa"
