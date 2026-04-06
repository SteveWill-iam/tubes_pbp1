# Self-Service Kiosk System (McD-style) — Technical Spec v1

## 1. Scope
- Customer (no auth): browse menu → cart → checkout → dummy QRIS → order created → receipt
- Admin (JWT): login → manage products → view orders → update status → view stats

---

## 2. Tech Stack
- Frontend: React + TypeScript, React Router, Redux Toolkit
- Backend: Node.js (Express), Sequelize ORM
- Database: PostgreSQL
- Package manager: pnpm

---

## 3. Architecture
Route → Controller → Service → Model

- Controller: request/response
- Service: business logic
- Model: Sequelize ORM

---

## 4. Database (see ERD in .mmd file)

### Tables

#### ADMINS
- id (uuid, PK)
- username (string)
- password_hash (string)
- created_at (timestamp)

#### PRODUCTS
- id (uuid, PK)
- name (string)
- description (text)
- category (string)
- price (int)
- image_url (string)
- created_at (timestamp)

#### ORDERS
- id (uuid, PK)
- queue_number (int)
- status (enum: processed | completed)
- order_type (enum: dine_in | takeaway)
- total_price (int)
- created_at (timestamp)

#### ORDER_ITEMS
- id (uuid, PK)
- order_id (uuid, FK)
- product_id (uuid, FK)
- quantity (int)
- price (int)

---

## 5. Core Logic

### Queue Number
- Query max(queue_number) by date
- Increment +1
- Reset daily

### Order Creation
1. Validate cart
2. Fetch product prices from DB
3. Calculate total_price
4. Generate queue_number
5. Insert order
6. Insert order_items (price snapshot)

---

## 6. API Endpoints

### Auth
POST /api/auth/login

### Products
GET    /api/products
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id

### Orders
POST   /api/orders
GET    /api/orders
PATCH  /api/orders/:id/status

### Stats
GET /api/stats

---

## 7. Middleware
- authMiddleware (JWT)
- errorHandler (global error)

---

## 8. Frontend Structure

### Pages
Customer:
- Menu
- Cart
- Checkout
- Payment
- Receipt

Admin:
- Login
- Dashboard
  - Orders
  - Products
  - Stats

---

## 9. Redux State

```
cart: { items, total }
products: { list }
orders: { currentOrder }
auth: { token }
```

- Cart persisted to localStorage

---

## 10. Order Flow

Customer:
Menu → Cart → Checkout → QRIS (2s delay) → Create Order → Receipt

Admin:
Login → Dashboard → Manage Orders & Products

---

## 11. Auto Refresh Strategy
- Polling every 5s

```
setInterval(fetchOrders, 5000)
```

---

## 12. Highlight New Orders
- Condition: created_at < 1 minute

```
Date.now() - created_at < 60000
```

- UI: yellow background

---

## 13. Payment Simulation
- QRIS dummy screen
- Delay 2 seconds
- Auto trigger order creation

---

## 14. Image Upload
- Use multer
- Store in /uploads
- Save path in DB

---

## 15. Security
- bcrypt password hashing
- JWT authentication (admin only)

---

## 16. Stats Logic
- total_orders
- total_revenue
- today_orders
- today_revenue

---

## 17. Edge Cases
- Empty cart → reject
- Price must come from DB
- Daily queue reset
- Snapshot item price in order_items

---

## 18. Future Enhancements (Optional)
- Real-time (WebSocket/SSE)
- Notification sound
- UI animation
- Advanced analytics

---

## 19. Notes
- No customer data stored
- System mimics kiosk, not full McD app
- Focus on simplicity + production structure

