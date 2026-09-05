import {
  supabaseAdmin,
} from '../config/supabase.js';

import {
  logActivity,
} from '../utils/activityLogger.js';


// ============================================================
// HELPERS
// ============================================================

function startOfMonth(
  date = new Date()
) {

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  );

}


function monthKey(date) {

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, '0')}`;

}


function monthLabel(date) {

  return date.toLocaleString(
    'en-US',
    {
      month: 'short',
    }
  );

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


function normalizeOrderStatus(
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

    'in transit':
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


function databaseOrderStatus(
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
      'pending',

    processing:
      'processing',

    shipped:
      'shipped',

    in_transit:
      'in_transit',

    'in transit':
      'in_transit',

    delivered:
      'delivered',

    cancelled:
      'cancelled',

  };


  return (
    map[value] ||
    null
  );

}


function normalizePriority(
  priority
) {

  const value =
    String(
      priority ||
      'medium'
    )
      .trim()
      .toLowerCase();


  const map = {

    low:
      'Low',

    medium:
      'Medium',

    high:
      'High',

    urgent:
      'Urgent',

  };


  return (
    map[value] ||
    'Medium'
  );

}


function normalizeInvoiceStatus(
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
      'Pending',

    paid:
      'Paid',

    overdue:
      'Pending',

    cancelled:
      'Cancelled',

    refunded:
      'Refunded',

  };


  return (
    map[value] ||
    status ||
    'Pending'
  );

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
      item.sku ||
      '',

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


// ============================================================
// LOAD CUSTOMER MAP
// ============================================================

async function buildCustomerMap(
  customerIds
) {

  const uniqueIds = [
    ...new Set(
      (
        customerIds ||
        []
      ).filter(Boolean)
    ),
  ];


  if (
    uniqueIds.length ===
    0
  ) {

    return {};

  }


  const {
    data,
    error,
  } =
    await supabaseAdmin
      .from('profiles')
      .select(`
        id,
        name,
        company,
        email,
        phone,
        role
      `)
      .in(
        'id',
        uniqueIds
      );


  if (error) {

    throw error;

  }


  return Object.fromEntries(
    (
      data ||
      []
    ).map(
      (customer) => [
        customer.id,
        customer,
      ]
    )
  );

}


// ============================================================
// LOAD INVOICE MAP
// ============================================================

async function buildInvoiceMap(
  orderIds
) {

  const uniqueIds = [
    ...new Set(
      (
        orderIds ||
        []
      ).filter(Boolean)
    ),
  ];


  if (
    uniqueIds.length ===
    0
  ) {

    return {};

  }


  const {
    data,
    error,
  } =
    await supabaseAdmin
      .from('invoices')
      .select(`
        id,
        invoice_number,
        order_id,
        amount,
        currency,
        status,
        issue_date,
        due_date,
        paid_at,
        created_at
      `)
      .in(
        'order_id',
        uniqueIds
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


  const invoiceMap = {};


  for (
    const invoice of
    data || []
  ) {

    if (
      !invoiceMap[
        invoice.order_id
      ]
    ) {

      invoiceMap[
        invoice.order_id
      ] =
        invoice;

    }

  }


  return invoiceMap;

}


// ============================================================
// NORMALIZE ADMIN ORDER
// ============================================================

function normalizeAdminOrder(
  order,
  customer,
  invoice
) {

  const items =
    (
      order.order_items ||
      []
    ).map(
      normalizeOrderItem
    );


  return {

    databaseId:
      order.id,

    id:
      order.order_number,

    orderNumber:
      order.order_number,

    customerId:
      order.customer_id,

    customer:
      customer?.company ||
      customer?.name ||
      customer?.email ||
      'Unknown Customer',

    customerName:
      customer?.name ||
      '',

    company:
      customer?.company ||
      '',

    email:
      customer?.email ||
      '',

    phone:
      customer?.phone ||
      '',

    date:
      order.created_at,

    createdAt:
      order.created_at,

    updatedAt:
      order.updated_at,

    amount:
      money(
        order.total
      ),

    subtotal:
      money(
        order.subtotal
      ),

    deliveryFee:
      money(
        order.delivery_fee
      ),

    currency:
      order.currency ||
      'UGX',

    status:
      normalizeOrderStatus(
        order.status
      ),

    rawStatus:
      order.status,

    priority:
      normalizePriority(
        order.priority
      ),

    payment:
      invoice
        ? normalizeInvoiceStatus(
            invoice.status
          )
        : 'Pending',

    paymentStatus:
      invoice
        ? normalizeInvoiceStatus(
            invoice.status
          )
        : 'Pending',

    invoice:
      invoice
        ? {
            id:
              invoice.id,

            invoiceNumber:
              invoice.invoice_number,

            amount:
              money(
                invoice.amount
              ),

            currency:
              invoice.currency ||
              'UGX',

            status:
              normalizeInvoiceStatus(
                invoice.status
              ),

            rawStatus:
              invoice.status,

            issueDate:
              invoice.issue_date,

            dueDate:
              invoice.due_date,

            paidAt:
              invoice.paid_at ||
              null,
          }
        : null,

    items:
      items.length,

    itemCount:
      items.length,

    orderItems:
      items,

    estimatedDeliveryDate:
      order.estimated_delivery_date ||
      null,

    shippingAddress:
      order.shipping_address ||
      null,

    notes:
      order.notes ||
      '',

  };

}


// ============================================================
// ADMIN DASHBOARD
// ============================================================

export async function getAdminDashboard(
  req,
  res
) {

  try {

    // ========================================================
    // LOAD ORDERS
    // ========================================================

    const {
      data: orders,
      error:
        ordersError,
    } =
      await supabaseAdmin
        .from('orders')
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
          created_at,
          updated_at,
          estimated_delivery_date
        `)
        .order(
          'created_at',
          {
            ascending:
              false,
          }
        );


    if (
      ordersError
    ) {

      throw ordersError;

    }


    const safeOrders =
      orders || [];


    // ========================================================
    // CUSTOMER MAP
    // ========================================================

    const customerMap =
      await buildCustomerMap(
        safeOrders.map(
          (order) =>
            order.customer_id
        )
      );


    // ========================================================
    // ALL CUSTOMER PROFILES
    // ========================================================

    const {
      data:
        customerProfiles,

      error:
        customerProfilesError,
    } =
      await supabaseAdmin
        .from('profiles')
        .select(`
          id,
          role
        `)
        .eq(
          'role',
          'customer'
        );


    if (
      customerProfilesError
    ) {

      throw customerProfilesError;

    }


    // ========================================================
    // TOTAL REVENUE
    // ========================================================

    const revenueOrders =
      safeOrders.filter(
        (order) =>
          String(
            order.status
          )
            .toLowerCase() ===
          'delivered'
      );


    const totalRevenue =
      revenueOrders.reduce(
        (
          total,
          order
        ) =>
          total +
          money(
            order.total
          ),
        0
      );


    // ========================================================
    // ACTIVE ORDERS
    // ========================================================

    const activeStatuses = [
      'pending',
      'processing',
      'shipped',
      'in_transit',
    ];


    const activeOrders =
      safeOrders.filter(
        (order) =>
          activeStatuses.includes(
            String(
              order.status ||
              ''
            )
              .toLowerCase()
          )
      ).length;


    // ========================================================
    // AVERAGE LEAD TIME
    // ========================================================

    const deliveredOrders =
      safeOrders.filter(
        (order) =>
          String(
            order.status ||
            ''
          )
            .toLowerCase() ===
            'delivered' &&
          order.created_at &&
          order.updated_at
      );


    let averageLeadTime =
      0;


    if (
      deliveredOrders.length >
      0
    ) {

      const totalDays =
        deliveredOrders.reduce(
          (
            total,
            order
          ) => {

            const created =
              new Date(
                order.created_at
              );


            const completed =
              new Date(
                order.updated_at
              );


            const milliseconds =
              completed -
              created;


            const days =
              milliseconds /
              (
                1000 *
                60 *
                60 *
                24
              );


            return (
              total +
              Math.max(
                0,
                days
              )
            );

          },
          0
        );


      averageLeadTime =
        totalDays /
        deliveredOrders.length;

    }


    // ========================================================
    // RECENT ORDERS
    // ========================================================

    const recentOrders =
      safeOrders
        .slice(
          0,
          5
        )
        .map(
          (order) => {

            const customer =
              customerMap[
                order.customer_id
              ];


            return {

              databaseId:
                order.id,

              orderNumber:
                order.order_number,

              customer:
                customer?.company ||
                customer?.name ||
                customer?.email ||
                'Unknown customer',

              email:
                customer?.email ||
                '',

              date:
                order.created_at,

              amount:
                money(
                  order.total
                ),

              status:
                normalizeOrderStatus(
                  order.status
                ),

              priority:
                normalizePriority(
                  order.priority
                ),

            };

          }
        );


    // ========================================================
    // MONTHLY ORDERS
    // ========================================================

    const currentMonthStart =
      startOfMonth();


    const monthlyOrders =
      safeOrders.filter(
        (order) => {

          if (
            !order.created_at
          ) {
            return false;
          }


          return (
            new Date(
              order.created_at
            ) >=
            currentMonthStart
          );

        }
      ).length;


    // ========================================================
    // SALES CHART
    // ========================================================

    function buildSalesData(
      months
    ) {

      const now =
        new Date();


      const buckets =
        [];


      for (
        let offset =
          months - 1;
        offset >= 0;
        offset -= 1
      ) {

        const date =
          new Date(
            now.getFullYear(),
            now.getMonth() -
              offset,
            1
          );


        buckets.push({

          key:
            monthKey(
              date
            ),

          label:
            monthLabel(
              date
            ),

          value:
            0,

        });

      }


      for (
        const order of
        revenueOrders
      ) {

        const date =
          new Date(
            order.updated_at ||
            order.created_at
          );


        if (
          Number.isNaN(
            date.getTime()
          )
        ) {
          continue;
        }


        const key =
          monthKey(
            date
          );


        const bucket =
          buckets.find(
            (item) =>
              item.key ===
              key
          );


        if (
          bucket
        ) {

          bucket.value +=
            money(
              order.total
            );

        }

      }


      return {

        labels:
          buckets.map(
            (item) =>
              item.label
          ),

        values:
          buckets.map(
            (item) =>
              item.value
          ),

      };

    }


    // ========================================================
    // DASHBOARD RESPONSE
    // ========================================================

    return res.json({

      success:
        true,

      data: {

        stats: {

          totalRevenue,

          activeOrders,

          inventoryValue:
            0,

          averageLeadTime,

        },


        recentOrders,


        categoryDistribution:
          [],


        inventoryAlerts:
          [],


        sales: {

          6:
            buildSalesData(
              6
            ),

          12:
            buildSalesData(
              12
            ),

        },


        summary: {

          monthlyOrders,

          activeCustomers:
            (
              customerProfiles ||
              []
            ).length,

          productCount:
            0,

          onTimeDelivery:
            0,

        },


        unreadNotifications:
          0,

      },

    });

  } catch (error) {

    console.error(
      '[ADMIN DASHBOARD ERROR]',
      error
    );


    return res
      .status(500)
      .json({

        success:
          false,

        message:
          error.message ||
          'Unable to load admin dashboard.',

      });

  }

}


// ============================================================
// GET ALL ADMIN ORDERS
// ============================================================

export async function getAdminOrders(
  req,
  res
) {

  try {

    // ========================================================
    // LOAD ORDERS + ITEMS
    // ========================================================

    const {
      data:
        orders,

      error:
        ordersError,
    } =
      await supabaseAdmin
        .from('orders')
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
          updated_at,

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
        .order(
          'created_at',
          {
            ascending:
              false,
          }
        );


    if (
      ordersError
    ) {

      throw ordersError;

    }


    const safeOrders =
      orders || [];


    // ========================================================
    // CUSTOMER DATA
    // ========================================================

    const customerMap =
      await buildCustomerMap(
        safeOrders.map(
          (order) =>
            order.customer_id
        )
      );


    // ========================================================
    // INVOICE / PAYMENT DATA
    // ========================================================

    const invoiceMap =
      await buildInvoiceMap(
        safeOrders.map(
          (order) =>
            order.id
        )
      );


    // ========================================================
    // NORMALIZE
    // ========================================================

    const normalizedOrders =
      safeOrders.map(
        (order) =>
          normalizeAdminOrder(
            order,
            customerMap[
              order.customer_id
            ],
            invoiceMap[
              order.id
            ]
          )
      );


    return res.json({

      success:
        true,

      data: {
        orders:
          normalizedOrders,
      },

    });

  } catch (error) {

    console.error(
      '[ADMIN ORDERS ERROR]',
      error
    );


    return res
      .status(500)
      .json({

        success:
          false,

        message:
          error.message ||
          'Unable to load orders.',

      });

  }

}


// ============================================================
// GET SINGLE ADMIN ORDER
// ============================================================

export async function getAdminOrder(
  req,
  res
) {

  try {

    const {
      id,
    } =
      req.params;


    if (
      !id
    ) {

      return res
        .status(400)
        .json({

          success:
            false,

          message:
            'Order ID is required.',

        });

    }


    // ========================================================
    // LOAD ORDER
    // ========================================================

    const {
      data:
        order,

      error:
        orderError,
    } =
      await supabaseAdmin
        .from('orders')
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
          updated_at,

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
          'id',
          id
        )
        .maybeSingle();


    if (
      orderError
    ) {

      throw orderError;

    }


    if (
      !order
    ) {

      return res
        .status(404)
        .json({

          success:
            false,

          message:
            'Order not found.',

        });

    }


    const customerMap =
      await buildCustomerMap([
        order.customer_id,
      ]);


    const invoiceMap =
      await buildInvoiceMap([
        order.id,
      ]);


    const normalizedOrder =
      normalizeAdminOrder(
        order,
        customerMap[
          order.customer_id
        ],
        invoiceMap[
          order.id
        ]
      );


    return res.json({

      success:
        true,

      data:
        normalizedOrder,

    });

  } catch (error) {

    console.error(
      '[ADMIN ORDER DETAIL ERROR]',
      error
    );


    return res
      .status(500)
      .json({

        success:
          false,

        message:
          error.message ||
          'Unable to load order.',

      });

  }

}


// ============================================================
// UPDATE ORDER STATUS
// ============================================================

export async function updateAdminOrderStatus(
  req,
  res
) {

  try {

    const adminId =
      req.user.id;


    const {
      id,
    } =
      req.params;


    const requestedStatus =
      req.body.status;


    // ========================================================
    // VALIDATE STATUS
    // ========================================================

    const newStatus =
      databaseOrderStatus(
        requestedStatus
      );


    if (
      !newStatus
    ) {

      return res
        .status(400)
        .json({

          success:
            false,

          message:
            'Invalid order status.',

        });

    }


    // ========================================================
    // FIND ORDER
    // ========================================================

    const {
      data:
        existingOrder,

      error:
        existingError,
    } =
      await supabaseAdmin
        .from('orders')
        .select(`
          id,
          order_number,
          customer_id,
          status,
          total
        `)
        .eq(
          'id',
          id
        )
        .maybeSingle();


    if (
      existingError
    ) {

      throw existingError;

    }


    if (
      !existingOrder
    ) {

      return res
        .status(404)
        .json({

          success:
            false,

          message:
            'Order not found.',

        });

    }


    const previousStatus =
      String(
        existingOrder.status ||
        ''
      )
        .trim()
        .toLowerCase();


    // ========================================================
    // NO CHANGE NEEDED
    // ========================================================

    if (
      previousStatus ===
      newStatus
    ) {

      return res.json({

        success:
          true,

        data: {

          id:
            existingOrder.id,

          orderNumber:
            existingOrder.order_number,

          status:
            normalizeOrderStatus(
              existingOrder.status
            ),

        },

        message:
          'Order status is already up to date.',

      });

    }


    // ========================================================
    // UPDATE ORDER
    // ========================================================

    const now =
      new Date()
        .toISOString();


    const {
      data:
        updatedOrder,

      error:
        updateError,
    } =
      await supabaseAdmin
        .from('orders')
        .update({

          status:
            newStatus,

          updated_at:
            now,

        })
        .eq(
          'id',
          id
        )
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
      updateError
    ) {

      throw updateError;

    }


    // ========================================================
    // CREATE CUSTOMER NOTIFICATION
    // ========================================================

    const readableStatus =
      normalizeOrderStatus(
        newStatus
      );


    const {
      error:
        notificationError,
    } =
      await supabaseAdmin
        .from('notifications')
        .insert({

          customer_id:
            existingOrder.customer_id,

          title:
            `Order ${existingOrder.order_number} updated`,

          message:
            `Your order ${existingOrder.order_number} status is now ${readableStatus}.`,

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
        adminId,

      action:
        'order_status_updated',

      entityType:
        'order',

      entityId:
        id,

      description:
        `Administrator changed order ${existingOrder.order_number} from ${normalizeOrderStatus(
          previousStatus
        )} to ${readableStatus}.`,

      metadata: {

        orderNumber:
          existingOrder.order_number,

        customerId:
          existingOrder.customer_id,

        previousStatus,

        newStatus,

      },

    });


    // ========================================================
    // RETURN UPDATED ORDER
    // ========================================================

    const customerMap =
      await buildCustomerMap([
        existingOrder.customer_id,
      ]);


    const invoiceMap =
      await buildInvoiceMap([
        existingOrder.id,
      ]);


    const fullOrder = {
      ...updatedOrder,

      order_items:
        [],
    };


    return res.json({

      success:
        true,

      data:
        normalizeAdminOrder(
          fullOrder,
          customerMap[
            existingOrder.customer_id
          ],
          invoiceMap[
            existingOrder.id
          ]
        ),

      message:
        `Order ${existingOrder.order_number} updated to ${readableStatus}.`,

    });

  } catch (error) {

    console.error(
      '[ADMIN ORDER STATUS ERROR]',
      error
    );


    return res
      .status(500)
      .json({

        success:
          false,

        message:
          error.message ||
          'Unable to update order status.',

      });

  }

}// ============================================================
// CUSTOMER HELPERS
// ============================================================

function cleanCustomerValue(
  value
) {

  return String(
    value ?? ''
  ).trim();

}


function customerMoney(
  value
) {

  const amount =
    Number(
      value || 0
    );


  return Number.isFinite(
    amount
  )
    ? amount
    : 0;

}


function normalizeCustomerStatus(
  value
) {

  return String(
    value || 'active'
  )
    .trim()
    .toLowerCase() === 'inactive'
      ? 'inactive'
      : 'active';

}


function normalizeAdminCustomer(
  profile,
  customerOrders = [],
  customerInvoices = []
) {

  const orders =
    Array.isArray(
      customerOrders
    )
      ? customerOrders
      : [];


  const invoices =
    Array.isArray(
      customerInvoices
    )
      ? customerInvoices
      : [];


  // Only paid invoices count as money actually spent.
  const totalSpent =
    invoices.reduce(
      (
        total,
        invoice
      ) => {

        const status =
          String(
            invoice.status || ''
          )
            .trim()
            .toLowerCase();


        if (
          status !== 'paid'
        ) {

          return total;

        }


        return (
          total +
          customerMoney(
            invoice.amount
          )
        );

      },
      0
    );


  const status =
    normalizeCustomerStatus(
      profile.status
    );


  return {

    id:
      profile.id,

    customerId:
      `CUS-${String(
        profile.id
      )
        .replaceAll(
          '-',
          ''
        )
        .slice(
          0,
          8
        )
        .toUpperCase()}`,

    company:
      profile.company ||
      '',

    name:
      profile.company ||
      profile.name ||
      'Customer',

    contact:
      profile.name ||
      '',

    email:
      profile.email ||
      '',

    phone:
      profile.phone ||
      '',

    location:
      profile.location ||
      '',

    role:
      profile.role ||
      'customer',

    status:
      status === 'active'
        ? 'Active'
        : 'Inactive',

    rawStatus:
      status,

    orders:
      orders.length,

    spent:
      totalSpent,

    joined:
      profile.member_since ||
      null,

    updatedAt:
      profile.updated_at ||
      null,

  };

}


// ============================================================
// GET ADMIN CUSTOMERS
//
// GET /api/admin/customers
// ============================================================

export async function getAdminCustomers(
  req,
  res
) {

  try {

    // --------------------------------------------------------
    // LOAD CUSTOMER PROFILES
    // --------------------------------------------------------

    const {
      data:
        profiles,

      error:
        profilesError,
    } =
      await supabaseAdmin
        .from(
          'profiles'
        )
        .select(`
          id,
          name,
          company,
          email,
          phone,
          location,
          role,
          status,
          member_since,
          updated_at
        `)
        .eq(
          'role',
          'customer'
        )
        .order(
          'member_since',
          {
            ascending:
              false,
          }
        );


    if (
      profilesError
    ) {

      throw profilesError;

    }


    const customers =
      profiles ||
      [];


    if (
      customers.length ===
      0
    ) {

      return res.json({

        success:
          true,

        data: {

          customers:
            [],

          summary: {

            totalCustomers:
              0,

            activeCustomers:
              0,

            inactiveCustomers:
              0,

            totalOrders:
              0,

            totalRevenue:
              0,

          },

        },

      });

    }


    const customerIds =
      customers.map(
        (profile) =>
          profile.id
      );


    // --------------------------------------------------------
    // LOAD ORDERS
    // --------------------------------------------------------

    const {
      data:
        orders,

      error:
        ordersError,
    } =
      await supabaseAdmin
        .from(
          'orders'
        )
        .select(`
          id,
          customer_id,
          status,
          total,
          created_at
        `)
        .in(
          'customer_id',
          customerIds
        );


    if (
      ordersError
    ) {

      throw ordersError;

    }


    // --------------------------------------------------------
    // LOAD INVOICES
    // --------------------------------------------------------

    const {
      data:
        invoices,

      error:
        invoicesError,
    } =
      await supabaseAdmin
        .from(
          'invoices'
        )
        .select(`
          id,
          customer_id,
          amount,
          status,
          currency,
          created_at
        `)
        .in(
          'customer_id',
          customerIds
        );


    if (
      invoicesError
    ) {

      throw invoicesError;

    }


    // --------------------------------------------------------
    // GROUP ORDERS
    // --------------------------------------------------------

    const orderMap =
      new Map();


    for (
      const order
      of orders || []
    ) {

      if (
        !orderMap.has(
          order.customer_id
        )
      ) {

        orderMap.set(
          order.customer_id,
          []
        );

      }


      orderMap
        .get(
          order.customer_id
        )
        .push(
          order
        );

    }


    // --------------------------------------------------------
    // GROUP INVOICES
    // --------------------------------------------------------

    const invoiceMap =
      new Map();


    for (
      const invoice
      of invoices || []
    ) {

      if (
        !invoiceMap.has(
          invoice.customer_id
        )
      ) {

        invoiceMap.set(
          invoice.customer_id,
          []
        );

      }


      invoiceMap
        .get(
          invoice.customer_id
        )
        .push(
          invoice
        );

    }


    // --------------------------------------------------------
    // NORMALIZE
    // --------------------------------------------------------

    const normalizedCustomers =
      customers.map(
        (profile) =>
          normalizeAdminCustomer(

            profile,

            orderMap.get(
              profile.id
            ) || [],

            invoiceMap.get(
              profile.id
            ) || []

          )
      );


    // --------------------------------------------------------
    // SUMMARY
    // --------------------------------------------------------

    const summary = {

      totalCustomers:
        normalizedCustomers.length,

      activeCustomers:
        normalizedCustomers.filter(
          (customer) =>
            customer.rawStatus ===
            'active'
        ).length,

      inactiveCustomers:
        normalizedCustomers.filter(
          (customer) =>
            customer.rawStatus ===
            'inactive'
        ).length,

      totalOrders:
        normalizedCustomers.reduce(
          (
            total,
            customer
          ) =>
            total +
            Number(
              customer.orders ||
              0
            ),
          0
        ),

      totalRevenue:
        normalizedCustomers.reduce(
          (
            total,
            customer
          ) =>
            total +
            customerMoney(
              customer.spent
            ),
          0
        ),

    };


    return res.json({

      success:
        true,

      data: {

        customers:
          normalizedCustomers,

        summary,

      },

    });

  } catch (error) {

    console.error(
      '[ADMIN CUSTOMERS ERROR]',
      error
    );


    return res
      .status(500)
      .json({

        success:
          false,

        message:
          error.message ||
          'Unable to load customers.',

      });

  }

}


// ============================================================
// GET ONE CUSTOMER
//
// GET /api/admin/customers/:id
// ============================================================

export async function getAdminCustomer(
  req,
  res
) {

  try {

    const {
      id,
    } =
      req.params;


    const {
      data:
        profile,

      error:
        profileError,
    } =
      await supabaseAdmin
        .from(
          'profiles'
        )
        .select(`
          id,
          name,
          company,
          email,
          phone,
          location,
          role,
          status,
          member_since,
          updated_at
        `)
        .eq(
          'id',
          id
        )
        .eq(
          'role',
          'customer'
        )
        .maybeSingle();


    if (
      profileError
    ) {

      throw profileError;

    }


    if (
      !profile
    ) {

      return res
        .status(404)
        .json({

          success:
            false,

          message:
            'Customer not found.',

        });

    }


    const [
      ordersResult,
      invoicesResult,
    ] =
      await Promise.all([

        supabaseAdmin
          .from(
            'orders'
          )
          .select(`
            id,
            order_number,
            status,
            priority,
            total,
            currency,
            created_at
          `)
          .eq(
            'customer_id',
            id
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
            'invoices'
          )
          .select(`
            id,
            invoice_number,
            amount,
            currency,
            status,
            issue_date,
            due_date,
            paid_at,
            created_at
          `)
          .eq(
            'customer_id',
            id
          )
          .order(
            'created_at',
            {
              ascending:
                false,
            }
          ),

      ]);


    if (
      ordersResult.error
    ) {

      throw ordersResult.error;

    }


    if (
      invoicesResult.error
    ) {

      throw invoicesResult.error;

    }


    const customer =
      normalizeAdminCustomer(

        profile,

        ordersResult.data ||
          [],

        invoicesResult.data ||
          []

      );


    return res.json({

      success:
        true,

      data: {

        customer,

        orders:
          ordersResult.data ||
          [],

        invoices:
          invoicesResult.data ||
          [],

      },

    });

  } catch (error) {

    console.error(
      '[GET ADMIN CUSTOMER ERROR]',
      error
    );


    return res
      .status(500)
      .json({

        success:
          false,

        message:
          error.message ||
          'Unable to load customer.',

      });

  }

}


// ============================================================
// UPDATE CUSTOMER
//
// PATCH /api/admin/customers/:id
// ============================================================

export async function updateAdminCustomer(
  req,
  res
) {

  try {

    const {
      id,
    } =
      req.params;


    const {
      name,
      company,
      phone,
      location,
      status,
    } =
      req.body;


    const {
      data:
        existing,

      error:
        existingError,
    } =
      await supabaseAdmin
        .from(
          'profiles'
        )
        .select(`
          id,
          name,
          company,
          email,
          phone,
          location,
          role,
          status,
          member_since,
          updated_at
        `)
        .eq(
          'id',
          id
        )
        .eq(
          'role',
          'customer'
        )
        .maybeSingle();


    if (
      existingError
    ) {

      throw existingError;

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
            'Customer not found.',

        });

    }


    const updates = {

      updated_at:
        new Date()
          .toISOString(),

    };


    if (
      name !==
      undefined
    ) {

      const cleanName =
        cleanCustomerValue(
          name
        );


      if (
        !cleanName
      ) {

        return res
          .status(400)
          .json({

            success:
              false,

            message:
              'Customer name is required.',

          });

      }


      updates.name =
        cleanName;

    }


    if (
      company !==
      undefined
    ) {

      updates.company =
        cleanCustomerValue(
          company
        ) ||
        null;

    }


    if (
      phone !==
      undefined
    ) {

      updates.phone =
        cleanCustomerValue(
          phone
        ) ||
        null;

    }


    if (
      location !==
      undefined
    ) {

      updates.location =
        cleanCustomerValue(
          location
        ) ||
        null;

    }


    if (
      status !==
      undefined
    ) {

      updates.status =
        normalizeCustomerStatus(
          status
        );

    }


    const {
      data:
        updated,

      error:
        updateError,
    } =
      await supabaseAdmin
        .from(
          'profiles'
        )
        .update(
          updates
        )
        .eq(
          'id',
          id
        )
        .eq(
          'role',
          'customer'
        )
        .select(`
          id,
          name,
          company,
          email,
          phone,
          location,
          role,
          status,
          member_since,
          updated_at
        `)
        .single();


    if (
      updateError
    ) {

      throw updateError;

    }


    await logActivity({

      userId:
        req.user.id,

      action:
        'admin_customer_updated',

      entityType:
        'customer',

      entityId:
        id,

      description:
        `Admin updated customer ${updated.email}.`,

      metadata: {

        changedFields:
          Object.keys(
            updates
          ).filter(
            (key) =>
              key !==
              'updated_at'
          ),

      },

    });


    return res.json({

      success:
        true,

      data: {

        customer:
          normalizeAdminCustomer(
            updated,
            [],
            []
          ),

      },

      message:
        'Customer updated successfully.',

    });

  } catch (error) {

    console.error(
      '[UPDATE ADMIN CUSTOMER ERROR]',
      error
    );


    return res
      .status(500)
      .json({

        success:
          false,

        message:
          error.message ||
          'Unable to update customer.',

      });

  }

}