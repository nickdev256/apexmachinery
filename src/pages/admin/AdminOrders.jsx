import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import Icon from '../../components/Icon';

import {
  getAdminOrders,
  updateAdminOrderStatus,
} from '../../services/adminApi';

import './AdminOrders.css';


// ============================================================
// STATUS OPTIONS
// ============================================================

const statusOptions = [
  'Pending',
  'Processing',
  'Shipped',
  'In Transit',
  'Delivered',
  'Cancelled',
];


// ============================================================
// HELPERS
// ============================================================

function formatCurrency(value) {

  const amount =
    Number(value || 0);

  return `UGX ${amount.toLocaleString(
    'en-UG'
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


  return date.toLocaleDateString(
    'en-UG',
    {
      year:
        'numeric',

      month:
        'short',

      day:
        'numeric',
    }
  );

}


function normalizeStatus(value) {

  const status =
    String(
      value || ''
    )
      .trim()
      .toLowerCase();


  const map = {
    pending:
      'Pending',

    processing:
      'Processing',

    shipped:
      'Shipped',

    in_transit:
      'In Transit',

    'in transit':
      'In Transit',

    delivered:
      'Delivered',

    cancelled:
      'Cancelled',
  };


  return (
    map[status] ||
    value ||
    'Pending'
  );

}


function normalizePriority(value) {

  const priority =
    String(
      value || ''
    )
      .trim()
      .toLowerCase();


  const map = {
    low:
      'Low',

    medium:
      'Medium',

    high:
      'High',

    urgent:
      'Urgent',
  };


  return (
    map[priority] ||
    'Medium'
  );

}


function normalizePayment(value) {

  const payment =
    String(
      value || ''
    )
      .trim()
      .toLowerCase();


  const map = {
    paid:
      'Paid',

    pending:
      'Pending',

    unpaid:
      'Unpaid',

    refunded:
      'Refunded',

    cancelled:
      'Cancelled',
  };


  return (
    map[payment] ||
    value ||
    'Pending'
  );

}


function normalizeOrder(order) {

  const orderItems =
    Array.isArray(
      order?.orderItems
    )
      ? order.orderItems
      : Array.isArray(
          order?.order_items
        )
        ? order.order_items
        : [];


  const itemCount =
    Number(
      order?.itemCount ??
      order?.items ??
      orderItems.length ??
      0
    );


  return {

    databaseId:
      order?.databaseId ||
      order?.database_id ||
      order?.id ||
      null,

    id:
      order?.orderNumber ||
      order?.order_number ||
      (
        String(
          order?.id || ''
        ).startsWith('#')
          ? order.id
          : order?.order_number ||
            order?.id ||
            '—'
      ),

    customer:
      order?.customer ||
      order?.company ||
      order?.customerName ||
      order?.customer_name ||
      'Unknown Customer',

    email:
      order?.email ||
      order?.customerEmail ||
      order?.customer_email ||
      '',

    date:
      order?.date ||
      order?.createdAt ||
      order?.created_at ||
      null,

    amount:
      Number(
        order?.amount ??
        order?.total ??
        0
      ),

    status:
      normalizeStatus(
        order?.status
      ),

    priority:
      normalizePriority(
        order?.priority
      ),

    payment:
      normalizePayment(
        order?.payment ||
        order?.paymentStatus ||
        order?.payment_status
      ),

    items:
      Number.isFinite(
        itemCount
      )
        ? itemCount
        : orderItems.length,

    orderItems,

    shippingAddress:
      order?.shippingAddress ||
      order?.shipping_address ||
      null,

    estimatedDeliveryDate:
      order?.estimatedDeliveryDate ||
      order?.estimated_delivery_date ||
      null,

    notes:
      order?.notes ||
      '',

  };

}


// ============================================================
// STATUS CLASS
// ============================================================

function getStatusClass(
  status
) {

  switch (
    normalizeStatus(
      status
    )
  ) {

    case 'Delivered':
      return 'order-status delivered';

    case 'Processing':
      return 'order-status processing';

    case 'Pending':
      return 'order-status pending';

    case 'Shipped':
      return 'order-status shipped';

    case 'In Transit':
      return 'order-status shipped';

    case 'Cancelled':
      return 'order-status cancelled';

    default:
      return 'order-status';

  }

}


// ============================================================
// PRIORITY CLASS
// ============================================================

function getPriorityClass(
  priority
) {

  return `priority-${String(
    priority || 'medium'
  ).toLowerCase()}`;

}


// ============================================================
// ADMIN ORDERS
// ============================================================

export default function AdminOrders() {

  const navigate =
    useNavigate();


  // ==========================================================
  // STATE
  // ==========================================================

  const [
    orders,
    setOrders,
  ] =
    useState([]);


  const [
    search,
    setSearch,
  ] =
    useState('');


  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState('All');


  const [
    selectedOrder,
    setSelectedOrder,
  ] =
    useState(null);


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    refreshing,
    setRefreshing,
  ] =
    useState(false);


  const [
    error,
    setError,
  ] =
    useState('');


  const [
    updatingOrderId,
    setUpdatingOrderId,
  ] =
    useState(null);


  // ==========================================================
  // LOAD ORDERS
  // ==========================================================

  const loadOrders =
    useCallback(
      async (
        silent = false
      ) => {

        try {

          if (silent) {

            setRefreshing(
              true
            );

          } else {

            setLoading(
              true
            );

          }


          setError('');


          const response =
            await getAdminOrders();


          const rawOrders =
            Array.isArray(
              response
            )
              ? response
              : Array.isArray(
                  response?.orders
                )
                ? response.orders
                : [];


          const normalized =
            rawOrders.map(
              normalizeOrder
            );


          setOrders(
            normalized
          );


          setSelectedOrder(
            (current) => {

              if (!current) {
                return null;
              }


              return (
                normalized.find(
                  (order) =>
                    order.databaseId ===
                      current.databaseId ||
                    order.id ===
                      current.id
                ) ||
                null
              );

            }
          );

        } catch (requestError) {

          console.error(
            '[ADMIN ORDERS LOAD ERROR]',
            requestError
          );


          setError(
            requestError
              ?.response
              ?.data
              ?.message ||
            requestError
              ?.message ||
            'Unable to load orders.'
          );

        } finally {

          setLoading(
            false
          );

          setRefreshing(
            false
          );

        }

      },
      []
    );


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(
    () => {

      loadOrders();

    },
    [
      loadOrders,
    ]
  );


  // ==========================================================
  // AUTO REFRESH
  // ==========================================================

  useEffect(
    () => {

      const interval =
        window.setInterval(
          () => {

            loadOrders(
              true
            );

          },
          30000
        );


      return () => {

        window.clearInterval(
          interval
        );

      };

    },
    [
      loadOrders,
    ]
  );


  // ==========================================================
  // BACK TO DASHBOARD
  // ==========================================================

  const goBackToDashboard =
    () => {

      navigate(
        '/admin'
      );

    };


  // ==========================================================
  // FILTER ORDERS
  // ==========================================================

  const filteredOrders =
    useMemo(
      () => {

        const query =
          search
            .trim()
            .toLowerCase();


        return orders.filter(
          (order) => {

            const matchesSearch =
              !query ||
              String(
                order.id || ''
              )
                .toLowerCase()
                .includes(
                  query
                ) ||
              String(
                order.customer || ''
              )
                .toLowerCase()
                .includes(
                  query
                ) ||
              String(
                order.email || ''
              )
                .toLowerCase()
                .includes(
                  query
                );


            const matchesStatus =
              statusFilter ===
                'All' ||
              order.status ===
                statusFilter;


            return (
              matchesSearch &&
              matchesStatus
            );

          }
        );

      },
      [
        orders,
        search,
        statusFilter,
      ]
    );


  // ==========================================================
  // STATISTICS
  // ==========================================================

  const statistics =
    useMemo(
      () => {

        const countStatus =
          (status) =>
            orders.filter(
              (order) =>
                order.status ===
                status
            ).length;


        const totalRevenue =
          orders
            .filter(
              (order) =>
                order.status !==
                  'Cancelled' &&
                order.payment ===
                  'Paid'
            )
            .reduce(
              (
                total,
                order
              ) =>
                total +
                Number(
                  order.amount ||
                  0
                ),
              0
            );


        const pendingRevenue =
          orders
            .filter(
              (order) =>
                order.payment ===
                  'Pending' ||
                order.payment ===
                  'Unpaid'
            )
            .reduce(
              (
                total,
                order
              ) =>
                total +
                Number(
                  order.amount ||
                  0
                ),
              0
            );


        return {

          total:
            orders.length,

          pending:
            countStatus(
              'Pending'
            ),

          processing:
            countStatus(
              'Processing'
            ),

          shipped:
            countStatus(
              'Shipped'
            ) +
            countStatus(
              'In Transit'
            ),

          delivered:
            countStatus(
              'Delivered'
            ),

          cancelled:
            countStatus(
              'Cancelled'
            ),

          totalRevenue,

          pendingRevenue,

        };

      },
      [
        orders,
      ]
    );


  // ==========================================================
  // UPDATE STATUS
  // ==========================================================

  const updateStatus =
    async (
      order,
      newStatus
    ) => {

      if (
        !order?.databaseId
      ) {

        setError(
          'This order is missing its database ID.'
        );

        return;

      }


      const normalizedStatus =
        normalizeStatus(
          newStatus
        );


      try {

        setUpdatingOrderId(
          order.databaseId
        );

        setError('');


        await updateAdminOrderStatus(
          order.databaseId,
          normalizedStatus
        );


        setOrders(
          (previous) =>
            previous.map(
              (item) =>
                item.databaseId ===
                order.databaseId
                  ? {
                      ...item,

                      status:
                        normalizedStatus,
                    }
                  : item
            )
        );


        setSelectedOrder(
          (previous) =>
            previous &&
            previous.databaseId ===
              order.databaseId
              ? {
                  ...previous,

                  status:
                    normalizedStatus,
                }
              : previous
        );


        await loadOrders(
          true
        );

      } catch (requestError) {

        console.error(
          '[ORDER STATUS UPDATE ERROR]',
          requestError
        );


        setError(
          requestError
            ?.response
            ?.data
            ?.message ||
          requestError
            ?.message ||
          'Unable to update order status.'
        );

      } finally {

        setUpdatingOrderId(
          null
        );

      }

    };


  // ==========================================================
  // RENDER LOADING
  // ==========================================================

  if (
    loading
  ) {

    return (

      <div className="admin-orders-page">

        <div className="admin-orders-loading">

          <Icon
            name="settings"
            size={30}
          />

          <h2>
            Loading orders...
          </h2>

          <p>
            Fetching order data from
            Apex Machinery.
          </p>

        </div>

      </div>

    );

  }


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
          onClick={
            goBackToDashboard
          }
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
          HEADER
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
          disabled={
            refreshing
          }
          onClick={() =>
            loadOrders(
              true
            )
          }
        >

          <Icon
            name="refresh"
            size={17}
          />

          {refreshing
            ? 'Refreshing...'
            : 'Refresh Orders'}

        </button>

      </header>


      {/* ====================================================
          ERROR
      ==================================================== */}

      {error && (

        <div className="admin-orders-error">

          <div>

            <strong>
              Orders unavailable
            </strong>

            <span>
              {error}
            </span>

          </div>


          <button
            type="button"
            onClick={() =>
              loadOrders()
            }
          >
            Try Again
          </button>

        </div>

      )}


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
              {statistics.total}
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
              {statistics.pending}
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
              {statistics.processing}
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
              {statistics.delivered}
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
              Paid Revenue
            </span>

            <strong>
              {formatCurrency(
                statistics.totalRevenue
              )}
            </strong>

          </div>

        </div>

      </section>


      {/* ====================================================
          SECONDARY SUMMARY
      ==================================================== */}

      <section className="orders-mini-summary">

        <div>

          <span>
            Shipped / Transit
          </span>

          <strong>
            {statistics.shipped}
          </strong>

        </div>


        <div>

          <span>
            Cancelled
          </span>

          <strong>
            {statistics.cancelled}
          </strong>

        </div>


        <div>

          <span>
            Pending Payment
          </span>

          <strong>
            {formatCurrency(
              statistics.pendingRevenue
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
              onChange={
                (event) =>
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
            value={
              statusFilter
            }
            onChange={
              (event) =>
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
            {filteredOrders.length !==
            1
              ? 's'
              : ''}

          </span>

        </div>


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
                  Payment
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

              {filteredOrders.length ===
              0 ? (

                <tr>

                  <td
                    colSpan="8"
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
                        There are currently
                        no orders matching
                        this filter.
                      </span>

                    </div>

                  </td>

                </tr>

              ) : (

                filteredOrders.map(
                  (order) => (

                    <tr
                      key={
                        order.databaseId ||
                        order.id
                      }
                    >

                      <td>

                        <div className="order-id-cell">

                          <strong>
                            {order.id}
                          </strong>

                          <small>

                            {order.items}{' '}

                            item
                            {order.items !==
                            1
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
                            {order.email ||
                              'No email'}
                          </small>

                        </div>

                      </td>


                      <td>

                        <span className="order-date">

                          {formatDate(
                            order.date
                          )}

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
                          className={
                            getPriorityClass(
                              order.priority
                            )
                          }
                        >

                          <span className="priority-dot" />

                          {order.priority}

                        </span>

                      </td>


                      <td>

                        <strong>
                          {order.payment}
                        </strong>

                      </td>


                      <td>

                        <span
                          className={
                            getStatusClass(
                              order.status
                            )
                          }
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
            setSelectedOrder(
              null
            )
          }
        >

          <div
            className="admin-modal order-details-modal"
            onClick={
              (event) =>
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
                  setSelectedOrder(
                    null
                  )
                }
              >
                ×
              </button>

            </div>


            <div className="order-modal-body">

              <div className="order-detail-customer">

                <div className="customer-avatar">

                  {String(
                    selectedOrder.customer ||
                    'C'
                  )
                    .charAt(0)
                    .toUpperCase()}

                </div>


                <div>

                  <h3>
                    {selectedOrder.customer}
                  </h3>

                  <p>
                    {selectedOrder.email ||
                      'No customer email'}
                  </p>

                </div>

              </div>


              <div className="order-detail-grid">

                <div>

                  <span>
                    Order Date
                  </span>

                  <strong>
                    {formatDate(
                      selectedOrder.date
                    )}
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


                <div>

                  <span>
                    Priority
                  </span>

                  <strong>
                    {selectedOrder.priority}
                  </strong>

                </div>


                <div>

                  <span>
                    Estimated Delivery
                  </span>

                  <strong>
                    {selectedOrder
                      .estimatedDeliveryDate
                      ? formatDate(
                          selectedOrder
                            .estimatedDeliveryDate
                        )
                      : 'Not set'}
                  </strong>

                </div>

              </div>


              {/* ============================================
                  ORDER ITEMS
              ============================================ */}

              {selectedOrder
                .orderItems
                ?.length >
                0 && (

                <div className="order-items-detail">

                  <h3>
                    Order Items
                  </h3>


                  {selectedOrder
                    .orderItems
                    .map(
                      (item) => (

                        <div
                          className="order-item-row"
                          key={
                            item.id ||
                            item.productId ||
                            item.sku
                          }
                        >

                          <div>

                            <strong>
                              {item.name ||
                                item.productName ||
                                'Product'}
                            </strong>

                            <small>
                              {item.sku ||
                                'No SKU'}
                            </small>

                          </div>


                          <span>

                            {Number(
                              item.quantity ||
                              0
                            )}{' '}
                            ×{' '}

                            {formatCurrency(
                              item.unitPrice ||
                              item.unit_price
                            )}

                          </span>


                          <strong>

                            {formatCurrency(
                              item.totalPrice ||
                              item.total_price
                            )}

                          </strong>

                        </div>

                      )
                    )}

                </div>

              )}


              {/* ============================================
                  STATUS
              ============================================ */}

              <div className="order-status-section">

                <label>
                  Order Status
                </label>


                <select
                  value={
                    selectedOrder.status
                  }
                  disabled={
                    updatingOrderId ===
                    selectedOrder.databaseId
                  }
                  onChange={
                    (event) =>
                      updateStatus(
                        selectedOrder,
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


                {updatingOrderId ===
                  selectedOrder.databaseId && (

                  <small>
                    Updating status...
                  </small>

                )}

              </div>


              {/* ============================================
                  PROGRESS
              ============================================ */}

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
                        'In Transit',
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
                        'In Transit',
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
                        'In Transit',
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
                      [
                        'In Transit',
                        'Delivered',
                      ].includes(
                        selectedOrder.status
                      )
                        ? 'active'
                        : ''
                    }
                  >
                    In Transit
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


              <div className="order-modal-actions">

                <button
                  type="button"
                  className="btn btn-outline-navy"
                  onClick={() =>
                    setSelectedOrder(
                      null
                    )
                  }
                >
                  Close
                </button>


                {selectedOrder.status ===
                  'Pending' && (

                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={
                      updatingOrderId ===
                      selectedOrder.databaseId
                    }
                    onClick={() =>
                      updateStatus(
                        selectedOrder,
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

                )}


                {selectedOrder.status ===
                  'Processing' && (

                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={
                      updatingOrderId ===
                      selectedOrder.databaseId
                    }
                    onClick={() =>
                      updateStatus(
                        selectedOrder,
                        'Shipped'
                      )
                    }
                  >

                    Mark Shipped

                  </button>

                )}


                {selectedOrder.status ===
                  'Shipped' && (

                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={
                      updatingOrderId ===
                      selectedOrder.databaseId
                    }
                    onClick={() =>
                      updateStatus(
                        selectedOrder,
                        'In Transit'
                      )
                    }
                  >

                    Mark In Transit

                  </button>

                )}


                {selectedOrder.status ===
                  'In Transit' && (

                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={
                      updatingOrderId ===
                      selectedOrder.databaseId
                    }
                    onClick={() =>
                      updateStatus(
                        selectedOrder,
                        'Delivered'
                      )
                    }
                  >

                    <Icon
                      name="check"
                      size={16}
                    />

                    Mark Delivered

                  </button>

                )}

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}