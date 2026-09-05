import {
  supabaseAdmin,
  supabaseAuth,
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


// ============================================================
// UUID VALIDATION
//
// Frontend products currently use IDs such as:
//
// 1
// 2
// 3
//
// But Supabase order_items.product_id expects UUID.
//
// Until products are stored in Supabase, only actual UUID
// values are allowed through. Other IDs become null.
// ============================================================

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


function formatOrderStatus(
  status
) {

  const value =
    String(
      status || ''
    )
      .trim()
      .toLowerCase();


  const map = {
    pending:
      'Pending',

    processing:
      'Processing',

    shipped:
      'Shipped',

    in_transit:
      'In Transit',

    delivered:
      'Delivered',

    cancelled:
      'Cancelled',
  };


  return (
    map[value] ||
    status ||
    'Pending'
  );

}


function formatInvoiceStatus(
  status
) {

  const value =
    String(
      status || ''
    )
      .trim()
      .toLowerCase();


  const map = {
    pending:
      'Pending',

    due_soon:
      'Due Soon',

    paid:
      'Paid',

    overdue:
      'Overdue',

    cancelled:
      'Cancelled',
  };


  return (
    map[value] ||
    status ||
    'Pending'
  );

}


function normalizeProfile(
  profile
) {

  if (!profile) {
    return null;
  }


  return {
    id:
      profile.id,

    name:
      profile.name || '',

    company:
      profile.company || '',

    email:
      profile.email || '',

    phone:
      profile.phone || '',

    role:
      profile.role || 'customer',

    memberSince:
      profile.member_since ||
      profile.created_at ||
      null,

    updatedAt:
      profile.updated_at ||
      null,
  };

}


function normalizeAddress(
  address
) {

  if (!address) {
    return null;
  }


  return {
    id:
      address.id,

    title:
      address.title || '',

    name:
      address.contact_name || '',

    company:
      address.company || '',

    address:
      address.address || '',

    city:
      address.city || '',

    phone:
      address.phone || '',

    default:
      Boolean(
        address.is_default
      ),

    createdAt:
      address.created_at ||
      null,

    updatedAt:
      address.updated_at ||
      null,
  };

}


function normalizeOrderItem(
  item
) {

  return {
    id:
      item.id,

    productId:
      item.product_id ||
      null,

    name:
      item.product_name ||
      '',

    productName:
      item.product_name ||
      '',

    sku:
      item.sku || '',

    quantity:
      Number(
        item.quantity ||
        0
      ),

    unitPrice:
      money(
        item.unit_price
      ),

    totalPrice:
      money(
        item.total_price
      ),
  };

}


function normalizeOrder(
  order
) {

  const items =
    (
      order.order_items ||
      []
    ).map(
      normalizeOrderItem
    );


  return {
    id:
      order.order_number,

    databaseId:
      order.id,

    items:
      `${items.length} ${
        items.length === 1
          ? 'Item'
          : 'Items'
      }`,

    itemCount:
      items.length,

    orderItems:
      items,

    status:
      formatOrderStatus(
        order.status
      ),

    rawStatus:
      order.status,

    subtotal:
      money(
        order.subtotal
      ),

    deliveryFee:
      money(
        order.delivery_fee
      ),

    total:
      money(
        order.total
      ),

    currency:
      order.currency ||
      'UGX',

    date:
      order.created_at,

    createdAt:
      order.created_at,

    updatedAt:
      order.updated_at,

    priority:
      order.priority ||
      'medium',

    estimatedDeliveryDate:
      order.estimated_delivery_date ||
      null,

    notes:
      order.notes || '',

    shippingAddress:
      order.shipping_address ||
      null,
  };

}


function normalizeInvoice(
  invoice
) {

  return {
    id:
      invoice.invoice_number,

    databaseId:
      invoice.id,

    orderId:
      invoice.order_id,

    amount:
      money(
        invoice.amount
      ),

    currency:
      invoice.currency ||
      'UGX',

    date:
      invoice.issue_date,

    due:
      invoice.due_date,

    paidAt:
      invoice.paid_at ||
      null,

    status:
      formatInvoiceStatus(
        invoice.status
      ),

    rawStatus:
      invoice.status,

    createdAt:
      invoice.created_at,

    updatedAt:
      invoice.updated_at,
  };

}


function normalizeWishlistItem(
  item
) {

  return {
    id:
      item.id,

    productId:
      item.product_id,

    name:
      item.product_name ||
      '',

    category:
      item.category || '',

    price:
      money(
        item.price
      ),

    stock:
      item.stock_status ||
      'Unknown',

    createdAt:
      item.created_at,
  };

}


function normalizeNotification(
  notification
) {

  return {
    id:
      notification.id,

    title:
      notification.title ||
      '',

    text:
      notification.message ||
      '',

    type:
      notification.type ||
      'general',

    read:
      Boolean(
        notification.is_read
      ),

    createdAt:
      notification.created_at,
  };

}


function normalizePreferences(
  preferences
) {

  return {
    orderUpdates:
      preferences
        ?.order_updates ??
      true,

    inventoryAlerts:
      preferences
        ?.inventory_alerts ??
      true,

    invoiceReminders:
      preferences
        ?.invoice_reminders ??
      true,

    marketing:
      preferences
        ?.marketing ??
      false,
  };

}


// ============================================================
// DASHBOARD
// ============================================================

export async function dashboard(
  req,
  res
) {

  try {

    const customerId =
      req.user.id;


    const [
      profileResult,
      addressesResult,
      ordersResult,
      invoicesResult,
      wishlistResult,
      notificationsResult,
      preferencesResult,
      creditResult,
      creditTransactionsResult,
    ] =
      await Promise.all([

        supabaseAdmin
          .from('profiles')
          .select('*')
          .eq(
            'id',
            customerId
          )
          .single(),


        supabaseAdmin
          .from(
            'customer_addresses'
          )
          .select('*')
          .eq(
            'customer_id',
            customerId
          )
          .order(
            'is_default',
            {
              ascending:
                false,
            }
          )
          .order(
            'created_at',
            {
              ascending:
                false,
            }
          ),


        supabaseAdmin
          .from('orders')
          .select(`
            *,
            order_items (
              id,
              product_id,
              product_name,
              sku,
              quantity,
              unit_price,
              total_price
            )
          `)
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
          ),


        supabaseAdmin
          .from('invoices')
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
          ),


        supabaseAdmin
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
          ),


        supabaseAdmin
          .from(
            'notifications'
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
          ),


        supabaseAdmin
          .from(
            'customer_preferences'
          )
          .select('*')
          .eq(
            'customer_id',
            customerId
          )
          .maybeSingle(),


        supabaseAdmin
          .from(
            'customer_credit_accounts'
          )
          .select('*')
          .eq(
            'customer_id',
            customerId
          )
          .maybeSingle(),


        supabaseAdmin
          .from(
            'credit_transactions'
          )
          .select(`
            id,
            amount,
            transaction_type,
            status,
            reference,
            description,
            created_at,
            updated_at
          `)
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
          )
          .limit(20),
      ]);


    // ========================================================
    // QUERY ERRORS
    // ========================================================

    if (
      profileResult.error
    ) {

      throw profileResult.error;

    }


    const queryErrors = [
      addressesResult.error,
      ordersResult.error,
      invoicesResult.error,
      wishlistResult.error,
      notificationsResult.error,
      preferencesResult.error,
      creditResult.error,
      creditTransactionsResult.error,
    ].filter(Boolean);


    if (
      queryErrors.length >
      0
    ) {

      throw queryErrors[0];

    }


    // ========================================================
    // NORMALIZE DATA
    // ========================================================

    const orders =
      (
        ordersResult.data ||
        []
      ).map(
        normalizeOrder
      );


    const invoices =
      (
        invoicesResult.data ||
        []
      ).map(
        normalizeInvoice
      );


    const addresses =
      (
        addressesResult.data ||
        []
      )
        .map(
          normalizeAddress
        )
        .filter(Boolean);


    const wishlist =
      (
        wishlistResult.data ||
        []
      ).map(
        normalizeWishlistItem
      );


    const notifications =
      (
        notificationsResult.data ||
        []
      ).map(
        normalizeNotification
      );


    const unreadNotifications =
      notifications.filter(
        (item) =>
          !item.read
      ).length;


    const creditTransactions =
      (
        creditTransactionsResult.data ||
        []
      ).map(
        (transaction) => ({
          id:
            transaction.id,

          amount:
            money(
              transaction.amount
            ),

          type:
            transaction.transaction_type,

          status:
            transaction.status,

          reference:
            transaction.reference,

          description:
            transaction.description ||
            '',

          createdAt:
            transaction.created_at,

          updatedAt:
            transaction.updated_at,
        })
      );


    // ========================================================
    // RESPONSE
    // ========================================================

    return res.json({
      success: true,

      data: {

        profile:
          normalizeProfile(
            profileResult.data
          ),

        orders,

        invoices,

        addresses,

        wishlist,

        notifications,

        unreadNotifications,

        preferences:
          normalizePreferences(
            preferencesResult.data
          ),

        credit: {
          balance:
            money(
              creditResult
                .data
                ?.balance
            ),

          transactions:
            creditTransactions,
        },
      },
    });

  } catch (error) {

    console.error(
      '[CUSTOMER DASHBOARD ERROR]',
      error
    );


    return res
      .status(500)
      .json({
        success: false,

        message:
          'Unable to load customer dashboard.',
      });

  }

}


// ============================================================
// PROFILE
// ============================================================

export async function updateProfile(
  req,
  res
) {

  try {

    const customerId =
      req.user.id;


    const name =
      clean(
        req.body.name
      );


    const company =
      clean(
        req.body.company
      );


    const phone =
      clean(
        req.body.phone
      );


    if (
      name.length < 2
    ) {

      return res
        .status(400)
        .json({
          success:
            false,

          message:
            'Valid name is required.',
        });

    }


    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from('profiles')
        .update({
          name,

          company:
            company ||
            null,

          phone:
            phone ||
            null,

          updated_at:
            new Date()
              .toISOString(),
        })
        .eq(
          'id',
          customerId
        )
        .select('*')
        .single();


    if (error) {

      throw error;

    }


    await logActivity({
      userId:
        customerId,

      action:
        'profile_updated',

      entityType:
        'profile',

      entityId:
        customerId,

      description:
        'Customer updated profile information.',
    });


    return res.json({
      success: true,

      data:
        normalizeProfile(
          data
        ),
    });

  } catch (error) {

    console.error(
      '[UPDATE PROFILE ERROR]',
      error
    );


    return res
      .status(500)
      .json({
        success:
          false,

        message:
          'Unable to update profile.',
      });

  }

}


// ============================================================
// ADD ADDRESS
// ============================================================

export async function createAddress(
  req,
  res
) {

  try {

    const customerId =
      req.user.id;


    const title =
      clean(
        req.body.title
      );


    const contactName =
      clean(
        req.body.name ??
        req.body.contactName ??
        req.body.contact_name
      );


    const company =
      clean(
        req.body.company
      );


    const address =
      clean(
        req.body.address
      );


    const city =
      clean(
        req.body.city
      );


    const phone =
      clean(
        req.body.phone
      );


    if (
      !title ||
      !contactName ||
      !address ||
      !city
    ) {

      return res
        .status(400)
        .json({
          success:
            false,

          message:
            'Title, contact name, address and city are required.',
        });

    }


    const {
      count,
      error:
        countError,
    } =
      await supabaseAdmin
        .from(
          'customer_addresses'
        )
        .select(
          'id',
          {
            count:
              'exact',

            head:
              true,
          }
        )
        .eq(
          'customer_id',
          customerId
        );


    if (
      countError
    ) {

      throw countError;

    }


    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          'customer_addresses'
        )
        .insert({
          customer_id:
            customerId,

          title,

          contact_name:
            contactName,

          company:
            company ||
            null,

          address,

          city,

          phone:
            phone ||
            null,

          is_default:
            (
              count || 0
            ) === 0,

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
        'address_created',

      entityType:
        'customer_address',

      entityId:
        data.id,

      description:
        `Customer added delivery address "${title}".`,
    });


    return res
      .status(201)
      .json({
        success:
          true,

        data:
          normalizeAddress(
            data
          ),
      });

  } catch (error) {

    console.error(
      '[CREATE ADDRESS ERROR]',
      error
    );


    return res
      .status(500)
      .json({
        success:
          false,

        message:
          'Unable to create address.',
      });

  }

}


// ============================================================
// DELETE ADDRESS
// ============================================================

export async function deleteAddress(
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
        findError,
    } =
      await supabaseAdmin
        .from(
          'customer_addresses'
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
      findError
    ) {

      throw findError;

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
            'Address not found.',
        });

    }


    const {
      error,
    } =
      await supabaseAdmin
        .from(
          'customer_addresses'
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


    // ========================================================
    // IF DEFAULT WAS DELETED, PICK ANOTHER DEFAULT
    // ========================================================

    if (
      existing.is_default
    ) {

      const {
        data:
          remaining,

        error:
          remainingError,
      } =
        await supabaseAdmin
          .from(
            'customer_addresses'
          )
          .select('id')
          .eq(
            'customer_id',
            customerId
          )
          .order(
            'created_at',
            {
              ascending:
                true,
            }
          )
          .limit(1);


      if (
        remainingError
      ) {

        throw remainingError;

      }


      if (
        remaining?.length
      ) {

        const {
          error:
            defaultError,
        } =
          await supabaseAdmin
            .from(
              'customer_addresses'
            )
            .update({
              is_default:
                true,

              updated_at:
                new Date()
                  .toISOString(),
            })
            .eq(
              'id',
              remaining[0].id
            );


        if (
          defaultError
        ) {

          throw defaultError;

        }

      }

    }


    await logActivity({
      userId:
        customerId,

      action:
        'address_deleted',

      entityType:
        'customer_address',

      entityId:
        id,

      description:
        'Customer deleted a saved address.',
    });


    return res.json({
      success:
        true,

      data: {
        id,
      },
    });

  } catch (error) {

    console.error(
      '[DELETE ADDRESS ERROR]',
      error
    );


    return res
      .status(500)
      .json({
        success:
          false,

        message:
          'Unable to delete address.',
      });

  }

}


// ============================================================
// DEFAULT ADDRESS
// ============================================================

export async function setDefaultAddress(
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
        address,

      error:
        addressError,
    } =
      await supabaseAdmin
        .from(
          'customer_addresses'
        )
        .select('id')
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
      addressError
    ) {

      throw addressError;

    }


    if (
      !address
    ) {

      return res
        .status(404)
        .json({
          success:
            false,

          message:
            'Address not found.',
        });

    }


    const {
      error:
        clearError,
    } =
      await supabaseAdmin
        .from(
          'customer_addresses'
        )
        .update({
          is_default:
            false,

          updated_at:
            new Date()
              .toISOString(),
        })
        .eq(
          'customer_id',
          customerId
        );


    if (
      clearError
    ) {

      throw clearError;

    }


    const {
      data:
        updatedAddress,

      error:
        updateError,
    } =
      await supabaseAdmin
        .from(
          'customer_addresses'
        )
        .update({
          is_default:
            true,

          updated_at:
            new Date()
              .toISOString(),
        })
        .eq(
          'id',
          id
        )
        .eq(
          'customer_id',
          customerId
        )
        .select('*')
        .single();


    if (
      updateError
    ) {

      throw updateError;

    }


    await logActivity({
      userId:
        customerId,

      action:
        'default_address_changed',

      entityType:
        'customer_address',

      entityId:
        id,

      description:
        'Customer changed their default delivery address.',
    });


    return res.json({
      success:
        true,

      data:
        normalizeAddress(
          updatedAddress
        ),
    });

  } catch (error) {

    console.error(
      '[DEFAULT ADDRESS ERROR]',
      error
    );


    return res
      .status(500)
      .json({
        success:
          false,

        message:
          'Unable to update default address.',
      });

  }

}


// ============================================================
// WISHLIST REMOVE
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
        findError,
    } =
      await supabaseAdmin
        .from(
          'wishlist_items'
        )
        .select('id')
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
      findError
    ) {

      throw findError;

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
        'Customer removed a product from wishlist.',
    });


    return res.json({
      success:
        true,

      data: {
        id,
      },
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
// NOTIFICATION READ
// ============================================================

export async function readNotification(
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
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          'notifications'
        )
        .update({
          is_read:
            true,
        })
        .eq(
          'id',
          id
        )
        .eq(
          'customer_id',
          customerId
        )
        .select('*')
        .maybeSingle();


    if (error) {

      throw error;

    }


    if (
      !data
    ) {

      return res
        .status(404)
        .json({
          success:
            false,

          message:
            'Notification not found.',
        });

    }


    return res.json({
      success:
        true,

      data:
        normalizeNotification(
          data
        ),
    });

  } catch (error) {

    console.error(
      '[NOTIFICATION READ ERROR]',
      error
    );


    return res
      .status(500)
      .json({
        success:
          false,

        message:
          'Unable to update notification.',
      });

  }

}


// ============================================================
// READ ALL NOTIFICATIONS
// ============================================================

export async function readAllNotifications(
  req,
  res
) {

  try {

    const customerId =
      req.user.id;


    const {
      error,
    } =
      await supabaseAdmin
        .from(
          'notifications'
        )
        .update({
          is_read:
            true,
        })
        .eq(
          'customer_id',
          customerId
        )
        .eq(
          'is_read',
          false
        );


    if (error) {

      throw error;

    }


    return res.json({
      success:
        true,

      data: {
        readAll:
          true,
      },
    });

  } catch (error) {

    console.error(
      '[READ ALL NOTIFICATIONS ERROR]',
      error
    );


    return res
      .status(500)
      .json({
        success:
          false,

        message:
          'Unable to update notifications.',
      });

  }

}


// ============================================================
// PREFERENCES
// ============================================================

export async function updatePreferences(
  req,
  res
) {

  try {

    const customerId =
      req.user.id;


    const orderUpdates =
      req.body.orderUpdates ??
      req.body.order_updates;


    const inventoryAlerts =
      req.body.inventoryAlerts ??
      req.body.inventory_alerts;


    const invoiceReminders =
      req.body.invoiceReminders ??
      req.body.invoice_reminders;


    const marketing =
      req.body.marketing;


    const payload = {
      customer_id:
        customerId,

      order_updates:
        orderUpdates === undefined
          ? true
          : Boolean(
              orderUpdates
            ),

      inventory_alerts:
        inventoryAlerts === undefined
          ? true
          : Boolean(
              inventoryAlerts
            ),

      invoice_reminders:
        invoiceReminders === undefined
          ? true
          : Boolean(
              invoiceReminders
            ),

      marketing:
        marketing === undefined
          ? false
          : Boolean(
              marketing
            ),

      updated_at:
        new Date()
          .toISOString(),
    };


    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          'customer_preferences'
        )
        .upsert(
          payload,
          {
            onConflict:
              'customer_id',
          }
        )
        .select('*')
        .single();


    if (error) {

      throw error;

    }


    await logActivity({
      userId:
        customerId,

      action:
        'preferences_updated',

      entityType:
        'customer_preferences',

      entityId:
        customerId,

      description:
        'Customer updated communication preferences.',
    });


    return res.json({
      success:
        true,

      data:
        normalizePreferences(
          data
        ),
    });

  } catch (error) {

    console.error(
      '[PREFERENCES ERROR]',
      error
    );


    return res
      .status(500)
      .json({
        success:
          false,

        message:
          'Unable to update preferences.',
      });

  }

}


// ============================================================
// PASSWORD
// ============================================================

export async function changePassword(
  req,
  res
) {

  try {

    const customerId =
      req.user.id;


    const currentPassword =
      String(
        req.body.currentPassword ||
        ''
      );


    const newPassword =
      String(
        req.body.newPassword ||
        ''
      );


    if (
      !currentPassword
    ) {

      return res
        .status(400)
        .json({
          success:
            false,

          message:
            'Current password is required.',
        });

    }


    if (
      newPassword.length <
      6
    ) {

      return res
        .status(400)
        .json({
          success:
            false,

          message:
            'New password must be at least 6 characters.',
        });

    }


    if (
      currentPassword ===
      newPassword
    ) {

      return res
        .status(400)
        .json({
          success:
            false,

          message:
            'New password must be different from the current password.',
        });

    }


    const {
      data:
        profile,

      error:
        profileError,
    } =
      await supabaseAdmin
        .from('profiles')
        .select('email')
        .eq(
          'id',
          customerId
        )
        .single();


    if (
      profileError
    ) {

      throw profileError;

    }


    const {
      error:
        verifyError,
    } =
      await supabaseAuth
        .auth
        .signInWithPassword({
          email:
            profile.email,

          password:
            currentPassword,
        });


    if (
      verifyError
    ) {

      return res
        .status(400)
        .json({
          success:
            false,

          message:
            'Current password is incorrect.',
        });

    }


    const {
      error:
        updateError,
    } =
      await supabaseAdmin
        .auth
        .admin
        .updateUserById(
          customerId,
          {
            password:
              newPassword,
          }
        );


    if (
      updateError
    ) {

      throw updateError;

    }


    await logActivity({
      userId:
        customerId,

      action:
        'password_changed',

      entityType:
        'account',

      entityId:
        customerId,

      description:
        'Customer changed account password.',
    });


    return res.json({
      success:
        true,

      data: {
        passwordUpdated:
          true,
      },

      message:
        'Password updated successfully.',
    });

  } catch (error) {

    console.error(
      '[CHANGE PASSWORD ERROR]',
      error
    );


    return res
      .status(500)
      .json({
        success:
          false,

        message:
          'Unable to update password.',
      });

  }

}


// ============================================================
// CREDIT TOP-UP REQUEST
// ============================================================

export async function requestCreditTopup(
  req,
  res
) {

  try {

    const customerId =
      req.user.id;


    const amount =
      Number(
        req.body.amount
      );


    if (
      !Number.isFinite(
        amount
      ) ||
      amount <= 0
    ) {

      return res
        .status(400)
        .json({
          success:
            false,

          message:
            'A valid amount greater than zero is required.',
        });

    }


    const reference =
      `CR-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase()}`;


    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          'credit_transactions'
        )
        .insert({
          customer_id:
            customerId,

          amount,

          transaction_type:
            'topup',

          status:
            'pending',

          reference,

          description:
            'Customer credit top-up request',

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
        'credit_topup_requested',

      entityType:
        'credit_transaction',

      entityId:
        data.id,

      description:
        `Customer requested UGX ${amount.toLocaleString()} credit top-up.`,

      metadata: {
        amount,
        reference,
      },
    });


    return res
      .status(201)
      .json({
        success:
          true,

        data: {
          id:
            data.id,

          amount:
            money(
              data.amount
            ),

          type:
            data.transaction_type,

          status:
            data.status,

          reference:
            data.reference,

          description:
            data.description ||
            '',

          createdAt:
            data.created_at,
        },
      });

  } catch (error) {

    console.error(
      '[CREDIT REQUEST ERROR]',
      error
    );


    return res
      .status(500)
      .json({
        success:
          false,

        message:
          'Unable to submit credit request.',
      });

  }

}


// ============================================================
// CREATE CUSTOMER ORDER
// ============================================================

export async function createOrder(
  req,
  res
) {

  try {

    const customerId =
      req.user.id;


    const {
      shipping,
      deliveryMethod,
      paymentMethod,
      purchaseOrderNumber,
      items,
    } =
      req.body;


    // ========================================================
    // SHIPPING VALIDATION
    // ========================================================

    if (
      !shipping ||
      !clean(
        shipping.firstName
      ) ||
      !clean(
        shipping.lastName
      ) ||
      !clean(
        shipping.email
      ) ||
      !clean(
        shipping.phone
      ) ||
      !clean(
        shipping.address
      ) ||
      !clean(
        shipping.city
      ) ||
      !clean(
        shipping.country
      )
    ) {

      return res
        .status(400)
        .json({
          success:
            false,

          message:
            'Complete shipping information is required.',
        });

    }


    // ========================================================
    // CART VALIDATION
    // ========================================================

    if (
      !Array.isArray(
        items
      ) ||
      items.length ===
        0
    ) {

      return res
        .status(400)
        .json({
          success:
            false,

          message:
            'Your cart is empty.',
        });

    }


    // ========================================================
    // NORMALIZE ITEMS
    // ========================================================

    const normalizedItems =
      items.map(
        (item) => ({

          // ==================================================
          // IMPORTANT
          //
          // Current frontend catalog IDs may be:
          //
          // 1
          // 2
          // 3
          //
          // Those are NOT valid PostgreSQL UUID values.
          //
          // Therefore:
          //
          // Valid UUID    -> keep product ID
          // Numeric/local -> save product_id as null
          //
          // Product name, SKU, quantity and price are still
          // preserved in order_items.
          // ==================================================

          productId:
            isUuid(
              item.productId
            )
              ? String(
                  item.productId
                ).trim()
              : null,

          productName:
            clean(
              item.productName ||
              item.name
            ),

          sku:
            clean(
              item.sku
            ),

          quantity:
            Number(
              item.quantity ||
              item.qty ||
              0
            ),

          unitPrice:
            money(
              item.unitPrice ??
              item.price
            ),

        })
      );


    // ========================================================
    // VALIDATE ITEMS
    // ========================================================

    const invalidItem =
      normalizedItems.find(
        (item) =>

          !item.productName ||

          !Number.isFinite(
            item.quantity
          ) ||

          item.quantity <=
            0 ||

          !Number.isFinite(
            item.unitPrice
          ) ||

          item.unitPrice <
            0
      );


    if (
      invalidItem
    ) {

      return res
        .status(400)
        .json({
          success:
            false,

          message:
            'One or more order items are invalid.',
        });

    }


    // ========================================================
    // CALCULATE SUBTOTAL
    // ========================================================

    const subtotal =
      normalizedItems.reduce(
        (
          currentTotal,
          item
        ) =>
          currentTotal +
          (
            item.unitPrice *
            item.quantity
          ),
        0
      );


    // ========================================================
    // DELIVERY METHOD
    // ========================================================

    const normalizedDeliveryMethod =
      deliveryMethod ===
      'express'
        ? 'express'
        : 'standard';


    // ========================================================
    // DELIVERY FEE
    // ========================================================

    const deliveryFee =
      normalizedDeliveryMethod ===
      'express'
        ? 250000
        : 0;


    // ========================================================
    // TAX
    // ========================================================

    const tax =
      Math.round(
        subtotal *
        0.05
      );


    // ========================================================
    // TOTAL
    // ========================================================

    const total =
      subtotal +
      deliveryFee +
      tax;


    // ========================================================
    // PAYMENT METHOD
    //
    // Card here means the customer selected card checkout.
    // Actual card settlement should later be performed through
    // a payment provider.
    // ========================================================

    const normalizedPaymentMethod =
      paymentMethod ===
      'card'
        ? 'card'
        : 'invoice';


    // ========================================================
    // ORDER NUMBER
    // ========================================================

    const orderNumber =
      `#APX-${Date.now()
        .toString()
        .slice(-8)}-${Math.random()
        .toString(36)
        .slice(2, 5)
        .toUpperCase()}`;


    // ========================================================
    // SHIPPING ADDRESS SNAPSHOT
    //
    // We save the checkout address inside the order so future
    // customer profile/address changes do not change an old
    // order's delivery information.
    // ========================================================

    const shippingAddress = {

      firstName:
        clean(
          shipping.firstName
        ),

      lastName:
        clean(
          shipping.lastName
        ),

      email:
        clean(
          shipping.email
        ),

      phone:
        clean(
          shipping.phone
        ),

      address:
        clean(
          shipping.address
        ),

      city:
        clean(
          shipping.city
        ),

      country:
        clean(
          shipping.country
        ),

      deliveryMethod:
        normalizedDeliveryMethod,

      paymentMethod:
        normalizedPaymentMethod,

      purchaseOrderNumber:
        clean(
          purchaseOrderNumber
        ) ||
        null,

      tax,

    };


    // ========================================================
    // CREATE ORDER
    // ========================================================

    const {
      data:
        createdOrder,

      error:
        orderError,
    } =
      await supabaseAdmin
        .from('orders')
        .insert({

          order_number:
            orderNumber,

          customer_id:
            customerId,

          status:
            'pending',

          priority:
            normalizedDeliveryMethod ===
            'express'
              ? 'high'
              : 'medium',

          subtotal,

          delivery_fee:
            deliveryFee,

          total,

          currency:
            'UGX',

          shipping_address:
            shippingAddress,

          notes:
            clean(
              purchaseOrderNumber
            )
              ? `Customer PO: ${clean(
                  purchaseOrderNumber
                )}`
              : null,

          updated_at:
            new Date()
              .toISOString(),

        })
        .select(`
          id,
          order_number,
          customer_id,
          status,
          priority,
          subtotal,
          delivery_fee,
          total,
          currency,
          notes,
          estimated_delivery_date,
          shipping_address,
          created_at,
          updated_at
        `)
        .single();


    if (
      orderError
    ) {

      console.error(
        '[CREATE ORDER DATABASE ERROR]',
        orderError
      );


      throw orderError;

    }


    // ========================================================
    // CREATE ORDER ITEMS
    // ========================================================

    const orderItems =
      normalizedItems.map(
        (item) => ({

          order_id:
            createdOrder.id,

          // Valid UUID -> UUID
          // Frontend numeric ID -> null
          product_id:
            item.productId,

          product_name:
            item.productName,

          sku:
            item.sku ||
            null,

          quantity:
            item.quantity,

          unit_price:
            item.unitPrice,

          total_price:
            item.quantity *
            item.unitPrice,

        })
      );


    const {
      data:
        createdItems,

      error:
        orderItemsError,
    } =
      await supabaseAdmin
        .from(
          'order_items'
        )
        .insert(
          orderItems
        )
        .select();


    // ========================================================
    // ROLLBACK ORDER IF ORDER ITEMS FAIL
    // ========================================================

    if (
      orderItemsError
    ) {

      console.error(
        '[ORDER ITEMS ERROR]',
        orderItemsError
      );


      const {
        error:
          rollbackError,
      } =
        await supabaseAdmin
          .from('orders')
          .delete()
          .eq(
            'id',
            createdOrder.id
          );


      if (
        rollbackError
      ) {

        console.error(
          '[ORDER ROLLBACK ERROR]',
          rollbackError
        );

      }


      throw orderItemsError;

    }


    // ========================================================
    // CREATE INVOICE
    // ========================================================

    const invoiceNumber =
      `INV-${Date.now()
        .toString()
        .slice(-8)}-${Math.random()
        .toString(36)
        .slice(2, 5)
        .toUpperCase()}`;


    const issueDate =
      new Date();


    const dueDate =
      new Date();


    dueDate.setDate(
      dueDate.getDate() +
      14
    );


    const {
      data:
        createdInvoice,

      error:
        invoiceError,
    } =
      await supabaseAdmin
        .from(
          'invoices'
        )
        .insert({

          invoice_number:
            invoiceNumber,

          order_id:
            createdOrder.id,

          customer_id:
            customerId,

          amount:
            total,

          currency:
            'UGX',

          status:
            'pending',

          issue_date:
            issueDate
              .toISOString()
              .split('T')[0],

          due_date:
            dueDate
              .toISOString()
              .split('T')[0],

          updated_at:
            new Date()
              .toISOString(),

        })
        .select('*')
        .single();


    if (
      invoiceError
    ) {

      console.error(
        '[ORDER INVOICE ERROR]',
        invoiceError
      );

    }


    // ========================================================
    // CREATE CUSTOMER NOTIFICATION
    // ========================================================

    const {
      error:
        notificationError,
    } =
      await supabaseAdmin
        .from(
          'notifications'
        )
        .insert({

          customer_id:
            customerId,

          title:
            'Order received',

          message:
            `Your order ${orderNumber} has been received and is awaiting processing.`,

          type:
            'order',

          is_read:
            false,

        });


    if (
      notificationError
    ) {

      console.error(
        '[ORDER NOTIFICATION ERROR]',
        notificationError
      );

    }


    // ========================================================
    // ACTIVITY LOG
    // ========================================================

    await logActivity({

      userId:
        customerId,

      action:
        'order_created',

      entityType:
        'order',

      entityId:
        createdOrder.id,

      description:
        `Customer created procurement order ${orderNumber}.`,

      metadata: {

        orderNumber,

        subtotal,

        deliveryFee,

        tax,

        total,

        currency:
          'UGX',

        itemCount:
          normalizedItems.length,

        deliveryMethod:
          normalizedDeliveryMethod,

        paymentMethod:
          normalizedPaymentMethod,

      },

    });


    // ========================================================
    // SUCCESS RESPONSE
    // ========================================================

    return res
      .status(201)
      .json({

        success:
          true,

        data: {

          databaseId:
            createdOrder.id,

          id:
            createdOrder.order_number,

          orderNumber:
            createdOrder.order_number,

          status:
            formatOrderStatus(
              createdOrder.status
            ),

          rawStatus:
            createdOrder.status,

          priority:
            createdOrder.priority,

          subtotal:
            money(
              createdOrder.subtotal
            ),

          deliveryFee:
            money(
              createdOrder.delivery_fee
            ),

          tax,

          total:
            money(
              createdOrder.total
            ),

          currency:
            createdOrder.currency ||
            'UGX',

          shippingAddress:
            createdOrder.shipping_address,

          invoice:
            createdInvoice
              ? {

                  id:
                    createdInvoice.id,

                  invoiceNumber:
                    createdInvoice.invoice_number,

                  amount:
                    money(
                      createdInvoice.amount
                    ),

                  status:
                    formatInvoiceStatus(
                      createdInvoice.status
                    ),

                  issueDate:
                    createdInvoice.issue_date,

                  dueDate:
                    createdInvoice.due_date,

                }
              : null,

          items:
            (
              createdItems ||
              []
            ).map(
              normalizeOrderItem
            ),

          createdAt:
            createdOrder.created_at,

        },

        message:
          `Order ${orderNumber} placed successfully.`,

      });

  } catch (error) {

    console.error(
      '[CREATE CUSTOMER ORDER ERROR]',
      error
    );


    return res
      .status(500)
      .json({

        success:
          false,

        message:
          error.message ||
          'Unable to place order.',

      });

  }

}