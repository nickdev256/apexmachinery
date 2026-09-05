import {
  supabaseAdmin,
} from '../config/supabase.js';


// ============================================================
// HELPERS
// ============================================================

function cleanString(
  value
) {

  return String(
    value ??
    ''
  ).trim();

}


// ============================================================
// UUID CHECK
// ============================================================

function isValidUuid(
  value
) {

  const normalized =
    cleanString(
      value
    );


  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    normalized
  );

}


// ============================================================
// NORMALIZE PRODUCT
// ============================================================

function normalizeProduct(
  product
) {

  if (
    !product
  ) {

    return null;

  }


  const category =
    product.category ||
    null;


  const stockValue =
    Number(
      product.stock ??
      0
    );


  const stock =
    Number.isFinite(
      stockValue
    )
      ? stockValue
      : 0;


  const priceValue =
    product.price === null ||
    product.price === undefined ||
    product.price === ''
      ? null
      : Number(
          product.price
        );


  const price =
    Number.isFinite(
      priceValue
    )
      ? priceValue
      : null;


  const ratingValue =
    Number(
      product.rating ??
      0
    );


  const rating =
    Number.isFinite(
      ratingValue
    )
      ? ratingValue
      : 0;


  const reviewCountValue =
    Number(
      product.review_count ??
      0
    );


  const reviewCount =
    Number.isFinite(
      reviewCountValue
    )
      ? reviewCountValue
      : 0;


  const images =
    Array.isArray(
      product.images
    )
      ? product.images
          .filter(
            Boolean
          )
          .map(
            (
              image
            ) =>
              cleanString(
                image
              )
          )
          .filter(
            Boolean
          )
      : [];


  const primaryImage =
    cleanString(
      product.image_url
    );


  if (
    primaryImage &&
    !images.includes(
      primaryImage
    )
  ) {

    images.unshift(
      primaryImage
    );

  }


  return {

    id:
      product.id,

    name:
      cleanString(
        product.name
      ),

    slug:
      cleanString(
        product.slug
      ),

    brand:
      cleanString(
        product.brand
      ) ||
      'Apex Machinery',

    description:
      cleanString(
        product.description
      ),

    price,

    currency:
      cleanString(
        product.currency
      ) ||
      'UGX',

    priceDisplay:
      cleanString(
        product.price_display
      ) ||
      (
        price !== null
          ? `UGX ${price.toLocaleString()}`
          : 'Request Quote'
      ),

    stock,

    status:
      cleanString(
        product.status
      ) ||
      (
        stock > 0
          ? 'In Stock'
          : 'Out of Stock'
      ),

    rating,

    reviewCount,

    image:
      primaryImage ||
      images[0] ||
      '',

    images,

    specifications:
      product.specifications &&
      typeof product.specifications ===
        'object' &&
      !Array.isArray(
        product.specifications
      )
        ? product.specifications
        : {},

    badges:
      Array.isArray(
        product.badges
      )
        ? product.badges
            .filter(
              Boolean
            )
        : [],

    isFeatured:
      Boolean(
        product.is_featured
      ),

    isActive:
      Boolean(
        product.is_active
      ),

    categoryId:
      product.category_id ||
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

    createdAt:
      product.created_at ||
      null,

    updatedAt:
      product.updated_at ||
      null,

  };

}


// ============================================================
// GET PUBLIC PRODUCTS
// GET /api/products
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


    if (
      error
    ) {

      console.error(
        '[PUBLIC PRODUCTS] Supabase error:',
        {
          message:
            error?.message,

          code:
            error?.code,

          details:
            error?.details,

          hint:
            error?.hint,
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
            error?.message ||
            'Unable to load products.',

          code:
            error?.code ||
            null,

          details:
            error?.details ||
            null,

          hint:
            error?.hint ||
            null,

        });

    }


    const products =
      (
        data ||
        []
      )
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


  } catch (
    error
  ) {

    console.error(
      '[PUBLIC PRODUCTS] Unexpected error:',
      {
        message:
          error?.message,

        stack:
          error?.stack,
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
          error?.message ||
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
      cleanString(
        req.params.id
      );


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


    const lookupType =
      isValidUuid(
        identifier
      )
        ? 'id'
        : 'slug';


    console.log(
      '[PUBLIC PRODUCT] Lookup:',
      {
        identifier,
        lookupType,
      }
    );


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
    // SAFE UUID OR SLUG LOOKUP
    // ========================================================

    if (
      lookupType ===
      'id'
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
        .limit(
          1
        )
        .maybeSingle();


    // ========================================================
    // DATABASE ERROR
    // ========================================================

    if (
      error
    ) {

      console.error(
        '[PUBLIC PRODUCT] Supabase error:',
        {
          identifier,
          lookupType,

          message:
            error?.message,

          code:
            error?.code,

          details:
            error?.details,

          hint:
            error?.hint,
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
            error?.message ||
            'Unable to load product.',

          code:
            error?.code ||
            null,

          details:
            error?.details ||
            null,

          hint:
            error?.hint ||
            null,

          identifier,

          lookupType,

        });

    }


    // ========================================================
    // PRODUCT NOT FOUND
    // ========================================================

    if (
      !data
    ) {

      console.warn(
        '[PUBLIC PRODUCT] Not found:',
        {
          identifier,
          lookupType,
        }
      );


      return res
        .status(
          404
        )
        .json({

          success:
            false,

          message:
            'Product not found.',

          identifier,

          lookupType,

        });

    }


    // ========================================================
    // NORMALIZE
    // ========================================================

    const product =
      normalizeProduct(
        data
      );


    if (
      !product
    ) {

      return res
        .status(
          500
        )
        .json({

          success:
            false,

          message:
            'Product could not be normalized.',

        });

    }


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
      '[PUBLIC PRODUCT] Unexpected error:',
      {
        identifier:
          req?.params?.id,

        message:
          error?.message,

        code:
          error?.code,

        details:
          error?.details,

        hint:
          error?.hint,

        stack:
          error?.stack,
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
          error?.message ||
          'Unable to load product.',

        code:
          error?.code ||
          null,

        details:
          error?.details ||
          null,

        hint:
          error?.hint ||
          null,

      });

  }

}


// ============================================================
// GET PUBLIC CATEGORIES
// GET /api/products/categories
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


    if (
      error
    ) {

      console.error(
        '[PUBLIC CATEGORIES] Supabase error:',
        {
          message:
            error?.message,

          code:
            error?.code,

          details:
            error?.details,

          hint:
            error?.hint,
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
            error?.message ||
            'Unable to load categories.',

          code:
            error?.code ||
            null,

          details:
            error?.details ||
            null,

          hint:
            error?.hint ||
            null,

        });

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
      '[PUBLIC CATEGORIES] Unexpected error:',
      {
        message:
          error?.message,

        code:
          error?.code,

        details:
          error?.details,

        hint:
          error?.hint,

        stack:
          error?.stack,
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
          error?.message ||
          'Unable to load categories.',

      });

  }

}