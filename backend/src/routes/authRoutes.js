import { Router } from 'express';

import {
  register,
  login,
  logout,
  me,
} from '../controllers/authController.js';

import {
  requireAuth,
} from '../middleware/authMiddleware.js';


const router = Router();


// ============================================================
// PUBLIC AUTHENTICATION
// ============================================================

router.post(
  '/register',
  register
);

router.post(
  '/login',
  login
);


// ============================================================
// PROTECTED AUTHENTICATION
// ============================================================

router.post(
  '/logout',
  requireAuth,
  logout
);

router.get(
  '/me',
  requireAuth,
  me
);


// ============================================================
// EXPORT
// ============================================================

export default router;