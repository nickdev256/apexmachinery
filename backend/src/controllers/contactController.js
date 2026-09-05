import {
  randomUUID,
} from 'node:crypto';

import {
  supabaseAdmin,
} from '../config/supabase.js';

import {
  sendContactInquiryEmail,
} from '../services/emailService.js';


// ============================================================
// CONSTANTS
// ============================================================

const ALLOWED_STATUSES = [
  'new',
  'in_progress',
  'resolved',
  'closed',
];


const ALLOWED_PRIORITIES = [
  'low',
  'normal',
  'high',
  'urgent',
];


// ============================================================
// HELPERS
// ============================================================

function cleanString(
  value,
  maxLength = 500
) {

  if (
    value === null ||
    value === undefined
  ) {

    return '';

  }


  return String(
    value
  )
    .trim()
    .slice(
      0,
      maxLength
    );

}


// ============================================================
// EMAIL NORMALIZER
// ============================================================

function normalizeEmail(
  value
) {

  return cleanString(
    value,
    254
  ).toLowerCase();

}


// ============================================================
// EMAIL VALIDATION
// ============================================================

function isValidEmail(
  email
) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );

}


// ============================================================
// REFERENCE NUMBER
//
// Example:
// APX-202609-A7F23C91
// ============================================================

function createReferenceNumber() {

  const date =
    new Date();


  const year =
    String(
      date.getUTCFullYear()
    );


  const month =
    String(
      date.getUTCMonth() +
      1
    ).padStart(
      2,
      '0'
    );


  const random =
    randomUUID()
      .replace(
        /-/g,
        ''
      )
      .slice(
        0,
        8
      )
      .toUpperCase();


  return `APX-${year}${month}-${random}`;

}


// ============================================================
// NORMALIZE INQUIRY RESPONSE
// ============================================================

function normalizeInquiry(
  inquiry
) {

  if (
    !inquiry
  ) {

    return null;

  }


  const firstName =
    inquiry.first_name ||
    '';


  const lastName =
    inquiry.last_name ||
    '';


  return {

    id:
      inquiry.id,

    referenceNumber:
      inquiry.reference_number,

    firstName,

    lastName,

    fullName:
      `${firstName} ${lastName}`
        .trim(),

    email:
      inquiry.email,

    phone:
      inquiry.phone,

    company:
      inquiry.company,

    subject:
      inquiry.subject,

    message:
      inquiry.message,

    status:
      inquiry.status,

    priority:
      inquiry.priority,

    adminNotes:
      inquiry.admin_notes,

    createdAt:
      inquiry.created_at,

    updatedAt:
      inquiry.updated_at,

  };

}


// ============================================================
// CREATE CONTACT INQUIRY
//
// POST /api/contact
// ============================================================

export async function createContactInquiry(
  req,
  res
) {

  try {

    const body =
      req.body ||
      {};


    // ========================================================
    // NORMALIZE INPUT
    // ========================================================

    const firstName =
      cleanString(
        body.firstName,
        100
      );


    const lastName =
      cleanString(
        body.lastName,
        100
      );


    const email =
      normalizeEmail(
        body.email
      );


    const phone =
      cleanString(
        body.phone,
        50
      );


    const company =
      cleanString(
        body.company,
        150
      );


    const subject =
      cleanString(
        body.subject,
        100
      );


    const message =
      cleanString(
        body.message,
        5000
      );


    // ========================================================
    // VALIDATION
    // ========================================================

    if (
      !firstName
    ) {

      return res
        .status(
          400
        )
        .json({

          success:
            false,

          message:
            'First name is required.',

        });

    }


    if (
      !lastName
    ) {

      return res
        .status(
          400
        )
        .json({

          success:
            false,

          message:
            'Last name is required.',

        });

    }


    if (
      !email
    ) {

      return res
        .status(
          400
        )
        .json({

          success:
            false,

          message:
            'Email address is required.',

        });

    }


    if (
      !isValidEmail(
        email
      )
    ) {

      return res
        .status(
          400
        )
        .json({

          success:
            false,

          message:
            'Please enter a valid email address.',

        });

    }


    if (
      !message
    ) {

      return res
        .status(
          400
        )
        .json({

          success:
            false,

          message:
            'Please describe how we can help.',

        });

    }


    if (
      message.length <
      10
    ) {

      return res
        .status(
          400
        )
        .json({

          success:
            false,

          message:
            'Please provide a little more detail about your inquiry.',

        });

    }


    // ========================================================
    // CREATE UNIQUE REFERENCE
    // ========================================================

    const referenceNumber =
      createReferenceNumber();


    // ========================================================
    // SAVE INQUIRY TO SUPABASE
    // ========================================================

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          'contact_inquiries'
        )
        .insert({

          reference_number:
            referenceNumber,

          first_name:
            firstName,

          last_name:
            lastName,

          email,

          phone:
            phone ||
            null,

          company:
            company ||
            null,

          subject:
            subject ||
            null,

          message,

          status:
            'new',

          priority:
            'normal',

        })
        .select(`
          id,
          reference_number,
          first_name,
          last_name,
          email,
          phone,
          company,
          subject,
          message,
          status,
          priority,
          admin_notes,
          created_at,
          updated_at
        `)
        .single();


    if (
      error
    ) {

      console.error(
        '[CONTACT DATABASE ERROR]',
        error
      );


      throw error;

    }


    // ========================================================
    // SEND EMAIL NOTIFICATION TO APEX
    //
    // Database storage is primary.
    // Email failure does not delete the saved inquiry.
    // ========================================================

    try {

      const emailResult =
        await sendContactInquiryEmail({

          referenceNumber:
            data.reference_number,

          firstName:
            data.first_name,

          lastName:
            data.last_name,

          email:
            data.email,

          phone:
            data.phone,

          company:
            data.company,

          subject:
            data.subject,

          message:
            data.message,

          createdAt:
            data.created_at,

        });


      if (
        !emailResult?.success
      ) {

        console.warn(
          '[CONTACT EMAIL NOT SENT]',
          {

            referenceNumber:
              data.reference_number,

            reason:
              emailResult?.reason ||
              emailResult?.error ||
              'Unknown email error',

          }
        );

      }


    } catch (
      emailError
    ) {

      console.error(
        '[CONTACT EMAIL FAILURE]',
        {

          referenceNumber:
            data.reference_number,

          message:
            emailError?.message ||
            'Email notification failed.',

        }
      );

    }


    // ========================================================
    // SUCCESS RESPONSE
    // ========================================================

    return res
      .status(
        201
      )
      .json({

        success:
          true,

        message:
          'Your inquiry has been submitted successfully.',

        data: {

          inquiry:
            normalizeInquiry(
              data
            ),

        },

      });


  } catch (
    error
  ) {

    console.error(
      '[CONTACT CREATE ERROR]',
      error
    );


    return res
      .status(
        500
      )
      .json({

        success:
          false,

        message:
          'Unable to submit your inquiry at the moment. Please try again.',

      });

  }

}


// ============================================================
// ADMIN: GET ALL CONTACT INQUIRIES
//
// GET /api/contact/admin
//
// IMPORTANT:
// Protect this route using admin authentication middleware.
// ============================================================

export async function getContactInquiries(
  req,
  res
) {

  try {

    const status =
      cleanString(
        req.query.status,
        30
      );


    const priority =
      cleanString(
        req.query.priority,
        30
      );


    const search =
      cleanString(
        req.query.search,
        150
      );


    // ========================================================
    // VALIDATE FILTERS
    // ========================================================

    if (
      status &&
      status !==
      'all' &&
      !ALLOWED_STATUSES.includes(
        status
      )
    ) {

      return res
        .status(
          400
        )
        .json({

          success:
            false,

          message:
            'Invalid inquiry status.',

        });

    }


    if (
      priority &&
      priority !==
      'all' &&
      !ALLOWED_PRIORITIES.includes(
        priority
      )
    ) {

      return res
        .status(
          400
        )
        .json({

          success:
            false,

          message:
            'Invalid inquiry priority.',

        });

    }


    // ========================================================
    // BUILD QUERY
    // ========================================================

    let query =
      supabaseAdmin
        .from(
          'contact_inquiries'
        )
        .select(`
          id,
          reference_number,
          first_name,
          last_name,
          email,
          phone,
          company,
          subject,
          message,
          status,
          priority,
          admin_notes,
          created_at,
          updated_at
        `)
        .order(
          'created_at',
          {
            ascending:
              false,
          }
        );


    // ========================================================
    // STATUS FILTER
    // ========================================================

    if (
      status &&
      status !==
      'all'
    ) {

      query =
        query.eq(
          'status',
          status
        );

    }


    // ========================================================
    // PRIORITY FILTER
    // ========================================================

    if (
      priority &&
      priority !==
      'all'
    ) {

      query =
        query.eq(
          'priority',
          priority
        );

    }


    // ========================================================
    // SEARCH
    // ========================================================

    if (
      search
    ) {

      const safeSearch =
        search
          .replace(
            /[%_,]/g,
            ''
          );


      if (
        safeSearch
      ) {

        query =
          query.or(
            [
              `reference_number.ilike.%${safeSearch}%`,
              `first_name.ilike.%${safeSearch}%`,
              `last_name.ilike.%${safeSearch}%`,
              `email.ilike.%${safeSearch}%`,
              `company.ilike.%${safeSearch}%`,
              `subject.ilike.%${safeSearch}%`,
            ].join(',')
          );

      }

    }


    // ========================================================
    // RUN QUERY
    // ========================================================

    const {
      data,
      error,
    } =
      await query;


    if (
      error
    ) {

      console.error(
        '[CONTACT LIST DATABASE ERROR]',
        error
      );


      throw error;

    }


    const inquiries =
      (
        data ||
        []
      ).map(
        normalizeInquiry
      );


    // ========================================================
    // RESPONSE STATS
    //
    // These stats represent the currently returned/filter
    // result set.
    // ========================================================

    const stats = {

      total:
        inquiries.length,

      new:
        inquiries.filter(
          (
            inquiry
          ) =>
            inquiry.status ===
            'new'
        ).length,

      inProgress:
        inquiries.filter(
          (
            inquiry
          ) =>
            inquiry.status ===
            'in_progress'
        ).length,

      resolved:
        inquiries.filter(
          (
            inquiry
          ) =>
            inquiry.status ===
            'resolved'
        ).length,

      closed:
        inquiries.filter(
          (
            inquiry
          ) =>
            inquiry.status ===
            'closed'
        ).length,

    };


    // ========================================================
    // RESPONSE
    // ========================================================

    return res.json({

      success:
        true,

      data: {

        inquiries,

        stats,

      },

    });


  } catch (
    error
  ) {

    console.error(
      '[CONTACT LIST ERROR]',
      error
    );


    return res
      .status(
        500
      )
      .json({

        success:
          false,

        message:
          'Unable to load contact inquiries.',

      });

  }

}


// ============================================================
// ADMIN: GET SINGLE CONTACT INQUIRY
//
// GET /api/contact/admin/:id
//
// IMPORTANT:
// Protect with admin authentication middleware.
// ============================================================

export async function getContactInquiry(
  req,
  res
) {

  try {

    const id =
      cleanString(
        req.params.id,
        100
      );


    if (
      !id
    ) {

      return res
        .status(
          400
        )
        .json({

          success:
            false,

          message:
            'Inquiry ID is required.',

        });

    }


    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          'contact_inquiries'
        )
        .select(`
          id,
          reference_number,
          first_name,
          last_name,
          email,
          phone,
          company,
          subject,
          message,
          status,
          priority,
          admin_notes,
          created_at,
          updated_at
        `)
        .eq(
          'id',
          id
        )
        .maybeSingle();


    if (
      error
    ) {

      console.error(
        '[CONTACT GET DATABASE ERROR]',
        error
      );


      throw error;

    }


    if (
      !data
    ) {

      return res
        .status(
          404
        )
        .json({

          success:
            false,

          message:
            'Inquiry not found.',

        });

    }


    return res.json({

      success:
        true,

      data: {

        inquiry:
          normalizeInquiry(
            data
          ),

      },

    });


  } catch (
    error
  ) {

    console.error(
      '[CONTACT GET ERROR]',
      error
    );


    return res
      .status(
        500
      )
      .json({

        success:
          false,

        message:
          'Unable to load inquiry.',

      });

  }

}


// ============================================================
// ADMIN: UPDATE CONTACT INQUIRY
//
// PATCH /api/contact/admin/:id
//
// IMPORTANT:
// Protect this route with admin authentication middleware.
// ============================================================

export async function updateContactInquiry(
  req,
  res
) {

  try {

    const id =
      cleanString(
        req.params.id,
        100
      );


    if (
      !id
    ) {

      return res
        .status(
          400
        )
        .json({

          success:
            false,

          message:
            'Inquiry ID is required.',

        });

    }


    const body =
      req.body ||
      {};


    const updates =
      {};


    // ========================================================
    // STATUS
    // ========================================================

    if (
      body.status !==
      undefined
    ) {

      const status =
        cleanString(
          body.status,
          30
        );


      if (
        !ALLOWED_STATUSES.includes(
          status
        )
      ) {

        return res
          .status(
            400
          )
          .json({

            success:
              false,

            message:
              'Invalid inquiry status.',

          });

      }


      updates.status =
        status;

    }


    // ========================================================
    // PRIORITY
    // ========================================================

    if (
      body.priority !==
      undefined
    ) {

      const priority =
        cleanString(
          body.priority,
          30
        );


      if (
        !ALLOWED_PRIORITIES.includes(
          priority
        )
      ) {

        return res
          .status(
            400
          )
          .json({

            success:
              false,

            message:
              'Invalid inquiry priority.',

          });

      }


      updates.priority =
        priority;

    }


    // ========================================================
    // ADMIN NOTES
    // ========================================================

    if (
      body.adminNotes !==
      undefined
    ) {

      updates.admin_notes =
        cleanString(
          body.adminNotes,
          5000
        ) ||
        null;

    }


    // ========================================================
    // NOTHING TO UPDATE
    // ========================================================

    if (
      Object.keys(
        updates
      ).length ===
      0
    ) {

      return res
        .status(
          400
        )
        .json({

          success:
            false,

          message:
            'No valid inquiry updates were provided.',

        });

    }


    updates.updated_at =
      new Date()
        .toISOString();


    // ========================================================
    // UPDATE SUPABASE
    // ========================================================

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          'contact_inquiries'
        )
        .update(
          updates
        )
        .eq(
          'id',
          id
        )
        .select(`
          id,
          reference_number,
          first_name,
          last_name,
          email,
          phone,
          company,
          subject,
          message,
          status,
          priority,
          admin_notes,
          created_at,
          updated_at
        `)
        .maybeSingle();


    if (
      error
    ) {

      console.error(
        '[CONTACT UPDATE DATABASE ERROR]',
        error
      );


      throw error;

    }


    if (
      !data
    ) {

      return res
        .status(
          404
        )
        .json({

          success:
            false,

          message:
            'Inquiry not found.',

        });

    }


    // ========================================================
    // RESPONSE
    // ========================================================

    return res.json({

      success:
        true,

      message:
        'Inquiry updated successfully.',

      data: {

        inquiry:
          normalizeInquiry(
            data
          ),

      },

    });


  } catch (
    error
  ) {

    console.error(
      '[CONTACT UPDATE ERROR]',
      error
    );


    return res
      .status(
        500
      )
      .json({

        success:
          false,

        message:
          'Unable to update inquiry.',

      });

  }

}