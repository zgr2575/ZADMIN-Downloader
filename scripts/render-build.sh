#!/bin/bash

# Build script for Render deployment
# This script installs yt-dlp using pip and then builds the Next.js app

echo "Installing yt-dlp via pip..."

# Install Python dependencies
# Use pip3 with --user flag for user-level installation
pip3 install --user yt-dlp

# Verify installation
if command -v yt-dlp &> /dev/null; then
    echo "yt-dlp installed successfully: $(yt-dlp --version)"
else
    echo "Warning: yt-dlp installation may have failed, but continuing..."
fi

# Build the Next.js application
echo "Building Next.js application..."
npm run build

echo "Build complete!"
