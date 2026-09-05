import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import Icon from '../components/Icon';
import { ProgressBar } from '../components/Timeline';
import { useAuth } from '../context/AuthContext';

import {
  getCustomerDashboard,
  updateCustomerProfile,
  addCustomerAddress,
  removeCustomerAddress,
  makeDefaultAddress,
  deleteWishlistItem,
  markCustomerNotificationRead,
  markCustomerNotificationsRead,
  saveCustomerPreferences,
  updateCustomerPassword,
  submitCreditTopup,
} from '../services/customerApi';

import './CustomerDashboard.css';


// ============================================================
// DEFAULTS
// ============================================================

const emptyAddress = {
  title: '',
  name: '',
  company: '',
  address: '',
  city: '',
  phone: '',
};


const emptyPasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};


const defaultPreferences = {
  orderUpdates: true,
  inventoryAlerts: true,
  invoiceReminders: true,
  marketing: false,
};


// ============================================================
// SIDEBAR
// ============================================================

const sidebarItems = [
  {
    key: 'overview',
    label: 'Personal Information',
    icon: 'user',
  },
  {
    key: 'orders',
    label: 'My Orders',
    icon: 'package',
  },
  {
    key: 'addresses',
    label: 'Saved Addresses',
    icon: 'location',
  },
  {
    key: 'billing',
    label: 'Billing & Invoices',
    icon: 'package',
  },
  {
    key: 'wishlist',
    label: 'My Wishlist',
    icon: 'heart',
  },
  {
    key: 'notifications',
    label: 'Notifications',
    icon: 'clock',
  },
  {
    key: 'settings',
    label: 'Account Settings',
    icon: 'settings',
  },
];


// ============================================================
// HELPERS
// ============================================================

function formatMoney(value) {
  const amount =
    Number(value || 0);

  return `UGX ${amount.toLocaleString(
    'en-UG',
    {
      maximumFractionDigits: 0,
    }
  )}`;
}


function formatDate(value) {
  if (!value) {
    return '—';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    'en-UG',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
  ).format(date);
}


function formatMemberSince(value) {
  if (!value) {
    return 'Recently';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return String(value);
  }

  return new Intl.DateTimeFormat(
    'en-UG',
    {
      month: 'long',
      year: 'numeric',
    }
  ).format(date);
}


function formatRelativeTime(value) {
  if (!value) {
    return '';
  }

  const timestamp =
    new Date(value).getTime();

  if (
    Number.isNaN(timestamp)
  ) {
    return '';
  }

  const difference =
    Date.now() -
    timestamp;

  const minutes =
    Math.floor(
      difference /
      60000
    );

  const hours =
    Math.floor(
      difference /
      3600000
    );

  const days =
    Math.floor(
      difference /
      86400000
    );

  if (minutes < 1) {
    return 'Just now';
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  if (days === 1) {
    return 'Yesterday';
  }

  if (days < 7) {
    return `${days} days ago`;
  }

  return formatDate(value);
}


function getTrackingIndex(status) {
  switch (
    String(status)
      .trim()
      .toLowerCase()
  ) {
    case 'pending':
      return 0;

    case 'processing':
      return 1;

    case 'in transit':
    case 'in_transit':
      return 2;

    case 'delivered':
      return 3;

    default:
      return 0;
  }
}


// ============================================================
// CUSTOMER DASHBOARD
// ============================================================

export default function CustomerDashboard() {

  const {
    user,
    logout,
    refreshUser,
  } =
    useAuth();


  const navigate =
    useNavigate();


  const toastTimerRef =
    useRef(null);


  const pageTopRef =
    useRef(null);


  // ==========================================================
  // GENERAL STATE
  // ==========================================================

  const [
    active,
    setActive,
  ] =
    useState('overview');


  const [
    loadingDashboard,
    setLoadingDashboard,
  ] =
    useState(true);


  const [
    refreshing,
    setRefreshing,
  ] =
    useState(false);


  const [
    dashboardError,
    setDashboardError,
  ] =
    useState('');


  const [
    message,
    setMessage,
  ] =
    useState('');


  const [
    messageType,
    setMessageType,
  ] =
    useState('success');


  const [
    loggingOut,
    setLoggingOut,
  ] =
    useState(false);


  // ==========================================================
  // DATABASE DATA
  // ==========================================================

  const [
    profile,
    setProfile,
  ] =
    useState({
      name:
        user?.name || '',
      company:
        user?.company || '',
      email:
        user?.email || '',
      phone: '',
    });


  const [
    orders,
    setOrders,
  ] =
    useState([]);


  const [
    invoices,
    setInvoices,
  ] =
    useState([]);


  const [
    addresses,
    setAddresses,
  ] =
    useState([]);


  const [
    wishlist,
    setWishlist,
  ] =
    useState([]);


  const [
    notifications,
    setNotifications,
  ] =
    useState([]);


  const [
    preferences,
    setPreferences,
  ] =
    useState(
      defaultPreferences
    );


  const [
    enterpriseBalance,
    setEnterpriseBalance,
  ] =
    useState(0);


  // ==========================================================
  // FORM / ACTION STATE
  // ==========================================================

  const [
    editingProfile,
    setEditingProfile,
  ] =
    useState(false);


  const [
    savingProfile,
    setSavingProfile,
  ] =
    useState(false);


  const [
    showAddressForm,
    setShowAddressForm,
  ] =
    useState(false);


  const [
    newAddress,
    setNewAddress,
  ] =
    useState(
      emptyAddress
    );


  const [
    savingAddress,
    setSavingAddress,
  ] =
    useState(false);


  const [
    deletingAddressId,
    setDeletingAddressId,
  ] =
    useState(null);


  const [
    defaultAddressId,
    setDefaultAddressId,
  ] =
    useState(null);


  const [
    removingWishlistId,
    setRemovingWishlistId,
  ] =
    useState(null);


  const [
    selectedOrder,
    setSelectedOrder,
  ] =
    useState(null);


  const [
    selectedInvoice,
    setSelectedInvoice,
  ] =
    useState(null);


  const [
    passwordForm,
    setPasswordForm,
  ] =
    useState(
      emptyPasswordForm
    );


  const [
    changingPassword,
    setChangingPassword,
  ] =
    useState(false);


  const [
    preferenceSaving,
    setPreferenceSaving,
  ] =
    useState(false);


  const [
    toppingUp,
    setToppingUp,
  ] =
    useState(false);


  // ==========================================================
  // TOAST
  // ==========================================================

  const showMessage =
    useCallback(
      (
        text,
        type = 'success'
      ) => {

        if (
          toastTimerRef.current
        ) {
          clearTimeout(
            toastTimerRef.current
          );
        }


        setMessageType(type);

        setMessage(text);


        toastTimerRef.current =
          setTimeout(
            () => {

              setMessage('');

              toastTimerRef.current =
                null;

            },
            3500
          );

      },
      []
    );


  useEffect(
    () => {

      return () => {

        if (
          toastTimerRef.current
        ) {
          clearTimeout(
            toastTimerRef.current
          );
        }

      };

    },
    []
  );


  // ==========================================================
  // APPLY DATABASE DASHBOARD DATA
  // ==========================================================

  const applyDashboardData =
    useCallback(
      (data) => {

        if (!data) {
          return;
        }


        const dbProfile =
          data.profile || {};


        setProfile({
          name:
            dbProfile.name ||
            user?.name ||
            '',

          company:
            dbProfile.company ||
            user?.company ||
            '',

          email:
            dbProfile.email ||
            user?.email ||
            '',

          phone:
            dbProfile.phone ||
            '',
        });


        setOrders(
          Array.isArray(
            data.orders
          )
            ? data.orders
            : []
        );


        setInvoices(
          Array.isArray(
            data.invoices
          )
            ? data.invoices
            : []
        );


        setAddresses(
          Array.isArray(
            data.addresses
          )
            ? data.addresses
            : []
        );


        setWishlist(
          Array.isArray(
            data.wishlist
          )
            ? data.wishlist
            : []
        );


        setNotifications(
          Array.isArray(
            data.notifications
          )
            ? data.notifications
            : []
        );


        setEnterpriseBalance(
          Number(
            data.credit
              ?.balance ||
            0
          )
        );


        setPreferences({
          orderUpdates:
            data.preferences
              ?.order_updates ??
            true,

          inventoryAlerts:
            data.preferences
              ?.inventory_alerts ??
            true,

          invoiceReminders:
            data.preferences
              ?.invoice_reminders ??
            true,

          marketing:
            data.preferences
              ?.marketing ??
            false,
        });

      },
      [
        user?.name,
        user?.company,
        user?.email,
      ]
    );


  // ==========================================================
  // LOAD CUSTOMER DASHBOARD
  // ==========================================================

  const loadDashboard =
    useCallback(
      async ({
        silent = false,
      } = {}) => {

        try {

          if (silent) {
            setRefreshing(true);
          } else {
            setLoadingDashboard(
              true
            );
          }


          setDashboardError('');


          const data =
            await getCustomerDashboard();


          applyDashboardData(
            data
          );

        } catch (error) {

          console.error(
            'Customer dashboard load failed:',
            error
          );


          const errorMessage =
            error.response
              ?.data
              ?.message ||
            'Unable to load your customer account.';


          setDashboardError(
            errorMessage
          );


          if (silent) {

            showMessage(
              errorMessage,
              'error'
            );

          }

        } finally {

          setLoadingDashboard(
            false
          );

          setRefreshing(
            false
          );

        }

      },
      [
        applyDashboardData,
        showMessage,
      ]
    );


  useEffect(
    () => {

      loadDashboard();

    },
    [
      loadDashboard,
    ]
  );


  // ==========================================================
  // DERIVED VALUES
  // ==========================================================

  const name =
    profile.name ||
    user?.name ||
    'Valued Customer';


  const firstName =
    name
      .trim()
      .split(/\s+/)[0] ||
    'Customer';


  const unreadNotifications =
    useMemo(
      () =>
        notifications.filter(
          (notification) =>
            !notification.read
        ).length,
      [
        notifications,
      ]
    );


  const ongoingOrders =
    useMemo(
      () =>
        orders.filter(
          (order) =>
            order.status ===
              'Processing' ||
            order.status ===
              'In Transit'
        ).length,
      [
        orders,
      ]
    );


  const unpaidInvoices =
    useMemo(
      () =>
        invoices.filter(
          (invoice) =>
            invoice.status !==
            'Paid' &&
            invoice.status !==
            'Cancelled'
        ).length,
      [
        invoices,
      ]
    );


  const paidInvoices =
    useMemo(
      () =>
        invoices.filter(
          (invoice) =>
            invoice.status ===
            'Paid'
        ).length,
      [
        invoices,
      ]
    );


  const activeShipment =
    useMemo(
      () => {

        return (
          orders.find(
            (order) =>
              order.status ===
              'In Transit'
          ) ||
          orders.find(
            (order) =>
              order.status ===
              'Processing'
          ) ||
          null
        );

      },
      [
        orders,
      ]
    );


  // ==========================================================
  // SECTION NAVIGATION
  // ==========================================================

  function changeSection(
    section
  ) {

    setActive(section);

    setSelectedOrder(null);

    setSelectedInvoice(null);


    requestAnimationFrame(
      () => {

        if (
          pageTopRef.current
        ) {

          pageTopRef.current
            .scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });

        } else {

          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });

        }

      }
    );

  }


  // ==========================================================
  // LOGOUT
  // ==========================================================

  async function handleLogout() {

    if (loggingOut) {
      return;
    }


    const confirmed =
      window.confirm(
        'Are you sure you want to log out of your customer account?'
      );


    if (!confirmed) {
      return;
    }


    try {

      setLoggingOut(true);

      await logout();

    } catch (error) {

      console.error(
        'Logout failed:',
        error
      );

    } finally {

      navigate(
        '/login',
        {
          replace: true,
        }
      );

    }

  }


  // ==========================================================
  // PROFILE
  // ==========================================================

  function handleProfileChange(
    event
  ) {

    const {
      name: fieldName,
      value,
    } =
      event.target;


    setProfile(
      (previous) => ({
        ...previous,

        [fieldName]:
          value,
      })
    );

  }


  async function saveProfile(
    event
  ) {

    event.preventDefault();


    const cleanName =
      profile.name.trim();


    if (
      cleanName.length < 2
    ) {

      showMessage(
        'Please enter your full name.',
        'error'
      );

      return;
    }


    try {

      setSavingProfile(
        true
      );


      const result =
        await updateCustomerProfile({
          name:
            cleanName,

          company:
            profile.company
              .trim(),

          phone:
            profile.phone
              .trim(),
        });


      const updated =
        result.profile || {};


      setProfile(
        (previous) => ({
          ...previous,

          name:
            updated.name ||
            cleanName,

          company:
            updated.company ||
            '',

          phone:
            updated.phone ||
            '',
        })
      );


      if (refreshUser) {

        try {

          await refreshUser();

        } catch (error) {

          console.warn(
            'Auth user refresh failed:',
            error
          );

        }

      }


      setEditingProfile(
        false
      );


      showMessage(
        'Profile updated successfully.'
      );

    } catch (error) {

      console.error(
        'Profile update failed:',
        error
      );


      showMessage(
        error.response
          ?.data
          ?.message ||
        'Unable to update your profile.',
        'error'
      );

    } finally {

      setSavingProfile(
        false
      );

    }

  }


  // ==========================================================
  // ADDRESS FORM
  // ==========================================================

  function handleAddressChange(
    event
  ) {

    const {
      name: fieldName,
      value,
    } =
      event.target;


    setNewAddress(
      (previous) => ({
        ...previous,

        [fieldName]:
          value,
      })
    );

  }


  async function addAddress(
    event
  ) {

    event.preventDefault();


    const payload = {
      title:
        newAddress.title.trim(),

      name:
        newAddress.name.trim(),

      company:
        newAddress.company.trim(),

      address:
        newAddress.address.trim(),

      city:
        newAddress.city.trim(),

      phone:
        newAddress.phone.trim(),
    };


    if (
      !payload.title ||
      !payload.name ||
      !payload.address ||
      !payload.city
    ) {

      showMessage(
        'Please complete all required address fields.',
        'error'
      );

      return;
    }


    try {

      setSavingAddress(
        true
      );


      await addCustomerAddress(
        payload
      );


      setNewAddress(
        emptyAddress
      );


      setShowAddressForm(
        false
      );


      await loadDashboard({
        silent: true,
      });


      showMessage(
        'Delivery address saved successfully.'
      );

    } catch (error) {

      console.error(
        'Address creation failed:',
        error
      );


      showMessage(
        error.response
          ?.data
          ?.message ||
        'Unable to save the address.',
        'error'
      );

    } finally {

      setSavingAddress(
        false
      );

    }

  }


  // ==========================================================
  // DELETE ADDRESS
  // ==========================================================

  async function deleteAddress(
    id
  ) {

    if (
      deletingAddressId
    ) {
      return;
    }


    const address =
      addresses.find(
        (item) =>
          item.id === id
      );


    const confirmed =
      window.confirm(
        `Delete ${
          address?.title
            ? `"${address.title}"`
            : 'this address'
        }?`
      );


    if (!confirmed) {
      return;
    }


    try {

      setDeletingAddressId(
        id
      );


      await removeCustomerAddress(
        id
      );


      await loadDashboard({
        silent: true,
      });


      showMessage(
        'Address deleted successfully.'
      );

    } catch (error) {

      console.error(
        'Address delete failed:',
        error
      );


      showMessage(
        error.response
          ?.data
          ?.message ||
        'Unable to delete the address.',
        'error'
      );

    } finally {

      setDeletingAddressId(
        null
      );

    }

  }


  // ==========================================================
  // DEFAULT ADDRESS
  // ==========================================================

  async function setDefaultAddress(
    id
  ) {

    if (
      defaultAddressId
    ) {
      return;
    }


    try {

      setDefaultAddressId(
        id
      );


      await makeDefaultAddress(
        id
      );


      setAddresses(
        (previous) =>
          previous.map(
            (address) => ({
              ...address,

              default:
                address.id === id,
            })
          )
      );


      showMessage(
        'Default delivery address updated.'
      );

    } catch (error) {

      console.error(
        'Default address update failed:',
        error
      );


      showMessage(
        error.response
          ?.data
          ?.message ||
        'Unable to update the default address.',
        'error'
      );

    } finally {

      setDefaultAddressId(
        null
      );

    }

  }


  // ==========================================================
  // WISHLIST
  // ==========================================================

  async function removeWishlist(
    id
  ) {

    if (
      removingWishlistId
    ) {
      return;
    }


    try {

      setRemovingWishlistId(
        id
      );


      await deleteWishlistItem(
        id
      );


      setWishlist(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !== id
          )
      );


      showMessage(
        'Item removed from your wishlist.'
      );

    } catch (error) {

      console.error(
        'Wishlist removal failed:',
        error
      );


      showMessage(
        error.response
          ?.data
          ?.message ||
        'Unable to remove the wishlist item.',
        'error'
      );

    } finally {

      setRemovingWishlistId(
        null
      );

    }

  }


  // ==========================================================
  // NOTIFICATIONS
  // ==========================================================

  async function markNotificationRead(
    id
  ) {

    try {

      await markCustomerNotificationRead(
        id
      );


      setNotifications(
        (previous) =>
          previous.map(
            (notification) =>
              notification.id === id
                ? {
                    ...notification,
                    read: true,
                  }
                : notification
          )
      );

    } catch (error) {

      console.error(
        'Notification update failed:',
        error
      );


      showMessage(
        'Unable to update the notification.',
        'error'
      );

    }

  }


  async function markAllNotificationsRead() {

    if (
      unreadNotifications === 0
    ) {
      return;
    }


    try {

      await markCustomerNotificationsRead();


      setNotifications(
        (previous) =>
          previous.map(
            (notification) => ({
              ...notification,
              read: true,
            })
          )
      );


      showMessage(
        'All notifications marked as read.'
      );

    } catch (error) {

      console.error(
        'Mark all notifications failed:',
        error
      );


      showMessage(
        'Unable to update notifications.',
        'error'
      );

    }

  }


  // ==========================================================
  // PASSWORD
  // ==========================================================

  function handlePasswordChange(
    event
  ) {

    const {
      name: fieldName,
      value,
    } =
      event.target;


    setPasswordForm(
      (previous) => ({
        ...previous,

        [fieldName]:
          value,
      })
    );

  }


  async function submitPasswordChange(
    event
  ) {

    event.preventDefault();


    if (
      !passwordForm.currentPassword
    ) {

      showMessage(
        'Enter your current password.',
        'error'
      );

      return;
    }


    if (
      passwordForm.newPassword.length <
      6
    ) {

      showMessage(
        'New password must contain at least 6 characters.',
        'error'
      );

      return;
    }


    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {

      showMessage(
        'New passwords do not match.',
        'error'
      );

      return;
    }


    if (
      passwordForm.currentPassword ===
      passwordForm.newPassword
    ) {

      showMessage(
        'Your new password must be different from the current password.',
        'error'
      );

      return;
    }


    try {

      setChangingPassword(
        true
      );


      await updateCustomerPassword({
        currentPassword:
          passwordForm.currentPassword,

        newPassword:
          passwordForm.newPassword,
      });


      setPasswordForm(
        emptyPasswordForm
      );


      showMessage(
        'Password changed successfully.'
      );

    } catch (error) {

      console.error(
        'Password change failed:',
        error
      );


      showMessage(
        error.response
          ?.data
          ?.message ||
        'Unable to change your password.',
        'error'
      );

    } finally {

      setChangingPassword(
        false
      );

    }

  }


  // ==========================================================
  // PREFERENCES
  // ==========================================================

  async function changePreference(
    event
  ) {

    const {
      name: fieldName,
      checked,
    } =
      event.target;


    if (
      preferenceSaving
    ) {
      return;
    }


    const previous =
      preferences;


    const next = {
      ...preferences,

      [fieldName]:
        checked,
    };


    setPreferences(
      next
    );


    try {

      setPreferenceSaving(
        true
      );


      await saveCustomerPreferences(
        next
      );


      showMessage(
        'Communication preferences saved.'
      );

    } catch (error) {

      console.error(
        'Preference update failed:',
        error
      );


      setPreferences(
        previous
      );


      showMessage(
        error.response
          ?.data
          ?.message ||
        'Unable to save your preferences.',
        'error'
      );

    } finally {

      setPreferenceSaving(
        false
      );

    }

  }


  // ==========================================================
  // CREDIT TOP-UP REQUEST
  // ==========================================================

  async function handleTopUp() {

    if (toppingUp) {
      return;
    }


    const input =
      window.prompt(
        'Enter the credit amount you want to request in UGX:'
      );


    if (input === null) {
      return;
    }


    const amount =
      Number(
        String(input)
          .replace(
            /,/g,
            ''
          )
          .trim()
      );


    if (
      !Number.isFinite(
        amount
      ) ||
      amount <= 0
    ) {

      showMessage(
        'Please enter a valid amount.',
        'error'
      );

      return;
    }


    try {

      setToppingUp(
        true
      );


      const result =
        await submitCreditTopup(
          amount
        );


      const reference =
        result.transaction
          ?.reference;


      showMessage(
        reference
          ? `Credit request ${reference} submitted to the administrator.`
          : 'Credit top-up request submitted to the administrator.'
      );

    } catch (error) {

      console.error(
        'Credit top-up request failed:',
        error
      );


      showMessage(
        error.response
          ?.data
          ?.message ||
        'Unable to submit the credit request.',
        'error'
      );

    } finally {

      setToppingUp(
        false
      );

    }

  }


  // ==========================================================
  // ORDER STATUS BADGE
  // ==========================================================

  function getOrderBadge(
    status
  ) {

    switch (status) {

      case 'Delivered':
        return 'badge-instock';

      case 'Pending':
        return 'badge-limited';

      case 'Cancelled':
        return 'badge-outofstock';

      case 'In Transit':
        return 'badge-gold';

      default:
        return 'badge-navy';

    }

  }


  // ==========================================================
  // INVOICE BADGE
  // ==========================================================

  function getInvoiceBadge(
    status
  ) {

    switch (status) {

      case 'Paid':
        return 'badge-instock';

      case 'Cancelled':
        return 'badge-outofstock';

      case 'Overdue':
        return 'badge-outofstock';

      default:
        return 'badge-limited';

    }

  }


  // ==========================================================
  // ORDER OPEN
  // ==========================================================

  function openOrder(
    order
  ) {

    if (
      order.status ===
      'In Transit'
    ) {

      navigate(
        '/order-tracking',
        {
          state: {
            orderId:
              order.databaseId ||
              order.id,

            orderNumber:
              order.id,
          },
        }
      );

      return;

    }


    setSelectedOrder(
      order
    );

  }


  // ==========================================================
  // RENDER ACTIVE CONTENT
  // ==========================================================

  function renderContent() {

    switch (active) {

      // ======================================================
      // OVERVIEW
      // ======================================================

      case 'overview':

        return (
          <>

            <div className="customer-page-heading">

              <div>

                <span className="eyebrow">
                  Account Overview
                </span>

                <h2>
                  Personal Information
                </h2>

                <p>
                  Manage your customer and procurement profile.
                </p>

              </div>


              <button
                type="button"
                className="btn btn-outline-navy"
                onClick={() =>
                  setEditingProfile(
                    (value) =>
                      !value
                  )
                }
              >

                <Icon
                  name="edit"
                  size={16}
                />

                {editingProfile
                  ? 'Cancel'
                  : 'Edit Profile'}

              </button>

            </div>


            {editingProfile ? (

              <form
                className="card customer-panel"
                onSubmit={saveProfile}
              >

                <div className="customer-form-grid">

                  <div className="field">

                    <label htmlFor="profile-name">
                      Full Name
                    </label>

                    <input
                      id="profile-name"
                      name="name"
                      value={
                        profile.name
                      }
                      onChange={
                        handleProfileChange
                      }
                      required
                    />

                  </div>


                  <div className="field">

                    <label htmlFor="profile-company">
                      Company
                    </label>

                    <input
                      id="profile-company"
                      name="company"
                      value={
                        profile.company
                      }
                      onChange={
                        handleProfileChange
                      }
                    />

                  </div>


                  <div className="field">

                    <label htmlFor="profile-email">
                      Email
                    </label>

                    <input
                      id="profile-email"
                      type="email"
                      value={
                        profile.email
                      }
                      readOnly
                    />

                    <small>
                      Email changes require account verification.
                    </small>

                  </div>


                  <div className="field">

                    <label htmlFor="profile-phone">
                      Phone Number
                    </label>

                    <input
                      id="profile-phone"
                      name="phone"
                      value={
                        profile.phone
                      }
                      onChange={
                        handleProfileChange
                      }
                      placeholder="+256 700 000000"
                    />

                  </div>

                </div>


                <div className="customer-form-actions">

                  <button
                    type="button"
                    className="btn btn-outline-navy"
                    disabled={
                      savingProfile
                    }
                    onClick={() => {

                      setEditingProfile(
                        false
                      );

                      loadDashboard({
                        silent: true,
                      });

                    }}
                  >
                    Cancel
                  </button>


                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={
                      savingProfile
                    }
                  >

                    <Icon
                      name="check"
                      size={16}
                    />

                    {savingProfile
                      ? 'Saving...'
                      : 'Save Changes'}

                  </button>

                </div>

              </form>

            ) : (

              <div className="customer-info-grid">

                <div className="card customer-info-card">

                  <span>
                    Full Name
                  </span>

                  <strong>
                    {name}
                  </strong>

                </div>


                <div className="card customer-info-card">

                  <span>
                    Company
                  </span>

                  <strong>
                    {profile.company ||
                      'Not provided'}
                  </strong>

                </div>


                <div className="card customer-info-card">

                  <span>
                    Email Address
                  </span>

                  <strong>
                    {profile.email ||
                      'Not provided'}
                  </strong>

                </div>


                <div className="card customer-info-card">

                  <span>
                    Phone Number
                  </span>

                  <strong>
                    {profile.phone ||
                      'Not provided'}
                  </strong>

                </div>


                <div className="card customer-info-card">

                  <span>
                    Account Type
                  </span>

                  <strong>
                    Enterprise Customer
                  </strong>

                </div>


                <div className="card customer-info-card">

                  <span>
                    Account Status
                  </span>

                  <strong>
                    Active
                  </strong>

                </div>

              </div>

            )}

          </>
        );


      // ======================================================
      // ORDERS
      // ======================================================

      case 'orders':

        return (
          <>

            <div className="customer-page-heading">

              <div>

                <span className="eyebrow">
                  Procurement
                </span>

                <h2>
                  My Orders
                </h2>

                <p>
                  Track and review your Apex Machinery orders.
                </p>

              </div>


              <Link
                to="/shop"
                className="btn btn-primary"
              >

                <Icon
                  name="plus"
                  size={16}
                />

                Shop Products

              </Link>

            </div>


            {selectedOrder && (

              <div className="card customer-panel customer-selection-card">

                <div>

                  <span className="eyebrow">
                    Order Details
                  </span>

                  <h3>
                    #{selectedOrder.id}
                  </h3>

                  <p>
                    {selectedOrder.items}
                    {' · '}
                    {formatDate(
                      selectedOrder.date
                    )}
                  </p>

                </div>


                <div>

                  <strong>
                    {formatMoney(
                      selectedOrder.total
                    )}
                  </strong>

                  <span
                    className={`badge ${getOrderBadge(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status}
                  </span>

                </div>


                {selectedOrder.orderItems
                  ?.length > 0 && (

                  <div className="customer-order-items">

                    {selectedOrder.orderItems.map(
                      (item) => (

                        <div key={item.id}>

                          <span>
                            {item.product_name}
                          </span>

                          <strong>
                            {item.quantity}
                            {' × '}
                            {formatMoney(
                              item.unit_price
                            )}
                          </strong>

                        </div>

                      )
                    )}

                  </div>

                )}


                <button
                  type="button"
                  className="btn btn-outline-navy btn-sm"
                  onClick={() =>
                    setSelectedOrder(
                      null
                    )
                  }
                >
                  Close
                </button>

              </div>

            )}


            {orders.length === 0 ? (

              <div className="card customer-empty">

                <Icon
                  name="package"
                  size={36}
                />

                <h3>
                  No orders yet
                </h3>

                <p>
                  Your machinery orders will appear here once you place an order.
                </p>

                <Link
                  to="/shop"
                  className="btn btn-primary"
                >
                  Browse Products
                </Link>

              </div>

            ) : (

              <div className="card customer-panel">

                <div className="customer-table-wrapper">

                  <table className="customer-table">

                    <thead>

                      <tr>
                        <th>Order ID</th>
                        <th>Items</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Action</th>
                      </tr>

                    </thead>


                    <tbody>

                      {orders.map(
                        (order) => (

                          <tr
                            key={
                              order.databaseId ||
                              order.id
                            }
                          >

                            <td>
                              <strong>
                                #{order.id}
                              </strong>
                            </td>

                            <td>
                              {order.items}
                            </td>

                            <td>
                              {formatDate(
                                order.date
                              )}
                            </td>

                            <td>

                              <span
                                className={`badge ${getOrderBadge(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>

                            </td>

                            <td>
                              <strong>
                                {formatMoney(
                                  order.total
                                )}
                              </strong>
                            </td>

                            <td>

                              <button
                                type="button"
                                className="customer-table-action"
                                onClick={() =>
                                  openOrder(
                                    order
                                  )
                                }
                              >

                                <Icon
                                  name="eye"
                                  size={15}
                                />

                                {order.status ===
                                'In Transit'
                                  ? 'Track'
                                  : 'View'}

                              </button>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            )}

          </>
        );


      // ======================================================
      // ADDRESSES
      // ======================================================

      case 'addresses':

        return (
          <>

            <div className="customer-page-heading">

              <div>

                <span className="eyebrow">
                  Delivery
                </span>

                <h2>
                  Saved Addresses
                </h2>

                <p>
                  Manage locations used for machinery deliveries.
                </p>

              </div>


              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  setShowAddressForm(
                    (value) =>
                      !value
                  )
                }
              >

                <Icon
                  name="plus"
                  size={16}
                />

                Add Address

              </button>

            </div>


            {showAddressForm && (

              <form
                className="card customer-panel customer-address-form"
                onSubmit={addAddress}
              >

                <h3>
                  Add New Address
                </h3>


                <div className="customer-form-grid">

                  <div className="field">

                    <label>
                      Address Title *
                    </label>

                    <input
                      name="title"
                      value={
                        newAddress.title
                      }
                      onChange={
                        handleAddressChange
                      }
                      placeholder="Main Office"
                      required
                    />

                  </div>


                  <div className="field">

                    <label>
                      Contact Name *
                    </label>

                    <input
                      name="name"
                      value={
                        newAddress.name
                      }
                      onChange={
                        handleAddressChange
                      }
                      required
                    />

                  </div>


                  <div className="field">

                    <label>
                      Company
                    </label>

                    <input
                      name="company"
                      value={
                        newAddress.company
                      }
                      onChange={
                        handleAddressChange
                      }
                    />

                  </div>


                  <div className="field">

                    <label>
                      Phone
                    </label>

                    <input
                      name="phone"
                      value={
                        newAddress.phone
                      }
                      onChange={
                        handleAddressChange
                      }
                      placeholder="+256..."
                    />

                  </div>


                  <div className="field">

                    <label>
                      Address *
                    </label>

                    <input
                      name="address"
                      value={
                        newAddress.address
                      }
                      onChange={
                        handleAddressChange
                      }
                      required
                    />

                  </div>


                  <div className="field">

                    <label>
                      City *
                    </label>

                    <input
                      name="city"
                      value={
                        newAddress.city
                      }
                      onChange={
                        handleAddressChange
                      }
                      required
                    />

                  </div>

                </div>


                <div className="customer-form-actions">

                  <button
                    type="button"
                    className="btn btn-outline-navy"
                    disabled={
                      savingAddress
                    }
                    onClick={() => {

                      setNewAddress(
                        emptyAddress
                      );

                      setShowAddressForm(
                        false
                      );

                    }}
                  >
                    Cancel
                  </button>


                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={
                      savingAddress
                    }
                  >
                    {savingAddress
                      ? 'Saving...'
                      : 'Save Address'}
                  </button>

                </div>

              </form>

            )}


            {addresses.length === 0 ? (

              <div className="card customer-empty">

                <Icon
                  name="location"
                  size={36}
                />

                <h3>
                  No saved addresses
                </h3>

                <p>
                  Add your first delivery address for future machinery orders.
                </p>

              </div>

            ) : (

              <div className="customer-address-grid">

                {addresses.map(
                  (address) => (

                    <div
                      key={address.id}
                      className="card customer-address-card"
                    >

                      <div className="customer-address-header">

                        <div>

                          <h3>
                            {address.title}
                          </h3>

                          {address.default && (

                            <span className="badge badge-instock">
                              Default
                            </span>

                          )}

                        </div>


                        <Icon
                          name="location"
                          size={20}
                        />

                      </div>


                      <strong>
                        {address.name}
                      </strong>


                      {address.company && (
                        <span>
                          {address.company}
                        </span>
                      )}


                      <span>
                        {address.address}
                      </span>


                      <span>
                        {address.city}
                      </span>


                      {address.phone && (
                        <span>
                          {address.phone}
                        </span>
                      )}


                      <div className="customer-address-actions">

                        {!address.default && (

                          <button
                            type="button"
                            disabled={
                              defaultAddressId ===
                              address.id
                            }
                            onClick={() =>
                              setDefaultAddress(
                                address.id
                              )
                            }
                          >
                            {defaultAddressId ===
                            address.id
                              ? 'Updating...'
                              : 'Set Default'}
                          </button>

                        )}


                        <button
                          type="button"
                          className="danger"
                          disabled={
                            deletingAddressId ===
                            address.id
                          }
                          onClick={() =>
                            deleteAddress(
                              address.id
                            )
                          }
                        >
                          {deletingAddressId ===
                          address.id
                            ? 'Deleting...'
                            : 'Delete'}
                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </>
        );


      // ======================================================
      // BILLING
      // ======================================================

      case 'billing':

        return (
          <>

            <div className="customer-page-heading">

              <div>

                <span className="eyebrow">
                  Financial Management
                </span>

                <h2>
                  Billing & Invoices
                </h2>

                <p>
                  Review your invoices, balances and payment status.
                </p>

              </div>


              <button
                type="button"
                className="btn btn-gold"
                disabled={
                  toppingUp
                }
                onClick={
                  handleTopUp
                }
              >
                {toppingUp
                  ? 'Submitting...'
                  : 'Request Credit'}
              </button>

            </div>


            <div className="customer-billing-summary">

              <div className="card">

                <span>
                  Enterprise Balance
                </span>

                <strong>
                  {formatMoney(
                    enterpriseBalance
                  )}
                </strong>

              </div>


              <div className="card">

                <span>
                  Outstanding Invoices
                </span>

                <strong>
                  {unpaidInvoices}
                </strong>

              </div>


              <div className="card">

                <span>
                  Paid Invoices
                </span>

                <strong>
                  {paidInvoices}
                </strong>

              </div>

            </div>


            {selectedInvoice && (

              <div className="card customer-panel customer-selection-card">

                <div>

                  <span className="eyebrow">
                    Invoice Details
                  </span>

                  <h3>
                    {selectedInvoice.id}
                  </h3>

                </div>


                <div>

                  <strong>
                    {formatMoney(
                      selectedInvoice.amount
                    )}
                  </strong>

                  <span
                    className={`badge ${getInvoiceBadge(
                      selectedInvoice.status
                    )}`}
                  >
                    {selectedInvoice.status}
                  </span>

                </div>


                <p>
                  Issued:{' '}
                  {formatDate(
                    selectedInvoice.date
                  )}
                  {' · '}
                  Due:{' '}
                  {formatDate(
                    selectedInvoice.due
                  )}
                </p>


                <button
                  type="button"
                  className="btn btn-outline-navy btn-sm"
                  onClick={() =>
                    setSelectedInvoice(
                      null
                    )
                  }
                >
                  Close
                </button>

              </div>

            )}


            {invoices.length === 0 ? (

              <div className="card customer-empty">

                <Icon
                  name="package"
                  size={36}
                />

                <h3>
                  No invoices
                </h3>

                <p>
                  Your Apex Machinery invoices will appear here.
                </p>

              </div>

            ) : (

              <div className="card customer-panel">

                <div className="customer-table-wrapper">

                  <table className="customer-table">

                    <thead>

                      <tr>
                        <th>Invoice</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Due</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>

                    </thead>


                    <tbody>

                      {invoices.map(
                        (invoice) => (

                          <tr
                            key={
                              invoice.databaseId ||
                              invoice.id
                            }
                          >

                            <td>
                              <strong>
                                {invoice.id}
                              </strong>
                            </td>

                            <td>
                              {formatMoney(
                                invoice.amount
                              )}
                            </td>

                            <td>
                              {formatDate(
                                invoice.date
                              )}
                            </td>

                            <td>
                              {formatDate(
                                invoice.due
                              )}
                            </td>

                            <td>

                              <span
                                className={`badge ${getInvoiceBadge(
                                  invoice.status
                                )}`}
                              >
                                {invoice.status}
                              </span>

                            </td>

                            <td>

                              <button
                                type="button"
                                className="customer-table-action"
                                onClick={() =>
                                  setSelectedInvoice(
                                    invoice
                                  )
                                }
                              >

                                <Icon
                                  name="eye"
                                  size={15}
                                />

                                View

                              </button>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            )}

          </>
        );


      // ======================================================
      // WISHLIST
      // ======================================================

      case 'wishlist':

        return (
          <>

            <div className="customer-page-heading">

              <div>

                <span className="eyebrow">
                  Saved Products
                </span>

                <h2>
                  My Wishlist
                </h2>

                <p>
                  Machinery and equipment saved for future procurement.
                </p>

              </div>


              <Link
                to="/shop"
                className="btn btn-primary"
              >
                Browse Products
              </Link>

            </div>


            {wishlist.length === 0 ? (

              <div className="card customer-empty">

                <Icon
                  name="heart"
                  size={35}
                />

                <h3>
                  Your wishlist is empty
                </h3>

                <p>
                  Products you save will appear here.
                </p>

                <Link
                  to="/shop"
                  className="btn btn-primary"
                >
                  Browse Shop
                </Link>

              </div>

            ) : (

              <div className="customer-wishlist-grid">

                {wishlist.map(
                  (item) => (

                    <div
                      key={item.id}
                      className="card customer-wishlist-card"
                    >

                      <div className="customer-wishlist-icon">

                        <Icon
                          name="heart"
                          size={22}
                        />

                      </div>


                      <span>
                        {item.category ||
                          'Machinery'}
                      </span>


                      <h3>
                        {item.name}
                      </h3>


                      <strong>
                        {formatMoney(
                          item.price
                        )}
                      </strong>


                      <span
                        className={`badge ${
                          item.stock ===
                          'In Stock'
                            ? 'badge-instock'
                            : item.stock ===
                              'Out of Stock'
                            ? 'badge-outofstock'
                            : 'badge-limited'
                        }`}
                      >
                        {item.stock ||
                          'Stock Unknown'}
                      </span>


                      <div className="customer-wishlist-actions">

                        <Link
                          to="/shop"
                          className="btn btn-primary btn-sm"
                        >
                          View Product
                        </Link>


                        <button
                          type="button"
                          className="customer-icon-action danger"
                          disabled={
                            removingWishlistId ===
                            item.id
                          }
                          aria-label={`Remove ${item.name} from wishlist`}
                          title="Remove from wishlist"
                          onClick={() =>
                            removeWishlist(
                              item.id
                            )
                          }
                        >

                          <Icon
                            name="trash"
                            size={16}
                          />

                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </>
        );


      // ======================================================
      // NOTIFICATIONS
      // ======================================================

      case 'notifications':

        return (
          <>

            <div className="customer-page-heading">

              <div>

                <span className="eyebrow">
                  Account Activity
                </span>

                <h2>
                  Notifications
                </h2>

                <p>
                  Order, inventory, billing and security updates.
                </p>

              </div>


              <button
                type="button"
                className="btn btn-outline-navy"
                disabled={
                  unreadNotifications ===
                  0
                }
                onClick={
                  markAllNotificationsRead
                }
              >

                <Icon
                  name="check"
                  size={16}
                />

                Mark All Read

              </button>

            </div>


            {notifications.length === 0 ? (

              <div className="card customer-empty">

                <Icon
                  name="clock"
                  size={35}
                />

                <h3>
                  No notifications
                </h3>

                <p>
                  New account and procurement updates will appear here.
                </p>

              </div>

            ) : (

              <div className="card customer-notification-list">

                {notifications.map(
                  (notification) => (

                    <div
                      key={
                        notification.id
                      }
                      className={`customer-notification ${
                        notification.read
                          ? 'read'
                          : 'unread'
                      }`}
                    >

                      <div className="customer-notification-icon">

                        <Icon
                          name={
                            notification.type ===
                            'security'
                              ? 'settings'
                              : notification.type ===
                                'billing'
                              ? 'package'
                              : notification.type ===
                                'order'
                              ? 'truck'
                              : 'clock'
                          }
                          size={18}
                        />

                      </div>


                      <div className="customer-notification-content">

                        <div>

                          <strong>
                            {
                              notification.title
                            }
                          </strong>

                          <span>
                            {formatRelativeTime(
                              notification.createdAt
                            )}
                          </span>

                        </div>


                        <p>
                          {notification.text}
                        </p>


                        {!notification.read && (

                          <button
                            type="button"
                            onClick={() =>
                              markNotificationRead(
                                notification.id
                              )
                            }
                          >
                            Mark as read
                          </button>

                        )}

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </>
        );


      // ======================================================
      // SETTINGS
      // ======================================================

      case 'settings':

        return (
          <>

            <div className="customer-page-heading">

              <div>

                <span className="eyebrow">
                  Account
                </span>

                <h2>
                  Account Settings
                </h2>

                <p>
                  Manage your security and communication preferences.
                </p>

              </div>

            </div>


            <div className="customer-settings-grid">

              <form
                className="card customer-panel"
                onSubmit={
                  submitPasswordChange
                }
              >

                <h3>
                  Password & Security
                </h3>


                <div className="field">

                  <label>
                    Current Password
                  </label>

                  <input
                    type="password"
                    name="currentPassword"
                    value={
                      passwordForm.currentPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    autoComplete="current-password"
                    placeholder="Current password"
                    required
                  />

                </div>


                <div className="field">

                  <label>
                    New Password
                  </label>

                  <input
                    type="password"
                    name="newPassword"
                    value={
                      passwordForm.newPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    autoComplete="new-password"
                    placeholder="New password"
                    minLength={6}
                    required
                  />

                </div>


                <div className="field">

                  <label>
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    value={
                      passwordForm.confirmPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    autoComplete="new-password"
                    placeholder="Confirm password"
                    minLength={6}
                    required
                  />

                </div>


                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    changingPassword
                  }
                >
                  {changingPassword
                    ? 'Updating Password...'
                    : 'Update Password'}
                </button>

              </form>


              <div className="card customer-panel">

                <h3>
                  Communication Preferences
                </h3>


                <label className="customer-toggle">

                  <input
                    type="checkbox"
                    name="orderUpdates"
                    checked={
                      preferences.orderUpdates
                    }
                    disabled={
                      preferenceSaving
                    }
                    onChange={
                      changePreference
                    }
                  />

                  <span>
                    Order updates
                  </span>

                </label>


                <label className="customer-toggle">

                  <input
                    type="checkbox"
                    name="inventoryAlerts"
                    checked={
                      preferences.inventoryAlerts
                    }
                    disabled={
                      preferenceSaving
                    }
                    onChange={
                      changePreference
                    }
                  />

                  <span>
                    Inventory alerts
                  </span>

                </label>


                <label className="customer-toggle">

                  <input
                    type="checkbox"
                    name="invoiceReminders"
                    checked={
                      preferences.invoiceReminders
                    }
                    disabled={
                      preferenceSaving
                    }
                    onChange={
                      changePreference
                    }
                  />

                  <span>
                    Invoice reminders
                  </span>

                </label>


                <label className="customer-toggle">

                  <input
                    type="checkbox"
                    name="marketing"
                    checked={
                      preferences.marketing
                    }
                    disabled={
                      preferenceSaving
                    }
                    onChange={
                      changePreference
                    }
                  />

                  <span>
                    Marketing communications
                  </span>

                </label>

              </div>

            </div>


            <div className="card customer-danger-zone">

              <div>

                <h3>
                  Sign Out
                </h3>

                <p>
                  Sign out of your Apex Machinery customer account.
                </p>

              </div>


              <button
                type="button"
                className="btn btn-outline-danger"
                disabled={
                  loggingOut
                }
                onClick={
                  handleLogout
                }
              >

                <Icon
                  name="arrowRight"
                  size={16}
                />

                {loggingOut
                  ? 'Logging Out...'
                  : 'Logout'}

              </button>

            </div>

          </>
        );


      default:
        return null;

    }

  }


  // ==========================================================
  // INITIAL LOADING
  // ==========================================================

  if (
    loadingDashboard
  ) {

    return (

      <div className="customer-dashboard-page">

        <div className="container">

          <div className="customer-dashboard-loading">

            <div className="customer-loading-spinner" />

            <h2>
              Loading your account
            </h2>

            <p>
              Retrieving your latest Apex Machinery information...
            </p>

          </div>

        </div>

      </div>

    );

  }


  // ==========================================================
  // INITIAL ERROR
  // ==========================================================

  if (
    dashboardError &&
    !profile.name &&
    orders.length === 0 &&
    addresses.length === 0
  ) {

    return (

      <div className="customer-dashboard-page">

        <div className="container">

          <div className="card customer-dashboard-error">

            <Icon
              name="settings"
              size={34}
            />

            <h2>
              Unable to load customer dashboard
            </h2>

            <p>
              {dashboardError}
            </p>


            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                loadDashboard()
              }
            >
              Try Again
            </button>

          </div>

        </div>

      </div>

    );

  }


  // ==========================================================
  // MAIN RENDER
  // ==========================================================

  return (

    <div
      className="customer-dashboard-page"
      ref={pageTopRef}
    >


      {/* ====================================================
          TOAST
      ==================================================== */}

      {message && (

        <div
          className={`customer-toast ${
            messageType ===
            'error'
              ? 'customer-toast-error'
              : ''
          }`}
          role="status"
          aria-live="polite"
        >

          <Icon
            name={
              messageType ===
              'error'
                ? 'settings'
                : 'check'
            }
            size={17}
          />

          <span>
            {message}
          </span>

        </div>

      )}


      {/* ====================================================
          REFRESH INDICATOR
      ==================================================== */}

      {refreshing && (

        <div className="customer-refresh-indicator">
          Updating account information...
        </div>

      )}


      <div className="container">


        {/* ==================================================
            DASHBOARD HEADER
        ================================================== */}

        <div className="customer-dashboard-header">

          <div>

            <span className="eyebrow">
              Customer Portal
            </span>


            <h1>
              Welcome back, {firstName}
            </h1>


            <p>
              Manage your procurement account,
              orders and business information.
            </p>

          </div>


          <div className="customer-dashboard-header-actions">

            <button
              type="button"
              className="customer-refresh-button"
              disabled={
                refreshing
              }
              onClick={() =>
                loadDashboard({
                  silent: true,
                })
              }
            >

              <Icon
                name="clock"
                size={16}
              />

              {refreshing
                ? 'Refreshing...'
                : 'Refresh'}

            </button>


            <div className="customer-member">

              <Icon
                name="user"
                size={18}
              />

              <span>
                Member since{' '}
                {formatMemberSince(
                  user?.memberSince ||
                  user?.member_since ||
                  user?.created_at
                )}
              </span>

            </div>

          </div>

        </div>


        {/* ==================================================
            DASHBOARD LAYOUT
        ================================================== */}

        <div className="dashboard-layout">


          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="dashboard-sidebar card">


            <div className="dashboard-profile">

              <div className="dashboard-avatar">

                <Icon
                  name="user"
                  size={28}
                />

              </div>


              <strong>
                {name}
              </strong>


              <span>
                {profile.company ||
                  'Apex Machinery Customer'}
              </span>

            </div>


            <nav className="customer-sidebar-nav">

              {sidebarItems.map(
                (item) => {

                  let badge = 0;


                  if (
                    item.key ===
                    'notifications'
                  ) {
                    badge =
                      unreadNotifications;
                  }


                  if (
                    item.key ===
                    'wishlist'
                  ) {
                    badge =
                      wishlist.length;
                  }


                  if (
                    item.key ===
                    'orders'
                  ) {
                    badge =
                      orders.length;
                  }


                  return (

                    <button
                      key={item.key}
                      type="button"
                      className={
                        active ===
                        item.key
                          ? 'active'
                          : ''
                      }
                      onClick={() =>
                        changeSection(
                          item.key
                        )
                      }
                    >

                      <Icon
                        name={
                          item.icon
                        }
                        size={17}
                      />


                      <span>
                        {item.label}
                      </span>


                      {badge > 0 && (

                        <span className="dashboard-badge">
                          {badge}
                        </span>

                      )}

                    </button>

                  );

                }
              )}


              <button
                type="button"
                className="dashboard-logout"
                disabled={
                  loggingOut
                }
                onClick={
                  handleLogout
                }
              >

                <Icon
                  name="arrowRight"
                  size={17}
                />

                <span>
                  {loggingOut
                    ? 'Logging Out...'
                    : 'Logout'}
                </span>

              </button>

            </nav>


            <div className="dashboard-balance">

              <span>
                Enterprise Balance
              </span>


              <strong>
                {formatMoney(
                  enterpriseBalance
                )}
              </strong>


              <button
                type="button"
                className="btn btn-gold btn-sm btn-block"
                disabled={
                  toppingUp
                }
                onClick={
                  handleTopUp
                }
              >
                {toppingUp
                  ? 'Submitting...'
                  : 'Request Credit'}
              </button>

            </div>

          </aside>


          {/* =================================================
              MAIN
          ================================================= */}

          <main className="dashboard-main">


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="customer-stats-grid">

              <button
                type="button"
                className="card dashboard-stat"
                onClick={() =>
                  changeSection(
                    'orders'
                  )
                }
              >

                <Icon
                  name="truck"
                  size={20}
                />

                <strong>
                  {ongoingOrders}
                </strong>

                <span>
                  Ongoing Orders
                </span>

              </button>


              <button
                type="button"
                className="card dashboard-stat"
                onClick={() =>
                  changeSection(
                    'billing'
                  )
                }
              >

                <Icon
                  name="package"
                  size={20}
                />

                <strong>
                  {unpaidInvoices}
                </strong>

                <span>
                  Invoices Due
                </span>

              </button>


              <button
                type="button"
                className="card dashboard-stat"
                onClick={() =>
                  changeSection(
                    'wishlist'
                  )
                }
              >

                <Icon
                  name="heart"
                  size={20}
                />

                <strong>
                  {wishlist.length}
                </strong>

                <span>
                  Wishlist Items
                </span>

              </button>

            </div>


            {/* =================================================
                ACTIVE SHIPMENT
            ================================================= */}

            {activeShipment ? (

              <div className="card dashboard-shipment">

                <div className="dashboard-shipment-header">

                  <div>

                    <strong>
                      Active Shipment
                    </strong>

                    <span>
                      Order #
                      {activeShipment.id}
                      {' · '}
                      {activeShipment.status}
                    </span>

                  </div>


                  <span className="badge badge-gold">

                    {activeShipment
                      .estimatedDeliveryDate
                      ? `Estimated ${formatDate(
                          activeShipment
                            .estimatedDeliveryDate
                        )}`
                      : 'Shipment Active'}

                  </span>

                </div>


                <ProgressBar
                  steps={[
                    'Ordered',
                    'Processing',
                    'In Transit',
                    'Delivered',
                  ]}
                  activeIndex={
                    getTrackingIndex(
                      activeShipment.status
                    )
                  }
                />


                <button
                  type="button"
                  className="dashboard-track-link"
                  onClick={() =>
                    navigate(
                      '/order-tracking',
                      {
                        state: {
                          orderId:
                            activeShipment.databaseId ||
                            activeShipment.id,

                          orderNumber:
                            activeShipment.id,
                        },
                      }
                    )
                  }
                >

                  Track Details

                  <Icon
                    name="arrowRight"
                    size={14}
                  />

                </button>

              </div>

            ) : (

              <div className="card dashboard-shipment">

                <div className="dashboard-shipment-header">

                  <div>

                    <strong>
                      Active Shipment
                    </strong>

                    <span>
                      You currently have no active shipment.
                    </span>

                  </div>


                  <span className="badge badge-instock">
                    Up to Date
                  </span>

                </div>

              </div>

            )}


            {/* =================================================
                ACTIVE SECTION
            ================================================= */}

            <section className="customer-active-section">

              {renderContent()}

            </section>

          </main>

        </div>

      </div>

    </div>

  );

}