import axios from 'axios';


// ============================================================
// API CONFIG
// ============================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';


const adminApi =
  axios.create({
    baseURL:
      `${API_URL}/admin`,
  });


// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

adminApi.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem(
        'apex_access_token'
      );


    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }


    return config;

  },

  (error) =>
    Promise.reject(
      error
    )

);


// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

adminApi.interceptors.response.use(

  (response) =>
    response,

  (error) => {

    if (
      error?.response?.status ===
      401
    ) {

      localStorage.removeItem(
        'apex_access_token'
      );

      localStorage.removeItem(
        'apex_auth_user'
      );

    }


    return Promise.reject(
      error
    );

  }

);


// ============================================================
// RESPONSE HELPER
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
// ADMIN DASHBOARD
// ============================================================

export async function getAdminDashboard() {

  const response =
    await adminApi.get(
      '/dashboard'
    );


  return unwrap(
    response
  );

}


// ============================================================
// ORDERS
// ============================================================


// ------------------------------------------------------------
// GET ALL ORDERS
// ------------------------------------------------------------

export async function getAdminOrders() {

  const response =
    await adminApi.get(
      '/orders'
    );


  return unwrap(
    response
  );

}


// ------------------------------------------------------------
// GET ONE ORDER
// ------------------------------------------------------------

export async function getAdminOrder(
  orderId
) {

  if (!orderId) {

    throw new Error(
      'Order ID is required.'
    );

  }


  const response =
    await adminApi.get(
      `/orders/${orderId}`
    );


  return unwrap(
    response
  );

}


// ------------------------------------------------------------
// UPDATE ORDER STATUS
// ------------------------------------------------------------

export async function updateAdminOrderStatus(
  orderId,
  status
) {

  if (!orderId) {

    throw new Error(
      'Order ID is required.'
    );

  }


  if (!status) {

    throw new Error(
      'Order status is required.'
    );

  }


  const response =
    await adminApi.patch(
      `/orders/${orderId}/status`,
      {
        status,
      }
    );


  return unwrap(
    response
  );

}


// ============================================================
// CUSTOMERS
// ============================================================


// ------------------------------------------------------------
// GET ALL CUSTOMERS
// ------------------------------------------------------------

export async function getAdminCustomers() {

  const response =
    await adminApi.get(
      '/customers'
    );


  return unwrap(
    response
  );

}


// ------------------------------------------------------------
// GET ONE CUSTOMER
// ------------------------------------------------------------

export async function getAdminCustomer(
  customerId
) {

  if (!customerId) {

    throw new Error(
      'Customer ID is required.'
    );

  }


  const response =
    await adminApi.get(
      `/customers/${customerId}`
    );


  return unwrap(
    response
  );

}


// ------------------------------------------------------------
// UPDATE CUSTOMER
// ------------------------------------------------------------

export async function updateAdminCustomer(
  customerId,
  payload
) {

  if (!customerId) {

    throw new Error(
      'Customer ID is required.'
    );

  }


  if (
    !payload ||
    typeof payload !==
      'object'
  ) {

    throw new Error(
      'Customer update data is required.'
    );

  }


  const response =
    await adminApi.patch(
      `/customers/${customerId}`,
      payload
    );


  return unwrap(
    response
  );

}


// ------------------------------------------------------------
// UPDATE CUSTOMER STATUS
// ------------------------------------------------------------

export async function updateAdminCustomerStatus(
  customerId,
  status
) {

  if (!customerId) {

    throw new Error(
      'Customer ID is required.'
    );

  }


  if (!status) {

    throw new Error(
      'Customer status is required.'
    );

  }


  return updateAdminCustomer(
    customerId,
    {
      status,
    }
  );

}


// ============================================================
// CREDIT REQUESTS
// ============================================================


// ------------------------------------------------------------
// GET CREDIT REQUESTS
// ------------------------------------------------------------

export async function getAdminCreditRequests() {

  const response =
    await adminApi.get(
      '/credit-requests'
    );


  return unwrap(
    response
  );

}// ============================================================
// CATEGORIES
// ============================================================

export async function getAdminCategories() {

  const response =
    await adminApi.get(
      '/categories'
    );

  return unwrap(
    response
  );

}


export async function createAdminCategory(
  payload
) {

  const response =
    await adminApi.post(
      '/categories',
      payload
    );

  return unwrap(
    response
  );

}


export async function updateAdminCategory(
  categoryId,
  payload
) {

  if (!categoryId) {

    throw new Error(
      'Category ID is required.'
    );

  }


  const response =
    await adminApi.patch(
      `/categories/${categoryId}`,
      payload
    );

  return unwrap(
    response
  );

}


export async function deleteAdminCategory(
  categoryId
) {

  if (!categoryId) {

    throw new Error(
      'Category ID is required.'
    );

  }


  const response =
    await adminApi.delete(
      `/categories/${categoryId}`
    );

  return unwrap(
    response
  );

}// ============================================================
// PRODUCTS
// ============================================================

export async function getAdminProducts() {
  const response =
    await adminApi.get(
      '/products'
    );

  return unwrap(
    response
  );
}


export async function getAdminProduct(
  productId
) {
  const response =
    await adminApi.get(
      `/products/${productId}`
    );

  return unwrap(
    response
  );
}


export async function createAdminProduct(
  payload
) {
  const response =
    await adminApi.post(
      '/products',
      payload
    );

  return unwrap(
    response
  );
}


export async function updateAdminProduct(
  productId,
  payload
) {
  const response =
    await adminApi.patch(
      `/products/${productId}`,
      payload
    );

  return unwrap(
    response
  );
}


export async function deleteAdminProduct(
  productId
) {
  const response =
    await adminApi.delete(
      `/products/${productId}`
    );

  return unwrap(
    response
  );
}


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default adminApi;