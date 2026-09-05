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
// NORMALIZE ORIGIN
// ============================================================

function normalizeOrigin(
  value
) {

  if (
    !value ||
    typeof value !== 'string'
  ) {

    return null;

  }


  return value
    .trim()
    .replace(/\/+$/, '');

}


// ============================================================
// ALLOWED FRONTEND ORIGINS
// ============================================================

const allowedOrigins =
  [
    // --------------------------------------------------------
    // LOCAL DEVELOPMENT
    // --------------------------------------------------------

    'http://localhost:5173',
    'http://127.0.0.1:5173',


    // --------------------------------------------------------
    // PRODUCTION DOMAIN
    // --------------------------------------------------------

    'https://www.apexmachinery256.com',
    'https://apexmachinery256.com',


    // --------------------------------------------------------
    // VERCEL DEPLOYMENT
    // --------------------------------------------------------

    'https://apexmachinery-gslr-ay1qjtjbv-eth-tech.vercel.app',


    // --------------------------------------------------------
    // ENVIRONMENT CONFIGURATION
    // --------------------------------------------------------

    process.env.FRONTEND_URL,
    process.env.CLIENT_URL,
  ]
    .map(
      normalizeOrigin
    )
    .filter(Boolean)
    .filter(
      (
        origin,
        index,
        array
      ) =>
        array.indexOf(
          origin
        ) === index
    );


// ============================================================
// CORS CHECK
// ============================================================

function isAllowedOrigin(
  origin
) {

  /*
   * Requests without an Origin header:
   *
   * - Postman
   * - Render health checks
   * - curl
   * - server-to-server requests
   */

  if (
    !origin
  ) {

    return true;

  }


  const normalizedOrigin =
    normalizeOrigin(
      origin
    );


  return allowedOrigins.includes(
    normalizedOrigin
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

    if (
      isAllowedOrigin(
        origin
      )
    ) {

      return callback(
        null,
        true
      );

    }


    console.warn(
      `[CORS BLOCKED] ${
        origin ||
        'Unknown origin'
      }`
    );


    const error =
      new Error(
        `CORS blocked for origin: ${origin}`
      );


    error.status = 403;


    return callback(
      error
    );

  },


  credentials: true,


  methods: [
    'GET',
    'HEAD',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
  ],


  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'Origin',
    'X-Requested-With',
  ],


  optionsSuccessStatus: 204,

};


// ============================================================
// CORS MIDDLEWARE
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


    if (
      req.headers.origin
    ) {

      console.log(
        `[ORIGIN] ${req.headers.origin}`
      );

    }


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
      '----------------------------------------'
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
      'API endpoints:'
    );


    console.log(
      ' - /api/health'
    );

    console.log(
      ' - /api/auth'
    );

    console.log(
      ' - /api/customer'
    );

    console.log(
      ' - /api/admin'
    );

    console.log(
      ' - /api/products'
    );

    console.log(
      ' - /api/products/categories'
    );

    console.log(
      ' - /api/home'
    );


    console.log(
      '========================================'
    );

  }
);