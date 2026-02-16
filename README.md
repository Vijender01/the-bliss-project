# Food Bliss - Phase 1

A mobile-first food ordering web application built with React + Vite.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm installed
- Windows, Mac, or Linux

### Installation

1. **Install Dependencies**
```bash
npm install
```

### Development

2. **Start Development Server**
```bash
npm run dev
```

The app will start at `http://localhost:5173`

### Testing on Mobile Device

3. **Find Your PC IP Address**

**On Windows (PowerShell/CMD):**
```cmd
ipconfig
```
Look for "IPv4 Address" under your network adapter (e.g., `192.168.x.x`)

4. **Open App on Mobile**

On your mobile device's browser, go to:
```
http://<YOUR_PC_IP>:5173
```

Example: `http://192.168.1.100:5173`

### Production Build

5. **Build for Production**
```bash
npm run build
```

This creates a `/dist` folder with optimized files ready for hosting.

6. **Preview Build Locally**
```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/           # Reusable React components
│   ├── Header.jsx       # App header with title
│   └── MenuCard.jsx     # Menu item card component
├── pages/               # Page components
│   └── Home.jsx         # Home page with menu grid
├── layouts/             # Layout wrappers
│   └── MainLayout.jsx   # Main layout with header
├── router/              # Routing configuration
│   └── AppRouter.jsx    # React Router setup
├── data/                # Static data
│   └── dummyMenu.js     # Sample menu items
├── App.jsx              # Main app component
├── main.jsx             # React entry point
└── index.css            # Tailwind + custom styles

Config files:
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS config
├── postcss.config.js    # PostCSS config
├── package.json         # Dependencies
└── index.html           # HTML entry point
```

## 🎨 Features

✅ Responsive mobile-first design (optimized for 375px width)
✅ Food menu with 8 sample items
✅ Order Now buttons (alert feedback for Phase 1)
✅ Sticky header with app branding
✅ Tailwind CSS for styling
✅ React Router for navigation
✅ Axios ready for backend integration
✅ Environment variables support
✅ Production build ready

## 🛠 Technology Stack

- **React 18** - UI library
- **Vite** - Build tool
- **React Router 6** - Client routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client (installed, ready for Phase 2)
- **PostCSS** - CSS processing

## 🔄 Next Steps (Phase 2+)

- Backend API integration using Axios
- Shopping cart functionality
- User authentication
- Payment gateway integration
- Order tracking
- Admin dashboard

## 📱 Mobile Responsive Breakpoints

- **Mobile**: 1 column (< 640px)
- **Tablet**: 2 columns (640px - 1024px)
- **Desktop**: 3 columns (> 1024px)

## 🌐 Hosting Instructions

### For Self-Hosting with Nginx (Windows):

1. Build the project:
```bash
npm run build
```

2. Copy `/dist` folder contents to Nginx web root

3. Configure Nginx to serve the app and set up a reverse proxy

4. Make your PC accessible from mobile via IP address

## 📝 Environment Variables

Create `.env` file in root:
```
VITE_API_URL=http://localhost:3000
```

Access in your code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## ✨ Notes

- No backend required for Phase 1
- All styling uses Tailwind CSS
- No third-party UI library dependencies (except React)
- Lightweight and fast on mobile
- Ready for Nginx hosting

---

**Phase 1 Complete!** Ready for Phase 2 backend integration.
