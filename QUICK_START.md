# 🚀 QUICK START - Food Bliss Phase 1

## ✅ Everything is Already Set Up!

Your development server is **RUNNING RIGHT NOW**.

---

## 📱 Open App on Your Mobile Device

### URL to Use:
```
http://192.168.29.136:5173/
```

**That's it!** Just type this in your mobile browser.

---

## 🔍 If That IP Doesn't Work

1. **Open PowerShell/CMD on your PC**
2. **Run this command**:
   ```powershell
   ipconfig
   ```
3. **Find "IPv4 Address"** (should look like `192.168.x.x`)
4. **Replace the IP in the URL** and try again

---

## 💻 Commands You'll Need

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Stop Development Server
Press `Ctrl+C` in the terminal

---

## 📁 Project Structure (What You Got)

```
src/
├── components/
│   ├── Header.jsx         ← App header (orange sticky bar)
│   └── MenuCard.jsx       ← Food item cards
├── pages/
│   └── Home.jsx           ← Main page with menu grid
├── layouts/
│   └── MainLayout.jsx     ← Layout wrapper
├── router/
│   └── AppRouter.jsx      ← Routing setup
├── data/
│   └── dummyMenu.js       ← 8 sample food items
├── App.jsx                ← Main component
├── main.jsx               ← Entry point
└── index.css              ← Tailwind CSS
```

---

## 🎨 What's Included

✅ 8 sample menu items ready to order
✅ Responsive layout (1→2→3 columns)
✅ Mobile-optimized (tested at 375px)
✅ Sticky header with app name
✅ Order buttons with feedback
✅ Tailwind CSS styling
✅ React Router configured
✅ Environment variables ready
✅ Axios installed for backend

---

## 📦 Menu Items

1. Paneer Parantha - ₹80
2. Aalu Parantha - ₹60
3. Poshtik Poha - ₹70
4. Thali Combo - ₹150
5. Chole Bhature - ₹120
6. Idli Sambar - ₹70
7. Dosa with Chutney - ₹90
8. Rajma Rice - ₹85

---

## 🌐 Next: Deploy on Nginx

1. **Build production version**:
   ```bash
   npm run build
   ```

2. **Copy `/dist` contents to Nginx HTML folder**

3. **Restart Nginx and access from mobile!**

---

## 📝 Files Created for You

- ✅ All React components
- ✅ All configuration files (Vite, Tailwind, PostCSS)
- ✅ package.json with all dependencies
- ✅ HTML entry point
- ✅ CSS with Tailwind
- ✅ Sample data file
- ✅ Full documentation

---

## 🎯 Phase 1 Status

**Status**: ✅ **COMPLETE & RUNNING**

- Server is running now
- Mobile access ready
- Build optimized
- Ready for Phase 2 (backend)

---

## ❓ Having Issues?

### App won't load on mobile?
- Make sure PC and mobile are on **same WiFi**
- Verify IP address with `ipconfig`
- Check Windows Firewall allows Node.js

### Server not running?
- Run `npm run dev` in terminal
- Should see "Local: http://localhost:5173/"

### Strange styling?
- Tailwind CSS should be working
- Reload mobile browser (Ctrl+R or swipe refresh)

---

**Ready? Open this URL on your mobile browser:**

# 📱 http://192.168.29.136:5173/

Enjoy! 🎉
