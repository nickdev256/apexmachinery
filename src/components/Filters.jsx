import { Link } from 'react-router-dom';

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
      value || 0
    );

  return new Intl.NumberFormat(
    'en-UG',
    {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }
  ).format(
    amount
  );
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

    return (
      category?.slug ||
      category?.id ||
      category?.categoryId ||
      ''
    );

  }


  function getCategoryName(
    category
  ) {

    return (
      category?.name ||
      category?.title ||
      category?.categoryName ||
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


    return (
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
  // RENDER
  // ==========================================================

  return (

    <aside className="filters card">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="filters-header">

        <span>

          <Icon
            name="menu"
            size={16}
          />

          Filters

        </span>


        <button
          type="button"
          onClick={
            onClear
          }
          className="filters-clear"
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


        {categories.length >
        0 ? (

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


              if (
                !value
              ) {
                return null;
              }


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
                      selectedCategories.includes(
                        value
                      )
                    }
                    onChange={
                      () =>
                        onToggleCategory?.(
                          value
                        )
                    }
                  />


                  <span>
                    {name}
                  </span>

                </label>

              );

            }
          )

        ) : (

          <p className="filters-empty">
            No categories available.
          </p>

        )}

      </div>


      {/* ======================================================
          BRAND
      ====================================================== */}

      <div className="filters-group">

        <h4>
          Brand
        </h4>


        {brands.length >
        0 ? (

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


              if (
                !value
              ) {
                return null;
              }


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
                      selectedBrands.includes(
                        value
                      )
                    }
                    onChange={
                      () =>
                        onToggleBrand?.(
                          value
                        )
                    }
                  />


                  <span>
                    {name}
                  </span>

                </label>

              );

            }
          )

        ) : (

          <p className="filters-empty">
            No brands available.
          </p>

        )}

      </div>


      {/* ======================================================
          AVAILABILITY
      ====================================================== */}

      <div className="filters-group">

        <h4>
          Availability
        </h4>


        {statuses.map(
          (
            status
          ) => (

            <label
              key={
                status
              }
              className="filters-checkbox"
            >

              <input
                type="checkbox"
                checked={
                  availability.includes(
                    status
                  )
                }
                onChange={
                  () =>
                    onToggleAvailability?.(
                      status
                    )
                }
              />


              <span>
                {status}
              </span>

            </label>

          )
        )}

      </div>


      {/* ======================================================
          PRICE
      ====================================================== */}

      <div className="filters-group">

        <h4>
          Price Range
        </h4>


        <input
          type="range"
          min={0}
          max={
            Math.max(
              Number(
                maxPrice ||
                0
              ),
              1
            )
          }
          step={1000}
          value={
            Math.min(
              Number(
                priceRange ||
                0
              ),
              Math.max(
                Number(
                  maxPrice ||
                  0
                ),
                1
              )
            )
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
        />


        <div className="filters-range-value">

          Up to{' '}

          <strong>
            {
              formatMoney(
                priceRange,
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

        <Icon
          name="bolt"
          size={22}
        />


        <strong>
          Urgent Procurement?
        </strong>


        <p>

          Our technical advisors
          are available for custom
          industrial quotations.

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