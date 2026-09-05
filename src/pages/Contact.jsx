import {
  useState,
} from 'react';

import Breadcrumb from '../components/Breadcrumb';
import Icon from '../components/Icon';

import {
  createContactRequest,
} from '../services/contactApi';

import './Contact.css';


// ============================================================
// INITIAL FORM
// ============================================================

const initialForm = {

  firstName:
    '',

  lastName:
    '',

  email:
    '',

  phone:
    '',

  company:
    '',

  subject:
    '',

  message:
    '',

};


// ============================================================
// CONTACT
// ============================================================

export default function Contact() {

  const [
    form,
    setForm,
  ] =
    useState(
      initialForm
    );


  const [
    submittedInquiry,
    setSubmittedInquiry,
  ] =
    useState(
      null
    );


  const [
    submitting,
    setSubmitting,
  ] =
    useState(
      false
    );


  const [
    error,
    setError,
  ] =
    useState(
      ''
    );


  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  function handleChange(
    event
  ) {

    const {
      name,
      value,
    } =
      event.target;


    setForm(
      (
        previous
      ) => ({

        ...previous,

        [name]:
          value,

      })
    );


    if (
      error
    ) {

      setError(
        ''
      );

    }

  }


  // ==========================================================
  // SUBMIT FORM
  // ==========================================================

  async function handleSubmit(
    event
  ) {

    event.preventDefault();


    if (
      submitting
    ) {

      return;

    }


    // ========================================================
    // CLIENT VALIDATION
    // ========================================================

    const firstName =
      form.firstName.trim();


    const lastName =
      form.lastName.trim();


    const email =
      form.email.trim();


    const phone =
      form.phone.trim();


    const company =
      form.company.trim();


    const subject =
      form.subject.trim();


    const message =
      form.message.trim();


    if (
      !firstName ||
      !lastName ||
      !email ||
      !message
    ) {

      setError(
        'Please complete all required fields.'
      );

      return;

    }


    if (
      message.length <
      10
    ) {

      setError(
        'Please provide a little more detail about your inquiry.'
      );

      return;

    }


    try {

      setSubmitting(
        true
      );


      setError(
        ''
      );


      // ======================================================
      // SEND TO BACKEND
      // POST /api/contact
      // ======================================================

      const result =
        await createContactRequest({

          firstName,

          lastName,

          email,

          phone,

          company,

          subject,

          message,

        });


      // ======================================================
      // EXPECTED BACKEND RESULT
      //
      // {
      //   inquiry: {
      //     id,
      //     referenceNumber,
      //     ...
      //   }
      // }
      // ======================================================

      const inquiry =
        result?.inquiry ||
        null;


      if (
        !inquiry
      ) {

        throw new Error(
          'The inquiry was submitted but no reference was returned.'
        );

      }


      setSubmittedInquiry(
        inquiry
      );


      setForm(
        initialForm
      );


    } catch (
      requestError
    ) {

      console.error(
        '[CONTACT ERROR]',
        {

          message:
            requestError?.message,

          status:
            requestError
              ?.response
              ?.status,

          data:
            requestError
              ?.response
              ?.data,

        }
      );


      setError(
        requestError
          ?.response
          ?.data
          ?.message ||
        requestError
          ?.message ||
        'Unable to submit your request. Please try again.'
      );


    } finally {

      setSubmitting(
        false
      );

    }

  }


  // ==========================================================
  // NEW REQUEST
  // ==========================================================

  function handleNewRequest() {

    setSubmittedInquiry(
      null
    );


    setError(
      ''
    );


    setForm(
      initialForm
    );

  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <main className="contact-page">


      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="contact-hero">

        <div className="container">

          <Breadcrumb
            items={[
              {
                label:
                  'Contact',
              },
            ]}
          />


          <div className="contact-hero-content">

            <span className="eyebrow">
              Procurement Support
            </span>


            <h1>
              Talk to Our Machinery
              Procurement Team
            </h1>


            <p>
              Get support with machinery
              selection, industrial sourcing,
              quotations, logistics and
              procurement requirements.
            </p>

          </div>

        </div>

      </section>


      {/* ======================================================
          CONTACT CHANNELS
      ====================================================== */}

      <section className="contact-section">

        <div className="container">

          <div className="contact-section-header">

            <span className="eyebrow">
              Direct Channels
            </span>


            <h2 className="section-heading">
              How Can We Help?
            </h2>


            <p>
              Choose the most convenient
              way to reach the ApexMach UG
              procurement team.
            </p>

          </div>


          <div className="contact-channels">


            {/* PHONE */}

            <article className="contact-channel card">

              <div className="contact-channel-icon">

                <Icon
                  name="phone"
                  size={23}
                />

              </div>


              <div>

                <strong>
                  Procurement Support
                </strong>


                <p>
                  Speak with our team
                </p>


                <span>
                  For machinery sourcing,
                  quotations and order support.
                </span>

              </div>

            </article>


            {/* EMAIL */}

            <article className="contact-channel card">

              <div className="contact-channel-icon">

                <Icon
                  name="mail"
                  size={23}
                />

              </div>


              <div>

                <strong>
                  Email Support
                </strong>


                <p>
                  Send us your requirements
                </p>


                <span>
                  Include product specifications,
                  quantities and delivery needs.
                </span>

              </div>

            </article>


            {/* HOURS */}

            <article className="contact-channel card">

              <div className="contact-channel-icon">

                <Icon
                  name="clock"
                  size={23}
                />

              </div>


              <div>

                <strong>
                  Business Support
                </strong>


                <p>
                  Procurement assistance
                </p>


                <span>
                  Our team responds to
                  commercial and technical
                  inquiries as quickly as possible.
                </span>

              </div>

            </article>

          </div>

        </div>

      </section>


      {/* ======================================================
          CONTACT FORM
      ====================================================== */}

      <section className="contact-section contact-section-light">

        <div className="container">

          <div className="contact-form-grid">


            {/* ================================================
                FORM
            ================================================ */}

            <div className="card contact-form-card">

              {
                submittedInquiry
                  ? (

                    <div className="contact-sent">

                      <div className="contact-sent-icon">

                        <Icon
                          name="check"
                          size={38}
                          strokeWidth={2}
                        />

                      </div>


                      <span className="eyebrow">
                        Request Received
                      </span>


                      <h3>
                        Thank You
                      </h3>


                      <p>
                        Your inquiry has been
                        submitted successfully.
                        Our procurement team will
                        review your request.
                      </p>


                      {
                        submittedInquiry
                          ?.referenceNumber && (

                          <div className="contact-reference">

                            <span>
                              Inquiry Reference
                            </span>


                            <strong>
                              {
                                submittedInquiry
                                  .referenceNumber
                              }
                            </strong>

                          </div>

                        )
                      }


                      <p>
                        Please keep this reference
                        number for future communication
                        about your inquiry.
                      </p>


                      <button
                        type="button"
                        className="btn btn-outline-navy"
                        onClick={
                          handleNewRequest
                        }
                      >
                        Send Another Request
                      </button>

                    </div>

                  )
                  : (

                    <form
                      onSubmit={
                        handleSubmit
                      }
                      noValidate
                    >

                      <div className="contact-form-heading">

                        <span className="eyebrow">
                          Send an Inquiry
                        </span>


                        <h2>
                          Request Procurement Support
                        </h2>


                        <p>
                          Tell us what equipment
                          or industrial support you
                          need and provide as much
                          detail as possible.
                        </p>

                      </div>


                      {/* ERROR */}

                      {
                        error && (

                          <div
                            className="contact-error"
                            role="alert"
                          >

                            <Icon
                              name="warning"
                              size={18}
                            />


                            <span>
                              {
                                error
                              }
                            </span>

                          </div>

                        )
                      }


                      {/* NAME */}

                      <div className="form-row">

                        <div className="field">

                          <label
                            htmlFor="contact-first-name"
                          >
                            First Name
                          </label>


                          <input
                            id="contact-first-name"
                            name="firstName"
                            type="text"
                            autoComplete="given-name"
                            value={
                              form.firstName
                            }
                            onChange={
                              handleChange
                            }
                            required
                            disabled={
                              submitting
                            }
                            placeholder="First name"
                          />

                        </div>


                        <div className="field">

                          <label
                            htmlFor="contact-last-name"
                          >
                            Last Name
                          </label>


                          <input
                            id="contact-last-name"
                            name="lastName"
                            type="text"
                            autoComplete="family-name"
                            value={
                              form.lastName
                            }
                            onChange={
                              handleChange
                            }
                            required
                            disabled={
                              submitting
                            }
                            placeholder="Last name"
                          />

                        </div>

                      </div>


                      {/* EMAIL */}

                      <div className="field">

                        <label
                          htmlFor="contact-email"
                        >
                          Email Address
                        </label>


                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={
                            form.email
                          }
                          onChange={
                            handleChange
                          }
                          required
                          disabled={
                            submitting
                          }
                          placeholder="you@company.com"
                        />

                      </div>


                      {/* PHONE / COMPANY */}

                      <div className="form-row">

                        <div className="field">

                          <label
                            htmlFor="contact-phone"
                          >
                            Phone Number

                            <span className="field-optional">
                              {' '}(Optional)
                            </span>

                          </label>


                          <input
                            id="contact-phone"
                            name="phone"
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            value={
                              form.phone
                            }
                            onChange={
                              handleChange
                            }
                            disabled={
                              submitting
                            }
                            placeholder="+256 ..."
                          />

                        </div>


                        <div className="field">

                          <label
                            htmlFor="contact-company"
                          >
                            Company /
                            Organization

                            <span className="field-optional">
                              {' '}(Optional)
                            </span>

                          </label>


                          <input
                            id="contact-company"
                            name="company"
                            type="text"
                            autoComplete="organization"
                            value={
                              form.company
                            }
                            onChange={
                              handleChange
                            }
                            disabled={
                              submitting
                            }
                            placeholder="Company name"
                          />

                        </div>

                      </div>


                      {/* SUBJECT */}

                      <div className="field">

                        <label
                          htmlFor="contact-subject"
                        >
                          Inquiry Type
                        </label>


                        <select
                          id="contact-subject"
                          name="subject"
                          value={
                            form.subject
                          }
                          onChange={
                            handleChange
                          }
                          disabled={
                            submitting
                          }
                        >

                          <option value="">
                            Select inquiry type
                          </option>

                          <option value="quotation">
                            Request a Quotation
                          </option>

                          <option value="product">
                            Product Information
                          </option>

                          <option value="bulk-order">
                            Bulk / Enterprise Order
                          </option>

                          <option value="logistics">
                            Logistics & Delivery
                          </option>

                          <option value="technical">
                            Technical Assistance
                          </option>

                          <option value="order">
                            Existing Order Support
                          </option>

                          <option value="other">
                            Other Inquiry
                          </option>

                        </select>

                      </div>


                      {/* MESSAGE */}

                      <div className="field">

                        <label
                          htmlFor="contact-message"
                        >
                          How Can We Help?
                        </label>


                        <textarea
                          id="contact-message"
                          name="message"
                          rows={6}
                          value={
                            form.message
                          }
                          onChange={
                            handleChange
                          }
                          required
                          disabled={
                            submitting
                          }
                          placeholder="Describe the machinery, quantity, specifications, delivery location or support you require..."
                        />

                      </div>


                      {/* SUBMIT */}

                      <button
                        type="submit"
                        className="btn btn-primary btn-block contact-submit"
                        disabled={
                          submitting
                        }
                      >

                        {
                          submitting
                            ? 'Submitting...'
                            : 'Submit Inquiry'
                        }


                        {
                          !submitting && (

                            <Icon
                              name="arrowRight"
                              size={16}
                            />

                          )
                        }

                      </button>

                    </form>

                  )
              }

            </div>


            {/* ================================================
                ENTERPRISE
            ================================================ */}

            <aside className="contact-enterprise">

              <div className="contact-enterprise-icon">

                <Icon
                  name="package"
                  size={26}
                />

              </div>


              <span className="contact-enterprise-eyebrow">
                Business Procurement
              </span>


              <h3>
                Enterprise & Bulk Orders
              </h3>


              <p>
                Procuring machinery for a
                company, construction project,
                factory, workshop or institution?
                Send us your equipment list and
                required quantities for a
                customized quotation.
              </p>


              <div className="contact-enterprise-list">


                <div className="contact-enterprise-item">

                  <Icon
                    name="check"
                    size={18}
                  />


                  <div>

                    <strong>
                      Bulk Equipment Sourcing
                    </strong>


                    <span>
                      Multiple machines and
                      industrial product orders
                    </span>

                  </div>

                </div>


                <div className="contact-enterprise-item">

                  <Icon
                    name="check"
                    size={18}
                  />


                  <div>

                    <strong>
                      Custom Quotations
                    </strong>


                    <span>
                      Procurement pricing based
                      on your requirements
                    </span>

                  </div>

                </div>


                <div className="contact-enterprise-item">

                  <Icon
                    name="truck"
                    size={18}
                  />


                  <div>

                    <strong>
                      Logistics Coordination
                    </strong>


                    <span>
                      Delivery planning for
                      industrial equipment
                    </span>

                  </div>

                </div>


                <div className="contact-enterprise-item">

                  <Icon
                    name="settings"
                    size={18}
                  />


                  <div>

                    <strong>
                      Technical Guidance
                    </strong>


                    <span>
                      Help selecting machinery
                      for your application
                    </span>

                  </div>

                </div>

              </div>


              <div className="contact-enterprise-note">

                <Icon
                  name="info"
                  size={18}
                />


                <p>
                  For faster quotations,
                  include machinery names,
                  specifications, quantities
                  and delivery location.
                </p>

              </div>

            </aside>

          </div>

        </div>

      </section>


      {/* ======================================================
          SERVICE COVERAGE
      ====================================================== */}

      <section className="contact-section">

        <div className="container">

          <div className="contact-location-grid">


            <div className="contact-location-content">

              <span className="badge badge-navy">
                ApexMach UG
              </span>


              <h2 className="section-heading">
                Industrial Procurement Support
              </h2>


              <p>
                ApexMach UG supports customers
                looking for machinery, power
                equipment, tools and industrial
                procurement solutions.
              </p>


              <div className="contact-location-point">

                <Icon
                  name="location"
                  size={20}
                />


                <div>

                  <strong>
                    Delivery & Logistics
                  </strong>


                  <span>
                    Delivery requirements can
                    be specified when requesting
                    a quotation or placing an order.
                  </span>

                </div>

              </div>


              <div className="contact-location-point">

                <Icon
                  name="shield"
                  size={20}
                />


                <div>

                  <strong>
                    Procurement Assistance
                  </strong>


                  <span>
                    Product sourcing and
                    technical guidance for
                    business buyers.
                  </span>

                </div>

              </div>

            </div>


            <div className="contact-location-visual">

              <div className="contact-location-icon">

                <Icon
                  name="location"
                  size={34}
                />

              </div>


              <strong>
                ApexMach UG
              </strong>


              <span>
                Industrial Machinery &
                Procurement
              </span>


              <p>
                Contact our team with your
                delivery destination for
                logistics assistance.
              </p>

            </div>

          </div>

        </div>

      </section>


    </main>

  );

}