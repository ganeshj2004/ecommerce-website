# 🍾 AquaCraft Bottles - Full-Stack eCommerce Platform

A production-ready eCommerce web platform built for a premium water bottle business. Features a dynamic customer storefront, filtering catalog, shopping cart, Razorpay payment checkout, JWT authentication, and a complete Admin Management Panel.

---

## 🌟 Tech Stack

- **Frontend**: React (Vite), Material UI v6, Bootstrap 5, Axios, Recharts, React Router v6, React Hot Toast.
- **Backend**: Node.js, Express.js REST API.
- **Database**: MySQL (`mysql2/promise`) with indexed table schema & schema auto-initializer (plus local database fallback for instant out-of-the-box testing).
- **Authentication**: JWT (JSON Web Tokens) + Bcrypt password hashing.
- **Image Storage**: Cloudinary (with local disk storage fallback).
- **Payment Gateway**: Razorpay Checkout SDK & HMAC signature verification.

---

## 🚀 Key Features

### 🛍️ User Storefront
- **Dynamic Homepage**: Dynamic hero banner, title, subtitle, CTA button, top categories grid, featured bottle carousel, and eco-impact statistics.
- **Dynamic Content & Branding**: Company name, logo, about text, phone, email, address, and banner text are managed live via the admin panel.
- **Bottle Catalog**: Live text search, category filtering, price range slider, material selection, capacity filter, sorting, and pagination.
- **Product Detail View**: Image preview, stock status, capacity specs, insulation hours, quantity selector, and quick add-to-cart.
- **Cart System**: Real-time item subtotal calculation, quantity update (+/-), item removal, and free shipping threshold meter.
- **Razorpay Checkout**: Seamless Razorpay payment modal integration with test/live mode signature verification and fallback modal handler.
- **User Auth System**: Secure user registration and login with persistent JWT session management.

### 🛡️ Admin Management Panel
- **Analytics Dashboard**: Real-time sales revenue counter, total orders count, customer metrics, Recharts revenue graph, and low-stock bottle alerts.
- **Product Management (CRUD)**: Create, edit, delete bottle products, set stock inventory, capacity, material, featured flag, and image upload.
- **Category Management (CRUD)**: Create, edit, delete bottle categories.
- **Order Management**: View customer orders, detailed item breakdown, and update shipping status (`pending` ➔ `processing` ➔ `shipped` ➔ `delivered` ➔ `cancelled`).
- **User Management**: View user accounts and change user roles (`user` / `admin`).
- **Website Content Management**: Change logo, company name, hero headline, subtitle, hero banner image, about us text, phone, email, and free shipping threshold live across the entire website.

---

## 📁 Project Directory Structure

```
project-v1/
├── server/
│   ├── config/
│   │   ├── db.js              # MySQL connection pool & fallback database driver
│   │   └── cloudinary.js      # Cloudinary storage config & local disk fallback
│   ├── controllers/
│   │   ├── analyticsController.js
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── categoryController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── productController.js
│   │   ├── settingsController.js
│   │   └── userController.js
│   ├── database/
│   │   ├── schema.sql         # MySQL schema DDL & indexes
│   │   └── seed.js           # Database seed script for products & admin account
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT verification & Admin role guard
│   ├── routes/                # Express API routes
│   ├── server.js              # Express app entry point
│   ├── .env.example
│   └── package.json
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/        # Navbar, Footer, ProductCard, FilterSidebar, AdminLayout, etc.
│   │   ├── context/           # AuthContext, CartContext, SettingsContext
│   │   ├── pages/             # HomePage, AboutPage, ProductsPage, ProductDetailPage, CartPage, CheckoutPage, Admin Pages
│   │   ├── services/          # Axios API service wrapper
│   │   ├── App.jsx
│   │   ├── index.css          # Design system & responsive styles
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
├── package.json
└── README.md
```

---

## 🔑 Demo Login Credentials

For testing and reviewing the application:

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@aquacraft.com` | `admin123` | Full Admin Dashboard & Storefront |
| **Customer User** | `user@aquacraft.com` | `user123` | Customer Storefront & Checkout |

---

## 🛠️ Installation & Setup Instructions

### 1. Backend Setup (`/server`)

```bash
cd server
npm install
```

#### Environment Variables (`server/.env`):
Create a `.env` file inside `server/`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=aquacraft_super_secret_jwt_key_2026_bottle_shop
JWT_EXPIRE=30d

# MySQL Config
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=aquacraft_db

# Razorpay Config (Test Mode)
RAZORPAY_KEY_ID=rzp_test_aquacraft123
RAZORPAY_KEY_SECRET=aquacraft_secret_key_123

# Cloudinary Config
CLOUDINARY_CLOUD_NAME=demo_cloud
CLOUDINARY_API_KEY=1234567890
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

#### Database Seeding & Auto-Initialization:
To seed default bottle products, categories, default admin account, and dynamic website content:
```bash
npm run seed
```

Start the Node backend server:
```bash
npm run dev
```
Backend API will be running on `http://localhost:5000`.

---

### 2. Frontend Setup (`/client`)

Open a new terminal window:
```bash
cd client
npm install
npm run dev
```
Frontend React app will open on `http://localhost:3000`.

---

## 🗄️ Database Table Schema

- `users`: `id`, `name`, `email`, `password`, `role`, `phone`, `created_at`
- `categories`: `id`, `name`, `slug`, `description`, `image_url`, `created_at`
- `products`: `id`, `category_id`, `name`, `slug`, `description`, `price`, `stock`, `capacity`, `material`, `color`, `image_url`, `is_featured`, `created_at`
- `cart`: `id`, `user_id`, `product_id`, `quantity`, `created_at`
- `orders`: `id`, `user_id`, `total_amount`, `shipping_address`, `status`, `payment_status`, `razorpay_order_id`, `razorpay_payment_id`, `created_at`
- `order_items`: `id`, `order_id`, `product_id`, `price`, `quantity`
- `settings`: `id`, `key_name`, `key_value`
