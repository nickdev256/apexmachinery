import {
  supabaseAdmin,
} from '../config/supabase.js';


// ============================================================
// HELPERS
// ============================================================

function money(
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


function safeNumber(
  value,
  fallback = 0
) {

  const number =
    Number(
      value
    );


  return Number.isFinite(
    number
  )
    ? number
    : fallback;

}


function normalizeStatus(
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
    'Pending'
  );

}


function monthKey(
  date
) {

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(
    2,
    '0'
  )}`;

}


function monthLabel(
  date
) {

  return date.toLocaleString(
    'en-US',
    {
      month:
        'short',
    }
  );

}


function getPeriodDays(
  value
) {

  const period =
    Number(
      value
    );


  const allowed = [
    7,
    30,
    90,
    365,
  ];


  return allowed.includes(
    period
  )
    ? period
    : 30;

}


function getStartDate(
  days
) {

  const now =
    new Date();


  return new Date(
    now.getTime() -
      (
        days *
        24 *
        60 *
        60 *
        1000
      )
  );

}


function validDate(
  value
) {

  const date =
    new Date(
      value
    );


  return Number.isNaN(
    date.getTime()
  )
    ? null
    : date;

}


// ============================================================
// BUILD CUSTOMER MAP
// ============================================================

function buildCustomerMap(
  profiles
) {

  const map = {};


  for (
    const profile of
    profiles || []
  ) {

    map[
      profile.id
    ] = {

      id:
        profile.id,

      name:
        profile.company ||
        profile.name ||
        profile.email ||
        'Customer',

      contactName:
        profile.name ||
        '',

      company:
        profile.company ||
        '',

      email:
        profile.email ||
        '',

      phone:
        profile.phone ||
        '',

    };

  }


  return map;

}


// ============================================================
// BUILD MONTHLY REVENUE
// ============================================================

function buildMonthlyRevenue(
  revenueOrders,
  startDate
) {

  const now =
    new Date();


  const bucketStart =
    new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      1
    );


  const currentMonth =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );


  const buckets = [];


  const cursor =
    new Date(
      bucketStart
    );


  while (
    cursor <=
    currentMonth
  ) {

    buckets.push({

      key:
        monthKey(
          cursor
        ),

      month:
        monthLabel(
          cursor
        ),

      year:
        cursor.getFullYear(),

      revenue:
        0,

      orders:
        0,

    });


    cursor.setMonth(
      cursor.getMonth() + 1
    );

  }


  const bucketMap =
    Object.fromEntries(
      buckets.map(
        (bucket) => [
          bucket.key,
          bucket,
        ]
      )
    );


  for (
    const order of
    revenueOrders
  ) {

    const date =
      validDate(
        order.updated_at ||
        order.created_at
      );


    if (!date) {

      continue;

    }


    const key =
      monthKey(
        date
      );


    if (
      !bucketMap[
        key
      ]
    ) {

      continue;

    }


    bucketMap[
      key
    ].revenue +=
      money(
        order.total
      );


    bucketMap[
      key
    ].orders +=
      1;

  }


  return buckets;

}


// ============================================================
// BUILD ORDER STATUS REPORT
// ============================================================

function buildOrderStatuses(
  orders
) {

  const statusOrder = [
    'Delivered',
    'Processing',
    'Shipped',
    'In Transit',
    'Pending',
    'Cancelled',
  ];


  const counts = {};


  for (
    const status of
    statusOrder
  ) {

    counts[
      status
    ] = 0;

  }


  for (
    const order of
    orders || []
  ) {

    const status =
      normalizeStatus(
        order.status
      );


    if (
      counts[
        status
      ] === undefined
    ) {

      counts[
        status
      ] = 0;

    }


    counts[
      status
    ] +=
      1;

  }


  const total =
    orders.length;


  return Object.entries(
    counts
  )
    .filter(
      (
        [
          ,
          count,
        ]
      ) =>
        count > 0
    )
    .map(
      (
        [
          name,
          count,
        ]
      ) => ({

        name,

        count,

        value:
          total > 0
            ? Math.round(
                (
                  count /
                  total
                ) *
                100
              )
            : 0,

      })
    );

}


// ============================================================
// BUILD TOP CUSTOMERS
// ============================================================

function buildTopCustomers(
  revenueOrders,
  customerMap
) {

  const customers = {};


  for (
    const order of
    revenueOrders
  ) {

    const customerId =
      order.customer_id;


    if (
      !customerId
    ) {

      continue;

    }


    if (
      !customers[
        customerId
      ]
    ) {

      const profile =
        customerMap[
          customerId
        ];


      customers[
        customerId
      ] = {

        id:
          customerId,

        name:
          profile?.name ||
          'Unknown Customer',

        company:
          profile?.company ||
          '',

        email:
          profile?.email ||
          '',

        orders:
          0,

        revenue:
          0,

      };

    }


    customers[
      customerId
    ].orders +=
      1;


    customers[
      customerId
    ].revenue +=
      money(
        order.total
      );

  }


  return Object.values(
    customers
  )
    .sort(
      (
        a,
        b
      ) =>
        b.revenue -
        a.revenue
    )
    .slice(
      0,
      5
    );

}


// ============================================================
// BUILD INVENTORY REPORT
// ============================================================

function buildInventoryReport(
  products
) {

  const inventory = {

    total:
      0,

    inStock:
      0,

    lowStock:
      0,

    outOfStock:
      0,

    units:
      0,

  };


  for (
    const product of
    products || []
  ) {

    const stock =
      safeNumber(
        product.stock,
        0
      );


    const reorderLevel =
      safeNumber(
        product.reorder_level,
        5
      );


    inventory.total +=
      1;


    inventory.units +=
      stock;


    if (
      stock <= 0
    ) {

      inventory.outOfStock +=
        1;

    } else if (
      stock <=
      reorderLevel
    ) {

      inventory.lowStock +=
        1;

    } else {

      inventory.inStock +=
        1;

    }

  }


  return inventory;

}


// ============================================================
// GET ADMIN REPORTS
//
// GET /api/admin/reports
//
// Query:
// ?period=30&type=overview
// ============================================================

export async function getAdminReports(
  req,
  res
) {

  try {

    const period =
      getPeriodDays(
        req.query.period
      );


    const reportType =
      String(
        req.query.type ||
        'overview'
      )
        .trim()
        .toLowerCase();


    const startDate =
      getStartDate(
        period
      );


    // ========================================================
    // LOAD DATABASE DATA
    // ========================================================

    const [
      ordersResult,
      customersResult,
      productsResult,
    ] =
      await Promise.all([

        // ----------------------------------------------------
        // ORDERS
        // ----------------------------------------------------

        supabaseAdmin
          .from(
            'orders'
          )
          .select(`
            id,
            order_number,
            customer_id,
            status,
            subtotal,
            delivery_fee,
            total,
            currency,
            created_at,
            updated_at
          `)
          .order(
            'created_at',
            {
              ascending:
                false,
            }
          ),


        // ----------------------------------------------------
        // CUSTOMERS
        // ----------------------------------------------------

        supabaseAdmin
          .from(
            'profiles'
          )
          .select(`
            id,
            name,
            company,
            email,
            phone,
            role
          `)
          .eq(
            'role',
            'customer'
          ),


        // ----------------------------------------------------
        // INVENTORY
        // ----------------------------------------------------

        supabaseAdmin
          .from(
            'products'
          )
          .select(`
            id,
            stock,
            reorder_level
          `),

      ]);


    // ========================================================
    // DATABASE ERROR CHECKS
    // ========================================================

    if (
      ordersResult.error
    ) {

      throw ordersResult.error;

    }


    if (
      customersResult.error
    ) {

      throw customersResult.error;

    }


    if (
      productsResult.error
    ) {

      throw productsResult.error;

    }


    const allOrders =
      ordersResult.data ||
      [];


    const customers =
      customersResult.data ||
      [];


    const products =
      productsResult.data ||
      [];


    // ========================================================
    // CUSTOMER MAP
    // ========================================================

    const customerMap =
      buildCustomerMap(
        customers
      );


    // ========================================================
    // ORDERS CREATED DURING PERIOD
    // ========================================================

    const periodOrders =
      allOrders.filter(
        (order) => {

          const createdAt =
            validDate(
              order.created_at
            );


          if (
            !createdAt
          ) {

            return false;

          }


          return (
            createdAt >=
            startDate
          );

        }
      );


    // ========================================================
    // DELIVERED ORDERS / REVENUE
    //
    // Revenue is recognised when the order is delivered.
    // We use updated_at as the delivery/completion timestamp.
    // ========================================================

    const revenueOrders =
      allOrders.filter(
        (order) => {

          const status =
            String(
              order.status ||
              ''
            )
              .trim()
              .toLowerCase();


          if (
            status !==
            'delivered'
          ) {

            return false;

          }


          const revenueDate =
            validDate(
              order.updated_at ||
              order.created_at
            );


          if (
            !revenueDate
          ) {

            return false;

          }


          return (
            revenueDate >=
            startDate
          );

        }
      );


    // ========================================================
    // TOTAL REVENUE
    // ========================================================

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
    // TOTAL ORDERS
    // ========================================================

    const totalOrders =
      periodOrders.length;


    // ========================================================
    // ACTIVE CUSTOMERS DURING PERIOD
    // ========================================================

    const activeCustomerIds =
      new Set(
        periodOrders
          .map(
            (order) =>
              order.customer_id
          )
          .filter(
            Boolean
          )
      );


    const activeCustomers =
      activeCustomerIds.size;


    // ========================================================
    // AVERAGE ORDER VALUE
    //
    // Uses delivered revenue orders so cancelled/pending
    // orders do not distort the revenue average.
    // ========================================================

    const averageOrder =
      revenueOrders.length >
      0
        ? totalRevenue /
          revenueOrders.length
        : 0;


    // ========================================================
    // MONTHLY REVENUE
    // ========================================================

    const monthlyRevenue =
      buildMonthlyRevenue(
        revenueOrders,
        startDate
      );


    // ========================================================
    // ORDER STATUS
    // ========================================================

    const orderStatuses =
      buildOrderStatuses(
        periodOrders
      );


    // ========================================================
    // TOP CUSTOMERS
    // ========================================================

    const topCustomers =
      buildTopCustomers(
        revenueOrders,
        customerMap
      );


    // ========================================================
    // INVENTORY
    // ========================================================

    const inventory =
      buildInventoryReport(
        products
      );


    // ========================================================
    // RESPONSE
    // ========================================================

    return res
      .status(
        200
      )
      .json({

        success:
          true,

        data: {

          period,

          reportType,

          generatedAt:
            new Date()
              .toISOString(),


          totals: {

            revenue:
              totalRevenue,

            orders:
              totalOrders,

            customers:
              activeCustomers,

            totalRegisteredCustomers:
              customers.length,

            averageOrder,

          },


          monthlyRevenue,


          orderStatuses,


          topCustomers,


          inventory,

        },

      });

  } catch (error) {

    console.error(
      '[ADMIN REPORTS ERROR]',
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
          'Unable to generate admin reports.',

      });

  }

}