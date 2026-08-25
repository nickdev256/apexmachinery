// ============================================================
// APEX MACHINERY
// PRODUCT CARD
// ============================================================

import { Link } from "react-router-dom";

import Icon from "./Icon";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

import { formatCurrency } from "../utils/format";

import "./ProductCard.css";


// ============================================================
// STATUS CLASSES
// ============================================================

const statusClass = {
  "In Stock": "badge-instock",
  "Limited": "badge-limited",
  "Out of Stock": "badge-outofstock",
  "Available on Order": "badge-limited",
};


// ============================================================
// PRODUCT CARD
// ============================================================

export default function ProductCard({ product }) {

  const { addToCart } = useCart();

  const {
    toggleWishlist,
    isWishlisted,
  } = useWishlist();

  const wishlisted =
    isWishlisted(product.id);


  // ----------------------------------------------------------
  // IMAGE
  // ----------------------------------------------------------

  const image =
    product.image || null;


  // ----------------------------------------------------------
  // PRICE
  // ----------------------------------------------------------

  const priceDisplay =
    product.priceDisplay ||
    (
      product.price
        ? formatCurrency(product.price)
        : "Request Quote"
    );


  // ----------------------------------------------------------
  // ADD TO CART
  // ----------------------------------------------------------

  const handleAddToCart = () => {

    if (
      product.status === "Out of Stock"
    ) {
      return;
    }

    addToCart(product);

  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <article className="product-card">

      {/* ======================================================
          IMAGE
      ====================================================== */}

      <div className="product-card-image">

        <Link
          to={`/product/${product.id}`}
          className="product-card-image-link"
        >

          {image ? (

            <img
              src={image}
              alt={product.name}
              className="machine-image"
              loading="lazy"

              onError={(event) => {

                console.error(
                  "======================================"
                );

                console.error(
                  "APEX MACHINERY IMAGE ERROR"
                );

                console.error(
                  "Machine:",
                  product.name
                );

                console.error(
                  "Image:",
                  image
                );

                console.error(
                  "======================================"
                );

                // Remove broken image
                event.currentTarget.style.display =
                  "none";

              }}
            />

          ) : (

            <div className="product-image-placeholder">

              <Icon
                name="image"
                size={42}
              />

              <span>
                Image unavailable
              </span>

            </div>

          )}

        </Link>


        {/* ====================================================
            STATUS
        ==================================================== */}

        <span
          className={`
            badge
            ${
              statusClass[product.status] ||
              "badge-limited"
            }
            product-card-badge
          `}
        >

          {product.status}

        </span>


        {/* ====================================================
            WISHLIST
        ==================================================== */}

        <button
          type="button"
          className={`
            product-card-wishlist
            ${wishlisted ? "active" : ""}
          `}
          onClick={() =>
            toggleWishlist(product)
          }
          aria-label={
            wishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >

          <Icon
            name="heart"
            size={20}
          />

        </button>

      </div>


      {/* ======================================================
          BODY
      ====================================================== */}

      <div className="product-card-body">


        {/* ====================================================
            BRAND + RATING
        ==================================================== */}

        <div className="product-card-meta">

          <span className="product-card-brand">
            {product.brand}
          </span>

          <span className="product-card-rating">

            <span className="star">
              ★
            </span>

            {" "}

            {product.rating || "—"}

          </span>

        </div>


        {/* ====================================================
            NAME
        ==================================================== */}

        <Link
          to={`/product/${product.id}`}
          className="product-card-name"
        >

          {product.name}

        </Link>


        {/* ====================================================
            CATEGORY
        ==================================================== */}

        {product.categoryName && (

          <div className="product-card-category">

            {product.categoryName}

          </div>

        )}


        {/* ====================================================
            PRICE
        ==================================================== */}

        <div className="product-card-price">

          {priceDisplay}

        </div>


        {/* ====================================================
            ADD TO CART
        ==================================================== */}

        <button
          type="button"
          className="
            btn
            btn-primary
            btn-sm
            btn-block
          "
          disabled={
            product.status ===
            "Out of Stock"
          }
          onClick={handleAddToCart}
        >

          <Icon
            name="shopping-cart"
            size={16}
          />

          {product.status ===
          "Out of Stock"
            ? "Out of Stock"
            : "Add to Cart"}

        </button>

      </div>

    </article>

  );

}