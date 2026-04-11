# HERMED — Professional Dental Supplies E-Commerce

A complete production-ready frontend e-commerce system built with React + Vite + Tailwind CSS.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 🔑 Admin Access

Navigate to `/admin` or `/admin/login`

| Field | Value |
|-------|-------|
| Email | `admin@hermed.com` |
| Password | `hermed2024` |

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Sticky nav with cart badge & search overlay
│   ├── Footer.jsx          # Full footer with links & contact info
│   ├── ProductCard.jsx     # Reusable product card with add-to-cart
│   ├── CategorySidebar.jsx # Filterable category list with counts
│   └── ProtectedRoute.jsx  # Admin auth guard
├── pages/
│   ├── Home.jsx            # Hero, categories, featured, promo, USPs
│   ├── Shop.jsx            # Product grid + sidebar + search + sort
│   ├── ProductDetail.jsx   # Full detail page with related products
│   ├── Cart.jsx            # Cart with qty controls & order summary
│   ├── Checkout.jsx        # Form + order confirmation flow
│   ├── About.jsx           # Company story, values, team, partners
│   ├── Contact.jsx         # Contact form with validation
│   └── admin/
│       ├── AdminLogin.jsx      # Fake auth login
│       ├── AdminLayout.jsx     # Sidebar + outlet layout
│       ├── AdminDashboard.jsx  # Stats + recent orders + product list
│       ├── AdminProducts.jsx   # Full CRUD with modal forms
│       └── AdminOrders.jsx     # Orders table with status filtering
├── store/
│   └── index.js            # Zustand stores: cart, products, auth
└── data/
    └── products.js         # Mock product & order data (12 products, 8 categories)
```

## 🛠 Tech Stack

- **React 19** + **Vite** — lightning fast dev server
- **Tailwind CSS v3** — utility-first styling
- **React Router v7** — client-side routing
- **Zustand** — lightweight state management with localStorage persistence
- **Google Fonts** — Playfair Display (headings) + DM Sans (body)

## ✨ Features

### Store
- Browse 12 mock products across 8 categories
- Filter by category, search by name/description, sort by price/rating
- Product detail pages with image gallery, features, and related products
- Fully functional cart: add, remove, update quantity, persisted to localStorage
- Checkout form with validation and order confirmation
- Promo code UI (ready for backend)

### Admin Panel
- Protected routes (fake JWT-style auth via Zustand + localStorage)
- Dashboard with stats and recent activity
- Products: full add/edit/delete with modal form
- Orders: filterable table by status, revenue summary

## 🔌 Backend Integration

All state is managed via Zustand. To connect a real backend:

1. Replace `useProductStore` fetches with API calls in each page
2. Wire up the cart to a real cart/session API
3. Replace the `login()` function in `useAuthStore` with a real JWT flow
4. POST checkout form data to your orders endpoint

## 📦 Build for Production

```bash
npm run build
# Output in /dist — ready to deploy to Vercel, Netlify, etc.
```
