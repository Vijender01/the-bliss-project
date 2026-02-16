# 📱 Food Bliss - Phone Testing Guide

## ✅ System Status

Both servers are now running and configured for phone access!

| Component | Address | Status | Purpose |
|-----------|---------|--------|---------|
| **Frontend** | `http://192.168.29.136:5174` | ✅ Running | Mobile app UI |
| **Backend API** | `http://192.168.29.136:5000/api` | ✅ Running | Authentication, Menu, Cart, Orders |
| **Database** | PostgreSQL (localhost:5432) | ✅ Connected | 8 menu items seeded |

---

## 🚀 Access on Your Phone

### Open in Browser:
```
http://192.168.29.136:5174
```

---

## 📋 What to Test

### 1️⃣ **Sign Up** (Phase 2)
- Tap on Sign Up or Register link
- Fill in:
  - **Name**: Your name
  - **Email**: your@email.com (any valid email)
  - **Password**: Any password (min 6 chars recommended)
- Tap **Register**
- ✅ Should see success message and be logged in
- ❌ If error appears → Check if register endpoint is responding

### 2️⃣ **Login** (Phase 2)
- Use credentials from signup above
- ✅ Should show token in localStorage
- ✅ Should redirect to home/menu page

### 3️⃣ **View Menu**
- Homepage should display all 8 items:
  - 🧀 Paneer Parantha - ₹80
  - 🥔 Aalu Parantha - ₹60
  - 🌾 Poshtik Poha - ₹70
  - 🍛 Thali Combo - ₹150
  - 🍳 Chole Bhature - ₹120
  - 🥘 Idli Sambar - ₹70
  - 🥙 Dosa with Chutney - ₹90
  - 🍚 Rajma Rice - ₹85
- ✅ Items loaded from database (not static)

### 4️⃣ **Add to Cart**
- Tap "Order Now" on any item
- Item should appear in cart
- ✅ Quantity should be adjustable
- ✅ Cart total should update

### 5️⃣ **Place Order**
- Add 2-3 items to cart
- Proceed to checkout (look for button)
- ✅ Order should be created
- ✅ Should see order confirmation
- ✅ Order status shows in "Order History"

---

## 🔧 If You Get CORS Error

**The fix has been applied:**

✅ Backend listening on **0.0.0.0:5000** (all interfaces)
✅ Frontend API URL set to **192.168.29.136:5000/api**
✅ CORS origins configured for phone IP

If still getting error:
1. Hard refresh phone browser: Pull down → Refresh
2. Or: Close app and reopen `http://192.168.29.136:5174`

---

## 🐛 Debugging on Phone

### Check Network Tab (Chrome DevTools):
1. Open `http://192.168.29.136:5174`
2. Press `F12` (DevTools)
3. Go to **Network** tab
4. Try signup
5. Find `/api/auth/register` request
6. Check:
   - **Status**: Should be 200 (success) or 400 (validation error)
   - **Origin**: Should match phone IP
   - **CORS Headers**: Should show `Access-Control-Allow-Origin`

### Check Console for Errors:
1. Press `F12`
2. Go to **Console** tab
3. Look for red error messages
4. Share any errors shown

---

## 📡 API Endpoints (All Working)

```bash
# Health check
GET http://192.168.29.136:5000/api/health

# Authentication
POST http://192.168.29.136:5000/api/auth/register
POST http://192.168.29.136:5000/api/auth/login

# Menu (no auth needed)
GET http://192.168.29.136:5000/api/menu

# Cart (requires token)
GET http://192.168.29.136:5000/api/cart
POST http://192.168.29.136:5000/api/cart/add
PUT http://192.168.29.136:5000/api/cart/:id
DELETE http://192.168.29.136:5000/api/cart/:id

# Orders (requires token)
POST http://192.168.29.136:5000/api/orders
GET http://192.168.29.136:5000/api/orders
```

---

## ✨ Summary

Your Food Bliss app is **fully functional** with:

✅ React + Vite frontend (responsive, mobile-optimized)
✅ Express backend with authentication
✅ PostgreSQL database with 8 menu items
✅ JWT-based login system
✅ Shopping cart functionality
✅ Order management
✅ Role-based access control (CUSTOMER, KITCHEN_OWNER, ADMIN)

**Enjoy testing! 🎉**
