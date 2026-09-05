import { Router } from 'express';

import {
  requireAuth,
  requireCustomer,
} from '../middleware/authMiddleware.js';

import {
  dashboard,
  updateProfile,
  createAddress,
  deleteAddress,
  setDefaultAddress,
  removeWishlistItem,
  readNotification,
  readAllNotifications,
  updatePreferences,
  changePassword,
  requestCreditTopup,
} from '../controllers/customerController.js';

const router = Router();


// ============================================================
// ALL CUSTOMER ROUTES REQUIRE LOGIN + CUSTOMER ROLE
// ============================================================

router.use(
  requireAuth,
  requireCustomer
);


// ============================================================
// DASHBOARD
// GET /api/customer/dashboard
// ============================================================

router.get(
  '/dashboard',
  dashboard
);


// ============================================================
// PROFILE
// PATCH /api/customer/profile
// ============================================================

router.patch(
  '/profile',
  updateProfile
);


// ============================================================
// ADDRESSES
// ============================================================

router.post(
  '/addresses',
  createAddress
);

router.delete(
  '/addresses/:id',
  deleteAddress
);

router.patch(
  '/addresses/:id/default',
  setDefaultAddress
);


// ============================================================
// WISHLIST
// ============================================================

router.delete(
  '/wishlist/:id',
  removeWishlistItem
);


// ============================================================
// NOTIFICATIONS
// IMPORTANT: read-all must come before :id/read
// ============================================================

router.patch(
  '/notifications/read-all',
  readAllNotifications
);

router.patch(
  '/notifications/:id/read',
  readNotification
);


// ============================================================
// PREFERENCES
// ============================================================

router.patch(
  '/preferences',
  updatePreferences
);


// ============================================================
// PASSWORD
// ============================================================

router.patch(
  '/password',
  changePassword
);


// ============================================================
// CREDIT
// ============================================================

router.post(
  '/credit/topup',
  requestCreditTopup
);


export default router;