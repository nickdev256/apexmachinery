import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import Breadcrumb from "../components/Breadcrumb";
import Filters from "../components/Filters";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import Icon from "../components/Icon";

import {
  getProducts,
  getProductCategories,
} from "../services/productApi";

import "./Shop.css";


// ============================================================
// SETTINGS
// ============================================================

const PAGE_SIZE = 9;


// ============================================================
// CATEGORY ALIASES
// ============================================================

const CATEGORY_ALIASES = {
  construction:
    "construction-equipment",

  electrical:
    "electrical-equipment",
};


// ============================================================
// SHOP
// ============================================================

export default function Shop({
  presetCategory,
  title,
  subtitle,
  heroImage,
}) {
  const [
    searchParams,
    setSearchParams,
  ] =
    useSearchParams();


  // ==========================================================
  // BACKEND DATA
  // ==========================================================

  const [
    products,
    setProducts,
  ] =
    useState([]);

  const [
    categories,
    setCategories,
  ] =
    useState([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");


  // ==========================================================
  // CATEGORY FROM URL
  // ==========================================================

  const urlCategory =
    searchParams.get(
      "category"
    );

  const initialCategory =
    presetCategory ||
    urlCategory ||
    "";


  // ==========================================================
  // FILTER STATE
  // ==========================================================

  const [
    selectedCategories,
    setSelectedCategories,
  ] =
    useState(
      initialCategory
        ? [
            CATEGORY_ALIASES[
              initialCategory
            ] ||
              initialCategory,
          ]
        : []
    );


  const [
    selectedBrands,
    setSelectedBrands,
  ] =
    useState(
      searchParams.get(
        "brand"
      )
        ? [
            searchParams.get(
              "brand"
            ),
          ]
        : []
    );


  const [
    availability,
    setAvailability,
  ] =
    useState([]);


  const [
    priceRange,
    setPriceRange,
  ] =
    useState(0);


  const [
    sort,
    setSort,
  ] =
    useState("best");


  const [
    view,
    setView,
  ] =
    useState("grid");


  const [
    page,
    setPage,
  ] =
    useState(1);


  // ==========================================================
  // LOAD SHOP DATA
  // ==========================================================

  async function loadShop() {
    try {
      setLoading(
        true
      );

      setError(
        ""
      );

      const [
        productResult,
        categoryResult,
      ] =
        await Promise.all([
          getProducts(),
          getProductCategories(),
        ]);


      const productList =
        productResult
          ?.products ||
        [];


      const categoryList =
        categoryResult
          ?.categories ||
        [];


      setProducts(
        productList
      );

      setCategories(
        categoryList
      );


      const prices =
        productList
          .map(
            (
              product
            ) =>
              Number(
                product.price
              ) || 0
          )
          .filter(
            (
              price
            ) =>
              price > 0
          );


      const maximumPrice =
        Math.max(
          ...prices,
          500000
        );


      setPriceRange(
        maximumPrice
      );
    } catch (
      requestError
    ) {
      console.error(
        "Shop loading error:",
        requestError
      );

      setError(
        requestError
          ?.response
          ?.data
          ?.message ||
          "Unable to load products."
      );
    } finally {
      setLoading(
        false
      );
    }
  }


  useEffect(
    () => {
      loadShop();
    },
    []
  );


  // ==========================================================
  // MAX PRICE
  // ==========================================================

  const MAX_PRICE =
    useMemo(
      () => {
        const prices =
          products
            .map(
              (
                product
              ) =>
                Number(
                  product.price
                ) || 0
            )
            .filter(
              (
                price
              ) =>
                price > 0
            );

        return Math.max(
          ...prices,
          500000
        );
      },
      [
        products,
      ]
    );


  // ==========================================================
  // BRANDS
  // ==========================================================

  const ALL_BRANDS =
    useMemo(
      () =>
        [
          ...new Set(
            products
              .map(
                (
                  product
                ) =>
                  product.brand
              )
              .filter(
                Boolean
              )
          ),
        ].sort(),
      [
        products,
      ]
    );


  // ==========================================================
  // PAGE RESET
  // ==========================================================

  useEffect(
    () => {
      setPage(
        1
      );
    },
    [
      selectedCategories,
      selectedBrands,
      availability,
      priceRange,
      sort,
    ]
  );


  // ==========================================================
  // FILTER PRODUCTS
  // ==========================================================

  const filtered =
    useMemo(
      () => {
        let list =
          products.filter(
            (
              product
            ) => {

              // CATEGORY
              if (
                selectedCategories.length >
                  0 &&
                !selectedCategories.includes(
                  product.category
                )
              ) {
                return false;
              }


              // BRAND
              if (
                selectedBrands.length >
                  0 &&
                !selectedBrands.includes(
                  product.brand
                )
              ) {
                return false;
              }


              // AVAILABILITY
              if (
                availability.length >
                  0 &&
                !availability.includes(
                  product.status
                )
              ) {
                return false;
              }


              // PRICE
              if (
                typeof product.price ===
                  "number" &&
                product.price >
                  priceRange
              ) {
                return false;
              }


              return true;
            }
          );


        // PRICE LOW → HIGH
        if (
          sort ===
          "price-asc"
        ) {
          list =
            [...list].sort(
              (
                a,
                b
              ) => {

                if (
                  a.price ===
                  null
                ) {
                  return 1;
                }

                if (
                  b.price ===
                  null
                ) {
                  return -1;
                }

                return (
                  Number(
                    a.price
                  ) -
                  Number(
                    b.price
                  )
                );
              }
            );
        }


        // PRICE HIGH → LOW
        else if (
          sort ===
          "price-desc"
        ) {
          list =
            [...list].sort(
              (
                a,
                b
              ) => {

                if (
                  a.price ===
                  null
                ) {
                  return 1;
                }

                if (
                  b.price ===
                  null
                ) {
                  return -1;
                }

                return (
                  Number(
                    b.price
                  ) -
                  Number(
                    a.price
                  )
                );
              }
            );
        }


        // RATING
        else if (
          sort ===
          "rating"
        ) {
          list =
            [...list].sort(
              (
                a,
                b
              ) =>
                Number(
                  b.rating ||
                  0
                ) -
                Number(
                  a.rating ||
                  0
                )
            );
        }


        return list;
      },
      [
        products,
        selectedCategories,
        selectedBrands,
        availability,
        priceRange,
        sort,
      ]
    );


  // ==========================================================
  // PAGINATION
  // ==========================================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filtered.length /
          PAGE_SIZE
      )
    );


  useEffect(
    () => {
      if (
        page >
        totalPages
      ) {
        setPage(
          totalPages
        );
      }
    },
    [
      page,
      totalPages,
    ]
  );


  const startIndex =
    (page - 1) *
    PAGE_SIZE;


  const endIndex =
    page *
    PAGE_SIZE;


  const pageItems =
    filtered.slice(
      startIndex,
      endIndex
    );


  // ==========================================================
  // CATEGORY
  // ==========================================================

  function toggleCategory(
    categoryId
  ) {
    const normalized =
      CATEGORY_ALIASES[
        categoryId
      ] ||
      categoryId;


    setSelectedCategories(
      (
        previous
      ) => {
        if (
          previous.includes(
            normalized
          )
        ) {
          return previous.filter(
            (
              item
            ) =>
              item !==
              normalized
          );
        }

        return [
          ...previous,
          normalized,
        ];
      }
    );
  }


  // ==========================================================
  // BRAND
  // ==========================================================

  function toggleBrand(
    brand
  ) {
    setSelectedBrands(
      (
        previous
      ) => {
        if (
          previous.includes(
            brand
          )
        ) {
          return previous.filter(
            (
              item
            ) =>
              item !==
              brand
          );
        }

        return [
          ...previous,
          brand,
        ];
      }
    );
  }


  // ==========================================================
  // AVAILABILITY
  // ==========================================================

  function toggleAvailability(
    status
  ) {
    setAvailability(
      (
        previous
      ) => {
        if (
          previous.includes(
            status
          )
        ) {
          return previous.filter(
            (
              item
            ) =>
              item !==
              status
          );
        }

        return [
          ...previous,
          status,
        ];
      }
    );
  }


  // ==========================================================
  // CLEAR FILTERS
  // ==========================================================

  function clearFilters() {
    const targetCategory =
      presetCategory
        ? (
            CATEGORY_ALIASES[
              presetCategory
            ] ||
            presetCategory
          )
        : null;


    setSelectedCategories(
      targetCategory
        ? [
            targetCategory,
          ]
        : []
    );

    setSelectedBrands(
      []
    );

    setAvailability(
      []
    );

    setPriceRange(
      MAX_PRICE
    );

    setPage(
      1
    );


    if (
      targetCategory
    ) {
      setSearchParams({
        category:
          targetCategory,
      });
    } else {
      setSearchParams(
        {}
      );
    }
  }


  // ==========================================================
  // CATEGORY LIST
  // ==========================================================

  const filterCategories =
    presetCategory

      ? categories.filter(
          (
            category
          ) => {
            const normalized =
              CATEGORY_ALIASES[
                category.id
              ] ||
              category.id;

            const target =
              CATEGORY_ALIASES[
                presetCategory
              ] ||
              presetCategory;

            return (
              normalized ===
              target
            );
          }
        )

      : categories;


  // ==========================================================
  // HERO
  // ==========================================================

  const heroStyle =
    heroImage
      ? {
          backgroundImage: `
            linear-gradient(
              rgba(11, 31, 77, 0.85),
              rgba(11, 31, 77, 0.85)
            ),
            url("${heroImage}")
          `,
        }
      : undefined;


  // ==========================================================
  // LOADING
  // ==========================================================

  if (
    loading
  ) {
    return (
      <section className="shop-page">

        <div className="shop-hero">
          <div className="container">
            <div className="shop-hero-content">
              <h1>
                Industrial Catalog
              </h1>

              <p>
                Loading Apex Machinery products...
              </p>
            </div>
          </div>
        </div>

      </section>
    );
  }


  // ==========================================================
  // ERROR
  // ==========================================================

  if (
    error
  ) {
    return (
      <section className="shop-page">

        <section className="section">
          <div className="container">

            <div className="shop-empty">
              <Icon
                name="alert-circle"
                size={40}
              />

              <h3>
                Unable to load catalog
              </h3>

              <p>
                {error}
              </p>

              <button
                type="button"
                className="btn btn-primary"
                onClick={
                  loadShop
                }
              >
                Try Again
              </button>
            </div>

          </div>
        </section>

      </section>
    );
  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section className="shop-page">

      <div
        className="shop-hero"
        style={
          heroStyle
        }
      >

        <div className="container">

          <Breadcrumb
            items={[
              {
                to:
                  "/shop",

                label:
                  "Shop",
              },

              {
                label:
                  title ||
                  "Catalog",
              },
            ]}
          />


          <div className="shop-hero-content">

            <h1>
              {title ||
                "Industrial Catalog"}
            </h1>


            <p>
              {subtitle ||
                "Certified industrial equipment, sourced and inspected for enterprise procurement."}
            </p>

          </div>

        </div>

      </div>


      <section className="section">

        <div className="container shop-layout">

          <Filters
            categories={
              filterCategories
            }

            brands={
              ALL_BRANDS
            }

            selectedCategories={
              selectedCategories
            }

            selectedBrands={
              selectedBrands
            }

            availability={
              availability
            }

            priceRange={
              priceRange
            }

            maxPrice={
              MAX_PRICE
            }

            onToggleCategory={
              toggleCategory
            }

            onToggleBrand={
              toggleBrand
            }

            onToggleAvailability={
              toggleAvailability
            }

            onPriceChange={
              setPriceRange
            }

            onClear={
              clearFilters
            }
          />


          <div className="shop-results">

            <div className="shop-toolbar">

              <span className="shop-count">

                Showing{" "}

                {pageItems.length >
                0
                  ? startIndex +
                    1
                  : 0}

                –

                {Math.min(
                  endIndex,
                  filtered.length
                )}

                {" "}of{" "}

                {
                  filtered.length
                }

                {" "}products

              </span>


              <div className="shop-toolbar-actions">

                <select
                  value={
                    sort
                  }
                  onChange={(
                    event
                  ) =>
                    setSort(
                      event
                        .target
                        .value
                    )
                  }
                  aria-label="Sort products"
                >

                  <option value="best">
                    Best Match
                  </option>

                  <option value="price-asc">
                    Price: Low to High
                  </option>

                  <option value="price-desc">
                    Price: High to Low
                  </option>

                  <option value="rating">
                    Top Rated
                  </option>

                </select>


                <div className="shop-view-toggle">

                  <button
                    type="button"
                    className={
                      view ===
                      "grid"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setView(
                        "grid"
                      )
                    }
                    aria-label="Grid view"
                  >
                    <Icon
                      name="menu"
                      size={16}
                    />
                  </button>


                  <button
                    type="button"
                    className={
                      view ===
                      "list"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setView(
                        "list"
                      )
                    }
                    aria-label="List view"
                  >
                    <Icon
                      name="eye"
                      size={16}
                    />
                  </button>

                </div>

              </div>

            </div>


            {pageItems.length ===
            0 ? (

              <div className="shop-empty">

                <div className="shop-empty-icon">
                  <Icon
                    name="search"
                    size={40}
                  />
                </div>

                <h3>
                  No products found
                </h3>

                <p>
                  No products match your current filters.
                </p>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={
                    clearFilters
                  }
                >
                  Clear Filters
                </button>

              </div>

            ) : (

              <div
                className={
                  view ===
                  "grid"
                    ? "grid-3"
                    : "shop-list"
                }
              >

                {pageItems.map(
                  (
                    product
                  ) => (
                    <ProductCard
                      key={
                        product.id
                      }
                      product={
                        product
                      }
                    />
                  )
                )}

              </div>

            )}


            {filtered.length >
              0 && (

              <Pagination
                page={
                  page
                }
                totalPages={
                  totalPages
                }
                onChange={
                  setPage
                }
              />

            )}

          </div>

        </div>

      </section>

    </section>
  );
}