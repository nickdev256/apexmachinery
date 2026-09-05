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
  getAdminCustomers,
  updateAdminCustomer,
} from '../../services/adminApi';

import './AdminCustomers.css';


// ============================================================
// FORMATTERS
// ============================================================

function formatCurrency(
  amount
) {

  return `UGX ${Number(
    amount || 0
  ).toLocaleString()}`;

}


function formatDate(
  value
) {

  if (!value) {

    return 'Not available';

  }


  const date =
    new Date(
      value
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return String(
      value
    );

  }


  return date.toLocaleDateString(
    undefined,
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


// ============================================================
// ADMIN CUSTOMERS
// ============================================================

export default function AdminCustomers() {

  const navigate =
    useNavigate();


  // ==========================================================
  // STATE
  // ==========================================================

  const [
    customers,
    setCustomers,
  ] =
    useState([]);


  const [
    summary,
    setSummary,
  ] =
    useState({
      totalCustomers:
        0,

      activeCustomers:
        0,

      inactiveCustomers:
        0,

      totalOrders:
        0,

      totalRevenue:
        0,
    });


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
    editingCustomer,
    setEditingCustomer,
  ] =
    useState(null);


  const [
    selectedCustomer,
    setSelectedCustomer,
  ] =
    useState(null);


  const [
    saving,
    setSaving,
  ] =
    useState(false);


  const [
    updatingStatusId,
    setUpdatingStatusId,
  ] =
    useState(null);


  const [
    form,
    setForm,
  ] =
    useState({
      company:
        '',

      name:
        '',

      phone:
        '',

      location:
        '',

      status:
        'active',
    });


  // ==========================================================
  // LOAD CUSTOMERS
  // ==========================================================

  const loadCustomers =
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
            await getAdminCustomers();


          const customerList =
            Array.isArray(
              response
            )
              ? response
              : Array.isArray(
                    response?.customers
                  )
                ? response.customers
                : [];


          setCustomers(
            customerList
          );


          if (
            response?.summary
          ) {

            setSummary(
              response.summary
            );

          } else {

            setSummary({

              totalCustomers:
                customerList.length,

              activeCustomers:
                customerList.filter(
                  (customer) =>
                    customer.status ===
                    'Active'
                ).length,

              inactiveCustomers:
                customerList.filter(
                  (customer) =>
                    customer.status ===
                    'Inactive'
                ).length,

              totalOrders:
                customerList.reduce(
                  (
                    total,
                    customer
                  ) =>
                    total +
                    Number(
                      customer.orders ||
                      0
                    ),
                  0
                ),

              totalRevenue:
                customerList.reduce(
                  (
                    total,
                    customer
                  ) =>
                    total +
                    Number(
                      customer.spent ||
                      0
                    ),
                  0
                ),

            });

          }

        } catch (
          requestError
        ) {

          console.error(
            '[ADMIN CUSTOMERS LOAD ERROR]',
            requestError
          );


          setError(
            requestError
              ?.response
              ?.data
              ?.message ||
            'Unable to load customers.'
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

      loadCustomers();

    },
    [
      loadCustomers,
    ]
  );


  // ==========================================================
  // AUTO REFRESH
  // ==========================================================

  useEffect(
    () => {

      const timer =
        window.setInterval(
          () => {

            loadCustomers(
              true
            );

          },
          30000
        );


      return () =>
        window.clearInterval(
          timer
        );

    },
    [
      loadCustomers,
    ]
  );


  // ==========================================================
  // FILTER CUSTOMERS
  // ==========================================================

  const filteredCustomers =
    useMemo(
      () => {

        const query =
          search
            .trim()
            .toLowerCase();


        return customers.filter(
          (
            customer
          ) => {

            const searchable =
              [
                customer.name,
                customer.company,
                customer.contact,
                customer.email,
                customer.phone,
                customer.location,
                customer.customerId,
              ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();


            const matchesSearch =
              !query ||
              searchable.includes(
                query
              );


            const matchesStatus =
              statusFilter ===
                'All' ||
              customer.status ===
                statusFilter;


            return (
              matchesSearch &&
              matchesStatus
            );

          }
        );

      },
      [
        customers,
        search,
        statusFilter,
      ]
    );


  // ==========================================================
  // EDIT CUSTOMER
  // ==========================================================

  function handleEdit(
    customer
  ) {

    setSelectedCustomer(
      null
    );


    setEditingCustomer(
      customer
    );


    setForm({
      company:
        customer.company ||
        '',

      name:
        customer.contact ||
        customer.name ||
        '',

      phone:
        customer.phone ||
        '',

      location:
        customer.location ||
        '',

      status:
        customer.rawStatus ||
        (
          customer.status ===
          'Inactive'
            ? 'inactive'
            : 'active'
        ),
    });

  }


  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  function handleChange(
    event
  ) {

    const {
      name,
      value,
    } =
      event.target;


    setForm(
      (
        previous
      ) => ({
        ...previous,

        [name]:
          value,
      })
    );

  }


  // ==========================================================
  // CLOSE EDIT MODAL
  // ==========================================================

  function closeEditModal() {

    if (saving) {

      return;

    }


    setEditingCustomer(
      null
    );

  }


  // ==========================================================
  // SAVE CUSTOMER
  // ==========================================================

  async function handleSubmit(
    event
  ) {

    event.preventDefault();


    if (
      !editingCustomer
    ) {

      return;

    }


    if (
      !form.name.trim()
    ) {

      setError(
        'Contact person name is required.'
      );

      return;

    }


    try {

      setSaving(
        true
      );

      setError('');


      await updateAdminCustomer(
        editingCustomer.id,
        {
          company:
            form.company.trim(),

          name:
            form.name.trim(),

          phone:
            form.phone.trim(),

          location:
            form.location.trim(),

          status:
            form.status,
        }
      );


      setEditingCustomer(
        null
      );


      await loadCustomers(
        true
      );

    } catch (
      requestError
    ) {

      console.error(
        '[ADMIN CUSTOMER UPDATE ERROR]',
        requestError
      );


      setError(
        requestError
          ?.response
          ?.data
          ?.message ||
        'Unable to update customer.'
      );

    } finally {

      setSaving(
        false
      );

    }

  }


  // ==========================================================
  // TOGGLE STATUS
  // ==========================================================

  async function toggleStatus(
    customer
  ) {

    const nextStatus =
      customer.status ===
        'Active'
        ? 'inactive'
        : 'active';


    try {

      setUpdatingStatusId(
        customer.id
      );

      setError('');


      await updateAdminCustomer(
        customer.id,
        {
          status:
            nextStatus,
        }
      );


      setCustomers(
        (
          previous
        ) =>
          previous.map(
            (
              item
            ) =>
              item.id ===
              customer.id
                ? {
                    ...item,

                    status:
                      nextStatus ===
                      'active'
                        ? 'Active'
                        : 'Inactive',

                    rawStatus:
                      nextStatus,
                  }
                : item
          )
      );


      setSelectedCustomer(
        (
          previous
        ) =>
          previous?.id ===
          customer.id
            ? {
                ...previous,

                status:
                  nextStatus ===
                  'active'
                    ? 'Active'
                    : 'Inactive',

                rawStatus:
                  nextStatus,
              }
            : previous
      );


      await loadCustomers(
        true
      );

    } catch (
      requestError
    ) {

      console.error(
        '[CUSTOMER STATUS ERROR]',
        requestError
      );


      setError(
        requestError
          ?.response
          ?.data
          ?.message ||
        'Unable to update customer status.'
      );

    } finally {

      setUpdatingStatusId(
        null
      );

    }

  }


  // ==========================================================
  // FILTER RESET
  // ==========================================================

  function clearFilters() {

    setSearch('');

    setStatusFilter(
      'All'
    );

  }


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (

      <div className="admin-customers-page">

        <div className="card admin-customers-container admin-empty">

          <Icon
            name="user"
            size={34}
          />

          <strong>
            Loading customers...
          </strong>

          <span>
            Fetching customer accounts and procurement activity.
          </span>

        </div>

      </div>

    );

  }


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

          <button
            type="button"
            className="admin-back-button"
            onClick={() =>
              navigate(
                '/admin'
              )
            }
          >

            <Icon
              name="arrow-left"
              size={18}
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
            View customer accounts, procurement activity
            and account status.
          </p>

        </div>


        <button
          type="button"
          className="btn btn-outline-navy"
          disabled={
            refreshing
          }
          onClick={() =>
            loadCustomers(
              true
            )
          }
        >

          <Icon
            name="refresh"
            size={17}
          />

          <span>
            {refreshing
              ? 'Refreshing...'
              : 'Refresh'}
          </span>

        </button>

      </div>


      {/* ====================================================
          ERROR
      ==================================================== */}

      {error && (

        <div className="card admin-customer-error">

          <Icon
            name="alert"
            size={19}
          />

          <span>
            {error}
          </span>

        </div>

      )}


      {/* ====================================================
          STATISTICS
      ==================================================== */}

      <div className="admin-customer-stats">


        {/* TOTAL CUSTOMERS */}

        <div className="card admin-customer-stat">

          <div className="admin-customer-stat-icon">

            <Icon
              name="user"
              size={21}
            />

          </div>

          <div>

            <strong>
              {summary.totalCustomers}
            </strong>

            <span>
              Total Customers
            </span>

          </div>

        </div>


        {/* ACTIVE CUSTOMERS */}

        <div className="card admin-customer-stat">

          <div className="admin-customer-stat-icon">

            <Icon
              name="check"
              size={21}
            />

          </div>

          <div>

            <strong>
              {summary.activeCustomers}
            </strong>

            <span>
              Active Customers
            </span>

          </div>

        </div>


        {/* INACTIVE CUSTOMERS */}

        <div className="card admin-customer-stat">

          <div className="admin-customer-stat-icon">

            <Icon
              name="clock"
              size={21}
            />

          </div>

          <div>

            <strong>
              {summary.inactiveCustomers}
            </strong>

            <span>
              Inactive Customers
            </span>

          </div>

        </div>


        {/* ORDERS */}

        <div className="card admin-customer-stat">

          <div className="admin-customer-stat-icon">

            <Icon
              name="cart"
              size={21}
            />

          </div>

          <div>

            <strong>
              {summary.totalOrders}
            </strong>

            <span>
              Total Orders
            </span>

          </div>

        </div>


        {/* REVENUE */}

        <div className="card admin-customer-stat customer-revenue-stat">

          <div className="admin-customer-stat-icon">

            <Icon
              name="bolt"
              size={21}
            />

          </div>

          <div>

            <strong>
              {formatCurrency(
                summary.totalRevenue
              )}
            </strong>

            <span>
              Paid Revenue
            </span>

          </div>

        </div>

      </div>


      {/* ====================================================
          CUSTOMER TABLE CARD
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
              placeholder="Search customer, company, email, phone or ID..."
              value={
                search
              }
              onChange={
                (
                  event
                ) =>
                  setSearch(
                    event.target.value
                  )
              }
            />


            {search && (

              <button
                type="button"
                className="admin-search-clear"
                title="Clear search"
                aria-label="Clear search"
                onClick={() =>
                  setSearch('')
                }
              >
                ×
              </button>

            )}

          </div>


          <select
            value={
              statusFilter
            }
            aria-label="Filter customers by status"
            onChange={
              (
                event
              ) =>
                setStatusFilter(
                  event.target.value
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
            statusFilter !==
              'All') && (

            <button
              type="button"
              className="admin-clear-filter"
              onClick={
                clearFilters
              }
            >
              Clear Filters
            </button>

          )}


          <span className="admin-customer-count">

            Showing{' '}

            {filteredCustomers.length}

            {' '}of{' '}

            {customers.length}

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
                  Paid Spend
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
                      size={34}
                    />

                    <strong>
                      No customers found
                    </strong>

                    <span>
                      No customer accounts match the current filters.
                    </span>


                    {(search ||
                      statusFilter !==
                        'All') && (

                      <button
                        type="button"
                        className="admin-empty-button"
                        onClick={
                          clearFilters
                        }
                      >
                        Clear Filters
                      </button>

                    )}

                  </td>

                </tr>

              ) : (

                filteredCustomers.map(
                  (
                    customer
                  ) => (

                    <tr
                      key={
                        customer.id
                      }
                    >


                      {/* CUSTOMER */}

                      <td>

                        <div className="admin-customer-name">

                          <div className="admin-customer-avatar">

                            {(customer.name ||
                              customer.company ||
                              customer.contact ||
                              'C')
                              .charAt(0)
                              .toUpperCase()}

                          </div>


                          <div>

                            <strong>

                              {customer.name ||
                                customer.company ||
                                customer.contact ||
                                'Customer'}

                            </strong>


                            <small>

                              {customer.customerId ||
                                customer.id}

                            </small>

                          </div>

                        </div>

                      </td>


                      {/* CONTACT */}

                      <td>

                        <strong>

                          {customer.contact ||
                            'Not provided'}

                        </strong>


                        <small className="admin-customer-email">

                          {customer.email ||
                            'No email'}

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


                      {/* PAID SPEND */}

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
                          disabled={
                            updatingStatusId ===
                            customer.id
                          }
                          title={`Click to ${
                            customer.status ===
                            'Active'
                              ? 'deactivate'
                              : 'activate'
                          } this customer`}
                          onClick={() =>
                            toggleStatus(
                              customer
                            )
                          }
                        >

                          <span />

                          {updatingStatusId ===
                          customer.id
                            ? 'Updating...'
                            : customer.status}

                        </button>

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div className="admin-customer-actions">

                          <button
                            type="button"
                            title="View customer"
                            aria-label="View customer"
                            className="admin-action-btn"
                            onClick={() =>
                              setSelectedCustomer(
                                customer
                              )
                            }
                          >

                            <Icon
                              name="eye"
                              size={17}
                            />

                          </button>


                          <button
                            type="button"
                            title="Edit customer"
                            aria-label="Edit customer"
                            className="admin-action-btn"
                            onClick={() =>
                              handleEdit(
                                customer
                              )
                            }
                          >

                            <Icon
                              name="edit"
                              size={17}
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
          EDIT CUSTOMER MODAL
      ==================================================== */}

      {editingCustomer && (

        <div
          className="admin-modal-overlay"
          onClick={
            closeEditModal
          }
        >

          <div
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-customer-title"
            onClick={
              (
                event
              ) =>
                event.stopPropagation()
            }
          >

            <div className="admin-modal-header">

              <div>

                <span className="eyebrow">
                  Customer Management
                </span>

                <h2 id="edit-customer-title">
                  Edit Customer
                </h2>

              </div>


              <button
                type="button"
                className="admin-modal-close"
                aria-label="Close edit customer"
                disabled={
                  saving
                }
                onClick={
                  closeEditModal
                }
              >
                ×
              </button>

            </div>


            <form
              className="admin-customer-form"
              onSubmit={
                handleSubmit
              }
            >

              <div className="admin-form-grid">


                {/* COMPANY */}

                <div className="field">

                  <label htmlFor="customer-company">
                    Company
                  </label>

                  <input
                    id="customer-company"
                    name="company"
                    value={
                      form.company
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Company name"
                    disabled={
                      saving
                    }
                  />

                </div>


                {/* CONTACT */}

                <div className="field">

                  <label htmlFor="customer-name">
                    Contact Person *
                  </label>

                  <input
                    id="customer-name"
                    name="name"
                    value={
                      form.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Contact person"
                    required
                    disabled={
                      saving
                    }
                  />

                </div>


                {/* EMAIL */}

                <div className="field">

                  <label htmlFor="customer-email">
                    Email
                  </label>

                  <input
                    id="customer-email"
                    type="email"
                    value={
                      editingCustomer.email ||
                      ''
                    }
                    readOnly
                    disabled
                  />

                </div>


                {/* PHONE */}

                <div className="field">

                  <label htmlFor="customer-phone">
                    Phone
                  </label>

                  <input
                    id="customer-phone"
                    type="tel"
                    name="phone"
                    value={
                      form.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="+256..."
                    disabled={
                      saving
                    }
                  />

                </div>


                {/* LOCATION */}

                <div className="field">

                  <label htmlFor="customer-location">
                    Location
                  </label>

                  <input
                    id="customer-location"
                    name="location"
                    value={
                      form.location
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Kampala, Uganda"
                    disabled={
                      saving
                    }
                  />

                </div>


                {/* STATUS */}

                <div className="field">

                  <label htmlFor="customer-status">
                    Account Status
                  </label>

                  <select
                    id="customer-status"
                    name="status"
                    value={
                      form.status
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      saving
                    }
                  >

                    <option value="active">
                      Active
                    </option>

                    <option value="inactive">
                      Inactive
                    </option>

                  </select>

                </div>

              </div>


              {/* NOTE */}

              <div className="customer-form-note">

                <Icon
                  name="bolt"
                  size={17}
                />

                <span>
                  Changes made here update the customer&apos;s
                  Apex Machinery account profile.
                </span>

              </div>


              {/* ACTIONS */}

              <div className="admin-modal-actions">

                <button
                  type="button"
                  className="btn btn-outline-navy"
                  disabled={
                    saving
                  }
                  onClick={
                    closeEditModal
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    saving
                  }
                >

                  <Icon
                    name="check"
                    size={17}
                  />

                  <span>
                    {saving
                      ? 'Saving...'
                      : 'Save Changes'}
                  </span>

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
          onClick={() =>
            setSelectedCustomer(
              null
            )
          }
        >

          <div
            className="admin-modal customer-details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-details-title"
            onClick={
              (
                event
              ) =>
                event.stopPropagation()
            }
          >

            <div className="admin-modal-header">

              <div>

                <span className="eyebrow">
                  Customer Profile
                </span>

                <h2 id="customer-details-title">

                  {selectedCustomer.name ||
                    selectedCustomer.company ||
                    selectedCustomer.contact ||
                    'Customer'}

                </h2>

              </div>


              <button
                type="button"
                className="admin-modal-close"
                aria-label="Close customer details"
                onClick={() =>
                  setSelectedCustomer(
                    null
                  )
                }
              >
                ×
              </button>

            </div>


            <div className="customer-details">

              <div className="customer-details-top">

                <div className="customer-details-avatar">

                  {(selectedCustomer.name ||
                    selectedCustomer.company ||
                    selectedCustomer.contact ||
                    'C')
                    .charAt(0)
                    .toUpperCase()}

                </div>


                <div>

                  <h3>

                    {selectedCustomer.name ||
                      selectedCustomer.company ||
                      selectedCustomer.contact ||
                      'Customer'}

                  </h3>


                  <span>

                    {selectedCustomer.customerId ||
                      selectedCustomer.id}

                  </span>


                  <button
                    type="button"
                    className={`admin-customer-status ${
                      selectedCustomer.status ===
                      'Active'
                        ? 'active'
                        : 'inactive'
                    }`}
                    disabled={
                      updatingStatusId ===
                      selectedCustomer.id
                    }
                    onClick={() =>
                      toggleStatus(
                        selectedCustomer
                      )
                    }
                  >

                    <span />

                    {updatingStatusId ===
                    selectedCustomer.id
                      ? 'Updating...'
                      : selectedCustomer.status}

                  </button>

                </div>

              </div>


              <div className="customer-detail-grid">


                <div className="customer-detail-row">

                  <span>
                    Contact Person
                  </span>

                  <strong>

                    {selectedCustomer.contact ||
                      'Not provided'}

                  </strong>

                </div>


                <div className="customer-detail-row">

                  <span>
                    Company
                  </span>

                  <strong>

                    {selectedCustomer.company ||
                      'Not provided'}

                  </strong>

                </div>


                <div className="customer-detail-row">

                  <span>
                    Email
                  </span>

                  <strong>

                    {selectedCustomer.email ||
                      'Not provided'}

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

                    {Number(
                      selectedCustomer.orders ||
                      0
                    )}

                  </strong>

                </div>


                <div className="customer-detail-row">

                  <span>
                    Paid Spend
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

                    {formatDate(
                      selectedCustomer.joined
                    )}

                  </strong>

                </div>


                <div className="customer-detail-row">

                  <span>
                    Account Status
                  </span>

                  <strong>

                    {selectedCustomer.status ||
                      'Unknown'}

                  </strong>

                </div>

              </div>

            </div>


            <div className="admin-modal-actions">

              <button
                type="button"
                className="btn btn-outline-navy"
                onClick={() =>
                  setSelectedCustomer(
                    null
                  )
                }
              >
                Close
              </button>


              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  handleEdit(
                    selectedCustomer
                  )
                }
              >

                <Icon
                  name="edit"
                  size={17}
                />

                <span>
                  Edit Customer
                </span>

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}