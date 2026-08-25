import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import ProductCard from '../components/ProductCard';
import {
  StatCard,
  FeatureCard,
  CategoryCard,
} from '../components/InfoCards';

import { getFeaturedProducts } from '../data/products';
import {
  categories,
  categoryImages,
} from '../data/categories';

import { brands } from '../data/brands';

import './Home.css';


// ============================================================
// TESTIMONIALS
// ============================================================

const testimonials = [
  {
    name: 'Marcus Webb',
    role: 'Plant Operations Director, Webb Steelworks',
    quote:
      'Apex Machinery cut our procurement cycle in half. The certified inventory and quoting process removed all the guesswork from buying heavy equipment.',
  },

  {
    name: 'Priya Nair',
    role: 'Head of Facilities, Nair Manufacturing Group',
    quote:
      'We outfitted an entire production line through Apex. The bulk quote desk and logistics coordination were the best we have worked with.',
  },

  {
    name: 'Diego Alvarez',
    role: 'Maintenance Lead, Alvarez Fabrication',
    quote:
      'Reliable stock, honest specs, and a support team that actually understands industrial equipment. Exactly what our shop floor needed.',
  },
];


// ============================================================
// HOME PAGE
// ============================================================

export default function Home() {

  const featured = getFeaturedProducts(8);

  const homeCategories = categories;

  return (
    <div className="home-page">

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="hero">

        <div className="container hero-inner">

          <div className="hero-content">

            <span className="eyebrow">
              Established 2026
            </span>

            <h1>
              Powering Industry.
              <br />
              Building Futures.
            </h1>

            <p className="hero-sub">
              Apex Machinery is your certified partner
              for industrial equipment, power tools,
              generators, kitchen equipment, bathroom
              equipment, laundry systems, and enterprise
              procurement — engineered for reliability,
              sourced for scale.
            </p>

            <div className="hero-actions">

              <Link
                to="/shop"
                className="btn btn-primary"
              >
                Explore the Catalog
              </Link>

              <Link
                to="/contact"
                className="btn btn-outline"
              >
                Request a Quote
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* ======================================================
          STATS
      ====================================================== */}

      <section className="section stats-section">

        <div className="container grid-4">

          <StatCard
            value="3,200+"
            label="Enterprise Clients"
          />

          <StatCard
            value="42,000+"
            label="Industrial Products"
          />

          <StatCard
            value="18+"
            label="Active Countries"
          />

          <StatCard
            value="15+"
            label="Years of Excellence"
          />

        </div>

      </section>


      {/* ======================================================
    ABOUT APEX
====================================================== */}

<section className="section">
  <div className="container about-grid">

    <div>
      <span className="eyebrow">
        About Apex Machinery
      </span>

      <h2 className="section-heading">
        Engineering the Future of
        Industrial Procurement
      </h2>

      <p className="section-sub">
        We connect manufacturers, contractors,
        hotels, hospitals, commercial facilities,
        and enterprises with certified machinery,
        power tools, generators, kitchen systems,
        bathroom equipment, laundry equipment,
        and industrial solutions — backed by
        transparent pricing and a logistics network
        built for demanding applications.
      </p>

      <div className="about-points">

        <div>
          <h4>
            <Icon name="shield" size={18} />
            Our Mission
          </h4>

          <p>
            Delivering dependable access to
            certified industrial and commercial
            equipment with transparency at
            every step.
          </p>
        </div>

        <div>
          <h4>
            <Icon name="bolt" size={18} />
            Our Vision
          </h4>

          <p>
            To be the trusted digital backbone
            of industrial supply chains worldwide.
          </p>
        </div>

      </div>
    </div>

    {/* LOCAL IMAGE */}
   <div className="about-media">
  <img
    src="/images/machines/apex-machinery-team.jpg"
    alt="Apex Machinery engineering team"
  />
</div>

  </div>
</section>


      {/* ======================================================
          FEATURED PRODUCTS
      ====================================================== */}

      <section className="section section-light">

        <div className="container">

          <div className="section-header-row">

            <div>

              <span className="eyebrow">
                Featured Inventory
              </span>

              <h2 className="section-heading">
                Top-Rated Equipment
              </h2>

            </div>

            <Link
              to="/shop"
              className="btn btn-outline-navy"
            >
              View All Products
            </Link>

          </div>


          <div className="grid-4">

            {featured.map((product) => (

              <ProductCard
                key={product.id}
                product={product}
              />

            ))}

          </div>

        </div>

      </section>




      {/* ======================================================
          SPECIALIZED EQUIPMENT
      ====================================================== */}

      <section className="section section-light">

        <div className="container">

          <div className="section-header-row">

            <div>

              <span className="eyebrow">
                Specialized Equipment
              </span>

              <h2 className="section-heading">
                Equipment for Every Operation
              </h2>

            </div>

          </div>


          <div className="grid-4">


            {/* GENERATORS */}

            <Link
              to="/shop?category=generators"
              className="home-category-link"
            >

              <Icon
                name="zap"
                size={28}
              />

              <div>

                <h3>
                  Generators
                </h3>

                <p>
                  Diesel and standard generators
                  for homes, businesses,
                  construction and industrial use.
                </p>

              </div>

            </Link>


            {/* KITCHEN */}

            <Link
              to="/shop?category=kitchen-equipment"
              className="home-category-link"
            >

              <Icon
                name="utensils"
                size={28}
              />

              <div>

                <h3>
                  Kitchen Equipment
                </h3>

                <p>
                  Commercial cooking,
                  preparation and food
                  processing equipment.
                </p>

              </div>

            </Link>


            {/* BATHROOM */}

            <Link
              to="/shop?category=bathroom-equipment"
              className="home-category-link"
            >

              <Icon
                name="bath"
                size={28}
              />

              <div>

                <h3>
                  Bathroom Equipment
                </h3>

                <p>
                  Professional water,
                  hygiene and commercial
                  bathroom systems.
                </p>

              </div>

            </Link>


            {/* LAUNDRY */}

            <Link
              to="/shop?category=laundry-equipment"
              className="home-category-link"
            >

              <Icon
                name="shirt"
                size={28}
              />

              <div>

                <h3>
                  Laundry Equipment
                </h3>

                <p>
                  Industrial washing,
                  drying, ironing and
                  folding systems.
                </p>

              </div>

            </Link>

          </div>

        </div>

      </section>


      {/* ======================================================
          MANUFACTURERS
      ====================================================== */}

      <section className="section section-light">

        <div className="container text-center">

          <span className="eyebrow">
            Global Trusted Partners
          </span>

          <h2 className="section-heading">
            Manufacturers We Represent
          </h2>

          <div className="brand-strip">

            {brands.map((brand) => (

              <span key={brand.id}>
                {brand.name}
              </span>

            ))}

          </div>

        </div>

      </section>


      {/* ======================================================
          WHY CHOOSE US
      ====================================================== */}

      <section className="section">

        <div className="container">

          <span className="eyebrow">
            Why Choose Us
          </span>

          <h2 className="section-heading">
            The Apex Machinery Standard
          </h2>

          <div className="grid-4">

            <FeatureCard
              icon="shield"
              title="OEM Certified"
              text="Authentic equipment sourced from certified manufacturers and trusted suppliers."
            />

            <FeatureCard
              icon="truck"
              title="Priority Logistics"
              text="Specialized heavy-lift shipping, delivery coordination and customs clearance support."
            />

            <FeatureCard
              icon="bolt"
              title="Fast Procurement"
              text="Digital quoting and procurement workflows designed for businesses and enterprise purchasing."
            />

            <FeatureCard
              icon="clock"
              title="24/7 Support"
              text="Dedicated support for equipment selection, technical assistance, spare parts and procurement."
            />

          </div>

        </div>

      </section>


      {/* ======================================================
          TESTIMONIALS
      ====================================================== */}

      <section className="section section-light">

        <div className="container">

          <span className="eyebrow">
            Client Testimonials
          </span>

          <h2 className="section-heading">
            Trusted on the Shop Floor
          </h2>

          <div className="grid-3">

            {testimonials.map((testimonial) => (

              <div
                key={testimonial.name}
                className="testimonial-card card"
              >

                <Icon
                  name="quote"
                  size={28}
                />

                <p>
                  &ldquo;
                  {testimonial.quote}
                  &rdquo;
                </p>

                <div className="testimonial-author">

                  <strong>
                    {testimonial.name}
                  </strong>

                  <span>
                    {testimonial.role}
                  </span>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* ======================================================
          CTA
      ====================================================== */}

      <section className="cta-band">

        <div className="container cta-inner">

          <div>

            <h2>
              Ready to Elevate Your Procurement?
            </h2>

            <p>
              Join enterprises that trust Apex
              Machinery for their industrial,
              commercial and facility equipment needs.
            </p>

          </div>

          <div className="hero-actions">

            <Link
              to="/shop"
              className="btn btn-gold"
            >
              Start Shopping
            </Link>

            <Link
              to="/contact"
              className="btn btn-outline"
            >
              Request Custom Quote
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}