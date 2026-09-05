import {
  Router,
} from 'express';

import {
  getProducts,
  getProduct,
  getCategories,
} from '../controllers/publicProductController.js';


// ============================================================
// ROUTER
// ============================================================

const router =
  Router();


// ============================================================
// PUBLIC PRODUCT ROUTES
// ============================================================


// ------------------------------------------------------------
// GET ALL PRODUCTS
// GET /api/products
// ------------------------------------------------------------

router.get(
  '/',
  getProducts
);


// ------------------------------------------------------------
// GET PRODUCT CATEGORIES
// GET /api/products/categories
//
// IMPORTANT:
// This route must stay ABOVE /:id
// ------------------------------------------------------------

router.get(
  '/categories',
  getCategories
);


// ------------------------------------------------------------
// GET ONE PRODUCT BY UUID OR SLUG
//
// Examples:
//
// /api/products/805175e2-2b8d-42d5-b9b0-f0dde87f942b
//
// /api/products/industrial-safety-boots-92
// ------------------------------------------------------------

router.get(
  '/:id',
  getProduct
);


// ============================================================
// EXPORT
// ============================================================

export default router;