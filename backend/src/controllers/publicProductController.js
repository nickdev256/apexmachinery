import {
  supabaseAdmin,
} from '../config/supabase.js';


// ============================================================
// NORMALIZE PRODUCT
// ============================================================

function normalizeProduct(
  product
) {

  const category =
    product?.category ||
    null;


  const stock =
    Number(
      product?.stock ||
      0
    );


  const price =
    product?.price === null ||
    product?.price === undefined
      ? null
      : Number(
          product.price
        );


  return {

    id:
      product?.id,

    name:
      product?.name ||
      '',

    slug:
      product?.slug ||
      '',

    brand:
      product?.brand ||
      'Apex Machinery',

    description:
      product?.description ||
      '',

    price:

      Number.isFinite(
        price
      )
        ? price
        : null,

    currency:
      product?.currency ||
      'UGX',

    priceDisplay:
      product?.price_display ||
      (
        Number.isFinite(
          price
        )
          ? `UGX ${price.toLocaleString()}`
          : 'Request Quote'
      ),

    stock,

    status:
      product?.status ||
      (
        stock > 0
          ? 'In Stock'
          : 'Out of Stock'
      ),

    rating:
      Number(
        product?.rating ||
        0
      ),

    reviewCount:
      Number(
        product?.review_count ||
        0
      ),

    image:
      product?.image_url ||
      '',

    images:
      Array.isArray(
        product?.images
      )
        ? product.images
        : [],

    specifications:
      product?.specifications &&
      typeof product.specifications ===
        'object'
        ? product.specifications
        : {},

    badges:
      Array.isArray(
        product?.badges
      )
        ? product.badges
        : [],

    isFeatured:
      Boolean(
        product?.is_featured
      ),

    categoryId:
      product?.category_id ||
      category?.id ||
      '',

    category:
      category?.slug ||
      '',

    categorySlug:
      category?.slug ||
      '',

    categoryName:
      category?.name ||
      'Uncategorized',

  };

}


// ============================================================
// UUID CHECK
// ============================================================

function isValidUuid(
  value
) {

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(
      value ||
      ''
    ).trim()
  );

}


// ============================================================
// GET PUBLIC PRODUCTS
// ============================================================

export async function getProducts(
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
            slug,
            icon
          )
        `)
        .eq(
          'is_active',
          true
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


    const products =
      (
        data ||
        []
      ).map(
        normalizeProduct
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


  } catch (
    error
  ) {

    console.error(
      '[PUBLIC PRODUCTS] Error:',
      {
        message:
          error?.message,

        code:
          error?.code,

        details:
          error?.details,
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
          'Unable to load products.',

      });

  }

}


// ============================================================
// GET ONE PUBLIC PRODUCT
//
// Supports:
//
// /api/products/:uuid
// /api/products/:slug
// ============================================================

export async function getProduct(
  req,
  res
) {

  try {

    const identifier =
      String(
        req.params.id ||
        ''
      ).trim();


    // ========================================================
    // VALIDATE IDENTIFIER
    // ========================================================

    if (
      !identifier
    ) {

      return res
        .status(
          400
        )
        .json({

          success:
            false,

          message:
            'Product identifier is required.',

        });

    }


    // ========================================================
    // BASE QUERY
    // ========================================================

    let query =
      supabaseAdmin
        .from(
          'products'
        )
        .select(`
          *,
          category:categories (
            id,
            name,
            slug,
            icon
          )
        `)
        .eq(
          'is_active',
          true
        );


    // ========================================================
    // LOOK UP BY UUID OR SLUG
    // ========================================================

    if (
      isValidUuid(
        identifier
      )
    ) {

      query =
        query.eq(
          'id',
          identifier
        );

    } else {

      query =
        query.eq(
          'slug',
          identifier
        );

    }


    // ========================================================
    // EXECUTE QUERY
    // ========================================================

    const {
      data,
      error,
    } =
      await query
        .maybeSingle();


    if (error) {

      throw error;

    }


    // ========================================================
    // PRODUCT NOT FOUND
    // ========================================================

    if (
      !data
    ) {

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
    // NORMALIZE
    // ========================================================

    const product =
      normalizeProduct(
        data
      );


    // ========================================================
    // SUCCESS
    // ========================================================

    return res
      .status(
        200
      )
      .json({

        success:
          true,

        data: {
          product,
        },

      });


  } catch (
    error
  ) {

    console.error(
      '[PUBLIC PRODUCT] Error:',
      {
        identifier:
          req?.params?.id,

        message:
          error?.message,

        code:
          error?.code,

        details:
          error?.details,
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
          'Unable to load product.',

      });

  }

}


// ============================================================
// GET PUBLIC CATEGORIES
// ============================================================

export async function getCategories(
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
          'categories'
        )
        .select(`
          id,
          name,
          slug,
          description,
          icon,
          status,
          sort_order
        `)
        .eq(
          'status',
          'active'
        )
        .order(
          'sort_order',
          {
            ascending:
              true,
          }
        );


    if (error) {

      throw error;

    }


    const categories =
      (
        data ||
        []
      ).map(
        (
          category
        ) => ({

          id:
            category.slug,

          databaseId:
            category.id,

          name:
            category.name,

          slug:
            category.slug,

          description:
            category.description ||
            '',

          icon:
            category.icon ||
            'settings',

        })
      );


    return res
      .status(
        200
      )
      .json({

        success:
          true,

        data: {
          categories,
        },

      });


  } catch (
    error
  ) {

    console.error(
      '[PUBLIC CATEGORIES] Error:',
      {
        message:
          error?.message,

        code:
          error?.code,

        details:
          error?.details,
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
          'Unable to load categories.',

      });

  }

}