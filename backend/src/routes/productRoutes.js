import {
  Router,
} from 'express';

import {
  getProducts,
  getProduct,
  getCategories,
} from '../controllers/publicProductController.js';


const router =
  Router();


// ============================================================
// PUBLIC PRODUCT ROUTES
// ============================================================

router.get(
  '/',
  getProducts
);


router.get(
  '/categories',
  getCategories
);


router.get(
  '/:id',
  getProduct
);


export default router;