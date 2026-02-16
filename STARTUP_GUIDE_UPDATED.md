# 🚀 FOOD BLISS - STARTUP GUIDE (UPDATED)

**Last Updated**: February 16, 2026
**Status**: ✅ Working & Tested

---

## ⚡ QUICK START

### Open App on Mobile:
```
http://192.168.29.136:5173/
```

That's it! The server is already running.

---

## 🛠 SERVER SETUP COMMANDS

### For Production/Testing (Currently Running):
```powershell
http-server dist -p 5173 -a 0.0.0.0 --gzip
```

### For Development (With Hot Reload):
```powershell
npm run dev
```

---

## 📱 ACCESSING THE APP

### From Mobile (WiFi):
```
http://192.168.29.136:5173/
```

### From PC (Local):
```
http://localhost:5173/
```

### Requirements:
- ✅ Mobile on same WiFi as PC
- ✅ Windows Firewall rules added (already done)
- ✅ Port 5173 accessible (verified)

---

## 🔄 SWITCHING BETWEEN SERVERS

### Currently Running:
**http-server** (production build serving)

### To Switch to Dev Server:
1. Stop http-server: Press `Ctrl+C` in terminal
2. Start npm dev:
   ```powershell
   npm run dev
   ```
3. Now you have hot reload while developing

### To Go Back to HTTP Server:
1. Stop npm: Press `Ctrl+C`
2. Run:
   ```powershell
   npm run build
   http-server dist -p 5173 -a 0.0.0.0 --gzip
   ```

---

## 📋 COMPLETE WORKFLOW

### Step 1: Build the App
```powershell
npm run build
```
Creates `/dist` folder with optimized files.

### Step 2: Serve the Files
**Option A** (Production - Currently Running):
```powershell
http-server dist -p 5173 -a 0.0.0.0 --gzip
```

**Option B** (Development):
```powershell
npm run dev
```

### Step 3: Access from Mobile
```
http://192.168.29.136:5173/
```

---

## 🎯 WHAT'S INCLUDED

### Components:
- ✅ Header (sticky, orange)
- ✅ MenuCard (reusable)
- ✅ Home page (responsive grid)
- ✅ React Router setup
- ✅ Tailwind CSS styling

### Features:
- ✅ 8 menu items
- ✅ Responsive layout (1/2/3 columns)
- ✅ Order buttons
- ✅ Mobile-first design
- ✅ Production optimized

### Tech Stack:
- React 18.2.0
- Vite 5.0.0
- Tailwind CSS 3.3.6
- React Router 6.20.0
- Axios 1.6.2

---

## 🌐 DEPLOYMENT OPTIONS

### Option 1: Keep Using HTTP Server
```powershell
http-server dist -p 5173 -a 0.0.0.0
```
✅ Perfect for local testing and simple sharing

### Option 2: Deploy on Nginx
```powershell
npm run build
# Copy /dist contents to C:\nginx\html\
# Restart nginx
```
✅ For production-grade hosting

### Option 3: Deploy to Cloud
```powershell
npm run build
# Deploy /dist folder to any web hosting
```
✅ For public internet access

---

## 📝 KEY FILES

### Source Code:
- `src/App.jsx` - Main component
- `src/pages/Home.jsx` - Home page
- `src/components/Header.jsx` - Header
- `src/components/MenuCard.jsx` - Menu item card
- `src/data/dummyMenu.js` - 8 sample items

### Configuration:
- `vite.config.js` - Vite config
- `tailwind.config.js` - Tailwind config
- `package.json` - Dependencies
- `.env` - Environment variables

### Output:
- `dist/` - Production build (created by `npm run build`)
- `node_modules/` - Dependencies

---

## 🔒 Firewall Status

✅ **Firewall Rules Added**:
- Rule: "Vite Dev Server (Port 5173)"
- Status: Enabled
- Direction: Inbound
- Port: 5173
- Protocol: TCP
- Action: Allow

---

## 🧪 TESTING COMMANDS

### Check if server is running:
```powershell
netstat -ano | Select-String "5173"
```

### Test connection:
```powershell
Test-NetConnection -ComputerName 192.168.29.136 -Port 5173
```

### View server logs:
Open the terminal running the server and watch the logs.

---

## 🚀 MOBILE BROWSER TIPS

### Chrome on Android:
1. Tap address bar
2. Type: `http://192.168.29.136:5173/`
3. Press Enter
4. Wait 2-3 seconds

### Safari on iOS:
1. Tap address bar
2. Type: `http://192.168.29.136:5173/`
3. Tap Go
4. Wait 2-3 seconds

### Firefox Mobile:
1. Tap address bar
2. Type: `http://192.168.29.136:5173/`
3. Tap search/go
4. Wait 2-3 seconds

---

## 🎨 CUSTOMIZATION

### Change Menu Items:
Edit: `src/data/dummyMenu.js`
Then rebuild: `npm run build`

### Change Styling:
Edit: `src/index.css` or Tailwind classes in components
Then rebuild: `npm run build`

### Add New Pages:
1. Create: `src/pages/NewPage.jsx`
2. Add route: `src/router/AppRouter.jsx`
3. Rebuild: `npm run build`

---

## 📞 QUICK HELP

| Issue | Solution |
|-------|----------|
| "Site cannot be reached" | Firewall rules added already ✅ |
| "Connection refused" | Start http-server or npm dev |
| "Page blank" | Hard refresh on mobile, clear cache |
| "Slow loading" | Expected on first load, then cached |
| "Want to modify code" | Use `npm run dev` instead |

---

## ✨ SUMMARY

1. **Currently**: Using `http-server` on port 5173
2. **Access**: `http://192.168.29.136:5173/`
3. **Status**: ✅ Working
4. **Ready for**: Mobile testing, deployment

---

**Happy coding with Food Bliss!** 🍛

**Next Steps**:
1. Open app on mobile
2. Test features
3. Customize as needed
4. Deploy when ready

---

**Server**: http-server
**Port**: 5173
**Status**: ✅ Running
