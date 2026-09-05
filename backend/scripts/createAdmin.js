import 'dotenv/config';

import { supabase } from '../src/config/supabase.js';


// ============================================================
// APEX MACHINERY
// ONE-TIME ADMIN CREATION SCRIPT
// ============================================================
//
// Run:
//
// node scripts/createAdmin.js
//
// The script:
//
// 1. Checks Supabase connection
// 2. Checks whether an administrator already exists
// 3. Creates the Supabase Auth account
// 4. Creates the public.profiles row
// 5. Assigns role = admin
//
// ============================================================


// ============================================================
// ENVIRONMENT VARIABLES
// ============================================================

const ADMIN_EMAIL =
  String(
    process.env.ADMIN_EMAIL || ''
  )
    .trim()
    .toLowerCase();


const ADMIN_PASSWORD =
  String(
    process.env.ADMIN_PASSWORD || ''
  );


const ADMIN_NAME =
  String(
    process.env.ADMIN_NAME ||
    'Apex Administrator'
  ).trim();


const ADMIN_COMPANY =
  'Apex Machinery';


// ============================================================
// VALIDATE ENVIRONMENT
// ============================================================

function validateEnvironment() {

  if (!process.env.SUPABASE_URL) {

    throw new Error(
      'SUPABASE_URL is missing from backend/.env'
    );

  }


  if (
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {

    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is missing from backend/.env'
    );

  }


  if (!ADMIN_EMAIL) {

    throw new Error(
      'ADMIN_EMAIL is missing from backend/.env'
    );

  }


  if (!ADMIN_PASSWORD) {

    throw new Error(
      'ADMIN_PASSWORD is missing from backend/.env'
    );

  }


  if (
    ADMIN_PASSWORD.length < 8
  ) {

    throw new Error(
      'ADMIN_PASSWORD must contain at least 8 characters.'
    );

  }

}


// ============================================================
// CHECK EXISTING ADMIN PROFILE
// ============================================================

async function findExistingAdmin() {

  console.log(
    'Checking for existing administrator...'
  );


  const {
    data,
    error,
  } =
    await supabase
      .from('profiles')
      .select(
        'id,name,email,role'
      )
      .in(
        'role',
        [
          'admin',
          'administrator',
        ]
      )
      .limit(1);


  if (error) {

    throw new Error(
      `Unable to check administrators: ${error.message}`
    );

  }


  if (
    Array.isArray(data) &&
    data.length > 0
  ) {

    return data[0];

  }


  return null;

}


// ============================================================
// CHECK PROFILE WITH ADMIN EMAIL
// ============================================================

async function findProfileByEmail() {

  const {
    data,
    error,
  } =
    await supabase
      .from('profiles')
      .select(
        'id,name,email,role'
      )
      .eq(
        'email',
        ADMIN_EMAIL
      )
      .maybeSingle();


  if (error) {

    throw new Error(
      `Unable to check administrator email: ${error.message}`
    );

  }


  return data || null;

}


// ============================================================
// FIND AUTH USER BY EMAIL
// ============================================================

async function findAuthUserByEmail() {

  let page =
    1;


  const perPage =
    100;


  while (true) {

    const {
      data,
      error,
    } =
      await supabase
        .auth
        .admin
        .listUsers({
          page,
          perPage,
        });


    if (error) {

      throw new Error(
        `Unable to inspect Supabase users: ${error.message}`
      );

    }


    const users =
      data?.users || [];


    const existing =
      users.find(
        (user) =>
          String(
            user.email || ''
          )
            .trim()
            .toLowerCase() ===
          ADMIN_EMAIL
      );


    if (existing) {

      return existing;

    }


    if (
      users.length <
      perPage
    ) {

      break;

    }


    page += 1;

  }


  return null;

}


// ============================================================
// CREATE PROFILE
// ============================================================

async function createAdminProfile(
  authUserId
) {

  const {
    data,
    error,
  } =
    await supabase
      .from('profiles')
      .insert({

        id:
          authUserId,

        name:
          ADMIN_NAME,

        company:
          ADMIN_COMPANY,

        email:
          ADMIN_EMAIL,

        role:
          'admin',

      })
      .select()
      .single();


  if (error) {

    throw new Error(
      `Unable to create administrator profile: ${error.message}`
    );

  }


  return data;

}


// ============================================================
// UPDATE EXISTING PROFILE TO ADMIN
// ============================================================

async function updateProfileAsAdmin(
  authUserId
) {

  const {
    data,
    error,
  } =
    await supabase
      .from('profiles')
      .update({

        name:
          ADMIN_NAME,

        company:
          ADMIN_COMPANY,

        email:
          ADMIN_EMAIL,

        role:
          'admin',

      })
      .eq(
        'id',
        authUserId
      )
      .select()
      .single();


  if (error) {

    throw new Error(
      `Unable to update administrator profile: ${error.message}`
    );

  }


  return data;

}


// ============================================================
// MAIN
// ============================================================

async function createAdministrator() {

  let newlyCreatedAuthUser =
    null;


  try {

    console.log(
      '=========================================='
    );

    console.log(
      'APEX MACHINERY ADMIN SETUP'
    );

    console.log(
      '=========================================='
    );


    // ========================================================
    // ENV
    // ========================================================

    validateEnvironment();


    console.log(
      'SUPABASE_URL:',
      process.env.SUPABASE_URL
    );


    console.log(
      'SERVICE ROLE KEY LOADED:',
      Boolean(
        process.env
          .SUPABASE_SERVICE_ROLE_KEY
      )
    );


    // ========================================================
    // CONNECTION TEST
    // ========================================================

    const {
      error: connectionError,
    } =
      await supabase
        .from('profiles')
        .select('id')
        .limit(1);


    if (connectionError) {

      throw new Error(
        `Supabase connection failed: ${connectionError.message}`
      );

    }


    console.log(
      'Connection to Supabase works.'
    );


    // ========================================================
    // CHECK EXISTING ADMIN
    // ========================================================

    const existingAdmin =
      await findExistingAdmin();


    if (existingAdmin) {

      console.log('');
      console.log(
        '✅ Administrator already exists.'
      );

      console.log(
        'Email:',
        existingAdmin.email
      );

      console.log(
        'Role:',
        existingAdmin.role
      );


      return;

    }


    console.log(
      'No administrator profile found.'
    );


    // ========================================================
    // CHECK PROFILE USING ADMIN EMAIL
    // ========================================================

    const existingProfile =
      await findProfileByEmail();


    if (
      existingProfile &&
      existingProfile.role !== 'admin'
    ) {

      console.error('');
      console.error(
        '❌ A profile already exists using the administrator email.'
      );

      console.error(
        'Existing role:',
        existingProfile.role
      );

      console.error(
        'For safety, the script will not automatically convert a customer into an administrator.'
      );


      return;

    }


    // ========================================================
    // CHECK SUPABASE AUTH
    // ========================================================

    console.log(
      'Checking Supabase Authentication...'
    );


    let authUser =
      await findAuthUserByEmail();


    // ========================================================
    // AUTH USER DOES NOT EXIST
    // ========================================================

    if (!authUser) {

      console.log(
        'Creating administrator authentication account...'
      );


      const {
        data,
        error,
      } =
        await supabase
          .auth
          .admin
          .createUser({

            email:
              ADMIN_EMAIL,

            password:
              ADMIN_PASSWORD,

            email_confirm:
              true,

            user_metadata: {

              name:
                ADMIN_NAME,

              company:
                ADMIN_COMPANY,

              role:
                'admin',

            },

          });


      if (error) {

        throw new Error(
          `Unable to create administrator authentication account: ${error.message}`
        );

      }


      authUser =
        data?.user;


      if (!authUser?.id) {

        throw new Error(
          'Supabase did not return the administrator user.'
        );

      }


      newlyCreatedAuthUser =
        authUser.id;


      console.log(
        'Administrator authentication account created.'
      );

    } else {

      console.log(
        'Administrator authentication account already exists.'
      );

    }


    // ========================================================
    // CHECK PROFILE BY AUTH USER ID
    // ========================================================

    const {
      data: profileById,
      error: profileByIdError,
    } =
      await supabase
        .from('profiles')
        .select(
          'id,name,email,role'
        )
        .eq(
          'id',
          authUser.id
        )
        .maybeSingle();


    if (profileByIdError) {

      throw new Error(
        `Unable to inspect administrator profile: ${profileByIdError.message}`
      );

    }


    // ========================================================
    // CREATE PROFILE
    // ========================================================

    let adminProfile;


    if (!profileById) {

      console.log(
        'Creating administrator profile...'
      );


      adminProfile =
        await createAdminProfile(
          authUser.id
        );


    } else {

      console.log(
        'Updating administrator profile...'
      );


      adminProfile =
        await updateProfileAsAdmin(
          authUser.id
        );

    }


    // ========================================================
    // COMPLETE
    // ========================================================

    console.log('');
    console.log(
      '=========================================='
    );

    console.log(
      '✅ APEX ADMIN CREATED SUCCESSFULLY'
    );

    console.log(
      '=========================================='
    );


    console.log(
      'Name:',
      adminProfile.name
    );


    console.log(
      'Email:',
      adminProfile.email
    );


    console.log(
      'Company:',
      adminProfile.company
    );


    console.log(
      'Role:',
      adminProfile.role
    );


    console.log('');
    console.log(
      'You can now use this administrator account on the normal /login page.'
    );


    // Script succeeded.
    // Do not rollback.

    newlyCreatedAuthUser =
      null;


  } catch (error) {

    console.error('');
    console.error(
      '❌ ADMIN CREATION FAILED'
    );


    console.error(
      error.message ||
      error
    );


    // ========================================================
    // ROLLBACK
    // ========================================================

    if (
      newlyCreatedAuthUser
    ) {

      console.log(
        'Rolling back newly created authentication account...'
      );


      try {

        const {
          error: rollbackError,
        } =
          await supabase
            .auth
            .admin
            .deleteUser(
              newlyCreatedAuthUser
            );


        if (rollbackError) {

          console.error(
            'Rollback failed:',
            rollbackError.message
          );

        } else {

          console.log(
            'Rollback successful.'
          );

        }

      } catch (
        rollbackError
      ) {

        console.error(
          'Rollback failed:',
          rollbackError
        );

      }

    }


    process.exitCode =
      1;

  }

}


// ============================================================
// RUN
// ============================================================

await createAdministrator();