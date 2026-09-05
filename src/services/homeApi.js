import axios from 'axios';


// ============================================================
// API CONFIGURATION
// ============================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://apexmachinery.onrender.com/api';


// ============================================================
// HOME API INSTANCE
// ============================================================

const homeApi =
  axios.create({

    baseURL:
      `${API_URL}/home`,

    headers: {
      'Content-Type':
        'application/json',
    },

    timeout: 30000,

  });


// ============================================================
// UNWRAP RESPONSE
// ============================================================

function unwrap(
  response
) {

  return (
    response?.data?.data ??
    response?.data
  );

}


// ============================================================
// GET HOME PAGE
// ============================================================

export async function getHomePage() {

  try {

    const response =
      await homeApi.get('/');


    return unwrap(
      response
    );

  } catch (
    error
  ) {

    console.error(
      '[Home API] Failed to load homepage:',
      {
        message:
          error?.message,

        status:
          error?.response?.status,

        data:
          error?.response?.data,

        apiUrl:
          `${API_URL}/home`,
      }
    );


    throw error;

  }

}


// ============================================================
// EXPORT
// ============================================================

export default homeApi;