import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import './AdminOrders.css';


// ============================================================
// INITIAL ORDERS
// ============================================================

const initialOrders = [
  {
    id: '#APX-9921',
    customer: 'Webb Steelworks',
    email: 'procurement@webbsteelworks.com',
    date: '2026-07-24',
    amount: 45200000,
    status: 'Delivered',
    priority: 'High',
    payment: 'Paid',
    items: 4,
  },
  {
    id: '#APX-9920',
    customer: 'Nair Manufacturing',
    email: 'orders@nairmanufacturing.com',
    date: '2026-07-23',
    amount: 15800000,
    status: 'Processing',
    priority: 'Medium',
    payment: 'Paid',
    items: 2,
  },
  {
    id: '#APX-9919',
    customer: 'Alvarez Fabrication',
    email: 'purchasing@alvarezfab.com',
    date: '2026-07-23',
    amount: 98500000,
    status: 'Pending',
    priority: 'Urgent',
    payment: 'Pending',
    items: 8,
  },
  {
    id: '#APX-9918',
    customer: 'Global Trade Hub',
    email: 'admin@globaltradehub.com',
    date: '2026-07-22',
    amount: 4600000,
    status: 'Shipped',
    priority: 'Low',
    payment: 'Paid',
    items: 1,
  },
  {
    id: '#APX-9917',
    customer: 'Precision Engineering',
    email: 'procurement@precisioneng.com',
    date: '2026-07-21',
    amount: 27400000,
    status: 'Processing',
    priority: 'Medium',
    payment: 'Paid',
    items: 5,
  },
  {
    id: '#APX-9916',
    customer: 'Kampala Industrial Works',
    email: 'orders@kiw.ug',
    date: '2026-07-20',
    amount: 73200000,
    status: 'Delivered',
    priority: 'High',
    payment: 'Paid',
    items: 6,
  },
  {
    id: '#APX-9915',
    customer: 'East Africa Contractors',
    email: 'procurement@eacontractors.ug',
    date: '2026-07-19',
    amount: 18900000,
    status: 'Cancelled',
    priority: 'Low',
    payment: 'Refunded',
    items: 3,
  },
  {
    id: '#APX-9914',
    customer: 'Mukono Engineering Ltd',
    email: 'sales@mukonoengineering.ug',
    date: '2026-07-18',
    amount: 34600000,
    status: 'Shipped',
    priority: 'Medium',
    payment: 'Paid',
    items: 4,
  },
];


// ============================================================
// STATUS OPTIONS
// ============================================================

const statusOptions = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];


// ============================================================
// ADMIN ORDERS
// ============================================================

export default function AdminOrders() {

  const navigate = useNavigate();

  const [orders, setOrders] =
    useState(initialOrders);

  const [search, setSearch] =
    useState('');

  const [statusFilter, setStatusFilter] =
    useState('All');

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [newOrder, setNewOrder] =
    useState({
      customer: '',
      email: '',
      amount: '',
      items: 1,
      priority: 'Medium',
    });


  // ==========================================================
  // BACK TO DASHBOARD
  // ==========================================================

  const goBackToDashboard = () => {
    navigate('/admin');
  };


  // ==========================================================
  // CURRENCY
  // ==========================================================

  const formatCurrency = (value) => {
    return `UGX ${Number(value || 0).toLocaleString('en-UG')}`;
  };


  // ==========================================================
  // FILTER ORDERS
  // ==========================================================

  const filteredOrders = useMemo(() => {

    const query =
      search.trim().toLowerCase();

    return orders.filter((order) => {

      const matchesSearch =
        !query ||
        order.id
          .toLowerCase()
          .includes(query) ||
        order.customer
          .toLowerCase()
          .includes(query) ||
        order.email
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === 'All' ||
        order.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );

    });

  }, [
    orders,
    search,
    statusFilter,
  ]);


  // ==========================================================
  // STATISTICS
  // ==========================================================

  const totalOrders =
    orders.length;

  const pendingOrders =
    orders.filter(
      (order) =>
        order.status === 'Pending'
    ).length;

  const processingOrders =
    orders.filter(
      (order) =>
        order.status === 'Processing'
    ).length;

  const deliveredOrders =
    orders.filter(
      (order) =>
        order.status === 'Delivered'
    ).length;

  const shippedOrders =
    orders.filter(
      (order) =>
        order.status === 'Shipped'
    ).length;

  const cancelledOrders =
    orders.filter(
      (order) =>
        order.status === 'Cancelled'
    ).length;

  const totalRevenue =
    orders
      .filter(
        (order) =>
          order.status !== 'Cancelled'
      )
      .reduce(
        (total, order) =>
          total + Number(order.amount),
        0
      );

  const pendingRevenue =
    orders
      .filter(
        (order) =>
          order.payment === 'Pending'
      )
      .reduce(
        (total, order) =>
          total + Number(order.amount),
        0
      );


  // ==========================================================
  // UPDATE STATUS
  // ==========================================================

  const updateStatus = (
    orderId,
    newStatus
  ) => {

    setOrders((previous) =>
      previous.map((order) =>
        order.id === orderId
          ? {
              ...order,

              status:
                newStatus,

              payment:
                newStatus === 'Cancelled'
                  ? 'Refunded'
                  : order.payment,
            }
          : order
      )
    );


    setSelectedOrder((previous) =>
      previous
        ? {
            ...previous,

            status:
              newStatus,

            payment:
              newStatus === 'Cancelled'
                ? 'Refunded'
                : previous.payment,
          }
        : previous
    );

  };


  // ==========================================================
  // DELETE ORDER
  // ==========================================================

  const deleteOrder = (
    orderId
  ) => {

    const confirmed =
      window.confirm(
        `Delete order ${orderId}? This action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }


    setOrders((previous) =>
      previous.filter(
        (order) =>
          order.id !== orderId
      )
    );


    setSelectedOrder(null);

  };


  // ==========================================================
  // NEW ORDER INPUT
  // ==========================================================

  const handleNewOrderChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;


    setNewOrder((previous) => ({
      ...previous,

      [name]:
        value,
    }));

  };


  // ==========================================================
  // CREATE ORDER
  // ==========================================================

  const createOrder = (
    event
  ) => {

    event.preventDefault();


    if (
      !newOrder.customer.trim() ||
      !newOrder.email.trim() ||
      !newOrder.amount
    ) {
      return;
    }


    const orderNumber =
      9922 + orders.length;


    const order = {

      id:
        `#APX-${orderNumber}`,

      customer:
        newOrder.customer.trim(),

      email:
        newOrder.email.trim(),

      date:
        new Date()
          .toISOString()
          .split('T')[0],

      amount:
        Number(newOrder.amount),

      status:
        'Pending',

      priority:
        newOrder.priority,

      payment:
        'Pending',

      items:
        Number(
          newOrder.items || 1
        ),
    };


    setOrders((previous) => [
      order,
      ...previous,
    ]);


    setNewOrder({
      customer: '',
      email: '',
      amount: '',
      items: 1,
      priority: 'Medium',
    });


    setShowCreateModal(false);

  };


  // ==========================================================
  // STATUS CLASS
  // ==========================================================

  const getStatusClass = (
    status
  ) => {

    switch (status) {

      case 'Delivered':
        return 'order-status delivered';

      case 'Processing':
        return 'order-status processing';

      case 'Pending':
        return 'order-status pending';

      case 'Shipped':
        return 'order-status shipped';

      case 'Cancelled':
        return 'order-status cancelled';

      default:
        return 'order-status';

    }

  };


  // ==========================================================
  // PRIORITY CLASS
  // ==========================================================

  const getPriorityClass = (
    priority
  ) => {

    return `priority-${priority.toLowerCase()}`;

  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="admin-orders-page">


      {/* ====================================================
          TOP NAVIGATION
      ==================================================== */}

      <div className="admin-orders-topbar">

        <button
          type="button"
          className="admin-back-button"
          onClick={goBackToDashboard}
        >

          <Icon
            name="arrow-left"
            size={17}
          />

          <span>
            Back to Dashboard
          </span>

        </button>


        <div className="admin-location">

          <span>
            Admin
          </span>

          <span>
            /
          </span>

          <strong>
            Orders
          </strong>

        </div>

      </div>


      {/* ====================================================
          PAGE HEADER
      ==================================================== */}

      <header className="admin-page-header">

        <div className="admin-header-copy">

          <span className="eyebrow">
            APEX MACHINERY / OPERATIONS
          </span>

          <h1>
            Order Management
          </h1>

          <p>
            Manage customer orders,
            payments, fulfilment and
            delivery operations across
            Apex Machinery.
          </p>

        </div>


        <button
          type="button"
          className="btn btn-primary admin-create-btn"
          onClick={() =>
            setShowCreateModal(true)
          }
        >

          <Icon
            name="plus"
            size={17}
          />

          New Order

        </button>

      </header>


      {/* ====================================================
          STATISTICS
      ==================================================== */}

      <section className="admin-orders-stats">

        <div className="card order-stat">

          <div className="order-stat-icon navy">

            <Icon
              name="cart"
              size={19}
            />

          </div>

          <div>

            <span>
              Total Orders
            </span>

            <strong>
              {totalOrders}
            </strong>

          </div>

        </div>


        <div className="card order-stat">

          <div className="order-stat-icon gold">

            <Icon
              name="clock"
              size={19}
            />

          </div>

          <div>

            <span>
              Pending
            </span>

            <strong>
              {pendingOrders}
            </strong>

          </div>

        </div>


        <div className="card order-stat">

          <div className="order-stat-icon blue">

            <Icon
              name="settings"
              size={19}
            />

          </div>

          <div>

            <span>
              Processing
            </span>

            <strong>
              {processingOrders}
            </strong>

          </div>

        </div>


        <div className="card order-stat">

          <div className="order-stat-icon green">

            <Icon
              name="check"
              size={19}
            />

          </div>

          <div>

            <span>
              Delivered
            </span>

            <strong>
              {deliveredOrders}
            </strong>

          </div>

        </div>


        <div className="card order-stat order-revenue">

          <div className="order-stat-icon navy">

            <Icon
              name="bolt"
              size={19}
            />

          </div>

          <div>

            <span>
              Order Revenue
            </span>

            <strong>
              {formatCurrency(
                totalRevenue
              )}
            </strong>

          </div>

        </div>

      </section>


      {/* ====================================================
          SECONDARY METRICS
      ==================================================== */}

      <section className="orders-mini-summary">

        <div>
          <span>
            Shipped
          </span>

          <strong>
            {shippedOrders}
          </strong>
        </div>


        <div>
          <span>
            Cancelled
          </span>

          <strong>
            {cancelledOrders}
          </strong>
        </div>


        <div>
          <span>
            Unpaid Orders
          </span>

          <strong>
            {formatCurrency(
              pendingRevenue
            )}
          </strong>
        </div>


        <div>
          <span>
            Showing
          </span>

          <strong>
            {filteredOrders.length}
          </strong>
        </div>

      </section>


      {/* ====================================================
          ORDERS TABLE
      ==================================================== */}

      <section className="card admin-orders-container">


        {/* TOOLBAR */}

        <div className="admin-orders-toolbar">

          <div className="admin-orders-search">

            <Icon
              name="search"
              size={18}
            />

            <input
              type="search"
              placeholder="Search order ID, customer or email..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />


            {search && (

              <button
                type="button"
                className="clear-search"
                onClick={() =>
                  setSearch('')
                }
                aria-label="Clear search"
              >
                ×
              </button>

            )}

          </div>


          <select
            className="orders-filter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >

            <option value="All">
              All Orders
            </option>

            {statusOptions.map(
              (status) => (

                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>

              )
            )}

          </select>


          <span className="orders-count">

            {filteredOrders.length}{' '}

            result
            {filteredOrders.length !== 1
              ? 's'
              : ''}

          </span>

        </div>


        {/* TABLE */}

        <div className="admin-table-wrapper">

          <table className="dashboard-table">

            <thead>

              <tr>

                <th>
                  Order
                </th>

                <th>
                  Customer
                </th>

                <th>
                  Date
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Priority
                </th>

                <th>
                  Status
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredOrders.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="admin-orders-empty"
                  >

                    <div>

                      <Icon
                        name="search"
                        size={30}
                      />

                      <strong>
                        No orders found
                      </strong>

                      <span>
                        Try another search
                        or status filter.
                      </span>

                    </div>

                  </td>

                </tr>

              ) : (

                filteredOrders.map(
                  (order) => (

                    <tr
                      key={order.id}
                    >

                      <td>

                        <div className="order-id-cell">

                          <strong>
                            {order.id}
                          </strong>

                          <small>
                            {order.items}{' '}
                            item
                            {order.items !== 1
                              ? 's'
                              : ''}
                          </small>

                        </div>

                      </td>


                      <td>

                        <div className="customer-cell">

                          <strong>
                            {order.customer}
                          </strong>

                          <small>
                            {order.email}
                          </small>

                        </div>

                      </td>


                      <td>

                        <span className="order-date">
                          {order.date}
                        </span>

                      </td>


                      <td>

                        <strong className="order-amount">
                          {formatCurrency(
                            order.amount
                          )}
                        </strong>

                      </td>


                      <td>

                        <span
                          className={getPriorityClass(
                            order.priority
                          )}
                        >

                          <span className="priority-dot" />

                          {order.priority}

                        </span>

                      </td>


                      <td>

                        <span
                          className={getStatusClass(
                            order.status
                          )}
                        >
                          {order.status}
                        </span>

                      </td>


                      <td>

                        <div className="order-actions">

                          <button
                            type="button"
                            className="order-action view"
                            title="View order"
                            aria-label={`View ${order.id}`}
                            onClick={() =>
                              setSelectedOrder(
                                order
                              )
                            }
                          >

                            <Icon
                              name="eye"
                              size={16}
                            />

                          </button>


                          <button
                            type="button"
                            className="order-action delete"
                            title="Delete order"
                            aria-label={`Delete ${order.id}`}
                            onClick={() =>
                              deleteOrder(
                                order.id
                              )
                            }
                          >

                            <Icon
                              name="trash"
                              size={16}
                            />

                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </section>


      {/* ====================================================
          ORDER DETAILS MODAL
      ==================================================== */}

      {selectedOrder && (

        <div
          className="admin-modal-overlay"
          onClick={() =>
            setSelectedOrder(null)
          }
        >

          <div
            className="admin-modal order-details-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="admin-modal-header">

              <div>

                <span className="eyebrow">
                  Order Details
                </span>

                <h2>
                  {selectedOrder.id}
                </h2>

              </div>


              <button
                type="button"
                className="admin-modal-close"
                onClick={() =>
                  setSelectedOrder(null)
                }
              >
                ×
              </button>

            </div>


            <div className="order-modal-body">


              {/* CUSTOMER */}

              <div className="order-detail-customer">

                <div className="customer-avatar">

                  {selectedOrder.customer
                    .charAt(0)
                    .toUpperCase()}

                </div>


                <div>

                  <h3>
                    {selectedOrder.customer}
                  </h3>

                  <p>
                    {selectedOrder.email}
                  </p>

                </div>

              </div>


              {/* ORDER INFORMATION */}

              <div className="order-detail-grid">

                <div>

                  <span>
                    Order Date
                  </span>

                  <strong>
                    {selectedOrder.date}
                  </strong>

                </div>


                <div>

                  <span>
                    Items
                  </span>

                  <strong>
                    {selectedOrder.items}
                  </strong>

                </div>


                <div>

                  <span>
                    Total
                  </span>

                  <strong>
                    {formatCurrency(
                      selectedOrder.amount
                    )}
                  </strong>

                </div>


                <div>

                  <span>
                    Payment
                  </span>

                  <strong>
                    {selectedOrder.payment}
                  </strong>

                </div>

              </div>


              {/* STATUS */}

              <div className="order-status-section">

                <label>
                  Order Status
                </label>

                <select
                  value={
                    selectedOrder.status
                  }
                  onChange={(event) =>
                    updateStatus(
                      selectedOrder.id,
                      event.target.value
                    )
                  }
                >

                  {statusOptions.map(
                    (status) => (

                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>

                    )
                  )}

                </select>

              </div>


              {/* PROGRESS */}

              <div className="order-progress">

                <div
                  className={
                    selectedOrder.status ===
                    'Cancelled'
                      ? 'cancelled-progress'
                      : ''
                  }
                >

                  <span
                    className={
                      [
                        'Pending',
                        'Processing',
                        'Shipped',
                        'Delivered',
                      ].includes(
                        selectedOrder.status
                      )
                        ? 'active'
                        : ''
                    }
                  >
                    Pending
                  </span>


                  <span
                    className={
                      [
                        'Processing',
                        'Shipped',
                        'Delivered',
                      ].includes(
                        selectedOrder.status
                      )
                        ? 'active'
                        : ''
                    }
                  >
                    Processing
                  </span>


                  <span
                    className={
                      [
                        'Shipped',
                        'Delivered',
                      ].includes(
                        selectedOrder.status
                      )
                        ? 'active'
                        : ''
                    }
                  >
                    Shipped
                  </span>


                  <span
                    className={
                      selectedOrder.status ===
                      'Delivered'
                        ? 'active'
                        : ''
                    }
                  >
                    Delivered
                  </span>

                </div>

              </div>


              {/* ACTIONS */}

              <div className="order-modal-actions">

                <button
                  type="button"
                  className="btn btn-outline-navy"
                  onClick={() =>
                    setSelectedOrder(null)
                  }
                >
                  Close
                </button>


                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() =>
                    updateStatus(
                      selectedOrder.id,
                      'Processing'
                    )
                  }
                >

                  <Icon
                    name="settings"
                    size={16}
                  />

                  Mark Processing

                </button>

              </div>

            </div>

          </div>

        </div>

      )}


      {/* ====================================================
          CREATE ORDER MODAL
      ==================================================== */}

      {showCreateModal && (

        <div
          className="admin-modal-overlay"
          onClick={() =>
            setShowCreateModal(false)
          }
        >

          <div
            className="admin-modal create-order-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="admin-modal-header">

              <div>

                <span className="eyebrow">
                  Order Management
                </span>

                <h2>
                  Create New Order
                </h2>

              </div>


              <button
                type="button"
                className="admin-modal-close"
                onClick={() =>
                  setShowCreateModal(false)
                }
              >
                ×
              </button>

            </div>


            <form
              className="admin-order-form"
              onSubmit={createOrder}
            >

              <div className="field">

                <label>
                  Customer / Company Name
                </label>

                <input
                  name="customer"
                  value={
                    newOrder.customer
                  }
                  onChange={
                    handleNewOrderChange
                  }
                  placeholder="e.g. Kampala Industrial Works"
                  required
                />

              </div>


              <div className="field">

                <label>
                  Customer Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={
                    newOrder.email
                  }
                  onChange={
                    handleNewOrderChange
                  }
                  placeholder="procurement@company.ug"
                  required
                />

              </div>


              <div className="admin-form-grid">

                <div className="field">

                  <label>
                    Order Amount
                  </label>

                  <div className="input-prefix">

                    <span>
                      UGX
                    </span>

                    <input
                      type="number"
                      name="amount"
                      min="0"
                      value={
                        newOrder.amount
                      }
                      onChange={
                        handleNewOrderChange
                      }
                      placeholder="0"
                      required
                    />

                  </div>

                </div>


                <div className="field">

                  <label>
                    Number of Items
                  </label>

                  <input
                    type="number"
                    name="items"
                    min="1"
                    value={
                      newOrder.items
                    }
                    onChange={
                      handleNewOrderChange
                    }
                    required
                  />

                </div>

              </div>


              <div className="field">

                <label>
                  Priority
                </label>

                <select
                  name="priority"
                  value={
                    newOrder.priority
                  }
                  onChange={
                    handleNewOrderChange
                  }
                >

                  <option value="Low">
                    Low
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>

                  <option value="Urgent">
                    Urgent
                  </option>

                </select>

              </div>


              <div className="order-modal-actions">

                <button
                  type="button"
                  className="btn btn-outline-navy"
                  onClick={() =>
                    setShowCreateModal(false)
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="btn btn-primary"
                >

                  <Icon
                    name="plus"
                    size={16}
                  />

                  Create Order

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );
}