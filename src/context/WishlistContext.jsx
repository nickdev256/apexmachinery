import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  getCustomerWishlist,
  addCustomerWishlistItem,
  deleteWishlistItem,
} from '../services/customerApi';

import {
  useAuth,
} from './AuthContext';


const WishlistContext =
  createContext(null);


const STORAGE_KEY =
  'apex_wishlist_v1';


// ============================================================
// LOCAL STORAGE HELPERS
// ============================================================

function loadLocalWishlist() {

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
      '[WISHLIST STORAGE LOAD ERROR]',
      error
    );


    return [];

  }

}


function saveLocalWishlist(
  items
) {

  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items)
    );

  } catch (error) {

    console.error(
      '[WISHLIST STORAGE SAVE ERROR]',
      error
    );

  }

}


// ============================================================
// ID HELPERS
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


function sameProductId(
  first,
  second
) {

  if (
    first === null ||
    first === undefined ||
    second === null ||
    second === undefined
  ) {

    return false;

  }


  return (
    String(first) ===
    String(second)
  );

}


// ============================================================
// NORMALIZE API ITEM
//
// Backend returns:
// id = wishlist row UUID
// productId = original product ID
//
// Frontend expects:
// id = actual product ID
//
// So we preserve both.
// ============================================================

function normalizeWishlistItem(
  item
) {

  if (!item) {

    return null;

  }


  const productId =
    item.productId ??
    item.externalProductId ??
    item.databaseProductId ??
    item.id;


  return {

    ...item,

    id:
      productId,

    productId:
      productId,

    wishlistId:
      item.wishlistId ??
      item.id,

    name:
      item.name ??
      item.productName ??
      '',

    productName:
      item.productName ??
      item.name ??
      '',

    category:
      item.category ??
      item.categoryName ??
      '',

    categoryName:
      item.categoryName ??
      item.category ??
      '',

    image:
      item.image ??
      item.images?.[0] ??
      '',

    images:
      item.images?.length
        ? item.images
        : item.image
          ? [item.image]
          : [],

  };

}


// ============================================================
// PROVIDER
// ============================================================

export function WishlistProvider({
  children,
}) {

  const {
    user,
    loading: authLoading,
  } =
    useAuth();


  const [
    items,
    setItems,
  ] =
    useState(
      loadLocalWishlist
    );


  const [
    loading,
    setLoading,
  ] =
    useState(false);


  const [
    error,
    setError,
  ] =
    useState('');


  const [
    syncing,
    setSyncing,
  ] =
    useState(false);


  // ==========================================================
  // KEEP LOCAL CACHE UPDATED
  // ==========================================================

  useEffect(
    () => {

      saveLocalWishlist(
        items
      );

    },
    [items]
  );


  // ==========================================================
  // LOAD BACKEND WISHLIST
  // ==========================================================

  const refreshWishlist =
    useCallback(
      async () => {

        if (!user) {

          return [];

        }


        try {

          setLoading(true);

          setError('');


          const result =
            await getCustomerWishlist();


          const backendItems =
            Array.isArray(
              result?.items
            )
              ? result.items
                  .map(
                    normalizeWishlistItem
                  )
                  .filter(Boolean)
              : [];


          setItems(
            backendItems
          );


          return backendItems;

        } catch (requestError) {

          console.error(
            '[WISHLIST REFRESH ERROR]',
            requestError
          );


          setError(
            requestError
              ?.response
              ?.data
              ?.message ||
            'Unable to load your wishlist.'
          );


          return [];

        } finally {

          setLoading(false);

        }

      },
      [user]
    );


  // ==========================================================
  // MIGRATE OLD LOCAL WISHLIST TO DATABASE
  //
  // This is useful because you already had products saved
  // before connecting Supabase.
  // ==========================================================

  const migrateLocalWishlist =
    useCallback(
      async () => {

        if (!user) {

          return;

        }


        const localItems =
          loadLocalWishlist();


        // Only migrate old local products.
        // Backend-loaded items already have wishlistId.
        const unsyncedItems =
          localItems.filter(
            (item) =>
              item &&
              !item.wishlistId &&
              getProductId(item)
          );


        if (
          unsyncedItems.length ===
          0
        ) {

          await refreshWishlist();

          return;

        }


        try {

          setSyncing(true);

          setError('');


          for (
            const product
            of unsyncedItems
          ) {

            try {

              await addCustomerWishlistItem(
                product
              );

            } catch (itemError) {

              console.error(
                '[WISHLIST ITEM MIGRATION ERROR]',
                product,
                itemError
              );

            }

          }


          await refreshWishlist();

        } catch (requestError) {

          console.error(
            '[WISHLIST MIGRATION ERROR]',
            requestError
          );


          setError(
            requestError
              ?.response
              ?.data
              ?.message ||
            'Unable to synchronize wishlist.'
          );

        } finally {

          setSyncing(false);

        }

      },
      [
        user,
        refreshWishlist,
      ]
    );


  // ==========================================================
  // SYNC WHEN USER LOGS IN
  // ==========================================================

  useEffect(
    () => {

      if (authLoading) {

        return;

      }


      if (user) {

        migrateLocalWishlist();

      }

    },
    [
      user,
      authLoading,
      migrateLocalWishlist,
    ]
  );


  // ==========================================================
  // CHECK IF PRODUCT IS WISHLISTED
  // ==========================================================

  const isWishlisted =
    useCallback(
      (id) => {

        return items.some(
          (item) =>
            sameProductId(
              getProductId(item),
              id
            )
        );

      },
      [items]
    );


  // ==========================================================
  // ADD PRODUCT
  // ==========================================================

  const addToWishlist =
    useCallback(
      async (
        product
      ) => {

        if (!product) {

          return null;

        }


        const productId =
          getProductId(
            product
          );


        const existing =
          items.find(
            (item) =>
              sameProductId(
                getProductId(item),
                productId
              )
          );


        if (existing) {

          return existing;

        }


        // ----------------------------------------------------
        // GUEST USER
        //
        // Keep wishlist locally.
        // It will automatically migrate after login.
        // ----------------------------------------------------

        if (!user) {

          const localProduct = {

            ...product,

            id:
              productId,

            productId:
              productId,

          };


          setItems(
            (current) => [
              ...current,
              localProduct,
            ]
          );


          return localProduct;

        }


        // ----------------------------------------------------
        // AUTHENTICATED USER
        // Save to backend
        // ----------------------------------------------------

        try {

          setError('');


          const created =
            await addCustomerWishlistItem(
              product
            );


          const normalized =
            normalizeWishlistItem(
              created
            );


          setItems(
            (current) => {

              const alreadyExists =
                current.some(
                  (item) =>
                    sameProductId(
                      getProductId(item),
                      getProductId(
                        normalized
                      )
                    )
                );


              if (alreadyExists) {

                return current;

              }


              return [
                ...current,
                normalized,
              ];

            }
          );


          return normalized;

        } catch (requestError) {

          console.error(
            '[ADD WISHLIST ERROR]',
            requestError
          );


          setError(
            requestError
              ?.response
              ?.data
              ?.message ||
            'Unable to add product to wishlist.'
          );


          throw requestError;

        }

      },
      [
        items,
        user,
      ]
    );


  // ==========================================================
  // REMOVE PRODUCT
  //
  // Accepts product ID OR wishlist row ID.
  // ==========================================================

  const removeFromWishlist =
    useCallback(
      async (
        id
      ) => {

        const existing =
          items.find(
            (item) =>
              sameProductId(
                getProductId(item),
                id
              ) ||
              sameProductId(
                item.wishlistId,
                id
              )
          );


        if (!existing) {

          return;

        }


        // ----------------------------------------------------
        // GUEST / LOCAL ITEM
        // ----------------------------------------------------

        if (
          !user ||
          !existing.wishlistId
        ) {

          setItems(
            (current) =>
              current.filter(
                (item) =>
                  !sameProductId(
                    getProductId(item),
                    getProductId(
                      existing
                    )
                  )
              )
          );


          return;

        }


        // ----------------------------------------------------
        // DATABASE ITEM
        // ----------------------------------------------------

        try {

          setError('');


          await deleteWishlistItem(
            existing.wishlistId
          );


          setItems(
            (current) =>
              current.filter(
                (item) =>
                  !sameProductId(
                    item.wishlistId,
                    existing.wishlistId
                  )
              )
          );

        } catch (requestError) {

          console.error(
            '[REMOVE WISHLIST ERROR]',
            requestError
          );


          setError(
            requestError
              ?.response
              ?.data
              ?.message ||
            'Unable to remove product from wishlist.'
          );


          throw requestError;

        }

      },
      [
        items,
        user,
      ]
    );


  // ==========================================================
  // TOGGLE PRODUCT
  //
  // Existing ProductCard code can keep calling:
  //
  // toggleWishlist(product)
  // ==========================================================

  const toggleWishlist =
    useCallback(
      async (
        product
      ) => {

        if (!product) {

          return;

        }


        const productId =
          getProductId(
            product
          );


        const existing =
          items.find(
            (item) =>
              sameProductId(
                getProductId(item),
                productId
              )
          );


        if (existing) {

          await removeFromWishlist(
            productId
          );


          return {
            added: false,
          };

        }


        const added =
          await addToWishlist(
            product
          );


        return {

          added: true,

          item:
            added,

        };

      },
      [
        items,
        addToWishlist,
        removeFromWishlist,
      ]
    );


  // ==========================================================
  // COUNT
  // ==========================================================

  const count =
    items.length;


  // ==========================================================
  // CONTEXT VALUE
  // ==========================================================

  const value =
    useMemo(
      () => ({

        items,

        count,

        loading:
          loading ||
          syncing,

        error,

        toggleWishlist,

        addToWishlist,

        removeFromWishlist,

        isWishlisted,

        refreshWishlist,

      }),
      [
        items,
        count,
        loading,
        syncing,
        error,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
        refreshWishlist,
      ]
    );


  return (

    <WishlistContext.Provider
      value={value}
    >

      {children}

    </WishlistContext.Provider>

  );

}


// ============================================================
// HOOK
// ============================================================

export function useWishlist() {

  const context =
    useContext(
      WishlistContext
    );


  if (!context) {

    throw new Error(
      'useWishlist must be used within WishlistProvider'
    );

  }


  return context;

}