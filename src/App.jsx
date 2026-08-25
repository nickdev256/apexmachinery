import { Routes, Route } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';


// ============================================================
// PUBLIC WEBSITE
// ============================================================

import Home from './pages/Home';
import About from './pages/About';
import Shop from './pages/Shop';
import IndustrialEquipment from './pages/IndustrialEquipment';
import PowerTools from './pages/PowerTools';
import Brands from './pages/Brands';
import SearchResults from './pages/SearchResults';
import ProductDetails from './pages/ProductDetails';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';


// ============================================================
// CUSTOMER PAGES
// ============================================================

import CustomerDashboard from './pages/CustomerDashboard';
import OrderTracking from './pages/OrderTracking';


// ============================================================
// AUTHENTICATION PAGES
// ============================================================

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';


// ============================================================
// 404
// ============================================================

import NotFound from './pages/NotFound';


// ============================================================
// ADMIN PAGES
// ============================================================

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminInventory from './pages/admin/AdminInventory';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';


// ============================================================
// ROUTE PROTECTION
// ============================================================

import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import ProtectedCustomerRoute from './components/ProtectedCustomerRoute';


// ============================================================
// APP
// ============================================================

export default function App() {

  return (

    <Routes>


      {/* ======================================================
          PUBLIC WEBSITE
      ====================================================== */}

      <Route
        element={<MainLayout />}
      >


        {/* ==================================================
            HOME
        ================================================== */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* ==================================================
            ABOUT
        ================================================== */}

        <Route
          path="/about"
          element={<About />}
        />


        {/* ==================================================
            SHOP
        ================================================== */}

        <Route
          path="/shop"
          element={<Shop />}
        />


        {/* ==================================================
            INDUSTRIAL EQUIPMENT
        ================================================== */}

        <Route
          path="/industrial-equipment"
          element={<IndustrialEquipment />}
        />


        {/* ==================================================
            POWER TOOLS
        ================================================== */}

        <Route
          path="/power-tools"
          element={<PowerTools />}
        />


        {/* ==================================================
            BRANDS
        ================================================== */}

        <Route
          path="/brands"
          element={<Brands />}
        />


        {/* ==================================================
            SEARCH
        ================================================== */}

        <Route
          path="/search"
          element={<SearchResults />}
        />


        {/* ==================================================
            PRODUCT DETAILS
        ================================================== */}

        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />


        {/* ==================================================
            WISHLIST
        ================================================== */}

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />


        {/* ==================================================
            CART
        ================================================== */}

        <Route
          path="/cart"
          element={<Cart />}
        />


        {/* ==================================================
            CHECKOUT
        ================================================== */}

        <Route
          path="/checkout"
          element={<Checkout />}
        />


        {/* ==================================================
            CONTACT
        ================================================== */}

        <Route
          path="/contact"
          element={<Contact />}
        />


        {/* ==================================================
            LOGIN
        ================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* ==================================================
            REGISTER
        ================================================== */}

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ==================================================
            FORGOT PASSWORD
        ================================================== */}

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

      </Route>


      {/* ======================================================
          CUSTOMER PROTECTED SYSTEM
      ====================================================== */}
      {/*
          Only authenticated customers can access these routes.

          Not logged in:
              → /login

          Customer:
              → allowed

          Admin:
              → /admin
      */}

      <Route
        element={<ProtectedCustomerRoute />}
      >


        {/* ==================================================
            CUSTOMER DASHBOARD
        ================================================== */}

        <Route
          path="/dashboard"
          element={<CustomerDashboard />}
        />


        {/* ==================================================
            CUSTOMER ORDER TRACKING
        ================================================== */}

        <Route
          path="/order-tracking"
          element={<OrderTracking />}
        />

      </Route>


      {/* ======================================================
          ADMIN PROTECTED SYSTEM
      ====================================================== */}
      {/*
          Only authenticated administrators can access these
          routes.

          Not logged in:
              → /login

          Customer:
              → /dashboard

          Admin:
              → allowed
      */}

      <Route
        element={<ProtectedAdminRoute />}
      >


        {/* ==================================================
            ADMIN DASHBOARD
        ================================================== */}

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />


        {/* ==================================================
            ADMIN ORDERS
        ================================================== */}

        <Route
          path="/admin/orders"
          element={<AdminOrders />}
        />


        {/* ==================================================
            ADMIN INVENTORY
        ================================================== */}

        <Route
          path="/admin/inventory"
          element={<AdminInventory />}
        />


        {/* ==================================================
            ADMIN CUSTOMERS
        ================================================== */}

        <Route
          path="/admin/customers"
          element={<AdminCustomers />}
        />


        {/* ==================================================
            ADMIN PRODUCTS
        ================================================== */}

        <Route
          path="/admin/products"
          element={<AdminProducts />}
        />


        {/* ==================================================
            ADMIN CATEGORIES
        ================================================== */}

        <Route
          path="/admin/categories"
          element={<AdminCategories />}
        />


        {/* ==================================================
            ADMIN NOTIFICATIONS
        ================================================== */}

        <Route
          path="/admin/notifications"
          element={<AdminNotifications />}
        />


        {/* ==================================================
            ADMIN REPORTS
        ================================================== */}

        <Route
          path="/admin/reports"
          element={<AdminReports />}
        />


        {/* ==================================================
            ADMIN SETTINGS
        ================================================== */}

        <Route
          path="/admin/settings"
          element={<AdminSettings />}
        />

      </Route>


      {/* ======================================================
          404 NOT FOUND
      ====================================================== */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>

  );

}