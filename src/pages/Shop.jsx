import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useSearchParams } from 'react-router-dom';

import Filters from '../components/Filters';
import ProductCard from '../components/ProductCard';

import {
  getProducts,
  getProductCategories,
} from '../services/productApi';

import './Shop.css';


// ============================================================
// HELPERS
// ============================================================

function getProductsArray(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.products)) {
    return data.products;
  }

  if (Array.isArray(data?.data?.products)) {
    return data.data.products;
  }

  return [];
}


function getCategoriesArray(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.categories)) {
    return data.categories;
  }

  if (Array.isArray(data?.data?.categories)) {
    return data.data.categories;
  }

  return [];
}


function getProductPrice(product) {
  const price = Number(product?.price);

  return Number.isFinite(price)
    ? price
    : 0;
}


// ============================================================
// SHOP PAGE
// ============================================================

export default function Shop({
  title = 'Industrial Equipment',
  initialCategory = '',
}) {

  const [searchParams] =
    useSearchParams();


  // ==========================================================
  // BACKEND DATA
  // ==========================================================

  const [
    products,
    setProducts,
  ] = useState([]);


  const [
    categories,
    setCategories,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState('');


  // ==========================================================
  // FILTER STATE
  // ==========================================================

  const [
    selectedCategories,
    setSelectedCategories,
  ] = useState(
    initialCategory
      ? [initialCategory]
      : []
  );


  const [
    selectedBrands,
    setSelectedBrands,
  ] = useState([]);


  const [
    availability,
    setAvailability,
  ] = useState([]);


  const [
    priceRange,
    setPriceRange,
  ] = useState(0);


  const [
    sortBy,
    setSortBy,
  ] = useState('featured');


  // ==========================================================
  // SEARCH
  // ==========================================================

  const searchTerm =
    (
      searchParams.get('q') ||
      searchParams.get('search') ||
      ''
    )
      .trim()
      .toLowerCase();


  // ==========================================================
  // LOAD PRODUCTS + CATEGORIES FROM BACKEND
  // ==========================================================

  async function loadCatalogue() {

    try {

      setLoading(true);
      setError('');


      const [
        productResponse,
        categoryResponse,
      ] = await Promise.all([
        getProducts(),
        getProductCategories(),
      ]);


      const productList =
        getProductsArray(
          productResponse
        );


      const categoryList =
        getCategoriesArray(
          categoryResponse
        );


      setProducts(
        productList
      );


      setCategories(
        categoryList
      );


      // ----------------------------------------------
      // Calculate highest product price
      // ----------------------------------------------

      const prices =
        productList
          .map(
            getProductPrice
          )
          .filter(
            (
              price
            ) =>
              price > 0
          );


      const highestPrice =
        prices.length
          ? Math.max(
              ...prices
            )
          : 0;


      setPriceRange(
        highestPrice
      );


    } catch (
      loadError
    ) {

      console.error(
        'Shop loading error:',
        loadError
      );


      setError(
        loadError?.response?.data?.message ||
        loadError?.message ||
        'Unable to load products.'
      );


      setProducts([]);
      setCategories([]);

    } finally {

      setLoading(false);

    }

  }


  useEffect(
    () => {

      loadCatalogue();

    },
    []
  );


  // ==========================================================
  // DATABASE BRANDS
  // ==========================================================

  const brands =
    useMemo(
      () => {

        const values =
          products
            .map(
              (
                product
              ) =>
                product?.brand
            )
            .filter(Boolean)
            .map(
              (
                brand
              ) =>
                String(
                  brand
                ).trim()
            );


        return [
          ...new Set(
            values
          ),
        ].sort(
          (
            a,
            b
          ) =>
            a.localeCompare(
              b
            )
        );

      },
      [products]
    );


  // ==========================================================
  // DATABASE AVAILABILITY OPTIONS
  // ==========================================================

  const availabilityOptions =
    useMemo(
      () => {

        const values =
          products
            .map(
              (
                product
              ) =>
                product?.status
            )
            .filter(Boolean)
            .map(
              (
                status
              ) =>
                String(
                  status
                ).trim()
            );


        return [
          ...new Set(
            values
          ),
        ];

      },
      [products]
    );


  // ==========================================================
  // MAX DATABASE PRICE
  // ==========================================================

  const maxPrice =
    useMemo(
      () => {

        const prices =
          products
            .map(
              getProductPrice
            )
            .filter(
              (
                price
              ) =>
                price > 0
            );


        return prices.length
          ? Math.max(
              ...prices
            )
          : 0;

      },
      [products]
    );


  // ==========================================================
  // KEEP PRICE RANGE VALID
  // ==========================================================

  useEffect(
    () => {

      if (
        maxPrice > 0 &&
        (
          priceRange === 0 ||
          priceRange > maxPrice
        )
      ) {

        setPriceRange(
          maxPrice
        );

      }

    },
    [
      maxPrice,
    ]
  );


  // ==========================================================
  // TOGGLE CATEGORY
  // ==========================================================

  function toggleCategory(
    category
  ) {

    setSelectedCategories(
      (
        current
      ) => {

        if (
          current.includes(
            category
          )
        ) {

          return current.filter(
            (
              item
            ) =>
              item !==
              category
          );

        }


        return [
          ...current,
          category,
        ];

      }
    );

  }


  // ==========================================================
  // TOGGLE BRAND
  // ==========================================================

  function toggleBrand(
    brand
  ) {

    setSelectedBrands(
      (
        current
      ) => {

        if (
          current.includes(
            brand
          )
        ) {

          return current.filter(
            (
              item
            ) =>
              item !==
              brand
          );

        }


        return [
          ...current,
          brand,
        ];

      }
    );

  }


  // ==========================================================
  // TOGGLE AVAILABILITY
  // ==========================================================

  function toggleAvailability(
    status
  ) {

    setAvailability(
      (
        current
      ) => {

        if (
          current.includes(
            status
          )
        ) {

          return current.filter(
            (
              item
            ) =>
              item !==
              status
          );

        }


        return [
          ...current,
          status,
        ];

      }
    );

  }


  // ==========================================================
  // CLEAR FILTERS
  // ==========================================================

  function clearFilters() {

    setSelectedCategories(
      initialCategory
        ? [initialCategory]
        : []
    );

    setSelectedBrands([]);

    setAvailability([]);

    setPriceRange(
      maxPrice
    );

    setSortBy(
      'featured'
    );

  }


  // ==========================================================
  // FILTER PRODUCTS
  // ==========================================================

  const filteredProducts =
    useMemo(
      () => {

        let result =
          [...products];


        // ----------------------------------------------
        // SEARCH
        // ----------------------------------------------

        if (
          searchTerm
        ) {

          result =
            result.filter(
              (
                product
              ) => {

                const searchable =
                  [
                    product?.name,
                    product?.brand,
                    product?.description,
                    product?.category,
                    product?.categoryName,
                    product?.status,
                  ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();


                return searchable.includes(
                  searchTerm
                );

              }
            );

        }


        // ----------------------------------------------
        // CATEGORY
        // ----------------------------------------------

        if (
          selectedCategories.length >
          0
        ) {

          result =
            result.filter(
              (
                product
              ) => {

                const possibleValues =
                  [
                    product?.category,
                    product?.categoryId,
                    product?.categorySlug,
                    product?.categoryName,
                  ].filter(Boolean);


                return possibleValues.some(
                  (
                    value
                  ) =>
                    selectedCategories.includes(
                      value
                    )
                );

              }
            );

        }


        // ----------------------------------------------
        // BRAND
        // ----------------------------------------------

        if (
          selectedBrands.length >
          0
        ) {

          result =
            result.filter(
              (
                product
              ) =>
                selectedBrands.includes(
                  product?.brand
                )
            );

        }


        // ----------------------------------------------
        // AVAILABILITY
        // ----------------------------------------------

        if (
          availability.length >
          0
        ) {

          result =
            result.filter(
              (
                product
              ) =>
                availability.includes(
                  product?.status
                )
            );

        }


        // ----------------------------------------------
        // PRICE
        // ----------------------------------------------

        if (
          priceRange > 0
        ) {

          result =
            result.filter(
              (
                product
              ) => {

                const price =
                  getProductPrice(
                    product
                  );


                // Products without numeric prices remain
                // visible because they may be quote-only.
                if (
                  price === 0
                ) {
                  return true;
                }


                return (
                  price <=
                  priceRange
                );

              }
            );

        }


        // ----------------------------------------------
        // SORT
        // ----------------------------------------------

        switch (
          sortBy
        ) {

          case 'price-low':

            result.sort(
              (
                a,
                b
              ) =>
                getProductPrice(
                  a
                ) -
                getProductPrice(
                  b
                )
            );

            break;


          case 'price-high':

            result.sort(
              (
                a,
                b
              ) =>
                getProductPrice(
                  b
                ) -
                getProductPrice(
                  a
                )
            );

            break;


          case 'name':

            result.sort(
              (
                a,
                b
              ) =>
                String(
                  a?.name ||
                  ''
                ).localeCompare(
                  String(
                    b?.name ||
                    ''
                  )
                )
            );

            break;


          case 'rating':

            result.sort(
              (
                a,
                b
              ) =>
                Number(
                  b?.rating ||
                  0
                ) -
                Number(
                  a?.rating ||
                  0
                )
            );

            break;


          case 'newest':

            result.sort(
              (
                a,
                b
              ) =>
                new Date(
                  b?.createdAt ||
                  b?.created_at ||
                  0
                ) -
                new Date(
                  a?.createdAt ||
                  a?.created_at ||
                  0
                )
            );

            break;


          case 'featured':
          default:

            result.sort(
              (
                a,
                b
              ) => {

                const featuredA =
                  a?.isFeatured
                    ? 1
                    : 0;


                const featuredB =
                  b?.isFeatured
                    ? 1
                    : 0;


                return (
                  featuredB -
                  featuredA
                );

              }
            );

            break;

        }


        return result;

      },
      [
        products,
        searchTerm,
        selectedCategories,
        selectedBrands,
        availability,
        priceRange,
        sortBy,
      ]
    );


  // ==========================================================
  // LOADING
  // ==========================================================

  if (
    loading
  ) {

    return (

      <main className="shop-page">

        <div className="container">

          <div className="shop-loading">

            <div className="shop-spinner" />

            <h3>
              Loading equipment...
            </h3>

            <p>
              Retrieving products from
              Apex Machinery.
            </p>

          </div>

        </div>

      </main>

    );

  }


  // ==========================================================
  // ERROR
  // ==========================================================

  if (
    error
  ) {

    return (

      <main className="shop-page">

        <div className="container">

          <div className="shop-error">

            <h2>
              Unable to load catalog
            </h2>


            <p>
              {error}
            </p>


            <button
              type="button"
              className="btn btn-gold"
              onClick={
                loadCatalogue
              }
            >
              Try Again
            </button>

          </div>

        </div>

      </main>

    );

  }


  // ==========================================================
  // PAGE
  // ==========================================================

  return (

    <main className="shop-page">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <section className="shop-hero">

        <div className="container">

          <div className="shop-hero-content">

            <span className="shop-eyebrow">
              Apex Machinery
            </span>


            <h1>
              {
                searchTerm
                  ? `Search results for "${searchParams.get('q') || searchParams.get('search')}"`
                  : title
              }
            </h1>


            <p>

              Browse industrial machinery,
              equipment and professional
              tools available through
              Apex Machinery.

            </p>

          </div>

        </div>

      </section>


      {/* ======================================================
          SHOP CONTENT
      ====================================================== */}

      <section className="shop-section">

        <div className="container">

          <div className="shop-layout">


            {/* ==================================================
                FILTERS
            ================================================== */}

            <div className="shop-sidebar">

              <Filters
                categories={
                  categories
                }
                brands={
                  brands
                }
                availabilityOptions={
                  availabilityOptions
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
                  maxPrice
                }
                currency="UGX"
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

            </div>


            {/* ==================================================
                PRODUCTS
            ================================================== */}

            <div className="shop-main">


              {/* ================================================
                  TOOLBAR
              ================================================ */}

              <div className="shop-toolbar">

                <div className="shop-results-count">

                  <strong>
                    {
                      filteredProducts.length
                    }
                  </strong>

                  {' '}

                  {
                    filteredProducts.length ===
                    1
                      ? 'product'
                      : 'products'
                  }

                </div>


                <div className="shop-sort">

                  <label
                    htmlFor="shop-sort"
                  >
                    Sort by
                  </label>


                  <select
                    id="shop-sort"
                    value={
                      sortBy
                    }
                    onChange={
                      (
                        event
                      ) =>
                        setSortBy(
                          event.target.value
                        )
                    }
                  >

                    <option value="featured">
                      Featured
                    </option>

                    <option value="newest">
                      Newest
                    </option>

                    <option value="price-low">
                      Price: Low to High
                    </option>

                    <option value="price-high">
                      Price: High to Low
                    </option>

                    <option value="rating">
                      Highest Rated
                    </option>

                    <option value="name">
                      Name A-Z
                    </option>

                  </select>

                </div>

              </div>


              {/* ================================================
                  PRODUCT GRID
              ================================================ */}

              {
                filteredProducts.length >
                0
                  ? (

                    <div className="shop-grid">

                      {
                        filteredProducts.map(
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
                        )
                      }

                    </div>

                  )
                  : (

                    <div className="shop-empty">

                      <h3>
                        No products found
                      </h3>


                      <p>

                        No products match
                        your selected filters.

                      </p>


                      <button
                        type="button"
                        className="btn btn-gold"
                        onClick={
                          clearFilters
                        }
                      >
                        Clear Filters
                      </button>

                    </div>

                  )
              }


            </div>

          </div>

        </div>

      </section>


    </main>

  );

}