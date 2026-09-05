import axios from 'axios';


const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';


const homeApi =
  axios.create({

    baseURL:
      `${API_URL}/home`,

  });


// ============================================================
// UNWRAP
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

  const response =
    await homeApi.get(
      '/'
    );


  return unwrap(
    response
  );

}


export default homeApi;