# Phase 2 - Backend Setup Guide

## Quick Start

### 1. Install PostgreSQL (Required)

#### Windows:
```bash
# Download from https://www.postgresql.org/download/windows/
# During installation:
# - Set password for 'postgres' user
# - Remember the port (default: 5432)
```

#### Alternative: Use Docker (if installed)
```bash
docker run --name food-bliss-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=food_bliss \
  -p 5432:5432 \
  -d postgres:15
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env with your database connection
# Example:
# DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/food_bliss"
# JWT_SECRET="your-secret-key-123"
```

### 3. Setup Database with Prisma

```bash
# Generate Prisma Client
npm run prisma:generate

# Create database and run migrations
npm run prisma:migrate

# (Optional) View database in UI
npm run prisma:studio
```

### 4. Seed Initial Data (Optional)

Create `backend/prisma/seed.js`:
```javascript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample menu items
  await prisma.menuItem.createMany({
    data: [
      { name: 'Paneer Parantha', description: 'Cheese stuffed flatbread', price: 80, image: '🧀' },
      { name: 'Aalu Parantha', description: 'Potato stuffed flatbread', price: 60, image: '🥔' },
      { name: 'Chole Bhature', description: 'Spiced chickpeas with fried bread', price: 120, image: '🍲' },
    ],
  });
  
  console.log('✓ Database seeded');
}

main();
```

Then run:
```bash
node prisma/seed.js
```

### 5. Start Backend Server

```bash
npm run dev
# Server runs on http://localhost:5000
```

Expected output:
```
✓ Database connected
✓ Server running on http://localhost:5000
✓ Frontend URL: http://localhost:5173
```

### 6. Update Frontend

Make sure `.env` in frontend root has:
```
VITE_API_URL=http://localhost:5000/api
```

### 7. Start Frontend

```bash
cd ..  # Go back to root
npm run dev
# Frontend runs on http://localhost:5173
```

---

## Database Schema Overview

### Users
- JWT-based authentication
- Roles: CUSTOMER, KITCHEN_OWNER, ADMIN
- Passwords hashed with bcrypt

### Menu Items
- Created/updated by ADMIN only
- Includes: name, description, price, image, isActive

### Cart Items
- Per user, stored in database
- Links user → menu item with quantity

### Orders
- Created when customer places order
- Statuses: PLACED → STARTED_PREPARING → PREPARED → OUT_FOR_DELIVERY → DELIVERED

### Order Items
- Line items for each order
- Captures price at time of order

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user

### Menu (Public)
- `GET /api/menu` - List active items
- `GET /api/menu/:id` - Get item details

### Cart (Protected)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/:menuItemId` - Update quantity
- `DELETE /api/cart/:menuItemId` - Remove item
- `DELETE /api/cart` - Clear cart

### Orders (Protected)
- `POST /api/orders` - Place order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/all` - Get all orders (KITCHEN_OWNER, ADMIN)
- `PUT /api/orders/:orderId/status` - Update status (KITCHEN_OWNER, ADMIN)

---

## Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"123456"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"123456"}'
# Copy the token from response
```

### Get Menu
```bash
curl http://localhost:5000/api/menu
```

### Add to Cart (with token)
```bash
curl -X POST http://localhost:5000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"menuItemId":1,"quantity":2}'
```

---

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database exists

### JWT Token Error
```
Invalid token
```
- Token may be expired (7 days)
- Clear localStorage and login again

### CORS Error (Frontend → Backend)
- Backend CORS is configured for `FRONTEND_URL` env variable
- Make sure both frontend and backend are running
- Check that ports match (.env files)

### Port Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <PID> /F
```

---

## Production Deployment

### Environment Variables
Create `.env` with production values:
```
DATABASE_URL="postgresql://user:password@prod-db.example.com:5432/food_bliss"
JWT_SECRET="very-long-random-secret-key-123456"
PORT=5000
NODE_ENV="production"
FRONTEND_URL="https://yourdomain.com"
```

### Deploy
1. Build frontend: `npm run build`
2. Serve with Nginx (refer to NGINX_HOSTING_GUIDE.md)
3. Run backend on separate port (5000) or same server
4. Use Cloudflare Tunnel for external access

---

## Next Steps

- ✅ Phase 2 Backend complete
- ⏳ Phase 3: Payment integration (Stripe/Razorpay)
- ⏳ Phase 4: Real-time notifications (WebSocket)
- ⏳ Phase 5: Analytics dashboard
