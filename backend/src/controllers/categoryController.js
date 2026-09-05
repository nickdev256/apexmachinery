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

  if (
    value === null ||
    value === undefined
  ) {

    return '';

  }

  return String(value).trim();

}


function slugify(value) {

  return clean(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

}


function normalizeStatus(value) {

  return String(
    value || 'active'
  ).toLowerCase() === 'inactive'
    ? 'inactive'
    : 'active';

}


function normalizeCategory(
  category,
  productCount = 0
) {

  if (!category) {

    return null;

  }


  return {

    id:
      category.id,

    name:
      category.name || '',

    slug:
      category.slug || '',

    description:
      category.description || '',

    icon:
      category.icon || 'settings',

    status:
      category.status === 'inactive'
        ? 'Inactive'
        : 'Active',

    rawStatus:
      category.status || 'active',

    products:
      Number(productCount || 0),

    sortOrder:
      Number(
        category.sort_order || 0
      ),

    createdAt:
      category.created_at || null,

    updatedAt:
      category.updated_at || null,

  };

}


// ============================================================
// UNIQUE SLUG
// ============================================================

async function generateUniqueSlug(
  name,
  excludeId = null
) {

  const base =
    slugify(name) ||
    'category';


  let candidate =
    base;

  let number =
    1;


  while (true) {

    let query =
      supabaseAdmin
        .from('categories')
        .select('id')
        .eq(
          'slug',
          candidate
        )
        .limit(1);


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
      await query;


    if (error) {

      throw error;

    }


    if (
      !data ||
      data.length === 0
    ) {

      return candidate;

    }


    candidate =
      `${base}-${number}`;

    number += 1;

  }

}


// ============================================================
// GET CATEGORIES
// GET /api/admin/categories
// ============================================================

export async function getAdminCategories(
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
        .select('*')
        .order(
          'sort_order',
          {
            ascending: true,
          }
        )
        .order(
          'created_at',
          {
            ascending: true,
          }
        );


    if (error) {

      throw error;

    }


    const categories =
      (data || []).map(
        (category) =>
          normalizeCategory(
            category,
            0
          )
      );


    return res.json({

      success:
        true,

      data: {

        categories,

        summary: {

          totalCategories:
            categories.length,

          activeCategories:
            categories.filter(
              (category) =>
                category.status ===
                'Active'
            ).length,

          inactiveCategories:
            categories.filter(
              (category) =>
                category.status ===
                'Inactive'
            ).length,

          totalProducts:
            categories.reduce(
              (
                total,
                category
              ) =>
                total +
                Number(
                  category.products ||
                  0
                ),
              0
            ),

        },

      },

    });

  } catch (error) {

    console.error(
      '[GET ADMIN CATEGORIES ERROR]',
      error
    );


    return res.status(500).json({

      success:
        false,

      message:
        error.message ||
        'Unable to load categories.',

    });

  }

}


// ============================================================
// CREATE CATEGORY
// POST /api/admin/categories
// ============================================================

export async function createAdminCategory(
  req,
  res
) {

  try {

    const name =
      clean(
        req.body?.name
      );


    const description =
      clean(
        req.body?.description
      );


    const icon =
      clean(
        req.body?.icon
      ) ||
      'settings';


    const status =
      normalizeStatus(
        req.body?.status
      );


    if (!name) {

      return res.status(400).json({

        success:
          false,

        message:
          'Category name is required.',

      });

    }


    // --------------------------------------------------------
    // CHECK DUPLICATE NAME
    // --------------------------------------------------------

    const {
      data:
        existingCategories,

      error:
        duplicateError,
    } =
      await supabaseAdmin
        .from('categories')
        .select(
          'id, name'
        )
        .ilike(
          'name',
          name
        )
        .limit(1);


    if (duplicateError) {

      throw duplicateError;

    }


    if (
      existingCategories &&
      existingCategories.length > 0
    ) {

      return res.status(409).json({

        success:
          false,

        message:
          'A category with this name already exists.',

      });

    }


    const slug =
      await generateUniqueSlug(
        name
      );


    // --------------------------------------------------------
    // GET NEXT SORT ORDER
    // --------------------------------------------------------

    const {
      data:
        lastCategory,

      error:
        orderError,
    } =
      await supabaseAdmin
        .from('categories')
        .select(
          'sort_order'
        )
        .order(
          'sort_order',
          {
            ascending: false,
          }
        )
        .limit(1);


    if (orderError) {

      throw orderError;

    }


    const sortOrder =
      Number(
        lastCategory?.[0]
          ?.sort_order ||
        0
      ) + 1;


    // --------------------------------------------------------
    // INSERT
    // --------------------------------------------------------

    const {
      data:
        category,

      error:
        insertError,
    } =
      await supabaseAdmin
        .from('categories')
        .insert({

          name,

          slug,

          description,

          icon,

          status,

          sort_order:
            sortOrder,

          updated_at:
            new Date()
              .toISOString(),

        })
        .select('*')
        .single();


    if (insertError) {

      throw insertError;

    }


    await logActivity({

      userId:
        req.user?.id,

      action:
        'category_created',

      entityType:
        'category',

      entityId:
        category.id,

      description:
        `Created category ${category.name}`,

      metadata: {

        categoryName:
          category.name,

        slug:
          category.slug,

      },

    });


    return res.status(201).json({

      success:
        true,

      message:
        'Category created successfully.',

      data:
        normalizeCategory(
          category,
          0
        ),

    });

  } catch (error) {

    console.error(
      '[CREATE ADMIN CATEGORY ERROR]',
      error
    );


    return res.status(500).json({

      success:
        false,

      message:
        error.message ||
        'Unable to create category.',

    });

  }

}


// ============================================================
// UPDATE CATEGORY
// PATCH /api/admin/categories/:id
// ============================================================

export async function updateAdminCategory(
  req,
  res
) {

  try {

    const categoryId =
      req.params.id;


    const {
      data:
        existing,

      error:
        findError,
    } =
      await supabaseAdmin
        .from('categories')
        .select('*')
        .eq(
          'id',
          categoryId
        )
        .maybeSingle();


    if (findError) {

      throw findError;

    }


    if (!existing) {

      return res.status(404).json({

        success:
          false,

        message:
          'Category not found.',

      });

    }


    const updates = {

      updated_at:
        new Date()
          .toISOString(),

    };


    // --------------------------------------------------------
    // NAME
    // --------------------------------------------------------

    if (
      req.body?.name !==
      undefined
    ) {

      const name =
        clean(
          req.body.name
        );


      if (!name) {

        return res.status(400).json({

          success:
            false,

          message:
            'Category name cannot be empty.',

        });

      }


      if (
        name.toLowerCase() !==
        String(
          existing.name
        ).toLowerCase()
      ) {

        const {
          data:
            duplicate,

          error:
            duplicateError,
        } =
          await supabaseAdmin
            .from('categories')
            .select('id')
            .ilike(
              'name',
              name
            )
            .neq(
              'id',
              categoryId
            )
            .limit(1);


        if (duplicateError) {

          throw duplicateError;

        }


        if (
          duplicate &&
          duplicate.length > 0
        ) {

          return res.status(409).json({

            success:
              false,

            message:
              'A category with this name already exists.',

          });

        }


        updates.name =
          name;


        updates.slug =
          await generateUniqueSlug(
            name,
            categoryId
          );

      }

    }


    // --------------------------------------------------------
    // DESCRIPTION
    // --------------------------------------------------------

    if (
      req.body?.description !==
      undefined
    ) {

      updates.description =
        clean(
          req.body.description
        );

    }


    // --------------------------------------------------------
    // ICON
    // --------------------------------------------------------

    if (
      req.body?.icon !==
      undefined
    ) {

      updates.icon =
        clean(
          req.body.icon
        ) ||
        'settings';

    }


    // --------------------------------------------------------
    // STATUS
    // --------------------------------------------------------

    if (
      req.body?.status !==
      undefined
    ) {

      updates.status =
        normalizeStatus(
          req.body.status
        );

    }


    // --------------------------------------------------------
    // UPDATE
    // --------------------------------------------------------

    const {
      data:
        category,

      error:
        updateError,
    } =
      await supabaseAdmin
        .from('categories')
        .update(
          updates
        )
        .eq(
          'id',
          categoryId
        )
        .select('*')
        .single();


    if (updateError) {

      throw updateError;

    }


    await logActivity({

      userId:
        req.user?.id,

      action:
        'category_updated',

      entityType:
        'category',

      entityId:
        category.id,

      description:
        `Updated category ${category.name}`,

      metadata: {

        categoryName:
          category.name,

        status:
          category.status,

      },

    });


    return res.json({

      success:
        true,

      message:
        'Category updated successfully.',

      data:
        normalizeCategory(
          category,
          0
        ),

    });

  } catch (error) {

    console.error(
      '[UPDATE ADMIN CATEGORY ERROR]',
      error
    );


    return res.status(500).json({

      success:
        false,

      message:
        error.message ||
        'Unable to update category.',

    });

  }

}


// ============================================================
// DELETE CATEGORY
// DELETE /api/admin/categories/:id
// ============================================================

export async function deleteAdminCategory(
  req,
  res
) {

  try {

    const categoryId =
      req.params.id;


    const {
      data:
        category,

      error:
        findError,
    } =
      await supabaseAdmin
        .from('categories')
        .select('*')
        .eq(
          'id',
          categoryId
        )
        .maybeSingle();


    if (findError) {

      throw findError;

    }


    if (!category) {

      return res.status(404).json({

        success:
          false,

        message:
          'Category not found.',

      });

    }


    const {
      error:
        deleteError,
    } =
      await supabaseAdmin
        .from('categories')
        .delete()
        .eq(
          'id',
          categoryId
        );


    if (deleteError) {

      throw deleteError;

    }


    await logActivity({

      userId:
        req.user?.id,

      action:
        'category_deleted',

      entityType:
        'category',

      entityId:
        category.id,

      description:
        `Deleted category ${category.name}`,

      metadata: {

        categoryName:
          category.name,

      },

    });


    return res.json({

      success:
        true,

      message:
        'Category deleted successfully.',

      data: {

        id:
          category.id,

      },

    });

  } catch (error) {

    console.error(
      '[DELETE ADMIN CATEGORY ERROR]',
      error
    );


    return res.status(500).json({

      success:
        false,

      message:
        error.message ||
        'Unable to delete category.',

    });

  }

}