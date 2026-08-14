try {
    $res = Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/sonisuryansh/Know/main/media/icon.png' -Method Head -TimeoutSec 10
    Write-Output "HTTP Status: $($res.StatusCode)"
} catch {
    Write-Output "Error fetching image: $_"
}

try {
    $res2 = Invoke-WebRequest -Uri 'https://github.com/sonisuryansh/Know' -Method Head -TimeoutSec 10
    Write-Output "GitHub Repo Status: $($res2.StatusCode)"
} catch {
    Write-Output "Error fetching repo: $_"
}
