import { supabaseAdmin } from '../config/supabase.js';


// ============================================================
// HELPERS
// ============================================================

function cleanString(
  value
) {

  return String(
    value || ''
  ).trim();

}


function normalizeNumber(
  value,
  fallback = 0
) {

  const number =
    Number(value);


  return Number.isFinite(
    number
  )
    ? number
    : fallback;

}


function calculateStockStatus(
  stock,
  reorderLevel
) {

  const quantity =
    normalizeNumber(
      stock,
      0
    );


  const reorder =
    normalizeNumber(
      reorderLevel,
      5
    );


  if (
    quantity <= 0
  ) {

    return 'Out of Stock';

  }


  if (
    quantity <= reorder
  ) {

    return 'Low Stock';

  }


  return 'In Stock';

}


// ============================================================
// NORMALIZE PRODUCT
// ============================================================

function normalizeProduct(
  product
) {

  if (!product) {

    return null;

  }


  const stock =
    normalizeNumber(
      product.stock,
      0
    );


  const reorderLevel =
    normalizeNumber(
      product.reorder_level,
      5
    );


  const stockStatus =
    product.stock_status ||
    calculateStockStatus(
      stock,
      reorderLevel
    );


  const images =
    Array.isArray(
      product.images
    )
      ? product.images
      : [];


  return {

    id:
      product.id,

    name:
      product.name || '',

    slug:
      product.slug || '',

    sku:
      product.sku || '',

    brand:
      product.brand || '',

    price:
      normalizeNumber(
        product.price,
        0
      ),

    stock,

    reorderLevel,

    stockStatus,

    image:
      product.image ||
      images[0] ||
      '',

    images,

    category:
      product.category?.slug ||
      '',

    categoryName:
      product.category?.name ||
      'Uncategorized',

    categoryId:
      product.category?.id ||
      product.category_id ||
      null,

    isActive:
      product.is_active !== false,

    createdAt:
      product.created_at ||
      null,

    updatedAt:
      product.updated_at ||
      null,

  };

}


// ============================================================
// GET ADMIN INVENTORY
//
// GET /api/admin/inventory
// ============================================================

export async function getAdminInventory(
  req,
  res
) {

  try {

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          'products'
        )
        .select(`
          *,
          category:categories (
            id,
            name,
            slug
          )
        `)
        .order(
          'created_at',
          {
            ascending: false,
          }
        );


    if (error) {

      console.error(
        '[ADMIN INVENTORY GET ERROR]',
        {
          message:
            error.message,

          code:
            error.code,

          details:
            error.details,

          hint:
            error.hint,
        }
      );


      return res
        .status(
          500
        )
        .json({

          success:
            false,

          message:
            'Unable to load inventory.',

        });

    }


    const products =
      (data || [])
        .map(
          normalizeProduct
        )
        .filter(
          Boolean
        );


    return res
      .status(
        200
      )
      .json({

        success:
          true,

        data: {
          products,
        },

      });

  } catch (error) {

    console.error(
      '[ADMIN INVENTORY GET ERROR]',
      error
    );


    return res
      .status(
        500
      )
      .json({

        success:
          false,

        message:
          'Server error while loading inventory.',

      });

  }

}


// ============================================================
// UPDATE PRODUCT INVENTORY
//
// PATCH /api/admin/inventory/:id
// ============================================================

export async function updateAdminInventory(
  req,
  res
) {

  try {

    const productId =
      cleanString(
        req.params.id
      );


    if (!productId) {

      return res
        .status(
          400
        )
        .json({

          success:
            false,

          message:
            'Product ID is required.',

        });

    }


    // ========================================================
    // VALIDATE STOCK
    // ========================================================

    const stockInput =
      req.body?.stock;


    const reorderInput =
      req.body
        ?.reorderLevel ??
      req.body
        ?.reorder_level ??
      5;


    let stock =
      Number(
        stockInput
      );


    let reorderLevel =
      Number(
        reorderInput
      );


    if (
      !Number.isFinite(
        stock
      ) ||
      stock < 0
    ) {

      return res
        .status(
          400
        )
        .json({

          success:
            false,

          message:
            'Stock must be zero or greater.',

        });

    }


    if (
      !Number.isFinite(
        reorderLevel
      ) ||
      reorderLevel < 0
    ) {

      return res
        .status(
          400
        )
        .json({

          success:
            false,

          message:
            'Reorder level must be zero or greater.',

        });

    }


    stock =
      Math.floor(
        stock
      );


    reorderLevel =
      Math.floor(
        reorderLevel
      );


    // ========================================================
    // CALCULATE STATUS
    // ========================================================

    const stockStatus =
      calculateStockStatus(
        stock,
        reorderLevel
      );


    // ========================================================
    // UPDATE DATABASE
    // ========================================================

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          'products'
        )
        .update({

          stock,

          reorder_level:
            reorderLevel,

          stock_status:
            stockStatus,

          updated_at:
            new Date()
              .toISOString(),

        })
        .eq(
          'id',
          productId
        )
        .select(`
          *,
          category:categories (
            id,
            name,
            slug
          )
        `)
        .maybeSingle();


    if (error) {

      console.error(
        '[ADMIN INVENTORY UPDATE ERROR]',
        {
          productId,

          message:
            error.message,

          code:
            error.code,

          details:
            error.details,

          hint:
            error.hint,
        }
      );


      return res
        .status(
          500
        )
        .json({

          success:
            false,

          message:
            'Unable to update inventory.',

        });

    }


    if (!data) {

      return res
        .status(
          404
        )
        .json({

          success:
            false,

          message:
            'Product not found.',

        });

    }


    const product =
      normalizeProduct(
        data
      );


    return res
      .status(
        200
      )
      .json({

        success:
          true,

        message:
          'Inventory updated successfully.',

        data: {
          product,
        },

      });

  } catch (error) {

    console.error(
      '[ADMIN INVENTORY UPDATE ERROR]',
      error
    );


    return res
      .status(
        500
      )
      .json({

        success:
          false,

        message:
          'Server error while updating inventory.',

      });

  }

}


// ============================================================
// RESTOCK PRODUCT
//
// POST /api/admin/inventory/:id/restock
// ============================================================

export async function restockAdminProduct(
  req,
  res
) {

  try {

    const productId =
      cleanString(
        req.params.id
      );


    if (!productId) {

      return res
        .status(
          400
        )
        .json({

          success:
            false,

          message:
            'Product ID is required.',

        });

    }


    const quantity =
      Number(
        req.body?.quantity
      );


    if (
      !Number.isFinite(
        quantity
      ) ||
      quantity <= 0
    ) {

      return res
        .status(
          400
        )
        .json({

          success:
            false,

          message:
            'Please provide a valid restock quantity.',

        });

    }


    const safeQuantity =
      Math.floor(
        quantity
      );


    // ========================================================
    // GET CURRENT STOCK
    // ========================================================

    const {
      data: currentProduct,
      error: readError,
    } =
      await supabaseAdmin
        .from(
          'products'
        )
        .select(`
          id,
          stock,
          reorder_level
        `)
        .eq(
          'id',
          productId
        )
        .maybeSingle();


    if (readError) {

      console.error(
        '[ADMIN INVENTORY RESTOCK READ ERROR]',
        {
          productId,

          message:
            readError.message,

          code:
            readError.code,

          details:
            readError.details,

          hint:
            readError.hint,
        }
      );


      return res
        .status(
          500
        )
        .json({

          success:
            false,

          message:
            'Unable to read current inventory.',

        });

    }


    if (!currentProduct) {

      return res
        .status(
          404
        )
        .json({

          success:
            false,

          message:
            'Product not found.',

        });

    }


    // ========================================================
    // CALCULATE NEW STOCK
    // ========================================================

    const currentStock =
      normalizeNumber(
        currentProduct.stock,
        0
      );


    const reorderLevel =
      normalizeNumber(
        currentProduct.reorder_level,
        5
      );


    const newStock =
      currentStock +
      safeQuantity;


    const stockStatus =
      calculateStockStatus(
        newStock,
        reorderLevel
      );


    // ========================================================
    // SAVE NEW STOCK
    // ========================================================

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          'products'
        )
        .update({

          stock:
            newStock,

          stock_status:
            stockStatus,

          updated_at:
            new Date()
              .toISOString(),

        })
        .eq(
          'id',
          productId
        )
        .select(`
          *,
          category:categories (
            id,
            name,
            slug
          )
        `)
        .maybeSingle();


    if (error) {

      console.error(
        '[ADMIN INVENTORY RESTOCK UPDATE ERROR]',
        {
          productId,

          message:
            error.message,

          code:
            error.code,

          details:
            error.details,

          hint:
            error.hint,
        }
      );


      return res
        .status(
          500
        )
        .json({

          success:
            false,

          message:
            'Unable to restock product.',

        });

    }


    if (!data) {

      return res
        .status(
          404
        )
        .json({

          success:
            false,

          message:
            'Product not found after restock.',

        });

    }


    const product =
      normalizeProduct(
        data
      );


    return res
      .status(
        200
      )
      .json({

        success:
          true,

        message:
          `${safeQuantity} unit${
            safeQuantity === 1
              ? ''
              : 's'
          } added successfully.`,

        data: {
          product,
        },

      });

  } catch (error) {

    console.error(
      '[ADMIN INVENTORY RESTOCK ERROR]',
      error
    );


    return res
      .status(
        500
      )
      .json({

        success:
          false,

        message:
          'Server error while restocking product.',

      });

  }

}