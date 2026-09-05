import {
  useMemo,
  useState,
} from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import Breadcrumb from '../components/Breadcrumb';
import Icon from '../components/Icon';

import {
  useCart,
} from '../context/CartContext';

import {
  formatCurrency,
} from '../utils/format';

import {
  createCustomerOrder,
} from '../services/customerApi';

import './Checkout.css';


// ============================================================
// INITIAL SHIPPING FORM
// ============================================================

const initialShippingForm = {

  firstName:
    '',

  lastName:
    '',

  email:
    '',

  phone:
    '',

  streetAddress:
    '',

  city:
    '',

  country:
    'Uganda',

  purchaseOrderNumber:
    '',

};


// ============================================================
// HELPERS
// ============================================================

function getItemImage(
  item
) {

  return (
    item?.image ||
    item?.image_url ||
    item?.images?.[0] ||
    '/logo.jpg'
  );

}


function getItemSlug(
  item
) {

  return (
    item?.slug ||
    item?.id ||
    ''
  );

}


// ============================================================
// CHECKOUT
// ============================================================

export default function Checkout() {

  const {
    items = [],
    subtotal = 0,
    clearCart,
  } =
    useCart();


  const navigate =
    useNavigate();


  // ==========================================================
  // STATE
  // ==========================================================

  const [
    delivery,
    setDelivery,
  ] =
    useState(
      'standard'
    );


  const [
    payment,
    setPayment,
  ] =
    useState(
      'invoice'
    );


  const [
    form,
    setForm,
  ] =
    useState(
      initialShippingForm
    );


  const [
    submitting,
    setSubmitting,
  ] =
    useState(
      false
    );


  const [
    error,
    setError,
  ] =
    useState(
      ''
    );


  const [
    placedOrder,
    setPlacedOrder,
  ] =
    useState(
      null
    );


  // ==========================================================
  // TOTALS
  // ==========================================================

  const safeSubtotal =
    Number(
      subtotal ||
      0
    );


  const shippingCost =
    delivery ===
    'express'
      ? 250000
      : 0;


  const taxRate =
    0.05;


  const tax =
    Math.round(
      safeSubtotal *
      taxRate
    );


  const total =
    safeSubtotal +
    shippingCost +
    tax;


  // ==========================================================
  // CART ITEMS
  // ==========================================================

  const normalizedItems =
    useMemo(
      () => {

        return items
          .filter(
            (
              item
            ) =>
              Boolean(
                item?.id
              )
          )
          .map(
            (
              item
            ) => ({

              productId:
                item.id,

              productName:
                item.name ||
                'Product',

              sku:
                item.sku ||
                item.slug ||
                '',

              quantity:
                Math.max(
                  1,
                  Number(
                    item.qty ||
                    1
                  )
                ),

              unitPrice:
                Math.max(
                  0,
                  Number(
                    item.price ||
                    0
                  )
                ),

            })
          );

      },
      [
        items,
      ]
    );


  // ==========================================================
  // TOTAL QUANTITY
  // ==========================================================

  const totalQuantity =
    useMemo(
      () => {

        return normalizedItems.reduce(
          (
            totalItems,
            item
          ) =>
            totalItems +
            Number(
              item.quantity ||
              0
            ),
          0
        );

      },
      [
        normalizedItems,
      ]
    );


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


    if (error) {

      setError(
        ''
      );

    }

  }


  // ==========================================================
  // VALIDATE
  // ==========================================================

  function validateForm() {

    if (
      normalizedItems.length ===
      0
    ) {

      return 'Your cart is empty.';

    }


    if (
      !form.firstName.trim()
    ) {

      return 'Please enter your first name.';

    }


    if (
      !form.lastName.trim()
    ) {

      return 'Please enter your last name.';

    }


    if (
      !form.email.trim()
    ) {

      return 'Please enter your email address.';

    }


    if (
      !form.phone.trim()
    ) {

      return 'Please enter your phone number.';

    }


    if (
      !form.streetAddress.trim()
    ) {

      return 'Please enter your delivery address.';

    }


    if (
      !form.city.trim()
    ) {

      return 'Please enter your city or district.';

    }


    if (
      !form.country.trim()
    ) {

      return 'Please enter your country.';

    }


    return '';

  }


  // ==========================================================
  // SUBMIT ORDER
  // ==========================================================

  async function handleSubmit(
    event
  ) {

    event.preventDefault();


    if (
      submitting
    ) {

      return;

    }


    const validationError =
      validateForm();


    if (
      validationError
    ) {

      setError(
        validationError
      );

      window.scrollTo({
        top:
          0,

        behavior:
          'smooth',
      });

      return;

    }


    try {

      setSubmitting(
        true
      );


      setError(
        ''
      );


      // ======================================================
      // PAYLOAD
      // ======================================================

      const payload = {

        deliveryMethod:
          delivery,

        paymentMethod:
          payment,

        purchaseOrderNumber:
          payment ===
          'invoice'
            ? (
                form
                  .purchaseOrderNumber
                  .trim() ||
                null
              )
            : null,


        shipping: {

          firstName:
            form
              .firstName
              .trim(),

          lastName:
            form
              .lastName
              .trim(),

          email:
            form
              .email
              .trim(),

          phone:
            form
              .phone
              .trim(),

          address:
            form
              .streetAddress
              .trim(),

          city:
            form
              .city
              .trim(),

          country:
            form
              .country
              .trim(),

        },


        items:
          normalizedItems,


        summary: {

          subtotal:
            safeSubtotal,

          shipping:
            shippingCost,

          tax,

          total,

        },

      };


      // ======================================================
      // CREATE ORDER
      // ======================================================

      const response =
        await createCustomerOrder(
          payload
        );


      const order =
        response?.order ||
        response?.data?.order ||
        response?.data ||
        response;


      if (
        !order
      ) {

        throw new Error(
          'Order was created but no order information was returned.'
        );

      }


      setPlacedOrder(
        order
      );


      clearCart();


      window.scrollTo({
        top:
          0,

        behavior:
          'smooth',
      });


    } catch (
      requestError
    ) {

      console.error(
        '[CHECKOUT ERROR]',
        requestError
      );


      setError(
        requestError
          ?.response
          ?.data
          ?.message ||
        requestError
          ?.message ||
        'Unable to place your order. Please try again.'
      );


      window.scrollTo({
        top:
          0,

        behavior:
          'smooth',
      });


    } finally {

      setSubmitting(
        false
      );

    }

  }


  // ==========================================================
  // CONFIRMATION
  // ==========================================================

  if (
    placedOrder
  ) {

    const orderReference =
      placedOrder.orderNumber ||
      placedOrder.order_number ||
      placedOrder.id ||
      'Order received';


    return (

      <main className="checkout-page">

        <div className="container">

          <div className="checkout-confirm">

            <div className="checkout-confirm-icon">

              <Icon
                name="check"
                size={44}
                strokeWidth={2}
              />

            </div>


            <span className="eyebrow">
              Procurement Request Received
            </span>


            <h1>
              Order Confirmed
            </h1>


            <p>
              Your procurement order has
              been received by ApexMach UG
              and is now awaiting processing.
            </p>


            <div className="checkout-order-reference">

              <span>
                Order Number
              </span>


              <strong>
                {
                  orderReference
                }
              </strong>

            </div>


            {
              payment ===
              'card' && (

                <div className="checkout-confirm-notice">

                  <Icon
                    name="info"
                    size={18}
                  />


                  <p>
                    Your order has been
                    recorded. Card payment
                    processing will become
                    available once the secure
                    payment gateway is connected.
                  </p>

                </div>

              )
            }


            <div className="checkout-confirm-actions">

              <button
                type="button"
                className="btn btn-primary"
                onClick={
                  () =>
                    navigate(
                      '/order-tracking'
                    )
                }
              >
                Track Your Order
              </button>


              <button
                type="button"
                className="btn btn-outline-navy"
                onClick={
                  () =>
                    navigate(
                      '/shop'
                    )
                }
              >
                Continue Shopping
              </button>

            </div>

          </div>

        </div>

      </main>

    );

  }


  // ==========================================================
  // EMPTY CHECKOUT
  // ==========================================================

  if (
    items.length ===
    0
  ) {

    return (

      <main className="checkout-page">

        <div className="container">

          <Breadcrumb
            items={[
              {
                to:
                  '/cart',

                label:
                  'Cart',
              },

              {
                label:
                  'Checkout',
              },
            ]}
          />


          <div className="checkout-empty">

            <Icon
              name="cart"
              size={42}
            />


            <h1>
              Your cart is empty
            </h1>


            <p>
              Add machinery, tools or
              industrial equipment to your
              cart before proceeding to
              checkout.
            </p>


            <Link
              to="/shop"
              className="btn btn-primary"
            >
              Browse Products
            </Link>

          </div>

        </div>

      </main>

    );

  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <main className="checkout-page">

      <div className="container">


        {/* ==================================================
            BREADCRUMB
        ================================================== */}

        <Breadcrumb
          items={[
            {
              to:
                '/cart',

              label:
                'Cart',
            },

            {
              label:
                'Checkout',
            },
          ]}
        />


        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <div className="checkout-header">

          <div>

            <span className="eyebrow">
              Secure Procurement
            </span>


            <h1 className="checkout-title">
              Secure Checkout
            </h1>


            <p className="checkout-subtitle">

              Complete your delivery
              information and submit your
              ApexMach UG procurement order.

            </p>

          </div>


          <div className="checkout-secure-badge">

            <Icon
              name="shield"
              size={18}
            />

            Secure Order

          </div>

        </div>


        {/* ==================================================
            ERROR
        ================================================== */}

        {
          error && (

            <div
              className="checkout-error"
              role="alert"
            >

              <Icon
                name="warning"
                size={20}
              />


              <span>
                {
                  error
                }
              </span>

            </div>

          )
        }


        {/* ==================================================
            CHECKOUT FORM
        ================================================== */}

        <form
          className="checkout-layout"
          onSubmit={
            handleSubmit
          }
        >


          {/* ==================================================
              MAIN
          ================================================== */}

          <div className="checkout-main">


            {/* ================================================
                SHIPPING
            ================================================ */}

            <section className="checkout-step">

              <h2>

                <span className="checkout-step-num">
                  1
                </span>

                Shipping Information

              </h2>


              <p className="checkout-step-description">
                Enter the delivery details
                for this procurement order.
              </p>


              <div className="form-row">

                <div className="field">

                  <label
                    htmlFor="checkout-first-name"
                  >
                    First Name
                  </label>


                  <input
                    id="checkout-first-name"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    value={
                      form.firstName
                    }
                    onChange={
                      handleChange
                    }
                    required
                    placeholder="Enter first name"
                  />

                </div>


                <div className="field">

                  <label
                    htmlFor="checkout-last-name"
                  >
                    Last Name
                  </label>


                  <input
                    id="checkout-last-name"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    value={
                      form.lastName
                    }
                    onChange={
                      handleChange
                    }
                    required
                    placeholder="Enter last name"
                  />

                </div>

              </div>


              <div className="field">

                <label
                  htmlFor="checkout-email"
                >
                  Email Address
                </label>


                <input
                  id="checkout-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={
                    form.email
                  }
                  onChange={
                    handleChange
                  }
                  required
                  placeholder="you@company.com"
                />

              </div>


              <div className="field">

                <label
                  htmlFor="checkout-phone"
                >
                  Phone Number
                </label>


                <input
                  id="checkout-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={
                    form.phone
                  }
                  onChange={
                    handleChange
                  }
                  required
                  placeholder="+256 7XX XXX XXX"
                />

              </div>


              <div className="field">

                <label
                  htmlFor="checkout-address"
                >
                  Street Address
                </label>


                <input
                  id="checkout-address"
                  name="streetAddress"
                  type="text"
                  autoComplete="street-address"
                  value={
                    form.streetAddress
                  }
                  onChange={
                    handleChange
                  }
                  required
                  placeholder="Street, building or delivery location"
                />

              </div>


              <div className="form-row">

                <div className="field">

                  <label
                    htmlFor="checkout-city"
                  >
                    City / District
                  </label>


                  <input
                    id="checkout-city"
                    name="city"
                    type="text"
                    autoComplete="address-level2"
                    value={
                      form.city
                    }
                    onChange={
                      handleChange
                    }
                    required
                    placeholder="Kampala"
                  />

                </div>


                <div className="field">

                  <label
                    htmlFor="checkout-country"
                  >
                    Country
                  </label>


                  <input
                    id="checkout-country"
                    name="country"
                    type="text"
                    autoComplete="country-name"
                    value={
                      form.country
                    }
                    onChange={
                      handleChange
                    }
                    required
                    placeholder="Uganda"
                  />

                </div>

              </div>

            </section>


            {/* ================================================
                DELIVERY
            ================================================ */}

            <section className="checkout-step">

              <h2>

                <span className="checkout-step-num">
                  2
                </span>

                Delivery Method

              </h2>


              <p className="checkout-step-description">
                Select the logistics option
                for your equipment order.
              </p>


              <div className="checkout-options">


                {/* STANDARD */}

                <label
                  className={`checkout-option ${
                    delivery ===
                    'standard'
                      ? 'selected'
                      : ''
                  }`}
                >

                  <input
                    type="radio"
                    name="delivery"
                    value="standard"
                    checked={
                      delivery ===
                      'standard'
                    }
                    onChange={() =>
                      setDelivery(
                        'standard'
                      )
                    }
                  />


                  <div className="checkout-option-icon">

                    <Icon
                      name="truck"
                      size={20}
                    />

                  </div>


                  <div className="checkout-option-content">

                    <strong>
                      Standard Delivery
                    </strong>


                    <span>
                      Estimated 3–5 business days
                    </span>

                  </div>


                  <span className="checkout-option-price">
                    Free
                  </span>

                </label>


                {/* EXPRESS */}

                <label
                  className={`checkout-option ${
                    delivery ===
                    'express'
                      ? 'selected'
                      : ''
                  }`}
                >

                  <input
                    type="radio"
                    name="delivery"
                    value="express"
                    checked={
                      delivery ===
                      'express'
                    }
                    onChange={() =>
                      setDelivery(
                        'express'
                      )
                    }
                  />


                  <div className="checkout-option-icon">

                    <Icon
                      name="bolt"
                      size={20}
                    />

                  </div>


                  <div className="checkout-option-content">

                    <strong>
                      Express Logistics
                    </strong>


                    <span>
                      Priority industrial delivery
                    </span>

                  </div>


                  <span className="checkout-option-price">

                    {
                      formatCurrency(
                        250000
                      )
                    }

                  </span>

                </label>

              </div>

            </section>


            {/* ================================================
                PAYMENT
            ================================================ */}

            <section className="checkout-step">

              <h2>

                <span className="checkout-step-num">
                  3
                </span>

                Payment Selection

              </h2>


              <p className="checkout-step-description">
                Choose how this procurement
                order will be processed.
              </p>


              <div
                className="checkout-payment-tabs"
                role="group"
                aria-label="Payment method"
              >

                <button
                  type="button"
                  className={
                    payment ===
                    'invoice'
                      ? 'active'
                      : ''
                  }
                  aria-pressed={
                    payment ===
                    'invoice'
                  }
                  onClick={() =>
                    setPayment(
                      'invoice'
                    )
                  }
                >

                  <Icon
                    name="package"
                    size={17}
                  />

                  Enterprise Invoice

                </button>


                <button
                  type="button"
                  className={
                    payment ===
                    'card'
                      ? 'active'
                      : ''
                  }
                  aria-pressed={
                    payment ===
                    'card'
                  }
                  onClick={() =>
                    setPayment(
                      'card'
                    )
                  }
                >

                  <Icon
                    name="shield"
                    size={17}
                  />

                  Card Payment

                </button>

              </div>


              {
                payment ===
                'invoice'
                  ? (

                    <div className="checkout-payment-panel">

                      <div className="field">

                        <label
                          htmlFor="checkout-po"
                        >
                          Purchase Order Number
                          <span className="field-optional">
                            {' '}(Optional)
                          </span>
                        </label>


                        <input
                          id="checkout-po"
                          name="purchaseOrderNumber"
                          type="text"
                          value={
                            form.purchaseOrderNumber
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="PO-2026-XXXX"
                        />

                      </div>


                      <div className="checkout-payment-info">

                        <Icon
                          name="info"
                          size={18}
                        />


                        <p>
                          Enterprise orders can
                          include your organization&apos;s
                          purchase order reference for
                          easier procurement tracking.
                        </p>

                      </div>

                    </div>

                  )
                  : (

                    <div className="checkout-payment-notice">

                      <Icon
                        name="shield"
                        size={20}
                      />


                      <div>

                        <strong>
                          Secure card gateway coming soon
                        </strong>


                        <p>
                          No card details are collected
                          on this page. Your procurement
                          order can still be recorded
                          while the certified payment
                          gateway is being connected.
                        </p>

                      </div>

                    </div>

                  )
              }

            </section>

          </div>


          {/* ==================================================
              SUMMARY
          ================================================== */}

          <aside className="checkout-summary card">

            <div className="checkout-summary-header">

              <div>

                <h3>
                  Order Summary
                </h3>


                <span>
                  {totalQuantity}{' '}
                  item
                  {
                    totalQuantity !==
                    1
                      ? 's'
                      : ''
                  }
                </span>

              </div>


              <Link
                to="/cart"
                className="checkout-edit-cart"
              >
                Edit Cart
              </Link>

            </div>


            {/* ITEMS */}

            <div className="checkout-summary-items">

              {
                items.map(
                  (
                    item
                  ) => {

                    const quantity =
                      Math.max(
                        1,
                        Number(
                          item.qty ||
                          1
                        )
                      );


                    const itemPrice =
                      Number(
                        item.price ||
                        0
                      );


                    const productPath =
                      `/product/${getItemSlug(
                        item
                      )}`;


                    return (

                      <div
                        key={
                          item.id
                        }
                        className="checkout-summary-item"
                      >

                        <Link
                          to={
                            productPath
                          }
                          className="checkout-summary-image"
                        >

                          <img
                            src={
                              getItemImage(
                                item
                              )
                            }
                            alt={
                              item.name ||
                              'Product'
                            }
                            loading="lazy"
                          />

                        </Link>


                        <div className="checkout-summary-product">

                          <Link
                            to={
                              productPath
                            }
                            className="checkout-summary-name"
                          >
                            {
                              item.name
                            }
                          </Link>


                          <span>
                            Qty: {
                              quantity
                            }
                          </span>

                        </div>


                        <strong className="checkout-summary-product-price">

                          {
                            formatCurrency(
                              itemPrice *
                              quantity
                            )
                          }

                        </strong>

                      </div>

                    );

                  }
                )
              }

            </div>


            {/* TOTALS */}

            <div className="checkout-summary-totals">

              <div className="checkout-summary-row">

                <span>
                  Subtotal
                </span>


                <strong>
                  {
                    formatCurrency(
                      safeSubtotal
                    )
                  }
                </strong>

              </div>


              <div className="checkout-summary-row">

                <span>
                  Shipping
                </span>


                <strong>

                  {
                    shippingCost ===
                    0
                      ? 'Free'
                      : formatCurrency(
                          shippingCost
                        )
                  }

                </strong>

              </div>


              <div className="checkout-summary-row">

                <span>
                  Tax (5%)
                </span>


                <strong>
                  {
                    formatCurrency(
                      tax
                    )
                  }
                </strong>

              </div>


              <div className="checkout-summary-total">

                <span>
                  Total
                </span>


                <strong>
                  {
                    formatCurrency(
                      total
                    )
                  }
                </strong>

              </div>

            </div>


            {/* PLACE ORDER */}

            <button
              type="submit"
              className="btn btn-primary btn-block checkout-submit"
              disabled={
                items.length ===
                  0 ||
                submitting
              }
            >

              {
                submitting
                  ? 'Placing Order...'
                  : 'Place Order'
              }

              {
                !submitting && (

                  <Icon
                    name="arrowRight"
                    size={16}
                  />

                )
              }

            </button>


            <div className="checkout-secure-note">

              <Icon
                name="shield"
                size={16}
              />


              <span>
                Your order information is
                submitted securely.
              </span>

            </div>


            <p className="checkout-terms">
              By placing your order, you
              confirm that the delivery and
              procurement information above
              is correct.
            </p>

          </aside>

        </form>

      </div>

    </main>

  );

}