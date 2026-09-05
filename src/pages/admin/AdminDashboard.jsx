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
  getAdminDashboard,
} from '../../services/adminApi';

import './AdminDashboard.css';


// ============================================================
// STATUS STYLES
// ============================================================

const statusClass = {
  Delivered: 'badge-instock',
  Processing: 'badge-navy',
  Pending: 'badge-limited',
  Shipped: 'badge-gold',
  'In Transit': 'badge-gold',
  Cancelled: 'badge-limited',
};


// ============================================================
// QUICK ACTIONS
// ============================================================

const quickActions = [
  {
    title: 'Add Product',
    description: 'Create a new product listing',
    icon: 'plus',
    route: '/admin/products',
  },

  {
    title: 'Manage Orders',
    description: 'Review customer orders',
    icon: 'cart',
    route: '/admin/orders',
  },

  {
    title: 'Check Inventory',
    description: 'Review stock levels',
    icon: 'package',
    route: '/admin/inventory',
  },

  {
    title: 'View Customers',
    description: 'Manage customer accounts',
    icon: 'user',
    route: '/admin/customers',
  },
];


// ============================================================
// MANAGEMENT LINKS
// ============================================================

const managementLinks = [
  {
    label: 'Categories',
    icon: 'grid',
    route: '/admin/categories',
  },

  {
    label: 'Reports',
    icon: 'eye',
    route: '/admin/reports',
  },

  {
    label: 'Notifications',
    icon: 'clock',
    route: '/admin/notifications',
  },

  {
    label: 'Settings',
    icon: 'settings',
    route: '/admin/settings',
  },
];


// ============================================================
// DEFAULT SALES DATA
// ============================================================

const defaultSalesData = {
  6: {
    labels: [],
    points: [],
  },

  12: {
    labels: [],
    points: [],
  },
};


// ============================================================
// HELPERS
// ============================================================

function formatMoney(value) {

  const number =
    Number(value || 0);

  return `UGX ${number.toLocaleString()}`;

}


function formatNumber(value) {

  return Number(
    value || 0
  ).toLocaleString();

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
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    in_transit: 'In Transit',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
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
      value || 'medium'
    )
      .trim()
      .toLowerCase();


  const map = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
  };


  return (
    map[priority] ||
    'Medium'
  );

}


// ============================================================
// ADMIN DASHBOARD
// ============================================================

export default function AdminDashboard() {

  const navigate =
    useNavigate();


  // ==========================================================
  // STATE
  // ==========================================================

  const [
    period,
    setPeriod,
  ] =
    useState('6');


  const [
    dashboard,
    setDashboard,
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


  // ==========================================================
  // LOAD DASHBOARD
  // ==========================================================

  const loadDashboard =
    useCallback(
      async (
        silent = false
      ) => {

        try {

          if (silent) {

            setRefreshing(true);

          } else {

            setLoading(true);

          }


          setError('');


          const data =
            await getAdminDashboard();


          setDashboard(
            data || {}
          );

        } catch (requestError) {

          console.error(
            'Admin dashboard load error:',
            requestError
          );


          const message =
            requestError
              ?.response
              ?.data
              ?.message ||
            requestError
              ?.message ||
            'Unable to load the admin dashboard.';


          setError(
            message
          );

        } finally {

          setLoading(false);

          setRefreshing(false);

        }

      },
      []
    );


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(
    () => {

      loadDashboard();

    },
    [
      loadDashboard,
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

            loadDashboard(
              true
            );

          },
          30000
        );


      return () =>
        window.clearInterval(
          interval
        );

    },
    [
      loadDashboard,
    ]
  );


  // ==========================================================
  // NORMALIZED STATS
  // ==========================================================

  const stats =
    useMemo(
      () => {

        const raw =
          dashboard?.stats ||
          {};


        return [
          {
            label: 'Total Revenue',
            value:
              formatMoney(
                raw.totalRevenue
              ),
            change:
              raw.revenueChange ??
              null,
            up:
              Number(
                raw.revenueChangeValue ||
                0
              ) >= 0,
            icon: 'bolt',
            route: '/admin/reports',
          },

          {
            label: 'Active Orders',
            value:
              formatNumber(
                raw.activeOrders
              ),
            change:
              raw.activeOrdersChange ??
              null,
            up:
              Number(
                raw.activeOrdersChangeValue ||
                0
              ) >= 0,
            icon: 'cart',
            route: '/admin/orders',
          },

          {
            label: 'Inventory Value',
            value:
              formatMoney(
                raw.inventoryValue
              ),
            change:
              raw.inventoryValueChange ??
              null,
            up:
              Number(
                raw.inventoryValueChangeValue ||
                0
              ) >= 0,
            icon: 'package',
            route: '/admin/inventory',
          },

          {
            label: 'Avg. Lead Time',
            value:
              `${Number(
                raw.averageLeadTime ||
                0
              ).toFixed(1)} Days`,
            change:
              raw.leadTimeChange ??
              null,
            up:
              Number(
                raw.leadTimeChangeValue ||
                0
              ) >= 0,
            icon: 'truck',
            route: '/admin/reports',
          },
        ];

      },
      [
        dashboard,
      ]
    );


  // ==========================================================
  // RECENT ORDERS
  // ==========================================================

  const recentOrders =
    useMemo(
      () => {

        const rawOrders =
          dashboard
            ?.recentOrders ||
          [];


        return rawOrders.map(
          (order) => ({
            databaseId:
              order.databaseId ||
              order.id,

            id:
              order.orderNumber ||
              order.order_number ||
              order.displayId ||
              order.id ||
              '—',

            customer:
              order.customer ||
              order.customerName ||
              order.customer_name ||
              order.profile?.name ||
              order.profiles?.name ||
              'Unknown customer',

            date:
              formatDate(
                order.date ||
                order.createdAt ||
                order.created_at
              ),

            amount:
              typeof order.amount ===
              'string'
                ? order.amount
                : formatMoney(
                    order.amount ??
                    order.total
                  ),

            status:
              normalizeStatus(
                order.status
              ),

            priority:
              normalizePriority(
                order.priority
              ),
          })
        );

      },
      [
        dashboard,
      ]
    );


  // ==========================================================
  // CATEGORY DISTRIBUTION
  // ==========================================================

  const categoryDist =
    useMemo(
      () => {

        const categories =
          dashboard
            ?.categoryDistribution ||
          dashboard
            ?.categories ||
          [];


        return categories.map(
          (category) => ({
            name:
              category.name ||
              category.category ||
              'Uncategorized',

            pct:
              Number(
                category.pct ??
                category.percentage ??
                0
              ),
          })
        );

      },
      [
        dashboard,
      ]
    );


  // ==========================================================
  // INVENTORY ALERTS
  // ==========================================================

  const inventoryAlerts =
    useMemo(
      () => {

        const alerts =
          dashboard
            ?.inventoryAlerts ||
          [];


        return alerts.map(
          (item) => ({
            id:
              item.id,

            name:
              item.name ||
              item.productName ||
              item.product_name ||
              'Unnamed product',

            sku:
              item.sku ||
              'N/A',

            left:
              Number(
                item.left ??
                item.stockQuantity ??
                item.stock_quantity ??
                0
              ),

            total:
              Number(
                item.total ??
                item.maxStock ??
                item.max_stock ??
                item.lowStockThreshold ??
                item.low_stock_threshold ??
                1
              ),
          })
        );

      },
      [
        dashboard,
      ]
    );


  // ==========================================================
  // SALES DATA
  // ==========================================================

  const salesData =
    useMemo(
      () => {

        return (
          dashboard?.sales ||
          defaultSalesData
        );

      },
      [
        dashboard,
      ]
    );


  const currentSales =
    useMemo(
      () => {

        const selected =
          salesData[
            period
          ] ||
          salesData[
            Number(period)
          ] ||
          defaultSalesData[
            period
          ];


        if (
          selected?.points?.length
        ) {

          return selected;

        }


        if (
          selected?.values?.length
        ) {

          const values =
            selected.values.map(
              (value) =>
                Number(value || 0)
            );


          const maxValue =
            Math.max(
              ...values,
              1
            );


          const width =
            600;


          const topPadding =
            25;


          const bottom =
            200;


          const range =
            bottom -
            topPadding;


          const step =
            values.length > 1
              ? width /
                (
                  values.length -
                  1
                )
              : 0;


          const points =
            values.map(
              (
                value,
                index
              ) => {

                const x =
                  index *
                  step;


                const ratio =
                  value /
                  maxValue;


                const y =
                  bottom -
                  ratio *
                  range;


                return [
                  x,
                  y,
                ];

              }
            );


          return {
            labels:
              selected.labels ||
              [],
            points,
          };

        }


        return {
          labels: [],
          points: [],
        };

      },
      [
        salesData,
        period,
      ]
    );


  // ==========================================================
  // SVG POINTS
  // ==========================================================

  const linePoints =
    currentSales.points
      .map(
        ([x, y]) =>
          `${x},${y}`
      )
      .join(' ');


  const areaPoints =
    linePoints
      ? `${linePoints} 600,220 0,220`
      : '';


  // ==========================================================
  // BUSINESS SUMMARY
  // ==========================================================

  const businessSummary =
    useMemo(
      () => {

        const summary =
          dashboard?.summary ||
          dashboard?.businessSummary ||
          {};


        return [
          {
            value:
              formatNumber(
                summary.monthlyOrders
              ),
            label:
              'Orders this month',
            icon:
              'cart',
            route:
              '/admin/orders',
          },

          {
            value:
              formatNumber(
                summary.activeCustomers
              ),
            label:
              'Active customers',
            icon:
              'user',
            route:
              '/admin/customers',
          },

          {
            value:
              formatNumber(
                summary.productCount
              ),
            label:
              'Products in catalog',
            icon:
              'package',
            route:
              '/admin/products',
          },

          {
            value:
              `${Number(
                summary.onTimeDelivery ||
                0
              ).toFixed(1)}%`,
            label:
              'On-time deliveries',
            icon:
              'truck',
            route:
              '/admin/reports',
          },
        ];

      },
      [
        dashboard,
      ]
    );


  // ==========================================================
  // NAVIGATION
  // ==========================================================

  function goTo(route) {

    if (!route) {
      return;
    }


    navigate(
      route
    );

  }


  // ==========================================================
  // ORDER CLICK
  // ==========================================================

  function handleOrderClick(
    order
  ) {

    navigate(
      '/admin/orders',
      {
        state: {
          orderId:
            order.databaseId,
        },
      }
    );

  }


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (

      <div className="admin-dashboard-page">

        <div className="admin-dashboard-loading">

          <div className="admin-loading-spinner" />

          <h2>
            Loading dashboard
          </h2>

          <p>
            Retrieving the latest Apex
            Machinery business data.
          </p>

        </div>

      </div>

    );

  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="admin-dashboard-page">


      {/* ====================================================
          HEADER
      ==================================================== */}

      <header className="admin-header">

        <div className="admin-header-left">

          <span className="eyebrow">
            Apex Machinery
          </span>


          <h1>
            Admin Overview
          </h1>


          <p>
            Monitor orders, inventory,
            procurement and business
            performance.
          </p>

        </div>


        <div className="admin-header-actions">


          <button
            type="button"
            className="admin-refresh-button"
            onClick={() =>
              loadDashboard(
                true
              )
            }
            disabled={refreshing}
          >

            <Icon
              name="refresh"
              size={16}
            />

            {refreshing
              ? 'Refreshing...'
              : 'Refresh'}

          </button>


          <button
            type="button"
            className="admin-icon-button"
            title="Notifications"
            aria-label="Open notifications"
            onClick={() =>
              goTo(
                '/admin/notifications'
              )
            }
          >

            <Icon
              name="clock"
              size={19}
            />


            {Number(
              dashboard
                ?.unreadNotifications ||
              0
            ) > 0 && (

              <span
                className="notification-dot"
                aria-hidden="true"
              />

            )}

          </button>


          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              goTo(
                '/admin/orders'
              )
            }
          >

            <Icon
              name="plus"
              size={16}
            />

            New Procurement

          </button>

        </div>

      </header>


      {/* ====================================================
          ERROR
      ==================================================== */}

      {error && (

        <div className="admin-dashboard-error">

          <div>

            <strong>
              Dashboard unavailable
            </strong>

            <span>
              {error}
            </span>

          </div>


          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() =>
              loadDashboard()
            }
          >

            Try Again

          </button>

        </div>

      )}


      {/* ====================================================
          STATISTICS
      ==================================================== */}

      <section className="admin-stats grid-4">

        {stats.map(
          (stat) => (

            <button
              key={stat.label}
              type="button"
              className="card admin-stat admin-stat-button"
              onClick={() =>
                goTo(
                  stat.route
                )
              }
            >

              <div className="admin-stat-top">

                <div className="admin-stat-icon">

                  <Icon
                    name={stat.icon}
                    size={19}
                  />

                </div>


                {stat.change && (

                  <span
                    className={
                      stat.up
                        ? 'admin-up'
                        : 'admin-down'
                    }
                  >

                    {stat.change}

                  </span>

                )}

              </div>


              <strong>
                {stat.value}
              </strong>


              <span className="admin-stat-label">
                {stat.label}
              </span>

            </button>

          )
        )}

      </section>


      {/* ====================================================
          QUICK ACTIONS
      ==================================================== */}

      <section className="admin-quick-section">

        <div className="admin-section-title">

          <div>

            <span className="eyebrow">
              Quick Actions
            </span>


            <h2>
              Manage Your Operations
            </h2>

          </div>

        </div>


        <div className="admin-quick-grid">

          {quickActions.map(
            (action) => (

              <button
                key={action.title}
                type="button"
                className="admin-quick-card"
                onClick={() =>
                  goTo(
                    action.route
                  )
                }
              >

                <div className="admin-quick-icon">

                  <Icon
                    name={action.icon}
                    size={20}
                  />

                </div>


                <div>

                  <strong>
                    {action.title}
                  </strong>


                  <span>
                    {action.description}
                  </span>

                </div>


                <Icon
                  name="chevron-right"
                  size={16}
                />

              </button>

            )
          )}

        </div>

      </section>


      {/* ====================================================
          SALES + CATEGORIES
      ==================================================== */}

      <section className="admin-mid-grid">


        {/* ==================================================
            SALES PERFORMANCE
        ================================================== */}

        <div className="card admin-chart">

          <div className="admin-section-header">

            <div>

              <h3>
                Sales Performance
              </h3>


              <p>
                Revenue from completed
                transactions
              </p>

            </div>


            <select
              value={period}
              onChange={(event) =>
                setPeriod(
                  event.target.value
                )
              }
              aria-label="Sales period"
            >

              <option value="6">
                Last 6 Months
              </option>


              <option value="12">
                Last 12 Months
              </option>

            </select>

          </div>


          {currentSales.points.length >
          0 ? (

            <>

              <div className="admin-chart-wrapper">

                <svg
                  viewBox="0 0 600 220"
                  className="admin-chart-svg"
                  preserveAspectRatio="none"
                  role="img"
                  aria-label="Sales performance chart"
                >

                  <line
                    x1="0"
                    y1="180"
                    x2="600"
                    y2="180"
                    stroke="rgba(11,31,77,0.08)"
                  />


                  <line
                    x1="0"
                    y1="130"
                    x2="600"
                    y2="130"
                    stroke="rgba(11,31,77,0.08)"
                  />


                  <line
                    x1="0"
                    y1="80"
                    x2="600"
                    y2="80"
                    stroke="rgba(11,31,77,0.08)"
                  />


                  <polygon
                    fill="rgba(11,31,77,0.08)"
                    points={
                      areaPoints
                    }
                  />


                  <polyline
                    fill="none"
                    stroke="#0B1F4D"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={
                      linePoints
                    }
                  />


                  {currentSales
                    .points
                    .map(
                      (
                        [
                          cx,
                          cy,
                        ]
                      ) => (

                        <circle
                          key={
                            `${cx}-${cy}`
                          }
                          cx={cx}
                          cy={cy}
                          r="5"
                          fill="#0B1F4D"
                        />

                      )
                    )}

                </svg>

              </div>


              <div className="admin-chart-labels">

                {currentSales
                  .labels
                  .map(
                    (
                      label,
                      index
                    ) => (

                      <span
                        key={
                          `${label}-${index}`
                        }
                      >
                        {label}
                      </span>

                    )
                  )}

              </div>

            </>

          ) : (

            <div className="admin-dashboard-empty">

              <Icon
                name="bolt"
                size={28}
              />

              <strong>
                No sales data yet
              </strong>

              <span>
                Revenue history will appear
                when completed orders are
                recorded.
              </span>

            </div>

          )}


          <button
            type="button"
            className="admin-chart-link"
            onClick={() =>
              goTo(
                '/admin/reports'
              )
            }
          >

            View Detailed Reports

            <Icon
              name="chevron-right"
              size={14}
            />

          </button>

        </div>


        {/* ==================================================
            CATEGORY DISTRIBUTION
        ================================================== */}

        <div className="card admin-category">

          <div className="admin-section-header">

            <div>

              <h3>
                Category Distribution
              </h3>


              <p>
                Order volume by category
              </p>

            </div>

          </div>


          {categoryDist.length >
          0 ? (

            <div className="admin-category-list">

              {categoryDist.map(
                (category) => (

                  <button
                    key={
                      category.name
                    }
                    type="button"
                    className="admin-category-row"
                    onClick={() =>
                      goTo(
                        '/admin/categories'
                      )
                    }
                  >

                    <div className="admin-category-top">

                      <span>
                        {category.name}
                      </span>


                      <strong>
                        {category.pct.toFixed(
                          1
                        )}
                        %
                      </strong>

                    </div>


                    <div className="admin-bar">

                      <div
                        className="admin-bar-fill"
                        style={{
                          width:
                            `${Math.min(
                              100,
                              Math.max(
                                0,
                                category.pct
                              )
                            )}%`,
                        }}
                      />

                    </div>

                  </button>

                )
              )}

            </div>

          ) : (

            <div className="admin-dashboard-empty">

              <Icon
                name="grid"
                size={28}
              />

              <strong>
                No category data
              </strong>

              <span>
                Category distribution will
                appear when orders contain
                categorized products.
              </span>

            </div>

          )}


          <button
            type="button"
            className="admin-view-btn"
            onClick={() =>
              goTo(
                '/admin/categories'
              )
            }
          >

            Manage Categories

            <Icon
              name="chevron-right"
              size={14}
            />

          </button>

        </div>

      </section>


      {/* ====================================================
          ORDERS + INVENTORY
      ==================================================== */}

      <section className="admin-mid-grid">


        {/* ==================================================
            RECENT ORDERS
        ================================================== */}

        <div className="card admin-orders">

          <div className="admin-section-header">

            <div>

              <h3>
                Recent Orders
              </h3>


              <span>
                Latest customer orders
              </span>

            </div>


            <button
              type="button"
              className="admin-view-btn"
              onClick={() =>
                goTo(
                  '/admin/orders'
                )
              }
            >

              View All

              <Icon
                name="chevron-right"
                size={14}
              />

            </button>

          </div>


          {recentOrders.length >
          0 ? (

            <div className="admin-table-wrapper">

              <table className="dashboard-table">

                <thead>

                  <tr>

                    <th>
                      Order ID
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
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {recentOrders.map(
                    (order) => (

                      <tr
                        key={
                          order.databaseId ||
                          order.id
                        }
                        className="admin-clickable-row"
                        onClick={() =>
                          handleOrderClick(
                            order
                          )
                        }
                      >

                        <td>

                          <strong>
                            {order.id}
                          </strong>

                        </td>


                        <td>

                          {order.customer}

                          <br />


                          <small
                            className={
                              `admin-priority priority-${order.priority.toLowerCase()}`
                            }
                          >

                            {order.priority}
                            {' '}
                            priority

                          </small>

                        </td>


                        <td>
                          {order.date}
                        </td>


                        <td>

                          <strong>
                            {order.amount}
                          </strong>

                        </td>


                        <td>

                          <span
                            className={
                              `badge ${
                                statusClass[
                                  order.status
                                ] ||
                                'badge-navy'
                              }`
                            }
                          >

                            {order.status}

                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          ) : (

            <div className="admin-dashboard-empty">

              <Icon
                name="cart"
                size={30}
              />

              <strong>
                No orders yet
              </strong>

              <span>
                Customer orders will appear
                here after they are placed.
              </span>

            </div>

          )}

        </div>


        {/* ==================================================
            INVENTORY ALERTS
        ================================================== */}

        <div className="card admin-alerts">

          <div className="admin-section-header">

            <div>

              <h3>

                <Icon
                  name="package"
                  size={18}
                />

                Inventory Alerts

              </h3>


              <p>
                Products requiring attention
              </p>

            </div>

          </div>


          {inventoryAlerts.length >
          0 ? (

            <div className="admin-alert-list">

              {inventoryAlerts.map(
                (item) => {

                  const safeTotal =
                    Math.max(
                      Number(
                        item.total ||
                        1
                      ),
                      1
                    );


                  const percentage =
                    Math.min(
                      100,
                      Math.max(
                        0,
                        (
                          item.left /
                          safeTotal
                        ) *
                        100
                      )
                    );


                  return (

                    <button
                      key={
                        item.id ||
                        item.sku
                      }
                      type="button"
                      className="admin-alert-item"
                      onClick={() =>
                        goTo(
                          '/admin/inventory'
                        )
                      }
                    >

                      <div className="admin-alert-top">

                        <strong>
                          {item.name}
                        </strong>


                        <span>
                          {item.left}
                          /
                          {safeTotal}
                        </span>

                      </div>


                      <small>
                        {item.sku}
                      </small>


                      <div className="admin-bar">

                        <div
                          className="admin-bar-fill warn"
                          style={{
                            width:
                              `${percentage}%`,
                          }}
                        />

                      </div>

                    </button>

                  );

                }
              )}

            </div>

          ) : (

            <div className="admin-dashboard-empty">

              <Icon
                name="package"
                size={28}
              />

              <strong>
                Inventory healthy
              </strong>

              <span>
                No low-stock products are
                currently reported.
              </span>

            </div>

          )}


          <button
            type="button"
            className="btn btn-primary btn-block btn-sm"
            onClick={() =>
              goTo(
                '/admin/inventory'
              )
            }
          >

            <Icon
              name="package"
              size={15}
            />

            Manage Inventory

          </button>

        </div>

      </section>


      {/* ====================================================
          BUSINESS SUMMARY
      ==================================================== */}

      <section className="admin-summary-grid">

        {businessSummary.map(
          (item) => (

            <button
              key={item.label}
              type="button"
              className="card admin-summary-card"
              onClick={() =>
                goTo(
                  item.route
                )
              }
            >

              <div className="admin-summary-icon">

                <Icon
                  name={item.icon}
                  size={20}
                />

              </div>


              <div>

                <strong>
                  {item.value}
                </strong>


                <span>
                  {item.label}
                </span>

              </div>

            </button>

          )
        )}

      </section>


      {/* ====================================================
          MANAGEMENT LINKS
      ==================================================== */}

      <section className="admin-management-links">

        {managementLinks.map(
          (item) => (

            <button
              key={item.label}
              type="button"
              onClick={() =>
                goTo(
                  item.route
                )
              }
            >

              <Icon
                name={item.icon}
                size={17}
              />


              {item.label}

            </button>

          )
        )}

      </section>

    </div>

  );

}