import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Breadcrumb from "../components/Breadcrumb";
import Filters from "../components/Filters";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import Icon from "../components/Icon";

import { products } from "../data/products";
import { categories } from "../data/categories";

import "./Shop.css";


// ============================================================
// SETTINGS
// ============================================================

// Number of products displayed per page
const PAGE_SIZE = 9;


// ============================================================
// MAXIMUM PRODUCT PRICE
// ============================================================

// IMPORTANT:
// Do NOT use a fixed value like 50000.
// Your machines cost much more than UGX 50,000.
//
// We calculate the maximum automatically from products.
const MAX_PRICE = Math.max(
  ...products
    .map((product) => Number(product.price) || 0)
    .filter((price) => price > 0),
  500000
);


// ============================================================
// BRANDS
// ============================================================

const ALL_BRANDS = [
  ...new Set(
    products
      .map((product) => product.brand)
      .filter(Boolean)
  ),
];


// ============================================================
// CATEGORY NORMALIZATION
// ============================================================

// This allows the Shop page to work even if your category
// component uses slightly different IDs.
const CATEGORY_ALIASES = {
  construction: "construction-equipment",
  electrical: "electrical-equipment",
};


// ============================================================
// SHOP COMPONENT
// ============================================================

export default function Shop({
  presetCategory,
  title,
  subtitle,
  heroImage,
}) {

  const [searchParams, setSearchParams] = useSearchParams();


  // ==========================================================
  // CATEGORY FROM URL / PRESET
  // ==========================================================

  const urlCategory = searchParams.get("category");

  const initialCategory =
    presetCategory ||
    urlCategory ||
    "";


  // ==========================================================
  // STATE
  // ==========================================================

  const [selectedCategories, setSelectedCategories] =
    useState(
      initialCategory
        ? [
            CATEGORY_ALIASES[initialCategory] ||
            initialCategory,
          ]
        : []
    );


  const [selectedBrands, setSelectedBrands] =
    useState(
      searchParams.get("brand")
        ? [searchParams.get("brand")]
        : []
    );


  const [availability, setAvailability] =
    useState([]);


  // IMPORTANT:
  // Start with the real maximum product price.
  const [priceRange, setPriceRange] =
    useState(MAX_PRICE);


  const [sort, setSort] =
    useState("best");


  const [view, setView] =
    useState("grid");


  const [page, setPage] =
    useState(1);


  // ==========================================================
  // RESET PAGE WHEN FILTERS CHANGE
  // ==========================================================

  useEffect(() => {

    setPage(1);

  }, [
    selectedCategories,
    selectedBrands,
    availability,
    priceRange,
    sort,
  ]);


  // ==========================================================
  // FILTER PRODUCTS
  // ==========================================================

  const filtered = useMemo(() => {

    let list = products.filter((product) => {


      // ------------------------------------------------------
      // CATEGORY
      // ------------------------------------------------------

      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(product.category)
      ) {
        return false;
      }


      // ------------------------------------------------------
      // BRAND
      // ------------------------------------------------------

      if (
        selectedBrands.length > 0 &&
        !selectedBrands.includes(product.brand)
      ) {
        return false;
      }


      // ------------------------------------------------------
      // AVAILABILITY
      // ------------------------------------------------------

      if (
        availability.length > 0 &&
        !availability.includes(product.status)
      ) {
        return false;
      }


      // ------------------------------------------------------
      // PRICE
      // ------------------------------------------------------

      // Products with a numeric price are filtered.
      //
      // Products marked "Request Quote" still remain visible
      // because they may not have a customer-facing price.
      if (
        typeof product.price === "number" &&
        product.price > priceRange
      ) {
        return false;
      }


      return true;

    });


    // ========================================================
    // SORTING
    // ========================================================

    if (sort === "price-asc") {

      list = [...list].sort(
        (a, b) =>
          (a.price || 0) -
          (b.price || 0)
      );

    }


    else if (sort === "price-desc") {

      list = [...list].sort(
        (a, b) =>
          (b.price || 0) -
          (a.price || 0)
      );

    }


    else if (sort === "rating") {

      list = [...list].sort(
        (a, b) =>
          (b.rating || 0) -
          (a.rating || 0)
      );

    }


    // Best Match keeps original product order.

    return list;

  }, [
    selectedCategories,
    selectedBrands,
    availability,
    priceRange,
    sort,
  ]);


  // ==========================================================
  // PAGINATION
  // ==========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filtered.length / PAGE_SIZE
    )
  );


  // Make sure current page is valid.
  useEffect(() => {

    if (page > totalPages) {
      setPage(totalPages);
    }

  }, [page, totalPages]);


  const startIndex =
    (page - 1) * PAGE_SIZE;


  const endIndex =
    page * PAGE_SIZE;


  const pageItems =
    filtered.slice(
      startIndex,
      endIndex
    );


  // ==========================================================
  // TOGGLE CATEGORY
  // ==========================================================

  function toggleCategory(categoryId) {

    const normalized =
      CATEGORY_ALIASES[categoryId] ||
      categoryId;


    setSelectedCategories((previous) => {

      if (
        previous.includes(normalized)
      ) {

        return previous.filter(
          (category) =>
            category !== normalized
        );

      }


      return [
        ...previous,
        normalized,
      ];

    });

  }


  // ==========================================================
  // TOGGLE BRAND
  // ==========================================================

  function toggleBrand(brand) {

    setSelectedBrands((previous) => {

      if (previous.includes(brand)) {

        return previous.filter(
          (item) =>
            item !== brand
        );

      }


      return [
        ...previous,
        brand,
      ];

    });

  }


  // ==========================================================
  // TOGGLE AVAILABILITY
  // ==========================================================

  function toggleAvailability(status) {

    setAvailability((previous) => {

      if (previous.includes(status)) {

        return previous.filter(
          (item) =>
            item !== status
        );

      }


      return [
        ...previous,
        status,
      ];

    });

  }


  // ==========================================================
  // CLEAR FILTERS
  // ==========================================================

  function clearFilters() {

    const category =
      presetCategory
        ? (
            CATEGORY_ALIASES[presetCategory] ||
            presetCategory
          )
        : null;


    setSelectedCategories(
      category
        ? [category]
        : []
    );


    setSelectedBrands([]);

    setAvailability([]);

    setPriceRange(MAX_PRICE);

    setPage(1);


    // Keep preset category if one exists.
    if (category) {

      setSearchParams({
        category,
      });

    } else {

      setSearchParams({});

    }

  }


  // ==========================================================
  // CATEGORY LIST
  // ==========================================================

  const filterCategories = presetCategory

    ? categories.filter((category) => {

        const normalized =
          CATEGORY_ALIASES[category.id] ||
          category.id;

        const target =
          CATEGORY_ALIASES[presetCategory] ||
          presetCategory;

        return normalized === target;

      })

    : categories;


  // ==========================================================
  // HERO STYLE
  // ==========================================================

  const heroStyle = heroImage
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
  // RENDER
  // ==========================================================

  return (

    <section
      className="shop-page"
    >

      {/* ======================================================
          HERO
      ====================================================== */}

      <div
        className="shop-hero"
        style={heroStyle}
      >

        <div className="container">

          <Breadcrumb
            items={[
              {
                to: "/shop",
                label: "Shop",
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


      {/* ======================================================
          PRODUCTS SECTION
      ====================================================== */}

      <section className="section">

        <div className="container shop-layout">


          {/* ==================================================
              FILTERS
          ================================================== */}

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


          {/* ==================================================
              RESULTS
          ================================================== */}

          <div className="shop-results">


            {/* ================================================
                TOOLBAR
            ================================================= */}

            <div className="shop-toolbar">


              {/* PRODUCT COUNT */}

              <span className="shop-count">

                Showing{" "}

                {pageItems.length > 0
                  ? startIndex + 1
                  : 0}

                –

                {Math.min(
                  endIndex,
                  filtered.length
                )}

                {" "}of{" "}

                {filtered.length}

                {" "}products

              </span>


              {/* ============================================
                  TOOLBAR ACTIONS
              ============================================= */}

              <div className="shop-toolbar-actions">


                {/* SORT */}

                <select
                  value={sort}
                  onChange={(event) =>
                    setSort(
                      event.target.value
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


                {/* VIEW TOGGLE */}

                <div
                  className="shop-view-toggle"
                >

                  <button
                    type="button"
                    className={
                      view === "grid"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setView("grid")
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
                      view === "list"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setView("list")
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


            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {pageItems.length === 0 ? (

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
                  No products match your
                  current filters.
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

              /* =================================================
                 PRODUCTS
              ================================================= */

              <div
                className={
                  view === "grid"
                    ? "grid-3"
                    : "shop-list"
                }
              >

                {pageItems.map(
                  (product) => (

                    <ProductCard
                      key={product.id}
                      product={product}
                    />

                  )
                )}

              </div>

            )}


            {/* =================================================
                PAGINATION
            ================================================= */}

            {filtered.length > 0 && (

              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={setPage}
              />

            )}

          </div>

        </div>

      </section>

    </section>

  );

}