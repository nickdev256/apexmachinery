// ============================================================
// APEXMACH UG
// PRODUCT DETAILS
// ============================================================

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  useParams,
  Link,
  Navigate,
} from 'react-router-dom';

import { Helmet } from 'react-helmet-async';

import Breadcrumb from '../components/Breadcrumb';
import Icon from '../components/Icon';
import ProductCard from '../components/ProductCard';
import Modal from '../components/Modal';

import {
  getProduct,
  getProducts,
} from '../services/productApi';

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
    text:
      'Exceeded expectations for the price point. Runs smooth under continuous industrial load.',
  },

  {
    name: 'Amara Osei',
    rating: 4,
    date: 'Feb 28, 2026',
    text:
      'Solid build quality. Shipping took a little longer than quoted but support kept us updated.',
  },

  {
    name: 'Liu Wei',
    rating: 5,
    date: 'Feb 09, 2026',
    text:
      'Specifications matched exactly what was listed. Our maintenance team is impressed.',
  },
];



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



function getProductObject(data) {

  if (!data) {
    return null;
  }

  if (
    data?.product &&
    typeof data.product === 'object'
  ) {
    return data.product;
  }

  if (
    data?.data?.product &&
    typeof data.data.product === 'object'
  ) {
    return data.data.product;
  }

  if (
    typeof data === 'object' &&
    !Array.isArray(data)
  ) {
    return data;
  }

  return null;

}



function makeAbsoluteImageUrl(image) {

  if (!image) {
    return 'https://www.apexmachinery256.com/logo.jpg';
  }

  if (
    image.startsWith('http://') ||
    image.startsWith('https://')
  ) {
    return image;
  }

  const normalized =
    image.startsWith('/')
      ? image
      : `/${image}`;

  return `https://www.apexmachinery256.com${normalized}`;

}



// ============================================================
// PRODUCT DETAILS
// ============================================================

export default function ProductDetails() {

  const { id } = useParams();



  // ==========================================================
  // STATE
  // ==========================================================

  const [
    product,
    setProduct,
  ] = useState(null);


  const [
    allProducts,
    setAllProducts,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState('');


  const [
    notFound,
    setNotFound,
  ] = useState(false);


  const [
    activeImg,
    setActiveImg,
  ] = useState(0);


  const [
    qty,
    setQty,
  ] = useState(1);


  const [
    quoteOpen,
    setQuoteOpen,
  ] = useState(false);



  // ==========================================================
  // CONTEXT
  // ==========================================================

  const {
    addToCart,
  } = useCart();


  const {
    toggleWishlist,
    isWishlisted,
  } = useWishlist();



  // ==========================================================
  // LOAD PRODUCT FROM BACKEND
  // ==========================================================

  useEffect(
    () => {

      let cancelled = false;


      async function loadProductDetails() {

        try {

          setLoading(true);

          setError('');

          setNotFound(false);

          setActiveImg(0);

          setQty(1);


          // --------------------------------------------------
          // Load selected product
          // --------------------------------------------------

          const productResponse =
            await getProduct(id);


          if (cancelled) {
            return;
          }


          const selectedProduct =
            getProductObject(
              productResponse
            );


          if (!selectedProduct?.id) {

            setNotFound(true);

            setProduct(null);

            return;

          }


          setProduct(
            selectedProduct
          );


          // --------------------------------------------------
          // Load catalogue for related products
          // --------------------------------------------------

          try {

            const productsResponse =
              await getProducts();


            if (cancelled) {
              return;
            }


            setAllProducts(
              getProductsArray(
                productsResponse
              )
            );

          } catch (
            relatedError
          ) {

            console.error(
              'Related products loading error:',
              relatedError
            );


            // Product page can still work even if
            // related products fail to load.
            setAllProducts([]);

          }


        } catch (
          loadError
        ) {

          if (cancelled) {
            return;
          }


          console.error(
            'Product details loading error:',
            loadError
          );


          if (
            loadError?.response?.status === 404
          ) {

            setNotFound(true);

            setProduct(null);

          } else {

            setError(
              loadError?.response?.data?.message ||
              loadError?.message ||
              'Unable to load this product.'
            );

          }


        } finally {

          if (!cancelled) {

            setLoading(false);

          }

        }

      }


      if (id) {

        loadProductDetails();

      } else {

        setLoading(false);

        setNotFound(true);

      }


      return () => {

        cancelled = true;

      };

    },
    [id]
  );



  // ==========================================================
  // RELATED PRODUCTS
  // ==========================================================

  const related =
    useMemo(
      () => {

        if (!product) {
          return [];
        }


        const productCategoryValues =
          [
            product.category,
            product.categoryId,
            product.categorySlug,
            product.categoryName,
          ]
            .filter(Boolean)
            .map(
              (value) =>
                String(value)
                  .trim()
                  .toLowerCase()
            );


        return allProducts
          .filter(
            (item) => {

              if (!item) {
                return false;
              }


              if (
                String(item.id) ===
                String(product.id)
              ) {
                return false;
              }


              const itemCategoryValues =
                [
                  item.category,
                  item.categoryId,
                  item.categorySlug,
                  item.categoryName,
                ]
                  .filter(Boolean)
                  .map(
                    (value) =>
                      String(value)
                        .trim()
                        .toLowerCase()
                  );


              return itemCategoryValues.some(
                (value) =>
                  productCategoryValues.includes(
                    value
                  )
              );

            }
          )
          .slice(
            0,
            8
          );

      },
      [
        allProducts,
        product,
      ]
    );



  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (

      <main className="product-details-page">

        <div className="pd-loading">

          <div className="pd-loading-spinner" />

          <h2>
            Loading product...
          </h2>

          <p>
            Retrieving equipment information.
          </p>

        </div>

      </main>

    );

  }



  // ==========================================================
  // PRODUCT NOT FOUND
  // ==========================================================

  if (notFound) {

    return (
      <Navigate
        to="/shop"
        replace
      />
    );

  }



  // ==========================================================
  // ERROR
  // ==========================================================

  if (
    error ||
    !product
  ) {

    return (

      <main className="product-details-page">

        <div className="pd-error">

          <h2>
            Unable to load product
          </h2>

          <p>
            {
              error ||
              'This product could not be loaded.'
            }
          </p>

          <Link
            to="/shop"
            className="btn btn-primary"
          >
            Back to Shop
          </Link>

        </div>

      </main>

    );

  }



  // ==========================================================
  // PRODUCT DATA
  // ==========================================================

  const wishlisted =
    isWishlisted(
      product.id
    );


  const productImages =
    product.images?.length
      ? product.images
      : product.image
        ? [product.image]
        : [];


  const safeActiveImg =
    activeImg >= productImages.length
      ? 0
      : activeImg;


  const productSlug =
    product.slug ||
    product.id;


  const productTitle =
    `${product.name} | ApexMach UG`;


  const productDescription =
    product.description ||
    `Buy ${product.name} from ApexMach UG. View specifications, pricing and availability or request a quote.`;


  const productUrl =
    `https://www.apexmachinery256.com/product/${productSlug}`;


  const productImage =
    makeAbsoluteImageUrl(
      productImages[0]
    );


  const categoryLabel =
    product.categoryName ||
    product.category ||
    'Industrial Equipment';


  const categoryValue =
    product.category ||
    product.categorySlug ||
    product.categoryId ||
    '';


  const statusClass =
    product.status === 'In Stock'
      ? 'badge-instock'
      : product.status === 'Out of Stock'
        ? 'badge-outofstock'
        : 'badge-limited';


  const outOfStock =
    product.status ===
    'Out of Stock';


  const priceDisplay =
    product.priceDisplay ||
    (
      product.price !== null &&
      product.price !== undefined &&
      Number(product.price) > 0
        ? formatCurrency(
            Number(product.price),
            product.currency ||
              'UGX'
          )
        : 'Request Quote'
    );


  const sku =
    product.slug
      ? product.slug.toUpperCase()
      : String(
          product.id
        ).toUpperCase();



  // ==========================================================
  // PRODUCT SCHEMA
  // ==========================================================

  const productSchema = {

    '@context':
      'https://schema.org',

    '@type':
      'Product',

    name:
      product.name,

    description:
      productDescription,

    image:
      [productImage],

    sku,

    brand: {
      '@type':
        'Brand',

      name:
        product.brand ||
        'ApexMach UG',
    },

    category:
      categoryLabel,


    ...(product.rating &&
    product.reviewCount
      ? {

          aggregateRating: {

            '@type':
              'AggregateRating',

            ratingValue:
              Number(
                product.rating
              ),

            reviewCount:
              Number(
                product.reviewCount
              ),

          },

        }
      : {}),


    ...(product.price !== undefined &&
    product.price !== null &&
    Number(product.price) > 0
      ? {

          offers: {

            '@type':
              'Offer',

            url:
              productUrl,

            priceCurrency:
              product.currency ||
              'UGX',

            price:
              Number(
                product.price
              ),

            availability:
              product.status ===
              'In Stock'
                ? 'https://schema.org/InStock'
                : product.status ===
                    'Out of Stock'
                  ? 'https://schema.org/OutOfStock'
                  : 'https://schema.org/LimitedAvailability',

            seller: {

              '@type':
                'Organization',

              name:
                'ApexMach UG',

            },

          },

        }
      : {}),

  };



  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <>

      {/* ======================================================
          SEO
      ====================================================== */}

      <Helmet>

        <title>
          {productTitle}
        </title>


        <meta
          name="description"
          content={
            productDescription
          }
        />


        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />


        <meta
          name="googlebot"
          content="index, follow"
        />


        <link
          rel="canonical"
          href={
            productUrl
          }
        />


        {/* ====================================================
            OPEN GRAPH
        ==================================================== */}

        <meta
          property="og:type"
          content="product"
        />


        <meta
          property="og:title"
          content={
            productTitle
          }
        />


        <meta
          property="og:description"
          content={
            productDescription
          }
        />


        <meta
          property="og:url"
          content={
            productUrl
          }
        />


        <meta
          property="og:image"
          content={
            productImage
          }
        />


        <meta
          property="og:site_name"
          content="ApexMach UG"
        />


        {/* ====================================================
            TWITTER / X
        ==================================================== */}

        <meta
          name="twitter:card"
          content="summary_large_image"
        />


        <meta
          name="twitter:title"
          content={
            productTitle
          }
        />


        <meta
          name="twitter:description"
          content={
            productDescription
          }
        />


        <meta
          name="twitter:image"
          content={
            productImage
          }
        />


        {/* ====================================================
            STRUCTURED DATA
        ==================================================== */}

        <script
          type="application/ld+json"
        >
          {
            JSON.stringify(
              productSchema
            )
          }
        </script>

      </Helmet>



      {/* ======================================================
          PAGE
      ====================================================== */}

      <main className="product-details-page">


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
              to:
                categoryValue
                  ? `/shop?category=${encodeURIComponent(
                      categoryValue
                    )}`
                  : '/shop',

              label:
                categoryLabel,
            },

            {
              label:
                product.name,
            },
          ]}
        />



        {/* ====================================================
            PRODUCT MAIN AREA
        ==================================================== */}

        <div className="pd-layout">


          {/* ==================================================
              GALLERY
          ================================================== */}

          <div className="pd-gallery">


            <div className="pd-main-image">

              {
                productImages.length >
                0
                  ? (

                    <img
                      src={
                        productImages[
                          safeActiveImg
                        ]
                      }
                      alt={`${product.name} - ApexMach UG`}
                      loading="eager"
                      decoding="async"
                    />

                  )
                  : (

                    <div className="pd-no-image">
                      No Image Available
                    </div>

                  )
              }

            </div>



            {/* ==================================================
                THUMBNAILS
            ================================================== */}

            {
              productImages.length >
              1 && (

                <div className="pd-thumbs">

                  {
                    productImages.map(
                      (
                        img,
                        index
                      ) => (

                        <button
                          key={`${img}-${index}`}
                          type="button"
                          className={
                            index ===
                            safeActiveImg
                              ? 'active'
                              : ''
                          }
                          onClick={
                            () =>
                              setActiveImg(
                                index
                              )
                          }
                          aria-label={`View image ${index + 1} of ${product.name}`}
                        >

                          <img
                            src={
                              img
                            }
                            alt={`${product.name} image ${index + 1}`}
                            loading="lazy"
                            decoding="async"
                          />

                        </button>

                      )
                    )
                  }

                </div>

              )
            }

          </div>



          {/* ==================================================
              PRODUCT INFORMATION
          ================================================== */}

          <div className="pd-info">


            {/* STATUS */}

            <span
              className={`badge ${statusClass}`}
            >
              {
                product.status ||
                'Available on Order'
              }
            </span>



            {/* PRODUCT NAME */}

            <h1>
              {
                product.name
              }
            </h1>



            {/* META */}

            <div className="pd-meta">

              <span className="stars">
                ★{' '}
                {
                  product.rating ??
                  '—'
                }
              </span>


              <span>
                (
                {
                  product.reviewCount ??
                  0
                }{' '}
                reviews)
              </span>


              <span className="pd-sku">
                SKU: {sku}
              </span>

            </div>



            {/* PRICE */}

            <div className="pd-price">
              {
                priceDisplay
              }
            </div>



            {/* DESCRIPTION */}

            <p className="pd-desc">
              {
                product.description ||
                'Product details are available on request.'
              }
            </p>



            {/* ==================================================
                QUANTITY + CART
            ================================================== */}

            <div className="pd-qty-row">


              <div className="pd-qty">

                <button
                  type="button"
                  onClick={
                    () =>
                      setQty(
                        (
                          currentQty
                        ) =>
                          Math.max(
                            1,
                            currentQty -
                              1
                          )
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
                  onClick={
                    () =>
                      setQty(
                        (
                          currentQty
                        ) =>
                          currentQty +
                          1
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
                type="button"
                className="btn btn-primary"
                disabled={
                  outOfStock
                }
                onClick={
                  () =>
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

                {
                  outOfStock
                    ? 'Out of Stock'
                    : 'Add to Cart'
                }

              </button>



              {/* WISHLIST */}

              <button
                type="button"
                className={`
                  btn
                  btn-outline-navy
                  ${
                    wishlisted
                      ? 'active-wish'
                      : ''
                  }
                `}
                onClick={
                  () =>
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
                  fill={
                    wishlisted
                  }
                />

                {
                  wishlisted
                    ? 'Wishlisted'
                    : 'Wishlist'
                }

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
                type="button"
                className="btn btn-outline-navy btn-block"
                onClick={
                  () =>
                    setQuoteOpen(
                      true
                    )
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
              {
                product.name
              }{' '}
              Specifications
            </h2>


            {
              Object.keys(
                product.specifications ||
                {}
              ).length >
              0
                ? (

                  <table>

                    <tbody>

                      {
                        Object.entries(
                          product.specifications
                        ).map(
                          (
                            [
                              key,
                              value,
                            ]
                          ) => (

                            <tr
                              key={
                                key
                              }
                            >

                              <th>
                                {
                                  key
                                }
                              </th>

                              <td>
                                {
                                  String(
                                    value
                                  )
                                }
                              </td>

                            </tr>

                          )
                        )
                      }

                    </tbody>

                  </table>

                )
                : (

                  <p className="pd-desc">
                    Specifications are available on request.
                  </p>

                )
            }

          </section>



          {/* ====================================================
              REVIEWS
          ==================================================== */}

          <section className="pd-reviews">

            <h2>
              Customer Reviews
            </h2>


            {
              reviews.map(
                (
                  review
                ) => (

                  <div
                    key={
                      review.name
                    }
                    className="pd-review"
                  >

                    <div className="pd-review-top">

                      <strong>
                        {
                          review.name
                        }
                      </strong>


                      <span className="stars">

                        {
                          '★'.repeat(
                            review.rating
                          )
                        }

                        {
                          '☆'.repeat(
                            5 -
                            review.rating
                          )
                        }

                      </span>


                      <span className="pd-review-date">
                        {
                          review.date
                        }
                      </span>

                    </div>


                    <p>
                      {
                        review.text
                      }
                    </p>

                  </div>

                )
              )
            }

          </section>

        </div>



        {/* ======================================================
            RELATED PRODUCTS
        ====================================================== */}

        {
          related.length >
          0 && (

            <section className="pd-related">


              <div className="pd-related-header">

                <div>

                  <span className="section-eyebrow">
                    {
                      categoryLabel
                    }
                  </span>


                  <h2 className="section-heading">
                    More{' '}
                    {
                      categoryLabel
                    }
                  </h2>


                  <p>
                    Explore other products available
                    in the{' '}
                    {
                      String(
                        categoryLabel
                      ).toLowerCase()
                    }{' '}
                    category.
                  </p>

                </div>


                <Link
                  to={
                    categoryValue
                      ? `/shop?category=${encodeURIComponent(
                          categoryValue
                        )}`
                      : '/shop'
                  }
                  className="btn btn-outline-navy"
                >

                  View All

                  <Icon
                    name="arrow-right"
                    size={16}
                  />

                </Link>

              </div>



              <div className="grid-4">

                {
                  related.map(
                    (
                      relatedProduct
                    ) => (

                      <ProductCard
                        key={
                          relatedProduct.id
                        }
                        product={
                          relatedProduct
                        }
                      />

                    )
                  )
                }

              </div>

            </section>

          )
        }



        {/* ======================================================
            REQUEST QUOTE MODAL
        ====================================================== */}

        <Modal
          open={
            quoteOpen
          }
          onClose={
            () =>
              setQuoteOpen(
                false
              )
          }
          title={`Request a Quote - ${product.name}`}
        >

          <form
            onSubmit={
              (
                event
              ) => {

                event.preventDefault();

                setQuoteOpen(
                  false
                );

              }
            }
          >


            <div className="field">

              <label
                htmlFor="quote-company"
              >
                Company Name
              </label>

              <input
                id="quote-company"
                required
                placeholder="Your company"
              />

            </div>


            <div className="field">

              <label
                htmlFor="quote-email"
              >
                Work Email
              </label>

              <input
                id="quote-email"
                required
                type="email"
                placeholder="you@company.com"
              />

            </div>


            <div className="field">

              <label
                htmlFor="quote-quantity"
              >
                Quantity Needed
              </label>

              <input
                id="quote-quantity"
                type="number"
                min="1"
                defaultValue={
                  qty
                }
              />

            </div>


            <div className="field">

              <label
                htmlFor="quote-notes"
              >
                Notes
              </label>

              <textarea
                id="quote-notes"
                rows="3"
                placeholder="Delivery timeline, customization requests, etc."
              />

            </div>


            <button
              type="submit"
              className="btn btn-primary btn-block"
            >
              Submit Quote Request
            </button>

          </form>

        </Modal>

      </main>

    </>

  );

}