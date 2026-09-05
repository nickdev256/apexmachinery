import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  Link,
} from 'react-router-dom';

import Breadcrumb from '../components/Breadcrumb';
import Icon from '../components/Icon';

import {
  useCart,
} from '../context/CartContext';

import {
  getCustomerWishlist,
  deleteWishlistItem,
  clearCustomerWishlist,
} from '../services/customerApi';

import {
  formatCurrency,
} from '../utils/format';

import './Wishlist.css';


export default function Wishlist() {

  const {
    addToCart,
  } =
    useCart();


  const [
    items,
    setItems,
  ] =
    useState([]);


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    error,
    setError,
  ] =
    useState('');


  const [
    removingId,
    setRemovingId,
  ] =
    useState(null);


  const [
    movingAll,
    setMovingAll,
  ] =
    useState(false);


  // ==========================================================
  // LOAD WISHLIST
  // ==========================================================

  const loadWishlist =
    useCallback(
      async () => {

        try {

          setLoading(
            true
          );

          setError('');


          const result =
            await getCustomerWishlist();


          setItems(
            Array.isArray(
              result?.items
            )
              ? result.items
              : []
          );

        } catch (requestError) {

          console.error(
            '[WISHLIST LOAD ERROR]',
            requestError
          );


          setError(
            requestError
              ?.response
              ?.data
              ?.message ||
            'Unable to load your wishlist.'
          );

        } finally {

          setLoading(
            false
          );

        }

      },
      []
    );


  useEffect(
    () => {

      loadWishlist();

    },
    [
      loadWishlist,
    ]
  );


  // ==========================================================
  // REMOVE ONE ITEM
  // ==========================================================

  async function handleRemove(
    wishlistId
  ) {

    try {

      setRemovingId(
        wishlistId
      );

      setError('');


      await deleteWishlistItem(
        wishlistId
      );


      setItems(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              wishlistId
          )
      );

    } catch (requestError) {

      console.error(
        '[WISHLIST REMOVE ERROR]',
        requestError
      );


      setError(
        requestError
          ?.response
          ?.data
          ?.message ||
        'Unable to remove this product.'
      );

    } finally {

      setRemovingId(
        null
      );

    }

  }


  // ==========================================================
  // ADD ONE ITEM TO CART
  // ==========================================================

  function handleAddToCart(
    product
  ) {

    addToCart({

      id:
        product.productId,

      name:
        product.name,

      category:
        product.category,

      categoryName:
        product.categoryName,

      brand:
        product.brand,

      price:
        product.price,

      image:
        product.image,

      images:
        product.images,

      stock:
        product.stock,

      stockStatus:
        product.stockStatus,

    });

  }


  // ==========================================================
  // MOVE ALL TO CART
  // ==========================================================

  async function moveAllToCart() {

    if (
      items.length ===
      0
    ) {
      return;
    }


    try {

      setMovingAll(
        true
      );

      setError('');


      items.forEach(
        (product) => {

          handleAddToCart(
            product
          );

        }
      );


      await clearCustomerWishlist();


      setItems([]);

    } catch (requestError) {

      console.error(
        '[MOVE ALL WISHLIST ERROR]',
        requestError
      );


      setError(
        requestError
          ?.response
          ?.data
          ?.message ||
        'Some products were added to the cart, but the wishlist could not be cleared.'
      );

    } finally {

      setMovingAll(
        false
      );

    }

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
              label:
                'My Wishlist',
            },
          ]}
        />


        <div className="wishlist-header">

          <div>

            <h1>
              Your Procurement Wishlist
            </h1>


            <p>
              Manage your planned industrial acquisitions
              and move products to your cart when ready.
            </p>

          </div>


          {items.length >
            0 && (

            <button
              type="button"
              className="btn btn-primary"
              onClick={
                moveAllToCart
              }
              disabled={
                movingAll
              }
            >

              <Icon
                name="cart"
                size={16}
              />


              {movingAll
                ? 'Moving...'
                : 'Move All to Cart'}

            </button>

          )}

        </div>


        {error && (

          <div className="wishlist-error">

            <Icon
              name="alert"
              size={16}
            />

            <span>
              {error}
            </span>

          </div>

        )}


        {loading ? (

          <div className="wishlist-empty">

            <Icon
              name="heart"
              size={40}
            />

            <h3>
              Loading wishlist...
            </h3>

          </div>

        ) : items.length ===
          0 ? (

          <div className="wishlist-empty">

            <Icon
              name="heart"
              size={40}
            />


            <h3>
              Your wishlist is empty
            </h3>


            <p>
              Save industrial equipment here to review
              or purchase later.
            </p>


            <Link
              to="/shop"
              className="btn btn-primary"
            >
              Browse Catalog
            </Link>

          </div>

        ) : (

          <div className="grid-4 wishlist-grid">

            {items.map(
              (product) => (

                <div
                  key={
                    product.id
                  }
                  className="wishlist-card card"
                >

                  <button
                    type="button"
                    className="wishlist-remove"
                    onClick={() =>
                      handleRemove(
                        product.id
                      )
                    }
                    disabled={
                      removingId ===
                      product.id
                    }
                    aria-label={`Remove ${product.name}`}
                  >

                    <Icon
                      name="trash"
                      size={16}
                    />

                  </button>


                  <div className="wishlist-card-media">

                    {product.image ? (

                      <img
                        src={
                          product.image
                        }
                        alt={
                          product.name
                        }
                      />

                    ) : (

                      <div className="wishlist-image-placeholder">

                        <Icon
                          name="package"
                          size={30}
                        />

                      </div>

                    )}

                  </div>


                  <div className="wishlist-card-body">

                    <span className="eyebrow">

                      {product.categoryName ||
                        product.category ||
                        'Industrial Equipment'}

                    </span>


                    <h4>
                      {product.name}
                    </h4>


                    {product.brand && (

                      <span className="wishlist-brand">

                        {product.brand}

                      </span>

                    )}


                    <div className="wishlist-price">

                      {formatCurrency(
                        product.price
                      )}

                    </div>


                    <button
                      type="button"
                      className="btn btn-primary btn-block btn-sm"
                      onClick={() =>
                        handleAddToCart(
                          product
                        )
                      }
                    >
                      Add to Cart
                    </button>


                    {product.productId && (

                      <Link
                        to={`/product/${product.productId}`}
                        className="btn btn-outline-navy btn-block btn-sm"
                      >
                        View Details
                      </Link>

                    )}

                  </div>

                </div>

              )
            )}


            <Link
              to="/shop"
              className="wishlist-add-tile"
            >

              <Icon
                name="plus"
                size={24}
              />


              <strong>
                Add More Products
              </strong>


              <span>
                Browse our catalog to add more
                industrial equipment.
              </span>

            </Link>

          </div>

        )}

      </div>

    </div>

  );

}