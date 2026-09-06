import {
  Router,
} from 'express';

import {
  getAdminReports,
} from '../controllers/adminReportsController.js';


const router =
  Router();


// ============================================================
// ADMIN REPORTS
//
// GET /api/admin/reports
// ============================================================

router.get(
  '/',
  getAdminReports
);


export default router;