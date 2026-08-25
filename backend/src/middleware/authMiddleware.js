import { supabase } from '../config/supabase.js';


// ============================================================
// APEX MACHINERY
// AUTHENTICATION MIDDLEWARE
// ============================================================
//
// Handles:
//
// 1. requireAuth
//    Verifies the Supabase access token.
//
// 2. requireAdmin
//    Verifies that the authenticated user's profile has
//    role = "admin".
//
// IMPORTANT:
// This file runs ONLY on the backend.
// Never expose the Supabase service-role key to the frontend.
// ============================================================


// ============================================================
// GET BEARER TOKEN
// ============================================================

function getBearerToken(req) {

  const authorization =
    req.headers.authorization;


  if (!authorization) {

    return null;

  }


  if (
    authorization
      .toLowerCase()
      .startsWith('bearer ')
  ) {

    return authorization
      .slice(7)
      .trim();

  }


  // Also allow a raw token, although the frontend
  // should normally send "Bearer <token>".

  return authorization.trim();

}


// ============================================================
// REQUIRE AUTHENTICATION
// ============================================================

export async function requireAuth(
  req,
  res,
  next
) {

  try {

    // ========================================================
    // GET TOKEN
    // ========================================================

    const token =
      getBearerToken(req);


    if (!token) {

      return res.status(401).json({

        success: false,

        message:
          'Authentication required.',

      });

    }


    // ========================================================
    // VERIFY TOKEN WITH SUPABASE
    // ========================================================

    const {
      data,
      error,
    } =
      await supabase.auth.getUser(
        token
      );


    if (
      error ||
      !data?.user
    ) {

      console.error(
        '[AUTH TOKEN INVALID]',
        error?.message || 'Unknown authentication error'
      );


      return res.status(401).json({

        success: false,

        message:
          'Invalid or expired authentication token.',

      });

    }


    // ========================================================
    // ATTACH AUTH USER
    // ========================================================

    req.user =
      data.user;


    // ========================================================
    // CONTINUE
    // ========================================================

    return next();

  } catch (error) {

    console.error(
      '[AUTH MIDDLEWARE ERROR]',
      error
    );


    return res.status(401).json({

      success: false,

      message:
        'Authentication failed.',

    });

  }

}


// ============================================================
// REQUIRE ADMIN
// ============================================================
//
// IMPORTANT:
//
// This middleware should normally be used AFTER:
//
// requireAuth
//
// Example:
//
// router.get(
//   '/admin',
//   requireAuth,
//   requireAdmin,
//   controller
// );
//
// ============================================================

export async function requireAdmin(
  req,
  res,
  next
) {

  try {

    // ========================================================
    // AUTHENTICATION CHECK
    // ========================================================

    if (!req.user?.id) {

      return res.status(401).json({

        success: false,

        message:
          'Authentication required.',

      });

    }


    // ========================================================
    // LOAD USER ROLE
    // ========================================================

    const {
      data: profile,
      error,
    } =
      await supabase
        .from('profiles')
        .select(
          'id, role'
        )
        .eq(
          'id',
          req.user.id
        )
        .maybeSingle();


    // ========================================================
    // PROFILE ERROR
    // ========================================================

    if (error) {

      console.error(
        '[ADMIN PROFILE ERROR]',
        error
      );


      return res.status(500).json({

        success: false,

        message:
          'Unable to verify administrator account.',

      });

    }


    // ========================================================
    // PROFILE NOT FOUND
    // ========================================================

    if (!profile) {

      return res.status(403).json({

        success: false,

        message:
          'User profile not found.',

      });

    }


    // ========================================================
    // ADMIN CHECK
    // ========================================================

    if (
      profile.role !== 'admin' &&
      profile.role !== 'administrator'
    ) {

      return res.status(403).json({

        success: false,

        message:
          'Administrator access required.',

      });

    }


    // ========================================================
    // ATTACH ROLE
    // ========================================================

    req.userRole =
      profile.role;


    // ========================================================
    // CONTINUE
    // ========================================================

    return next();

  } catch (error) {

    console.error(
      '[ADMIN MIDDLEWARE ERROR]',
      error
    );


    return res.status(403).json({

      success: false,

      message:
        'Administrator authorization failed.',

    });

  }

}


// ============================================================
// OPTIONAL CUSTOMER CHECK
// ============================================================
//
// Useful later for routes that should only be accessible
// to normal customers.
//
// ============================================================

export async function requireCustomer(
  req,
  res,
  next
) {

  try {

    if (!req.user?.id) {

      return res.status(401).json({

        success: false,

        message:
          'Authentication required.',

      });

    }


    const {
      data: profile,
      error,
    } =
      await supabase
        .from('profiles')
        .select(
          'id, role'
        )
        .eq(
          'id',
          req.user.id
        )
        .maybeSingle();


    if (error) {

      console.error(
        '[CUSTOMER PROFILE ERROR]',
        error
      );


      return res.status(500).json({

        success: false,

        message:
          'Unable to verify customer account.',

      });

    }


    if (!profile) {

      return res.status(403).json({

        success: false,

        message:
          'User profile not found.',

      });

    }


    if (
      profile.role !== 'customer'
    ) {

      return res.status(403).json({

        success: false,

        message:
          'Customer access required.',

      });

    }


    req.userRole =
      profile.role;


    return next();

  } catch (error) {

    console.error(
      '[CUSTOMER MIDDLEWARE ERROR]',
      error
    );


    return res.status(403).json({

      success: false,

      message:
        'Customer authorization failed.',

    });

  }

}