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


// ============================================================
// ALLOWED FRONTEND ORIGINS
// ============================================================

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',

  'https://www.apexmachinery256.com',
  'https://apexmachinery256.com',

  'https://apexmachinery-gslr-ay1qjtjbv-eth-tech.vercel.app',
];


// Add Render environment frontend URL if provided
if (
  process.env.FRONTEND_URL &&
  !allowedOrigins.includes(
    process.env.FRONTEND_URL
  )
) {
  allowedOrigins.push(
    process.env.FRONTEND_URL
  );
}


// Add optional CLIENT_URL too
if (
  process.env.CLIENT_URL &&
  !allowedOrigins.includes(
    process.env.CLIENT_URL
  )
) {
  allowedOrigins.push(
    process.env.CLIENT_URL
  );
}


// ============================================================
// CORS CONFIGURATION
// ============================================================

const corsOptions = {

  origin(
    origin,
    callback
  ) {

    /*
     * Requests without an Origin header are allowed.
     *
     * Examples:
     * - direct browser navigation
     * - Render health checks
     * - Postman
     * - server-to-server requests
     */

    if (
      !origin
    ) {
      return callback(
        null,
        true
      );
    }


    if (
      allowedOrigins.includes(
        origin
      )
    ) {

      return callback(
        null,
        true
      );

    }


    console.warn(
      `[CORS BLOCKED] ${origin}`
    );


    return callback(
      new Error(
        `CORS blocked for origin: ${origin}`
      )
    );

  },

  credentials: true,

  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
  ],

};


// ============================================================
// MIDDLEWARE
// ============================================================

app.use(
  cors(
    corsOptions
  )
);


// ============================================================
// BODY PARSERS
// ============================================================

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

      allowedOrigins,

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
// GET /api/home
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
      .status(
        status
      )
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
      `Server running on port: ${PORT}`
    );


    console.log(
      `Environment: ${
        process.env.NODE_ENV ||
        'development'
      }`
    );


    console.log(
      'Allowed frontend origins:'
    );


    allowedOrigins.forEach(
      (
        origin
      ) => {

        console.log(
          ` - ${origin}`
        );

      }
    );


    console.log(
      '----------------------------------------'
    );


    console.log(
      `Health: /api/health`
    );

    console.log(
      `Auth API: /api/auth`
    );

    console.log(
      `Customer API: /api/customer`
    );

    console.log(
      `Admin API: /api/admin`
    );

    console.log(
      `Products API: /api/products`
    );

    console.log(
      `Product Categories API: /api/products/categories`
    );

    console.log(
      `Home API: /api/home`
    );


    console.log(
      '========================================'
    );

  }
);