import {
  Link,
} from 'react-router-dom';

import Icon from './Icon';

import './Filters.css';


// ============================================================
// FORMAT MONEY
// ============================================================

function formatMoney(
  value,
  currency = 'UGX'
) {

  const amount =
    Number(
      value ||
      0
    );


  try {

    return new Intl.NumberFormat(
      'en-UG',
      {
        style:
          'currency',

        currency,

        maximumFractionDigits:
          0,
      }
    ).format(
      amount
    );

  } catch {

    return `UGX ${amount.toLocaleString()}`;

  }

}


// ============================================================
// FILTERS
// ============================================================

export default function Filters({
  categories = [],
  brands = [],
  availabilityOptions = [],
  selectedCategories = [],
  selectedBrands = [],
  availability = [],
  priceRange = 0,
  maxPrice = 0,
  currency = 'UGX',
  onToggleCategory,
  onToggleBrand,
  onToggleAvailability,
  onPriceChange,
  onClear,
}) {


  // ==========================================================
  // CATEGORY HELPERS
  // ==========================================================

  function getCategoryValue(
    category
  ) {

    if (!category) {
      return '';
    }


    return String(
      category.slug ||
      category.id ||
      category.categoryId ||
      ''
    );

  }


  function getCategoryName(
    category
  ) {

    if (!category) {
      return 'Unnamed Category';
    }


    return (
      category.name ||
      category.title ||
      category.categoryName ||
      'Unnamed Category'
    );

  }


  // ==========================================================
  // BRAND HELPERS
  // ==========================================================

  function getBrandValue(
    brand
  ) {

    if (
      typeof brand ===
      'string'
    ) {

      return brand;

    }


    return String(
      brand?.name ||
      brand?.slug ||
      ''
    );

  }


  function getBrandName(
    brand
  ) {

    if (
      typeof brand ===
      'string'
    ) {

      return brand;

    }


    return (
      brand?.name ||
      brand?.title ||
      'Unknown Brand'
    );

  }


  // ==========================================================
  // AVAILABILITY
  // ==========================================================

  const statuses =
    availabilityOptions.length >
    0
      ? availabilityOptions
      : [
          'In Stock',
          'Limited',
          'Available on Order',
          'Out of Stock',
        ];


  // ==========================================================
  // PRICE
  // ==========================================================

  const safeMaxPrice =
    Math.max(
      Number(
        maxPrice ||
        0
      ),
      1
    );


  const safePriceRange =
    Math.min(
      Math.max(
        Number(
          priceRange ||
          0
        ),
        0
      ),
      safeMaxPrice
    );


  // ==========================================================
  // ACTIVE FILTER COUNT
  // ==========================================================

  const activeFilterCount =
    selectedCategories.length +
    selectedBrands.length +
    availability.length +
    (
      safePriceRange <
      safeMaxPrice
        ? 1
        : 0
    );


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <aside
      className="filters card"
      aria-label="Product filters"
    >


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="filters-header">

        <div className="filters-title">

          <Icon
            name="menu"
            size={16}
          />

          <span>
            Filters
          </span>


          {
            activeFilterCount >
            0 && (

              <span className="filters-count">
                {
                  activeFilterCount
                }
              </span>

            )
          }

        </div>


        <button
          type="button"
          onClick={
            onClear
          }
          className="filters-clear"
          disabled={
            activeFilterCount ===
            0
          }
        >
          Clear All
        </button>

      </div>


      {/* ======================================================
          CATEGORY
      ====================================================== */}

      <div className="filters-group">

        <h4>
          Category
        </h4>


        <div className="filters-options">

          {
            categories.length >
            0
              ? (

                categories.map(
                  (
                    category
                  ) => {

                    const value =
                      getCategoryValue(
                        category
                      );


                    const name =
                      getCategoryName(
                        category
                      );


                    if (!value) {
                      return null;
                    }


                    const checked =
                      selectedCategories.includes(
                        value
                      );


                    return (

                      <label
                        key={
                          category.id ||
                          value
                        }
                        className="filters-checkbox"
                      >

                        <input
                          type="checkbox"
                          checked={
                            checked
                          }
                          onChange={
                            () =>
                              onToggleCategory?.(
                                value
                              )
                          }
                        />


                        <span className="filters-checkbox-label">
                          {
                            name
                          }
                        </span>

                      </label>

                    );

                  }
                )

              )
              : (

                <p className="filters-empty">
                  No categories available.
                </p>

              )
          }

        </div>

      </div>


      {/* ======================================================
          BRAND
      ====================================================== */}

      <div className="filters-group">

        <h4>
          Brand
        </h4>


        <div className="filters-options">

          {
            brands.length >
            0
              ? (

                brands.map(
                  (
                    brand
                  ) => {

                    const value =
                      getBrandValue(
                        brand
                      );


                    const name =
                      getBrandName(
                        brand
                      );


                    if (!value) {
                      return null;
                    }


                    const checked =
                      selectedBrands.includes(
                        value
                      );


                    return (

                      <label
                        key={
                          typeof brand ===
                          'string'
                            ? brand
                            : brand.id ||
                              value
                        }
                        className="filters-checkbox"
                      >

                        <input
                          type="checkbox"
                          checked={
                            checked
                          }
                          onChange={
                            () =>
                              onToggleBrand?.(
                                value
                              )
                          }
                        />


                        <span className="filters-checkbox-label">
                          {
                            name
                          }
                        </span>

                      </label>

                    );

                  }
                )

              )
              : (

                <p className="filters-empty">
                  No brands available.
                </p>

              )
          }

        </div>

      </div>


      {/* ======================================================
          AVAILABILITY
      ====================================================== */}

      <div className="filters-group">

        <h4>
          Availability
        </h4>


        <div className="filters-options">

          {
            statuses.map(
              (
                status
              ) => {

                const value =
                  typeof status ===
                  'string'
                    ? status
                    : status?.value ||
                      status?.name ||
                      '';


                const label =
                  typeof status ===
                  'string'
                    ? status
                    : status?.label ||
                      status?.name ||
                      value;


                if (!value) {
                  return null;
                }


                return (

                  <label
                    key={
                      value
                    }
                    className="filters-checkbox"
                  >

                    <input
                      type="checkbox"
                      checked={
                        availability.includes(
                          value
                        )
                      }
                      onChange={
                        () =>
                          onToggleAvailability?.(
                            value
                          )
                      }
                    />


                    <span className="filters-checkbox-label">
                      {
                        label
                      }
                    </span>

                  </label>

                );

              }
            )
          }

        </div>

      </div>


      {/* ======================================================
          PRICE
      ====================================================== */}

      <div className="filters-group filters-price-group">

        <div className="filters-group-heading">

          <h4>
            Price Range
          </h4>


          <span>
            {
              formatMoney(
                safePriceRange,
                currency
              )
            }
          </span>

        </div>


        <input
          type="range"
          min={0}
          max={
            safeMaxPrice
          }
          step={1000}
          value={
            safePriceRange
          }
          onChange={
            (
              event
            ) =>
              onPriceChange?.(
                Number(
                  event.target.value
                )
              )
          }
          className="filters-range"
          aria-label="Maximum product price"
          aria-valuemin={0}
          aria-valuemax={
            safeMaxPrice
          }
          aria-valuenow={
            safePriceRange
          }
        />


        <div className="filters-range-labels">

          <span>
            {
              formatMoney(
                0,
                currency
              )
            }
          </span>


          <span>
            {
              formatMoney(
                safeMaxPrice,
                currency
              )
            }
          </span>

        </div>


        <div className="filters-range-value">

          Products up to{' '}

          <strong>
            {
              formatMoney(
                safePriceRange,
                currency
              )
            }
          </strong>

        </div>

      </div>


      {/* ======================================================
          PROCUREMENT PROMO
      ====================================================== */}

      <div className="filters-promo">

        <div className="filters-promo-icon">

          <Icon
            name="bolt"
            size={22}
          />

        </div>


        <strong>
          Urgent Procurement?
        </strong>


        <p>
          Our technical advisors are
          available for custom industrial
          quotations and equipment
          sourcing.
        </p>


        <Link
          to="/contact"
          className="btn btn-gold btn-sm btn-block"
        >
          Speak to an Expert
        </Link>

      </div>


    </aside>

  );

}