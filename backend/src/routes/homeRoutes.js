import {
  Router,
} from 'express';

import {
  getHomePage,
} from '../controllers/homeController.js';


const router =
  Router();


// ============================================================
// PUBLIC HOME PAGE
// ============================================================

router.get(
  '/',
  getHomePage
);


export default router;