#!/bin/bash
# TempShop AWS EC2 Setup Script
# Run this on your EC2 instance after connecting via SSH

set -e

echo "🚀 Starting TempShop AWS Setup..."

# Update system
echo "📦 Updating system..."
sudo apt update && sudo apt upgrade -y

# Install Python 3.12
echo "🐍 Installing Python 3.12..."
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt install python3.12 python3.12-venv python3.12-dev -y

# Install Node.js
echo "📗 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Install MySQL
echo "🗄️ Installing MySQL..."
sudo apt install mysql-server -y

# Install Nginx
echo "🌐 Installing Nginx..."
sudo apt install nginx -y

# Install other tools
echo "🔧 Installing additional tools..."
sudo apt install git build-essential libssl-dev libffi-dev python3-pip -y

echo "✅ Base installation complete!"
echo ""
echo "Next steps:"
echo "1. Configure MySQL: sudo mysql_secure_installation"
echo "2. Clone your repository"
echo "3. Follow the deployment guide in Docs/AWS_DEPLOYMENT.md"
