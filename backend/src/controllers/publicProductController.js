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
    product.category ||
    null;

  return {
    id:
      product.id,

    name:
      product.name,

    slug:
      product.slug,

    brand:
      product.brand ||
      'Apex Machinery',

    description:
      product.description ||
      '',

    price:
      product.price === null
        ? null
        : Number(
            product.price
          ),

    currency:
      product.currency ||
      'UGX',

    priceDisplay:
      product.price_display ||
      (
        product.price !== null
          ? `UGX ${Number(
              product.price
            ).toLocaleString()}`
          : 'Request Quote'
      ),

    stock:
      Number(
        product.stock ||
        0
      ),

    status:
      product.status ||
      (
        Number(
          product.stock ||
          0
        ) > 0
          ? 'In Stock'
          : 'Out of Stock'
      ),

    rating:
      Number(
        product.rating ||
        0
      ),

    reviewCount:
      Number(
        product.review_count ||
        0
      ),

    image:
      product.image_url ||
      '',

    images:
      Array.isArray(
        product.images
      )
        ? product.images
        : [],

    specifications:
      product.specifications &&
      typeof product.specifications ===
        'object'
        ? product.specifications
        : {},

    badges:
      Array.isArray(
        product.badges
      )
        ? product.badges
        : [],

    isFeatured:
      Boolean(
        product.is_featured
      ),

    categoryId:
      product.category_id ||
      category?.id ||
      '',

    category:
      category?.slug ||
      '',

    categoryName:
      category?.name ||
      'Uncategorized',
  };
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
        .from('products')
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
      (data || []).map(
        normalizeProduct
      );

    return res.json({
      success: true,

      data: {
        products,
      },
    });
  } catch (
    error
  ) {
    console.error(
      'Public products error:',
      error
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          error.message ||
          'Unable to load products.',
      });
  }
}


// ============================================================
// GET ONE PUBLIC PRODUCT
// ============================================================

export async function getProduct(
  req,
  res
) {
  try {
    const {
      id,
    } =
      req.params;

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from('products')
        .select(`
          *,
          category:categories (
            id,
            name,
            slug,
            icon
          )
        `)
        .or(
          `id.eq.${id},slug.eq.${id}`
        )
        .eq(
          'is_active',
          true
        )
        .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            'Product not found.',
        });
    }

    return res.json({
      success: true,
      data:
        normalizeProduct(
          data
        ),
    });
  } catch (
    error
  ) {
    console.error(
      'Public product error:',
      error
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          error.message ||
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
        .from('categories')
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
      (data || []).map(
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

    return res.json({
      success: true,

      data: {
        categories,
      },
    });
  } catch (
    error
  ) {
    console.error(
      'Public categories error:',
      error
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          error.message ||
          'Unable to load categories.',
      });
  }
}