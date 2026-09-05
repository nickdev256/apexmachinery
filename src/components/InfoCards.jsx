// ============================================================
// APEXMACH UG
// INFO CARDS
// ============================================================

import { Link } from "react-router-dom";

import Icon from "./Icon";

import "./InfoCards.css";


// ============================================================
// STAT CARD
// ============================================================

export function StatCard({
  value,
  label,
}) {

  return (

    <div className="stat-card">

      <div className="stat-value">
        {value ?? "—"}
      </div>

      <div className="stat-label">
        {label}
      </div>

    </div>

  );

}


// ============================================================
// FEATURE CARD
// ============================================================

export function FeatureCard({
  icon,
  title,
  text,
}) {

  return (

    <article className="feature-card card">

      <div
        className="feature-icon"
        aria-hidden="true"
      >

        <Icon
          name={icon}
          size={26}
        />

      </div>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

    </article>

  );

}


// ============================================================
// CATEGORY CARD
// ============================================================

export function CategoryCard({
  id,
  slug,
  name,
  image,
}) {

  // Prefer readable category slug.
  const categoryId =
    slug ||
    id ||
    "";

  const categoryPath =
    `/shop?category=${encodeURIComponent(
      categoryId
    )}`;

  return (

    <Link
      to={categoryPath}
      className="category-card"
      aria-label={`Browse ${name}`}
    >

      {/* ======================================================
          IMAGE
      ====================================================== */}

      <div className="category-card-media">

        {image ? (

          <img
            src={image}
            alt={name || "ApexMach UG category"}
            loading="lazy"
            decoding="async"

            onError={(event) => {

              event.currentTarget.style.display =
                "none";

              const placeholder =
                event.currentTarget
                  .parentElement
                  ?.querySelector(
                    ".category-image-placeholder"
                  );

              if (placeholder) {
                placeholder.style.display =
                  "flex";
              }

            }}
          />

        ) : null}


        {/* ====================================================
            IMAGE FALLBACK
        ==================================================== */}

        <div
          className="category-image-placeholder"
          style={{
            display:
              image
                ? "none"
                : "flex",
          }}
        >

          <Icon
            name="image"
            size={34}
          />

          <span>
            {name || "Category"}
          </span>

        </div>

      </div>


      {/* ======================================================
          LABEL
      ====================================================== */}

      <div className="category-card-label">

        <span>
          {name}
        </span>

        <Icon
          name="arrowRight"
          size={16}
        />

      </div>

    </Link>

  );

}


// ============================================================
// BRAND CARD
// ============================================================

export function BrandCard({
  brand,
}) {

  if (!brand) {
    return null;
  }


  // ----------------------------------------------------------
  // BRAND URL
  // ----------------------------------------------------------

  const brandId =
    brand.slug ||
    brand.id ||
    brand.name ||
    "";

  const brandPath =
    `/shop?brand=${encodeURIComponent(
      brandId
    )}`;


  // ----------------------------------------------------------
  // SAFE DATA
  // ----------------------------------------------------------

  const tags =
    Array.isArray(brand.tags)
      ? brand.tags
      : [];

  const rating =
    brand.rating !== null &&
    brand.rating !== undefined
      ? Number(
          brand.rating
        ).toFixed(1)
      : "—";

  const productCount =
    Number(
      brand.products ??
      brand.productCount ??
      0
    );

  const established =
    brand.established ||
    brand.establishedYear ||
    "—";


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <article className="brand-card card">

      {/* ======================================================
          TOP
      ====================================================== */}

      <div className="brand-card-top">

        <div>

          {brand.tagline && (

            <span className="eyebrow">

              {brand.tagline}

            </span>

          )}

          <h3>

            {brand.name}

          </h3>

        </div>


        <span
          className="stars"
          aria-label={`Rating ${rating}`}
        >

          <span aria-hidden="true">
            ★
          </span>

          {" "}

          {rating}

        </span>

      </div>


      {/* ======================================================
          DESCRIPTION
      ====================================================== */}

      {brand.description && (

        <p className="brand-card-desc">

          {brand.description}

        </p>

      )}


      {/* ======================================================
          STATS
      ====================================================== */}

      <div className="brand-card-stats">

        <div>

          <strong>

            {
              productCount > 0
                ? `${productCount}+`
                : "—"
            }

          </strong>

          <span>
            Products
          </span>

        </div>


        <div>

          <strong>

            {established}

          </strong>

          <span>
            Established
          </span>

        </div>


        <div className="brand-verified">

          <Icon
            name="shield"
            size={16}
          />

          <span>
            Verified
          </span>

        </div>

      </div>


      {/* ======================================================
          TAGS
      ====================================================== */}

      {tags.length > 0 && (

        <div className="brand-card-tags">

          {tags.map(
            (tag) => (

              <span
                key={tag}
                className="
                  badge
                  badge-navy
                "
              >

                {tag}

              </span>

            )
          )}

        </div>

      )}


      {/* ======================================================
          BUTTON
      ====================================================== */}

      <Link
        to={brandPath}
        className="
          btn
          btn-primary
          btn-block
        "
        aria-label={`View ${brand.name} catalog`}
      >

        View Catalog

        <Icon
          name="arrowRight"
          size={16}
        />

      </Link>

    </article>

  );

}