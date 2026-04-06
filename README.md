# Self-Service Kiosk System

A McDonald's-style self-service kiosk system built with Node.js, Express, PostgreSQL, React, and Redux.

## Overview

This system allows customers to:
- Browse menu items
- Add items to cart
- Checkout with order type selection (Dine In / Takeaway)
- Complete dummy QRIS payment
- View receipt with queue number

Admins can:
- Login with JWT authentication
- View all orders with auto-refresh
- Update order status
- Manage products (CRUD operations)
- View statistics

## Tech Stack

- **Frontend**: React 18 + TypeScript + Redux Toolkit + React Router + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Sequelize ORM
- **File Upload**: Multer (local file storage)
- **Authentication**: JWT + bcrypt

## Project Structure

```
tubes/
├── backend/                    # Node.js Express backend
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── models/            # Sequelize models
│   │   ├── controllers/       # Route controllers
│   │   ├── services/          # Business logic
│   │   ├── middleware/        # Express middleware
│   │   ├── routes/            # API routes
│   │   ├── seeders/           # Database seeders
│   │   └── index.ts           # Entry point
│   ├── uploads/               # Image storage
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # React TypeScript frontend
│   ├── src/
│   │   ├── redux/             # Redux store & slices
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components
│   │   ├── routes/            # Route configuration
│   │   ├── api/               # API client
│   │   ├── App.tsx            # Root component
│   │   └── main.tsx           # Entry point
│   ├── public/                # Static files
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
└── .env                       # Environment variables
```

## Setup Instructions

### Prerequisites

- PostgreSQL 12+ installed and running
- Node.js 18+ installed

### 1. PostgreSQL Setup

```bash
# Create database
createdb tubes

# Or using psql:
psql
CREATE DATABASE tubes;
\q
```

Update `.env` file with your PostgreSQL credentials:

```env
DB_USERNAME="developer"
DB_PASSWORD="developer123"
DB_NAME="tubes"
DB_HOST="localhost"
DB_PORT=5432
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Run database migrations and seeders (optional - models will auto-sync)
# npm run db:seed

# Start development server
npm run dev
```

Server runs on `http://localhost:3000`

**Demo Credentials:**
- Username: `admin`
- Password: `admin123`

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:3001`

## API Endpoints

### Public Routes

- `GET /api/health` - Health check
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/auth/login` - Admin login
- `POST /api/orders` - Create new order

### Protected Routes (Admin only - requires JWT)

- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id/status` - Update order status
- `POST /api/products` - Create product (with image upload)
- `PUT /api/products/:id` - Update product (with image upload)
- `DELETE /api/products/:id` - Delete product
- `GET /api/stats` - Get statistics

## Features

### Customer Flow

1. **Home Page**: Select Dine In or Takeaway
2. **Menu**: Browse products by category
3. **Cart**: Review items, adjust quantities
4. **Checkout**: Confirm order summary
5. **Payment**: Dummy QRIS payment (2-second delay)
6. **Receipt**: Display queue number and order details

### Admin Dashboard

1. **Login**: Secure JWT authentication
2. **Dashboard**: Real-time order monitoring with 5-second auto-refresh
3. **New Order Highlight**: Orders < 1 minute old highlighted in yellow
4. **Order Management**: Change status from "processed" to "completed"
5. **Product Management**: CRUD operations with image upload
6. **Statistics**: View total orders, revenue, and today's metrics

### Key Logic

**Queue Number Generation**:
- Increments daily
- Resets per date (e.g., Queue #1 on each new day)
- Generated from `max(queue_number) + 1` for the current date

**Price Snapshot**:
- Captured in `OrderItem.price` at order creation time
- Independent of future product price changes
- Reflects accurate past pricing

**Image Upload**:
- Stored in `/backend/uploads/` directory
- Served as static files from Express
- Max file size: 5MB
- Allowed types: JPEG, PNG, WebP

## Environment Variables

```env
# Database
DB_USERNAME="developer"
DB_PASSWORD="developer123"
DB_NAME="tubes"
DB_HOST="localhost"
DB_PORT=5432

# Server
NODE_ENV="development"
PORT=3000
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
```

## Scripts

### Backend

```bash
npm run dev      # Start with hot reload (tsx)
npm run build    # Compile TypeScript
npm start        # Run compiled build
npm run db:seed  # Seed database (if using migrations)
```

### Frontend

```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Testing the System

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `cd frontend && npm run dev` (in another terminal)
3. **Customer Flow**:
   - Go to `http://localhost:3001`
   - Select "Dine In" or "Takeaway"
   - Browse and add products
   - Checkout and complete payment
   - View receipt with queue number

4. **Admin Flow**:
   - Navigate to `/login`
   - Use: `admin` / `admin123`
   - View dashboard with orders
   - Check products page
   - Create/edit/delete products

## Notes

- Cart is persisted to localStorage
- Orders auto-refresh every 5 seconds in admin dashboard
- New orders (< 1 min old) are highlighted in yellow
- Images are stored locally; not recommended for production (use cloud storage like S3)
- JWT tokens expire in 24 hours
- No customer authentication required (kiosk system)

## Future Enhancements

- Real cloud storage (AWS S3, Google Cloud Storage)
- WebSocket for real-time updates instead of polling
- Email notifications for orders
- Advanced analytics and reporting
- Multi-language support
- Mobile-responsive admin panel
- Order history and customer loyalty system

## License

ISC

## Support

For issues or questions, contact the development team.
