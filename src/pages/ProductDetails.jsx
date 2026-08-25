import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import Breadcrumb from '../components/Breadcrumb';
import Icon from '../components/Icon';
import ProductCard from '../components/ProductCard';
import Modal from '../components/Modal';

import {
  getProductById,
  getRelatedProducts,
} from '../data/products';

import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

import { formatCurrency } from '../utils/format';

import './ProductDetails.css';


// ============================================================
// CUSTOMER REVIEWS
// ============================================================

const reviews = [
  {
    name: 'Jonathan Reyes',
    rating: 5,
    date: 'Mar 12, 2026',
    text: 'Exceeded expectations for the price point. Runs smooth under continuous industrial load.',
  },

  {
    name: 'Amara Osei',
    rating: 4,
    date: 'Feb 28, 2026',
    text: 'Solid build quality. Shipping took a little longer than quoted but support kept us updated.',
  },

  {
    name: 'Liu Wei',
    rating: 5,
    date: 'Feb 09, 2026',
    text: 'Specifications matched exactly what was listed. Our maintenance team is impressed.',
  },
];


// ============================================================
// PRODUCT DETAILS
// ============================================================

export default function ProductDetails() {

  const { id } = useParams();

  // ----------------------------------------------------------
  // GET PRODUCT
  // ----------------------------------------------------------

  const product = getProductById(id);


  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------

  const [activeImg, setActiveImg] = useState(0);

  const [qty, setQty] = useState(1);

  const [quoteOpen, setQuoteOpen] = useState(false);


  // ----------------------------------------------------------
  // CONTEXT
  // ----------------------------------------------------------

  const { addToCart } = useCart();

  const {
    toggleWishlist,
    isWishlisted,
  } = useWishlist();


  // ----------------------------------------------------------
  // PRODUCT NOT FOUND
  // ----------------------------------------------------------

  if (!product) {
    return <Navigate to="/shop" replace />;
  }


  // ==========================================================
  // DYNAMIC SEO INFORMATION
  // ==========================================================

  const productTitle =
    `${product.name} | Apex Machinery`;

  const productDescription =
    product.description ||
    `Buy ${product.name} from Apex Machinery. View product specifications, pricing, availability and request a quote.`;

  const productUrl =
    `https://apexmachinery256.com/product/${product.id}`;

  const productImage =
    product.images?.[0] ||
    product.image ||
    'https://apexmachinery256.com/logo.jpg';


  // ==========================================================
  // PRODUCT SCHEMA
  // ==========================================================

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',

    name: product.name,

    description: productDescription,

    image: [productImage],

    sku: product.slug || String(product.id),

    brand: {
      '@type': 'Brand',
      name: 'Apex Machinery',
    },

    category:
      product.categoryName ||
      product.category ||
      'Industrial Equipment',

    ...(product.rating &&
    product.reviewCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: Number(product.rating),
            reviewCount: Number(product.reviewCount),
          },
        }
      : {}),

    ...(product.price !== undefined &&
    product.price !== null
      ? {
          offers: {
            '@type': 'Offer',

            url: productUrl,

            priceCurrency: 'UGX',

            price: Number(product.price),

            availability:
              product.status === 'In Stock'
                ? 'https://schema.org/InStock'
                : product.status === 'Out of Stock'
                  ? 'https://schema.org/OutOfStock'
                  : 'https://schema.org/LimitedAvailability',

            seller: {
              '@type': 'Organization',
              name: 'Apex Machinery',
            },
          },
        }
      : {}),
  };


  // ==========================================================
  // RELATED PRODUCTS
  // ==========================================================

  const related =
    getRelatedProducts(product, 8);


  // ----------------------------------------------------------
  // WISHLIST
  // ----------------------------------------------------------

  const wishlisted =
    isWishlisted(product.id);


  // ----------------------------------------------------------
  // SAFE IMAGES
  // ----------------------------------------------------------

  const productImages =
    product.images?.length
      ? product.images
      : product.image
        ? [product.image]
        : [];


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>

      {/* ======================================================
          SEO
      ====================================================== */}

      <Helmet>

        {/* Page Title */}

        <title>
          {productTitle}
        </title>


        {/* Meta Description */}

        <meta
          name="description"
          content={productDescription}
        />


        {/* Search Engine Instructions */}

        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />

        <meta
          name="googlebot"
          content="index, follow"
        />


        {/* Canonical URL */}

        <link
          rel="canonical"
          href={productUrl}
        />


        {/* ==================================================
            OPEN GRAPH
        ================================================== */}

        <meta
          property="og:type"
          content="product"
        />

        <meta
          property="og:title"
          content={productTitle}
        />

        <meta
          property="og:description"
          content={productDescription}
        />

        <meta
          property="og:url"
          content={productUrl}
        />

        <meta
          property="og:image"
          content={productImage}
        />

        <meta
          property="og:site_name"
          content="Apex Machinery"
        />


        {/* ==================================================
            TWITTER / X
        ================================================== */}

        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content={productTitle}
        />

        <meta
          name="twitter:description"
          content={productDescription}
        />

        <meta
          name="twitter:image"
          content={productImage}
        />


        {/* ==================================================
            PRODUCT STRUCTURED DATA
        ================================================== */}

        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>

      </Helmet>


      {/* ======================================================
          MAIN PRODUCT PAGE
      ====================================================== */}

      <div className="product-details-page">


        {/* ====================================================
            BREADCRUMB
        ==================================================== */}

        <Breadcrumb
          items={[
            {
              to: '/shop',
              label: 'Shop',
            },

            {
              to: `/shop?category=${product.category}`,
              label: product.categoryName,
            },

            {
              label: product.name,
            },
          ]}
        />


        {/* ====================================================
            PRODUCT MAIN SECTION
        ==================================================== */}

        <div className="pd-layout">


          {/* ==================================================
              PRODUCT GALLERY
          ================================================== */}

          <div className="pd-gallery">

            <div className="pd-main-image">

              {productImages.length > 0 ? (

                <img
                  src={productImages[activeImg]}
                  alt={`${product.name} - Apex Machinery`}
                  loading="eager"
                />

              ) : (

                <div className="pd-no-image">
                  No Image Available
                </div>

              )}

            </div>


            {/* ==================================================
                IMAGE THUMBNAILS
            ================================================== */}

            {productImages.length > 1 && (

              <div className="pd-thumbs">

                {productImages.map(
                  (img, i) => (

                    <button
                      key={i}
                      className={
                        i === activeImg
                          ? 'active'
                          : ''
                      }
                      onClick={() =>
                        setActiveImg(i)
                      }
                      type="button"
                      aria-label={`View image ${i + 1} of ${product.name}`}
                    >

                      <img
                        src={img}
                        alt={`${product.name} image ${i + 1}`}
                        loading="lazy"
                      />

                    </button>

                  )
                )}

              </div>

            )}

          </div>


          {/* ==================================================
              PRODUCT INFORMATION
          ================================================== */}

          <div className="pd-info">


            {/* STATUS */}

            <span
              className={`
                badge
                ${
                  product.status === 'In Stock'
                    ? 'badge-instock'
                    : product.status === 'Limited'
                      ? 'badge-limited'
                      : 'badge-outofstock'
                }
              `}
            >
              {product.status}
            </span>


            {/* PRODUCT NAME */}

            <h1>
              {product.name}
            </h1>


            {/* PRODUCT META */}

            <div className="pd-meta">

              <span className="stars">
                ★ {product.rating}
              </span>

              <span>
                ({product.reviewCount} reviews)
              </span>

              <span className="pd-sku">
                SKU: {product.slug.toUpperCase()}
              </span>

            </div>


            {/* PRICE */}

            <div className="pd-price">

              {product.priceDisplay ||
                formatCurrency(product.price)}

            </div>


            {/* DESCRIPTION */}

            <p className="pd-desc">
              {product.description}
            </p>


            {/* ==================================================
                QUANTITY + CART
            ================================================== */}

            <div className="pd-qty-row">


              <div className="pd-qty">

                <button
                  type="button"
                  onClick={() =>
                    setQty(
                      (q) =>
                        Math.max(1, q - 1)
                    )
                  }
                  aria-label="Decrease quantity"
                >

                  <Icon
                    name="minus"
                    size={14}
                  />

                </button>


                <span>
                  {qty}
                </span>


                <button
                  type="button"
                  onClick={() =>
                    setQty(
                      (q) => q + 1
                    )
                  }
                  aria-label="Increase quantity"
                >

                  <Icon
                    name="plus"
                    size={14}
                  />

                </button>

              </div>


              {/* ADD TO CART */}

              <button
                className="btn btn-primary"
                disabled={
                  product.status ===
                  'Out of Stock'
                }
                onClick={() =>
                  addToCart(
                    product,
                    qty
                  )
                }
              >

                <Icon
                  name="cart"
                  size={16}
                />

                Add to Cart

              </button>


              {/* WISHLIST */}

              <button
                className={`
                  btn
                  btn-outline-navy
                  ${
                    wishlisted
                      ? 'active-wish'
                      : ''
                  }
                `}
                onClick={() =>
                  toggleWishlist(
                    product
                  )
                }
                aria-label={
                  wishlisted
                    ? `Remove ${product.name} from wishlist`
                    : `Add ${product.name} to wishlist`
                }
              >

                <Icon
                  name="heart"
                  size={16}
                  fill={wishlisted}
                />

                Wishlist

              </button>

            </div>


            {/* ==================================================
                BUY / QUOTE
            ================================================== */}

            <div className="pd-actions-row">

              <Link
                to="/checkout"
                className="btn btn-gold btn-block"
              >
                Buy Now
              </Link>


              <button
                className="btn btn-outline-navy btn-block"
                onClick={() =>
                  setQuoteOpen(true)
                }
              >
                Request Quote
              </button>

            </div>


            {/* ==================================================
                TRUST INFORMATION
            ================================================== */}

            <div className="pd-trust">

              <div>
                <Icon
                  name="shield"
                  size={18}
                />

                Certified &amp; Warrantied
              </div>


              <div>
                <Icon
                  name="truck"
                  size={18}
                />

                Global Logistics
              </div>


              <div>
                <Icon
                  name="check"
                  size={18}
                />

                Verified Supplier
              </div>

            </div>

          </div>

        </div>


        {/* ======================================================
            SPECIFICATIONS + REVIEWS
        ====================================================== */}

        <div className="pd-tabs">


          {/* ====================================================
              SPECIFICATIONS
          ==================================================== */}

          <section className="pd-specs">

            <h2>
              {product.name} Specifications
            </h2>


            <table>

              <tbody>

                {Object.entries(
                  product.specifications || {}
                ).map(
                  ([key, value]) => (

                    <tr key={key}>

                      <th>
                        {key}
                      </th>

                      <td>
                        {value}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </section>


          {/* ====================================================
              CUSTOMER REVIEWS
          ==================================================== */}

          <section className="pd-reviews">

            <h2>
              Customer Reviews
            </h2>


            {reviews.map(
              (review) => (

                <div
                  key={review.name}
                  className="pd-review"
                >

                  <div className="pd-review-top">

                    <strong>
                      {review.name}
                    </strong>


                    <span className="stars">

                      {'★'.repeat(
                        review.rating
                      )}

                      {'☆'.repeat(
                        5 - review.rating
                      )}

                    </span>


                    <span className="pd-review-date">
                      {review.date}
                    </span>

                  </div>


                  <p>
                    {review.text}
                  </p>

                </div>

              )
            )}

          </section>

        </div>


        {/* ======================================================
            RELATED PRODUCTS
        ====================================================== */}

        {related.length > 0 && (

          <section className="pd-related">

            <div className="pd-related-header">

              <div>

                <span className="section-eyebrow">
                  {product.categoryName}
                </span>

                <h2 className="section-heading">
                  More {product.categoryName}
                </h2>

                <p>
                  Explore other products available
                  in the{' '}
                  {product.categoryName
                    ?.toLowerCase() ||
                    'same'}{' '}
                  category.
                </p>

              </div>


              {/* VIEW ALL CATEGORY */}

              <Link
                to={`/shop?category=${product.category}`}
                className="btn btn-outline-navy"
              >

                View All

                <Icon
                  name="arrow-right"
                  size={16}
                />

              </Link>

            </div>


            {/* ==================================================
                RELATED PRODUCT GRID
            ================================================== */}

            <div className="grid-4">

              {related.map(
                (relatedProduct) => (

                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                  />

                )
              )}

            </div>

          </section>

        )}


        {/* ======================================================
            REQUEST QUOTE MODAL
        ====================================================== */}

        <Modal
          open={quoteOpen}
          onClose={() =>
            setQuoteOpen(false)
          }
          title={`Request a Quote - ${product.name}`}
        >

          <form
            onSubmit={(e) => {

              e.preventDefault();

              setQuoteOpen(false);

            }}
          >


            {/* COMPANY */}

            <div className="field">

              <label>
                Company Name
              </label>

              <input
                required
                placeholder="Your company"
              />

            </div>


            {/* EMAIL */}

            <div className="field">

              <label>
                Work Email
              </label>

              <input
                required
                type="email"
                placeholder="you@company.com"
              />

            </div>


            {/* QUANTITY */}

            <div className="field">

              <label>
                Quantity Needed
              </label>

              <input
                type="number"
                min="1"
                defaultValue={qty}
              />

            </div>


            {/* NOTES */}

            <div className="field">

              <label>
                Notes
              </label>

              <textarea
                rows="3"
                placeholder="Delivery timeline, customization requests, etc."
              />

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              className="btn btn-primary btn-block"
            >
              Submit Quote Request
            </button>

          </form>

        </Modal>

      </div>

    </>
  );
}