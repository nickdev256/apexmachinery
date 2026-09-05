import {
  supabaseAdmin,
} from '../config/supabase.js';

import {
  logActivity,
} from '../utils/activityLogger.js';


// ============================================================
// HELPERS
// ============================================================

function clean(value) {

  return String(
    value ?? ''
  ).trim();

}


function money(value) {

  const number =
    Number(
      value || 0
    );


  return Number.isFinite(
    number
  )
    ? number
    : 0;

}


function isUuid(value) {

  if (!value) {
    return false;
  }


  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(
      value
    ).trim()
  );

}


function normalizeWishlistItem(
  item
) {

  if (!item) {
    return null;
  }


  return {

    id:
      item.id,

    productId:
      item.product_id ||
      item.external_product_id ||
      null,

    databaseProductId:
      item.product_id ||
      null,

    externalProductId:
      item.external_product_id ||
      null,

    name:
      item.product_name ||
      '',

    productName:
      item.product_name ||
      '',

    category:
      item.category ||
      '',

    categoryName:
      item.category ||
      '',

    brand:
      item.brand ||
      '',

    price:
      money(
        item.price
      ),

    image:
      item.image_url ||
      '',

    images:
      item.image_url
        ? [
            item.image_url,
          ]
        : [],

    stock:
      item.stock_status ||
      'Unknown',

    stockStatus:
      item.stock_status ||
      'Unknown',

    createdAt:
      item.created_at ||
      null,

    updatedAt:
      item.updated_at ||
      null,

  };

}


// ============================================================
// GET CUSTOMER WISHLIST
//
// GET /api/customer/wishlist
// ============================================================

export async function getWishlist(
  req,
  res
) {

  try {

    const customerId =
      req.user.id;


    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          'wishlist_items'
        )
        .select('*')
        .eq(
          'customer_id',
          customerId
        )
        .order(
          'created_at',
          {
            ascending:
              false,
          }
        );


    if (error) {

      throw error;

    }


    const items =
      (
        data ||
        []
      )
        .map(
          normalizeWishlistItem
        )
        .filter(Boolean);


    return res.json({

      success:
        true,

      data: {

        items,

        count:
          items.length,

      },

    });

  } catch (error) {

    console.error(
      '[GET WISHLIST ERROR]',
      error
    );


    return res
      .status(500)
      .json({

        success:
          false,

        message:
          'Unable to load wishlist.',

      });

  }

}


// ============================================================
// ADD WISHLIST ITEM
//
// POST /api/customer/wishlist
// ============================================================

export async function addWishlistItem(
  req,
  res
) {

  try {

    const customerId =
      req.user.id;


    const productId =
      req.body.productId ??
      req.body.id;


    const productName =
      clean(
        req.body.productName ??
        req.body.name
      );


    const category =
      clean(
        req.body.categoryName ??
        req.body.category
      );


    const brand =
      clean(
        req.body.brand
      );


    const price =
      money(
        req.body.price
      );


    const image =
      clean(
        req.body.image ??
        req.body.imageUrl ??
        req.body.images?.[0]
      );


    const stockStatus =
      clean(
        req.body.stockStatus ??
        req.body.stock
      ) ||
      'Unknown';


    // ========================================================
    // VALIDATION
    // ========================================================

    if (
      !productName
    ) {

      return res
        .status(400)
        .json({

          success:
            false,

          message:
            'Product name is required.',

        });

    }


    if (
      price < 0
    ) {

      return res
        .status(400)
        .json({

          success:
            false,

          message:
            'Invalid product price.',

        });

    }


    // ========================================================
    // HANDLE PRODUCT ID
    //
    // Real Supabase UUID:
    // product_id = UUID
    //
    // Frontend IDs such as 1, 2, 3:
    // product_id = null
    // external_product_id = "1"
    // ========================================================

    const databaseProductId =
      isUuid(
        productId
      )
        ? String(
            productId
          ).trim()
        : null;


    const externalProductId =
      databaseProductId
        ? null
        : productId !==
          undefined &&
          productId !==
          null
          ? clean(
              productId
            )
          : null;


    // ========================================================
    // CHECK EXISTING ITEM
    // ========================================================

    let existingQuery =
      supabaseAdmin
        .from(
          'wishlist_items'
        )
        .select('*')
        .eq(
          'customer_id',
          customerId
        );


    if (
      databaseProductId
    ) {

      existingQuery =
        existingQuery.eq(
          'product_id',
          databaseProductId
        );

    } else if (
      externalProductId
    ) {

      existingQuery =
        existingQuery.eq(
          'external_product_id',
          externalProductId
        );

    } else {

      existingQuery =
        existingQuery.eq(
          'product_name',
          productName
        );

    }


    const {
      data:
        existing,

      error:
        existingError,
    } =
      await existingQuery
        .limit(1)
        .maybeSingle();


    if (
      existingError
    ) {

      throw existingError;

    }


    // ========================================================
    // ALREADY EXISTS
    // ========================================================

    if (
      existing
    ) {

      return res.json({

        success:
          true,

        data:
          normalizeWishlistItem(
            existing
          ),

        message:
          'Product is already in your wishlist.',

      });

    }


    // ========================================================
    // INSERT
    // ========================================================

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          'wishlist_items'
        )
        .insert({

          customer_id:
            customerId,

          product_id:
            databaseProductId,

          external_product_id:
            externalProductId,

          product_name:
            productName,

          category:
            category ||
            null,

          brand:
            brand ||
            null,

          price,

          image_url:
            image ||
            null,

          stock_status:
            stockStatus,

          updated_at:
            new Date()
              .toISOString(),

        })
        .select('*')
        .single();


    if (error) {

      throw error;

    }


    await logActivity({

      userId:
        customerId,

      action:
        'wishlist_item_added',

      entityType:
        'wishlist_item',

      entityId:
        data.id,

      description:
        `Customer added "${productName}" to wishlist.`,

      metadata: {

        productId:
          databaseProductId,

        externalProductId,

        productName,

        price,

      },

    });


    return res
      .status(201)
      .json({

        success:
          true,

        data:
          normalizeWishlistItem(
            data
          ),

        message:
          'Product added to wishlist.',

      });

  } catch (error) {

    console.error(
      '[ADD WISHLIST ERROR]',
      error
    );


    return res
      .status(500)
      .json({

        success:
          false,

        message:
          error.message ||
          'Unable to add product to wishlist.',

      });

  }

}


// ============================================================
// REMOVE WISHLIST ITEM
//
// DELETE /api/customer/wishlist/:id
//
// :id here is the wishlist row UUID, not the product ID.
// ============================================================

export async function removeWishlistItem(
  req,
  res
) {

  try {

    const customerId =
      req.user.id;


    const {
      id,
    } =
      req.params;


    const {
      data:
        existing,

      error:
        existingError,
    } =
      await supabaseAdmin
        .from(
          'wishlist_items'
        )
        .select('*')
        .eq(
          'id',
          id
        )
        .eq(
          'customer_id',
          customerId
        )
        .maybeSingle();


    if (
      existingError
    ) {

      throw existingError;

    }


    if (
      !existing
    ) {

      return res
        .status(404)
        .json({

          success:
            false,

          message:
            'Wishlist item not found.',

        });

    }


    const {
      error,
    } =
      await supabaseAdmin
        .from(
          'wishlist_items'
        )
        .delete()
        .eq(
          'id',
          id
        )
        .eq(
          'customer_id',
          customerId
        );


    if (error) {

      throw error;

    }


    await logActivity({

      userId:
        customerId,

      action:
        'wishlist_item_removed',

      entityType:
        'wishlist_item',

      entityId:
        id,

      description:
        `Customer removed "${existing.product_name}" from wishlist.`,

    });


    return res.json({

      success:
        true,

      data: {

        id,

      },

      message:
        'Product removed from wishlist.',

    });

  } catch (error) {

    console.error(
      '[REMOVE WISHLIST ERROR]',
      error
    );


    return res
      .status(500)
      .json({

        success:
          false,

        message:
          'Unable to remove wishlist item.',

      });

  }

}


// ============================================================
// CLEAR CUSTOMER WISHLIST
//
// DELETE /api/customer/wishlist
// ============================================================

export async function clearWishlist(
  req,
  res
) {

  try {

    const customerId =
      req.user.id;


    const {
      data:
        existingItems,

      error:
        existingError,
    } =
      await supabaseAdmin
        .from(
          'wishlist_items'
        )
        .select(
          'id'
        )
        .eq(
          'customer_id',
          customerId
        );


    if (
      existingError
    ) {

      throw existingError;

    }


    const removedCount =
      existingItems?.length ||
      0;


    if (
      removedCount ===
      0
    ) {

      return res.json({

        success:
          true,

        data: {

          removedCount:
            0,

        },

      });

    }


    const {
      error,
    } =
      await supabaseAdmin
        .from(
          'wishlist_items'
        )
        .delete()
        .eq(
          'customer_id',
          customerId
        );


    if (error) {

      throw error;

    }


    await logActivity({

      userId:
        customerId,

      action:
        'wishlist_cleared',

      entityType:
        'wishlist',

      entityId:
        customerId,

      description:
        'Customer cleared their wishlist.',

      metadata: {

        removedCount,

      },

    });


    return res.json({

      success:
        true,

      data: {

        removedCount,

      },

      message:
        'Wishlist cleared.',

    });

  } catch (error) {

    console.error(
      '[CLEAR WISHLIST ERROR]',
      error
    );


    return res
      .status(500)
      .json({

        success:
          false,

        message:
          'Unable to clear wishlist.',

      });

  }

}