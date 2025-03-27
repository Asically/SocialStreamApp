#!/bin/bash

# Ensure the /home/codespace/.config/vscode-dev-containers directory exists
mkdir -p /home/codespace/.config/vscode-dev-containers

# Check if the directory was created successfully
if [ $? -ne 0 ]; then
    echo "Failed to create directory. Trying with sudo..."
    sudo mkdir -p /home/codespace/.config/vscode-dev-containers
fi

# Create the first-run-notice-already-displayed file
touch /home/codespace/.config/vscode-dev-containers/first-run-notice-already-displayed

# Check if the file was created successfully
if [ $? -ne 0 ]; then
    echo "Failed to create file. Trying with sudo..."
    sudo touch /home/codespace/.config/vscode-dev-containers/first-run-notice-already-displayed
fi

# Set appropriate permissions
sudo chown -R $(whoami):$(whoami) /home/codespace/.config
