import {
  supabaseAdmin,
  supabaseAuth,
} from '../config/supabase.js';


// ============================================================
// APEX MACHINERY
// AUTHENTICATION MIDDLEWARE
// ============================================================
//
// Handles:
//
// 1. requireAuth
//    Verifies Supabase access token.
//
// 2. requireAdmin
//    Allows only:
//      admin
//      administrator
//
// 3. requireCustomer
//    Allows only:
//      customer
//
// IMPORTANT:
//
// supabaseAuth
//   → token verification
//
// supabaseAdmin
//   → profiles table / role verification
//
// NEVER expose SUPABASE_SERVICE_ROLE_KEY to React/Vite.
// ============================================================


// ============================================================
// HELPERS
// ============================================================

function normalizeRole(value) {

  return String(
    value ?? ''
  )
    .trim()
    .toLowerCase();

}


// ============================================================
// GET BEARER TOKEN
// ============================================================

function getBearerToken(req) {

  const authorization =
    req.headers.authorization;


  if (!authorization) {

    return null;

  }


  const authHeader =
    String(
      authorization
    ).trim();


  if (
    authHeader
      .toLowerCase()
      .startsWith('bearer ')
  ) {

    const token =
      authHeader
        .slice(7)
        .trim();


    return token || null;

  }


  // ========================================================
  // RAW TOKENS ARE NOT ACCEPTED
  // ========================================================
  //
  // Frontend should send:
  //
  // Authorization: Bearer <token>
  //
  // ========================================================

  return null;

}


// ============================================================
// LOAD PROFILE
// ============================================================

async function loadProfile(
  userId
) {

  if (!userId) {

    return {
      profile: null,
      error: new Error(
        'User ID is missing.'
      ),
    };

  }


  const {
    data,
    error,
  } =
    await supabaseAdmin
      .from('profiles')
      .select(`
        id,
        name,
        company,
        email,
        role,
        member_since
      `)
      .eq(
        'id',
        userId
      )
      .maybeSingle();


  return {

    profile:
      data || null,

    error:
      error || null,

  };

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
    // GET ACCESS TOKEN
    // ========================================================

    const token =
      getBearerToken(
        req
      );


    if (!token) {

      return res
        .status(401)
        .json({

          success: false,

          message:
            'Authentication required.',

        });

    }


    // ========================================================
    // VERIFY TOKEN
    // ========================================================
    //
    // IMPORTANT:
    //
    // Use supabaseAuth here.
    //
    // This validates the access token against Supabase Auth.
    //
    // ========================================================

    const {
      data,
      error,
    } =
      await supabaseAuth
        .auth
        .getUser(
          token
        );


    // ========================================================
    // INVALID TOKEN
    // ========================================================

    if (
      error ||
      !data?.user?.id
    ) {

      console.error(
        '[AUTH TOKEN INVALID]',
        error?.message ||
        'User not returned by Supabase.'
      );


      return res
        .status(401)
        .json({

          success: false,

          message:
            'Invalid or expired authentication token.',

        });

    }


    // ========================================================
    // ATTACH AUTH INFORMATION
    // ========================================================

    req.user =
      data.user;


    req.accessToken =
      token;


    // ========================================================
    // CONTINUE
    // ========================================================

    return next();


  } catch (error) {

    console.error(
      '[AUTH MIDDLEWARE ERROR]',
      error
    );


    return res
      .status(401)
      .json({

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
// Usage:
//
// router.get(
//   '/something',
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
    // AUTH USER CHECK
    // ========================================================

    if (!req.user?.id) {

      return res
        .status(401)
        .json({

          success: false,

          message:
            'Authentication required.',

        });

    }


    // ========================================================
    // LOAD PROFILE
    // ========================================================

    const {
      profile,
      error,
    } =
      await loadProfile(
        req.user.id
      );


    // ========================================================
    // PROFILE QUERY ERROR
    // ========================================================

    if (error) {

      console.error(
        '[ADMIN PROFILE ERROR]',
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            'Unable to verify administrator account.',

        });

    }


    // ========================================================
    // PROFILE NOT FOUND
    // ========================================================

    if (!profile) {

      console.error(
        '[ADMIN PROFILE NOT FOUND]',
        req.user.id
      );


      return res
        .status(403)
        .json({

          success: false,

          message:
            'User profile not found.',

        });

    }


    // ========================================================
    // NORMALIZE ROLE
    // ========================================================

    const role =
      normalizeRole(
        profile.role
      );


    // ========================================================
    // ADMIN CHECK
    // ========================================================

    const isAdmin =
      role === 'admin' ||
      role === 'administrator';


    if (!isAdmin) {

      console.warn(
        '[ADMIN ACCESS DENIED]',
        {
          userId:
            req.user.id,

          role,
        }
      );


      return res
        .status(403)
        .json({

          success: false,

          message:
            'Administrator access required.',

        });

    }


    // ========================================================
    // ATTACH PROFILE INFORMATION
    // ========================================================

    req.profile = {

      ...profile,

      role,

    };


    req.userRole =
      role;


    // ========================================================
    // CONTINUE
    // ========================================================

    return next();


  } catch (error) {

    console.error(
      '[ADMIN MIDDLEWARE ERROR]',
      error
    );


    return res
      .status(500)
      .json({

        success: false,

        message:
          'Administrator authorization failed.',

      });

  }

}


// ============================================================
// REQUIRE CUSTOMER
// ============================================================
//
// Usage:
//
// router.get(
//   '/customer-route',
//   requireAuth,
//   requireCustomer,
//   controller
// );
//
// ============================================================

export async function requireCustomer(
  req,
  res,
  next
) {

  try {

    // ========================================================
    // AUTH USER CHECK
    // ========================================================

    if (!req.user?.id) {

      return res
        .status(401)
        .json({

          success: false,

          message:
            'Authentication required.',

        });

    }


    // ========================================================
    // LOAD PROFILE
    // ========================================================

    const {
      profile,
      error,
    } =
      await loadProfile(
        req.user.id
      );


    // ========================================================
    // PROFILE QUERY ERROR
    // ========================================================

    if (error) {

      console.error(
        '[CUSTOMER PROFILE ERROR]',
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            'Unable to verify customer account.',

        });

    }


    // ========================================================
    // PROFILE NOT FOUND
    // ========================================================

    if (!profile) {

      console.error(
        '[CUSTOMER PROFILE NOT FOUND]',
        req.user.id
      );


      return res
        .status(403)
        .json({

          success: false,

          message:
            'User profile not found.',

        });

    }


    // ========================================================
    // NORMALIZE ROLE
    // ========================================================

    const role =
      normalizeRole(
        profile.role
      );


    // ========================================================
    // CUSTOMER CHECK
    // ========================================================

    if (
      role !== 'customer'
    ) {

      console.warn(
        '[CUSTOMER ACCESS DENIED]',
        {
          userId:
            req.user.id,

          role,
        }
      );


      return res
        .status(403)
        .json({

          success: false,

          message:
            'Customer access required.',

        });

    }


    // ========================================================
    // ATTACH PROFILE INFORMATION
    // ========================================================

    req.profile = {

      ...profile,

      role,

    };


    req.userRole =
      role;


    // ========================================================
    // CONTINUE
    // ========================================================

    return next();


  } catch (error) {

    console.error(
      '[CUSTOMER MIDDLEWARE ERROR]',
      error
    );


    return res
      .status(500)
      .json({

        success: false,

        message:
          'Customer authorization failed.',

      });

  }

}