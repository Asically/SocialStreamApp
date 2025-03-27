#!/bin/bash
sudo apt update && sudo apt install -y bind9
sudo systemctl enable bind9
sudo systemctl start bind9
echo 'DNS Server Setup Completed!'
