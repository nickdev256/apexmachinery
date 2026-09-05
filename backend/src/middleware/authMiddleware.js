import {
  supabaseAdmin,
  supabaseAuth,
} from '../config/supabase.js';


// ============================================================
// APEX MACHINERY
// AUTHENTICATION & AUTHORIZATION MIDDLEWARE
// ============================================================
//
// requireAuth
//   1. Reads Authorization header.
//   2. Verifies Supabase access token.
//   3. Loads the application's profile.
//   4. Attaches user/profile information to req.
//
// requireAdmin
//   Allows:
//     admin
//     administrator
//
// requireCustomer
//   Allows:
//     customer
//
// IMPORTANT:
//
// supabaseAuth
//   → token verification
//
// supabaseAdmin
//   → profiles database access
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
    req.headers?.authorization;


  if (!authorization) {

    return null;

  }


  const authHeader =
    String(
      authorization
    ).trim();


  if (
    !authHeader
      .toLowerCase()
      .startsWith('bearer ')
  ) {

    return null;

  }


  const token =
    authHeader
      .slice(7)
      .trim();


  return (
    token ||
    null
  );

}


// ============================================================
// LOAD APPLICATION PROFILE
// ============================================================

async function loadProfile(
  userId
) {

  if (!userId) {

    return {
      profile:
        null,

      error:
        new Error(
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
        phone,
        role,
        member_since,
        updated_at
      `)
      .eq(
        'id',
        userId
      )
      .maybeSingle();


  if (error) {

    return {
      profile:
        null,

      error,
    };

  }


  if (!data) {

    return {
      profile:
        null,

      error:
        null,
    };

  }


  return {
    profile: {
      ...data,

      role:
        normalizeRole(
          data.role
        ),
    },

    error:
      null,
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
    // TOKEN
    // ========================================================

    const token =
      getBearerToken(
        req
      );


    if (!token) {

      return res
        .status(401)
        .json({
          success:
            false,

          message:
            'Authentication required.',
        });

    }


    // ========================================================
    // VERIFY SUPABASE ACCESS TOKEN
    // ========================================================

    const {
      data:
        authData,

      error:
        authError,
    } =
      await supabaseAuth
        .auth
        .getUser(
          token
        );


    if (
      authError ||
      !authData?.user?.id
    ) {

      console.warn(
        '[AUTH TOKEN INVALID]',
        authError?.message ||
        'No authenticated user returned.'
      );


      return res
        .status(401)
        .json({
          success:
            false,

          message:
            'Invalid or expired authentication token.',
        });

    }


    const authUser =
      authData.user;


    // ========================================================
    // LOAD PROFILE
    // ========================================================

    const {
      profile,
      error:
        profileError,
    } =
      await loadProfile(
        authUser.id
      );


    if (
      profileError
    ) {

      console.error(
        '[AUTH PROFILE ERROR]',
        profileError
      );


      return res
        .status(500)
        .json({
          success:
            false,

          message:
            'Unable to load user profile.',
        });

    }


    if (!profile) {

      console.warn(
        '[AUTH PROFILE NOT FOUND]',
        {
          userId:
            authUser.id,
        }
      );


      return res
        .status(403)
        .json({
          success:
            false,

          message:
            'User profile not found.',
        });

    }


    // ========================================================
    // OPTIONAL EMAIL CONSISTENCY CHECK
    // ========================================================

    if (
      authUser.email &&
      profile.email &&
      String(
        authUser.email
      ).toLowerCase() !==
        String(
          profile.email
        ).toLowerCase()
    ) {

      console.warn(
        '[AUTH EMAIL MISMATCH]',
        {
          userId:
            authUser.id,
        }
      );

    }


    // ========================================================
    // ATTACH AUTH DATA
    // ========================================================

    req.authUser =
      authUser;


    req.user = {
      ...authUser,

      role:
        profile.role,
    };


    req.profile =
      profile;


    req.userRole =
      profile.role;


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
      .status(500)
      .json({
        success:
          false,

        message:
          'Authentication failed.',
      });

  }

}


// ============================================================
// REQUIRE ADMIN
// ============================================================
//
// Must come AFTER requireAuth.
//
// Example:
//
// router.use(
//   requireAuth,
//   requireAdmin
// );
//
// ============================================================

export function requireAdmin(
  req,
  res,
  next
) {

  try {

    if (
      !req.user?.id ||
      !req.profile
    ) {

      return res
        .status(401)
        .json({
          success:
            false,

          message:
            'Authentication required.',
        });

    }


    const role =
      normalizeRole(
        req.userRole ||
        req.profile.role
      );


    const isAdmin =
      role === 'admin' ||
      role ===
        'administrator';


    if (
      !isAdmin
    ) {

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
          success:
            false,

          message:
            'Administrator access required.',
        });

    }


    req.userRole =
      role;


    req.profile = {
      ...req.profile,

      role,
    };


    return next();


  } catch (error) {

    console.error(
      '[ADMIN AUTHORIZATION ERROR]',
      error
    );


    return res
      .status(500)
      .json({
        success:
          false,

        message:
          'Administrator authorization failed.',
      });

  }

}


// ============================================================
// REQUIRE CUSTOMER
// ============================================================
//
// Must come AFTER requireAuth.
//
// Example:
//
// router.use(
//   requireAuth,
//   requireCustomer
// );
//
// ============================================================

export function requireCustomer(
  req,
  res,
  next
) {

  try {

    if (
      !req.user?.id ||
      !req.profile
    ) {

      return res
        .status(401)
        .json({
          success:
            false,

          message:
            'Authentication required.',
        });

    }


    const role =
      normalizeRole(
        req.userRole ||
        req.profile.role
      );


    if (
      role !==
      'customer'
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
          success:
            false,

          message:
            'Customer access required.',
        });

    }


    req.userRole =
      role;


    req.profile = {
      ...req.profile,

      role,
    };


    return next();


  } catch (error) {

    console.error(
      '[CUSTOMER AUTHORIZATION ERROR]',
      error
    );


    return res
      .status(500)
      .json({
        success:
          false,

        message:
          'Customer authorization failed.',
      });

  }

}


// ============================================================
// OPTIONAL ROLE MIDDLEWARE
// ============================================================
//
// Useful later for routes that support multiple roles.
//
// Example:
//
// router.get(
//   '/something',
//   requireAuth,
//   allowRoles(
//     'admin',
//     'administrator'
//   ),
//   controller
// );
//
// ============================================================

export function allowRoles(
  ...allowedRoles
) {

  const normalizedAllowedRoles =
    allowedRoles.map(
      normalizeRole
    );


  return function roleMiddleware(
    req,
    res,
    next
  ) {

    try {

      if (
        !req.user?.id ||
        !req.profile
      ) {

        return res
          .status(401)
          .json({
            success:
              false,

            message:
              'Authentication required.',
          });

      }


      const role =
        normalizeRole(
          req.userRole ||
          req.profile.role
        );


      if (
        !normalizedAllowedRoles
          .includes(
            role
          )
      ) {

        console.warn(
          '[ROLE ACCESS DENIED]',
          {
            userId:
              req.user.id,

            role,

            allowedRoles:
              normalizedAllowedRoles,
          }
        );


        return res
          .status(403)
          .json({
            success:
              false,

            message:
              'You do not have permission to access this resource.',
          });

      }


      req.userRole =
        role;


      return next();


    } catch (error) {

      console.error(
        '[ROLE AUTHORIZATION ERROR]',
        error
      );


      return res
        .status(500)
        .json({
          success:
            false,

          message:
            'Authorization failed.',
        });

    }

  };

}