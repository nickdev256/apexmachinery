import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpg';

import './Auth.css';


export default function Register() {

  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [form, setForm] = useState({

    name: '',

    company: '',

    email: '',

    password: '',

    confirmPassword: '',

  });


  // ==========================================================
  // UI STATE
  // ==========================================================

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  const [loading, setLoading] =
    useState(false);


  // ==========================================================
  // AUTH
  // ==========================================================

  const {
    register,
    isAuthenticated,
  } = useAuth();


  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const navigate =
    useNavigate();


  // ==========================================================
  // UPDATE FORM
  // ==========================================================

  function update(
    key,
    value
  ) {

    setForm(
      (previous) => ({

        ...previous,

        [key]:
          value,

      })
    );

  }


  // ==========================================================
  // VALIDATE EMAIL
  // ==========================================================

  function isValidEmail(
    email
  ) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(email);

  }


  // ==========================================================
  // SUBMIT REGISTRATION
  // ==========================================================

  async function handleSubmit(
    e
  ) {

    e.preventDefault();


    // --------------------------------------------------------
    // RESET MESSAGES
    // --------------------------------------------------------

    setError('');

    setSuccess('');


    // --------------------------------------------------------
    // PREVENT DOUBLE SUBMISSION
    // --------------------------------------------------------

    if (loading) {

      return;

    }


    // --------------------------------------------------------
    // CLEAN VALUES
    // --------------------------------------------------------

    const name =
      form.name.trim();

    const company =
      form.company.trim();

    const email =
      form.email
        .trim()
        .toLowerCase();

    const password =
      form.password;

    const confirmPassword =
      form.confirmPassword;


    try {

      // ======================================================
      // VALIDATION
      // ======================================================

      if (!name) {

        throw new Error(
          'Please enter your full name.'
        );

      }


      if (name.length < 2) {

        throw new Error(
          'Your name must contain at least 2 characters.'
        );

      }


      if (!company) {

        throw new Error(
          'Please enter your company name.'
        );

      }


      if (company.length < 2) {

        throw new Error(
          'Please enter a valid company name.'
        );

      }


      if (!email) {

        throw new Error(
          'Please enter your work email.'
        );

      }


      if (!isValidEmail(email)) {

        throw new Error(
          'Please enter a valid email address.'
        );

      }


      if (!password) {

        throw new Error(
          'Please create a password.'
        );

      }


      if (password.length < 6) {

        throw new Error(
          'Password must contain at least 6 characters.'
        );

      }


      if (password !== confirmPassword) {

        throw new Error(
          'Passwords do not match.'
        );

      }


      // ======================================================
      // START REQUEST
      // ======================================================

      setLoading(true);


      // ======================================================
      // SEND TO BACKEND
      // ======================================================
      //
      // AuthContext.register() sends:
      //
      // POST /api/auth/register
      //
      // with:
      //
      // {
      //   name,
      //   company,
      //   email,
      //   password
      // }
      //
      // ======================================================

      const newUser =
        await register({

          name,

          company,

          email,

          password,

        });


      // ======================================================
      // SAFETY CHECK
      // ======================================================

      if (!newUser) {

        throw new Error(
          'Account was created but user information could not be loaded.'
        );

      }


      // ======================================================
      // NEVER ACCEPT ADMIN ROLE FROM REGISTRATION
      // ======================================================

      if (
        newUser.role === 'admin' ||
        newUser.role === 'administrator'
      ) {

        throw new Error(
          'Administrator accounts cannot be created through customer registration.'
        );

      }


      // ======================================================
      // SUCCESS
      // ======================================================

      setSuccess(
        'Your Apex Machinery account has been created successfully.'
      );


      // ======================================================
      // REDIRECT
      // ======================================================
      //
      // The backend registration endpoint automatically signs
      // the customer in when possible.
      //
      // AuthContext stores the returned authentication state.
      //
      // ======================================================

      setTimeout(
        () => {

          navigate(
            '/dashboard',
            {
              replace: true,
            }
          );

        },
        700
      );


    } catch (err) {

      console.error(
        '[Apex Registration]',
        err
      );


      // ------------------------------------------------------
      // AXIOS / BACKEND ERROR
      // ------------------------------------------------------

      const backendMessage =
        err?.response?.data?.message;


      setError(
        backendMessage ||
        err?.message ||
        'Unable to create your account. Please try again.'
      );


    } finally {

      setLoading(false);

    }

  }


  // ==========================================================
  // ALREADY AUTHENTICATED
  // ==========================================================

  if (isAuthenticated) {

    return (

      <div className="auth-page">

        <div className="auth-card">

          <div className="auth-header">

            <span className="eyebrow">
              Account Active
            </span>

            <h1>
              You are already signed in
            </h1>

            <p>
              Your Apex Machinery account is already
              authenticated.
            </p>

          </div>


          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={() =>
              navigate(
                '/dashboard',
                {
                  replace: true,
                }
              )
            }
          >

            Go to Dashboard

            <Icon
              name="arrowRight"
              size={16}
            />

          </button>


          <p className="auth-switch">

            <Link to="/">
              Return to Apex Machinery
            </Link>

          </p>

        </div>

      </div>

    );

  }


  // ==========================================================
  // PAGE
  // ==========================================================

  return (

    <div className="auth-page">

      <div className="auth-card">


        {/* ==================================================
            LOGO
        ================================================== */}

        <Link
          to="/"
          className="auth-logo"
        >

          <img
            src={logo}
            alt="Apex Machinery"
          />


          <div>

            <strong>
              APEX MACHINERY
            </strong>

            <span>
              Powering Industry. Building Futures.
            </span>

          </div>

        </Link>


        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="auth-header">

          <span className="eyebrow">
            Customer Registration
          </span>


          <h1>
            Create an Enterprise Account
          </h1>


          <p>
            Register for certified pricing,
            bulk quotes, procurement tools,
            order tracking and account management.
          </p>

        </div>


        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (

          <div
            className="auth-error"
            role="alert"
          >

            <Icon
              name="alert"
              size={17}
            />

            <span>
              {error}
            </span>

          </div>

        )}


        {/* ==================================================
            SUCCESS
        ================================================== */}

        {success && (

          <div
            className="auth-success"
            role="status"
          >

            <Icon
              name="check"
              size={17}
            />

            <span>
              {success}
            </span>

          </div>

        )}


        {/* ==================================================
            FORM
        ================================================== */}

        <form
          onSubmit={handleSubmit}
          noValidate
        >


          {/* ==================================================
              FULL NAME
          ================================================== */}

          <div className="field">

            <label
              htmlFor="register-name"
            >
              Full Name
            </label>


            <input
              id="register-name"
              required
              type="text"
              value={form.name}
              onChange={(e) =>
                update(
                  'name',
                  e.target.value
                )
              }
              placeholder="Jane Carter"
              autoComplete="name"
              disabled={loading}
              maxLength={100}
            />

          </div>


          {/* ==================================================
              COMPANY
          ================================================== */}

          <div className="field">

            <label
              htmlFor="register-company"
            >
              Company Name
            </label>


            <input
              id="register-company"
              required
              type="text"
              value={form.company}
              onChange={(e) =>
                update(
                  'company',
                  e.target.value
                )
              }
              placeholder="Carter Industrial Group"
              autoComplete="organization"
              disabled={loading}
              maxLength={150}
            />

          </div>


          {/* ==================================================
              EMAIL
          ================================================== */}

          <div className="field">

            <label
              htmlFor="register-email"
            >
              Work Email
            </label>


            <input
              id="register-email"
              required
              type="email"
              value={form.email}
              onChange={(e) =>
                update(
                  'email',
                  e.target.value
                )
              }
              placeholder="you@company.com"
              autoComplete="email"
              disabled={loading}
              maxLength={254}
            />

          </div>


          {/* ==================================================
              PASSWORD
          ================================================== */}

          <div className="field">

            <label
              htmlFor="register-password"
            >
              Password
            </label>


            <input
              id="register-password"
              required
              type="password"
              minLength={6}
              value={form.password}
              onChange={(e) =>
                update(
                  'password',
                  e.target.value
                )
              }
              placeholder="Create a password"
              autoComplete="new-password"
              disabled={loading}
            />


            <small>
              Password must contain at least
              6 characters.
            </small>

          </div>


          {/* ==================================================
              CONFIRM PASSWORD
          ================================================== */}

          <div className="field">

            <label
              htmlFor="register-confirm-password"
            >
              Confirm Password
            </label>


            <input
              id="register-confirm-password"
              required
              type="password"
              minLength={6}
              value={form.confirmPassword}
              onChange={(e) =>
                update(
                  'confirmPassword',
                  e.target.value
                )
              }
              placeholder="Confirm your password"
              autoComplete="new-password"
              disabled={loading}
            />

          </div>


          {/* ==================================================
              TERMS
          ================================================== */}

          <label
            className="filters-checkbox auth-terms"
          >

            <input
              type="checkbox"
              required
              disabled={loading}
            />


            <span>
              I agree to the Terms of Service
              and Privacy Policy
            </span>

          </label>


          {/* ==================================================
              SUBMIT
          ================================================== */}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >

            {loading ? (

              <>
                Creating Account...
              </>

            ) : (

              <>

                Create Account

                <Icon
                  name="arrowRight"
                  size={16}
                />

              </>

            )}

          </button>

        </form>


        {/* ==================================================
            LOGIN LINK
        ================================================== */}

        <p className="auth-switch">

          Already have an account?{' '}


          <Link to="/login">

            Sign in

          </Link>

        </p>


        {/* ==================================================
            SECURITY NOTE
        ================================================== */}

        <div
          className="auth-security-note"
        >

          <Icon
            name="shield"
            size={16}
          />

          <span>
            Your account credentials are securely
            processed through Apex Machinery's
            backend authentication system.
          </span>

        </div>

      </div>

    </div>

  );

}