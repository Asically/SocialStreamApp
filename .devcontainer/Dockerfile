FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-18

# Install necessary packages (for example, MongoDB, ffmpeg, etc.)
RUN sudo apt-get update \
    && sudo apt-get install -y ffmpeg \
    && sudo apt-get install -y mongodb \
    && sudo apt-get install -y build-essential \
    && sudo apt-get install -y npm # Added npm installation
