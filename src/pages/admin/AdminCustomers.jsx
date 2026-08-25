import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import './AdminCustomers.css';

// ============================================================
// INITIAL CUSTOMERS
// ============================================================

const initialCustomers = [
  {
    id: 'CUS-001',
    name: 'Webb Steelworks',
    contact: 'Marcus Webb',
    email: 'procurement@webbsteelworks.com',
    phone: '+256 701 245 890',
    location: 'Kampala, Uganda',
    orders: 24,
    spent: 452000000,
    status: 'Active',
    joined: '2025-02-14',
  },
  {
    id: 'CUS-002',
    name: 'Nair Manufacturing',
    contact: 'Priya Nair',
    email: 'purchasing@nairmanufacturing.com',
    phone: '+256 702 338 412',
    location: 'Jinja, Uganda',
    orders: 18,
    spent: 185000000,
    status: 'Active',
    joined: '2025-04-21',
  },
  {
    id: 'CUS-003',
    name: 'Alvarez Fabrication',
    contact: 'Diego Alvarez',
    email: 'orders@alvarezfab.com',
    phone: '+256 703 452 871',
    location: 'Kampala, Uganda',
    orders: 31,
    spent: 328000000,
    status: 'Active',
    joined: '2024-11-08',
  },
  {
    id: 'CUS-004',
    name: 'Global Trade Hub',
    contact: 'Daniel Okello',
    email: 'procurement@globaltrade.ug',
    phone: '+256 704 781 225',
    location: 'Entebbe, Uganda',
    orders: 9,
    spent: 64000000,
    status: 'Inactive',
    joined: '2025-07-19',
  },
  {
    id: 'CUS-005',
    name: 'Precision Engineering',
    contact: 'James Kato',
    email: 'admin@precisionengineering.ug',
    phone: '+256 705 112 430',
    location: 'Mukono, Uganda',
    orders: 15,
    spent: 127000000,
    status: 'Active',
    joined: '2025-01-30',
  },
];

// ============================================================
// FORMAT CURRENCY
// ============================================================

function formatCurrency(amount) {
  return `UGX ${Number(
    amount || 0
  ).toLocaleString()}`;
}

// ============================================================
// ADMIN CUSTOMERS
// ============================================================

export default function AdminCustomers() {
  const navigate = useNavigate();

  // ==========================================================
  // STATE
  // ==========================================================

  const [customers, setCustomers] =
    useState(initialCustomers);

  const [search, setSearch] =
    useState('');

  const [statusFilter, setStatusFilter] =
    useState('All');

  const [showModal, setShowModal] =
    useState(false);

  const [editingCustomer, setEditingCustomer] =
    useState(null);

  const [selectedCustomer, setSelectedCustomer] =
    useState(null);

  const [form, setForm] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    location: '',
    status: 'Active',
  });

  // ==========================================================
  // FILTER CUSTOMERS
  // ==========================================================

  const filteredCustomers = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch =
        !query ||
        String(customer.name || '')
          .toLowerCase()
          .includes(query) ||
        String(customer.contact || '')
          .toLowerCase()
          .includes(query) ||
        String(customer.email || '')
          .toLowerCase()
          .includes(query) ||
        String(customer.phone || '')
          .toLowerCase()
          .includes(query) ||
        String(customer.location || '')
          .toLowerCase()
          .includes(query) ||
        String(customer.id || '')
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === 'All' ||
        customer.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    customers,
    search,
    statusFilter,
  ]);

  // ==========================================================
  // STATISTICS
  // ==========================================================

  const totalCustomers =
    customers.length;

  const activeCustomers =
    customers.filter(
      (customer) =>
        customer.status === 'Active'
    ).length;

  const inactiveCustomers =
    customers.filter(
      (customer) =>
        customer.status === 'Inactive'
    ).length;

  const totalOrders =
    customers.reduce(
      (total, customer) =>
        total +
        Number(customer.orders || 0),
      0
    );

  const totalRevenue =
    customers.reduce(
      (total, customer) =>
        total +
        Number(customer.spent || 0),
      0
    );

  // ==========================================================
  // ADD CUSTOMER
  // ==========================================================

  const handleAdd = () => {
    setEditingCustomer(null);

    setForm({
      name: '',
      contact: '',
      email: '',
      phone: '',
      location: '',
      status: 'Active',
    });

    setShowModal(true);
  };

  // ==========================================================
  // EDIT CUSTOMER
  // ==========================================================

  const handleEdit = (customer) => {
    setEditingCustomer(customer);

    setForm({
      name: customer.name || '',
      contact: customer.contact || '',
      email: customer.email || '',
      phone: customer.phone || '',
      location: customer.location || '',
      status:
        customer.status || 'Active',
    });

    setShowModal(true);
  };

  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================================
  // SAVE CUSTOMER
  // ==========================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.contact.trim() ||
      !form.email.trim()
    ) {
      window.alert(
        'Please complete the required customer fields.'
      );

      return;
    }

    // EDIT
    if (editingCustomer) {
      setCustomers((previous) =>
        previous.map((customer) =>
          customer.id ===
          editingCustomer.id
            ? {
                ...customer,
                name:
                  form.name.trim(),
                contact:
                  form.contact.trim(),
                email:
                  form.email.trim(),
                phone:
                  form.phone.trim(),
                location:
                  form.location.trim(),
                status:
                  form.status,
              }
            : customer
        )
      );

      setSelectedCustomer(null);
      closeModal();

      return;
    }

    // CREATE
    const highestNumber =
      customers.reduce(
        (highest, customer) => {
          const number =
            Number(
              String(customer.id)
                .replace('CUS-', '')
            ) || 0;

          return Math.max(
            highest,
            number
          );
        },
        0
      );

    const newCustomer = {
      id: `CUS-${String(
        highestNumber + 1
      ).padStart(3, '0')}`,

      name:
        form.name.trim(),

      contact:
        form.contact.trim(),

      email:
        form.email.trim(),

      phone:
        form.phone.trim(),

      location:
        form.location.trim(),

      status:
        form.status,

      orders: 0,

      spent: 0,

      joined:
        new Date()
          .toISOString()
          .split('T')[0],
    };

    setCustomers((previous) => [
      newCustomer,
      ...previous,
    ]);

    closeModal();
  };

  // ==========================================================
  // DELETE CUSTOMER
  // ==========================================================

  const handleDelete = (customer) => {
    const confirmed =
      window.confirm(
        `Delete ${customer.name}?\n\nThis action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    setCustomers((previous) =>
      previous.filter(
        (item) =>
          item.id !== customer.id
      )
    );

    setSelectedCustomer(null);
  };

  // ==========================================================
  // TOGGLE STATUS
  // ==========================================================

  const toggleStatus = (customer) => {
    const newStatus =
      customer.status === 'Active'
        ? 'Inactive'
        : 'Active';

    setCustomers((previous) =>
      previous.map((item) =>
        item.id === customer.id
          ? {
              ...item,
              status: newStatus,
            }
          : item
      )
    );

    setSelectedCustomer((previous) =>
      previous &&
      previous.id === customer.id
        ? {
            ...previous,
            status: newStatus,
          }
        : previous
    );
  };

  // ==========================================================
  // VIEW CUSTOMER
  // ==========================================================

  const handleView = (customer) => {
    setSelectedCustomer(customer);
  };

  // ==========================================================
  // CLOSE FORM MODAL
  // ==========================================================

  const closeModal = () => {
    setShowModal(false);
    setEditingCustomer(null);
  };

  // ==========================================================
  // CLOSE DETAILS
  // ==========================================================

  const closeDetails = () => {
    setSelectedCustomer(null);
  };

  // ==========================================================
  // CLEAR FILTERS
  // ==========================================================

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('All');
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="admin-customers-page">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="admin-page-header">

        <div className="admin-customers-header-left">

          {/* BACK BUTTON */}

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

            <span>
              Back to Dashboard
            </span>
          </button>

          <span className="eyebrow">
            Customer Management
          </span>

          <h1>
            Customers
          </h1>

          <p>
            Manage Apex Machinery customers,
            accounts and procurement activity.
          </p>

        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAdd}
        >
          <Icon
            name="plus"
            size={16}
          />

          Add Customer
        </button>

      </div>

      {/* ====================================================
          STATISTICS
      ==================================================== */}

      <div className="admin-customer-stats">

        <div className="card admin-customer-stat">

          <div className="admin-customer-stat-icon">
            <Icon
              name="user"
              size={20}
            />
          </div>

          <div>
            <strong>
              {totalCustomers}
            </strong>

            <span>
              Total Customers
            </span>
          </div>

        </div>

        <div className="card admin-customer-stat">

          <div className="admin-customer-stat-icon">
            <Icon
              name="check"
              size={20}
            />
          </div>

          <div>
            <strong>
              {activeCustomers}
            </strong>

            <span>
              Active Customers
            </span>
          </div>

        </div>

        <div className="card admin-customer-stat">

          <div className="admin-customer-stat-icon">
            <Icon
              name="clock"
              size={20}
            />
          </div>

          <div>
            <strong>
              {inactiveCustomers}
            </strong>

            <span>
              Inactive Customers
            </span>
          </div>

        </div>

        <div className="card admin-customer-stat">

          <div className="admin-customer-stat-icon">
            <Icon
              name="cart"
              size={20}
            />
          </div>

          <div>
            <strong>
              {totalOrders}
            </strong>

            <span>
              Total Orders
            </span>
          </div>

        </div>

        <div className="card admin-customer-stat customer-revenue-stat">

          <div className="admin-customer-stat-icon">
            <Icon
              name="bolt"
              size={20}
            />
          </div>

          <div>
            <strong>
              {formatCurrency(
                totalRevenue
              )}
            </strong>

            <span>
              Customer Revenue
            </span>
          </div>

        </div>

      </div>

      {/* ====================================================
          CUSTOMER TABLE
      ==================================================== */}

      <div className="card admin-customers-container">

        {/* TOOLBAR */}

        <div className="admin-customers-toolbar">

          <div className="admin-customer-search">

            <Icon
              name="search"
              size={18}
            />

            <input
              type="search"
              placeholder="Search name, company, email, phone or ID..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

            {search && (
              <button
                type="button"
                className="admin-search-clear"
                onClick={() =>
                  setSearch('')
                }
              >
                ×
              </button>
            )}

          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          >

            <option value="All">
              All Customers
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>

          </select>

          {(search ||
            statusFilter !== 'All') && (
            <button
              type="button"
              className="admin-clear-filter"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          )}

          <span className="admin-customer-count">
            Showing{' '}
            {filteredCustomers.length}{' '}
            of {customers.length}
          </span>

        </div>

        {/* TABLE */}

        <div className="admin-table-wrapper">

          <table className="dashboard-table">

            <thead>
              <tr>

                <th>
                  Customer
                </th>

                <th>
                  Contact
                </th>

                <th>
                  Location
                </th>

                <th>
                  Orders
                </th>

                <th>
                  Total Spent
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

              {filteredCustomers.length ===
              0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="admin-empty"
                  >

                    <Icon
                      name="search"
                      size={30}
                    />

                    <strong>
                      No customers found
                    </strong>

                    <span>
                      Try changing your
                      search or filter.
                    </span>

                    <button
                      type="button"
                      className="admin-empty-button"
                      onClick={
                        clearFilters
                      }
                    >
                      Clear Filters
                    </button>

                  </td>

                </tr>

              ) : (

                filteredCustomers.map(
                  (customer) => (

                    <tr
                      key={customer.id}
                    >

                      {/* CUSTOMER */}

                      <td>

                        <div className="admin-customer-name">

                          <div className="admin-customer-avatar">
                            {customer.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>

                            <strong>
                              {customer.name}
                            </strong>

                            <small>
                              {customer.id}
                            </small>

                          </div>

                        </div>

                      </td>

                      {/* CONTACT */}

                      <td>

                        <strong>
                          {customer.contact}
                        </strong>

                        <small className="admin-customer-email">
                          {customer.email}
                        </small>

                        <small>
                          {customer.phone ||
                            'No phone'}
                        </small>

                      </td>

                      {/* LOCATION */}

                      <td>
                        {customer.location ||
                          'Not provided'}
                      </td>

                      {/* ORDERS */}

                      <td>

                        <strong>
                          {Number(
                            customer.orders ||
                              0
                          )}
                        </strong>

                      </td>

                      {/* SPENT */}

                      <td>

                        <strong>
                          {formatCurrency(
                            customer.spent
                          )}
                        </strong>

                      </td>

                      {/* STATUS */}

                      <td>

                        <button
                          type="button"
                          className={`admin-customer-status ${
                            customer.status ===
                            'Active'
                              ? 'active'
                              : 'inactive'
                          }`}
                          onClick={() =>
                            toggleStatus(
                              customer
                            )
                          }
                          title={`Click to make ${
                            customer.status ===
                            'Active'
                              ? 'Inactive'
                              : 'Active'
                          }`}
                        >

                          <span />

                          {customer.status}

                        </button>

                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div className="admin-customer-actions">

                          <button
                            type="button"
                            title="View customer"
                            className="admin-action-btn"
                            onClick={() =>
                              handleView(
                                customer
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
                            title="Edit customer"
                            className="admin-action-btn"
                            onClick={() =>
                              handleEdit(
                                customer
                              )
                            }
                          >
                            <Icon
                              name="edit"
                              size={16}
                            />
                          </button>

                          <button
                            type="button"
                            title="Delete customer"
                            className="admin-action-btn danger"
                            onClick={() =>
                              handleDelete(
                                customer
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

      </div>

      {/* ====================================================
          ADD / EDIT CUSTOMER MODAL
      ==================================================== */}

      {showModal && (

        <div
          className="admin-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="admin-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="admin-modal-header">

              <div>

                <span className="eyebrow">
                  Customer Management
                </span>

                <h2>
                  {editingCustomer
                    ? 'Edit Customer'
                    : 'Add Customer'}
                </h2>

              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={closeModal}
              >
                ×
              </button>

            </div>

            <form
              className="admin-customer-form"
              onSubmit={handleSubmit}
            >

              <div className="admin-form-grid">

                <div className="field">

                  <label>
                    Company Name *
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Company name"
                    required
                  />

                </div>

                <div className="field">

                  <label>
                    Contact Person *
                  </label>

                  <input
                    name="contact"
                    value={form.contact}
                    onChange={handleChange}
                    placeholder="Contact person"
                    required
                  />

                </div>

                <div className="field">

                  <label>
                    Email Address *
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="customer@company.com"
                    required
                  />

                </div>

                <div className="field">

                  <label>
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+256..."
                  />

                </div>

                <div className="field">

                  <label>
                    Location
                  </label>

                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Kampala, Uganda"
                  />

                </div>

                <div className="field">

                  <label>
                    Account Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >

                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>

                  </select>

                </div>

              </div>

              <div className="customer-form-note">

                <Icon
                  name="bolt"
                  size={15}
                />

                <span>
                  New customers start with
                  0 orders and UGX 0 spent.
                </span>

              </div>

              <div className="admin-modal-actions">

                <button
                  type="button"
                  className="btn btn-outline-navy"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                >

                  <Icon
                    name="check"
                    size={16}
                  />

                  {editingCustomer
                    ? 'Save Changes'
                    : 'Create Customer'}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ====================================================
          CUSTOMER DETAILS MODAL
      ==================================================== */}

      {selectedCustomer && (

        <div
          className="admin-modal-overlay"
          onClick={closeDetails}
        >

          <div
            className="admin-modal customer-details-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="admin-modal-header">

              <div>

                <span className="eyebrow">
                  Customer Profile
                </span>

                <h2>
                  {selectedCustomer.name}
                </h2>

              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={closeDetails}
              >
                ×
              </button>

            </div>

            <div className="customer-details">

              <div className="customer-details-top">

                <div className="customer-details-avatar">
                  {selectedCustomer.name
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>

                  <h3>
                    {selectedCustomer.name}
                  </h3>

                  <span>
                    {selectedCustomer.id}
                  </span>

                  <button
                    type="button"
                    className={`admin-customer-status ${
                      selectedCustomer.status ===
                      'Active'
                        ? 'active'
                        : 'inactive'
                    }`}
                    onClick={() =>
                      toggleStatus(
                        selectedCustomer
                      )
                    }
                  >
                    <span />
                    {selectedCustomer.status}
                  </button>

                </div>

              </div>

              <div className="customer-detail-grid">

                <div className="customer-detail-row">

                  <span>
                    Contact Person
                  </span>

                  <strong>
                    {selectedCustomer.contact}
                  </strong>

                </div>

                <div className="customer-detail-row">

                  <span>
                    Email
                  </span>

                  <strong>
                    {selectedCustomer.email}
                  </strong>

                </div>

                <div className="customer-detail-row">

                  <span>
                    Phone
                  </span>

                  <strong>
                    {selectedCustomer.phone ||
                      'Not provided'}
                  </strong>

                </div>

                <div className="customer-detail-row">

                  <span>
                    Location
                  </span>

                  <strong>
                    {selectedCustomer.location ||
                      'Not provided'}
                  </strong>

                </div>

                <div className="customer-detail-row">

                  <span>
                    Total Orders
                  </span>

                  <strong>
                    {selectedCustomer.orders}
                  </strong>

                </div>

                <div className="customer-detail-row">

                  <span>
                    Total Spent
                  </span>

                  <strong>
                    {formatCurrency(
                      selectedCustomer.spent
                    )}
                  </strong>

                </div>

                <div className="customer-detail-row">

                  <span>
                    Customer Since
                  </span>

                  <strong>
                    {selectedCustomer.joined}
                  </strong>

                </div>

              </div>

            </div>

            <div className="admin-modal-actions">

              <button
                type="button"
                className="btn btn-outline-navy"
                onClick={closeDetails}
              >
                Close
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  closeDetails();
                  handleEdit(
                    selectedCustomer
                  );
                }}
              >

                <Icon
                  name="edit"
                  size={16}
                />

                Edit Customer

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}