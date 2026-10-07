# Coffeë — Premium Café & Patisserie Website

A full-stack, editorial luxury café website inspired directly by the reference aesthetic with warm cream/beige backgrounds, dark forest green typography and accents, soft pastel dessert cards, and a warm artisanal atmosphere.

---

## ☕ Key Features

1. **Exact Reference Composition**
   - **Header**: Wordmark "Coffeë", navigation links (*Home*, *Cosset*, *Confect*, *Abouts*) with active indicator bar, live search, barista user avatar, and cart counter badge.
   - **Hero Section**: Handwritten script *"Life Happens, Coffee Helps"*, large editorial heading *"Sweet Moments Start Here."*, rounded green pill button *"EXPLORE MORE  >"*, and large circular photorealistic latte art cup with roast beans.
   - **Feature Highlights Row**: *Finest Ingredients*, *Perfectly Brewed*, and *Made with Love* with circular icon badges.
   - **Special Dessert Cards**: 3-column cards for **Aatis** (*Pistachio Bliss*), **Lermi** (*Chocolate Dream*), and **Flitre** (*Berry Delight*) on pastel sage, almond, and rose containers with circular arrow actions.
   - **Our Special (Müil Coffee)**: Single-origin signature brew with medium dark roast checklist, discover CTA, and vintage *"Brewed for You"* circular seal.
   - **Dark Green Service Bar**: Free Delivery (over $29), Secure Payment, Premium Quality, 24/7 Support.
   - **Minimal Footer**: Copyright, Payment badges (*VISA, Mastercard, PayPal, Apple Pay*), social media links, and newsletter subscription form.

2. **Full-Stack REST Architecture**
   - **Express.js API** routes for products, orders, inquiries, newsletter subscribers, and dashboard metrics.
   - **Mongoose & MongoDB** schemas (`Product`, `Order`, `ContactMessage`, `NewsletterSubscriber`) with hybrid memory fallback when running in sandboxed environments without a local MongoDB daemon.
   - **Barista Atelier Admin Dashboard**: View and update order statuses, add/edit/delete menu offerings, inspect customer inquiries, and manage newsletter subscribers.
   - **Interactive Shopping Bag**: Free delivery progress bar towards $29 threshold, quantity steppers, promo code (`SWEET10`), and complete checkout flow.

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend**: Node.js, Express.js, TypeScript (`tsx`)
- **Database**: MongoDB with Mongoose (with automated memory fallback)

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (optional, if you want local persistent storage; otherwise the built-in memory store activates automatically)

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Configure your MongoDB connection string in `.env`:
```env
MONGODB_URI="mongodb://localhost:27017/coffee_atelier"
PORT=3000
```

### 4. Running the Application
To run the full-stack server (Express backend + Vite frontend):
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 📡 REST API Documentation

### Products
- `GET /api/products` — Retrieve products (supports `?category=cosset` or `?featured=true`)
- `GET /api/products/:id` — Retrieve product details
- `POST /api/products` — Add a new menu item
- `PUT /api/products/:id` — Update menu item (price, stock, details)
- `DELETE /api/products/:id` — Remove menu item

### Orders
- `GET /api/orders` — List customer orders
- `GET /api/orders/:id` — Retrieve order receipt
- `POST /api/orders` — Create new order with itemized cart and customer details
- `PUT /api/orders/:id` — Update order status (`pending`, `brewing`, `out_for_delivery`, `delivered`)

### Customer & Marketing
- `POST /api/contact` — Submit atelier inquiry
- `GET /api/contact` — Retrieve inquiries (Admin)
- `POST /api/newsletter` — Subscribe to newsletter
- `GET /api/newsletter` — Retrieve subscribers (Admin)
- `GET /api/admin/stats` — Store performance metrics
