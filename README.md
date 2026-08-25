# Apex Machinery

**Powering Industry. Building Futures.**

A full industrial eCommerce web application built with React 19, Vite, React Router, and hand-written CSS (no CSS frameworks). Includes a public storefront, product catalog, cart/checkout flow, customer dashboard, and an admin dashboard.

## Tech Stack

- React 19 + Vite
- React Router DOM (client-side routing)
- Plain CSS (Flexbox + Grid, custom design tokens, no Tailwind/Bootstrap/Sass)
- Times New Roman typography, flat navy/gold brand palette
- Local component state + React Context (Cart, Wishlist, Auth) with `localStorage` persistence
- No backend — all product data is generated locally in `src/data/products.json`

## Getting Started

```bash
npm install
npm run dev
```

The app will open at `http://localhost:5173`.

To build for production:

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
  assets/        Logo and static images
  components/    Shared UI: Navbar, Footer, ProductCard, Filters, Pagination, etc.
  context/       CartContext, WishlistContext, AuthContext
  css/           Design tokens (variables.css) and global styles
  data/          Generated product data, categories, brands
  layouts/       MainLayout (navbar + footer shell)
  pages/         One file per route (Home, Shop, ProductDetails, Checkout, AdminDashboard, ...)
  utils/         Formatting helpers
  App.jsx        Route definitions
  main.jsx       App entry point, providers
scripts/
  gen-products.mjs   Script used to generate the 100+ product catalog
```

## Pages Implemented

Home · About · Shop (with filters/sort/pagination, also powers Industrial Equipment & Power Tools) · Brands ·
Search Results · Product Details · Wishlist · Cart · Checkout · Contact · Customer Dashboard ·
Admin Dashboard (`/admin`) · Order Tracking · Login · Register · Forgot Password · 404

## Notes & Known Simplifications

This project was generated in a sandboxed environment without npm registry access, so **dependencies could not be installed or the dev server test-run here** — you'll need to run `npm install` yourself. All relative imports and bracket/syntax balance were verified programmatically before delivery, but please open an issue-style note back to me if `npm run dev` surfaces anything and I'll fix it directly.

A few areas are intentionally simplified first drafts rather than pixel-for-pixel matches to the reference screenshots, and can be deepened on request:
- The admin sales chart is a lightweight inline SVG polyline rather than a full charting library (kept dependency-free per the "pure CSS/React only" requirement).
- Product reviews and admin order data are static sample content, not tied to real orders.
- Checkout is a UI-complete, non-functional payment flow (no real payment processor).
- Login/Register/Forgot Password use a mock local auth (no real backend).

## Brand

- Primary Navy `#0B1F4D` · Primary Gold `#D4A017` · Background `#F8F8F8` · Text `#222222` · Border `#DDDDDD`
- Font: Times New Roman throughout
- Flat colors only, no gradients
