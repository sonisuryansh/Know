$destDir = "c:\Users\sonis\Desktop\Focus\docs\screenshots"
if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}
$src = "C:\Users\sonis\.gemini\antigravity-ide\brain\780ec397-9342-4dbc-ae42-0ca6f2d3998f\.user_uploaded\media_1786687908804.png"
Copy-Item $src (Join-Path $destDir "know-dashboard.png") -Force
Write-Output "Copied know-dashboard.png successfully"
