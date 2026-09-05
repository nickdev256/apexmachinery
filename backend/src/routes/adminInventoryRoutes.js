import {
  Router,
} from 'express';

import {
  getAdminInventory,
  updateAdminInventory,
  restockAdminProduct,
} from '../controllers/adminInventoryController.js';


const router =
  Router();


// ============================================================
// GET INVENTORY
// GET /api/admin/inventory
// ============================================================

router.get(
  '/',
  getAdminInventory
);


// ============================================================
// UPDATE INVENTORY
// PATCH /api/admin/inventory/:id
// ============================================================

router.patch(
  '/:id',
  updateAdminInventory
);


// ============================================================
// RESTOCK PRODUCT
// POST /api/admin/inventory/:id/restock
// ============================================================

router.post(
  '/:id/restock',
  restockAdminProduct
);


export default router;