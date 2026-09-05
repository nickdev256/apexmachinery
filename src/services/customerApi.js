import axios from 'axios';


// ============================================================
// API CONFIG
// ============================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';


const customerApi =
  axios.create({
    baseURL:
      `${API_URL}/customer`,
  });


// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

customerApi.interceptors.request.use(

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

customerApi.interceptors.response.use(

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
// CUSTOMER DASHBOARD
// ============================================================

export async function getCustomerDashboard() {

  const response =
    await customerApi.get(
      '/dashboard'
    );


  return unwrap(
    response
  );

}


// ============================================================
// UPDATE PROFILE
// ============================================================

export async function updateCustomerProfile(
  payload
) {

  const response =
    await customerApi.patch(
      '/profile',
      payload
    );


  return unwrap(
    response
  );

}


// ============================================================
// ADD ADDRESS
// ============================================================

export async function addCustomerAddress(
  payload
) {

  const response =
    await customerApi.post(
      '/addresses',
      payload
    );


  return unwrap(
    response
  );

}


// ============================================================
// DELETE ADDRESS
// ============================================================

export async function removeCustomerAddress(
  id
) {

  const response =
    await customerApi.delete(
      `/addresses/${id}`
    );


  return unwrap(
    response
  );

}


// ============================================================
// SET DEFAULT ADDRESS
// ============================================================

export async function makeDefaultAddress(
  id
) {

  const response =
    await customerApi.patch(
      `/addresses/${id}/default`
    );


  return unwrap(
    response
  );

}


// ============================================================
// GET CUSTOMER WISHLIST
// ============================================================

export async function getCustomerWishlist() {

  const response =
    await customerApi.get(
      '/wishlist'
    );


  return unwrap(
    response
  );

}


// ============================================================
// ADD CUSTOMER WISHLIST ITEM
// ============================================================

export async function addCustomerWishlistItem(
  product
) {

  const response =
    await customerApi.post(
      '/wishlist',
      {

        productId:
          product.id ??
          product.productId,

        productName:
          product.name ??
          product.productName,

        category:
          product.categoryName ??
          product.category,

        brand:
          product.brand,

        price:
          product.price,

        image:
          product.images?.[0] ??
          product.image,

        stockStatus:
          product.stockStatus ??
          product.stock,

      }
    );


  return unwrap(
    response
  );

}


// ============================================================
// REMOVE ONE WISHLIST ITEM
// ============================================================

export async function deleteWishlistItem(
  id
) {

  const response =
    await customerApi.delete(
      `/wishlist/${id}`
    );


  return unwrap(
    response
  );

}


// ============================================================
// CLEAR CUSTOMER WISHLIST
// ============================================================

export async function clearCustomerWishlist() {

  const response =
    await customerApi.delete(
      '/wishlist'
    );


  return unwrap(
    response
  );

}


// ============================================================
// MARK NOTIFICATION READ
// ============================================================

export async function markCustomerNotificationRead(
  id
) {

  const response =
    await customerApi.patch(
      `/notifications/${id}/read`
    );


  return unwrap(
    response
  );

}


// ============================================================
// MARK ALL NOTIFICATIONS READ
// ============================================================

export async function markCustomerNotificationsRead() {

  const response =
    await customerApi.patch(
      '/notifications/read-all'
    );


  return unwrap(
    response
  );

}


// ============================================================
// SAVE CUSTOMER PREFERENCES
// ============================================================

export async function saveCustomerPreferences(
  payload
) {

  const response =
    await customerApi.patch(
      '/preferences',
      {

        orderUpdates:
          payload.orderUpdates ??
          payload.order_updates,

        inventoryAlerts:
          payload.inventoryAlerts ??
          payload.inventory_alerts,

        invoiceReminders:
          payload.invoiceReminders ??
          payload.invoice_reminders,

        marketing:
          payload.marketing,

      }
    );


  return unwrap(
    response
  );

}


// ============================================================
// UPDATE PASSWORD
// ============================================================

export async function updateCustomerPassword(
  payload
) {

  const response =
    await customerApi.patch(
      '/password',
      payload
    );


  return unwrap(
    response
  );

}


// ============================================================
// CREDIT TOP-UP REQUEST
// ============================================================

export async function submitCreditTopup(
  amount
) {

  const response =
    await customerApi.post(
      '/credit/topup',
      {
        amount,
      }
    );


  return unwrap(
    response
  );

}


// ============================================================
// CREATE CUSTOMER ORDER
// ============================================================

export async function createCustomerOrder(
  payload
) {

  const response =
    await customerApi.post(
      '/orders',
      payload
    );


  return unwrap(
    response
  );

}


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default customerApi;