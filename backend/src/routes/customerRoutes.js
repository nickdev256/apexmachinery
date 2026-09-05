import {
  Router,
} from 'express';

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
  readNotification,
  readAllNotifications,
  updatePreferences,
  changePassword,
  requestCreditTopup,
  createOrder,
} from '../controllers/customerController.js';

import {
  getWishlist,
  addWishlistItem,
  removeWishlistItem,
  clearWishlist,
} from '../controllers/wishlistController.js';


const router =
  Router();


// ============================================================
// ALL CUSTOMER ROUTES REQUIRE AUTHENTICATION
// ============================================================

router.use(
  requireAuth,
  requireCustomer
);


// ============================================================
// DASHBOARD
// ============================================================

router.get(
  '/dashboard',
  dashboard
);


// ============================================================
// ORDERS
// ============================================================

router.post(
  '/orders',
  createOrder
);


// ============================================================
// PROFILE
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
//
// IMPORTANT:
// /wishlist must be before /wishlist/:id where appropriate.
// ============================================================

router.get(
  '/wishlist',
  getWishlist
);


router.post(
  '/wishlist',
  addWishlistItem
);


router.delete(
  '/wishlist',
  clearWishlist
);


router.delete(
  '/wishlist/:id',
  removeWishlistItem
);


// ============================================================
// NOTIFICATIONS
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


// ============================================================
// EXPORT
// ============================================================

export default router;