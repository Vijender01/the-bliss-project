# Food Bliss Backend - Node.js + Express + PostgreSQL + Prisma

Production-ready REST API for food ordering system.

## Features

✅ **Authentication**
- User registration and login
- JWT token-based auth (7-day expiry)
- Password hashing with bcryptjs
- Role-based access control (CUSTOMER, KITCHEN_OWNER, ADMIN)

✅ **Menu Management**
- List all active menu items
- Get individual item details
- Create/update items (ADMIN only)
- Price and availability tracking

✅ **Shopping Cart**
- Add items to cart
- Update quantities
- Remove items
- Clear entire cart
- Persistent storage in database

✅ **Order Management**
- Place orders from cart
- Track order status (6 states)
- View order history
- Kitchen dashboard for order updates
- Order items capture price snapshot

✅ **Role-Based Permissions**
- CUSTOMER: Browse, cart, orders, order history
- KITCHEN_OWNER: View all orders, update status
- ADMIN: Full system access, user management

## Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js 20+ |
| Framework | Express.js 4.18 |
| Database | PostgreSQL 13+ |
| ORM | Prisma 5.7 |
| Auth | JWT + bcryptjs |
| HTTP | CORS enabled |

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── controllers/           # Business logic
│   │   ├── authController.js
│   │   ├── menuController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   ├── routes/                # API endpoints
│   │   ├── auth.js
│   │   ├── menu.js
│   │   ├── cart.js
│   │   └── orders.js
│   ├── middleware/            # Express middleware
│   │   ├── auth.js            # JWT verification
│   │   └── role.js            # Permission checks
│   ├── utils/
│   │   └── jwt.js             # Token generation/verification
│   └── server.js              # Express app entry point
├── .env.example               # Environment template
├── package.json               # Dependencies
└── README.md

frontend/
├── src/
│   ├── pages/
│   │   ├── Login.jsx          # Auth page
│   │   ├── Cart.jsx           # Shopping cart
│   │   ├── ItemDetails.jsx    # Item details page
│   │   ├── OrderHistory.jsx   # My orders
│   │   ├── KitchenDashboard.jsx
│   │   └── AdminPanel.jsx
│   ├── services/
│   │   └── api.js             # Axios API client
│   ├── router/
│   │   └── AppRouter.jsx      # Updated routes
│   └── components/
│       └── MenuCard.jsx       # Updated component
```

## Installation

### Prerequisites
- Node.js 18+ or 20+
- PostgreSQL 13+
- npm or yarn

### Step 1: Backend Setup

```bash
cd backend
npm install
```

### Step 2: Database Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your database credentials
nano .env
```

### Step 3: Create Database

```bash
# Using psql
createdb food_bliss

# Or let Prisma create it
npm run prisma:migrate
```

### Step 4: Initialize Prisma

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio
npm run prisma:studio
```

### Step 5: Start Server

```bash
npm run dev
```

Expected:
```
✓ Database connected
✓ Server running on http://localhost:5000
```

## Database Schema

### User Model
```prisma
model User {
  id        Int
  name      String
  email     String (unique)
  passwordHash String
  role      UserRole (CUSTOMER | KITCHEN_OWNER | ADMIN)
  createdAt DateTime
  updatedAt DateTime
  
  cart      CartItem[]
  orders    Order[]
}
```

### MenuItem Model
```prisma
model MenuItem {
  id          Int
  name        String
  description String
  price       Float
  image       String?
  isActive    Boolean
  createdAt   DateTime
  updatedAt   DateTime
  
  cartItems   CartItem[]
  orderItems  OrderItem[]
}
```

### CartItem Model
```prisma
model CartItem {
  id        Int
  userId    Int
  menuItemId Int
  quantity  Int
  
  user      User (relation)
  menuItem  MenuItem (relation)
}
```

### Order Model
```prisma
model Order {
  id          Int
  userId      Int
  status      OrderStatus (PLACED | STARTED_PREPARING | PREPARED | OUT_FOR_DELIVERY | DELIVERED | CANCELLED)
  totalAmount Float
  createdAt   DateTime
  updatedAt   DateTime
  
  user        User (relation)
  items       OrderItem[]
}
```

### OrderItem Model
```prisma
model OrderItem {
  id        Int
  orderId   Int
  menuItemId Int
  quantity  Int
  price     Float (snapshot at order time)
  
  order     Order (relation)
  menuItem  MenuItem (relation)
}
```

## API Reference

### Authentication

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CUSTOMER"
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepass123"
}

Response: Same as register
```

### Menu

#### Get All Menu Items
```
GET /api/menu

Response:
[
  {
    "id": 1,
    "name": "Paneer Parantha",
    "description": "Cheese stuffed flatbread",
    "price": 80,
    "image": "🧀",
    "isActive": true
  },
  ...
]
```

#### Get Item Details
```
GET /api/menu/:id

Response:
{
  "id": 1,
  "name": "Paneer Parantha",
  "description": "Cheese stuffed flatbread",
  "price": 80,
  "image": "🧀",
  "isActive": true
}
```

### Cart (Requires Authentication)

#### Get Cart
```
GET /api/cart
Authorization: Bearer <token>

Response:
{
  "items": [
    {
      "id": 1,
      "userId": 1,
      "menuItemId": 1,
      "quantity": 2,
      "menuItem": { ... }
    }
  ],
  "total": 160
}
```

#### Add to Cart
```
POST /api/cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "menuItemId": 1,
  "quantity": 2
}
```

#### Update Cart Item
```
PUT /api/cart/:menuItemId
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

#### Remove Item
```
DELETE /api/cart/:menuItemId
Authorization: Bearer <token>
```

### Orders (Requires Authentication)

#### Place Order
```
POST /api/orders
Authorization: Bearer <token>

Response:
{
  "id": 1,
  "userId": 1,
  "status": "PLACED",
  "totalAmount": 500,
  "items": [
    {
      "menuItemId": 1,
      "quantity": 2,
      "price": 80
    }
  ],
  "createdAt": "2026-02-16T13:00:00Z"
}
```

#### Get My Orders
```
GET /api/orders
Authorization: Bearer <token>
```

#### Get All Orders (Kitchen Owner/Admin)
```
GET /api/orders/all
Authorization: Bearer <kitchen-owner-token>
```

#### Update Order Status
```
PUT /api/orders/:orderId/status
Authorization: Bearer <kitchen-owner-token>
Content-Type: application/json

{
  "status": "STARTED_PREPARING"
}

Valid statuses:
- PLACED
- STARTED_PREPARING
- PREPARED
- OUT_FOR_DELIVERY
- DELIVERED
- CANCELLED
```

## Authentication Flow

1. **Register/Login** → Get JWT token
2. **Store token** in localStorage
3. **Attach token** to requests: `Authorization: Bearer <token>`
4. **Token expires** in 7 days (configurable)
5. **Refresh**: Login again to get new token

### Token Structure
```json
{
  "userId": 1,
  "role": "CUSTOMER",
  "iat": 1708076400,
  "exp": 1708681200
}
```

## Middleware

### authMiddleware
Verifies JWT token from Authorization header.
```javascript
import { authMiddleware } from './middleware/auth.js';

router.get('/protected', authMiddleware, controller);
```

### roleMiddleware
Checks user role against allowed roles.
```javascript
import { roleMiddleware } from './middleware/role.js';

router.post('/admin-only', 
  authMiddleware, 
  roleMiddleware(['ADMIN']), 
  controller
);
```

## Error Handling

All errors return JSON with status code:

```json
{
  "error": "Invalid credentials"
}
```

Common status codes:
- `201` - Created successfully
- `400` - Bad request (validation error)
- `401` - Unauthorized (no token or invalid)
- `403` - Forbidden (insufficient permissions)
- `404` - Not found
- `500` - Server error

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/food_bliss"

# JWT
JWT_SECRET="your-super-secret-key-change-this"

# Server
PORT=5000
NODE_ENV="development"

# CORS
FRONTEND_URL="http://localhost:5173"
```

## Development

### Prisma Studio
```bash
npm run prisma:studio
# Opens http://localhost:5555
```

### View Logs
The server logs all requests to console. Example:
```
GET /api/menu - 200 OK (45ms)
POST /api/cart/add - 201 Created (120ms)
PUT /api/orders/1/status - 200 OK (80ms)
```

## Testing

### Health Check
```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-16T13:00:00Z"
}
```

## Performance

- Prisma connection pooling: Built-in
- Database indexes: On primary keys and unique fields
- JWT expiry: 7 days (configurable)
- No N+1 queries: Prisma optimized

## Security

✅ Passwords hashed with bcryptjs (salt: 10)
✅ JWT tokens for stateless auth
✅ Role-based access control
✅ CORS configured
✅ Input validation on all endpoints
✅ SQL injection protected (Prisma ORM)
✅ Error messages don't leak sensitive info

## Scaling

This backend can handle:
- ~50-100 concurrent requests
- Suitable for small to medium restaurants
- Horizontal scaling: Add more Node instances + load balancer
- Database: PostgreSQL handles thousands of orders

## Next Steps

1. ✅ Core API complete (Phase 2)
2. ⏳ Email notifications (nodemailer)
3. ⏳ Payment gateway (Razorpay/Stripe)
4. ⏳ Real-time updates (Socket.io)
5. ⏳ Admin analytics dashboard

## Support

For issues or questions, check:
- [Prisma Docs](https://www.prisma.io/docs/)
- [Express Docs](https://expressjs.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
