import { supabaseAdmin } from '../config/supabase.js';
import { logActivity } from '../utils/activityLogger.js';


// ============================================================
// HELPERS
// ============================================================

const clean = (value) =>
  String(value ?? '').trim();


const makeSlug = (value) =>
  clean(value)
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');


const toNumber = (
  value,
  fallback = 0
) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};


const normalizeProduct = (
  product
) => {
  if (!product) {
    return null;
  }

  const category =
    product.category || null;

  return {
    id: product.id,

    name: product.name,

    slug: product.slug,

    brand:
      product.brand ||
      'Apex Machinery',

    description:
      product.description || '',

    price:
      product.price === null
        ? null
        : Number(product.price),

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

    priceSource:
      product.price_source ||
      null,

    pricingNote:
      product.pricing_note ||
      null,

    originalPrice:
      product.original_price ===
      null
        ? null
        : Number(
            product.original_price
          ),

    originalCurrency:
      product.original_currency ||
      null,

    exchangeRate:
      product.exchange_rate ===
      null
        ? null
        : Number(
            product.exchange_rate
          ),

    stock:
      Number(
        product.stock || 0
      ),

    status:
      product.status ||
      (
        Number(
          product.stock || 0
        ) > 0
          ? 'In Stock'
          : 'Out of Stock'
      ),

    rating:
      Number(
        product.rating || 0
      ),

    reviewCount:
      Number(
        product.review_count || 0
      ),

    image:
      product.image_url || '',

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

    isActive:
      Boolean(
        product.is_active
      ),

    categoryId:
      product.category_id ||
      category?.id ||
      '',

    category:
      category?.slug || '',

    categoryName:
      category?.name ||
      'Uncategorized',

    createdAt:
      product.created_at,

    updatedAt:
      product.updated_at,
  };
};


// ============================================================
// UNIQUE SLUG
// ============================================================

async function generateUniqueSlug(
  name,
  excludeId = null
) {
  const base =
    makeSlug(name) ||
    `product-${Date.now()}`;

  let candidate =
    base;

  let suffix =
    2;

  while (true) {
    let query =
      supabaseAdmin
        .from('products')
        .select('id')
        .eq(
          'slug',
          candidate
        );

    if (excludeId) {
      query =
        query.neq(
          'id',
          excludeId
        );
    }

    const {
      data,
      error,
    } =
      await query.maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return candidate;
    }

    candidate =
      `${base}-${suffix}`;

    suffix +=
      1;
  }
}


// ============================================================
// VERIFY CATEGORY
// ============================================================

async function verifyCategory(
  categoryId
) {
  if (!categoryId) {
    return null;
  }

  const {
    data,
    error,
  } =
    await supabaseAdmin
      .from('categories')
      .select(
        'id, name, slug'
      )
      .eq(
        'id',
        categoryId
      )
      .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}


// ============================================================
// GET PRODUCTS
// ============================================================

export async function getAdminProducts(
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
            slug
          )
        `)
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

    const totalProducts =
      products.length;

    const inStock =
      products.filter(
        (product) =>
          product.status ===
            'In Stock' &&
          product.stock > 0
      ).length;

    const outOfStock =
      products.filter(
        (product) =>
          product.status ===
            'Out of Stock' ||
          product.stock <= 0
      ).length;

    const totalUnits =
      products.reduce(
        (
          total,
          product
        ) =>
          total +
          Number(
            product.stock || 0
          ),
        0
      );

    return res.json({
      success: true,

      data: {
        products,

        summary: {
          totalProducts,
          inStock,
          outOfStock,
          totalUnits,
        },
      },
    });
  } catch (error) {
    console.error(
      'Get admin products error:',
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
// GET ONE PRODUCT
// ============================================================

export async function getAdminProduct(
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
            slug
          )
        `)
        .eq(
          'id',
          id
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
  } catch (error) {
    console.error(
      'Get admin product error:',
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
// CREATE PRODUCT
// ============================================================

export async function createAdminProduct(
  req,
  res
) {
  try {
    const {
      name,
      categoryId,
      brand,
      price,
      stock,
      status,
      description,
      image,
      images,
      specifications,
      badges,
      isFeatured,
    } =
      req.body;

    if (!clean(name)) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            'Product name is required.',
        });
    }

    if (!categoryId) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            'Product category is required.',
        });
    }

    const category =
      await verifyCategory(
        categoryId
      );

    if (!category) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            'Selected category does not exist.',
        });
    }

    const slug =
      await generateUniqueSlug(
        name
      );

    const stockValue =
      Math.max(
        0,
        toNumber(
          stock,
          0
        )
      );

    const productStatus =
      stockValue > 0
        ? 'In Stock'
        : 'Out of Stock';

    const priceValue =
      clean(price) === ''
        ? null
        : Math.max(
            0,
            toNumber(
              price,
              0
            )
          );

    const imageUrl =
      clean(image) ||
      (
        Array.isArray(
          images
        ) &&
        images.length > 0
          ? clean(
              images[0]
            )
          : null
      );

    const imageList =
      Array.isArray(
        images
      )
        ? images
            .map(clean)
            .filter(Boolean)
        : imageUrl
          ? [imageUrl]
          : [];

    const record = {
      category_id:
        categoryId,

      name:
        clean(name),

      slug,

      brand:
        clean(brand) ||
        'Apex Machinery',

      description:
        clean(description) ||
        null,

      price:
        priceValue,

      currency:
        'UGX',

      price_display:
        priceValue === null
          ? 'Request Quote'
          : `UGX ${Number(
              priceValue
            ).toLocaleString()}`,

      price_source:
        'Admin',

      stock:
        stockValue,

      status:
        productStatus,

      image_url:
        imageUrl,

      images:
        imageList,

      specifications:
        specifications &&
        typeof specifications ===
          'object'
          ? specifications
          : {},

      badges:
        Array.isArray(
          badges
        )
          ? badges
          : [],

      is_featured:
        Boolean(
          isFeatured
        ),

      is_active:
        true,

      updated_at:
        new Date()
          .toISOString(),
    };

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from('products')
        .insert(
          record
        )
        .select(`
          *,
          category:categories (
            id,
            name,
            slug
          )
        `)
        .single();

    if (error) {
      throw error;
    }

    await logActivity({
      userId:
        req.user?.id,

      action:
        'product_created',

      entityType:
        'product',

      entityId:
        data.id,

      description:
        `Created product ${data.name}.`,

      metadata: {
        categoryId:
          data.category_id,

        price:
          data.price,

        stock:
          data.stock,
      },
    });

    return res
      .status(201)
      .json({
        success: true,

        message:
          'Product created successfully.',

        data:
          normalizeProduct(
            data
          ),
      });
  } catch (error) {
    console.error(
      'Create product error:',
      error
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          error.message ||
          'Unable to create product.',
      });
  }
}


// ============================================================
// UPDATE PRODUCT
// ============================================================

export async function updateAdminProduct(
  req,
  res
) {
  try {
    const {
      id,
    } =
      req.params;

    const {
      data: current,
      error:
        currentError,
    } =
      await supabaseAdmin
        .from('products')
        .select('*')
        .eq(
          'id',
          id
        )
        .maybeSingle();

    if (currentError) {
      throw currentError;
    }

    if (!current) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            'Product not found.',
        });
    }

    const body =
      req.body || {};

    const updates = {
      updated_at:
        new Date()
          .toISOString(),
    };

    if (
      Object.prototype
        .hasOwnProperty.call(
          body,
          'name'
        )
    ) {
      const name =
        clean(
          body.name
        );

      if (!name) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              'Product name cannot be empty.',
          });
      }

      updates.name =
        name;

      if (
        name !==
        current.name
      ) {
        updates.slug =
          await generateUniqueSlug(
            name,
            id
          );
      }
    }

    if (
      Object.prototype
        .hasOwnProperty.call(
          body,
          'categoryId'
        )
    ) {
      const category =
        await verifyCategory(
          body.categoryId
        );

      if (!category) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              'Selected category does not exist.',
          });
      }

      updates.category_id =
        body.categoryId;
    }

    if (
      Object.prototype
        .hasOwnProperty.call(
          body,
          'brand'
        )
    ) {
      updates.brand =
        clean(
          body.brand
        ) ||
        'Apex Machinery';
    }

    if (
      Object.prototype
        .hasOwnProperty.call(
          body,
          'description'
        )
    ) {
      updates.description =
        clean(
          body.description
        ) ||
        null;
    }

    if (
      Object.prototype
        .hasOwnProperty.call(
          body,
          'price'
        )
    ) {
      const price =
        clean(
          body.price
        ) === ''
          ? null
          : Math.max(
              0,
              toNumber(
                body.price,
                0
              )
            );

      updates.price =
        price;

      updates.price_display =
        price === null
          ? 'Request Quote'
          : `UGX ${Number(
              price
            ).toLocaleString()}`;
    }

    if (
      Object.prototype
        .hasOwnProperty.call(
          body,
          'stock'
        )
    ) {
      const stock =
        Math.max(
          0,
          toNumber(
            body.stock,
            0
          )
        );

      updates.stock =
        stock;

      updates.status =
        stock > 0
          ? 'In Stock'
          : 'Out of Stock';
    }

    if (
      Object.prototype
        .hasOwnProperty.call(
          body,
          'status'
        ) &&
      !Object.prototype
        .hasOwnProperty.call(
          body,
          'stock'
        )
    ) {
      if (
        body.status ===
        'Out of Stock'
      ) {
        updates.status =
          'Out of Stock';

        updates.stock =
          0;
      } else if (
        body.status ===
        'In Stock'
      ) {
        updates.status =
          'In Stock';

        updates.stock =
          Math.max(
            1,
            Number(
              current.stock || 0
            )
          );
      }
    }

    if (
      Object.prototype
        .hasOwnProperty.call(
          body,
          'image'
        )
    ) {
      updates.image_url =
        clean(
          body.image
        ) ||
        null;
    }

    if (
      Object.prototype
        .hasOwnProperty.call(
          body,
          'images'
        )
    ) {
      updates.images =
        Array.isArray(
          body.images
        )
          ? body.images
              .map(clean)
              .filter(Boolean)
          : [];
    }

    if (
      Object.prototype
        .hasOwnProperty.call(
          body,
          'specifications'
        )
    ) {
      updates.specifications =
        body.specifications &&
        typeof body.specifications ===
          'object'
          ? body.specifications
          : {};
    }

    if (
      Object.prototype
        .hasOwnProperty.call(
          body,
          'badges'
        )
    ) {
      updates.badges =
        Array.isArray(
          body.badges
        )
          ? body.badges
          : [];
    }

    if (
      Object.prototype
        .hasOwnProperty.call(
          body,
          'isFeatured'
        )
    ) {
      updates.is_featured =
        Boolean(
          body.isFeatured
        );
    }

    if (
      Object.prototype
        .hasOwnProperty.call(
          body,
          'isActive'
        )
    ) {
      updates.is_active =
        Boolean(
          body.isActive
        );
    }

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from('products')
        .update(
          updates
        )
        .eq(
          'id',
          id
        )
        .select(`
          *,
          category:categories (
            id,
            name,
            slug
          )
        `)
        .single();

    if (error) {
      throw error;
    }

    await logActivity({
      userId:
        req.user?.id,

      action:
        'product_updated',

      entityType:
        'product',

      entityId:
        id,

      description:
        `Updated product ${data.name}.`,

      metadata:
        updates,
    });

    return res.json({
      success: true,

      message:
        'Product updated successfully.',

      data:
        normalizeProduct(
          data
        ),
    });
  } catch (error) {
    console.error(
      'Update product error:',
      error
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          error.message ||
          'Unable to update product.',
      });
  }
}


// ============================================================
// DELETE PRODUCT
// ============================================================

export async function deleteAdminProduct(
  req,
  res
) {
  try {
    const {
      id,
    } =
      req.params;

    const {
      data: product,
      error:
        findError,
    } =
      await supabaseAdmin
        .from('products')
        .select(
          'id, name'
        )
        .eq(
          'id',
          id
        )
        .maybeSingle();

    if (findError) {
      throw findError;
    }

    if (!product) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            'Product not found.',
        });
    }

    const {
      error,
    } =
      await supabaseAdmin
        .from('products')
        .delete()
        .eq(
          'id',
          id
        );

    if (error) {
      throw error;
    }

    await logActivity({
      userId:
        req.user?.id,

      action:
        'product_deleted',

      entityType:
        'product',

      entityId:
        id,

      description:
        `Deleted product ${product.name}.`,
    });

    return res.json({
      success: true,

      message:
        'Product deleted successfully.',
    });
  } catch (error) {
    console.error(
      'Delete product error:',
      error
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          error.message ||
          'Unable to delete product.',
      });
  }
}