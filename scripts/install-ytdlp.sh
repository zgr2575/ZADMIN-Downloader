#!/bin/bash

# Install yt-dlp script for various environments

echo "Installing yt-dlp..."

# Check if running on Linux/Unix
if command -v curl &> /dev/null; then
    # Download latest yt-dlp
    curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
    chmod a+rx /usr/local/bin/yt-dlp
    echo "yt-dlp installed successfully to /usr/local/bin/yt-dlp"
elif command -v wget &> /dev/null; then
    wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -O /usr/local/bin/yt-dlp
    chmod a+rx /usr/local/bin/yt-dlp
    echo "yt-dlp installed successfully to /usr/local/bin/yt-dlp"
else
    echo "Neither curl nor wget is available. Please install yt-dlp manually."
    echo "Visit: https://github.com/yt-dlp/yt-dlp#installation"
    exit 1
fi

# Verify installation
if command -v yt-dlp &> /dev/null; then
    echo "yt-dlp version: $(yt-dlp --version)"
else
    echo "Installation failed. Please install yt-dlp manually."
    exit 1
fi
