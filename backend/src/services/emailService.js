import nodemailer from 'nodemailer';


// ============================================================
// GET EMAIL CONFIG
// Read environment variables when needed instead of import time
// ============================================================

function getEmailConfig() {

  const gmailUser =
    String(
      process.env.GMAIL_USER ||
      ''
    ).trim();


  const gmailAppPassword =
    String(
      process.env.GMAIL_APP_PASSWORD ||
      ''
    )
      .replace(
        /\s+/g,
        ''
      )
      .trim();


  const recipient =
    String(
      process.env.APEX_CONTACT_EMAIL ||
      gmailUser ||
      ''
    ).trim();


  return {

    gmailUser,

    gmailAppPassword,

    recipient,

  };

}


// ============================================================
// CREATE GMAIL SMTP TRANSPORTER
// ============================================================

function createTransporter() {

  const {
    gmailUser,
    gmailAppPassword,
  } =
    getEmailConfig();


  if (
    !gmailUser ||
    !gmailAppPassword
  ) {

    return null;

  }


  return nodemailer.createTransport({

    host:
      'smtp.gmail.com',

    port:
      465,

    secure:
      true,

    auth: {

      user:
        gmailUser,

      pass:
        gmailAppPassword,

    },

  });

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHtml(
  value = ''
) {

  return String(
    value
  )
    .replace(
      /&/g,
      '&amp;'
    )
    .replace(
      /</g,
      '&lt;'
    )
    .replace(
      />/g,
      '&gt;'
    )
    .replace(
      /"/g,
      '&quot;'
    )
    .replace(
      /'/g,
      '&#039;'
    );

}


// ============================================================
// SUBJECT LABEL
// ============================================================

function getSubjectLabel(
  subject
) {

  const labels = {

    quotation:
      'Request a Quotation',

    product:
      'Product Information',

    'bulk-order':
      'Bulk / Enterprise Order',

    logistics:
      'Logistics & Delivery',

    technical:
      'Technical Assistance',

    order:
      'Existing Order Support',

    other:
      'Other Inquiry',

  };


  return (
    labels[subject] ||
    subject ||
    'General Inquiry'
  );

}


// ============================================================
// SAFE EMAIL CONFIG LOG
//
// Does NOT print the password.
// ============================================================

function logEmailConfiguration() {

  const {
    gmailUser,
    gmailAppPassword,
    recipient,
  } =
    getEmailConfig();


  console.log(
    '[EMAIL CONFIG]',
    {

      gmailUser:
        gmailUser ||
        'MISSING',

      appPasswordConfigured:
        Boolean(
          gmailAppPassword
        ),

      appPasswordLength:
        gmailAppPassword.length,

      recipient:
        recipient ||
        'MISSING',

    }
  );

}


// ============================================================
// SEND CONTACT INQUIRY EMAIL
// ============================================================

export async function sendContactInquiryEmail({
  referenceNumber,
  firstName,
  lastName,
  email,
  phone,
  company,
  subject,
  message,
  createdAt,
}) {

  // ==========================================================
  // READ CONFIG
  // ==========================================================

  const {
    gmailUser,
    gmailAppPassword,
    recipient,
  } =
    getEmailConfig();


  // ==========================================================
  // DEBUG CONFIG SAFELY
  // ==========================================================

  logEmailConfiguration();


  // ==========================================================
  // VALIDATE CONFIG
  // ==========================================================

  if (
    !gmailUser
  ) {

    console.error(
      '[EMAIL CONFIG ERROR] GMAIL_USER is missing.'
    );


    return {

      success:
        false,

      skipped:
        true,

      reason:
        'GMAIL_USER is missing.',

    };

  }


  if (
    !gmailAppPassword
  ) {

    console.error(
      '[EMAIL CONFIG ERROR] GMAIL_APP_PASSWORD is missing.'
    );


    return {

      success:
        false,

      skipped:
        true,

      reason:
        'GMAIL_APP_PASSWORD is missing.',

    };

  }


  if (
    !recipient
  ) {

    console.error(
      '[EMAIL CONFIG ERROR] APEX_CONTACT_EMAIL is missing.'
    );


    return {

      success:
        false,

      skipped:
        true,

      reason:
        'APEX_CONTACT_EMAIL is missing.',

    };

  }


  // ==========================================================
  // CREATE TRANSPORTER
  // ==========================================================

  const transporter =
    createTransporter();


  if (
    !transporter
  ) {

    console.error(
      '[EMAIL ERROR] Gmail transporter could not be created.'
    );


    return {

      success:
        false,

      skipped:
        true,

      reason:
        'Gmail transporter could not be created.',

    };

  }


  // ==========================================================
  // INQUIRY DETAILS
  // ==========================================================

  const inquiryType =
    getSubjectLabel(
      subject
    );


  const customerName =
    `${firstName || ''} ${lastName || ''}`
      .trim();


  const submittedAt =
    createdAt
      ? new Date(
          createdAt
        ).toLocaleString(
          'en-UG',
          {

            timeZone:
              'Africa/Kampala',

            dateStyle:
              'medium',

            timeStyle:
              'short',

          }
        )
      : new Date()
          .toLocaleString(
            'en-UG',
            {

              timeZone:
                'Africa/Kampala',

              dateStyle:
                'medium',

              timeStyle:
                'short',

            }
          );


  // ==========================================================
  // SAFE HTML VALUES
  // ==========================================================

  const safeReference =
    escapeHtml(
      referenceNumber
    );


  const safeName =
    escapeHtml(
      customerName
    );


  const safeEmail =
    escapeHtml(
      email
    );


  const safePhone =
    escapeHtml(
      phone ||
      'Not provided'
    );


  const safeCompany =
    escapeHtml(
      company ||
      'Not provided'
    );


  const safeSubject =
    escapeHtml(
      inquiryType
    );


  const safeMessage =
    escapeHtml(
      message
    )
      .replace(
        /\n/g,
        '<br />'
      );


  const safeSubmittedAt =
    escapeHtml(
      submittedAt
    );


  // ==========================================================
  // TEXT VERSION
  // ==========================================================

  const text = `
NEW APEXMACH UG CUSTOMER INQUIRY

Reference: ${referenceNumber}

Name: ${customerName}

Email: ${email}

Phone: ${phone || 'Not provided'}

Company: ${company || 'Not provided'}

Inquiry Type: ${inquiryType}


CUSTOMER MESSAGE

${message}


Submitted: ${submittedAt}
`.trim();


  // ==========================================================
  // HTML VERSION
  // ==========================================================

  const html = `
<!doctype html>

<html>

  <body
    style="
      margin:0;
      padding:0;
      background:#f5f6f8;
      font-family:Arial,Helvetica,sans-serif;
      color:#222222;
    "
  >

    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="
        background:#f5f6f8;
        padding:32px 16px;
      "
    >

      <tr>

        <td
          align="center"
        >

          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
              max-width:680px;
              background:#ffffff;
              border:1px solid #dddddd;
              border-radius:8px;
              overflow:hidden;
            "
          >

            <tr>

              <td
                style="
                  padding:24px 28px;
                  background:#0B1F4D;
                  color:#ffffff;
                "
              >

                <div
                  style="
                    color:#D4A017;
                    font-size:12px;
                    font-weight:700;
                    letter-spacing:1px;
                    text-transform:uppercase;
                  "
                >
                  ApexMach UG
                </div>


                <h1
                  style="
                    margin:8px 0 0;
                    font-size:24px;
                    line-height:1.3;
                    color:#ffffff;
                  "
                >
                  New Customer Inquiry
                </h1>

              </td>

            </tr>


            <tr>

              <td
                style="
                  padding:28px;
                "
              >

                <p
                  style="
                    margin:0 0 22px;
                    line-height:1.6;
                  "
                >
                  A customer has submitted a new inquiry
                  through the ApexMach UG website.
                </p>


                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="
                    margin-bottom:24px;
                    border-collapse:collapse;
                  "
                >

                  <tr>

                    <td
                      style="
                        padding:9px 0;
                        width:150px;
                        color:#5B5F6B;
                        border-bottom:1px solid #eeeeee;
                      "
                    >
                      Reference
                    </td>

                    <td
                      style="
                        padding:9px 0;
                        font-weight:700;
                        color:#0B1F4D;
                        border-bottom:1px solid #eeeeee;
                      "
                    >
                      ${safeReference}
                    </td>

                  </tr>


                  <tr>

                    <td
                      style="
                        padding:9px 0;
                        color:#5B5F6B;
                        border-bottom:1px solid #eeeeee;
                      "
                    >
                      Customer
                    </td>

                    <td
                      style="
                        padding:9px 0;
                        font-weight:700;
                        border-bottom:1px solid #eeeeee;
                      "
                    >
                      ${safeName}
                    </td>

                  </tr>


                  <tr>

                    <td
                      style="
                        padding:9px 0;
                        color:#5B5F6B;
                        border-bottom:1px solid #eeeeee;
                      "
                    >
                      Email
                    </td>

                    <td
                      style="
                        padding:9px 0;
                        border-bottom:1px solid #eeeeee;
                      "
                    >
                      ${safeEmail}
                    </td>

                  </tr>


                  <tr>

                    <td
                      style="
                        padding:9px 0;
                        color:#5B5F6B;
                        border-bottom:1px solid #eeeeee;
                      "
                    >
                      Phone
                    </td>

                    <td
                      style="
                        padding:9px 0;
                        border-bottom:1px solid #eeeeee;
                      "
                    >
                      ${safePhone}
                    </td>

                  </tr>


                  <tr>

                    <td
                      style="
                        padding:9px 0;
                        color:#5B5F6B;
                        border-bottom:1px solid #eeeeee;
                      "
                    >
                      Company
                    </td>

                    <td
                      style="
                        padding:9px 0;
                        border-bottom:1px solid #eeeeee;
                      "
                    >
                      ${safeCompany}
                    </td>

                  </tr>


                  <tr>

                    <td
                      style="
                        padding:9px 0;
                        color:#5B5F6B;
                        border-bottom:1px solid #eeeeee;
                      "
                    >
                      Inquiry Type
                    </td>

                    <td
                      style="
                        padding:9px 0;
                        border-bottom:1px solid #eeeeee;
                      "
                    >
                      ${safeSubject}
                    </td>

                  </tr>


                  <tr>

                    <td
                      style="
                        padding:9px 0;
                        color:#5B5F6B;
                      "
                    >
                      Submitted
                    </td>

                    <td
                      style="
                        padding:9px 0;
                      "
                    >
                      ${safeSubmittedAt}
                    </td>

                  </tr>

                </table>


                <div
                  style="
                    margin-top:24px;
                  "
                >

                  <h2
                    style="
                      margin:0 0 10px;
                      color:#0B1F4D;
                      font-size:17px;
                    "
                  >
                    Customer Message
                  </h2>


                  <div
                    style="
                      padding:18px;
                      border-left:4px solid #D4A017;
                      background:#F8F8F8;
                      line-height:1.65;
                    "
                  >
                    ${safeMessage}
                  </div>

                </div>


                <p
                  style="
                    margin:24px 0 0;
                    color:#5B5F6B;
                    font-size:13px;
                    line-height:1.6;
                  "
                >
                  This inquiry is also stored in the
                  ApexMach UG contact inquiry database.
                </p>

              </td>

            </tr>

          </table>

        </td>

      </tr>

    </table>

  </body>

</html>
  `;


  // ==========================================================
  // SEND
  // ==========================================================

  try {

    console.log(
      `[EMAIL] Attempting to send inquiry ${referenceNumber}...`
    );


    const info =
      await transporter.sendMail({

        from:
          `"ApexMach UG" <${gmailUser}>`,

        to:
          recipient,

        replyTo:
          email,

        subject:
          `New ApexMach UG Inquiry — ${referenceNumber}`,

        text,

        html,

      });


    console.log(
      '[CONTACT EMAIL SENT]',
      {

        referenceNumber,

        messageId:
          info.messageId,

        accepted:
          info.accepted,

        rejected:
          info.rejected,

        response:
          info.response,

      }
    );


    return {

      success:
        true,

      id:
        info.messageId,

      accepted:
        info.accepted,

      rejected:
        info.rejected,

    };


  } catch (
    error
  ) {

    console.error(
      '[CONTACT EMAIL ERROR]',
      {

        name:
          error?.name,

        message:
          error?.message,

        code:
          error?.code,

        command:
          error?.command,

        responseCode:
          error?.responseCode,

        response:
          error?.response,

      }
    );


    return {

      success:
        false,

      error:
        error?.message ||
        'Unable to send email.',

    };

  }

}


// ============================================================
// VERIFY EMAIL SERVICE
// ============================================================

export async function verifyEmailService() {

  const {
    gmailUser,
    gmailAppPassword,
    recipient,
  } =
    getEmailConfig();


  logEmailConfiguration();


  if (
    !gmailUser ||
    !gmailAppPassword ||
    !recipient
  ) {

    return {

      success:
        false,

      message:
        'Gmail SMTP environment variables are incomplete.',

    };

  }


  const transporter =
    createTransporter();


  if (
    !transporter
  ) {

    return {

      success:
        false,

      message:
        'Unable to create Gmail SMTP transporter.',

    };

  }


  try {

    console.log(
      '[EMAIL] Verifying Gmail SMTP connection...'
    );


    await transporter.verify();


    console.log(
      '[EMAIL] Gmail SMTP connection verified successfully.'
    );


    return {

      success:
        true,

      message:
        'Gmail SMTP connection verified.',

    };


  } catch (
    error
  ) {

    console.error(
      '[EMAIL VERIFY ERROR]',
      {

        name:
          error?.name,

        message:
          error?.message,

        code:
          error?.code,

        command:
          error?.command,

        responseCode:
          error?.responseCode,

        response:
          error?.response,

      }
    );


    return {

      success:
        false,

      message:
        error?.message ||
        'Unable to verify Gmail SMTP.',

    };

  }

}