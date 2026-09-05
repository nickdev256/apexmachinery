import axios from 'axios';


// ============================================================
// API URL
// ============================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';


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
// CREATE CONTACT REQUEST
// ============================================================

export async function createContactRequest(
  payload
) {

  const response =
    await contactApi.post(
      '/',
      payload
    );


  return unwrap(
    response
  );

}


// ============================================================
// EXPORT
// ============================================================

export default contactApi;