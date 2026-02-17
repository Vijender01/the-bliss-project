# PRODUCTION DEPLOYMENT GUIDE — Food Bliss
# ==========================================
# Windows Self-Hosted | Nginx + PM2 + PostgreSQL

## Prerequisites

Install these on your Windows machine:

```powershell
# 1. Node.js 20 LTS (already installed)
node -v

# 2. PM2 (global)
npm install -g pm2

# 3. Nginx for Windows
# Download from: https://nginx.org/en/download.html
# Extract to: C:\nginx
```

---

## Step 1: Build Frontend

```powershell
cd "E:\2026\food bliss attempt 2"

# Build with production env
npm run build -- --mode production
```

This outputs static files to `dist/` folder.

---

## Step 2: Configure Backend for Production

```powershell
cd "E:\2026\food bliss attempt 2\backend"

# IMPORTANT: Edit .env.production and set a real JWT_SECRET
# Generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Run production migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

---

## Step 3: Start Backend with PM2

```powershell
cd "E:\2026\food bliss attempt 2\backend"

# Start with PM2
npm run pm2:start

# Verify it's running
pm2 status

# View logs
pm2 logs foodbliss-api

# Save process list (survives restart)
pm2 save
```

---

## Step 4: Setup Nginx

```powershell
# 1. Copy nginx.conf to your Nginx installation
Copy-Item "E:\2026\food bliss attempt 2\nginx.conf" "C:\nginx\conf\nginx.conf" -Force

# 2. EDIT the nginx.conf if your paths differ:
#    - root path to dist/ folder
#    - upstream backend port

# 3. Test configuration
C:\nginx\nginx.exe -t

# 4. Start Nginx
cd C:\nginx
start nginx
```

---

## Step 5: Verify Everything

```powershell
# Check backend health
Invoke-RestMethod -Uri 'http://localhost/api/health'

# Open in browser
Start-Process "http://localhost"
```

---

## Managing Services

### PM2 Commands
```powershell
pm2 status                    # Check status
pm2 restart foodbliss-api     # Restart backend
pm2 stop foodbliss-api        # Stop backend
pm2 logs foodbliss-api        # View logs
pm2 monit                     # Real-time monitor
```

### Nginx Commands (run from C:\nginx)
```powershell
nginx -s reload               # Reload config (no downtime)
nginx -s stop                 # Stop nginx
nginx -s quit                 # Graceful stop
nginx -t                      # Test config
```

---

## PM2 Auto-Start on Windows Boot

```powershell
# Install pm2-windows-startup
npm install -g pm2-windows-startup
pm2-startup install

# Save current process list
pm2 save
```

---

## Environment Variables — How They Work

### Frontend (.env.production)
```
VITE_API_URL=/api
```
- Only `VITE_` prefixed vars are bundled into the client JS
- Uses relative `/api` so Nginx proxies it to the backend
- **NEVER** put secrets here — they get baked into the JS bundle

### Backend (.env.production)
```
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-here"
PORT=5000
NODE_ENV="production"
CORS_ORIGIN="http://localhost"
```
- These stay on the server, never sent to client
- `JWT_SECRET` — MUST be changed to a strong random string
- `CORS_ORIGIN` — set to your domain when you have one

---

## Project Structure After Deploy

```
E:\2026\food bliss attempt 2\
├── dist/                          ← Built React app (served by Nginx)
│   ├── index.html
│   └── assets/
├── backend/
│   ├── src/server.js              ← Express API
│   ├── prisma/
│   ├── ecosystem.config.cjs       ← PM2 config
│   ├── .env.production            ← Backend secrets (NOT in git)
│   └── logs/                      ← PM2 log files
├── nginx.conf                     ← Copy to C:\nginx\conf\
├── .env.production                ← Frontend build env
└── src/                           ← React source (not needed in prod)
```

---

## Cloudflare Tunnel (Expose Publicly — Optional)

Cloudflare Tunnel lets you expose `localhost` to the internet without port forwarding.

### 1. Install cloudflared

```powershell
# Download from: https://github.com/cloudflare/cloudflared/releases
# Or via winget:
winget install Cloudflare.cloudflared
```

### 2. Create config file

Create `C:\Users\<YOU>\.cloudflared\config.yml`:

```yaml
tunnel: foodbliss
credentials-file: C:\Users\<YOU>\.cloudflared\<TUNNEL_ID>.json

ingress:
  - hostname: foodbliss.yourdomain.com
    service: http://localhost:80
  - service: http_status:404
```

### 3. Run the tunnel

```powershell
# Create tunnel (one time)
cloudflared tunnel create foodbliss

# Route DNS (one time — requires domain on Cloudflare)
cloudflared tunnel route dns foodbliss foodbliss.yourdomain.com

# Start tunnel
cloudflared tunnel run foodbliss
```

### 4. Install as Windows Service

```powershell
cloudflared service install
```

### 5. Update CORS for your domain

When your domain is ready, update `backend/.env.production`:

```
CORS_ORIGIN="https://foodbliss.yourdomain.com"
```

And update `nginx.conf`:

```nginx
server_name  foodbliss.yourdomain.com;
```

Then reload:
```powershell
pm2 restart foodbliss-api
cd C:\nginx && nginx -s reload
```

---

## Quick Start — All Commands (Copy-Paste)

```powershell
# === ONE-TIME SETUP ===
npm install -g pm2
npm install -g pm2-windows-startup
pm2-startup install

# === DEPLOY ===
cd "E:\2026\food bliss attempt 2"

# Build frontend
npm run build -- --mode production

# Start backend
cd backend
npx prisma migrate deploy
npx prisma generate
npm run pm2:start
pm2 save

# Start Nginx (after copying nginx.conf to C:\nginx\conf\)
cd C:\nginx
start nginx

# === VERIFY ===
pm2 status
Start-Process "http://localhost"
```
