import {
  useEffect,
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
  getProducts,
} from '../services/productApi';

import {
  formatCurrency,
} from '../utils/format';

import './Cart.css';


// ============================================================
// HELPERS
// ============================================================

function getProductsArray(data) {

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.products)) {
    return data.products;
  }

  if (Array.isArray(data?.data?.products)) {
    return data.data.products;
  }

  return [];

}


// ============================================================
// CART
// ============================================================

export default function Cart() {

  const navigate =
    useNavigate();


  const {
    items = [],
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


  const [
    products,
    setProducts,
  ] =
    useState([]);


  const [
    recommendationsLoading,
    setRecommendationsLoading,
  ] =
    useState(false);


  // ==========================================================
  // CALCULATIONS
  // ==========================================================

  const safeSubtotal =
    Number(
      subtotal ||
      0
    );


  const taxRate =
    0.05;


  const tax =
    Math.round(
      safeSubtotal *
      taxRate
    );


  const shipping =
    0;


  const total =
    safeSubtotal +
    tax +
    shipping;


  // ==========================================================
  // CART COUNTS
  // ==========================================================

  const totalQuantity =
    useMemo(
      () => {

        return items.reduce(
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
  // LOAD PRODUCTS FOR RECOMMENDATIONS
  // ==========================================================

  useEffect(
    () => {

      let cancelled =
        false;


      async function loadProducts() {

        try {

          setRecommendationsLoading(
            true
          );


          const response =
            await getProducts();


          if (cancelled) {
            return;
          }


          setProducts(
            getProductsArray(
              response
            )
          );


        } catch (
          error
        ) {

          if (cancelled) {
            return;
          }


          console.error(
            'Cart recommendations error:',
            error
          );


          setProducts([]);

        } finally {

          if (!cancelled) {

            setRecommendationsLoading(
              false
            );

          }

        }

      }


      loadProducts();


      return () => {

        cancelled =
          true;

      };

    },
    []
  );


  // ==========================================================
  // RECOMMENDED PRODUCTS
  // ==========================================================

  const recommended =
    useMemo(
      () => {

        if (
          products.length ===
          0
        ) {
          return [];
        }


        const cartIds =
          new Set(
            items.map(
              (item) =>
                String(
                  item.id
                )
            )
          );


        const cartCategories =
          new Set(
            items
              .map(
                (item) =>
                  item.category ||
                  item.categorySlug ||
                  item.categoryId
              )
              .filter(Boolean)
              .map(
                (value) =>
                  String(value)
                    .trim()
                    .toLowerCase()
              )
          );


        const available =
          products.filter(
            (product) =>
              !cartIds.has(
                String(
                  product.id
                )
              )
          );


        const related =
          available.filter(
            (product) => {

              const category =
                product.category ||
                product.categorySlug ||
                product.categoryId;


              if (!category) {
                return false;
              }


              return cartCategories.has(
                String(category)
                  .trim()
                  .toLowerCase()
              );

            }
          );


        const featured =
          available.filter(
            (product) =>
              product.isFeatured
          );


        const combined = [
          ...related,
          ...featured,
          ...available,
        ];


        const unique =
          Array.from(
            new Map(
              combined.map(
                (product) => [
                  product.id,
                  product,
                ]
              )
            ).values()
          );


        return unique.slice(
          0,
          4
        );

      },
      [
        products,
        items,
      ]
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


    setPromoMsg(
      'Promo codes are verified during checkout for eligible enterprise accounts.'
    );

  }


  // ==========================================================
  // DECREASE QUANTITY
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
      quantity <=
      1
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
  // INCREASE QUANTITY
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


    if (!confirmed) {
      return;
    }


    clearCart();

  }


  // ==========================================================
  // CHECKOUT
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

    <main className="cart-page">

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
              {
                totalQuantity !==
                1
                  ? 's'
                  : ''
              }

              {' '}in your cart

            </p>

          </div>


          {
            items.length >
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

            )
          }

        </div>


        {/* ==================================================
            EMPTY CART
        ================================================== */}

        {
          items.length ===
          0
            ? (

              <div className="cart-empty">

                <Icon
                  name="cart"
                  size={42}
                />


                <h3>
                  Your cart is empty
                </h3>


                <p>
                  Browse the catalogue to add
                  industrial machinery and equipment
                  to your order.
                </p>


                <Link
                  to="/shop"
                  className="btn btn-primary"
                >
                  Continue Shopping
                </Link>

              </div>

            )
            : (

              <div className="cart-layout">


                {/* ============================================
                    CART ITEMS
                ============================================ */}

                <div className="cart-items">

                  {
                    items.map(
                      (
                        item
                      ) => {

                        const productPath =
                          item.slug
                            ? `/product/${item.slug}`
                            : `/product/${item.id}`;


                        const itemImage =
                          item.image ||
                          item.image_url ||
                          item.images?.[0] ||
                          '/logo.jpg';


                        const quantity =
                          Number(
                            item.qty ||
                            1
                          );


                        const price =
                          Number(
                            item.price ||
                            0
                          );


                        return (

                          <article
                            key={
                              item.id
                            }
                            className="cart-item card"
                          >


                            {/* IMAGE */}

                            <Link
                              to={
                                productPath
                              }
                              className="cart-item-media"
                              aria-label={`View ${item.name}`}
                            >

                              <img
                                src={
                                  itemImage
                                }
                                alt={
                                  item.name
                                }
                                loading="lazy"
                              />

                            </Link>


                            {/* INFORMATION */}

                            <div className="cart-item-body">

                              <span className="eyebrow">

                                {
                                  item.categoryName ||
                                  item.category ||
                                  'Industrial Equipment'
                                }

                              </span>


                              <Link
                                to={
                                  productPath
                                }
                                className="cart-item-name"
                              >

                                {
                                  item.name
                                }

                              </Link>


                              <span className="cart-item-sku">

                                {
                                  item.brand
                                    ? `Brand: ${item.brand}`
                                    : item.slug
                                      ? `SKU: ${item.slug.toUpperCase()}`
                                      : 'ApexMach UG'
                                }

                              </span>

                            </div>


                            {/* QUANTITY */}

                            <div className="cart-item-qty">

                              <button
                                type="button"
                                onClick={
                                  () =>
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
                                {
                                  quantity
                                }
                              </span>


                              <button
                                type="button"
                                onClick={
                                  () =>
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

                                {
                                  item.priceDisplay ||
                                  formatCurrency(
                                    price
                                  )
                                }

                              </strong>


                              {
                                quantity >
                                1 && (

                                  <small>

                                    Total:{' '}

                                    {
                                      formatCurrency(
                                        price *
                                        quantity
                                      )
                                    }

                                  </small>

                                )
                              }

                            </div>


                            {/* REMOVE */}

                            <button
                              type="button"
                              className="cart-item-remove"
                              onClick={
                                () =>
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

                          </article>

                        );

                      }
                    )
                  }


                  {/* ==========================================
                      TRUST CARDS
                  ========================================== */}

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
                          Fast, insured shipping for
                          industrial machinery and
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
                          Procurement orders are securely
                          recorded and tracked through your
                          Apex account.
                        </p>

                      </div>

                    </div>

                  </div>

                </div>


                {/* ============================================
                    ORDER SUMMARY
                ============================================ */}

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
                      {
                        formatCurrency(
                          safeSubtotal
                        )
                      }
                    </strong>

                  </div>


                  <div className="cart-summary-row">

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
                      {
                        formatCurrency(
                          total
                        )
                      }
                    </strong>

                  </div>


                  <p className="cart-summary-note">

                    Express delivery can be selected
                    during checkout and will update
                    the final order total.

                  </p>


                  {/* ==========================================
                      PROMO
                  ========================================== */}

                  <form
                    className="cart-promo"
                    onSubmit={
                      applyPromo
                    }
                  >

                    <label
                      htmlFor="cart-promo"
                    >
                      Have a promo code?
                    </label>


                    <div className="cart-promo-row">

                      <input
                        id="cart-promo"
                        value={
                          promo
                        }
                        onChange={
                          (
                            event
                          ) => {

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


                    {
                      promoMsg && (

                        <p className="cart-promo-msg">
                          {
                            promoMsg
                          }
                        </p>

                      )
                    }

                  </form>


                  {/* ==========================================
                      CHECKOUT
                  ========================================== */}

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


                  <div className="cart-enterprise">

                    <Icon
                      name="package"
                      size={16}
                    />


                    <p>
                      Buying for an organization?
                      Use Enterprise Invoice during
                      checkout and include your
                      purchase order number.
                    </p>

                  </div>

                </aside>

              </div>

            )
        }


        {/* ==================================================
            RECOMMENDED PRODUCTS
        ================================================== */}

        {
          items.length >
          0 && (

            <section className="cart-recommended">

              <div className="cart-recommended-header">

                <div>

                  <span className="eyebrow">
                    You May Also Need
                  </span>


                  <h2 className="section-heading">
                    Recommended for You
                  </h2>

                </div>


                <Link
                  to="/shop"
                  className="btn btn-outline-navy"
                >
                  View All
                </Link>

              </div>


              {
                recommendationsLoading
                  ? (

                    <div className="cart-recommended-loading">
                      Loading recommendations...
                    </div>

                  )
                  : recommended.length >
                    0
                    ? (

                      <div className="cart-recommended-grid">

                        {
                          recommended.map(
                            (
                              product
                            ) => (

                              <ProductCard
                                key={
                                  product.id
                                }
                                product={
                                  product
                                }
                              />

                            )
                          )
                        }

                      </div>

                    )
                    : null
              }

            </section>

          )
        }

      </div>

    </main>

  );

}