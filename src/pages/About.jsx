import Breadcrumb from '../components/Breadcrumb';
import { FeatureCard, StatCard } from '../components/InfoCards';
import Icon from '../components/Icon';
import './About.css';

export default function About() {

  return (

    <div className="about-page">

      {/* ======================================================
          BREADCRUMB
      ====================================================== */}

      <Breadcrumb
        items={[
          {
            label: 'About Us'
          }
        ]}
      />


      {/* ======================================================
          ABOUT HERO
      ====================================================== */}

      <section className="about-hero">

        <div className="container">

          <span className="eyebrow">
            About Apex Machinery
          </span>

          <h1>
            Redefining Industrial
            <br />
            Procurement
          </h1>

          <p>
            Apex Machinery connects manufacturers, contractors,
            hotels, hospitals, commercial facilities and businesses
            across Uganda with reliable machinery, equipment,
            power tools and industrial solutions.
          </p>

        </div>

      </section>


      {/* ======================================================
          COMPANY STATS
      ====================================================== */}

      <section className="section">

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
            label="Markets Served"
          />

          <StatCard
            value="15+"
            label="Years of Excellence"
          />

        </div>

      </section>


      {/* ======================================================
          OUR STORY
      ====================================================== */}

      <section className="section section-light">

        <div className="container about-page-grid">


          {/* LOCAL IMAGE */}

          <div className="about-page-image">

            <img
              src="/images/machines/apex-machinery-about.jpg"
              alt="Industrial machinery and equipment at Apex Machinery"
            />

          </div>


          {/* STORY */}

          <div>

            <span className="eyebrow">
              Our Story
            </span>

            <h2 className="section-heading">
              Built for Industry.
              <br />
              Built for Uganda.
            </h2>

            <p className="section-sub">

              Apex Machinery is an industrial equipment and
              machinery supplier serving businesses, contractors,
              manufacturers, hotels, hospitals, workshops and
              commercial facilities.

            </p>

            <p className="section-sub">

              Our product range covers industrial machinery,
              generators, power tools, compressors, hydraulics,
              construction equipment, electrical systems,
              automation, material handling and specialized
              commercial equipment.

            </p>

            <p className="section-sub">

              From our base in Katwe, Kampala, we provide
              businesses with dependable equipment, technical
              guidance and procurement support designed around
              real operational needs.

            </p>


            {/* MISSION / VISION */}

            <div className="about-page-mission">

              <div>

                <h4>
                  <Icon
                    name="shield"
                    size={18}
                  />

                  Our Mission
                </h4>

                <p>
                  Provide dependable access to quality machinery
                  and equipment while maintaining transparency,
                  reliability and professional customer service.
                </p>

              </div>


              <div>

                <h4>
                  <Icon
                    name="bolt"
                    size={18}
                  />

                  Our Vision
                </h4>

                <p>
                  To become one of Uganda's most trusted
                  industrial equipment suppliers and a leading
                  digital platform for machinery procurement.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ======================================================
          WHAT WE SUPPLY
      ====================================================== */}

      <section className="section">

        <div className="container">

          <span className="eyebrow">
            What We Supply
          </span>

          <h2 className="section-heading">
            Equipment for Every Operation
          </h2>

          <p className="section-sub">
            Our growing product range serves industrial,
            construction, hospitality, commercial and
            engineering operations.
          </p>


          <div className="grid-4">


            <FeatureCard
              icon="settings"
              title="Industrial Machinery"
              text="Heavy-duty machinery and production equipment for industrial operations."
            />


            <FeatureCard
              icon="zap"
              title="Generators"
              text="Reliable power generation solutions for businesses, sites and facilities."
            />


            <FeatureCard
              icon="tool"
              title="Power Tools"
              text="Professional power tools for workshops, construction and maintenance."
            />


            <FeatureCard
              icon="wind"
              title="Compressors"
              text="Industrial compressed-air solutions for workshops and production environments."
            />


            <FeatureCard
              icon="droplet"
              title="Hydraulics"
              text="Hydraulic pumps, motors, valves, hoses, jacks and lifting equipment."
            />


            <FeatureCard
              icon="flame"
              title="Metal Working"
              text="Welding, cutting, grinding and fabrication equipment."
            />


            <FeatureCard
              icon="hammer"
              title="Construction Equipment"
              text="Reliable equipment for construction, concrete and site operations."
            />


            <FeatureCard
              icon="package"
              title="Material Handling"
              text="Hoists, pallet trucks, lifting equipment and industrial handling solutions."
            />

          </div>

        </div>

      </section>


      {/* ======================================================
          COMMERCIAL & FACILITY EQUIPMENT
      ====================================================== */}

      <section className="section section-light">

        <div className="container">

          <span className="eyebrow">
            Commercial Solutions
          </span>

          <h2 className="section-heading">
            More Than Industrial Machinery
          </h2>

          <p className="section-sub">
            Apex Machinery also supplies equipment for
            hospitality, healthcare, commercial buildings
            and facility management.
          </p>


          <div className="grid-3">


            <FeatureCard
              icon="utensils"
              title="Kitchen Equipment"
              text="Commercial cooking, food preparation, refrigeration and kitchen equipment."
            />


            <FeatureCard
              icon="bath"
              title="Bathroom Equipment"
              text="Water heating, hygiene, shower and commercial bathroom solutions."
            />


            <FeatureCard
              icon="shirt"
              title="Laundry Equipment"
              text="Industrial washing, drying, ironing and laundry processing systems."
            />

          </div>

        </div>

      </section>


      {/* ======================================================
          QUALITY ASSURANCE
      ====================================================== */}

      <section className="section">

        <div className="container">

          <span className="badge badge-navy">
            Quality & Reliability
          </span>

          <h2
            className="section-heading"
            style={{ marginTop: 12 }}
          >
            The Apex Machinery Standard
          </h2>

          <p className="section-sub">

            We focus on supplying equipment that meets the
            practical requirements of our customers while
            providing clear specifications and professional
            procurement support.

          </p>


          <ul className="about-checklist">

            <li>
              <Icon
                name="check"
                size={16}
              />

              Clear and detailed product specifications
            </li>


            <li>
              <Icon
                name="check"
                size={16}
              />

              Equipment selection based on application
            </li>


            <li>
              <Icon
                name="check"
                size={16}
              />

              Professional procurement assistance
            </li>


            <li>
              <Icon
                name="check"
                size={16}
              />

              Delivery and logistics coordination
            </li>


            <li>
              <Icon
                name="check"
                size={16}
              />

              Technical support and product guidance
            </li>


            <li>
              <Icon
                name="check"
                size={16}
              />

              Support for businesses, contractors and institutions
            </li>

          </ul>

        </div>

      </section>


      {/* ======================================================
          CORE VALUES
      ====================================================== */}

      <section className="section section-light">

        <div className="container">

          <span className="eyebrow">
            Our Core Values
          </span>

          <h2 className="section-heading">
            Principles Driving Apex Machinery
          </h2>


          <div className="grid-4">


            <FeatureCard
              icon="shield"
              title="Integrity"
              text="We believe in honest communication, transparent specifications and dependable service."
            />


            <FeatureCard
              icon="settings"
              title="Precision"
              text="We pay attention to technical specifications and application requirements."
            />


            <FeatureCard
              icon="bolt"
              title="Innovation"
              text="We use technology to make equipment discovery and procurement easier."
            />


            <FeatureCard
              icon="users"
              title="Customer Focus"
              text="We build long-term relationships by understanding and responding to customer needs."
            />

          </div>

        </div>

      </section>


      {/* ======================================================
          LOCATION / CTA
      ====================================================== */}

      <section className="about-location">

        <div className="container about-location-inner">

          <div>

            <span className="eyebrow">
              Visit Apex Machinery
            </span>

            <h2>
              Your Machinery Partner in Kampala
            </h2>

            <p>
              Find us in Katwe, Kampala, Uganda for
              machinery, equipment, tools and procurement
              support.
            </p>

          </div>


          <div className="about-location-contact">

            <div>
              <Icon
                name="map-pin"
                size={20}
              />

              <span>
                Katwe, Kampala, Uganda
              </span>
            </div>


            <div>
              <Icon
                name="phone"
                size={20}
              />

              <span>
                +256 703 784893
              </span>
            </div>

          </div>

        </div>

      </section>

    </div>

  );
}