import axios from 'axios';


const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';


const customerApi =
  axios.create({
    baseURL:
      `${API_URL}/customer`,
  });


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
  }
);


export async function getCustomerDashboard() {
  const {
    data,
  } =
    await customerApi.get(
      '/dashboard'
    );

  return data.dashboard;
}


export async function updateCustomerProfile(
  payload
) {
  const {
    data,
  } =
    await customerApi.patch(
      '/profile',
      payload
    );

  return data;
}


export async function addCustomerAddress(
  payload
) {
  const {
    data,
  } =
    await customerApi.post(
      '/addresses',
      payload
    );

  return data;
}


export async function removeCustomerAddress(
  id
) {
  const {
    data,
  } =
    await customerApi.delete(
      `/addresses/${id}`
    );

  return data;
}


export async function makeDefaultAddress(
  id
) {
  const {
    data,
  } =
    await customerApi.patch(
      `/addresses/${id}/default`
    );

  return data;
}


export async function deleteWishlistItem(
  id
) {
  const {
    data,
  } =
    await customerApi.delete(
      `/wishlist/${id}`
    );

  return data;
}


export async function markCustomerNotificationRead(
  id
) {
  const {
    data,
  } =
    await customerApi.patch(
      `/notifications/${id}/read`
    );

  return data;
}


export async function markCustomerNotificationsRead() {
  const {
    data,
  } =
    await customerApi.patch(
      '/notifications/read-all'
    );

  return data;
}


export async function saveCustomerPreferences(
  payload
) {
  const {
    data,
  } =
    await customerApi.patch(
      '/preferences',
      payload
    );

  return data;
}


export async function updateCustomerPassword(
  payload
) {
  const {
    data,
  } =
    await customerApi.patch(
      '/password',
      payload
    );

  return data;
}


export async function submitCreditTopup(
  amount
) {
  const {
    data,
  } =
    await customerApi.post(
      '/credit/topup',
      {
        amount,
      }
    );

  return data;
}