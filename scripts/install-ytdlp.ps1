# PowerShell script to install yt-dlp on Windows

Write-Host "Installing yt-dlp..." -ForegroundColor Green

# Create directory if it doesn't exist
$installPath = "$env:LOCALAPPDATA\Microsoft\WindowsApps"
if (-not (Test-Path $installPath)) {
    New-Item -ItemType Directory -Path $installPath -Force
}

# Download yt-dlp.exe
$ytdlpUrl = "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe"
$ytdlpPath = Join-Path $installPath "yt-dlp.exe"

try {
    Invoke-WebRequest -Uri $ytdlpUrl -OutFile $ytdlpPath
    Write-Host "yt-dlp installed successfully to $ytdlpPath" -ForegroundColor Green
    
    # Verify installation
    & $ytdlpPath --version
} catch {
    Write-Host "Installation failed: $_" -ForegroundColor Red
    Write-Host "Please install yt-dlp manually from: https://github.com/yt-dlp/yt-dlp#installation"
    exit 1
}
