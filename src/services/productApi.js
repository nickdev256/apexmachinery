import axios from 'axios';


// ============================================================
// API CONFIG
// ============================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';


const productApi =
  axios.create({
    baseURL:
      `${API_URL}/products`,
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
  const response =
    await productApi.get('/');

  return unwrap(response);
}


// ============================================================
// GET ONE PRODUCT
// ============================================================

export async function getProduct(
  productId
) {
  const response =
    await productApi.get(
      `/${productId}`
    );

  return unwrap(response);
}


// ============================================================
// GET CATEGORIES
// ============================================================

export async function getProductCategories() {
  const response =
    await productApi.get(
      '/categories'
    );

  return unwrap(response);
}


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default productApi;