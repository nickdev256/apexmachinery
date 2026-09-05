import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';


const CartContext =
  createContext(null);


const STORAGE_KEY =
  'apex_cart_v1';


// ============================================================
// LOAD CART
// ============================================================

function loadCart() {

  try {

    const raw =
      localStorage.getItem(
        STORAGE_KEY
      );


    const parsed =
      raw
        ? JSON.parse(raw)
        : [];


    return Array.isArray(parsed)
      ? parsed
      : [];

  } catch (error) {

    console.error(
      '[CART STORAGE LOAD ERROR]',
      error
    );


    return [];

  }

}


// ============================================================
// ID HELPER
// ============================================================

function getProductId(
  product
) {

  return (
    product?.productId ??
    product?.externalProductId ??
    product?.databaseProductId ??
    product?.id ??
    null
  );

}


// ============================================================
// NUMBER HELPER
// ============================================================

function numberValue(
  value
) {

  const number =
    Number(
      value || 0
    );


  return Number.isFinite(number)
    ? number
    : 0;

}


// ============================================================
// PROVIDER
// ============================================================

export function CartProvider({
  children,
}) {

  const [
    items,
    setItems,
  ] =
    useState(
      loadCart
    );


  // ==========================================================
  // SAVE CART LOCALLY
  // ==========================================================

  useEffect(
    () => {

      try {

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(items)
        );

      } catch (error) {

        console.error(
          '[CART STORAGE SAVE ERROR]',
          error
        );

      }

    },
    [items]
  );


  // ==========================================================
  // ADD TO CART
  // ==========================================================

  function addToCart(
    product,
    qty = 1
  ) {

    if (!product) {
      return;
    }


    const productId =
      getProductId(
        product
      );


    if (
      productId ===
        null ||
      productId ===
        undefined
    ) {

      console.error(
        '[CART ERROR] Product ID is missing.',
        product
      );

      return;

    }


    const quantity =
      Math.max(
        1,
        Number(qty) || 1
      );


    setItems(
      (previous) => {

        const existing =
          previous.find(
            (item) =>
              String(item.id) ===
              String(productId)
          );


        if (existing) {

          return previous.map(
            (item) => {

              if (
                String(item.id) ===
                String(productId)
              ) {

                return {

                  ...item,

                  qty:
                    item.qty +
                    quantity,

                };

              }


              return item;

            }
          );

        }


        return [

          ...previous,

          {

            id:
              productId,

            productId:
              productId,

            name:
              product.name ??
              product.productName ??
              'Product',

            price:
              numberValue(
                product.price
              ),

            image:
              product.images?.[0] ??
              product.image ??
              '',

            images:
              product.images?.length
                ? product.images
                : product.image
                  ? [
                      product.image,
                    ]
                  : [],

            category:
              product.categoryName ??
              product.category ??
              '',

            categoryName:
              product.categoryName ??
              product.category ??
              '',

            brand:
              product.brand ??
              '',

            sku:
              product.sku ??
              '',

            stock:
              product.stock ??
              product.stockStatus ??
              '',

            stockStatus:
              product.stockStatus ??
              product.stock ??
              '',

            qty:
              quantity,

          },

        ];

      }
    );

  }


  // ==========================================================
  // REMOVE FROM CART
  // ==========================================================

  function removeFromCart(
    id
  ) {

    setItems(
      (previous) =>
        previous.filter(
          (item) =>
            String(item.id) !==
            String(id)
        )
    );

  }


  // ==========================================================
  // UPDATE QUANTITY
  // ==========================================================

  function updateQty(
    id,
    qty
  ) {

    const quantity =
      Number(qty);


    if (
      !Number.isFinite(
        quantity
      )
    ) {
      return;
    }


    if (
      quantity <= 0
    ) {

      removeFromCart(
        id
      );

      return;

    }


    setItems(
      (previous) =>
        previous.map(
          (item) =>
            String(item.id) ===
            String(id)
              ? {
                  ...item,
                  qty:
                    Math.max(
                      1,
                      Math.floor(
                        quantity
                      )
                    ),
                }
              : item
        )
    );

  }


  // ==========================================================
  // INCREASE QUANTITY
  // ==========================================================

  function increaseQty(
    id
  ) {

    setItems(
      (previous) =>
        previous.map(
          (item) =>
            String(item.id) ===
            String(id)
              ? {
                  ...item,
                  qty:
                    item.qty + 1,
                }
              : item
        )
    );

  }


  // ==========================================================
  // DECREASE QUANTITY
  // ==========================================================

  function decreaseQty(
    id
  ) {

    setItems(
      (previous) =>
        previous
          .map(
            (item) => {

              if (
                String(item.id) !==
                String(id)
              ) {

                return item;

              }


              return {

                ...item,

                qty:
                  item.qty - 1,

              };

            }
          )
          .filter(
            (item) =>
              item.qty > 0
          )
    );

  }


  // ==========================================================
  // CLEAR CART
  // ==========================================================

  function clearCart() {

    setItems([]);

  }


  // ==========================================================
  // CHECK IF PRODUCT IS IN CART
  // ==========================================================

  function isInCart(
    id
  ) {

    return items.some(
      (item) =>
        String(item.id) ===
        String(id)
    );

  }


  // ==========================================================
  // GET PRODUCT QUANTITY
  // ==========================================================

  function getCartQty(
    id
  ) {

    const item =
      items.find(
        (cartItem) =>
          String(cartItem.id) ===
          String(id)
      );


    return item?.qty || 0;

  }


  // ==========================================================
  // SUBTOTAL
  // ==========================================================

  const subtotal =
    useMemo(
      () => {

        return items.reduce(
          (
            total,
            item
          ) => {

            return (
              total +
              numberValue(
                item.price
              ) *
                numberValue(
                  item.qty
                )
            );

          },
          0
        );

      },
      [items]
    );


  // ==========================================================
  // ITEM COUNT
  // ==========================================================

  const itemCount =
    useMemo(
      () => {

        return items.reduce(
          (
            total,
            item
          ) =>
            total +
            numberValue(
              item.qty
            ),
          0
        );

      },
      [items]
    );


  // ==========================================================
  // UNIQUE PRODUCT COUNT
  // ==========================================================

  const productCount =
    items.length;


  // ==========================================================
  // CONTEXT VALUE
  // ==========================================================

  const value = {

    items,

    addToCart,

    removeFromCart,

    updateQty,

    increaseQty,

    decreaseQty,

    clearCart,

    isInCart,

    getCartQty,

    subtotal,

    itemCount,

    productCount,

  };


  return (

    <CartContext.Provider
      value={value}
    >

      {children}

    </CartContext.Provider>

  );

}


// ============================================================
// HOOK
// ============================================================

export function useCart() {

  const context =
    useContext(
      CartContext
    );


  if (!context) {

    throw new Error(
      'useCart must be used within CartProvider'
    );

  }


  return context;

}