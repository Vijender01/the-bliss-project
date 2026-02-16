# 🌐 Hosting Food Bliss on Nginx (Windows)

## Complete Step-by-Step Guide

---

## Phase 1: Prepare Your Production Build

### Step 1: Build the Project

Open PowerShell/Terminal in your project folder and run:

```bash
npm run build
```

**What happens:**
- ✅ Vite minifies and optimizes your code
- ✅ Creates `/dist` folder with production files
- ✅ File size is drastically reduced (~50KB instead of 500KB)

**You should see:**
```
✓ 42 modules transformed.
dist/index.html                   0.46 kB │ gzip: 0.31 kB
dist/assets/index-*.js           123.45 kB │ gzip: 42.34 kB
dist/assets/index-*.css            5.67 kB │ gzip: 1.23 kB
```

---

## Phase 2: Install & Configure Nginx

### Option A: Download Nginx

1. **Visit**: https://nginx.org/en/download.html
2. **Download**: `nginx/Windows` (Latest stable version)
3. **Extract** to: `C:\nginx`

### Option B: Quick Install (if you have chocolatey)

```powershell
choco install nginx
```

---

## Phase 3: Copy Your App to Nginx

### Step 1: Locate Nginx HTML Folder

Default location: `C:\nginx\html`

### Step 2: Backup Original Files (Optional)

```powershell
cd C:\nginx\html
# Save original files
Rename-Item index.html index.html.backup
```

### Step 3: Copy Your Production Build

**Method 1: Using PowerShell**
```powershell
Copy-Item -Path "E:\2026\food bliss attempt 2\dist\*" -Destination "C:\nginx\html" -Recurse -Force
```

**Method 2: Using File Explorer**
- Open `C:\nginx\html`
- Copy all files from `dist` folder
- Paste into `C:\nginx\html`

---

## Phase 4: Configure Nginx

### Step 1: Edit Nginx Configuration

Open: `C:\nginx\conf\nginx.conf`

**Find this block:**
```nginx
server {
    listen       80;
    server_name  localhost;

    #charset koi8-r;

    #access_log  logs/host.access.log  main;

    location / {
        root   html;
        index  index.html index.htm;
    }
```

**Replace with:**
```nginx
server {
    listen       80;
    server_name  _;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        root   html;
        index  index.html index.htm;
        # Important: For React Router to work with all URLs
        try_files $uri $uri/ /index.html;
    }

    # Cache busting for assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Don't cache HTML
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "public, must-revalidate, proxy-revalidate";
    }
}
```

**Save the file** (Ctrl+S)

---

## Phase 5: Start Nginx

### Method 1: Command Line

```powershell
cd C:\nginx
.\nginx.exe
```

**You should see:**
```
nginx entered master mode
```

### Method 2: Check if Running

```powershell
netstat -ano | findstr :80
```

If port 80 is in use, check what's using it.

---

## Phase 6: Test Locally

### On Your PC Browser

Open and test each URL:

1. **Localhost**:
   ```
   http://localhost/
   ```

2. **PC IP Address** (replace with yours):
   ```
   http://192.168.29.136/
   ```

3. **Local Network Name** (if configured):
   ```
   http://your-pc-name/
   ```

All should show your Food Bliss app!

---

## Phase 7: Access from Mobile

### On Your Mobile Device

1. **Connect to same WiFi as PC**

2. **Open any browser** (Chrome, Safari, Firefox, etc.)

3. **Type this URL**:
   ```
   http://192.168.29.136/
   ```
   (Use YOUR IP address from `ipconfig`)

4. **Press Enter** → Food Bliss app loads!

---

## 📱 Mobile Testing Checklist

✅ Mobile and PC on same WiFi network
✅ PC IP address correct (from `ipconfig`)
✅ Port 80 is accessible (check firewall)
✅ Nginx process is running
✅ `/dist` files copied to `C:\nginx\html`
✅ Browser address bar shows app loading

---

## 🔧 Nginx Commands

### Stop Nginx
```powershell
cd C:\nginx
.\nginx.exe -s stop
```

### Reload Config (after changes)
```powershell
cd C:\nginx
.\nginx.exe -s reload
```

### View Nginx Process
```powershell
Get-Process nginx
```

### Kill Nginx if Stuck
```powershell
Stop-Process -Name nginx -Force
```

---

## 🐛 Troubleshooting

### "Port 80 Already in Use"

Find what's using it:
```powershell
netstat -ano | findstr :80
```

Change Nginx to different port in `nginx.conf`:
```nginx
listen 8080;  # Change from 80 to 8080
```

Access at: `http://192.168.29.136:8080/`

### "Mobile can't reach the app"

1. **Verify IP**:
   ```powershell
   ipconfig
   ```

2. **Check Firewall**:
   - Windows Defender Firewall
   - Allow Nginx through firewall
   - Or temporarily disable for testing

3. **Test locally first**:
   ```
   http://localhost/
   ```

4. **Check Nginx running**:
   ```powershell
   Get-Process nginx
   ```

### "CSS/JS not loading on mobile"

**Solution**: Add this to Nginx config (already included above):
```nginx
try_files $uri $uri/ /index.html;
```

### "Page refreshes show 404 on routes"

**This is already fixed** in the config above with:
```nginx
try_files $uri $uri/ /index.html;
```

---

## 📊 Performance Optimization

Your Nginx config includes:

✅ **Gzip Compression** - Reduces file size by ~75%
✅ **Cache Control** - Fast asset loading
✅ **Asset Caching** - 1 year for static files
✅ **HTML Not Cached** - Always gets latest version

---

## 🔒 Security Notes

Current setup is for **local network only**.

For **public internet access**:
1. Forward port 80 on router
2. Use HTTPS (Let's Encrypt)
3. Set up domain name
4. Consider reverse proxy authentication

---

## 📈 Next Steps

### Monitor Nginx Logs

Access logs:
```
C:\nginx\logs\access.log
```

Error logs:
```
C:\nginx\logs\error.log
```

### Add More Features

When you're ready for Phase 2:
- Set up backend API
- Create proxy config in Nginx
- Update `.env` with API URL

---

## ✨ Summary

| Step | Action | Status |
|------|--------|--------|
| 1 | Build project | `npm run build` |
| 2 | Install Nginx | Download or chocolatey |
| 3 | Copy `/dist` files | To `C:\nginx\html` |
| 4 | Configure Nginx | Edit `nginx.conf` |
| 5 | Start Nginx | Run `nginx.exe` |
| 6 | Test localhost | `http://localhost/` |
| 7 | Test mobile | `http://192.168.x.x/` |

---

## 🎉 You're Live!

Your Food Bliss app is now **publicly accessible** from any device on your local network!

---

**Note:** Keep Nginx running in background while you want the app accessible.

To make it auto-start on boot (Advanced):
1. Create batch file to run `C:\nginx\nginx.exe`
2. Add to Windows Startup folder
3. Or use Task Scheduler

---

**Created**: February 16, 2026
**Project**: Food Bliss Phase 1
**Hosting**: Nginx on Windows
