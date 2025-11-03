# 🚀 AWS EC2 Deployment Guide - TempShop

Complete guide to deploy TempShop on Amazon EC2.

---

## 📋 Prerequisites

- AWS Account
- Domain name (optional)
- SSH client

---

## 🖥️ Step 1: Launch EC2 Instance

### 1.1 Create Instance
1. Go to **AWS Console** → **EC2** → **Launch Instance**
2. **Name:** `tempshop-server`
3. **AMI:** Ubuntu Server 22.04 LTS (Free tier eligible)
4. **Instance Type:** `t2.medium` (2 vCPU, 4GB RAM) or `t3.medium`
5. **Key Pair:** Create new or use existing (download `.pem` file)
6. **Network Settings:**
   - Allow SSH (port 22)
   - Allow HTTP (port 80)
   - Allow HTTPS (port 443)
   - Allow Custom TCP (port 8000) - Django
   - Allow Custom TCP (port 5173) - React Dev (optional)

### 1.2 Configure Storage
- **Size:** 20-30 GB (minimum)
- **Type:** gp3 (General Purpose SSD)

### 1.3 Launch Instance
Click **Launch Instance** and wait for it to start.

---

## 🔐 Step 2: Connect to EC2

### Windows (PowerShell/CMD)
```bash
ssh -i "your-key.pem" ubuntu@your-ec2-public-ip
```

### Mac/Linux
```bash
chmod 400 your-key.pem
ssh -i "your-key.pem" ubuntu@your-ec2-public-ip
```

---

## 📦 Step 3: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python 3.12
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt install python3.12 python3.12-venv python3.12-dev -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Install MySQL
sudo apt install mysql-server -y

# Install Nginx
sudo apt install nginx -y

# Install Git
sudo apt install git -y

# Install other tools
sudo apt install build-essential libssl-dev libffi-dev python3-pip -y
```

---

## 🗄️ Step 4: Configure MySQL

```bash
# Secure MySQL
sudo mysql_secure_installation

# Login to MySQL
sudo mysql

# Create database and user
CREATE DATABASE tempshop_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'tempshop_user'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON tempshop_db.* TO 'tempshop_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 📂 Step 5: Deploy Application

```bash
# Clone repository
cd /home/ubuntu
git clone <your-repo-url> TempShop
cd TempShop

# Create virtual environment
python3.12 -m venv .venv
source .venv/bin/activate

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn

# Create .env file
nano .env
```

### .env Configuration
```env
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-domain.com,your-ec2-ip

# Database
DB_NAME=tempshop_db
DB_USER=tempshop_user
DB_PASSWORD=your_strong_password
DB_HOST=localhost
DB_PORT=3306

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Brevo)
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_HOST_USER=your_email
EMAIL_HOST_PASSWORD=your_password
DEFAULT_FROM_EMAIL=noreply@yourdomain.com
```

```bash
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput

# Seed database (optional)
python manage.py seed
```

---

## 🔧 Step 6: Configure Gunicorn

```bash
# Create Gunicorn service
sudo nano /etc/systemd/system/gunicorn.service
```

```ini
[Unit]
Description=Gunicorn daemon for TempShop
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/TempShop
Environment="PATH=/home/ubuntu/TempShop/.venv/bin"
ExecStart=/home/ubuntu/TempShop/.venv/bin/gunicorn \
    --workers 3 \
    --bind 0.0.0.0:8000 \
    server.wsgi:application

[Install]
WantedBy=multi-user.target
```

```bash
# Start Gunicorn
sudo systemctl start gunicorn
sudo systemctl enable gunicorn
sudo systemctl status gunicorn
```

---

## 🌐 Step 7: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/tempshop
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    client_max_body_size 10M;

    location /static/ {
        alias /home/ubuntu/TempShop/staticfiles/;
    }

    location /media/ {
        alias /home/ubuntu/TempShop/media/;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/tempshop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 Step 8: Setup SSL (HTTPS)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal (already configured)
sudo certbot renew --dry-run
```

---

## 🎨 Step 9: Deploy Frontend (Optional - Production Build)

```bash
cd /home/ubuntu/TempShop/frontend

# Install dependencies
npm install

# Build for production
npm run build

# Serve with Nginx
sudo nano /etc/nginx/sites-available/tempshop-frontend
```

```nginx
server {
    listen 80;
    server_name frontend.your-domain.com;

    root /home/ubuntu/TempShop/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/tempshop-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔄 Step 10: Setup Auto-Deployment (Optional)

```bash
# Create deployment script
nano /home/ubuntu/deploy.sh
```

```bash
#!/bin/bash
cd /home/ubuntu/TempShop
git pull origin main
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart gunicorn
sudo systemctl restart nginx
echo "Deployment completed!"
```

```bash
chmod +x /home/ubuntu/deploy.sh
```

---

## 📊 Step 11: Monitoring & Logs

```bash
# View Gunicorn logs
sudo journalctl -u gunicorn -f

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# View Django logs
tail -f /home/ubuntu/TempShop/logs/django.log
```

---

## 🛡️ Step 12: Security Hardening

```bash
# Setup firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Disable root login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart sshd

# Setup fail2ban
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 💰 Cost Estimation

### EC2 Instance (t2.medium)
- **Instance:** ~$30/month
- **Storage (30GB):** ~$3/month
- **Data Transfer:** ~$9/month (1TB)
- **Total:** ~$42/month

### Alternative: t3.micro (Free Tier)
- **Instance:** Free for 12 months
- **Storage (20GB):** ~$2/month
- **Total:** ~$2/month (first year)

---

## 🔧 Troubleshooting

### Gunicorn not starting
```bash
sudo journalctl -u gunicorn -n 50
sudo systemctl restart gunicorn
```

### Nginx 502 Bad Gateway
```bash
sudo systemctl status gunicorn
sudo tail -f /var/log/nginx/error.log
```

### Database connection error
```bash
sudo systemctl status mysql
mysql -u tempshop_user -p tempshop_db
```

### Static files not loading
```bash
python manage.py collectstatic --noinput
sudo systemctl restart nginx
```

---

## 📱 Flutter App Configuration

Update Flutter API endpoint:

```dart
// lib/config/api_config.dart
class ApiConfig {
  static const String baseUrl = 'https://your-domain.com/api';
  static const String authBaseUrl = 'https://your-domain.com/api/auth';
}
```

---

## 🚀 Quick Commands

```bash
# Restart services
sudo systemctl restart gunicorn nginx

# Update code
cd /home/ubuntu/TempShop && git pull && sudo systemctl restart gunicorn

# View logs
sudo journalctl -u gunicorn -f

# Check status
sudo systemctl status gunicorn nginx mysql
```

---

## 📞 Support

For issues:
1. Check logs: `sudo journalctl -u gunicorn -f`
2. Verify services: `sudo systemctl status gunicorn nginx`
3. Test connectivity: `curl http://localhost:8000`

---

**🎉 Your TempShop is now live on AWS!**
