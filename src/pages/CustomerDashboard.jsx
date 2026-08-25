import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { ProgressBar } from '../components/Timeline';
import { useAuth } from '../context/AuthContext';
import './CustomerDashboard.css';


// ============================================================
// INITIAL DATA
// ============================================================

const initialOrders = [
  {
    id: 'APX-8829',
    items: '3 Items',
    status: 'Delivered',
    total: 'UGX 16,850,000',
    date: '2026-05-12',
  },
  {
    id: 'APX-9930',
    items: '1 Item',
    status: 'In Transit',
    total: 'UGX 82,500,000',
    date: '2026-05-08',
  },
  {
    id: 'APX-9918',
    items: '5 Items',
    status: 'Processing',
    total: 'UGX 24,600,000',
    date: '2026-05-04',
  },
  {
    id: 'APX-9902',
    items: '2 Items',
    status: 'Pending',
    total: 'UGX 9,800,000',
    date: '2026-04-29',
  },
];


const initialNotifications = [
  {
    id: 1,
    title: 'New Login Detected',
    time: '2h ago',
    text: 'A new login from Chrome on Windows was detected.',
    read: false,
    type: 'security',
  },
  {
    id: 2,
    title: 'Stock Update',
    time: 'Yesterday',
    text: 'An item in your wishlist is back in stock.',
    read: false,
    type: 'inventory',
  },
  {
    id: 3,
    title: 'Invoice Due Soon',
    time: '3 days ago',
    text: 'Invoice #INV-4021 is due in 3 days.',
    read: true,
    type: 'billing',
  },
];


const initialAddresses = [
  {
    id: 1,
    title: 'Main Office',
    name: 'Apex Customer',
    company: 'Industrial Procurement Ltd',
    address: 'Kampala Industrial Area',
    city: 'Kampala',
    phone: '+256 700 000000',
    default: true,
  },
  {
    id: 2,
    title: 'Warehouse',
    name: 'Procurement Department',
    company: 'Industrial Procurement Ltd',
    address: 'Namanve Industrial Park',
    city: 'Mukono',
    phone: '+256 700 000001',
    default: false,
  },
];


const initialWishlist = [
  {
    id: 1,
    name: 'Industrial Diesel Generator 250 kVA',
    category: 'Generators',
    price: 'UGX 185,000,000',
    stock: 'In Stock',
  },
  {
    id: 2,
    name: 'Heavy Duty Air Compressor',
    category: 'Industrial Equipment',
    price: 'UGX 24,500,000',
    stock: 'Low Stock',
  },
  {
    id: 3,
    name: 'Rotary Hammer SDS-Plus Pro',
    category: 'Power Tools',
    price: 'UGX 2,850,000',
    stock: 'In Stock',
  },
];


const initialInvoices = [
  {
    id: 'INV-4021',
    order: 'APX-9930',
    amount: 'UGX 82,500,000',
    date: '2026-05-08',
    due: '2026-05-20',
    status: 'Due Soon',
  },
  {
    id: 'INV-4018',
    order: 'APX-9918',
    amount: 'UGX 24,600,000',
    date: '2026-05-04',
    due: '2026-05-18',
    status: 'Pending',
  },
  {
    id: 'INV-3989',
    order: 'APX-8829',
    amount: 'UGX 16,850,000',
    date: '2026-05-12',
    due: '2026-05-12',
    status: 'Paid',
  },
];


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
// CUSTOMER DASHBOARD
// ============================================================

export default function CustomerDashboard() {

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [active, setActive] =
    useState('overview');

  const [orders] =
    useState(initialOrders);

  const [notifications, setNotifications] =
    useState(initialNotifications);

  const [addresses, setAddresses] =
    useState(initialAddresses);

  const [wishlist, setWishlist] =
    useState(initialWishlist);

  const [invoices] =
    useState(initialInvoices);

  const [showAddressForm, setShowAddressForm] =
    useState(false);

  const [editingProfile, setEditingProfile] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const [profile, setProfile] = useState({
    name: user?.name || 'Valued Customer',
    company: user?.company || '',
    email: user?.email || '',
    phone: '',
  });

  const [newAddress, setNewAddress] = useState({
    title: '',
    name: '',
    company: '',
    address: '',
    city: '',
    phone: '',
  });


  // ==========================================================
  // USER NAME
  // ==========================================================

  const name =
    profile.name ||
    user?.name ||
    'Valued Customer';


  const firstName =
    name
      .split(' ')[0];


  // ==========================================================
  // NOTIFICATION COUNT
  // ==========================================================

  const unreadNotifications =
    useMemo(
      () =>
        notifications.filter(
          (item) => !item.read
        ).length,
      [notifications]
    );


  // ==========================================================
  // SHOW MESSAGE
  // ==========================================================

  const showMessage = (text) => {

    setMessage(text);

    setTimeout(() => {
      setMessage('');
    }, 3000);

  };


  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const changeSection = (section) => {

    setActive(section);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

  };


  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = () => {

    const confirmed =
      window.confirm(
        'Are you sure you want to log out of your customer account?'
      );

    if (!confirmed) {
      return;
    }

    logout();

    navigate('/login');

  };


  // ==========================================================
  // PROFILE CHANGE
  // ==========================================================

  const handleProfileChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // ==========================================================
  // SAVE PROFILE
  // ==========================================================

  const saveProfile = (e) => {

    e.preventDefault();

    setEditingProfile(false);

    showMessage(
      'Your profile information has been updated successfully.'
    );

  };


  // ==========================================================
  // MARK NOTIFICATION READ
  // ==========================================================

  const markNotificationRead = (id) => {

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

  };


  // ==========================================================
  // MARK ALL READ
  // ==========================================================

  const markAllNotificationsRead = () => {

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

  };


  // ==========================================================
  // REMOVE WISHLIST
  // ==========================================================

  const removeWishlist = (id) => {

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

  };


  // ==========================================================
  // ADD ADDRESS
  // ==========================================================

  const handleAddressChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setNewAddress(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

  };


  const addAddress = (e) => {

    e.preventDefault();

    if (
      !newAddress.title ||
      !newAddress.name ||
      !newAddress.address ||
      !newAddress.city
    ) {

      showMessage(
        'Please complete all required address fields.'
      );

      return;
    }

    const address = {
      id: Date.now(),
      ...newAddress,
      default: addresses.length === 0,
    };

    setAddresses(
      (previous) => [
        ...previous,
        address,
      ]
    );

    setNewAddress({
      title: '',
      name: '',
      company: '',
      address: '',
      city: '',
      phone: '',
    });

    setShowAddressForm(false);

    showMessage(
      'New address added successfully.'
    );

  };


  // ==========================================================
  // DELETE ADDRESS
  // ==========================================================

  const deleteAddress = (id) => {

    const confirmed =
      window.confirm(
        'Delete this saved address?'
      );

    if (!confirmed) {
      return;
    }

    setAddresses(
      (previous) =>
        previous.filter(
          (address) =>
            address.id !== id
        )
    );

    showMessage(
      'Address removed successfully.'
    );

  };


  // ==========================================================
  // SET DEFAULT ADDRESS
  // ==========================================================

  const setDefaultAddress = (id) => {

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

  };


  // ==========================================================
  // TOP UP
  // ==========================================================

  const handleTopUp = () => {

    showMessage(
      'Credit top-up request started. Payment options will be available shortly.'
    );

  };


  // ==========================================================
  // ORDER STATUS
  // ==========================================================

  const getOrderBadge = (status) => {

    if (status === 'Delivered') {
      return 'badge-instock';
    }

    if (status === 'Pending') {
      return 'badge-limited';
    }

    if (status === 'Cancelled') {
      return 'badge-outofstock';
    }

    return 'badge-navy';

  };


  // ==========================================================
  // RENDER ACTIVE CONTENT
  // ==========================================================

  const renderContent = () => {

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
                    (value) => !value
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

                    <label>
                      Full Name
                    </label>

                    <input
                      name="name"
                      value={profile.name}
                      onChange={
                        handleProfileChange
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
                      value={profile.company}
                      onChange={
                        handleProfileChange
                      }
                    />

                  </div>


                  <div className="field">

                    <label>
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={
                        handleProfileChange
                      }
                      required
                    />

                  </div>


                  <div className="field">

                    <label>
                      Phone Number
                    </label>

                    <input
                      name="phone"
                      value={profile.phone}
                      onChange={
                        handleProfileChange
                      }
                      placeholder="+256 700 000000"
                    />

                  </div>

                </div>


                <div className="customer-form-actions">

                  <button
                    type="submit"
                    className="btn btn-primary"
                  >

                    <Icon
                      name="check"
                      size={16}
                    />

                    Save Changes

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
                      user?.email}
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
                  Track and review all your machinery orders.
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

                        <tr key={order.id}>

                          <td>
                            <strong>
                              #{order.id}
                            </strong>
                          </td>

                          <td>
                            {order.items}
                          </td>

                          <td>
                            {order.date}
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
                              {order.total}
                            </strong>
                          </td>

                          <td>

                            <button
                              type="button"
                              className="customer-table-action"
                              onClick={() => {

                                if (
                                  order.status ===
                                  'In Transit'
                                ) {
                                  navigate(
                                    '/order-tracking'
                                  );
                                } else {
                                  showMessage(
                                    `Order ${order.id} selected.`
                                  );
                                }

                              }}
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
                    (value) => !value
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
                      Address Title
                    </label>

                    <input
                      name="title"
                      value={newAddress.title}
                      onChange={
                        handleAddressChange
                      }
                      placeholder="Main Office"
                      required
                    />

                  </div>


                  <div className="field">

                    <label>
                      Contact Name
                    </label>

                    <input
                      name="name"
                      value={newAddress.name}
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
                      value={newAddress.company}
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
                      value={newAddress.phone}
                      onChange={
                        handleAddressChange
                      }
                    />

                  </div>


                  <div className="field">

                    <label>
                      Address
                    </label>

                    <input
                      name="address"
                      value={newAddress.address}
                      onChange={
                        handleAddressChange
                      }
                      required
                    />

                  </div>


                  <div className="field">

                    <label>
                      City
                    </label>

                    <input
                      name="city"
                      value={newAddress.city}
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
                    onClick={() =>
                      setShowAddressForm(false)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Save Address
                  </button>

                </div>

              </form>

            )}


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

                    <span>
                      {address.company}
                    </span>

                    <span>
                      {address.address}
                    </span>

                    <span>
                      {address.city}
                    </span>

                    <span>
                      {address.phone}
                    </span>


                    <div className="customer-address-actions">

                      {!address.default && (

                        <button
                          type="button"
                          onClick={() =>
                            setDefaultAddress(
                              address.id
                            )
                          }
                        >
                          Set Default
                        </button>

                      )}

                      <button
                        type="button"
                        className="danger"
                        onClick={() =>
                          deleteAddress(
                            address.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

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
                  Review invoices and payment status.
                </p>

              </div>

              <button
                type="button"
                className="btn btn-gold"
                onClick={handleTopUp}
              >
                Top Up Credit
              </button>

            </div>


            <div className="customer-billing-summary">

              <div className="card">

                <span>
                  Enterprise Balance
                </span>

                <strong>
                  UGX 42,500,000
                </strong>

              </div>


              <div className="card">

                <span>
                  Outstanding
                </span>

                <strong>
                  UGX 107,100,000
                </strong>

              </div>


              <div className="card">

                <span>
                  Paid Invoices
                </span>

                <strong>
                  18
                </strong>

              </div>

            </div>


            <div className="card customer-panel">

              <div className="customer-table-wrapper">

                <table className="customer-table">

                  <thead>

                    <tr>
                      <th>Invoice</th>
                      <th>Order</th>
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

                        <tr key={invoice.id}>

                          <td>
                            <strong>
                              {invoice.id}
                            </strong>
                          </td>

                          <td>
                            {invoice.order}
                          </td>

                          <td>
                            {invoice.amount}
                          </td>

                          <td>
                            {invoice.date}
                          </td>

                          <td>
                            {invoice.due}
                          </td>

                          <td>

                            <span
                              className={`badge ${
                                invoice.status ===
                                'Paid'
                                  ? 'badge-instock'
                                  : 'badge-limited'
                              }`}
                            >
                              {invoice.status}
                            </span>

                          </td>

                          <td>

                            <button
                              type="button"
                              className="customer-table-action"
                              onClick={() =>
                                showMessage(
                                  `Invoice ${invoice.id} opened.`
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
                  Machinery and equipment you saved for later.
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
                  Save products you may want to purchase later.
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
                        {item.category}
                      </span>


                      <h3>
                        {item.name}
                      </h3>


                      <strong>
                        {item.price}
                      </strong>


                      <span
                        className={`badge ${
                          item.stock ===
                          'In Stock'
                            ? 'badge-instock'
                            : 'badge-limited'
                        }`}
                      >
                        {item.stock}
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
                  Security, billing and procurement updates.
                </p>

              </div>


              <button
                type="button"
                className="btn btn-outline-navy"
                onClick={
                  markAllNotificationsRead
                }
                disabled={
                  unreadNotifications === 0
                }
              >
                <Icon
                  name="check"
                  size={16}
                />

                Mark All Read

              </button>

            </div>


            <div className="card customer-notification-list">

              {notifications.map(
                (notification) => (

                  <div
                    key={notification.id}
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
                            : 'clock'
                        }
                        size={18}
                      />

                    </div>


                    <div className="customer-notification-content">

                      <div>

                        <strong>
                          {notification.title}
                        </strong>

                        <span>
                          {notification.time}
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
                  Manage your security and account preferences.
                </p>

              </div>

            </div>


            <div className="customer-settings-grid">

              <div className="card customer-panel">

                <h3>
                  Password & Security
                </h3>

                <div className="field">

                  <label>
                    Current Password
                  </label>

                  <input
                    type="password"
                    placeholder="Current password"
                  />

                </div>


                <div className="field">

                  <label>
                    New Password
                  </label>

                  <input
                    type="password"
                    placeholder="New password"
                  />

                </div>


                <div className="field">

                  <label>
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    placeholder="Confirm password"
                  />

                </div>


                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() =>
                    showMessage(
                      'Password update request submitted.'
                    )
                  }
                >
                  Update Password
                </button>

              </div>


              <div className="card customer-panel">

                <h3>
                  Communication Preferences
                </h3>


                <label className="customer-toggle">

                  <input
                    type="checkbox"
                    defaultChecked
                  />

                  <span>
                    Order updates
                  </span>

                </label>


                <label className="customer-toggle">

                  <input
                    type="checkbox"
                    defaultChecked
                  />

                  <span>
                    Inventory alerts
                  </span>

                </label>


                <label className="customer-toggle">

                  <input
                    type="checkbox"
                    defaultChecked
                  />

                  <span>
                    Invoice reminders
                  </span>

                </label>


                <label className="customer-toggle">

                  <input
                    type="checkbox"
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
                onClick={handleLogout}
              >

                <Icon
                  name="arrowRight"
                  size={16}
                />

                Logout

              </button>

            </div>

          </>

        );


      default:
        return null;

    }

  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="customer-dashboard-page">


      {/* ====================================================
          TOAST
      ==================================================== */}

      {message && (

        <div className="customer-toast">

          <Icon
            name="check"
            size={17}
          />

          <span>
            {message}
          </span>

        </div>

      )}


      {/* ====================================================
          PAGE HEADER
      ==================================================== */}

      <div className="container">

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


          <div className="customer-member">

            <Icon
              name="user"
              size={18}
            />

            <span>
              Member since{' '}
              {user?.memberSince ||
                'August 2026'}
            </span>

          </div>

        </div>


        {/* ==================================================
            LAYOUT
        ================================================== */}

        <div className="dashboard-layout">


          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="dashboard-sidebar card">


            {/* PROFILE */}

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
                Procurement Manager
              </span>

            </div>


            {/* NAVIGATION */}

            <nav className="customer-sidebar-nav">

              {sidebarItems.map(
                (item) => (

                  <button
                    key={item.key}
                    type="button"
                    className={
                      active === item.key
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
                      name={item.icon}
                      size={17}
                    />

                    <span>
                      {item.label}
                    </span>

                    {item.key ===
                      'notifications' &&
                      unreadNotifications >
                        0 && (

                      <span className="dashboard-badge">
                        {unreadNotifications}
                      </span>

                    )}

                    {item.key ===
                      'wishlist' &&
                      wishlist.length >
                        0 && (

                      <span className="dashboard-badge">
                        {wishlist.length}
                      </span>

                    )}

                    {item.key ===
                      'orders' &&
                      orders.length >
                        0 && (

                      <span className="dashboard-badge">
                        {orders.length}
                      </span>

                    )}

                  </button>

                )
              )}


              {/* LOGOUT */}

              <button
                type="button"
                className="dashboard-logout"
                onClick={handleLogout}
              >

                <Icon
                  name="arrowRight"
                  size={17}
                />

                <span>
                  Logout
                </span>

              </button>

            </nav>


            {/* BALANCE */}

            <div className="dashboard-balance">

              <span>
                Enterprise Balance
              </span>

              <strong>
                UGX 42,500,000
              </strong>

              <button
                type="button"
                className="btn btn-gold btn-sm btn-block"
                onClick={handleTopUp}
              >
                Top Up Credit
              </button>

            </div>

          </aside>


          {/* =================================================
              MAIN
          ================================================= */}

          <main className="dashboard-main">


            {/* STATS */}

            <div className="customer-stats-grid">

              <button
                type="button"
                className="card dashboard-stat"
                onClick={() =>
                  changeSection('orders')
                }
              >

                <Icon
                  name="truck"
                  size={20}
                />

                <strong>
                  {
                    orders.filter(
                      (order) =>
                        order.status ===
                          'In Transit' ||
                        order.status ===
                          'Processing'
                    ).length
                  }
                </strong>

                <span>
                  Ongoing Orders
                </span>

              </button>


              <button
                type="button"
                className="card dashboard-stat"
                onClick={() =>
                  changeSection('billing')
                }
              >

                <Icon
                  name="package"
                  size={20}
                />

                <strong>
                  {
                    invoices.filter(
                      (invoice) =>
                        invoice.status !==
                        'Paid'
                    ).length
                  }
                </strong>

                <span>
                  Invoices Due
                </span>

              </button>


              <button
                type="button"
                className="card dashboard-stat"
                onClick={() =>
                  changeSection('wishlist')
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


            {/* ACTIVE SHIPMENT */}

            <div className="card dashboard-shipment">

              <div className="dashboard-shipment-header">

                <div>

                  <strong>
                    Active Shipment
                  </strong>

                  <span>
                    Order #APX-9930 · In Transit
                  </span>

                </div>

                <span className="badge badge-gold">
                  Est. Arrival: May 20
                </span>

              </div>


              <ProgressBar
                steps={[
                  'Ordered',
                  'Processing',
                  'In Transit',
                  'Delivered',
                ]}
                activeIndex={2}
              />


              <Link
                to="/order-tracking"
                className="dashboard-track-link"
              >

                Track Details

                <Icon
                  name="arrowRight"
                  size={14}
                />

              </Link>

            </div>


            {/* ACTIVE SECTION */}

            <section className="customer-active-section">

              {renderContent()}

            </section>

          </main>

        </div>

      </div>

    </div>

  );

}