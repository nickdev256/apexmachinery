import 'dotenv/config';

import {
  createClient,
} from '@supabase/supabase-js';

import products from './catalog/products.js';


const supabase =
  createClient(

    process.env.SUPABASE_URL,

    process.env.SUPABASE_SERVICE_ROLE_KEY,

    {
      auth: {
        autoRefreshToken:
          false,

        persistSession:
          false,
      },
    }

  );


// ============================================================
// GET CATEGORIES
// ============================================================

async function getCategoryMap() {

  const {
    data,
    error,
  } =
    await supabase
      .from('categories')
      .select(`
        id,
        slug,
        name
      `);


  if (error) {

    throw error;

  }


  return new Map(
    (data || []).map(
      (
        category
      ) => [
        category.slug,
        category.id,
      ]
    )
  );

}


// ============================================================
// SEED PRODUCTS
// ============================================================

async function seedProducts() {

  console.log(
    '========================================'
  );

  console.log(
    'APEX MACHINERY PRODUCT MIGRATION'
  );

  console.log(
    '========================================'
  );


  const categoryMap =
    await getCategoryMap();


  let created =
    0;

  let updated =
    0;

  let skipped =
    0;


  for (
    const product
    of products
  ) {

    try {

      const categoryId =
        categoryMap.get(
          product.category
        );


      if (!categoryId) {

        console.warn(
          `Skipping ${product.name}: category "${product.category}" was not found.`
        );

        skipped +=
          1;

        continue;

      }


      const record = {

        category_id:
          categoryId,

        name:
          product.name,

        slug:
          product.slug,

        brand:
          product.brand ||
          'Apex Machinery',

        description:
          product.description ||
          null,

        price:
          Number.isFinite(
            Number(
              product.price
            )
          )
            ? Number(
                product.price
              )
            : null,

        currency:
          product.currency ||
          'UGX',

        price_display:
          product.priceDisplay ||
          'Request Quote',

        price_source:
          product.priceSource ||
          null,

        pricing_note:
          product.pricingNote ||
          null,

        original_price:
          Number.isFinite(
            Number(
              product.originalPrice
            )
          )
            ? Number(
                product.originalPrice
              )
            : null,

        original_currency:
          product.originalCurrency ||
          null,

        exchange_rate:
          Number.isFinite(
            Number(
              product.exchangeRate
            )
          )
            ? Number(
                product.exchangeRate
              )
            : null,

        stock:
          Number(
            product.stock ||
            0
          ),

        status:
          product.status ||
          'In Stock',

        rating:
          Number(
            product.rating ||
            0
          ),

        review_count:
          Number(
            product.reviewCount ||
            0
          ),

        image_url:
          product.image ||
          null,

        images:
          Array.isArray(
            product.images
          )
            ? product.images
            : product.image
              ? [
                  product.image,
                ]
              : [],

        specifications:
          product.specifications ||
          {},

        badges:
          Array.isArray(
            product.badges
          )
            ? product.badges
            : [],

        is_featured:
          false,

        is_active:
          true,

        updated_at:
          new Date()
            .toISOString(),

      };


      const {
        data: existing,
        error: existingError,
      } =
        await supabase
          .from('products')
          .select('id')
          .eq(
            'slug',
            product.slug
          )
          .maybeSingle();


      if (existingError) {

        throw existingError;

      }


      if (existing) {

        const {
          error,
        } =
          await supabase
            .from('products')
            .update(
              record
            )
            .eq(
              'id',
              existing.id
            );


        if (error) {

          throw error;

        }


        updated +=
          1;


        console.log(
          `Updated: ${product.name}`
        );

      } else {

        const {
          error,
        } =
          await supabase
            .from('products')
            .insert(
              record
            );


        if (error) {

          throw error;

        }


        created +=
          1;


        console.log(
          `Created: ${product.name}`
        );

      }

    } catch (
      error
    ) {

      skipped +=
        1;


      console.error(
        `Failed: ${product.name}`,
        error.message
      );

    }

  }


  console.log(
    '========================================'
  );

  console.log(
    `Created: ${created}`
  );

  console.log(
    `Updated: ${updated}`
  );

  console.log(
    `Skipped: ${skipped}`
  );

  console.log(
    `Total source products: ${products.length}`
  );

  console.log(
    '========================================'
  );

}


seedProducts()
  .then(
    () => {

      console.log(
        'Product migration completed.'
      );

      process.exit(0);

    }
  )
  .catch(
    (
      error
    ) => {

      console.error(
        'Product migration failed:',
        error
      );

      process.exit(1);

    }
  );