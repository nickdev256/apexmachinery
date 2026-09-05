import {
  Router,
} from 'express';

import {
  createContactInquiry,
  getContactInquiries,
  updateContactInquiry,
} from '../controllers/contactController.js';


const router =
  Router();


// ============================================================
// PUBLIC
// ============================================================

router.post(
  '/',
  createContactInquiry
);


// ============================================================
// ADMIN
//
// IMPORTANT:
// Add your existing admin authentication middleware here
// before production.
// ============================================================

router.get(
  '/admin',
  getContactInquiries
);


router.patch(
  '/admin/:id',
  updateContactInquiry
);


export default router;