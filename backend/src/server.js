import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';


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
  express.json()
);


app.use(
  express.urlencoded({
    extended: true,
  })
);


// ============================================================
// HEALTH CHECK
// ============================================================

app.get(
  '/api/health',
  (req, res) => {

    res.json({
      success: true,

      message:
        'Apex Machinery API is running.',

      timestamp:
        new Date().toISOString(),
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
// ROUTE DEBUG
// ============================================================

console.log(
  '✅ Auth routes mounted at /api/auth'
);

console.log(
  '✅ Customer routes mounted at /api/customer'
);


// ============================================================
// 404
// MUST COME AFTER ALL ROUTES
// ============================================================

app.use(
  (req, res) => {

    res
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
      return next(error);
    }


    res
      .status(
        error.status ||
        error.statusCode ||
        500
      )
      .json({
        success: false,

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
      `Health: http://localhost:${PORT}/api/health`
    );

    console.log(
      `Auth API: http://localhost:${PORT}/api/auth`
    );

    console.log(
      `Customer API: http://localhost:${PORT}/api/customer`
    );

    console.log(
      `Frontend: ${FRONTEND_URL}`
    );

    console.log(
      '========================================'
    );

  }
);