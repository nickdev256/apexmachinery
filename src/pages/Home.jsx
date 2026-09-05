import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
} from 'react-router-dom';

import Icon from '../components/Icon';

import ProductCard from '../components/ProductCard';

import {
  StatCard,
  FeatureCard,
} from '../components/InfoCards';

import {
  getHomePage,
} from '../services/homeApi';

import './Home.css';


// ============================================================
// HOME PAGE
// ============================================================

export default function Home() {

  const [
    home,
    setHome,
  ] =
    useState(null);


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    error,
    setError,
  ] =
    useState('');


  // ==========================================================
  // LOAD HOME FROM BACKEND
  // ==========================================================

  async function loadHome() {

    try {

      setLoading(
        true
      );

      setError(
        ''
      );


      const data =
        await getHomePage();


      setHome(
        data
      );

    } catch (
      requestError
    ) {

      console.error(
        'Home page loading error:',
        requestError
      );


      setError(
        requestError
          ?.response
          ?.data
          ?.message ||
          'Unable to load homepage.'
      );

    } finally {

      setLoading(
        false
      );

    }

  }


  useEffect(
    () => {

      loadHome();

    },
    []
  );


  // ==========================================================
  // LOADING
  // ==========================================================

  if (
    loading
  ) {

    return (

      <div className="home-page">

        <section className="section">

          <div className="container">

            <div className="home-products-message">

              <Icon
                name="clock"
                size={28}
              />

              <p>
                Loading Apex Machinery...
              </p>

            </div>

          </div>

        </section>

      </div>

    );

  }


  // ==========================================================
  // ERROR
  // ==========================================================

  if (
    error ||
    !home
  ) {

    return (

      <div className="home-page">

        <section className="section">

          <div className="container">

            <div className="home-products-message">

              <Icon
                name="alert-circle"
                size={32}
              />


              <h2>
                Unable to load homepage
              </h2>


              <p>
                {error}
              </p>


              <button
                type="button"
                className="btn btn-primary"
                onClick={
                  loadHome
                }
              >
                Try Again
              </button>

            </div>

          </div>

        </section>

      </div>

    );

  }


  // ==========================================================
  // DATA
  // ==========================================================

  const {
    hero,
    stats = [],
    about,
    featuredSection,
    categorySection,
    brandSection,
    featureSection,
    testimonialSection,
    cta,
  } =
    home;


  // ==========================================================
  // HERO STYLE
  // ==========================================================

  const heroStyle =
    hero?.image
      ? {

          backgroundImage: `
            linear-gradient(
              rgba(11, 31, 77, 0.78),
              rgba(11, 31, 77, 0.78)
            ),
            url("${hero.image}")
          `,

        }
      : undefined;


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="home-page">


      {/* ======================================================
          HERO
      ====================================================== */}

      {hero && (

        <section
          className="hero"
          style={
            heroStyle
          }
        >

          <div className="container hero-inner">

            <div className="hero-content">


              {hero.eyebrow && (

                <span className="eyebrow">
                  {hero.eyebrow}
                </span>

              )}


              {hero.title && (

                <h1>
                  {hero.title}
                </h1>

              )}


              {hero.subtitle && (

                <p className="hero-sub">
                  {hero.subtitle}
                </p>

              )}


              <div className="hero-actions">


                {hero
                  .primaryAction
                  ?.label &&
                  hero
                    .primaryAction
                    ?.link && (

                  <Link
                    to={
                      hero
                        .primaryAction
                        .link
                    }
                    className="btn btn-primary"
                  >

                    {
                      hero
                        .primaryAction
                        .label
                    }

                  </Link>

                )}


                {hero
                  .secondaryAction
                  ?.label &&
                  hero
                    .secondaryAction
                    ?.link && (

                  <Link
                    to={
                      hero
                        .secondaryAction
                        .link
                    }
                    className="btn btn-outline"
                  >

                    {
                      hero
                        .secondaryAction
                        .label
                    }

                  </Link>

                )}


              </div>

            </div>

          </div>

        </section>

      )}


      {/* ======================================================
          STATS
      ====================================================== */}

      {stats.length >
        0 && (

        <section className="section stats-section">

          <div className="container grid-4">

            {stats.map(
              (
                stat
              ) => (

                <StatCard
                  key={
                    stat.id
                  }
                  value={
                    `${stat.value}${stat.suffix || ''}`
                  }
                  label={
                    stat.label
                  }
                />

              )
            )}

          </div>

        </section>

      )}


      {/* ======================================================
          ABOUT
      ====================================================== */}

      {about && (

        <section className="section">

          <div className="container about-grid">


            <div>


              {about.eyebrow && (

                <span className="eyebrow">
                  {about.eyebrow}
                </span>

              )}


              {about.title && (

                <h2 className="section-heading">
                  {about.title}
                </h2>

              )}


              {about.description && (

                <p className="section-sub">
                  {about.description}
                </p>

              )}


              <div className="about-points">


                {about.mission && (

                  <div>

                    <h4>

                      <Icon
                        name={
                          about
                            .mission
                            .icon ||
                          'shield'
                        }
                        size={18}
                      />

                      {
                        about
                          .mission
                          .title
                      }

                    </h4>


                    <p>
                      {
                        about
                          .mission
                          .text
                      }
                    </p>

                  </div>

                )}


                {about.vision && (

                  <div>

                    <h4>

                      <Icon
                        name={
                          about
                            .vision
                            .icon ||
                          'bolt'
                        }
                        size={18}
                      />

                      {
                        about
                          .vision
                          .title
                      }

                    </h4>


                    <p>
                      {
                        about
                          .vision
                          .text
                      }
                    </p>

                  </div>

                )}


              </div>

            </div>


            {about.image && (

              <div className="about-media">

                <img
                  src={
                    about.image
                  }
                  alt={
                    about.title ||
                    'Apex Machinery'
                  }
                />

              </div>

            )}


          </div>

        </section>

      )}


      {/* ======================================================
          FEATURED PRODUCTS
      ====================================================== */}

      {featuredSection && (

        <section className="section section-light">

          <div className="container">


            <div className="section-header-row">

              <div>


                {featuredSection
                  .eyebrow && (

                  <span className="eyebrow">

                    {
                      featuredSection
                        .eyebrow
                    }

                  </span>

                )}


                {featuredSection
                  .title && (

                  <h2 className="section-heading">

                    {
                      featuredSection
                        .title
                    }

                  </h2>

                )}


              </div>


              <Link
                to="/shop"
                className="btn btn-outline-navy"
              >
                View All Products
              </Link>

            </div>


            {featuredSection
              .products
              ?.length >
            0 ? (

              <div className="grid-4">

                {featuredSection
                  .products
                  .map(
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

            ) : (

              <div className="home-products-message">

                <Icon
                  name="package"
                  size={28}
                />

                <p>
                  No featured products available.
                </p>

              </div>

            )}


          </div>

        </section>

      )}


      {/* ======================================================
          SPECIALIZED CATEGORIES
      ====================================================== */}

      {categorySection && (

        <section className="section section-light">

          <div className="container">


            <div className="section-header-row">

              <div>


                {categorySection
                  .eyebrow && (

                  <span className="eyebrow">

                    {
                      categorySection
                        .eyebrow
                    }

                  </span>

                )}


                {categorySection
                  .title && (

                  <h2 className="section-heading">

                    {
                      categorySection
                        .title
                    }

                  </h2>

                )}

              </div>

            </div>


            <div className="grid-4">

              {categorySection
                .categories
                ?.map(
                  (
                    category
                  ) => (

                    <Link
                      key={
                        category.id
                      }
                      to={
                        category.link
                      }
                      className="home-category-link"
                    >

                      <Icon
                        name={
                          category.icon ||
                          'settings'
                        }
                        size={28}
                      />


                      <div>

                        <h3>
                          {
                            category.title
                          }
                        </h3>


                        <p>
                          {
                            category.description
                          }
                        </p>

                      </div>


                    </Link>

                  )
                )}

            </div>

          </div>

        </section>

      )}


      {/* ======================================================
          MANUFACTURERS
      ====================================================== */}

      {brandSection && (

        <section className="section section-light">

          <div className="container text-center">


            {brandSection
              .eyebrow && (

              <span className="eyebrow">

                {
                  brandSection
                    .eyebrow
                }

              </span>

            )}


            {brandSection
              .title && (

              <h2 className="section-heading">

                {
                  brandSection
                    .title
                }

              </h2>

            )}


            <div className="brand-strip">

              {brandSection
                .brands
                ?.map(
                  (
                    brand
                  ) => (

                    <span
                      key={
                        brand.id
                      }
                    >

                      {
                        brand.name
                      }

                    </span>

                  )
                )}

            </div>


          </div>

        </section>

      )}


      {/* ======================================================
          WHY CHOOSE US
      ====================================================== */}

      {featureSection && (

        <section className="section">

          <div className="container">


            {featureSection
              .eyebrow && (

              <span className="eyebrow">

                {
                  featureSection
                    .eyebrow
                }

              </span>

            )}


            {featureSection
              .title && (

              <h2 className="section-heading">

                {
                  featureSection
                    .title
                }

              </h2>

            )}


            <div className="grid-4">

              {featureSection
                .features
                ?.map(
                  (
                    feature
                  ) => (

                    <FeatureCard
                      key={
                        feature.id
                      }
                      icon={
                        feature.icon
                      }
                      title={
                        feature.title
                      }
                      text={
                        feature.text
                      }
                    />

                  )
                )}

            </div>

          </div>

        </section>

      )}


      {/* ======================================================
          TESTIMONIALS
      ====================================================== */}

      {testimonialSection && (

        <section className="section section-light">

          <div className="container">


            {testimonialSection
              .eyebrow && (

              <span className="eyebrow">

                {
                  testimonialSection
                    .eyebrow
                }

              </span>

            )}


            {testimonialSection
              .title && (

              <h2 className="section-heading">

                {
                  testimonialSection
                    .title
                }

              </h2>

            )}


            <div className="grid-3">

              {testimonialSection
                .testimonials
                ?.map(
                  (
                    testimonial
                  ) => (

                    <div
                      key={
                        testimonial.id
                      }
                      className="testimonial-card card"
                    >

                      <Icon
                        name="quote"
                        size={28}
                      />


                      <p>

                        &ldquo;
                        {
                          testimonial.quote
                        }
                        &rdquo;

                      </p>


                      <div className="testimonial-author">

                        <strong>
                          {
                            testimonial.name
                          }
                        </strong>


                        <span>

                          {
                            testimonial.role
                          }

                          {
                            testimonial.company
                              ? `, ${testimonial.company}`
                              : ''
                          }

                        </span>

                      </div>


                    </div>

                  )
                )}

            </div>

          </div>

        </section>

      )}


      {/* ======================================================
          CTA
      ====================================================== */}

      {cta && (

        <section className="cta-band">

          <div className="container cta-inner">


            <div>


              {cta.title && (

                <h2>
                  {cta.title}
                </h2>

              )}


              {cta.description && (

                <p>
                  {cta.description}
                </p>

              )}


            </div>


            <div className="hero-actions">


              {cta
                .primaryAction
                ?.label &&
                cta
                  .primaryAction
                  ?.link && (

                <Link
                  to={
                    cta
                      .primaryAction
                      .link
                  }
                  className="btn btn-gold"
                >

                  {
                    cta
                      .primaryAction
                      .label
                  }

                </Link>

              )}


              {cta
                .secondaryAction
                ?.label &&
                cta
                  .secondaryAction
                  ?.link && (

                <Link
                  to={
                    cta
                      .secondaryAction
                      .link
                  }
                  className="btn btn-outline"
                >

                  {
                    cta
                      .secondaryAction
                      .label
                  }

                </Link>

              )}


            </div>


          </div>

        </section>

      )}


    </div>

  );

}