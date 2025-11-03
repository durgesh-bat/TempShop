# 🔧 Fix SSH Connection Refused Error

## Problem
```
ssh: connect to host 13.233.119.214 port 22: Connection refused
```

---

## ✅ Solution Steps

### Step 1: Check Security Group Rules

1. Go to **AWS Console** → **EC2** → **Instances**
2. Select your instance
3. Click **Security** tab
4. Click on the **Security Group** link
5. Click **Edit inbound rules**
6. Ensure you have this rule:

```
Type: SSH
Protocol: TCP
Port: 22
Source: 0.0.0.0/0 (or Your IP)
```

7. Click **Save rules**

---

### Step 2: Check Instance State

1. Go to **EC2** → **Instances**
2. Verify instance state is **Running** (green)
3. Check **Status checks**: Should be **2/2 checks passed**
4. Wait 2-3 minutes after launch before connecting

---

### Step 3: Verify Key Pair

**Windows PowerShell:**
```powershell
# Check if key file exists
Test-Path "C:\Users\exeja\Desktop\TempShop\Amazon_conf\your-key.pem"

# Connect with correct path
ssh -i "C:\Users\exeja\Desktop\TempShop\Amazon_conf\your-key.pem" ubuntu@13.233.119.214
```

**If using different AMI, try different usernames:**
```powershell
# Ubuntu
ssh -i "your-key.pem" ubuntu@13.233.119.214

# Amazon Linux
ssh -i "your-key.pem" ec2-user@13.233.119.214

# Debian
ssh -i "your-key.pem" admin@13.233.119.214
```

---

### Step 4: Use EC2 Instance Connect (Browser-based)

1. Go to **EC2** → **Instances**
2. Select your instance
3. Click **Connect** button (top right)
4. Choose **EC2 Instance Connect** tab
5. Click **Connect**

This opens a browser-based terminal - no SSH key needed!

---

### Step 5: Check Network ACLs

1. Go to **VPC** → **Network ACLs**
2. Find the ACL for your subnet
3. Ensure **Inbound Rules** allow:
   - Rule: 100
   - Type: SSH (22)
   - Source: 0.0.0.0/0
   - Allow/Deny: ALLOW

---

### Step 6: Verify Public IP

1. Go to **EC2** → **Instances**
2. Check **Public IPv4 address** matches: `13.233.119.214`
3. If IP changed, use the new IP

---

## 🚀 Quick Fix Commands

### Windows PowerShell
```powershell
# Navigate to key directory
cd C:\Users\exeja\Desktop\TempShop\Amazon_conf

# Connect (replace with your actual key name)
ssh -i "tempshop-key.pem" ubuntu@13.233.119.214

# If permission error on Windows, no need to chmod
# Just ensure file is not corrupted
```

### Alternative: Use PuTTY (Windows)

1. **Download PuTTY:** https://www.putty.org/
2. **Convert .pem to .ppk:**
   - Open PuTTYgen
   - Load your .pem file
   - Save private key as .ppk
3. **Connect:**
   - Host: `ubuntu@13.233.119.214`
   - Port: `22`
   - Auth → Private key: Browse to .ppk file
   - Click Open

---

## 🔍 Diagnostic Commands

```powershell
# Test if port 22 is open
Test-NetConnection -ComputerName 13.233.119.214 -Port 22

# Ping instance (may not work if ICMP disabled)
ping 13.233.119.214

# Verbose SSH connection
ssh -vvv -i "your-key.pem" ubuntu@13.233.119.214
```

---

## ⚠️ Common Issues

### Issue 1: Wrong Username
**Error:** `Permission denied (publickey)`
**Fix:** Try `ec2-user` instead of `ubuntu`

### Issue 2: Wrong Key File
**Error:** `Permission denied (publickey)`
**Fix:** Ensure you're using the correct .pem file

### Issue 3: Instance Not Running
**Error:** `Connection refused`
**Fix:** Start the instance from AWS Console

### Issue 4: Security Group Not Updated
**Error:** `Connection timed out` or `Connection refused`
**Fix:** Add SSH rule to security group (see Step 1)

---

## ✅ Correct Security Group Configuration

### Inbound Rules (Minimum)
```
SSH         | TCP | 22   | 0.0.0.0/0
HTTP        | TCP | 80   | 0.0.0.0/0
HTTPS       | TCP | 443  | 0.0.0.0/0
Custom TCP  | TCP | 8000 | 0.0.0.0/0
```

### Outbound Rules
```
All traffic | All | All | 0.0.0.0/0
```

---

## 🎯 Step-by-Step Fix (Most Common)

1. **AWS Console** → **EC2** → **Security Groups**
2. Find security group attached to your instance
3. **Inbound rules** → **Edit inbound rules**
4. **Add rule:**
   - Type: SSH
   - Source: My IP (or 0.0.0.0/0)
5. **Save rules**
6. Wait 30 seconds
7. Try connecting again:
   ```powershell
   ssh -i "your-key.pem" ubuntu@13.233.119.214
   ```

---

## 📞 Still Not Working?

### Option 1: Use EC2 Instance Connect
- No SSH key needed
- Works from browser
- See Step 4 above

### Option 2: Check System Log
1. **EC2** → **Instances** → Select instance
2. **Actions** → **Monitor and troubleshoot** → **Get system log**
3. Look for SSH service errors

### Option 3: Reboot Instance
1. **EC2** → **Instances** → Select instance
2. **Instance state** → **Reboot instance**
3. Wait 2 minutes
4. Try connecting again

---

## 🔐 After Successful Connection

```bash
# Update system
sudo apt update

# Check SSH service
sudo systemctl status ssh

# View SSH logs
sudo tail -f /var/log/auth.log
```

---

**✅ Once connected, continue with the deployment guide!**
