#!/bin/bash

# Install Node.js and npm using NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
    echo "Node.js and npm installed successfully."
else
    echo "Failed to install Node.js and npm."
    exit 1
fi

# Add npm to PATH if not already present
if ! echo "$PATH" | grep -q "$(npm bin -g)"; then
    export PATH=$PATH:$(npm bin -g)
    echo 'export PATH=$PATH:$(npm bin -g)' >> ~/.bashrc
    source ~/.bashrc
    echo "npm added to PATH."
fi
