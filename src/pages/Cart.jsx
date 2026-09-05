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
import ProductCard from '../components/ProductCard';

import {
  useCart,
} from '../context/CartContext';

import {
  getFeaturedProducts,
} from '../data/products';

import {
  formatCurrency,
} from '../utils/format';

import './Cart.css';


// ============================================================
// CART
// ============================================================

export default function Cart() {

  const navigate =
    useNavigate();


  const {
    items,
    updateQty,
    removeFromCart,
    subtotal,
    clearCart,
  } =
    useCart();


  const [
    promo,
    setPromo,
  ] =
    useState('');


  const [
    promoMsg,
    setPromoMsg,
  ] =
    useState('');


  // ==========================================================
  // CALCULATIONS
  // ==========================================================

  const taxRate =
    0.05;


  const tax =
    Math.round(
      Number(
        subtotal || 0
      ) *
      taxRate
    );


  // Standard shipping stays free.
  // Express shipping is chosen later at checkout.
  const shipping =
    0;


  const total =
    Number(
      subtotal || 0
    ) +
    tax +
    shipping;


  // ==========================================================
  // CART COUNTS
  // ==========================================================

  const totalQuantity =
    useMemo(
      () => {

        return (
          items || []
        ).reduce(
          (
            totalItems,
            item
          ) =>
            totalItems +
            Number(
              item.qty ||
              0
            ),
          0
        );

      },
      [
        items,
      ]
    );


  // ==========================================================
  // RECOMMENDED PRODUCTS
  // ==========================================================

  const recommended =
    useMemo(
      () =>
        getFeaturedProducts(
          4
        ),
      []
    );


  // ==========================================================
  // APPLY PROMO
  // ==========================================================

  function applyPromo(
    event
  ) {

    event.preventDefault();


    const code =
      promo
        .trim()
        .toUpperCase();


    if (!code) {

      setPromoMsg('');

      return;

    }


    // Promo validation will later be handled by the backend.
    setPromoMsg(
      'Promo codes are verified during checkout for eligible enterprise accounts.'
    );

  }


  // ==========================================================
  // QUANTITY DECREASE
  // ==========================================================

  function decreaseQuantity(
    item
  ) {

    const quantity =
      Number(
        item.qty ||
        1
      );


    if (
      quantity <= 1
    ) {

      removeFromCart(
        item.id
      );

      return;

    }


    updateQty(
      item.id,
      quantity - 1
    );

  }


  // ==========================================================
  // QUANTITY INCREASE
  // ==========================================================

  function increaseQuantity(
    item
  ) {

    updateQty(
      item.id,
      Number(
        item.qty ||
        0
      ) + 1
    );

  }


  // ==========================================================
  // CLEAR CART
  // ==========================================================

  function handleClearCart() {

    if (
      items.length ===
      0
    ) {
      return;
    }


    const confirmed =
      window.confirm(
        'Remove all items from your cart?'
      );


    if (
      !confirmed
    ) {
      return;
    }


    clearCart();

  }


  // ==========================================================
  // GO TO CHECKOUT
  // ==========================================================

  function proceedToCheckout() {

    if (
      items.length ===
      0
    ) {
      return;
    }


    navigate(
      '/checkout'
    );

  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="section">

      <div className="container">


        {/* ==================================================
            BREADCRUMB
        ================================================== */}

        <Breadcrumb
          items={[
            {
              label:
                'Cart',
            },
          ]}
        />


        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="cart-header">

          <div>

            <h1 className="cart-title">
              Shopping Cart
            </h1>


            <p className="cart-count">

              {totalQuantity}{' '}

              item
              {totalQuantity !==
              1
                ? 's'
                : ''}

              {' '}in your cart

            </p>

          </div>


          {items.length >
            0 && (

            <button
              type="button"
              className="cart-clear-button"
              onClick={
                handleClearCart
              }
            >

              <Icon
                name="trash"
                size={16}
              />

              Clear Cart

            </button>

          )}

        </div>


        {/* ==================================================
            EMPTY CART
        ================================================== */}

        {items.length ===
        0 ? (

          <div className="cart-empty">

            <Icon
              name="cart"
              size={40}
            />


            <h3>
              Your cart is empty
            </h3>


            <p>
              Browse the catalog to add
              industrial equipment and
              tools to your procurement
              order.
            </p>


            <Link
              to="/shop"
              className="btn btn-primary"
            >
              Continue Shopping
            </Link>

          </div>

        ) : (

          // ==================================================
          // CART LAYOUT
          // ==================================================

          <div className="cart-layout">


            {/* ================================================
                CART ITEMS
            ================================================ */}

            <div className="cart-items">

              {items.map(
                (item) => (

                  <div
                    key={
                      item.id
                    }
                    className="cart-item card"
                  >


                    {/* IMAGE */}

                    <div className="cart-item-media">

                      <img
                        src={
                          item.image
                        }
                        alt={
                          item.name
                        }
                      />

                    </div>


                    {/* INFORMATION */}

                    <div className="cart-item-body">

                      <span className="eyebrow">

                        {item.category ||
                          'Industrial Equipment'}

                      </span>


                      <Link
                        to={`/product/${item.id}`}
                        className="cart-item-name"
                      >

                        {item.name}

                      </Link>


                      <span className="cart-item-sku">

                        {item.brand
                          ? `Brand: ${item.brand}`
                          : item.sku
                            ? `SKU: ${item.sku}`
                            : 'Apex Machinery'}

                      </span>

                    </div>


                    {/* QUANTITY */}

                    <div className="cart-item-qty">

                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(
                            item
                          )
                        }
                        aria-label={`Decrease quantity of ${item.name}`}
                      >

                        <Icon
                          name="minus"
                          size={14}
                        />

                      </button>


                      <span>
                        {item.qty}
                      </span>


                      <button
                        type="button"
                        onClick={() =>
                          increaseQuantity(
                            item
                          )
                        }
                        aria-label={`Increase quantity of ${item.name}`}
                      >

                        <Icon
                          name="plus"
                          size={14}
                        />

                      </button>

                    </div>


                    {/* PRICE */}

                    <div className="cart-item-price">

                      <span className="cart-item-unit">
                        Unit Price
                      </span>


                      <strong>
                        {formatCurrency(
                          item.price
                        )}
                      </strong>


                      {Number(
                        item.qty ||
                        1
                      ) > 1 && (

                        <small>

                          Total:{' '}

                          {formatCurrency(
                            Number(
                              item.price ||
                              0
                            ) *
                            Number(
                              item.qty ||
                              0
                            )
                          )}

                        </small>

                      )}

                    </div>


                    {/* REMOVE */}

                    <button
                      type="button"
                      className="cart-item-remove"
                      onClick={() =>
                        removeFromCart(
                          item.id
                        )
                      }
                      aria-label={`Remove ${item.name}`}
                    >

                      <Icon
                        name="trash"
                        size={18}
                      />

                    </button>

                  </div>

                )
              )}


              {/* ==============================================
                  TRUST CARDS
              ============================================== */}

              <div className="cart-trust">

                <div className="card cart-trust-card">

                  <Icon
                    name="truck"
                    size={22}
                  />


                  <div>

                    <strong>
                      Reliable Logistics
                    </strong>

                    <p>
                      Fast, insured
                      shipping for
                      industrial
                      machinery and
                      equipment.
                    </p>

                  </div>

                </div>


                <div className="card cart-trust-card">

                  <Icon
                    name="shield"
                    size={22}
                  />


                  <div>

                    <strong>
                      Buyer Protection
                    </strong>

                    <p>
                      Procurement orders
                      are securely
                      recorded and
                      tracked through
                      your Apex account.
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* ================================================
                ORDER SUMMARY
            ================================================ */}

            <aside className="cart-summary card">

              <h3>

                <Icon
                  name="package"
                  size={18}
                />

                Order Summary

              </h3>


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
                  Tax (5%)
                </span>

                <strong>
                  {formatCurrency(
                    tax
                  )}
                </strong>

              </div>


              <div className="cart-summary-row">

                <span>
                  Standard Shipping
                </span>

                <strong>
                  FREE
                </strong>

              </div>


              <div className="cart-summary-total">

                <span>
                  Estimated Total
                </span>

                <strong>
                  {formatCurrency(
                    total
                  )}
                </strong>

              </div>


              <p className="cart-summary-note">

                Express delivery can be
                selected during checkout
                and will update the final
                order total.

              </p>


              {/* ==============================================
                  PROMO CODE
              ============================================== */}

              <form
                className="cart-promo"
                onSubmit={
                  applyPromo
                }
              >

                <label>
                  Have a promo code?
                </label>


                <div className="cart-promo-row">

                  <input
                    value={
                      promo
                    }
                    onChange={
                      (event) => {

                        setPromo(
                          event.target.value
                        );

                        setPromoMsg(
                          ''
                        );

                      }
                    }
                    placeholder="PROMO2026"
                  />


                  <button
                    type="submit"
                    className="btn btn-outline-navy btn-sm"
                  >
                    Apply
                  </button>

                </div>


                {promoMsg && (

                  <p className="cart-promo-msg">

                    {promoMsg}

                  </p>

                )}

              </form>


              {/* ==============================================
                  CHECKOUT
              ============================================== */}

              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={
                  proceedToCheckout
                }
              >

                Proceed to Checkout

                <Icon
                  name="arrowRight"
                  size={16}
                />

              </button>


              <Link
                to="/shop"
                className="cart-continue"
              >
                Continue Shopping
              </Link>


              {/* ==============================================
                  ENTERPRISE
              ============================================== */}

              <div className="cart-enterprise">

                <Icon
                  name="package"
                  size={16}
                />


                <p>
                  Buying for an
                  organization? Use
                  Enterprise Invoice
                  during checkout and
                  include your purchase
                  order number.
                </p>

              </div>

            </aside>

          </div>

        )}


        {/* ==================================================
            RECOMMENDED PRODUCTS
        ================================================== */}

        {items.length >
          0 && (

          <section className="cart-recommended">

            <h2 className="section-heading">
              Recommended for You
            </h2>


            <div className="grid-4">

              {recommended.map(
                (product) => (

                  <ProductCard
                    key={
                      product.id
                    }
                    product={
                      product
                    }
                  />

                )
              )}

            </div>

          </section>

        )}

      </div>

    </div>

  );

}