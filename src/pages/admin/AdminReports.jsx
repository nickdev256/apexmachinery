import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import { products } from '../../data/products';
import './AdminReports.css';


// ============================================================
// APEX MACHINERY
// ADMIN REPORTS
// ============================================================

const monthlyRevenue = [
  { month: 'Jan', revenue: 82000000, orders: 84 },
  { month: 'Feb', revenue: 96000000, orders: 102 },
  { month: 'Mar', revenue: 110000000, orders: 118 },
  { month: 'Apr', revenue: 124000000, orders: 131 },
  { month: 'May', revenue: 138000000, orders: 146 },
  { month: 'Jun', revenue: 151000000, orders: 158 },
  { month: 'Jul', revenue: 176000000, orders: 181 },
];

const orderStatuses = [
  { name: 'Delivered', value: 58 },
  { name: 'Processing', value: 18 },
  { name: 'Shipped', value: 15 },
  { name: 'Pending', value: 7 },
  { name: 'Cancelled', value: 2 },
];

const topCustomers = [
  {
    name: 'Webb Steelworks',
    orders: 28,
    revenue: 184500000,
  },
  {
    name: 'Alvarez Fabrication',
    orders: 21,
    revenue: 156800000,
  },
  {
    name: 'Kampala Industrial Works',
    orders: 19,
    revenue: 132400000,
  },
  {
    name: 'Precision Engineering',
    orders: 16,
    revenue: 98700000,
  },
  {
    name: 'Nair Manufacturing',
    orders: 14,
    revenue: 82400000,
  },
];


// ============================================================
// COMPONENT
// ============================================================

export default function AdminReports() {
  const navigate = useNavigate();

  const [period, setPeriod] =
    useState('7');

  const [reportType, setReportType] =
    useState('overview');

  // ==========================================================
  // PRODUCT STATISTICS
  // ==========================================================

  const productStats = useMemo(() => {
    const total = products.length;

    const inStock = products.filter(
      (product) =>
        Number(product.stock || 0) > 0
    ).length;

    const outOfStock =
      total - inStock;

    const units = products.reduce(
      (sum, product) =>
        sum +
        Number(product.stock || 0),
      0
    );

    return {
      total,
      inStock,
      outOfStock,
      units,
    };
  }, []);

  // ==========================================================
  // PERIOD MULTIPLIER
  // ==========================================================

  const periodMultiplier =
    period === '30'
      ? 1.35
      : period === '90'
        ? 2.1
        : period === '365'
          ? 8.4
          : 1;

  // ==========================================================
  // REPORT TOTALS
  // ==========================================================

  const totals = useMemo(() => {
    const baseRevenue = 877000000;
    const baseOrders = 920;
    const baseCustomers = 384;

    return {
      revenue:
        baseRevenue *
        periodMultiplier,

      orders: Math.round(
        baseOrders *
        periodMultiplier
      ),

      customers: Math.round(
        baseCustomers *
        periodMultiplier
      ),

      averageOrder:
        (baseRevenue *
          periodMultiplier) /
        Math.max(
          1,
          baseOrders *
            periodMultiplier
        ),
    };
  }, [periodMultiplier]);

  // ==========================================================
  // FORMAT CURRENCY
  // ==========================================================

  const formatCurrency = (value) => {
    return `UGX ${Number(
      value || 0
    ).toLocaleString()}`;
  };

  const formatCompactCurrency = (
    value
  ) => {
    const number = Number(value || 0);

    if (number >= 1000000000) {
      return `UGX ${(number / 1000000000).toFixed(1)}B`;
    }

    if (number >= 1000000) {
      return `UGX ${(number / 1000000).toFixed(1)}M`;
    }

    if (number >= 1000) {
      return `UGX ${(number / 1000).toFixed(0)}K`;
    }

    return `UGX ${number.toLocaleString()}`;
  };

  // ==========================================================
  // MAX REVENUE
  // ==========================================================

  const maxRevenue =
    Math.max(
      ...monthlyRevenue.map(
        (item) => item.revenue
      )
    );

  // ==========================================================
  // PRINT REPORT
  // ==========================================================

  const handlePrint = () => {
    window.print();
  };

  // ==========================================================
  // CSV EXPORT
  // ==========================================================

  const handleExport = () => {
    const rows = [
      [
        'Month',
        'Revenue',
        'Orders',
      ],
      ...monthlyRevenue.map(
        (item) => [
          item.month,
          item.revenue,
          item.orders,
        ]
      ),
    ];

    const csv = rows
      .map((row) =>
        row.join(',')
      )
      .join('\n');

    const blob = new Blob(
      [csv],
      {
        type: 'text/csv;charset=utf-8;',
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement('a');

    link.href = url;

    link.download =
      'apex-machinery-report.csv';

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="admin-reports-page">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="admin-page-header">

        <div>

          <button
            type="button"
            className="admin-back-button"
            onClick={() =>
              navigate('/admin')
            }
          >
            <Icon
              name="arrow-left"
              size={17}
            />

            Back to Dashboard
          </button>

          <span className="eyebrow">
            Business Intelligence
          </span>

          <h1>
            Reports & Analytics
          </h1>

          <p>
            Monitor revenue, orders,
            customers and inventory
            performance.
          </p>

        </div>

        <div className="admin-report-actions">

          <button
            type="button"
            className="btn btn-outline-navy"
            onClick={handlePrint}
          >
            <Icon
              name="eye"
              size={16}
            />

            Print Report
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleExport}
          >
            <Icon
              name="package"
              size={16}
            />

            Export CSV
          </button>

        </div>

      </div>


      {/* ====================================================
          FILTER BAR
      ==================================================== */}

      <div className="card admin-reports-filter">

        <div className="report-filter-group">

          <label>
            Report Period
          </label>

          <select
            value={period}
            onChange={(event) =>
              setPeriod(
                event.target.value
              )
            }
          >

            <option value="7">
              Last 7 Days
            </option>

            <option value="30">
              Last 30 Days
            </option>

            <option value="90">
              Last 90 Days
            </option>

            <option value="365">
              Last 12 Months
            </option>

          </select>

        </div>


        <div className="report-filter-group">

          <label>
            Report Type
          </label>

          <select
            value={reportType}
            onChange={(event) =>
              setReportType(
                event.target.value
              )
            }
          >

            <option value="overview">
              Business Overview
            </option>

            <option value="sales">
              Sales Report
            </option>

            <option value="orders">
              Order Report
            </option>

            <option value="inventory">
              Inventory Report
            </option>

            <option value="customers">
              Customer Report
            </option>

          </select>

        </div>

        <div className="report-period-info">

          <Icon
            name="clock"
            size={16}
          />

          <span>
            Report generated:
            {' '}
            {new Date().toLocaleDateString()}
          </span>

        </div>

      </div>


      {/* ====================================================
          REPORT STATS
      ==================================================== */}

      <div className="admin-report-stats">

        <div className="card admin-report-stat">

          <div className="report-stat-icon">
            <Icon
              name="bolt"
              size={20}
            />
          </div>

          <div>

            <span>
              Total Revenue
            </span>

            <strong>
              {formatCompactCurrency(
                totals.revenue
              )}
            </strong>

            <small className="report-positive">
              +12.5% vs previous period
            </small>

          </div>

        </div>


        <div className="card admin-report-stat">

          <div className="report-stat-icon">
            <Icon
              name="cart"
              size={20}
            />
          </div>

          <div>

            <span>
              Total Orders
            </span>

            <strong>
              {totals.orders.toLocaleString()}
            </strong>

            <small className="report-positive">
              +8.4% vs previous period
            </small>

          </div>

        </div>


        <div className="card admin-report-stat">

          <div className="report-stat-icon">
            <Icon
              name="user"
              size={20}
            />
          </div>

          <div>

            <span>
              Customers
            </span>

            <strong>
              {totals.customers.toLocaleString()}
            </strong>

            <small className="report-positive">
              +6.7% vs previous period
            </small>

          </div>

        </div>


        <div className="card admin-report-stat">

          <div className="report-stat-icon">
            <Icon
              name="package"
              size={20}
            />
          </div>

          <div>

            <span>
              Average Order
            </span>

            <strong>
              {formatCompactCurrency(
                totals.averageOrder
              )}
            </strong>

            <small className="report-positive">
              +4.2% vs previous period
            </small>

          </div>

        </div>

      </div>


      {/* ====================================================
          SALES PERFORMANCE
      ==================================================== */}

      <div className="admin-reports-grid">


        <div className="card admin-sales-report">

          <div className="admin-report-section-header">

            <div>

              <h3>
                Revenue Performance
              </h3>

              <p>
                Monthly revenue and order
                activity.
              </p>

            </div>

            <span className="report-period-badge">
              2026
            </span>

          </div>


          <div className="report-chart">

            <div className="report-y-axis">

              <span>
                {formatCompactCurrency(
                  maxRevenue
                )}
              </span>

              <span>
                UGX 100M
              </span>

              <span>
                UGX 50M
              </span>

              <span>
                UGX 0
              </span>

            </div>


            <div className="report-bars">

              {monthlyRevenue.map(
                (item) => {

                  const height =
                    (item.revenue /
                      maxRevenue) *
                    100;

                  return (
                    <div
                      className="report-bar-column"
                      key={item.month}
                    >

                      <div className="report-bar-value">
                        {formatCompactCurrency(
                          item.revenue
                        )}
                      </div>

                      <div className="report-bar-track">

                        <div
                          className="report-bar"
                          style={{
                            height:
                              `${height}%`,
                          }}
                        />

                      </div>

                      <span>
                        {item.month}
                      </span>

                      <small>
                        {item.orders}
                        {' '}orders
                      </small>

                    </div>
                  );
                }
              )}

            </div>

          </div>

        </div>


        {/* ==================================================
            ORDER STATUS
        ================================================== */}

        <div className="card admin-order-report">

          <div className="admin-report-section-header">

            <div>

              <h3>
                Order Status
              </h3>

              <p>
                Current order distribution.
              </p>

            </div>

          </div>


          <div className="order-status-list">

            {orderStatuses.map(
              (status) => (

                <div
                  className="order-status-row"
                  key={status.name}
                >

                  <div className="order-status-label">

                    <span>
                      {status.name}
                    </span>

                    <strong>
                      {status.value}%
                    </strong>

                  </div>

                  <div className="report-progress">

                    <div
                      className={`report-progress-fill ${status.name
                        .toLowerCase()
                        .replace(
                          /\s+/g,
                          '-'
                        )}`}
                      style={{
                        width:
                          `${status.value}%`,
                      }}
                    />

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      </div>


      {/* ====================================================
          CUSTOMER + INVENTORY
      ==================================================== */}

      <div className="admin-reports-grid">


        {/* TOP CUSTOMERS */}

        <div className="card admin-top-customers">

          <div className="admin-report-section-header">

            <div>

              <h3>
                Top Customers
              </h3>

              <p>
                Highest-value customers
                by revenue.
              </p>

            </div>

            <button
              type="button"
              className="report-link"
              onClick={() =>
                navigate(
                  '/admin/customers'
                )
              }
            >
              View Customers
            </button>

          </div>


          <div className="customer-report-list">

            {topCustomers.map(
              (customer, index) => (

                <div
                  className="customer-report-row"
                  key={customer.name}
                >

                  <div className="customer-rank">
                    {index + 1}
                  </div>

                  <div className="customer-report-info">

                    <strong>
                      {customer.name}
                    </strong>

                    <span>
                      {customer.orders}
                      {' '}orders
                    </span>

                  </div>

                  <strong>
                    {formatCompactCurrency(
                      customer.revenue
                    )}
                  </strong>

                </div>

              )
            )}

          </div>

        </div>


        {/* INVENTORY REPORT */}

        <div className="card admin-inventory-report">

          <div className="admin-report-section-header">

            <div>

              <h3>
                Inventory Overview
              </h3>

              <p>
                Current catalogue stock
                health.
              </p>

            </div>

            <button
              type="button"
              className="report-link"
              onClick={() =>
                navigate(
                  '/admin/inventory'
                )
              }
            >
              Manage Inventory
            </button>

          </div>


          <div className="inventory-report-main">

            <div className="inventory-circle">

              <strong>
                {productStats.total}
              </strong>

              <span>
                Products
              </span>

            </div>


            <div className="inventory-report-details">

              <div>

                <span className="inventory-dot in" />

                <div>
                  <strong>
                    {productStats.inStock}
                  </strong>

                  <small>
                    In Stock
                  </small>
                </div>

              </div>


              <div>

                <span className="inventory-dot out" />

                <div>
                  <strong>
                    {productStats.outOfStock}
                  </strong>

                  <small>
                    Out of Stock
                  </small>
                </div>

              </div>


              <div>

                <span className="inventory-dot units" />

                <div>
                  <strong>
                    {productStats.units.toLocaleString()}
                  </strong>

                  <small>
                    Total Units
                  </small>
                </div>

              </div>

            </div>

          </div>


          <div className="inventory-health">

            <div className="inventory-health-header">

              <span>
                Inventory Health
              </span>

              <strong>
                {productStats.total > 0
                  ? Math.round(
                      (productStats.inStock /
                        productStats.total) *
                        100
                    )
                  : 0}
                %
              </strong>

            </div>

            <div className="report-progress">

              <div
                className="report-progress-fill inventory"
                style={{
                  width:
                    `${
                      productStats.total > 0
                        ? Math.round(
                            (productStats.inStock /
                              productStats.total) *
                              100
                          )
                        : 0
                    }%`,
                }}
              />

            </div>

          </div>

        </div>

      </div>


      {/* ====================================================
          REPORT SUMMARY
      ==================================================== */}

      <div className="card admin-report-summary">

        <div>

          <span className="eyebrow">
            Report Summary
          </span>

          <h3>
            Apex Machinery Performance
          </h3>

          <p>
            Your business generated{' '}
            <strong>
              {formatCompactCurrency(
                totals.revenue
              )}
            </strong>{' '}
            in revenue across{' '}
            <strong>
              {totals.orders.toLocaleString()}
            </strong>{' '}
            orders during the selected
            reporting period.
          </p>

        </div>

        <div className="summary-actions">

          <button
            type="button"
            className="btn btn-outline-navy"
            onClick={() =>
              navigate('/admin/orders')
            }
          >
            <Icon
              name="cart"
              size={16}
            />

            View Orders
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleExport}
          >
            <Icon
              name="package"
              size={16}
            />

            Download Report
          </button>

        </div>

      </div>

    </div>
  );
}