import {
  supabaseAdmin,
  supabaseAuth,
} from '../config/supabase.js';


// ============================================================
// APEX MACHINERY
// AUTH CONTROLLER
// ============================================================
//
// PUBLIC REGISTRATION:
//   customer only
//
// LOGIN:
//   customer + admin
//
// customer → /dashboard
// admin    → /admin
//
// IMPORTANT:
//
// Public registration NEVER creates administrators.
//
// Admin accounts are created separately using createAdmin.js.
//
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


function normalizeRole(value) {

  return cleanString(
    value
  ).toLowerCase();

}


function isAllowedLoginRole(role) {

  const normalized =
    normalizeRole(
      role
    );


  return (
    normalized === 'customer' ||
    normalized === 'admin' ||
    normalized === 'administrator'
  );

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
      normalizeRole(
        profile.role
      ),

    memberSince:
      profile.member_since || null,

  };

}


// ============================================================
// REGISTER
// ============================================================
//
// CUSTOMER REGISTRATION ONLY
//
// Expected:
//
// {
//   name,
//   company,
//   email,
//   password
// }
//
// Backend ALWAYS assigns:
//
// role = customer
//
// ============================================================

export async function register(
  req,
  res
) {

  let createdAuthUserId =
    null;


  try {

    // ========================================================
    // REQUEST DATA
    // ========================================================

    const {
      name,
      company,
      email,
      password,
    } =
      req.body || {};


    // ========================================================
    // CLEAN VALUES
    // ========================================================

    const cleanName =
      cleanString(
        name
      );


    const cleanCompany =
      cleanString(
        company
      );


    const cleanEmail =
      normalizeEmail(
        email
      );


    const cleanPassword =
      String(
        password || ''
      );


    // ========================================================
    // NAME VALIDATION
    // ========================================================

    if (!cleanName) {

      return res
        .status(400)
        .json({

          success: false,

          message:
            'Please enter your full name.',

        });

    }


    if (
      cleanName.length < 2
    ) {

      return res
        .status(400)
        .json({

          success: false,

          message:
            'Your name must contain at least 2 characters.',

        });

    }


    if (
      cleanName.length > 100
    ) {

      return res
        .status(400)
        .json({

          success: false,

          message:
            'Your name is too long.',

        });

    }


    // ========================================================
    // COMPANY VALIDATION
    // ========================================================

    if (!cleanCompany) {

      return res
        .status(400)
        .json({

          success: false,

          message:
            'Please enter your company name.',

        });

    }


    if (
      cleanCompany.length < 2
    ) {

      return res
        .status(400)
        .json({

          success: false,

          message:
            'Please enter a valid company name.',

        });

    }


    if (
      cleanCompany.length > 150
    ) {

      return res
        .status(400)
        .json({

          success: false,

          message:
            'Company name is too long.',

        });

    }


    // ========================================================
    // EMAIL VALIDATION
    // ========================================================

    if (!cleanEmail) {

      return res
        .status(400)
        .json({

          success: false,

          message:
            'Please enter your email address.',

        });

    }


    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
      !emailPattern.test(
        cleanEmail
      )
    ) {

      return res
        .status(400)
        .json({

          success: false,

          message:
            'Please enter a valid email address.',

        });

    }


    if (
      cleanEmail.length > 254
    ) {

      return res
        .status(400)
        .json({

          success: false,

          message:
            'Email address is too long.',

        });

    }


    // ========================================================
    // PASSWORD VALIDATION
    // ========================================================

    if (!cleanPassword) {

      return res
        .status(400)
        .json({

          success: false,

          message:
            'Please create a password.',

        });

    }


    if (
      cleanPassword.length < 6
    ) {

      return res
        .status(400)
        .json({

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
    } =
      await supabaseAdmin
        .from('profiles')
        .select(
          'id,email'
        )
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


      return res
        .status(500)
        .json({

          success: false,

          message:
            'Unable to check existing account.',

        });

    }


    if (existingProfile) {

      return res
        .status(409)
        .json({

          success: false,

          message:
            'An account with this email already exists.',

        });

    }


    // ========================================================
    // CREATE CUSTOMER AUTH USER
    // ========================================================

    const {
      data: authData,
      error: authError,
    } =
      await supabaseAdmin
        .auth
        .admin
        .createUser({

          email:
            cleanEmail,

          password:
            cleanPassword,

          email_confirm:
            true,

          user_metadata: {

            name:
              cleanName,

            company:
              cleanCompany,

            role:
              'customer',

          },

        });


    // ========================================================
    // AUTH CREATION FAILED
    // ========================================================

    if (authError) {

      console.error(
        '[AUTH REGISTER]',
        authError
      );


      const authMessage =
        String(
          authError.message || ''
        ).toLowerCase();


      let message =
        'Unable to create account.';


      if (
        authMessage.includes(
          'already registered'
        ) ||
        authMessage.includes(
          'already exists'
        )
      ) {

        message =
          'An account with this email already exists.';

      } else if (
        authError.message
      ) {

        message =
          authError.message;

      }


      return res
        .status(400)
        .json({

          success: false,

          message,

        });

    }


    // ========================================================
    // AUTH USER
    // ========================================================

    const authUser =
      authData?.user;


    if (!authUser?.id) {

      return res
        .status(500)
        .json({

          success: false,

          message:
            'Authentication account could not be created.',

        });

    }


    createdAuthUserId =
      authUser.id;


    // ========================================================
    // CREATE CUSTOMER PROFILE
    // ========================================================

    const {
      data: profile,
      error: profileError,
    } =
      await supabaseAdmin
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
    // PROFILE CREATION FAILED
    // ========================================================

    if (profileError) {

      console.error(
        '[PROFILE CREATE]',
        profileError
      );


      // ------------------------------------------------------
      // ROLLBACK AUTH USER
      // ------------------------------------------------------

      try {

        const {
          error: rollbackError,
        } =
          await supabaseAdmin
            .auth
            .admin
            .deleteUser(
              authUser.id
            );


        if (rollbackError) {

          console.error(
            '[PROFILE ROLLBACK]',
            rollbackError
          );

        } else {

          createdAuthUserId =
            null;

        }

      } catch (
        rollbackError
      ) {

        console.error(
          '[PROFILE ROLLBACK]',
          rollbackError
        );

      }


      return res
        .status(500)
        .json({

          success: false,

          message:
            'Account creation failed while creating your customer profile.',

        });

    }


    // Profile successfully created

    createdAuthUserId =
      null;


    // ========================================================
    // AUTO LOGIN AFTER REGISTRATION
    // ========================================================

    const {
      data: sessionData,
      error: sessionError,
    } =
      await supabaseAuth
        .auth
        .signInWithPassword({

          email:
            cleanEmail,

          password:
            cleanPassword,

        });


    // ========================================================
    // CREATED BUT AUTO LOGIN FAILED
    // ========================================================

    if (
      sessionError ||
      !sessionData?.session
    ) {

      console.error(
        '[REGISTER AUTO LOGIN]',
        sessionError
      );


      return res
        .status(201)
        .json({

          success: true,

          message:
            'Customer account created successfully. Please sign in.',

          user:
            formatUser(
              profile
            ),

          session:
            null,

        });

    }


    // ========================================================
    // SUCCESS
    // ========================================================

    return res
      .status(201)
      .json({

        success: true,

        message:
          'Customer account created successfully.',

        user:
          formatUser(
            profile
          ),

        session: {

          accessToken:
            sessionData
              .session
              .access_token,

          refreshToken:
            sessionData
              .session
              .refresh_token,

        },

      });


  } catch (error) {

    console.error(
      '[REGISTER ERROR]',
      error
    );


    // ========================================================
    // EMERGENCY ROLLBACK
    // ========================================================

    if (
      createdAuthUserId
    ) {

      try {

        await supabaseAdmin
          .auth
          .admin
          .deleteUser(
            createdAuthUserId
          );

      } catch (
        rollbackError
      ) {

        console.error(
          '[REGISTER EMERGENCY ROLLBACK]',
          rollbackError
        );

      }

    }


    return res
      .status(500)
      .json({

        success: false,

        message:
          'An unexpected error occurred while creating your account.',

      });

  }

}


// ============================================================
// LOGIN
// ============================================================
//
// SAME LOGIN PAGE FOR:
//
// customer
// admin
//
// Role comes from profiles table.
//
// ============================================================

export async function login(
  req,
  res
) {

  try {

    // ========================================================
    // REQUEST
    // ========================================================

    const {
      email,
      password,
    } =
      req.body || {};


    const cleanEmail =
      normalizeEmail(
        email
      );


    const cleanPassword =
      String(
        password || ''
      );


    // ========================================================
    // VALIDATION
    // ========================================================

    if (!cleanEmail) {

      return res
        .status(400)
        .json({

          success: false,

          message:
            'Please enter your email address.',

        });

    }


    if (!cleanPassword) {

      return res
        .status(400)
        .json({

          success: false,

          message:
            'Please enter your password.',

        });

    }


    console.log(
      '[AUTH LOGIN] Attempt:',
      cleanEmail
    );


    // ========================================================
    // AUTHENTICATE USER
    // ========================================================

    const {
      data,
      error,
    } =
      await supabaseAuth
        .auth
        .signInWithPassword({

          email:
            cleanEmail,

          password:
            cleanPassword,

        });


    // ========================================================
    // INVALID CREDENTIALS
    // ========================================================

    if (error) {

      console.error(
        '[AUTH LOGIN]',
        error.message
      );


      return res
        .status(401)
        .json({

          success: false,

          message:
            'Incorrect email or password.',

        });

    }


    const authUser =
      data?.user;


    const session =
      data?.session;


    if (
      !authUser?.id ||
      !session?.access_token
    ) {

      return res
        .status(401)
        .json({

          success: false,

          message:
            'Authentication failed.',

        });

    }


    console.log(
      '[AUTH LOGIN] Authenticated user:',
      authUser.id,
      authUser.email
    );


    // ========================================================
    // LOAD PROFILE USING ADMIN CLIENT
    // ========================================================

    const {
      data: profile,
      error: profileError,
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
          authUser.id
        )
        .maybeSingle();


    // ========================================================
    // PROFILE QUERY FAILED
    // ========================================================

    if (profileError) {

      console.error(
        '[PROFILE LOGIN ERROR]',
        profileError
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            'Account profile could not be loaded.',

        });

    }


    console.log(
      '[AUTH LOGIN] Profile:',
      profile
    );


    // ========================================================
    // PROFILE NOT FOUND
    // ========================================================

    if (!profile) {

      console.error(
        '[AUTH LOGIN] PROFILE NOT FOUND FOR:',
        authUser.id
      );


      return res
        .status(404)
        .json({

          success: false,

          message:
            'Your authentication account exists, but your Apex Machinery profile was not found.',

        });

    }


    // ========================================================
    // ROLE
    // ========================================================

    const role =
      normalizeRole(
        profile.role
      );


    // ========================================================
    // VALIDATE ROLE
    // ========================================================

    if (
      !isAllowedLoginRole(
        role
      )
    ) {

      console.error(
        '[LOGIN INVALID ROLE]',
        {

          userId:
            authUser.id,

          role:
            profile.role,

        }
      );


      return res
        .status(403)
        .json({

          success: false,

          message:
            'Your account does not have a valid access role.',

        });

    }


    profile.role =
      role;


    console.log(
      '[AUTH LOGIN] LOGIN SUCCESS:',
      profile.email,
      role
    );


    // ========================================================
    // SUCCESS
    // ========================================================

    return res
      .status(200)
      .json({

        success: true,

        message:
          'Login successful.',

        user:
          formatUser(
            profile
          ),

        session: {

          accessToken:
            session.access_token,

          refreshToken:
            session.refresh_token || null,

        },

      });


  } catch (error) {

    console.error(
      '[LOGIN ERROR]',
      error
    );


    return res
      .status(500)
      .json({

        success: false,

        message:
          'Unable to login at this time.',

      });

  }

}


// ============================================================
// LOGOUT
// ============================================================

export async function logout(
  req,
  res
) {

  try {

    return res
      .status(200)
      .json({

        success: true,

        message:
          'Logged out successfully.',

      });


  } catch (error) {

    console.error(
      '[LOGOUT ERROR]',
      error
    );


    return res
      .status(500)
      .json({

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
    // REQUIRE AUTH
    // ========================================================

    if (!req.user?.id) {

      return res
        .status(401)
        .json({

          success: false,

          message:
            'Not authenticated.',

        });

    }


    // ========================================================
    // LOAD PROFILE
    // ========================================================

    const {
      data: profile,
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
          req.user.id
        )
        .maybeSingle();


    if (error) {

      console.error(
        '[ME PROFILE]',
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            'Unable to load your account profile.',

        });

    }


    if (!profile) {

      return res
        .status(404)
        .json({

          success: false,

          message:
            'User profile not found.',

        });

    }


    // ========================================================
    // ROLE
    // ========================================================

    const role =
      normalizeRole(
        profile.role
      );


    if (
      !isAllowedLoginRole(
        role
      )
    ) {

      return res
        .status(403)
        .json({

          success: false,

          message:
            'Your account does not have a valid access role.',

        });

    }


    profile.role =
      role;


    // ========================================================
    // SUCCESS
    // ========================================================

    return res
      .status(200)
      .json({

        success: true,

        user:
          formatUser(
            profile
          ),

      });


  } catch (error) {

    console.error(
      '[ME ERROR]',
      error
    );


    return res
      .status(500)
      .json({

        success: false,

        message:
          'Unable to retrieve account information.',

      });

  }

}