# Food Bliss - Phase 1 Setup Guide

## ✅ Project Status: READY FOR PRODUCTION PHASE-1

Your Food Bliss web application is fully set up and running!

---

## 📋 Complete Project Checklist

✅ React + Vite frontend created
✅ Tailwind CSS integrated
✅ React Router configured
✅ Component structure set up
✅ Dummy menu data created (8 items)
✅ Mobile responsive layout (375px+)
✅ Header component with sticky positioning
✅ Menu card component with order buttons
✅ Home page with responsive grid
✅ Environment file support (.env)
✅ Axios installed (ready for backend)
✅ Development server running
✅ Production build configured

---

## 🚀 Quick Start Commands

### Install (Already Done ✓)
```bash
npm install
```

### Development Server (CURRENTLY RUNNING)
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## 📱 How to Access from Your Mobile Device

### Current Network Info:
- **Your PC IP Address**: `192.168.29.136`
- **Port**: `5173`
- **Full URL**: `http://192.168.29.136:5173/`

### Steps to Open on Mobile:

1. **Make sure your mobile and PC are on the same WiFi network**

2. **On your mobile device, open any browser** (Chrome, Safari, Firefox, etc.)

3. **Type in the address bar**:
   ```
   http://192.168.29.136:5173/
   ```
   (Or use your actual IP address if it's different)

4. **Press Enter and the app will load!**

### To Find Your PC IP Address Anytime:

**Windows (PowerShell/CMD):**
```powershell
ipconfig
```
Look for "IPv4 Address" - usually looks like `192.168.x.x` or `10.0.x.x`

---

## 📁 Complete Project Structure

```
food bliss attempt 2/
│
├── src/                          # Source code
│   ├── components/
│   │   ├── Header.jsx           # App header (sticky orange bar)
│   │   └── MenuCard.jsx         # Food item card component
│   │
│   ├── pages/
│   │   └── Home.jsx             # Main home page with menu grid
│   │
│   ├── layouts/
│   │   └── MainLayout.jsx       # Main layout wrapper
│   │
│   ├── router/
│   │   └── AppRouter.jsx        # React Router configuration
│   │
│   ├── data/
│   │   └── dummyMenu.js         # Sample menu items (8 items)
│   │
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # React entry point
│   └── index.css                # Tailwind CSS + custom styles
│
├── Config Files
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # Tailwind CSS config
│   ├── postcss.config.js        # PostCSS config
│   ├── package.json             # Dependencies
│   ├── package-lock.json        # Dependency lock
│   └── .env                     # Environment variables
│
├── Root Files
│   ├── index.html               # HTML entry point
│   ├── README.md                # Project documentation
│   ├── .gitignore               # Git ignore file
│   └── SETUP_COMPLETE.md        # This file
│
└── node_modules/                # Dependencies (203 packages)
```

---

## 🎯 Features Implemented

### ✅ Home Page
- Displays all 8 menu items in responsive grid
- 1 column on mobile (< 640px)
- 2 columns on tablet (640px - 1024px)
- 3 columns on desktop (> 1024px)
- Hero section with app branding
- Menu count display

### ✅ Menu Card Component
- Food name and description
- Price in Indian Rupees (₹)
- Emoji icon as placeholder image
- "Order Now" button with click feedback
- Hover effects and smooth transitions
- Mobile-optimized touch targets

### ✅ Header Component
- Sticky positioning (stays at top while scrolling)
- App title "Food Bliss" with emoji icon
- Responsive padding on mobile
- Orange color scheme (#f97316)

### ✅ Sample Menu Data
1. Paneer Parantha - ₹80
2. Aalu Parantha - ₹60
3. Poshtik Poha - ₹70
4. Thali Combo - ₹150
5. Chole Bhature - ₹120
6. Idli Sambar - ₹70
7. Dosa with Chutney - ₹90
8. Rajma Rice - ₹85

---

## 🛠 Technology Stack Installed

```json
Dependencies:
- react@^18.2.0
- react-dom@^18.2.0
- react-router-dom@^6.20.0
- axios@^1.6.2

Dev Dependencies:
- vite@^5.0.0
- @vitejs/plugin-react@^4.2.0
- tailwindcss@^3.3.6
- postcss@^8.4.31
- autoprefixer@^10.4.16
```

---

## 💡 Using the App

### View Menu
- The home page loads automatically
- Scroll through all available food items
- Each card shows name, description, price, and order button

### Place Order (Phase 1)
- Click "Order Now" button
- You'll see an alert message
- Note: Full cart & checkout coming in Phase 2

### Responsive Testing
- **Mobile (375px)**: Single column layout
- **Tablet (768px)**: Two column layout
- **Desktop (1024px+)**: Three column layout

---

## 🔧 Environment Variables

File: `.env`

```
VITE_API_URL=http://localhost:3000
```

**Access in code:**
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 📦 Building for Production

### Step 1: Create Production Build
```bash
npm run build
```

This generates a `/dist` folder with optimized files.

### Step 2: What's in /dist
- Minified JavaScript
- Optimized CSS
- HTML bundle
- All assets ready for hosting

### Step 3: Files Ready for Nginx
Copy everything in `/dist` to your Nginx web root folder.

---

## 🌐 Nginx Hosting Setup (Windows)

### Prerequisites
- Nginx installed on Windows
- Nginx folder (e.g., `C:\nginx`)

### Steps to Host

1. **Build the project** (from your project folder):
```bash
npm run build
```

2. **Locate Nginx HTML directory**:
```
C:\nginx\html\
```

3. **Copy dist contents** to `C:\nginx\html\`:
```powershell
Copy-Item -Path "dist\*" -Destination "C:\nginx\html" -Recurse -Force
```

4. **Edit Nginx config** (`C:\nginx\conf\nginx.conf`):
```nginx
server {
    listen       80;
    server_name  _;
    
    location / {
        root   html;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}
```

5. **Start Nginx**:
```bash
cd C:\nginx
.\nginx.exe
```

6. **Access from mobile**:
```
http://192.168.29.136/
```

---

## 🐛 Troubleshooting

### Mobile can't connect to app

1. **Check if dev server is running**:
   - Should see "Local: http://localhost:5173" in terminal
   - If not, run `npm run dev`

2. **Verify IP address**:
   ```powershell
   ipconfig
   ```
   - Get your IPv4 address (usually 192.168.x.x)

3. **Check WiFi connection**:
   - Mobile must be on same WiFi as PC
   - Not mobile hotspot, must be same network

4. **Firewall settings**:
   - Windows Firewall might block port 5173
   - Check Windows Defender Firewall settings
   - Allow Node.js through firewall

5. **Try with localhost first**:
   ```
   http://localhost:5173/
   ```
   - If this works on PC but not mobile, it's a network issue

---

## 📝 Next Steps (Phase 2)

- [ ] Backend API integration (Node.js/Express)
- [ ] Shopping cart functionality
- [ ] User authentication (login/signup)
- [ ] Payment gateway (Stripe/Razorpay)
- [ ] Order tracking
- [ ] User dashboard
- [ ] Admin panel
- [ ] Database (MongoDB/PostgreSQL)

---

## 💻 Development Workflow

### During Development
```bash
npm run dev
```
- App reloads automatically on file changes
- Tailwind CSS updates in real-time
- Open http://localhost:5173 or use IP for mobile testing

### Before Deployment
```bash
npm run build
```
- Minifies code
- Optimizes bundle size
- Creates `/dist` folder

### Testing Production Build Locally
```bash
npm run preview
```
- Serves the production build locally
- Test at http://localhost:4173

---

## 📞 Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Create production bundle |
| `npm run preview` | Test production build locally |
| `npm install` | Install dependencies |
| `npm audit fix` | Fix security vulnerabilities |

---

## ✨ Key Features Summary

✅ **Mobile-First Design** - Optimized for 375px width
✅ **Responsive Grid** - Auto layout from 1→2→3 columns
✅ **Sticky Header** - Always accessible navigation
✅ **Lightweight** - No heavy dependencies
✅ **Production Ready** - Optimized build included
✅ **Free & Open** - No paid services needed
✅ **Scalable Structure** - Ready for Phase 2 features

---

## 📖 Documentation Links

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [React Router Documentation](https://reactrouter.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Axios Documentation](https://axios-http.com)

---

## 🎉 Phase 1 Complete!

Your food ordering web application **Phase 1** is complete and ready for:
- ✅ Testing on mobile devices
- ✅ Deployment on Nginx
- ✅ Adding more menu items
- ✅ Integration with Phase 2 backend

**Current Status**: Development server running at `http://192.168.29.136:5173/`

**Next Action**: Open the URL on your mobile device to test the app!

---

**Created**: February 16, 2026
**Project**: Food Bliss - Phase 1
**Status**: ✅ Production Ready
