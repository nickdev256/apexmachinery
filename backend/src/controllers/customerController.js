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
  return Number(value || 0);
}


function formatOrderStatus(status) {
  const map = {
    pending: 'Pending',
    processing: 'Processing',
    in_transit: 'In Transit',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };

  return map[status] || status;
}


function formatInvoiceStatus(status) {
  const map = {
    pending: 'Pending',
    due_soon: 'Due Soon',
    paid: 'Paid',
    overdue: 'Overdue',
    cancelled: 'Cancelled',
  };

  return map[status] || status;
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
    ] =
      await Promise.all([

        supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('id', customerId)
          .single(),

        supabaseAdmin
          .from('customer_addresses')
          .select('*')
          .eq('customer_id', customerId)
          .order(
            'is_default',
            {
              ascending: false,
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
              ascending: false,
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
              ascending: false,
            }
          ),

        supabaseAdmin
          .from('wishlist_items')
          .select('*')
          .eq(
            'customer_id',
            customerId
          )
          .order(
            'created_at',
            {
              ascending: false,
            }
          ),

        supabaseAdmin
          .from('notifications')
          .select('*')
          .eq(
            'customer_id',
            customerId
          )
          .order(
            'created_at',
            {
              ascending: false,
            }
          ),

        supabaseAdmin
          .from('customer_preferences')
          .select('*')
          .eq(
            'customer_id',
            customerId
          )
          .maybeSingle(),

        supabaseAdmin
          .from('customer_credit_accounts')
          .select('*')
          .eq(
            'customer_id',
            customerId
          )
          .maybeSingle(),
      ]);


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
    ].filter(Boolean);


    if (
      queryErrors.length > 0
    ) {
      throw queryErrors[0];
    }


    const orders =
      (
        ordersResult.data ||
        []
      ).map(
        (order) => ({
          id:
            order.order_number,

          databaseId:
            order.id,

          items:
            `${order.order_items?.length || 0} ${
              order.order_items?.length === 1
                ? 'Item'
                : 'Items'
            }`,

          orderItems:
            order.order_items || [],

          status:
            formatOrderStatus(
              order.status
            ),

          total:
            money(
              order.total
            ),

          date:
            order.created_at,

          priority:
            order.priority,

          estimatedDeliveryDate:
            order.estimated_delivery_date,
        })
      );


    const invoices =
      (
        invoicesResult.data ||
        []
      ).map(
        (invoice) => ({
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

          date:
            invoice.issue_date,

          due:
            invoice.due_date,

          status:
            formatInvoiceStatus(
              invoice.status
            ),
        })
      );


    const addresses =
      (
        addressesResult.data ||
        []
      ).map(
        (address) => ({
          id:
            address.id,

          title:
            address.title,

          name:
            address.contact_name,

          company:
            address.company || '',

          address:
            address.address,

          city:
            address.city,

          phone:
            address.phone || '',

          default:
            address.is_default,
        })
      );


    const wishlist =
      (
        wishlistResult.data ||
        []
      ).map(
        (item) => ({
          id:
            item.id,

          productId:
            item.product_id,

          name:
            item.product_name,

          category:
            item.category,

          price:
            money(
              item.price
            ),

          stock:
            item.stock_status ||
            'Unknown',
        })
      );


    const notifications =
      (
        notificationsResult.data ||
        []
      ).map(
        (notification) => ({
          id:
            notification.id,

          title:
            notification.title,

          text:
            notification.message,

          type:
            notification.type,

          read:
            notification.is_read,

          createdAt:
            notification.created_at,
        })
      );


    return res.json({
      success: true,

      dashboard: {
        profile:
          profileResult.data,

        orders,

        invoices,

        addresses,

        wishlist,

        notifications,

        preferences:
          preferencesResult.data || {
            order_updates: true,
            inventory_alerts: true,
            invoice_reminders: true,
            marketing: false,
          },

        credit: {
          balance:
            money(
              creditResult.data?.balance
            ),
        },
      },
    });
  } catch (error) {
    console.error(
      'Customer dashboard error:',
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
      clean(req.body.name);

    const company =
      clean(req.body.company);

    const phone =
      clean(req.body.phone);


    if (
      name.length < 2
    ) {
      return res
        .status(400)
        .json({
          success: false,
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
            company || null,
          phone:
            phone || null,
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          'id',
          customerId
        )
        .select()
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
      profile: data,
    });
  } catch (error) {
    console.error(
      'Update profile error:',
      error
    );

    return res
      .status(500)
      .json({
        success: false,
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
      clean(req.body.title);

    const contactName =
      clean(req.body.name);

    const company =
      clean(req.body.company);

    const address =
      clean(req.body.address);

    const city =
      clean(req.body.city);

    const phone =
      clean(req.body.phone);


    if (
      !title ||
      !contactName ||
      !address ||
      !city
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            'Required address fields are missing.',
        });
    }


    const {
      count,
      error:
        countError,
    } =
      await supabaseAdmin
        .from('customer_addresses')
        .select(
          'id',
          {
            count: 'exact',
            head: true,
          }
        )
        .eq(
          'customer_id',
          customerId
        );


    if (countError) {
      throw countError;
    }


    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from('customer_addresses')
        .insert({
          customer_id:
            customerId,

          title,

          contact_name:
            contactName,

          company:
            company || null,

          address,

          city,

          phone:
            phone || null,

          is_default:
            (count || 0) === 0,
        })
        .select()
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
        success: true,
        address: data,
      });
  } catch (error) {
    console.error(
      'Create address error:',
      error
    );

    return res
      .status(500)
      .json({
        success: false,
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
        .eq('id', id)
        .eq(
          'customer_id',
          customerId
        )
        .maybeSingle();


    if (findError) {
      throw findError;
    }


    if (!existing) {
      return res
        .status(404)
        .json({
          success: false,
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
        .eq('id', id)
        .eq(
          'customer_id',
          customerId
        );


    if (error) {
      throw error;
    }


    if (
      existing.is_default
    ) {
      const {
        data:
          remaining,
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
              ascending: true,
            }
          )
          .limit(1);


      if (
        remaining?.length
      ) {
        await supabaseAdmin
          .from(
            'customer_addresses'
          )
          .update({
            is_default: true,
          })
          .eq(
            'id',
            remaining[0].id
          );
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
      success: true,
    });
  } catch (error) {
    console.error(
      'Delete address error:',
      error
    );

    return res
      .status(500)
      .json({
        success: false,
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
        .eq('id', id)
        .eq(
          'customer_id',
          customerId
        )
        .maybeSingle();


    if (addressError) {
      throw addressError;
    }


    if (!address) {
      return res
        .status(404)
        .json({
          success: false,
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
          is_default: false,
        })
        .eq(
          'customer_id',
          customerId
        );


    if (clearError) {
      throw clearError;
    }


    const {
      error:
        updateError,
    } =
      await supabaseAdmin
        .from(
          'customer_addresses'
        )
        .update({
          is_default: true,
          updated_at:
            new Date().toISOString(),
        })
        .eq('id', id);


    if (updateError) {
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
      success: true,
    });
  } catch (error) {
    console.error(
      'Default address error:',
      error
    );

    return res
      .status(500)
      .json({
        success: false,
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
      error,
    } =
      await supabaseAdmin
        .from(
          'wishlist_items'
        )
        .delete()
        .eq('id', id)
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
      success: true,
    });
  } catch (error) {
    console.error(
      'Remove wishlist error:',
      error
    );

    return res
      .status(500)
      .json({
        success: false,
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
      error,
    } =
      await supabaseAdmin
        .from('notifications')
        .update({
          is_read: true,
        })
        .eq('id', id)
        .eq(
          'customer_id',
          customerId
        );


    if (error) {
      throw error;
    }


    return res.json({
      success: true,
    });
  } catch (error) {
    console.error(
      'Notification read error:',
      error
    );

    return res
      .status(500)
      .json({
        success: false,
        message:
          'Unable to update notification.',
      });
  }
}


// ============================================================
// READ ALL
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
        .from('notifications')
        .update({
          is_read: true,
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
      success: true,
    });
  } catch (error) {
    console.error(
      'Read all notification error:',
      error
    );

    return res
      .status(500)
      .json({
        success: false,
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


    const payload = {
      customer_id:
        customerId,

      order_updates:
        Boolean(
          req.body.orderUpdates
        ),

      inventory_alerts:
        Boolean(
          req.body.inventoryAlerts
        ),

      invoice_reminders:
        Boolean(
          req.body.invoiceReminders
        ),

      marketing:
        Boolean(
          req.body.marketing
        ),

      updated_at:
        new Date().toISOString(),
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
        .select()
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
      success: true,
      preferences: data,
    });
  } catch (error) {
    console.error(
      'Preferences error:',
      error
    );

    return res
      .status(500)
      .json({
        success: false,
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
      newPassword.length < 6
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            'New password must be at least 6 characters.',
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


    if (profileError) {
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


    if (verifyError) {
      return res
        .status(400)
        .json({
          success: false,
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


    if (updateError) {
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
      success: true,
      message:
        'Password updated successfully.',
    });
  } catch (error) {
    console.error(
      'Change password error:',
      error
    );

    return res
      .status(500)
      .json({
        success: false,
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
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            'A valid amount is required.',
        });
    }


    const reference =
      `CR-${Date.now()}`;


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
        })
        .select()
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
        success: true,
        transaction: data,
      });
  } catch (error) {
    console.error(
      'Credit request error:',
      error
    );

    return res
      .status(500)
      .json({
        success: false,
        message:
          'Unable to submit credit request.',
      });
  }
}