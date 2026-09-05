import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js';
import homeRoutes from './routes/homeRoutes.js';


// ============================================================
// APP
// ============================================================

const app = express();


// ============================================================
// CONFIGURATION
// ============================================================

const PORT =
  process.env.PORT || 5000;

const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  process.env.CLIENT_URL ||
  'http://localhost:5173';


// ============================================================
// MIDDLEWARE
// ============================================================

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);


app.use(
  express.json({
    limit: '10mb',
  })
);


app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
);


// ============================================================
// REQUEST LOGGER
// ============================================================

app.use(
  (
    req,
    res,
    next
  ) => {

    console.log(
      `[API] ${req.method} ${req.originalUrl}`
    );

    next();

  }
);


// ============================================================
// HEALTH CHECK
// ============================================================

app.get(
  '/api/health',
  (
    req,
    res
  ) => {

    return res.json({
      success: true,

      message:
        'Apex Machinery API is running.',

      timestamp:
        new Date().toISOString(),

      environment:
        process.env.NODE_ENV ||
        'development',
    });

  }
);


// ============================================================
// ROOT API CHECK
// ============================================================

app.get(
  '/api',
  (
    req,
    res
  ) => {

    return res.json({
      success: true,

      message:
        'Welcome to the Apex Machinery API.',

      endpoints: {

        health:
          '/api/health',

        auth:
          '/api/auth',

        customer:
          '/api/customer',

        admin:
          '/api/admin',

        products:
          '/api/products',

        productCategories:
          '/api/products/categories',

        home:
          '/api/home',
      },
    });

  }
);


// ============================================================
// AUTH ROUTES
// ============================================================

app.use(
  '/api/auth',
  authRoutes
);


// ============================================================
// CUSTOMER ROUTES
// ============================================================

app.use(
  '/api/customer',
  customerRoutes
);


// ============================================================
// ADMIN ROUTES
// ============================================================

app.use(
  '/api/admin',
  adminRoutes
);


// ============================================================
// PUBLIC PRODUCT ROUTES
// ============================================================
//
// Public catalogue routes:
//
// GET /api/products
// GET /api/products/categories
// GET /api/products/:id
//
// ============================================================

app.use(
  '/api/products',
  productRoutes
);


// ============================================================
// PUBLIC HOME ROUTES
// ============================================================
//
// Fully database-backed homepage.
//
// GET /api/home
//
// This returns:
//
// hero
// stats
// about
// featured products
// homepage categories
// brands
// features
// testimonials
// CTA
//
// ============================================================

app.use(
  '/api/home',
  homeRoutes
);


// ============================================================
// ROUTE DEBUG
// ============================================================

console.log(
  '✅ Auth routes mounted at /api/auth'
);

console.log(
  '✅ Customer routes mounted at /api/customer'
);

console.log(
  '✅ Admin routes mounted at /api/admin'
);

console.log(
  '✅ Product routes mounted at /api/products'
);

console.log(
  '✅ Home routes mounted at /api/home'
);


// ============================================================
// 404
// MUST COME AFTER ALL ROUTES
// ============================================================

app.use(
  (
    req,
    res
  ) => {

    return res
      .status(404)
      .json({

        success: false,

        message:
          `Route not found: ${req.method} ${req.originalUrl}`,

      });

  }
);


// ============================================================
// ERROR HANDLER
// ============================================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {

    console.error(
      '[SERVER ERROR]',
      error
    );


    if (
      res.headersSent
    ) {

      return next(
        error
      );

    }


    const status =
      error.status ||
      error.statusCode ||
      500;


    return res
      .status(status)
      .json({

        success: false,

        message:
          error.message ||
          'Internal server error.',

        ...(
          process.env.NODE_ENV ===
          'development'
            ? {
                stack:
                  error.stack,
              }
            : {}
        ),

      });

  }
);


// ============================================================
// START SERVER
// ============================================================

app.listen(
  PORT,
  () => {

    console.log(
      '========================================'
    );

    console.log(
      '       APEX MACHINERY API'
    );

    console.log(
      '========================================'
    );


    console.log(
      `Server: http://localhost:${PORT}`
    );


    console.log(
      `API Root: http://localhost:${PORT}/api`
    );


    console.log(
      `Health: http://localhost:${PORT}/api/health`
    );


    console.log(
      `Auth API: http://localhost:${PORT}/api/auth`
    );


    console.log(
      `Customer API: http://localhost:${PORT}/api/customer`
    );


    console.log(
      `Admin API: http://localhost:${PORT}/api/admin`
    );


    console.log(
      `Products API: http://localhost:${PORT}/api/products`
    );


    console.log(
      `Product Categories API: http://localhost:${PORT}/api/products/categories`
    );


    console.log(
      `Home API: http://localhost:${PORT}/api/home`
    );


    console.log(
      `Frontend: ${FRONTEND_URL}`
    );


    console.log(
      '========================================'
    );

  }
);