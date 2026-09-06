import {
  Router,
} from 'express';

import {
  requireAuth,
  requireAdmin,
} from '../middleware/authMiddleware.js';


// ============================================================
// ADMIN CONTROLLER
// ============================================================

import {
  getAdminDashboard,
  getAdminOrders,
  getAdminOrder,
  updateAdminOrderStatus,
} from '../controllers/adminController.js';


// ============================================================
// CATEGORY CONTROLLER
// ============================================================

import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from '../controllers/categoryController.js';


// ============================================================
// PRODUCT CONTROLLER
// ============================================================

import {
  getAdminProducts,
  getAdminProduct,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from '../controllers/productController.js';


// ============================================================
// ADMIN INVENTORY ROUTES
// ============================================================

import adminInventoryRoutes
  from './adminInventoryRoutes.js';


// ============================================================
// ADMIN REPORTS ROUTES
// ============================================================

import adminReportsRoutes
  from './adminReportsRoutes.js';


// ============================================================
// ROUTER
// ============================================================

const router =
  Router();


// ============================================================
// PROTECT ALL ADMIN ROUTES
// ============================================================

router.use(
  requireAuth,
  requireAdmin
);


// ============================================================
// DASHBOARD
// ============================================================

router.get(
  '/dashboard',
  getAdminDashboard
);


// ============================================================
// ORDERS
// ============================================================

router.get(
  '/orders',
  getAdminOrders
);


router.get(
  '/orders/:id',
  getAdminOrder
);


router.patch(
  '/orders/:id/status',
  updateAdminOrderStatus
);


// ============================================================
// INVENTORY
//
// GET    /api/admin/inventory
// PATCH  /api/admin/inventory/:id
// POST   /api/admin/inventory/:id/restock
// ============================================================

router.use(
  '/inventory',
  adminInventoryRoutes
);


// ============================================================
// REPORTS
//
// GET /api/admin/reports
// ============================================================

router.use(
  '/reports',
  adminReportsRoutes
);


// ============================================================
// CATEGORIES
// ============================================================

router.get(
  '/categories',
  getAdminCategories
);


router.post(
  '/categories',
  createAdminCategory
);


router.patch(
  '/categories/:id',
  updateAdminCategory
);


router.delete(
  '/categories/:id',
  deleteAdminCategory
);


// ============================================================
// PRODUCTS
// ============================================================

router.get(
  '/products',
  getAdminProducts
);


router.get(
  '/products/:id',
  getAdminProduct
);


router.post(
  '/products',
  createAdminProduct
);


router.patch(
  '/products/:id',
  updateAdminProduct
);


router.delete(
  '/products/:id',
  deleteAdminProduct
);


// ============================================================
// EXPORT
// ============================================================

export default router;