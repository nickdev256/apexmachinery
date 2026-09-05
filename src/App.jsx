import {
  Routes,
  Route,
} from 'react-router-dom';

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
// ADMIN LAYOUT
// ============================================================

import AdminLayout from './components/admin/AdminLayout';


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


        {/* ====================================================
            DEFAULT HOME PAGE
        ==================================================== */}

        <Route
          index
          element={<Home />}
        />


        {/* ====================================================
            ABOUT
        ==================================================== */}

        <Route
          path="/about"
          element={<About />}
        />


        {/* ====================================================
            SHOP
        ==================================================== */}

        <Route
          path="/shop"
          element={<Shop />}
        />


        {/* ====================================================
            INDUSTRIAL EQUIPMENT
        ==================================================== */}

        <Route
          path="/industrial-equipment"
          element={<IndustrialEquipment />}
        />


        {/* ====================================================
            POWER TOOLS
        ==================================================== */}

        <Route
          path="/power-tools"
          element={<PowerTools />}
        />


        {/* ====================================================
            BRANDS
        ==================================================== */}

        <Route
          path="/brands"
          element={<Brands />}
        />


        {/* ====================================================
            SEARCH
        ==================================================== */}

        <Route
          path="/search"
          element={<SearchResults />}
        />


        {/* ====================================================
            PRODUCT DETAILS
        ==================================================== */}

        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />


        {/* ====================================================
            WISHLIST
        ==================================================== */}

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />


        {/* ====================================================
            CART
        ==================================================== */}

        <Route
          path="/cart"
          element={<Cart />}
        />


        {/* ====================================================
            CHECKOUT
        ==================================================== */}

        <Route
          path="/checkout"
          element={<Checkout />}
        />


        {/* ====================================================
            CONTACT
        ==================================================== */}

        <Route
          path="/contact"
          element={<Contact />}
        />


        {/* ====================================================
            LOGIN
        ==================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* ====================================================
            REGISTER
        ==================================================== */}

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ====================================================
            FORGOT PASSWORD
        ==================================================== */}

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

      </Route>


      {/* ======================================================
          CUSTOMER PROTECTED SYSTEM
      ====================================================== */}

      <Route
        element={<ProtectedCustomerRoute />}
      >


        {/* ====================================================
            CUSTOMER DASHBOARD
        ==================================================== */}

        <Route
          path="/dashboard"
          element={<CustomerDashboard />}
        />


        {/* ====================================================
            ORDER TRACKING
        ==================================================== */}

        <Route
          path="/order-tracking"
          element={<OrderTracking />}
        />

      </Route>


      {/* ======================================================
          ADMIN PROTECTED SYSTEM
      ====================================================== */}

      <Route
        element={<ProtectedAdminRoute />}
      >

        <Route
          path="/admin"
          element={<AdminLayout />}
        >


          {/* ==================================================
              ADMIN DASHBOARD
          ================================================== */}

          <Route
            index
            element={<AdminDashboard />}
          />


          {/* ==================================================
              ORDERS
          ================================================== */}

          <Route
            path="orders"
            element={<AdminOrders />}
          />


          {/* ==================================================
              INVENTORY
          ================================================== */}

          <Route
            path="inventory"
            element={<AdminInventory />}
          />


          {/* ==================================================
              CUSTOMERS
          ================================================== */}

          <Route
            path="customers"
            element={<AdminCustomers />}
          />


          {/* ==================================================
              PRODUCTS
          ================================================== */}

          <Route
            path="products"
            element={<AdminProducts />}
          />


          {/* ==================================================
              CATEGORIES
          ================================================== */}

          <Route
            path="categories"
            element={<AdminCategories />}
          />


          {/* ==================================================
              NOTIFICATIONS
          ================================================== */}

          <Route
            path="notifications"
            element={<AdminNotifications />}
          />


          {/* ==================================================
              REPORTS
          ================================================== */}

          <Route
            path="reports"
            element={<AdminReports />}
          />


          {/* ==================================================
              SETTINGS
          ================================================== */}

          <Route
            path="settings"
            element={<AdminSettings />}
          />

        </Route>

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