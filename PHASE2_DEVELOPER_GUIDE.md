# Food Bliss Phase 2 - Developer Quick Reference

## 🚀 Fast Start (5 minutes)

```bash
# 1. Setup backend
cd backend
cp .env.example .env
# Edit .env: DATABASE_URL="postgresql://postgres:password@localhost:5432/food_bliss"
npm install
npm run prisma:migrate
npm run dev

# 2. In new terminal: Start frontend
npm run dev

# 3. Open browser
http://localhost:5173/login
```

---

## 📋 File Locations

| What | Where |
|------|-------|
| Backend server | `backend/src/server.js` |
| Database schema | `backend/prisma/schema.prisma` |
| Auth routes | `backend/src/routes/auth.js` |
| Auth logic | `backend/src/controllers/authController.js` |
| Auth middleware | `backend/src/middleware/auth.js` |
| Role checks | `backend/src/middleware/role.js` |
| Menu API | `backend/src/routes/menu.js` |
| Cart API | `backend/src/routes/cart.js` |
| Orders API | `backend/src/routes/orders.js` |
| Frontend API client | `src/services/api.js` |
| Login page | `src/pages/Login.jsx` |
| Cart page | `src/pages/Cart.jsx` |
| Item details | `src/pages/ItemDetails.jsx` |
| Order history | `src/pages/OrderHistory.jsx` |
| Kitchen dashboard | `src/pages/KitchenDashboard.jsx` |
| Admin panel | `src/pages/AdminPanel.jsx` |
| Router | `src/router/AppRouter.jsx` |

---

## 🔐 Authentication Flow

### Register
```javascript
import { authAPI } from '../services/api';

const response = await authAPI.register({
  name: 'John',
  email: 'john@example.com',
  password: 'pass123'
});

localStorage.setItem('token', response.data.token);
localStorage.setItem('user', JSON.stringify(response.data.user));
```

### Login
```javascript
const response = await authAPI.login({
  email: 'john@example.com',
  password: 'pass123'
});

localStorage.setItem('token', response.data.token);
localStorage.setItem('user', JSON.stringify(response.data.user));
```

### Protected Request (Automatic)
```javascript
// Token automatically attached by axios interceptor
const response = await cartAPI.get();
```

---

## 🛒 Cart Operations

### Get Cart
```javascript
import { cartAPI } from '../services/api';

const response = await cartAPI.get();
console.log(response.data); // { items: [...], total: 500 }
```

### Add Item
```javascript
await cartAPI.add({ menuItemId: 1, quantity: 2 });
```

### Update Quantity
```javascript
await cartAPI.update(menuItemId, { quantity: 3 });
```

### Remove Item
```javascript
await cartAPI.remove(menuItemId);
```

### Clear Cart
```javascript
await cartAPI.clear();
```

---

## 📦 Order Operations

### Place Order
```javascript
import { orderAPI } from '../services/api';

const response = await orderAPI.place();
// Returns created order with items
```

### Get My Orders
```javascript
const response = await orderAPI.getMyOrders();
// Returns array of customer's orders
```

### Get All Orders (Kitchen)
```javascript
const response = await orderAPI.getAll();
// Returns all orders in system (KITCHEN_OWNER, ADMIN only)
```

### Update Order Status
```javascript
await orderAPI.updateStatus(orderId, { status: 'STARTED_PREPARING' });

// Valid statuses:
// - PLACED
// - STARTED_PREPARING
// - PREPARED
// - OUT_FOR_DELIVERY
// - DELIVERED
// - CANCELLED
```

---

## 🔒 Protected Routes

### Require Login
```javascript
// In AppRouter.jsx
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

<Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
```

### Require Role
```javascript
const RoleRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return allowedRoles.includes(user.role) ? children : <Navigate to="/" />;
};

<Route path="/kitchen" element={<RoleRoute allowedRoles={['KITCHEN_OWNER', 'ADMIN']}><Kitchen /></RoleRoute>} />
```

---

## 🎯 Backend Adding New Endpoint

### 1. Create Controller
```javascript
// backend/src/controllers/myController.js
export const myAction = async (req, res) => {
  try {
    // Logic here
    res.json({ result: 'success' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### 2. Create Route
```javascript
// backend/src/routes/myRoute.js
import express from 'express';
import { myAction } from '../controllers/myController.js';
import { authMiddleware } from '../middleware/auth.js';
import { roleMiddleware } from '../middleware/role.js';

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['ADMIN']), myAction);

export default router;
```

### 3. Register in Server
```javascript
// backend/src/server.js
import myRoutes from './routes/myRoute.js';

app.use('/api/my', myRoutes);
```

### 4. Call from Frontend
```javascript
// src/services/api.js
export const myAPI = {
  action: (data) => api.post('/my', data),
};

// In component
import { myAPI } from '../services/api';
await myAPI.action({ data: 'value' });
```

---

## 🗄️ Database Queries (Prisma)

### Find User by Email
```javascript
const user = await prisma.user.findUnique({
  where: { email: 'john@example.com' }
});
```

### Create Order with Items
```javascript
const order = await prisma.order.create({
  data: {
    userId: 1,
    totalAmount: 500,
    items: {
      createMany: {
        data: [
          { menuItemId: 1, quantity: 2, price: 80 }
        ]
      }
    }
  },
  include: { items: true }
});
```

### Get Orders with Relations
```javascript
const orders = await prisma.order.findMany({
  where: { userId: 1 },
  include: { 
    items: { include: { menuItem: true } }
  },
  orderBy: { createdAt: 'desc' }
});
```

### Update Menu Item
```javascript
await prisma.menuItem.update({
  where: { id: 1 },
  data: { price: 100 }
});
```

---

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"123456"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"123456"}'
```

### Get Menu (no auth needed)
```bash
curl http://localhost:5000/api/menu
```

### Add to Cart (with token)
```bash
TOKEN="eyJhbGciOiJIUzI1NiIs..."

curl -X POST http://localhost:5000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"menuItemId":1,"quantity":2}'
```

---

## 🐛 Common Issues & Fixes

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Fix**: PostgreSQL not running. Start it or check DATABASE_URL in .env

### JWT Token Expired
```
Error: Invalid token
```
**Fix**: Clear localStorage and login again
```javascript
localStorage.clear();
window.location.href = '/login';
```

### CORS Error
```
Access to XMLHttpRequest blocked by CORS
```
**Fix**: Check FRONTEND_URL in backend .env matches your frontend URL

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Fix**: Kill process or use different port
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change PORT in .env
```

### Prisma Client Not Generated
```
Error: Prisma Client not found
```
**Fix**: Run `npm run prisma:generate` in backend/

---

## 📱 Testing Flow

1. **Register**: Go to `/login` → Sign up → Fill form → Submit
2. **Browse**: Home page shows menu from database
3. **Details**: Click item → See `/item/:id` page
4. **Cart**: Add items → View `/cart`
5. **Order**: Place order → Redirected to `/orders`
6. **History**: See order status and items in `/orders`
7. **Kitchen**: Login as KITCHEN_OWNER → Visit `/kitchen`
8. **Update**: Click dropdown to change order status
9. **Admin**: Login as ADMIN → Visit `/admin` for user management

---

## 📊 Database Backup/Restore

### Backup
```bash
pg_dump -U postgres food_bliss > backup.sql
```

### Restore
```bash
psql -U postgres food_bliss < backup.sql
```

### Reset Database
```bash
npm run prisma:migrate reset
# Warning: Deletes all data!
```

---

## 🚀 Production Checklist

- [ ] Change JWT_SECRET to long random string
- [ ] Set NODE_ENV=production
- [ ] Use production PostgreSQL (not local)
- [ ] Enable HTTPS
- [ ] Configure FRONTEND_URL correctly
- [ ] Set up environment variables on server
- [ ] Build frontend: `npm run build`
- [ ] Use process manager (pm2) for Node
- [ ] Setup Nginx reverse proxy
- [ ] Enable database backups
- [ ] Monitor logs and errors
- [ ] Setup SSL certificates (Let's Encrypt)
- [ ] Configure Cloudflare Tunnel for external access

---

## 📚 Useful Commands

```bash
# Backend
npm run dev              # Start server
npm run prisma:studio   # Open database UI
npm run prisma:migrate  # Create/apply migrations
npm run prisma:generate # Generate Prisma Client

# Frontend
npm run dev             # Start dev server
npm run build           # Production build
npm run preview         # Preview build

# Database
createdb food_bliss                      # Create database
psql -U postgres food_bliss              # Connect to database
\dt                                      # List tables
\d users                                 # Describe table
```

---

## 💡 Architecture Summary

```
Frontend (React/Vite)
    ↓ (Axios with JWT)
Nginx/Port 8000
    ↓
Backend (Express/Node)
    ↓ (Prisma)
PostgreSQL Database
```

All requests include JWT token in Authorization header.
Backend validates token, checks role, executes action.
Database persists all data (users, menu, cart, orders).

---

## 🎓 Next: Phase 3

- Payment gateway (Razorpay/Stripe)
- Email notifications (nodemailer)
- Real-time updates (Socket.io)
- Analytics dashboard
- Order tracking map
- Delivery management

---

**Last Updated**: February 16, 2026
**Phase 2 Status**: ✅ COMPLETE
