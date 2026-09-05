import {
  useMemo,
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import Icon from '../../components/Icon';

import './AdminDashboard.css';


// ============================================================
// DASHBOARD STATISTICS
// ============================================================

const stats = [
  {
    label: 'Total Revenue',
    value: 'UGX 1.28B',
    change: '+12.5%',
    up: true,
    icon: 'bolt',
    route: '/admin/reports',
  },

  {
    label: 'Active Orders',
    value: '482',
    change: '+5.2%',
    up: true,
    icon: 'cart',
    route: '/admin/orders',
  },

  {
    label: 'Inventory Value',
    value: 'UGX 4.2B',
    change: '-2.1%',
    up: false,
    icon: 'package',
    route: '/admin/inventory',
  },

  {
    label: 'Avg. Lead Time',
    value: '4.2 Days',
    change: '+0.8%',
    up: true,
    icon: 'truck',
    route: '/admin/reports',
  },
];


// ============================================================
// RECENT ORDERS
// ============================================================

const recentOrders = [
  {
    id: '#APX-9921',
    customer: 'Webb Steelworks',
    date: '2026-07-24',
    amount: 'UGX 45,200,000',
    status: 'Delivered',
    priority: 'High',
  },

  {
    id: '#APX-9920',
    customer: 'Nair Manufacturing',
    date: '2026-07-23',
    amount: 'UGX 15,800,000',
    status: 'Processing',
    priority: 'Medium',
  },

  {
    id: '#APX-9919',
    customer: 'Alvarez Fabrication',
    date: '2026-07-23',
    amount: 'UGX 98,500,000',
    status: 'Pending',
    priority: 'Urgent',
  },

  {
    id: '#APX-9918',
    customer: 'Global Trade Hub',
    date: '2026-07-22',
    amount: 'UGX 4,600,000',
    status: 'Shipped',
    priority: 'Low',
  },

  {
    id: '#APX-9917',
    customer: 'Precision Engineering',
    date: '2026-07-21',
    amount: 'UGX 27,400,000',
    status: 'Processing',
    priority: 'Medium',
  },
];


// ============================================================
// CATEGORY DISTRIBUTION
// ============================================================

const categoryDist = [
  {
    name: 'Industrial Machinery',
    pct: 35,
  },

  {
    name: 'Generators',
    pct: 22,
  },

  {
    name: 'Power Tools',
    pct: 18,
  },

  {
    name: 'Construction Equipment',
    pct: 12,
  },

  {
    name: 'Kitchen & Laundry',
    pct: 8,
  },

  {
    name: 'Safety Equipment',
    pct: 5,
  },
];


// ============================================================
// INVENTORY ALERTS
// ============================================================

const inventoryAlerts = [
  {
    name: 'Industrial Diesel Generator 250 kVA',
    sku: 'GEN-250KVA',
    left: 2,
    total: 5,
  },

  {
    name: 'Heavy Duty Air Compressor',
    sku: 'CMP-HDA-001',
    left: 3,
    total: 10,
  },

  {
    name: 'Rotary Hammer SDS-Plus Pro',
    sku: 'PWR-RHP-001',
    left: 5,
    total: 20,
  },
];


// ============================================================
// STATUS STYLES
// ============================================================

const statusClass = {
  Delivered: 'badge-instock',
  Processing: 'badge-navy',
  Pending: 'badge-limited',
  Shipped: 'badge-gold',
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
// SALES DATA
// ============================================================

const salesData = {

  6: {
    labels: [
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
    ],

    points: [
      [0, 170],
      [120, 150],
      [240, 155],
      [360, 115],
      [480, 85],
      [600, 45],
    ],
  },


  12: {
    labels: [
      'Oct',
      'Nov',
      'Dec',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
    ],

    points: [
      [0, 180],
      [55, 170],
      [110, 160],
      [165, 168],
      [220, 145],
      [275, 150],
      [330, 130],
      [385, 120],
      [440, 100],
      [495, 90],
      [550, 65],
      [600, 45],
    ],
  },

};


// ============================================================
// BUSINESS SUMMARY
// ============================================================

const businessSummary = [
  {
    value: '1,280',
    label: 'Orders this month',
    icon: 'cart',
    route: '/admin/orders',
  },

  {
    value: '3,240',
    label: 'Active customers',
    icon: 'user',
    route: '/admin/customers',
  },

  {
    value: '42,000+',
    label: 'Products in catalog',
    icon: 'package',
    route: '/admin/products',
  },

  {
    value: '94.8%',
    label: 'On-time deliveries',
    icon: 'truck',
    route: '/admin/reports',
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
// ADMIN DASHBOARD
// ============================================================

export default function AdminDashboard() {

  const navigate =
    useNavigate();


  const [
    period,
    setPeriod,
  ] =
    useState('6');


  // ==========================================================
  // CURRENT SALES DATA
  // ==========================================================

  const currentSales =
    useMemo(
      () =>
        salesData[
          period
        ] ||
        salesData['6'],
      [period]
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
    `${linePoints} 600,220 0,220`;


  // ==========================================================
  // NAVIGATE
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
            order.id,
        },
      }
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


          {/* NOTIFICATIONS */}

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


            <span
              className="notification-dot"
              aria-hidden="true"
            />

          </button>


          {/* NEW PROCUREMENT */}

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


                <span
                  className={
                    stat.up
                      ? 'admin-up'
                      : 'admin-down'
                  }
                >

                  {stat.change}

                </span>

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
                Monthly revenue performance
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
                points={areaPoints}
              />


              <polyline
                fill="none"
                stroke="#0B1F4D"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={linePoints}
              />


              {currentSales.points.map(
                ([cx, cy]) => (

                  <circle
                    key={`${cx}-${cy}`}
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

            {currentSales.labels.map(
              (label) => (

                <span key={label}>
                  {label}
                </span>

              )
            )}

          </div>


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


          <div className="admin-category-list">

            {categoryDist.map(
              (category) => (

                <button
                  key={category.name}
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
                      {category.pct}%
                    </strong>

                  </div>


                  <div className="admin-bar">

                    <div
                      className="admin-bar-fill"
                      style={{
                        width:
                          `${category.pct}%`,
                      }}
                    />

                  </div>

                </button>

              )
            )}

          </div>


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
                Showing 5 recent orders
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
                      key={order.id}
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


          <div className="admin-alert-list">

            {inventoryAlerts.map(
              (item) => {

                const percentage =
                  Math.min(
                    100,
                    Math.max(
                      0,
                      (
                        item.left /
                        item.total
                      ) * 100
                    )
                  );


                return (

                  <button
                    key={item.sku}
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
                        {item.total}
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