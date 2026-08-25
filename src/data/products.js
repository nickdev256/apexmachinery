// ============================================================
// APEX MACHINERY
// PRODUCTS DATA CONTROLLER
// ============================================================
//
// This controller handles ALL Apex Machinery products.
//
// Product information comes from:
// ./products-data.js
//
// Product images are resolved through:
// ./machineImages.js
//
// IMPORTANT:
// Prices are displayed in UGX for the Uganda market.
//
// Research-based prices are applied where we have reliable
// Uganda market references.
//
// Products without a verified market price retain their
// source price rather than being given a fabricated price.
// ============================================================

import raw from "./products-data.js";

import {
  getMachineImage,
} from "./machineImages.js";


// ============================================================
// MARKET CONFIGURATION
// ============================================================

const MARKET_CURRENCY = "UGX";


// Approximate current USD/UGX working rate.
//
// This is deliberately kept in one place so you can update
// it later without changing the entire product controller.
//
// Recent reporting has placed USD/UGX around the 3,700 area.
//
const USD_TO_UGX = 3700;


// ============================================================
// RESEARCHED UGANDA MARKET PRICES
// ============================================================
//
// These are specific overrides for products for which we have
// current market evidence.
//
// IMPORTANT:
// These are catalogue reference prices, not guaranteed quotes.
// Generator prices vary considerably according to:
//
// - Brand
// - New / used condition
// - Prime / standby rating
// - Silent / open-frame enclosure
// - ATS
// - Control panel
// - Delivery
// - Installation
// - Taxes
// - Warranty
//
// Therefore these values should be treated as retail catalogue
// reference prices and reviewed before real quotations.
// ============================================================

const RESEARCHED_UGANDA_PRICES = {

  // ==========================================================
  // GENERATORS
  // ==========================================================

  "Industrial Diesel Generator 150 kVA": {
    price: 135000000,
    currency: "UGX",
    priceDisplay: "UGX 135,000,000",
    priceSource: "Uganda market reference",
    pricingNote:
      "Reference based on a new 150 kVA Perkins silent diesel generator listing.",
  },


  "Industrial Diesel Generator 200 kVA": {
    price: 140000000,
    currency: "UGX",
    priceDisplay: "UGX 140,000,000",
    priceSource: "Uganda market reference",
    pricingNote:
      "Reference based on a new 200 kVA CAT diesel generator listing.",
  },


  "Industrial Diesel Generator 250 kVA": {
    price: 170000000,
    currency: "UGX",
    priceDisplay: "UGX 170,000,000",
    priceSource: "Uganda market reference",
    pricingNote:
      "Reference based on a new 250 kVA Perkins silent diesel generator listing.",
  },


  // 300 kVA source found internationally and converted
  // using the working USD/UGX rate.
  //
  // $32,300 × 3,700 ≈ UGX 119,510,000
  //
  "Industrial Diesel Generator 300 kVA": {
    price: 119510000,
    currency: "UGX",
    priceDisplay: "UGX 119,510,000",
    priceSource: "International market reference",
    pricingNote:
      "Converted from an approximately USD 32,300 reference price. Final Uganda landed price may differ.",
  },


  // 400 kVA source:
  //
  // $35,000 × 3,700 ≈ UGX 129,500,000
  //
  "Industrial Diesel Generator 400 kVA": {
    price: 129500000,
    currency: "UGX",
    priceDisplay: "UGX 129,500,000",
    priceSource: "International market reference",
    pricingNote:
      "Converted from an approximately USD 35,000 reference price. Final Uganda landed price may differ.",
  },


  "Industrial Diesel Generator 500 kVA": {
    price: 250000000,
    currency: "UGX",
    priceDisplay: "UGX 250,000,000",
    priceSource: "Uganda market reference",
    pricingNote:
      "Reference based on a new 500 kVA Perkins silent diesel generator listing.",
  },


  // ==========================================================
  // COMPRESSORS
  // ==========================================================

  "Heavy Duty Air Compressor": {
    price: 10200000,
    currency: "UGX",
    priceDisplay: "UGX 10,200,000",
    priceSource: "Uganda market reference",
    pricingNote:
      "Reference aligned with Uganda listings for a 500 L, approximately 7.5 HP industrial compressor.",
  },


  "Rotary Screw Compressor": {
    price: 28500000,
    currency: "UGX",
    priceDisplay: "UGX 28,500,000",
    priceSource: "Catalogue reference",
    pricingNote:
      "Reference catalogue price for a 15 kW industrial rotary screw compressor.",
  },


  "Industrial Screw Compressor 22 kW": {
    price: 38000000,
    currency: "UGX",
    priceDisplay: "UGX 38,000,000",
    priceSource: "Catalogue reference",
    pricingNote:
      "Reference catalogue price for a 22 kW industrial rotary screw compressor.",
  },


  "Industrial Screw Compressor 30 kW": {
    price: 52000000,
    currency: "UGX",
    priceDisplay: "UGX 52,000,000",
    priceSource: "Catalogue reference",
    pricingNote:
      "Reference catalogue price for a 30 kW industrial rotary screw compressor.",
  },


  "Industrial Screw Compressor 37 kW": {
    price: 62000000,
    currency: "UGX",
    priceDisplay: "UGX 62,000,000",
    priceSource: "Catalogue reference",
    pricingNote:
      "Reference catalogue price for a 37 kW industrial rotary screw compressor.",
  },


  "Heavy Industrial Screw Compressor 45 kW": {
    price: 76000000,
    currency: "UGX",
    priceDisplay: "UGX 76,000,000",
    priceSource: "Catalogue reference",
    pricingNote:
      "Reference catalogue price for a 45 kW industrial rotary screw compressor.",
  },


  "Portable Diesel Air Compressor": {
    price: 28000000,
    currency: "UGX",
    priceDisplay: "UGX 28,000,000",
    priceSource: "Catalogue reference",
    pricingNote:
      "Reference catalogue price; final price depends on engine and air delivery specification.",
  },


  "High Pressure Air Compressor": {
    price: 42000000,
    currency: "UGX",
    priceDisplay: "UGX 42,000,000",
    priceSource: "Catalogue reference",
    pricingNote:
      "Reference catalogue price; high-pressure configuration varies by manufacturer.",
  },


  "Oil-Free Industrial Air Compressor": {
    price: 18500000,
    currency: "UGX",
    priceDisplay: "UGX 18,500,000",
    priceSource: "Catalogue reference",
    pricingNote:
      "Reference catalogue price for an oil-free industrial configuration.",
  },


  "Industrial Reciprocating Compressor": {
    price: 22000000,
    currency: "UGX",
    priceDisplay: "UGX 22,000,000",
    priceSource: "Catalogue reference",
    pricingNote:
      "Reference catalogue price for industrial reciprocating configuration.",
  },


  "Workshop Air Compressor": {
    price: 6500000,
    currency: "UGX",
    priceDisplay: "UGX 6,500,000",
    priceSource: "Catalogue reference",
    pricingNote:
      "Reference catalogue price for a heavy-duty workshop configuration.",
  },


  "Two Stage Industrial Compressor": {
    price: 24000000,
    currency: "UGX",
    priceDisplay: "UGX 24,000,000",
    priceSource: "Catalogue reference",
    pricingNote:
      "Reference catalogue price for two-stage industrial configuration.",
  },

};


// ============================================================
// FORMAT UGX
// ============================================================

export function formatUGX(amount) {

  const numericAmount =
    Number(amount);

  if (
    !Number.isFinite(
      numericAmount
    )
  ) {
    return "Request Quote";
  }

  return `UGX ${Math.round(
    numericAmount
  ).toLocaleString("en-UG")}`;

}


// ============================================================
// CONVERT USD TO UGX
// ============================================================

export function usdToUGX(
  amount
) {

  const usd =
    Number(amount);

  if (
    !Number.isFinite(usd)
  ) {
    return null;
  }

  return Math.round(
    usd * USD_TO_UGX
  );

}


// ============================================================
// RESOLVE PRODUCT PRICE
// ============================================================
//
// Priority:
//
// 1. Research-based Uganda price
// 2. Existing UGX price
// 3. Existing USD price converted to UGX
// 4. Request Quote
//
// ============================================================

export function resolveProductPrice(
  product
) {

  if (!product) {

    return {

      price: null,

      currency:
        MARKET_CURRENCY,

      priceDisplay:
        "Request Quote",

      priceSource:
        "No product data",

    };

  }


  // ==========================================================
  // 1. RESEARCHED PRICE
  // ==========================================================

  const researched =
    RESEARCHED_UGANDA_PRICES[
      product.name
    ];


  if (researched) {

    return {

      ...researched,

      price:
        Number(
          researched.price
        ),

      currency:
        MARKET_CURRENCY,

      priceDisplay:
        researched.priceDisplay,

    };

  }


  // ==========================================================
  // 2. EXISTING UGX PRICE
  // ==========================================================

  if (
    String(
      product.currency || ""
    ).toUpperCase() === "UGX"
  ) {

    const price =
      Number(
        product.price
      );

    if (
      Number.isFinite(price)
    ) {

      return {

        price,

        currency:
          "UGX",

        priceDisplay:
          formatUGX(price),

        priceSource:
          "Existing product data",

      };

    }

  }


  // ==========================================================
  // 3. EXISTING USD PRICE
  // ==========================================================

  if (
    String(
      product.currency || ""
    ).toUpperCase() === "USD"
  ) {

    const converted =
      usdToUGX(
        product.price
      );


    if (
      Number.isFinite(converted)
    ) {

      return {

        price:
          converted,

        currency:
          "UGX",

        priceDisplay:
          formatUGX(converted),

        priceSource:
          "Converted from source USD price",

        originalPrice:
          Number(
            product.price
          ),

        originalCurrency:
          "USD",

        exchangeRate:
          USD_TO_UGX,

      };

    }

  }


  // ==========================================================
  // 4. REQUEST QUOTE
  // ==========================================================

  return {

    price:
      null,

    currency:
      MARKET_CURRENCY,

    priceDisplay:
      "Request Quote",

    priceSource:
      "No verified price available",

  };

}


// ============================================================
// CREATE PRODUCTS
// ============================================================
//
// Convert raw product definitions into final products.
// ============================================================

export const products =
  raw.map(
    (product) => {

      const image =
        getMachineImage(
          product.name
        );


      const pricing =
        resolveProductPrice(
          product
        );


      return {

        ...product,


        // ------------------------------------------------------
        // MAIN IMAGE
        // ------------------------------------------------------

        image,


        // ------------------------------------------------------
        // IMAGE GALLERY
        // ------------------------------------------------------

        images:
          image
            ? [image]
            : [],


        // ------------------------------------------------------
        // BRAND
        // ------------------------------------------------------

        brand:
          product.brand ||
          "Apex Machinery",


        // ------------------------------------------------------
        // PRICE
        // ------------------------------------------------------

        price:
          pricing.price,

        currency:
          pricing.currency,

        priceDisplay:
          pricing.priceDisplay,

        priceSource:
          pricing.priceSource,

        pricingNote:
          pricing.pricingNote ||
          "",


        // ------------------------------------------------------
        // ORIGINAL PRICE INFORMATION
        // ------------------------------------------------------

        originalPrice:
          pricing.originalPrice ||
          null,

        originalCurrency:
          pricing.originalCurrency ||
          null,

        exchangeRate:
          pricing.exchangeRate ||
          null,


        // ------------------------------------------------------
        // RATING
        // ------------------------------------------------------

        rating:
          Number(
            product.rating || 0
          ),


        // ------------------------------------------------------
        // REVIEW COUNT
        // ------------------------------------------------------

        reviewCount:
          Number(
            product.reviewCount || 0
          ),


        // ------------------------------------------------------
        // STATUS
        // ------------------------------------------------------

        status:
          product.status ||
          "In Stock",


        // ------------------------------------------------------
        // STOCK
        // ------------------------------------------------------

        stock:
          Number(
            product.stock || 0
          ),

      };

    }
  );


// ============================================================
// GET PRODUCT BY ID
// ============================================================

export function getProductById(
  id
) {

  return products.find(
    (product) =>
      String(product.id) ===
      String(id)
  );

}


// ============================================================
// GET PRODUCT BY SLUG
// ============================================================

export function getProductBySlug(
  slug
) {

  return products.find(
    (product) =>
      String(
        product.slug || ""
      ).toLowerCase() ===
      String(
        slug || ""
      ).toLowerCase()
  );

}


// ============================================================
// GET PRODUCTS BY CATEGORY
// ============================================================

export function getProductsByCategory(
  categoryId
) {

  const category =
    String(
      categoryId || ""
    )
      .trim()
      .toLowerCase();


  return products.filter(
    (product) =>
      String(
        product.category || ""
      )
        .trim()
        .toLowerCase() ===
      category
  );

}


// ============================================================
// GET PRODUCTS BY CATEGORY NAME
// ============================================================

export function getProductsByCategoryName(
  categoryName
) {

  const category =
    String(
      categoryName || ""
    )
      .trim()
      .toLowerCase();


  return products.filter(
    (product) =>
      String(
        product.categoryName || ""
      )
        .trim()
        .toLowerCase() ===
      category
  );

}


// ============================================================
// GET PRODUCTS BY BRAND
// ============================================================

export function getProductsByBrand(
  brand
) {

  const searchBrand =
    String(
      brand || ""
    )
      .trim()
      .toLowerCase();


  return products.filter(
    (product) =>
      String(
        product.brand || ""
      )
        .trim()
        .toLowerCase() ===
      searchBrand
  );

}


// ============================================================
// GET RELATED PRODUCTS
// ============================================================

export function getRelatedProducts(
  product,
  count = 4
) {

  if (!product) {
    return [];
  }


  return products
    .filter(
      (item) =>
        item.category ===
          product.category &&
        item.id !==
          product.id
    )
    .slice(0, count);

}


// ============================================================
// GET RELATED PRODUCTS BY CATEGORY
// ============================================================

export function getRelatedProductsByCategory(
  categoryId,
  excludeId = null,
  count = 4
) {

  return products
    .filter(
      (product) =>
        product.category ===
          categoryId &&
        product.id !==
          excludeId
    )
    .slice(0, count);

}


// ============================================================
// GET FEATURED PRODUCTS
// ============================================================

export function getFeaturedProducts(
  count = 8
) {

  return [...products]
    .sort(
      (a, b) =>
        Number(
          b.rating || 0
        ) -
        Number(
          a.rating || 0
        )
    )
    .slice(
      0,
      count
    );

}


// ============================================================
// GET PRODUCTS IN STOCK
// ============================================================

export function getInStockProducts() {

  return products.filter(
    (product) =>
      Number(
        product.stock || 0
      ) > 0
  );

}


// ============================================================
// GET PRODUCTS AVAILABLE ON ORDER
// ============================================================

export function getProductsAvailableOnOrder() {

  return products.filter(
    (product) =>
      String(
        product.status || ""
      )
        .toLowerCase()
        .includes("order")
  );

}


// ============================================================
// SEARCH PRODUCTS
// ============================================================

export function searchProducts(
  query
) {

  const q =
    String(
      query || ""
    )
      .trim()
      .toLowerCase();


  if (!q) {
    return [];
  }


  return products.filter(
    (product) => {

      const name =
        String(
          product.name || ""
        ).toLowerCase();


      const brand =
        String(
          product.brand || ""
        ).toLowerCase();


      const category =
        String(
          product.category || ""
        ).toLowerCase();


      const categoryName =
        String(
          product.categoryName || ""
        ).toLowerCase();


      const description =
        String(
          product.description || ""
        ).toLowerCase();


      const slug =
        String(
          product.slug || ""
        ).toLowerCase();


      const specifications =
        Object.entries(
          product.specifications || {}
        )
          .map(
            ([key, value]) =>
              `${key} ${value}`
          )
          .join(" ")
          .toLowerCase();


      return (

        name.includes(q) ||

        brand.includes(q) ||

        category.includes(q) ||

        categoryName.includes(q) ||

        description.includes(q) ||

        slug.includes(q) ||

        specifications.includes(q)

      );

    }
  );

}


// ============================================================
// SEARCH PRODUCTS BY CATEGORY + QUERY
// ============================================================

export function searchProductsByCategory(
  categoryId,
  query
) {

  const categoryProducts =
    getProductsByCategory(
      categoryId
    );


  const q =
    String(
      query || ""
    )
      .trim()
      .toLowerCase();


  if (!q) {
    return categoryProducts;
  }


  return categoryProducts.filter(
    (product) => {

      const name =
        String(
          product.name || ""
        ).toLowerCase();


      const description =
        String(
          product.description || ""
        ).toLowerCase();


      const specifications =
        Object.entries(
          product.specifications || {}
        )
          .map(
            ([key, value]) =>
              `${key} ${value}`
          )
          .join(" ")
          .toLowerCase();


      return (

        name.includes(q) ||

        description.includes(q) ||

        specifications.includes(q)

      );

    }
  );

}


// ============================================================
// GET PRODUCTS WITHOUT IMAGES
// ============================================================

export function getProductsWithoutImages() {

  return products.filter(
    (product) =>
      !product.image
  );

}


// ============================================================
// GET PRODUCTS WITH IMAGES
// ============================================================

export function getProductsWithImages() {

  return products.filter(
    (product) =>
      Boolean(
        product.image
      )
  );

}


// ============================================================
// GET IMAGE STATISTICS
// ============================================================

export function getImageStatistics() {

  const total =
    products.length;


  const withImages =
    products.filter(
      (product) =>
        Boolean(
          product.image
        )
    ).length;


  const withoutImages =
    total -
    withImages;


  return {

    total,

    withImages,

    withoutImages,

    imageCoverage:
      total > 0
        ? `${Math.round(
            (withImages /
              total) *
              100
          )}%`
        : "0%",

  };

}


// ============================================================
// GET CATEGORY STATISTICS
// ============================================================

export function getCategoryStatistics() {

  const statistics =
    {};


  products.forEach(
    (product) => {

      const category =
        product.category ||
        "uncategorized";


      if (
        !statistics[
          category
        ]
      ) {

        statistics[
          category
        ] = 0;

      }


      statistics[
        category
      ]++;

    }
  );


  return statistics;

}


// ============================================================
// GET BRAND STATISTICS
// ============================================================

export function getBrandStatistics() {

  const statistics =
    {};


  products.forEach(
    (product) => {

      const brand =
        product.brand ||
        "Unknown";


      if (
        !statistics[
          brand
        ]
      ) {

        statistics[
          brand
        ] = 0;

      }


      statistics[
        brand
      ]++;

    }
  );


  return statistics;

}


// ============================================================
// GET ALL PRODUCT CATEGORIES
// ============================================================

export function getProductCategories() {

  const categories =
    products.map(
      (product) => ({

        id:
          product.category,

        name:
          product.categoryName,

      })
    );


  return categories.filter(
    (category, index, array) =>
      index ===
      array.findIndex(
        (item) =>
          item.id ===
          category.id
      )
  );

}


// ============================================================
// GET PRODUCTS BY PRICE RANGE
// ============================================================

export function getProductsByPriceRange(
  minPrice = 0,
  maxPrice = Infinity
) {

  return products.filter(
    (product) => {

      const price =
        Number(
          product.price
        );


      if (
        !Number.isFinite(
          price
        )
      ) {

        return false;

      }


      return (

        price >=
          minPrice &&

        price <=
          maxPrice

      );

    }
  );

}


// ============================================================
// GET PRODUCTS REQUIRING QUOTE
// ============================================================

export function getQuoteProducts() {

  return products.filter(
    (product) =>
      String(
        product.priceDisplay ||
          ""
      )
        .toLowerCase()
        .includes(
          "request quote"
        )
  );

}


// ============================================================
// GET PRODUCTS WITH RESEARCHED PRICES
// ============================================================

export function getResearchPricedProducts() {

  return products.filter(
    (product) =>
      product.priceSource ===
      "Uganda market reference" ||
      product.priceSource ===
      "International market reference"
  );

}


// ============================================================
// GET PRODUCTS WITHOUT RESEARCHED PRICES
// ============================================================

export function getProductsWithoutResearchPrice() {

  return products.filter(
    (product) =>
      !product.priceSource ||
      (
        product.priceSource !==
          "Uganda market reference" &&
        product.priceSource !==
          "International market reference"
      )
  );

}


// ============================================================
// GET PRICE STATISTICS
// ============================================================

export function getPriceStatistics() {

  const priced =
    products.filter(
      (product) =>
        Number.isFinite(
          Number(
            product.price
          )
        )
    );


  const quotes =
    products.filter(
      (product) =>
        product.priceDisplay ===
        "Request Quote"
    );


  return {

    total:
      products.length,

    priced:
      priced.length,

    requestQuote:
      quotes.length,

    researched:
      getResearchPricedProducts()
        .length,

    currency:
      MARKET_CURRENCY,

  };

}


// ============================================================
// DEBUG PRODUCT PRICES
// ============================================================

export function debugProductPrices() {

  console.table(

    products.map(
      (product) => ({

        id:
          product.id,

        name:
          product.name,

        category:
          product.category,

        price:
          product.price,

        currency:
          product.currency,

        display:
          product.priceDisplay,

        source:
          product.priceSource,

        originalPrice:
          product.originalPrice,

        originalCurrency:
          product.originalCurrency,

      })
    )

  );

}


// ============================================================
// DEBUG ALL PRODUCT IMAGES
// ============================================================

export function debugProductImages() {

  products.forEach(
    (product) => {

      console.log({

        id:
          product.id,

        name:
          product.name,

        category:
          product.category,

        categoryName:
          product.categoryName,

        image:
          product.image,

      });

    }
  );

}


// ============================================================
// DEBUG PRODUCT DATA
// ============================================================

export function debugProducts() {

  console.table(

    products.map(
      (product) => ({

        id:
          product.id,

        name:
          product.name,

        category:
          product.category,

        categoryName:
          product.categoryName,

        brand:
          product.brand,

        price:
          product.priceDisplay,

        stock:
          product.stock,

        status:
          product.status,

        image:
          product.image,

        priceSource:
          product.priceSource,

      })
    )

  );

}


// ============================================================
// PRODUCT COUNT
// ============================================================

export function getProductCount() {

  return products.length;

}


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default products;