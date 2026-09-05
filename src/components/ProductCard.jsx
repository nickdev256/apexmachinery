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


  // ----------------------------------------------------------
  // SAFETY
  // ----------------------------------------------------------

  if (!product) {
    return null;
  }


  // ----------------------------------------------------------
  // WISHLIST
  // ----------------------------------------------------------

  const wishlisted =
    isWishlisted(product.id);


  // ----------------------------------------------------------
  // PRODUCT URL
  // Prefer readable slug for SEO
  // ----------------------------------------------------------

  const productPath =
    product.slug
      ? `/product/${product.slug}`
      : `/product/${product.id}`;


  // ----------------------------------------------------------
  // IMAGE
  // ----------------------------------------------------------

  const image =
    product.image ||
    product.image_url ||
    product.images?.[0] ||
    null;


  // ----------------------------------------------------------
  // PRICE
  // ----------------------------------------------------------

  const hasPrice =
    product.price !== null &&
    product.price !== undefined &&
    Number(product.price) > 0;

  const priceDisplay =
    product.priceDisplay ||
    (
      hasPrice
        ? formatCurrency(
            Number(product.price),
            product.currency || "UGX"
          )
        : "Request Quote"
    );


  // ----------------------------------------------------------
  // STATUS
  // ----------------------------------------------------------

  const productStatus =
    product.status ||
    "Available on Order";

  const outOfStock =
    productStatus === "Out of Stock";


  // ----------------------------------------------------------
  // ADD TO CART
  // ----------------------------------------------------------

  const handleAddToCart = () => {

    if (outOfStock) {
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
          to={productPath}
          className="product-card-image-link"
          aria-label={`View ${product.name}`}
        >

          {image ? (

            <img
              src={image}
              alt={product.name || "ApexMach UG product"}
              className="machine-image"
              loading="lazy"
              decoding="async"

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
              statusClass[productStatus] ||
              "badge-limited"
            }
            product-card-badge
          `}
        >

          {productStatus}

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
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
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
            {product.brand || "ApexMach UG"}
          </span>

          <span className="product-card-rating">

            <span
              className="star"
              aria-hidden="true"
            >
              ★
            </span>

            {" "}

            {
              product.rating !== null &&
              product.rating !== undefined
                ? Number(product.rating).toFixed(1)
                : "—"
            }

          </span>

        </div>


        {/* ====================================================
            NAME
        ==================================================== */}

        <Link
          to={productPath}
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
          disabled={outOfStock}
          onClick={handleAddToCart}
        >

          <Icon
            name="shopping-cart"
            size={16}
          />

          {
            outOfStock
              ? "Out of Stock"
              : "Add to Cart"
          }

        </button>

      </div>

    </article>

  );

}