import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
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
// ALLOWED ORIGINS
// ============================================================

const allowedOrigins =
  new Set(
    [
      'http://localhost:5173',
      'http://127.0.0.1:5173',

      'https://www.apexmachinery256.com',
      'https://apexmachinery256.com',

      'https://apexmachinery-gslr-ay1qjtjbv-eth-tech.vercel.app',

      process.env.FRONTEND_URL,
      process.env.CLIENT_URL,
    ].filter(
      Boolean
    )
  );


// ============================================================
// CORS
// ============================================================

app.use(
  cors({

    origin: (
      origin,
      callback
    ) => {

      // ------------------------------------------------------
      // Allow requests without Origin
      // Postman, curl, server-to-server, etc.
      // ------------------------------------------------------

      if (
        !origin
      ) {

        return callback(
          null,
          true
        );

      }


      // ------------------------------------------------------
      // Allow trusted frontend origins
      // ------------------------------------------------------

      if (
        allowedOrigins.has(
          origin
        )
      ) {

        console.log(
          `[CORS ALLOWED] ${origin}`
        );


        return callback(
          null,
          true
        );

      }


      // ------------------------------------------------------
      // Block unknown origins
      // ------------------------------------------------------

      console.warn(
        `[CORS BLOCKED] ${origin}`
      );


      const error =
        new Error(
          `CORS blocked origin: ${origin}`
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

  })
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

    console.log(
      `[API] ${req.method} ${req.originalUrl}`
    );


    console.log(
      `[REQUEST ORIGIN] ${
        req.headers.origin ||
        'none'
      }`
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

    res.json({

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

    res.json({

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

        products:
          '/api/products',

        productCategories:
          '/api/products/categories',

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
// 404
// ============================================================

app.use(
  (
    req,
    res
  ) => {

    res
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


    res
      .status(
        status
      )
      .json({

        success:
          false,

        message:
          error.message ||
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
      ' - /api/products'
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
    // EMAIL CONFIGURATION STATUS
    // Never print the actual App Password.
    // ========================================================

    const gmailUser =
      String(
        process.env.GMAIL_USER ||
        ''
      ).trim();


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
      ).trim();


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