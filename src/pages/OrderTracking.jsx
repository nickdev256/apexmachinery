import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  useLocation,
} from 'react-router-dom';

import Breadcrumb from '../components/Breadcrumb';
import Icon from '../components/Icon';

import {
  ProgressBar,
  Timeline,
} from '../components/Timeline';

import {
  getCustomerDashboard,
} from '../services/customerApi';

import './OrderTracking.css';


// ============================================================
// HELPERS
// ============================================================

function normalizeStatus(status) {

  return String(
    status || ''
  )
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');

}


function formatStatus(status) {

  const value =
    normalizeStatus(
      status
    );


  const map = {
    pending:
      'Pending',

    processing:
      'Processing',

    shipped:
      'Shipped',

    in_transit:
      'In Transit',

    delivered:
      'Delivered',

    cancelled:
      'Cancelled',
  };


  return (
    map[value] ||
    status ||
    'Pending'
  );

}


function formatDate(value) {

  if (!value) {
    return 'Pending';
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
    return value;
  }


  return date.toLocaleString(
    'en-UG',
    {
      year:
        'numeric',

      month:
        'short',

      day:
        'numeric',

      hour:
        '2-digit',

      minute:
        '2-digit',
    }
  );

}


function buildShippingAddress(
  shippingAddress
) {

  if (
    !shippingAddress
  ) {
    return 'Not provided';
  }


  if (
    typeof shippingAddress ===
    'string'
  ) {
    return shippingAddress;
  }


  const parts = [
    shippingAddress.address,
    shippingAddress.city,
    shippingAddress.country,
  ].filter(Boolean);


  return (
    parts.join(', ') ||
    'Not provided'
  );

}


// ============================================================
// STATUS PROGRESS
// ============================================================

const progressSteps = [
  'Order Placed',
  'Processing',
  'Shipped',
  'Delivered',
];


function getActiveIndex(
  status
) {

  const value =
    normalizeStatus(
      status
    );


  if (
    value ===
    'delivered'
  ) {
    return 3;
  }


  if (
    value ===
      'shipped' ||
    value ===
      'in_transit'
  ) {
    return 2;
  }


  if (
    value ===
    'processing'
  ) {
    return 1;
  }


  return 0;

}


// ============================================================
// BUILD MILESTONES
// ============================================================

function buildMilestones(
  order
) {

  const status =
    normalizeStatus(
      order?.rawStatus ||
      order?.status
    );


  const createdAt =
    order?.createdAt ||
    order?.date;


  const steps = [

    {
      key:
        'pending',

      title:
        'Order Placed',

      note:
        'Your procurement order has been received by Apex Machinery.',
    },

    {
      key:
        'processing',

      title:
        'Processing',

      note:
        'Your order is being prepared and verified for fulfilment.',
    },

    {
      key:
        'shipped',

      title:
        status ===
        'in_transit'
          ? 'In Transit'
          : 'Shipped',

      note:
        status ===
        'in_transit'
          ? 'Your machinery shipment is currently in transit.'
          : 'Your order has been prepared for shipment.',
    },

    {
      key:
        'delivered',

      title:
        'Delivered',

      note:
        'Final delivery has been completed.',
    },

  ];


  const orderLevel =
    getActiveIndex(
      status
    );


  return steps.map(
    (
      step,
      index
    ) => {

      let timelineStatus =
        'pending';


      if (
        status ===
        'cancelled'
      ) {

        timelineStatus =
          index === 0
            ? 'done'
            : 'pending';

      } else if (
        index <
        orderLevel
      ) {

        timelineStatus =
          'done';

      } else if (
        index ===
        orderLevel
      ) {

        timelineStatus =
          status ===
          'delivered'
            ? 'done'
            : 'current';

      }


      let date =
        'Pending';


      if (
        index === 0
      ) {

        date =
          formatDate(
            createdAt
          );

      } else if (
        index === 3 &&
        order?.estimatedDeliveryDate
      ) {

        date =
          formatDate(
            order
              .estimatedDeliveryDate
          );

      } else if (
        index <
        orderLevel
      ) {

        date =
          'Completed';

      } else if (
        index ===
        orderLevel
      ) {

        date =
          'Current stage';

      }


      return {
        title:
          step.title,

        date,

        note:
          step.note,

        status:
          timelineStatus,
      };

    }
  );

}


// ============================================================
// ORDER TRACKING
// ============================================================

export default function OrderTracking() {

  const location =
    useLocation();


  const [
    orderId,
    setOrderId,
  ] =
    useState('');


  const [
    orders,
    setOrders,
  ] =
    useState([]);


  const [
    trackedOrder,
    setTrackedOrder,
  ] =
    useState(null);


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    tracking,
    setTracking,
  ] =
    useState(false);


  const [
    error,
    setError,
  ] =
    useState('');


  // ==========================================================
  // LOAD CUSTOMER ORDERS
  // ==========================================================

  async function loadOrders() {

    try {

      setLoading(
        true
      );

      setError('');


      const dashboard =
        await getCustomerDashboard();


      const realOrders =
        Array.isArray(
          dashboard?.orders
        )
          ? dashboard.orders
          : [];


      setOrders(
        realOrders
      );


      // ======================================================
      // ORDER PASSED FROM CHECKOUT / NAVIGATION
      // ======================================================

      const navigationOrder =
        location.state
          ?.orderNumber ||
        location.state
          ?.orderId ||
        '';


      if (
        navigationOrder
      ) {

        setOrderId(
          navigationOrder
        );


        const matchingOrder =
          findOrder(
            realOrders,
            navigationOrder
          );


        if (
          matchingOrder
        ) {

          setTrackedOrder(
            matchingOrder
          );

        }

      } else if (
        realOrders.length >
        0
      ) {

        // Default to newest order.

        setOrderId(
          realOrders[0].id ||
          realOrders[0]
            .orderNumber ||
          ''
        );


        setTrackedOrder(
          realOrders[0]
        );

      }

    } catch (requestError) {

      console.error(
        '[ORDER TRACKING LOAD ERROR]',
        requestError
      );


      setError(
        requestError
          ?.response
          ?.data
          ?.message ||
        'Unable to load your orders.'
      );

    } finally {

      setLoading(
        false
      );

    }

  }


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(
    () => {

      loadOrders();

      const interval =
        setInterval(
          () => {

            loadOrders();

          },
          30000
        );


      return () =>
        clearInterval(
          interval
        );

    },
    []
  );


  // ==========================================================
  // FIND ORDER
  // ==========================================================

  function findOrder(
    orderList,
    searchValue
  ) {

    const search =
      String(
        searchValue || ''
      )
        .trim()
        .toLowerCase()
        .replace(/^#/, '');


    if (!search) {
      return null;
    }


    return (
      orderList.find(
        (order) => {

          const visibleId =
            String(
              order.id ||
              ''
            )
              .toLowerCase()
              .replace(
                /^#/,
                ''
              );


          const databaseId =
            String(
              order.databaseId ||
              ''
            )
              .toLowerCase();


          return (
            visibleId ===
              search ||
            databaseId ===
              search ||
            visibleId.includes(
              search
            )
          );

        }
      ) ||
      null
    );

  }


  // ==========================================================
  // TRACK SUBMIT
  // ==========================================================

  function handleTrack(
    event
  ) {

    event.preventDefault();


    setTracking(
      true
    );

    setError('');


    const matchingOrder =
      findOrder(
        orders,
        orderId
      );


    if (
      !matchingOrder
    ) {

      setTrackedOrder(
        null
      );


      setError(
        'Order not found in your account. Check the order number and try again.'
      );


      setTracking(
        false
      );

      return;

    }


    setTrackedOrder(
      matchingOrder
    );


    setOrderId(
      matchingOrder.id ||
      matchingOrder
        .orderNumber ||
      orderId
    );


    setTracking(
      false
    );

  }


  // ==========================================================
  // TRACKING DATA
  // ==========================================================

  const milestones =
    useMemo(
      () =>
        trackedOrder
          ? buildMilestones(
              trackedOrder
            )
          : [],
      [
        trackedOrder,
      ]
    );


  const activeIndex =
    trackedOrder
      ? getActiveIndex(
          trackedOrder.rawStatus ||
          trackedOrder.status
        )
      : 0;


  const orderStatus =
    trackedOrder
      ? formatStatus(
          trackedOrder.rawStatus ||
          trackedOrder.status
        )
      : 'Pending';


  const shippingAddress =
    trackedOrder
      ? buildShippingAddress(
          trackedOrder
            .shippingAddress
        )
      : 'Not provided';


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="ot-page">


      {/* ====================================================
          HERO
      ==================================================== */}

      <section className="page-hero">

        <div className="container">

          <Breadcrumb
            items={[
              {
                label:
                  'Order Tracking',
              },
            ]}
          />


          <h1>
            Order Tracking
          </h1>


          <p>
            Follow the current status of
            your Apex Machinery
            procurement orders.
          </p>

        </div>

      </section>


      {/* ====================================================
          CONTENT
      ==================================================== */}

      <section className="section">

        <div className="container ot-layout">


          {/* ==================================================
              SEARCH
          ================================================== */}

          <div className="card ot-search">

            <h3>

              <Icon
                name="search"
                size={18}
              />

              Track Your Order

            </h3>


            <form
              onSubmit={
                handleTrack
              }
            >

              <div className="field">

                <label>
                  Order Number
                </label>

                <input
                  value={
                    orderId
                  }
                  onChange={
                    (event) =>
                      setOrderId(
                        event.target.value
                      )
                  }
                  placeholder="#APX-12345678-ABC"
                  required
                />

              </div>


              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={
                  loading ||
                  tracking
                }
              >

                {tracking
                  ? 'Tracking...'
                  : 'Track Order'}

              </button>

            </form>


            {error && (

              <div className="ot-error">

                <Icon
                  name="alert"
                  size={16}
                />

                <span>
                  {error}
                </span>

              </div>

            )}


            <p className="ot-secure">

              <Icon
                name="shield"
                size={14}
              />

              Only orders associated with
              your logged-in customer
              account are displayed.

            </p>


            <div className="ot-help">

              <strong>
                Need Assistance?
              </strong>

              <p>
                Contact Apex Machinery
                support if you need help
                with an order.
              </p>

              <a
                href="/contact"
                className="btn btn-outline btn-block"
              >
                Contact Support
              </a>

            </div>

          </div>


          {/* ==================================================
              LOADING
          ================================================== */}

          {loading && (

            <div className="ot-status card">

              <div className="ot-loading">

                <Icon
                  name="package"
                  size={32}
                />

                <h3>
                  Loading your orders...
                </h3>

              </div>

            </div>

          )}


          {/* ==================================================
              EMPTY
          ================================================== */}

          {!loading &&
            !trackedOrder &&
            orders.length ===
              0 && (

            <div className="ot-status card">

              <div className="ot-loading">

                <Icon
                  name="package"
                  size={36}
                />

                <h3>
                  No orders yet
                </h3>

                <p>
                  Your orders will appear
                  here after you complete
                  checkout.
                </p>

              </div>

            </div>

          )}


          {/* ==================================================
              TRACKED ORDER
          ================================================== */}

          {!loading &&
            trackedOrder && (

            <div className="ot-status card">


              {/* ==============================================
                  HEADER
              ============================================== */}

              <div className="ot-status-header">

                <div>

                  <strong>
                    Tracking Status
                  </strong>

                  <span>
                    ID:{' '}
                    {trackedOrder.id}
                  </span>

                </div>


                <span
                  className={`badge ${
                    normalizeStatus(
                      trackedOrder
                        .rawStatus ||
                      trackedOrder
                        .status
                    ) ===
                    'delivered'
                      ? 'badge-success'
                      : 'badge-navy'
                  }`}
                >

                  {orderStatus}

                </span>

              </div>


              {/* ==============================================
                  PROGRESS
              ============================================== */}

              {normalizeStatus(
                trackedOrder
                  .rawStatus ||
                trackedOrder
                  .status
              ) !==
              'cancelled' ? (

                <ProgressBar
                  steps={
                    progressSteps
                  }
                  activeIndex={
                    activeIndex
                  }
                />

              ) : (

                <div className="ot-cancelled">

                  <Icon
                    name="alert"
                    size={18}
                  />

                  This order has been
                  cancelled.

                </div>

              )}


              {/* ==============================================
                  DETAILS
              ============================================== */}

              <div className="ot-details">

                <div>

                  <span>
                    Estimated Delivery
                  </span>

                  <strong>

                    {trackedOrder
                      .estimatedDeliveryDate
                      ? formatDate(
                          trackedOrder
                            .estimatedDeliveryDate
                        )
                      : 'To be confirmed'}

                  </strong>

                </div>


                <div>

                  <span>
                    Ship To
                  </span>

                  <strong>
                    {shippingAddress}
                  </strong>

                </div>


                <div>

                  <span>
                    Priority
                  </span>

                  <strong>

                    {String(
                      trackedOrder
                        .priority ||
                      'medium'
                    )
                      .charAt(0)
                      .toUpperCase() +

                      String(
                        trackedOrder
                          .priority ||
                        'medium'
                      ).slice(1)}

                  </strong>

                </div>

              </div>


              {/* ==============================================
                  COLUMNS
              ============================================== */}

              <div className="ot-columns">


                {/* ============================================
                    MILESTONES
                ============================================ */}

                <div>

                  <h3>
                    Order Milestones
                  </h3>


                  <Timeline
                    milestones={
                      milestones
                    }
                  />

                </div>


                {/* ============================================
                    ORDER INFORMATION
                ============================================ */}

                <div>

                  <h3>
                    Order Information
                  </h3>


                  <ul className="ot-activity">

                    <li>

                      <span className="ot-activity-time">
                        Order Number
                      </span>

                      <strong>
                        {trackedOrder.id}
                      </strong>

                      <span className="ot-activity-place">

                        <Icon
                          name="package"
                          size={13}
                        />

                        Apex Machinery

                      </span>

                    </li>


                    <li>

                      <span className="ot-activity-time">
                        Order Date
                      </span>

                      <strong>

                        {formatDate(
                          trackedOrder
                            .createdAt ||
                          trackedOrder
                            .date
                        )}

                      </strong>

                    </li>


                    <li>

                      <span className="ot-activity-time">
                        Items
                      </span>

                      <strong>

                        {trackedOrder
                          .itemCount ??
                        trackedOrder
                          .orderItems
                          ?.length ??
                        0}

                      </strong>

                    </li>


                    <li>

                      <span className="ot-activity-time">
                        Current Status
                      </span>

                      <strong>
                        {orderStatus}
                      </strong>

                    </li>

                  </ul>

                </div>

              </div>

            </div>

          )}

        </div>

      </section>

    </div>

  );

}