# Cloudflare Tunnel Setup — Food Bliss
# =====================================

## Current Status: LIVE ✅

Quick Tunnel running:
- Public URL: https://explaining-salad-sharp-str.trycloudflare.com
- Proxies to: http://localhost:80 (Nginx)
- HTTPS: Automatic via Cloudflare
- Your real IP: Hidden

## Quick Tunnel Process

The quick tunnel is running as process ID 21908.
To stop it: `Stop-Process -Id 21908`
To restart it:
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
Start-Process -FilePath "cloudflared" -ArgumentList "tunnel","--url","http://localhost:80" -RedirectStandardError "E:\2026\food bliss attempt 2\tunnel.log" -NoNewWindow
# Wait 15 seconds then read the URL:
Start-Sleep -Seconds 15
(Get-Content "E:\2026\food bliss attempt 2\tunnel.log" -Raw) -match 'https://[a-z0-9-]+\.trycloudflare\.com'
$matches[0]
```

NOTE: Quick Tunnel gives a RANDOM URL each time you restart.

---

## Upgrade to Named Tunnel (Permanent URL + Custom Domain)

When you're ready for a permanent setup with a custom domain:

### Step 1: Login to Cloudflare
```powershell
cloudflared tunnel login
```
This opens a browser. Login to your Cloudflare account and authorize.
Credentials saved to: `C:\Users\CIPL-LT-46\.cloudflared\cert.pem`

### Step 2: Create Named Tunnel
```powershell
cloudflared tunnel create foodbliss-tunnel
```
Note the Tunnel ID printed (e.g., `a1b2c3d4-...`).
Credentials file created at: `C:\Users\CIPL-LT-46\.cloudflared\<TUNNEL_ID>.json`

### Step 3: Create config.yml
Create file: `C:\Users\CIPL-LT-46\.cloudflared\config.yml`

```yaml
tunnel: foodbliss-tunnel
credentials-file: C:\Users\CIPL-LT-46\.cloudflared\<TUNNEL_ID>.json

ingress:
  - hostname: foodbliss.yourdomain.com
    service: http://localhost:80
    originRequest:
      noTLSVerify: true
  - service: http_status:404
```

Replace:
- `<TUNNEL_ID>` with the actual tunnel ID from Step 2
- `foodbliss.yourdomain.com` with your actual domain

### Step 4: Route DNS
```powershell
cloudflared tunnel route dns foodbliss-tunnel foodbliss.yourdomain.com
```

### Step 5: Run Named Tunnel
```powershell
cloudflared tunnel run foodbliss-tunnel
```

### Step 6: Install as Windows Service (Auto-Start on Boot)
```powershell
cloudflared service install
net start cloudflared
```

To uninstall:
```powershell
net stop cloudflared
cloudflared service uninstall
```

---

## Security Architecture

```
Internet Users
     │
     ▼ (HTTPS - Cloudflare Edge)
Cloudflare Tunnel (encrypted)
     │
     ▼ (localhost:80 only)
   Nginx
     ├── /         → React Static Files (dist/)
     └── /api/*    → Express Backend (localhost:5000)
                         └── PostgreSQL (localhost:5432)
```

✅ Only port 80 exposed via tunnel (to localhost only)
✅ Port 5000 (backend) NOT exposed — behind Nginx proxy
✅ Port 5432 (database) NOT exposed
✅ Real server IP hidden by Cloudflare
✅ HTTPS handled automatically by Cloudflare edge
✅ No router port forwarding needed

---

## Verification Commands

```powershell
# Check tunnel process is running
Get-Process cloudflared

# Check Nginx is running
Get-Process nginx

# Check PM2 backend is running
pm2 status

# Test public API
Invoke-RestMethod -Uri 'https://YOUR-URL.trycloudflare.com/api/health'

# Test public login
Invoke-RestMethod -Uri 'https://YOUR-URL.trycloudflare.com/api/auth/login' -Method POST -ContentType 'application/json' -Body '{"email":"admin@foodbliss.com","password":"Admin@123"}'
```
