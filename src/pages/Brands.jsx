import { useState } from 'react';
import { Link } from 'react-router-dom';

import Breadcrumb from '../components/Breadcrumb';
import Icon from '../components/Icon';
import { BrandCard } from '../components/InfoCards';

import {
  brands,
  emergingBrands,
} from '../data/brands';

import './Brands.css';


export default function Brands() {

  const [query, setQuery] = useState('');


  // ============================================================
  // FILTER BRANDS
  // ============================================================

  const filtered = brands.filter((brand) =>
    brand.name
      .toLowerCase()
      .includes(query.toLowerCase())
  );


  return (

    <div className="brands-page">


      {/* ======================================================
          BREADCRUMB
      ====================================================== */}

      <Breadcrumb
        items={[
          {
            label: 'Brands'
          }
        ]}
      />


      {/* ======================================================
          BRANDS HERO
      ====================================================== */}

      <section className="brands-hero">

        <div className="container">

          <span className="eyebrow">
            Our Brands
          </span>

          <h1>
            Trusted Equipment
            <br />
            Brands
          </h1>

          <p>
            Explore equipment brands available through
            Apex Machinery. We help businesses, contractors,
            workshops and industrial operations find reliable
            machinery and equipment for their applications.
          </p>

        </div>

      </section>


      {/* ======================================================
          BRANDS CONTENT
      ====================================================== */}

      <section className="section">

        <div className="container">


          {/* ==================================================
              SEARCH TOOLBAR
          ================================================== */}

          <div className="brands-toolbar">

            <div className="brands-search">

              <Icon
                name="search"
                size={18}
              />

              <input
                type="text"
                placeholder="Search industrial brands..."
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
              />

              {query && (

                <button
                  type="button"
                  className="brands-search-clear"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                >
                  <Icon
                    name="x"
                    size={16}
                  />
                </button>

              )}

            </div>


            <span className="brands-count">

              {filtered.length}

              {' '}

              {filtered.length === 1
                ? 'Brand Found'
                : 'Brands Found'}

            </span>

          </div>


          {/* ==================================================
              VERIFIED BRANDS
          ================================================== */}

          <div className="brands-section-heading">

            <span className="eyebrow">
              Browse by Manufacturer
            </span>

            <h2 className="section-heading">
              Equipment Brands
            </h2>

            <p className="section-sub">
              Explore the manufacturers and equipment
              brands available through Apex Machinery.
            </p>

          </div>


          {/* ==================================================
              BRAND GRID
          ================================================== */}

          {filtered.length > 0 ? (

            <div className="grid-2">

              {filtered.map((brand) => (

                <BrandCard
                  key={brand.id}
                  brand={brand}
                />

              ))}

            </div>

          ) : (

            <div className="brands-empty">

              <Icon
                name="search"
                size={36}
              />

              <h3>
                No Brands Found
              </h3>

              <p>
                We couldn't find a brand matching
                "{query}".
              </p>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setQuery('')}
              >
                View All Brands
              </button>

            </div>

          )}


          {/* ==================================================
              EMERGING BRANDS
          ================================================== */}

          {emergingBrands.length > 0 && (

            <div className="emerging-brands">

              <div className="emerging-header">

                <div>

                  <span className="eyebrow">
                    Growing Partners
                  </span>

                  <h3>
                    Emerging Brands &amp; Partners
                  </h3>

                  <p>
                    Specialized equipment manufacturers
                    and niche industrial solutions.
                  </p>

                </div>

              </div>


              <div className="emerging-grid">

                {emergingBrands.map((name) => (

                  <div
                    key={name}
                    className="emerging-tile"
                  >

                    <Icon
                      name="settings"
                      size={22}
                    />

                    <span>
                      {name}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          )}


          {/* ==================================================
              BULK PROCUREMENT CTA
          ================================================== */}

          <div className="bulk-cta">

            <div className="bulk-cta-content">

              <span className="eyebrow">
                Enterprise Procurement
              </span>

              <h3>
                Need Equipment in Bulk?
              </h3>

              <p>
                Whether you are setting up a workshop,
                hotel, factory, construction project or
                commercial facility, our team can help
                you source the equipment you need.
              </p>

            </div>


            <div className="bulk-cta-action">

              <Link
                to="/contact"
                className="btn btn-gold"
              >
                Request a Bulk Quote
              </Link>

            </div>

          </div>

        </div>

      </section>

    </div>

  );
}