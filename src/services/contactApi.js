import axios from 'axios';


// ============================================================
// API URL
// ============================================================
//
// Production:
// https://apexmachinery.onrender.com/api
//
// Local development:
// Set VITE_API_URL=http://localhost:5000/api
// inside your local .env file.
//
// IMPORTANT:
// We do NOT use localhost as the fallback because a mobile
// phone would try to connect to itself.
// ============================================================

const API_URL = (
  import.meta.env.VITE_API_URL ||
  'https://apexmachinery.onrender.com/api'
).replace(/\/+$/, '');


// ============================================================
// CONTACT API CLIENT
// ============================================================

const contactApi =
  axios.create({

    baseURL:
      `${API_URL}/contact`,

    headers: {

      'Content-Type':
        'application/json',

      Accept:
        'application/json',

    },

    timeout:
      30000,

  });


// ============================================================
// RESPONSE HELPER
// ============================================================

function unwrap(
  response
) {

  return (
    response
      ?.data
      ?.data ??
    response
      ?.data
  );

}


// ============================================================
// NORMALIZE ERROR
// ============================================================

function getApiError(
  error
) {

  // ----------------------------------------------------------
// SERVER RESPONDED WITH AN ERROR
// ----------------------------------------------------------

  if (
    error
      ?.response
  ) {

    const serverMessage =
      error
        ?.response
        ?.data
        ?.message;


    if (
      serverMessage
    ) {

      return new Error(
        serverMessage
      );

    }


    return new Error(
      `Request failed with status ${error.response.status}.`
    );

  }


  // ----------------------------------------------------------
// REQUEST SENT BUT NO RESPONSE
// ----------------------------------------------------------

  if (
    error
      ?.request
  ) {

    return new Error(
      'Unable to connect to ApexMach UG. Please check your internet connection and try again.'
    );

  }


  // ----------------------------------------------------------
// OTHER ERROR
// ----------------------------------------------------------

  return new Error(
    error
      ?.message ||
    'Unable to submit your inquiry.'
  );

}


// ============================================================
// CREATE CONTACT REQUEST
// ============================================================

export async function createContactRequest(
  payload
) {

  try {

    const response =
      await contactApi.post(
        '/',
        payload
      );


    return unwrap(
      response
    );

  } catch (
    error
  ) {

    console.error(
      '[CONTACT API ERROR]',
      {
        message:
          error?.message,

        status:
          error
            ?.response
            ?.status,

        data:
          error
            ?.response
            ?.data,

        baseURL:
          contactApi
            .defaults
            .baseURL,
      }
    );


    throw getApiError(
      error
    );

  }

}


// ============================================================
// EXPORT
// ============================================================

export default contactApi;