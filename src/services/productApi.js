import axios from 'axios';


// ============================================================
// API CONFIG
// ============================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://apexmachinery.onrender.com/api';


// ============================================================
// AXIOS INSTANCE
// ============================================================

const productApi =
  axios.create({
    baseURL:
      `${API_URL}/products`,

    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },

    timeout: 30000,
  });


// ============================================================
// UNWRAP RESPONSE
// ============================================================

function unwrap(response) {

  return (
    response?.data?.data ??
    response?.data
  );

}


// ============================================================
// GET ALL PRODUCTS
// ============================================================

export async function getProducts() {

  try {

    const response =
      await productApi.get('/');


    return unwrap(response);

  } catch (error) {

    console.error(
      '[PRODUCT API] Failed to load products:',
      {
        message:
          error?.message,

        status:
          error?.response?.status,

        data:
          error?.response?.data,

        apiUrl:
          `${API_URL}/products`,
      }
    );


    throw error;

  }

}


// ============================================================
// GET ONE PRODUCT
// ============================================================

export async function getProduct(
  productId
) {

  try {

    const response =
      await productApi.get(
        `/${encodeURIComponent(
          productId
        )}`
      );


    return unwrap(response);

  } catch (error) {

    console.error(
      '[PRODUCT API] Failed to load product:',
      {
        productId,

        message:
          error?.message,

        status:
          error?.response?.status,

        data:
          error?.response?.data,

        apiUrl:
          `${API_URL}/products/${productId}`,
      }
    );


    throw error;

  }

}


// ============================================================
// GET CATEGORIES
// ============================================================

export async function getProductCategories() {

  try {

    const response =
      await productApi.get(
        '/categories'
      );


    return unwrap(response);

  } catch (error) {

    console.error(
      '[PRODUCT API] Failed to load categories:',
      {
        message:
          error?.message,

        status:
          error?.response?.status,

        data:
          error?.response?.data,

        apiUrl:
          `${API_URL}/products/categories`,
      }
    );


    throw error;

  }

}


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default productApi;