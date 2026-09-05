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
      'Out of Stock',

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

    badges:
      Array.isArray(
        product.badges
      )
        ? product.badges
        : [],

    specifications:
      product.specifications ||
      {},

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
// HOME PAGE
// ============================================================

export async function getHomePage(
  req,
  res
) {

  try {

    // ========================================================
    // FETCH ALL HOMEPAGE DATA
    // ========================================================

    const [
      settingsResult,
      statsResult,
      featuredResult,
      categoriesResult,
      brandsResult,
      featuresResult,
      testimonialsResult,

      productsCountResult,
      stockCountResult,
      categoriesCountResult,
      customersCountResult,
      ordersCountResult,
      brandsCountResult,
    ] =
      await Promise.all([


        // ----------------------------------------------------
        // SETTINGS
        // ----------------------------------------------------

        supabaseAdmin
          .from(
            'home_settings'
          )
          .select('*')
          .eq(
            'is_active',
            true
          )
          .order(
            'created_at',
            {
              ascending: false,
            }
          )
          .limit(1)
          .maybeSingle(),


        // ----------------------------------------------------
        // STAT DEFINITIONS
        // ----------------------------------------------------

        supabaseAdmin
          .from(
            'home_stats'
          )
          .select('*')
          .eq(
            'is_active',
            true
          )
          .order(
            'sort_order',
            {
              ascending: true,
            }
          ),


        // ----------------------------------------------------
        // FEATURED PRODUCTS
        // ----------------------------------------------------

        supabaseAdmin
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
          .eq(
            'is_active',
            true
          )
          .eq(
            'is_featured',
            true
          )
          .order(
            'created_at',
            {
              ascending: false,
            }
          )
          .limit(8),


        // ----------------------------------------------------
        // HOME CATEGORIES
        // ----------------------------------------------------

        supabaseAdmin
          .from(
            'home_categories'
          )
          .select(`
            id,
            title,
            description,
            icon,
            image_url,
            sort_order,

            category:categories (
              id,
              name,
              slug,
              description,
              icon
            )
          `)
          .eq(
            'is_active',
            true
          )
          .order(
            'sort_order',
            {
              ascending: true,
            }
          ),


        // ----------------------------------------------------
        // BRANDS
        // ----------------------------------------------------

        supabaseAdmin
          .from(
            'brands'
          )
          .select('*')
          .eq(
            'is_active',
            true
          )
          .order(
            'sort_order',
            {
              ascending: true,
            }
          ),


        // ----------------------------------------------------
        // FEATURES
        // ----------------------------------------------------

        supabaseAdmin
          .from(
            'home_features'
          )
          .select('*')
          .eq(
            'is_active',
            true
          )
          .order(
            'sort_order',
            {
              ascending: true,
            }
          ),


        // ----------------------------------------------------
        // TESTIMONIALS
        // ----------------------------------------------------

        supabaseAdmin
          .from(
            'testimonials'
          )
          .select('*')
          .eq(
            'is_active',
            true
          )
          .order(
            'sort_order',
            {
              ascending: true,
            }
          ),


        // ----------------------------------------------------
        // PRODUCT COUNT
        // ----------------------------------------------------

        supabaseAdmin
          .from(
            'products'
          )
          .select(
            '*',
            {
              count: 'exact',
              head: true,
            }
          )
          .eq(
            'is_active',
            true
          ),


        // ----------------------------------------------------
        // IN STOCK COUNT
        // ----------------------------------------------------

        supabaseAdmin
          .from(
            'products'
          )
          .select(
            '*',
            {
              count: 'exact',
              head: true,
            }
          )
          .eq(
            'is_active',
            true
          )
          .gt(
            'stock',
            0
          ),


        // ----------------------------------------------------
        // CATEGORY COUNT
        // ----------------------------------------------------

        supabaseAdmin
          .from(
            'categories'
          )
          .select(
            '*',
            {
              count: 'exact',
              head: true,
            }
          )
          .eq(
            'status',
            'active'
          ),


        // ----------------------------------------------------
        // CUSTOMER COUNT
        // ----------------------------------------------------

        supabaseAdmin
          .from(
            'profiles'
          )
          .select(
            '*',
            {
              count: 'exact',
              head: true,
            }
          )
          .eq(
            'role',
            'customer'
          ),


        // ----------------------------------------------------
        // ORDER COUNT
        // ----------------------------------------------------

        supabaseAdmin
          .from(
            'orders'
          )
          .select(
            '*',
            {
              count: 'exact',
              head: true,
            }
          ),


        // ----------------------------------------------------
        // BRAND COUNT
        // ----------------------------------------------------

        supabaseAdmin
          .from(
            'brands'
          )
          .select(
            '*',
            {
              count: 'exact',
              head: true,
            }
          )
          .eq(
            'is_active',
            true
          ),

      ]);


    // ========================================================
    // CHECK ERRORS
    // ========================================================

    const results = [
      settingsResult,
      statsResult,
      featuredResult,
      categoriesResult,
      brandsResult,
      featuresResult,
      testimonialsResult,
      productsCountResult,
      stockCountResult,
      categoriesCountResult,
      customersCountResult,
      ordersCountResult,
      brandsCountResult,
    ];


    const failed =
      results.find(
        (
          result
        ) =>
          result.error
      );


    if (
      failed?.error
    ) {
      throw failed.error;
    }


    // ========================================================
    // COUNTS
    // ========================================================

    const counts = {

      products:
        productsCountResult.count ||
        0,

      in_stock:
        stockCountResult.count ||
        0,

      categories:
        categoriesCountResult.count ||
        0,

      customers:
        customersCountResult.count ||
        0,

      orders:
        ordersCountResult.count ||
        0,

      brands:
        brandsCountResult.count ||
        0,

    };


    // ========================================================
    // STATS
    // ========================================================

    const stats =
      (
        statsResult.data ||
        []
      ).map(
        (
          stat
        ) => {

          let value =
            stat.custom_value ||
            '0';


          if (
            stat.stat_type !==
            'custom'
          ) {

            value =
              counts[
                stat.stat_type
              ] ??
              0;

          }


          return {

            id:
              stat.id,

            label:
              stat.label,

            value:
              String(
                value
              ),

            suffix:
              stat.suffix ||
              '',

            type:
              stat.stat_type,

          };

        }
      );


    // ========================================================
    // SETTINGS
    // ========================================================

    const settings =
      settingsResult.data ||
      {};


    // ========================================================
    // FEATURED PRODUCTS
    // ========================================================

    let featuredProducts =
      (
        featuredResult.data ||
        []
      ).map(
        normalizeProduct
      );


    // ========================================================
    // FALLBACK IF NO PRODUCT IS FEATURED
    // ========================================================

    if (
      featuredProducts.length ===
      0
    ) {

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
          .eq(
            'is_active',
            true
          )
          .order(
            'created_at',
            {
              ascending: false,
            }
          )
          .limit(8);


      if (
        error
      ) {
        throw error;
      }


      featuredProducts =
        (
          data ||
          []
        ).map(
          normalizeProduct
        );

    }


    // ========================================================
    // CATEGORIES
    // ========================================================

    const categories =
      (
        categoriesResult.data ||
        []
      ).map(
        (
          item
        ) => {

          const category =
            item.category ||
            {};


          return {

            id:
              item.id,

            categoryId:
              category.id,

            slug:
              category.slug,

            title:
              item.title ||
              category.name,

            description:
              item.description ||
              category.description ||
              '',

            icon:
              item.icon ||
              category.icon ||
              'settings',

            image:
              item.image_url ||
              '',

            link:
              `/shop?category=${category.slug}`,

          };

        }
      );


    // ========================================================
    // BRANDS
    // ========================================================

    const brands =
      (
        brandsResult.data ||
        []
      ).map(
        (
          brand
        ) => ({

          id:
            brand.id,

          name:
            brand.name,

          slug:
            brand.slug,

          logo:
            brand.logo_url ||
            '',

          website:
            brand.website ||
            '',

          description:
            brand.description ||
            '',

        })
      );


    // ========================================================
    // FEATURES
    // ========================================================

    const features =
      (
        featuresResult.data ||
        []
      ).map(
        (
          feature
        ) => ({

          id:
            feature.id,

          icon:
            feature.icon,

          title:
            feature.title,

          text:
            feature.description,

        })
      );


    // ========================================================
    // TESTIMONIALS
    // ========================================================

    const testimonials =
      (
        testimonialsResult.data ||
        []
      ).map(
        (
          testimonial
        ) => ({

          id:
            testimonial.id,

          name:
            testimonial.name,

          role:
            testimonial.role,

          company:
            testimonial.company,

          quote:
            testimonial.quote,

          image:
            testimonial.image_url,

          rating:
            Number(
              testimonial.rating ||
              0
            ),

        })
      );


    // ========================================================
    // RESPONSE
    // ========================================================

    return res.json({

      success: true,

      data: {

        hero: {

          eyebrow:
            settings.hero_eyebrow,

          title:
            settings.hero_title,

          subtitle:
            settings.hero_subtitle,

          image:
            settings.hero_image,

          primaryAction: {

            label:
              settings.hero_primary_label,

            link:
              settings.hero_primary_link,

          },

          secondaryAction: {

            label:
              settings.hero_secondary_label,

            link:
              settings.hero_secondary_link,

          },

        },


        stats,


        about: {

          eyebrow:
            settings.about_eyebrow,

          title:
            settings.about_title,

          description:
            settings.about_description,

          image:
            settings.about_image,

          mission: {

            icon:
              settings.mission_icon,

            title:
              settings.mission_title,

            text:
              settings.mission_text,

          },

          vision: {

            icon:
              settings.vision_icon,

            title:
              settings.vision_title,

            text:
              settings.vision_text,

          },

        },


        featuredSection: {

          eyebrow:
            settings.featured_eyebrow,

          title:
            settings.featured_title,

          products:
            featuredProducts,

        },


        categorySection: {

          eyebrow:
            settings.categories_eyebrow,

          title:
            settings.categories_title,

          categories,

        },


        brandSection: {

          eyebrow:
            settings.brands_eyebrow,

          title:
            settings.brands_title,

          brands,

        },


        featureSection: {

          eyebrow:
            settings.features_eyebrow,

          title:
            settings.features_title,

          features,

        },


        testimonialSection: {

          eyebrow:
            settings.testimonials_eyebrow,

          title:
            settings.testimonials_title,

          testimonials,

        },


        cta: {

          title:
            settings.cta_title,

          description:
            settings.cta_description,

          primaryAction: {

            label:
              settings.cta_primary_label,

            link:
              settings.cta_primary_link,

          },

          secondaryAction: {

            label:
              settings.cta_secondary_label,

            link:
              settings.cta_secondary_link,

          },

        },

      },

    });

  } catch (
    error
  ) {

    console.error(
      '[HOME CONTROLLER]',
      error
    );


    return res
      .status(500)
      .json({

        success: false,

        message:
          error.message ||
          'Unable to load homepage.',

      });

  }

}