import { supabase } from '../config/supabase.js';


// ============================================================
// APEX MACHINERY
// AUTH CONTROLLER
// ============================================================
//
// Handles:
//
// POST /api/auth/register
// POST /api/auth/login
// POST /api/auth/logout
// GET  /api/auth/me
//
// Authentication provider:
// Supabase Auth
//
// User profile:
// Supabase "profiles" table
//
// IMPORTANT:
// The Supabase SERVICE ROLE KEY must remain on the backend.
// Never expose it to React/Vite.
// ============================================================


// ============================================================
// HELPERS
// ============================================================

function cleanString(value) {

  return String(
    value ?? ''
  ).trim();

}


function normalizeEmail(value) {

  return cleanString(
    value
  ).toLowerCase();

}


function formatUser(profile) {

  if (!profile) {

    return null;

  }


  return {

    id:
      profile.id,

    name:
      profile.name || '',

    company:
      profile.company || '',

    email:
      profile.email || '',

    role:
      profile.role || 'customer',

    memberSince:
      profile.member_since || null,

  };

}


// ============================================================
// REGISTER
// ============================================================

export async function register(
  req,
  res
) {

  try {

    const {
      name,
      company,
      email,
      password,
    } = req.body || {};


    const cleanName =
      cleanString(name);

    const cleanCompany =
      cleanString(company);

    const cleanEmail =
      normalizeEmail(email);

    const cleanPassword =
      String(password || '');


    // ========================================================
    // VALIDATION
    // ========================================================

    if (!cleanName) {

      return res.status(400).json({

        success: false,

        message:
          'Please enter your full name.',

      });

    }


    if (!cleanCompany) {

      return res.status(400).json({

        success: false,

        message:
          'Please enter your company name.',

      });

    }


    if (!cleanEmail) {

      return res.status(400).json({

        success: false,

        message:
          'Please enter your email address.',

      });

    }


    // Basic email validation

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
      !emailPattern.test(
        cleanEmail
      )
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Please enter a valid email address.',

      });

    }


    if (
      cleanPassword.length < 6
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Password must contain at least 6 characters.',

      });

    }


    // ========================================================
    // CHECK EXISTING PROFILE
    // ========================================================

    const {
      data: existingProfile,
      error: existingProfileError,
    } = await supabase
      .from('profiles')
      .select('id,email')
      .eq(
        'email',
        cleanEmail
      )
      .maybeSingle();


    if (existingProfileError) {

      console.error(
        '[REGISTER PROFILE CHECK]',
        existingProfileError
      );

    }


    if (existingProfile) {

      return res.status(409).json({

        success: false,

        message:
          'An account with this email already exists.',

      });

    }


    // ========================================================
    // CREATE SUPABASE AUTH USER
    // ========================================================

    const {
      data: authData,
      error: authError,
    } =
      await supabase.auth.admin.createUser({

        email:
          cleanEmail,

        password:
          cleanPassword,

        // We are explicitly confirming the account.
        // If you later enable email verification,
        // change this behaviour accordingly.
        email_confirm: true,

        user_metadata: {

          name:
            cleanName,

          company:
            cleanCompany,

        },

      });


    if (authError) {

      console.error(
        '[AUTH REGISTER]',
        authError
      );


      let message =
        authError.message ||
        'Unable to create account.';


      // Friendlier duplicate message

      if (
        String(
          authError.message || ''
        )
          .toLowerCase()
          .includes(
            'already registered'
          )
      ) {

        message =
          'An account with this email already exists.';

      }


      return res.status(400).json({

        success: false,

        message,

      });

    }


    const authUser =
      authData?.user;


    if (!authUser) {

      return res.status(500).json({

        success: false,

        message:
          'Supabase created the account but did not return a user.',

      });

    }


    // ========================================================
    // CREATE PROFILE
    // ========================================================

    const {
      data: profile,
      error: profileError,
    } =
      await supabase
        .from('profiles')
        .insert({

          id:
            authUser.id,

          name:
            cleanName,

          company:
            cleanCompany,

          email:
            cleanEmail,

          role:
            'customer',

        })
        .select()
        .single();


    // ========================================================
    // PROFILE FAILURE
    // ========================================================

    if (profileError) {

      console.error(
        '[PROFILE CREATE]',
        profileError
      );


      // Roll back Supabase Auth user

      try {

        await supabase.auth.admin.deleteUser(
          authUser.id
        );

      } catch (
        rollbackError
      ) {

        console.error(
          '[PROFILE ROLLBACK]',
          rollbackError
        );

      }


      return res.status(500).json({

        success: false,

        message:
          'Account creation failed while creating your profile.',

      });

    }


    // ========================================================
    // LOGIN AFTER REGISTRATION
    // ========================================================

    const {
      data: sessionData,
      error: sessionError,
    } =
      await supabase.auth.signInWithPassword({

        email:
          cleanEmail,

        password:
          cleanPassword,

      });


    // ========================================================
    // ACCOUNT CREATED BUT NO SESSION
    // ========================================================

    if (
      sessionError ||
      !sessionData?.session
    ) {

      return res.status(201).json({

        success: true,

        message:
          'Account created successfully. Please log in.',

        user:
          formatUser(profile),

        session:
          null,

      });

    }


    // ========================================================
    // SUCCESS
    // ========================================================

    return res.status(201).json({

      success: true,

      message:
        'Account created successfully.',

      user:
        formatUser(profile),

      session: {

        accessToken:
          sessionData.session
            .access_token,

        refreshToken:
          sessionData.session
            .refresh_token,

      },

    });

  } catch (error) {

    console.error(
      '[REGISTER ERROR]',
      error
    );


    return res.status(500).json({

      success: false,

      message:
        'An unexpected error occurred while creating your account.',

    });

  }

}


// ============================================================
// LOGIN
// ============================================================

export async function login(
  req,
  res
) {

  try {

    const {
      email,
      password,
    } = req.body || {};


    const cleanEmail =
      normalizeEmail(email);

    const cleanPassword =
      String(password || '');


    // ========================================================
    // VALIDATION
    // ========================================================

    if (!cleanEmail) {

      return res.status(400).json({

        success: false,

        message:
          'Please enter your email address.',

      });

    }


    if (!cleanPassword) {

      return res.status(400).json({

        success: false,

        message:
          'Please enter your password.',

      });

    }


    // ========================================================
    // SUPABASE LOGIN
    // ========================================================

    const {
      data,
      error,
    } =
      await supabase.auth.signInWithPassword({

        email:
          cleanEmail,

        password:
          cleanPassword,

      });


    if (error) {

      console.error(
        '[AUTH LOGIN]',
        error.message
      );


      return res.status(401).json({

        success: false,

        message:
          'Incorrect email or password.',

      });

    }


    const authUser =
      data?.user;


    if (!authUser) {

      return res.status(401).json({

        success: false,

        message:
          'Authentication failed.',

      });

    }


    // ========================================================
    // LOAD PROFILE
    // ========================================================

    const {
      data: profile,
      error: profileError,
    } =
      await supabase
        .from('profiles')
        .select('*')
        .eq(
          'id',
          authUser.id
        )
        .maybeSingle();


    if (profileError) {

      console.error(
        '[PROFILE LOGIN]',
        profileError
      );


      return res.status(500).json({

        success: false,

        message:
          'Account profile could not be loaded.',

      });

    }


    // ========================================================
    // PROFILE DOES NOT EXIST
    // ========================================================

    if (!profile) {

      return res.status(404).json({

        success: false,

        message:
          'Your authentication account exists, but your Apex Machinery profile was not found.',

      });

    }


    // ========================================================
    // RETURN SESSION
    // ========================================================

    return res.json({

      success: true,

      message:
        'Login successful.',

      user:
        formatUser(profile),

      session: {

        accessToken:
          data.session?.access_token ||
          null,

        refreshToken:
          data.session?.refresh_token ||
          null,

      },

    });

  } catch (error) {

    console.error(
      '[LOGIN ERROR]',
      error
    );


    return res.status(500).json({

      success: false,

      message:
        'Unable to login at this time.',

    });

  }

}


// ============================================================
// LOGOUT
// ============================================================
//
// Supabase access tokens are JWTs and are normally short-lived.
// The frontend removes its stored session after this request.
//
// The middleware has already verified the bearer token before
// this controller runs.
// ============================================================

export async function logout(
  req,
  res
) {

  try {

    return res.json({

      success: true,

      message:
        'Logged out successfully.',

    });

  } catch (error) {

    console.error(
      '[LOGOUT ERROR]',
      error
    );


    return res.status(500).json({

      success: false,

      message:
        'Unable to logout.',

    });

  }

}


// ============================================================
// CURRENT USER
// ============================================================

export async function me(
  req,
  res
) {

  try {

    // ========================================================
    // REQUIRE AUTHENTICATED USER
    // ========================================================

    if (!req.user?.id) {

      return res.status(401).json({

        success: false,

        message:
          'Not authenticated.',

      });

    }


    // ========================================================
    // GET PROFILE
    // ========================================================

    const {
      data: profile,
      error,
    } =
      await supabase
        .from('profiles')
        .select('*')
        .eq(
          'id',
          req.user.id
        )
        .maybeSingle();


    if (error) {

      console.error(
        '[ME PROFILE]',
        error
      );


      return res.status(500).json({

        success: false,

        message:
          'Unable to load your account profile.',

      });

    }


    if (!profile) {

      return res.status(404).json({

        success: false,

        message:
          'User profile not found.',

      });

    }


    // ========================================================
    // RETURN CURRENT USER
    // ========================================================

    return res.json({

      success: true,

      user:
        formatUser(profile),

    });

  } catch (error) {

    console.error(
      '[ME ERROR]',
      error
    );


    return res.status(500).json({

      success: false,

      message:
        'Unable to retrieve account information.',

    });

  }

}