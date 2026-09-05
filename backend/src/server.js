import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import adminInventoryRoutes from './routes/adminInventoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import homeRoutes from './routes/homeRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

import {
  verifyEmailService,
} from './services/emailService.js';


// ============================================================
// APP
// ============================================================

const app =
  express();


const PORT =
  process.env.PORT ||
  5000;


// ============================================================
// HELPERS
// ============================================================

function cleanEnvUrl(
  value
) {

  if (!value) {

    return null;

  }


  return String(
    value
  )
    .trim()
    .replace(
      /\/+$/,
      ''
    );

}


// ============================================================
// ALLOWED ORIGINS
// ============================================================

const allowedOrigins =
  new Set(
    [

      // ------------------------------------------------------
      // LOCAL DEVELOPMENT
      // ------------------------------------------------------

      'http://localhost:5173',

      'http://127.0.0.1:5173',

      'http://localhost:5174',

      'http://127.0.0.1:5174',


      // ------------------------------------------------------
      // PRODUCTION DOMAIN
      // ------------------------------------------------------

      'https://www.apexmachinery256.com',

      'https://apexmachinery256.com',


      // ------------------------------------------------------
      // VERCEL
      // ------------------------------------------------------

      'https://apexmachinery-gslr-ay1qjtjbv-eth-tech.vercel.app',


      // ------------------------------------------------------
      // ENVIRONMENT-BASED FRONTENDS
      // ------------------------------------------------------

      cleanEnvUrl(
        process.env.FRONTEND_URL
      ),

      cleanEnvUrl(
        process.env.CLIENT_URL
      ),

    ].filter(
      Boolean
    )
  );


// ============================================================
// CORS OPTIONS
// ============================================================

const corsOptions = {

  origin: (
    origin,
    callback
  ) => {

    // --------------------------------------------------------
    // Allow requests without Origin
    //
    // Examples:
    // - curl
    // - Postman
    // - server-to-server
    // - direct browser navigation
    // --------------------------------------------------------

    if (!origin) {

      return callback(
        null,
        true
      );

    }


    const normalizedOrigin =
      cleanEnvUrl(
        origin
      );


    // --------------------------------------------------------
    // ALLOW TRUSTED ORIGIN
    // --------------------------------------------------------

    if (
      allowedOrigins.has(
        normalizedOrigin
      )
    ) {

      console.log(
        `[CORS ALLOWED] ${normalizedOrigin}`
      );


      return callback(
        null,
        true
      );

    }


    // --------------------------------------------------------
    // BLOCK UNKNOWN ORIGIN
    // --------------------------------------------------------

    console.warn(
      `[CORS BLOCKED] ${normalizedOrigin}`
    );


    const error =
      new Error(
        `CORS blocked origin: ${normalizedOrigin}`
      );


    error.status =
      403;


    return callback(
      error
    );

  },


  credentials:
    true,


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


  optionsSuccessStatus:
    204,

};


// ============================================================
// CORS
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
    limit:
      '10mb',
  })
);


app.use(
  express.urlencoded({

    extended:
      true,

    limit:
      '10mb',

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

    const startedAt =
      Date.now();


    console.log(
      `[API] ${req.method} ${req.originalUrl}`
    );


    console.log(
      `[REQUEST ORIGIN] ${
        req.headers.origin ||
        'none'
      }`
    );


    res.on(
      'finish',
      () => {

        const duration =
          Date.now() -
          startedAt;


        console.log(
          `[API RESPONSE] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`
        );

      }
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

    return res
      .status(
        200
      )
      .json({

        success:
          true,

        message:
          'Apex Machinery API is running.',

        timestamp:
          new Date()
            .toISOString(),

        environment:
          process.env.NODE_ENV ||
          'development',

        requestOrigin:
          req.headers.origin ||
          null,

        allowedOrigins:
          Array.from(
            allowedOrigins
          ),

        services: {

          database:
            Boolean(
              process.env.SUPABASE_URL
            ),

          supabaseServiceRole:
            Boolean(
              process.env.SUPABASE_SERVICE_ROLE_KEY
            ),

          emailConfigured:
            Boolean(
              process.env.GMAIL_USER &&
              process.env.GMAIL_APP_PASSWORD
            ),

        },

      });

  }
);


// ============================================================
// ROOT API
// ============================================================

app.get(
  '/api',
  (
    req,
    res
  ) => {

    return res
      .status(
        200
      )
      .json({

        success:
          true,

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

          adminInventory:
            '/api/admin/inventory',

          products:
            '/api/products',

          productCategories:
            '/api/products/categories',

          productExample:
            '/api/products/industrial-reflective-safety-vest-93',

          home:
            '/api/home',

          contact:
            '/api/contact',

          contactAdmin:
            '/api/contact/admin',

        },

      });

  }
);


// ============================================================
// ROUTES
// ============================================================


// ------------------------------------------------------------
// AUTH
// ------------------------------------------------------------

app.use(
  '/api/auth',
  authRoutes
);


// ------------------------------------------------------------
// CUSTOMER
// ------------------------------------------------------------

app.use(
  '/api/customer',
  customerRoutes
);


// ------------------------------------------------------------
// ADMIN INVENTORY
//
// IMPORTANT:
// Mount this BEFORE the general /api/admin router.
// ------------------------------------------------------------

app.use(
  '/api/admin/inventory',
  adminInventoryRoutes
);


// ------------------------------------------------------------
// ADMIN
// ------------------------------------------------------------

app.use(
  '/api/admin',
  adminRoutes
);


// ------------------------------------------------------------
// PRODUCTS
// ------------------------------------------------------------

app.use(
  '/api/products',
  productRoutes
);


// ------------------------------------------------------------
// HOME
// ------------------------------------------------------------

app.use(
  '/api/home',
  homeRoutes
);


// ------------------------------------------------------------
// CONTACT
// ------------------------------------------------------------

app.use(
  '/api/contact',
  contactRoutes
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
  '✅ Admin inventory routes mounted at /api/admin/inventory'
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


console.log(
  '✅ Contact routes mounted at /api/contact'
);


// ============================================================
// 404 HANDLER
// ============================================================

app.use(
  (
    req,
    res
  ) => {

    return res
      .status(
        404
      )
      .json({

        success:
          false,

        message:
          `Route not found: ${req.method} ${req.originalUrl}`,

      });

  }
);


// ============================================================
// GLOBAL ERROR HANDLER
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
      {

        message:
          error?.message,

        status:
          error?.status ||
          error?.statusCode,

        stack:
          process.env.NODE_ENV ===
          'development'
            ? error?.stack
            : undefined,

      }
    );


    if (
      res.headersSent
    ) {

      return next(
        error
      );

    }


    const status =
      Number(
        error?.status ||
        error?.statusCode ||
        500
      );


    return res
      .status(
        status
      )
      .json({

        success:
          false,

        message:
          error?.message ||
          'Internal server error.',

      });

  }
);


// ============================================================
// START SERVER
// ============================================================

app.listen(
  PORT,
  async () => {

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


    Array
      .from(
        allowedOrigins
      )
      .forEach(
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


    // ========================================================
    // ROUTES
    // ========================================================

    console.log(
      'Mounted API routes:'
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
      ' - /api/admin/inventory'
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
      ' - /api/contact'
    );


    console.log(
      '----------------------------------------'
    );


    // ========================================================
    // DATABASE CONFIGURATION
    // ========================================================

    console.log(
      'Database configuration:'
    );


    console.log(
      ` - Supabase URL configured: ${
        process.env.SUPABASE_URL
          ? 'YES'
          : 'NO'
      }`
    );


    console.log(
      ` - Supabase service role configured: ${
        process.env.SUPABASE_SERVICE_ROLE_KEY
          ? 'YES'
          : 'NO'
      }`
    );


    console.log(
      '----------------------------------------'
    );


    // ========================================================
    // EMAIL CONFIGURATION
    //
    // NEVER PRINT THE ACTUAL GMAIL APP PASSWORD.
    // ========================================================

    const gmailUser =
      String(
        process.env.GMAIL_USER ||
        ''
      )
        .trim();


    const gmailPassword =
      String(
        process.env.GMAIL_APP_PASSWORD ||
        ''
      )
        .replace(
          /\s+/g,
          ''
        )
        .trim();


    const contactEmail =
      String(
        process.env.APEX_CONTACT_EMAIL ||
        ''
      )
        .trim();


    console.log(
      'Email configuration:'
    );


    console.log(
      ` - Gmail user: ${
        gmailUser ||
        'MISSING'
      }`
    );


    console.log(
      ` - App password configured: ${
        gmailPassword
          ? 'YES'
          : 'NO'
      }`
    );


    console.log(
      ` - App password length: ${
        gmailPassword.length
      }`
    );


    console.log(
      ` - Contact recipient: ${
        contactEmail ||
        gmailUser ||
        'MISSING'
      }`
    );


    console.log(
      '----------------------------------------'
    );


    // ========================================================
    // VERIFY GMAIL SMTP
    // ========================================================

    try {

      console.log(
        'Checking Gmail SMTP...'
      );


      const emailStatus =
        await verifyEmailService();


      if (
        emailStatus?.success
      ) {

        console.log(
          '✅ Gmail SMTP is ready.'
        );

      } else {

        console.error(
          '❌ Gmail SMTP is not ready.'
        );


        console.error(
          `Reason: ${
            emailStatus?.message ||
            'Unknown email configuration error.'
          }`
        );

      }

    } catch (
      error
    ) {

      console.error(
        '❌ Gmail SMTP startup check failed.'
      );


      console.error(
        error?.message ||
        error
      );

    }


    console.log(
      '========================================'
    );

  }
);