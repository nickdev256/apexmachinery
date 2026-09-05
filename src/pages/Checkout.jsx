import {
  useMemo,
  useState,
} from 'react';

import {
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
// INITIAL FORM
// ============================================================

const initialShippingForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  streetAddress: '',
  city: '',
  country: 'Uganda',
  purchaseOrderNumber: '',
};


// ============================================================
// CHECKOUT
// ============================================================

export default function Checkout() {

  const {
    items,
    subtotal,
    clearCart,
  } =
    useCart();


  const navigate =
    useNavigate();


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
    useState('');


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

  const shippingCost =
    delivery === 'express'
      ? 250000
      : 0;


  const tax =
    Math.round(
      Number(
        subtotal || 0
      ) * 0.05
    );


  const total =
    Number(
      subtotal || 0
    ) +
    shippingCost +
    tax;


  // ==========================================================
  // CART ITEMS
  // ==========================================================

  const normalizedItems =
    useMemo(
      () => {

        return (
          items || []
        ).map(
          (item) => ({

            productId:
              item.id,

            productName:
              item.name,

            sku:
              item.sku ||
              '',

            quantity:
              Number(
                item.qty ||
                1
              ),

            unitPrice:
              Number(
                item.price ||
                0
              ),

          })
        );

      },
      [
        items,
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
      (previous) => ({

        ...previous,

        [name]:
          value,

      })
    );

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


    if (
      normalizedItems.length ===
      0
    ) {

      setError(
        'Your cart is empty.'
      );

      return;

    }


    try {

      setSubmitting(
        true
      );

      setError('');


      const payload = {

        deliveryMethod:
          delivery,

        paymentMethod:
          payment,

        purchaseOrderNumber:
          payment ===
          'invoice'
            ? form
                .purchaseOrderNumber
                .trim()
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
            Number(
              subtotal || 0
            ),

          shipping:
            shippingCost,

          tax,

          total,

        },

      };


      const order =
        await createCustomerOrder(
          payload
        );


      setPlacedOrder(
        order
      );


      clearCart();


    } catch (requestError) {

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

    return (

      <div className="section">

        <div className="container checkout-confirm">

          <Icon
            name="check"
            size={48}
          />


          <h1>
            Order Confirmed
          </h1>


          <p>
            Your procurement order has
            been received by Apex
            Machinery and is now awaiting
            processing.
          </p>


          <div className="checkout-order-reference">

            <span>
              Order Number
            </span>

            <strong>
              {placedOrder.orderNumber ||
                placedOrder.id}
            </strong>

          </div>


          <div className="checkout-confirm-actions">

            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
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
              onClick={() =>
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

    );

  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="section">

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


        <h1 className="checkout-title">
          Secure Checkout
        </h1>


        {error && (

          <div className="checkout-error">

            <Icon
              name="alert"
              size={18}
            />

            <span>
              {error}
            </span>

          </div>

        )}


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


              <div className="form-row">

                <div className="field">

                  <label>
                    First Name
                  </label>

                  <input
                    name="firstName"
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

                  <label>
                    Last Name
                  </label>

                  <input
                    name="lastName"
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

                <label>
                  Email Address
                </label>

                <input
                  name="email"
                  type="email"
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

                <label>
                  Phone Number
                </label>

                <input
                  name="phone"
                  type="tel"
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

                <label>
                  Street Address
                </label>

                <input
                  name="streetAddress"
                  value={
                    form.streetAddress
                  }
                  onChange={
                    handleChange
                  }
                  required
                  placeholder="Street address"
                />

              </div>


              <div className="form-row">

                <div className="field">

                  <label>
                    City
                  </label>

                  <input
                    name="city"
                    value={
                      form.city
                    }
                    onChange={
                      handleChange
                    }
                    required
                    placeholder="City"
                  />

                </div>


                <div className="field">

                  <label>
                    Country
                  </label>

                  <input
                    name="country"
                    value={
                      form.country
                    }
                    onChange={
                      handleChange
                    }
                    required
                    placeholder="Country"
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


              <div className="checkout-options">

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


                  <div>

                    <strong>
                      Standard Delivery
                    </strong>

                    <span>
                      3–5 Business Days
                    </span>

                  </div>


                  <span className="checkout-option-price">
                    Free
                  </span>

                </label>


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


                  <div>

                    <strong>
                      Express Logistics
                    </strong>

                    <span>
                      Priority industrial delivery
                    </span>

                  </div>


                  <span className="checkout-option-price">

                    {formatCurrency(
                      shippingCost
                    )}

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


              <div className="checkout-payment-tabs">

                <button
                  type="button"
                  className={
                    payment ===
                    'invoice'
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    setPayment(
                      'invoice'
                    )
                  }
                >
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
                  onClick={() =>
                    setPayment(
                      'card'
                    )
                  }
                >
                  Card Payment
                </button>

              </div>


              {payment ===
              'invoice' ? (

                <div className="field">

                  <label>
                    Purchase Order Number
                  </label>

                  <input
                    name="purchaseOrderNumber"
                    value={
                      form
                        .purchaseOrderNumber
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="PO-2026-XXXX"
                  />

                </div>

              ) : (

                <div className="checkout-payment-notice">

                  <Icon
                    name="shield"
                    size={18}
                  />

                  <div>

                    <strong>
                      Card gateway pending
                    </strong>

                    <p>
                      Your order can be
                      submitted now, but
                      card details are not
                      collected until a
                      certified payment
                      provider is connected.
                    </p>

                  </div>

                </div>

              )}

            </section>

          </div>


          {/* ==================================================
              SUMMARY
          ================================================== */}

          <aside className="checkout-summary card">

            <h3>
              Order Summary
            </h3>


            {items.map(
              (item) => (

                <div
                  key={
                    item.id
                  }
                  className="checkout-summary-item"
                >

                  <img
                    src={
                      item.image
                    }
                    alt={
                      item.name
                    }
                  />


                  <div>

                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      Qty: {item.qty}
                    </span>

                  </div>


                  <span>

                    {formatCurrency(
                      item.price *
                      item.qty
                    )}

                  </span>

                </div>

              )
            )}


            <div className="cart-summary-row">

              <span>
                Subtotal
              </span>

              <strong>
                {formatCurrency(
                  subtotal
                )}
              </strong>

            </div>


            <div className="cart-summary-row">

              <span>
                Shipping
              </span>

              <strong>

                {shippingCost ===
                0
                  ? 'Free'
                  : formatCurrency(
                      shippingCost
                    )}

              </strong>

            </div>


            <div className="cart-summary-row">

              <span>
                Tax
              </span>

              <strong>
                {formatCurrency(
                  tax
                )}
              </strong>

            </div>


            <div className="cart-summary-total">

              <span>
                Total
              </span>

              <strong>
                {formatCurrency(
                  total
                )}
              </strong>

            </div>


            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={
                items.length ===
                  0 ||
                submitting
              }
            >

              {submitting
                ? 'Placing Order...'
                : 'Place Order'}

            </button>

          </aside>

        </form>

      </div>

    </div>

  );

}