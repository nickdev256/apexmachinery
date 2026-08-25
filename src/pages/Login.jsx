import { useState } from 'react';

import {
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import Icon from '../components/Icon';

import {
  useAuth,
} from '../context/AuthContext';

import logo from '../assets/logo.jpg';

import './Auth.css';


// ============================================================
// APEX MACHINERY
// LOGIN PAGE
// ============================================================
//
// Authentication flow:
//
// Frontend
//    ↓
// AuthContext
//    ↓
// POST /api/auth/login
//    ↓
// Node.js Backend
//    ↓
// Supabase Authentication
//    ↓
// profiles table
//    ↓
// role
//
// customer → /dashboard
// admin    → /admin
//
// ============================================================


export default function Login() {

  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');


  // ==========================================================
  // UI STATE
  // ==========================================================

  const [error, setError] =
    useState('');

  const [loading, setLoading] =
    useState(false);


  // ==========================================================
  // URL PARAMETERS
  // ==========================================================

  const [searchParams] =
    useSearchParams();


  // ==========================================================
  // AUTH CONTEXT
  // ==========================================================

  const {
    login,
    user,
    isAuthenticated,
  } = useAuth();


  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const navigate =
    useNavigate();


  // ==========================================================
  // ADMIN LOGIN MODE
  // ==========================================================

  const adminMode =
    searchParams.get('admin') === 'true';


  // ==========================================================
  // GET USER ROLE
  // ==========================================================

  function getUserRole(authenticatedUser) {

    return String(
      authenticatedUser?.role || ''
    )
      .trim()
      .toLowerCase();

  }


  // ==========================================================
  // CHECK ADMIN
  // ==========================================================

  function isAdminRole(authenticatedUser) {

    const role =
      getUserRole(
        authenticatedUser
      );

    return (
      role === 'admin' ||
      role === 'administrator'
    );

  }


  // ==========================================================
  // CHECK CUSTOMER
  // ==========================================================

  function isCustomerRole(authenticatedUser) {

    return (
      getUserRole(
        authenticatedUser
      ) === 'customer'
    );

  }


  // ==========================================================
  // REDIRECT AUTHENTICATED USER
  // ==========================================================

  function redirectAuthenticatedUser(
    authenticatedUser
  ) {

    // --------------------------------------------------------
    // ADMIN
    // --------------------------------------------------------

    if (
      isAdminRole(
        authenticatedUser
      )
    ) {

      navigate(
        '/admin',
        {
          replace: true,
        }
      );

      return;

    }


    // --------------------------------------------------------
    // CUSTOMER
    // --------------------------------------------------------

    if (
      isCustomerRole(
        authenticatedUser
      )
    ) {

      navigate(
        '/dashboard',
        {
          replace: true,
        }
      );

      return;

    }


    // --------------------------------------------------------
    // UNKNOWN ROLE
    // --------------------------------------------------------

    setError(
      'Your account does not have a valid access role. Please contact Apex Machinery support.'
    );

  }


  // ==========================================================
  // HANDLE LOGIN
  // ==========================================================

  async function handleSubmit(e) {

    e.preventDefault();


    // --------------------------------------------------------
    // CLEAR PREVIOUS ERROR
    // --------------------------------------------------------

    setError('');


    // --------------------------------------------------------
    // PREVENT DOUBLE SUBMISSION
    // --------------------------------------------------------

    if (loading) {

      return;

    }


    // --------------------------------------------------------
    // CLEAN INPUT
    // --------------------------------------------------------

    const cleanEmail =
      String(
        email || ''
      )
        .trim()
        .toLowerCase();


    const cleanPassword =
      String(
        password || ''
      );


    try {

      // ======================================================
      // VALIDATE EMAIL
      // ======================================================

      if (!cleanEmail) {

        throw new Error(
          'Please enter your email address.'
        );

      }


      // ======================================================
      // VALIDATE PASSWORD
      // ======================================================

      if (!cleanPassword) {

        throw new Error(
          'Please enter your password.'
        );

      }


      // ======================================================
      // START LOADING
      // ======================================================

      setLoading(true);


      // ======================================================
      // BACKEND LOGIN
      // ======================================================
      //
      // AuthContext calls:
      //
      // POST http://localhost:5000/api/auth/login
      //
      // The backend authenticates against Supabase.
      //
      // ======================================================

      const loggedInUser =
        await login({

          email:
            cleanEmail,

          password:
            cleanPassword,

        });


      // ======================================================
      // VERIFY USER
      // ======================================================

      if (!loggedInUser) {

        throw new Error(
          'Login succeeded but your account information could not be loaded.'
        );

      }


      // ======================================================
      // GET ROLE
      // ======================================================

      const role =
        getUserRole(
          loggedInUser
        );


      console.log(
        '[Apex Login] Authentication successful:',
        {
          id:
            loggedInUser.id,

          email:
            loggedInUser.email,

          role,
        }
      );


      // ======================================================
      // ADMIN LOGIN PAGE
      // ======================================================

      if (adminMode) {

        // ----------------------------------------------------
        // ADMIN ACCESS REQUIRED
        // ----------------------------------------------------

        if (
          !isAdminRole(
            loggedInUser
          )
        ) {

          throw new Error(
            'This account does not have administrator access.'
          );

        }


        // ----------------------------------------------------
        // ADMIN SUCCESS
        // ----------------------------------------------------

        navigate(
          '/admin',
          {
            replace: true,
          }
        );

        return;

      }


      // ======================================================
      // NORMAL LOGIN
      // ======================================================

      // ------------------------------------------------------
      // ADMIN
      // ------------------------------------------------------

      if (
        isAdminRole(
          loggedInUser
        )
      ) {

        navigate(
          '/admin',
          {
            replace: true,
          }
        );

        return;

      }


      // ------------------------------------------------------
      // CUSTOMER
      // ------------------------------------------------------

      if (
        isCustomerRole(
          loggedInUser
        )
      ) {

        navigate(
          '/dashboard',
          {
            replace: true,
          }
        );

        return;

      }


      // ======================================================
      // INVALID ROLE
      // ======================================================

      throw new Error(
        `Your account role "${role || 'unknown'}" is not authorized to access this system.`
      );

    } catch (err) {

      // ======================================================
      // ERROR HANDLING
      // ======================================================

      console.error(
        '[Apex Login] Login failed:',
        err
      );


      const backendMessage =
        err?.response?.data?.message;


      setError(
        backendMessage ||
        err?.message ||
        'Unable to sign in. Please check your email and password.'
      );

    } finally {

      // ======================================================
      // STOP LOADING
      // ======================================================

      setLoading(false);

    }

  }


  // ==========================================================
  // ALREADY AUTHENTICATED
  // ==========================================================
  //
  // IMPORTANT:
  //
  // We must NOT always redirect to /dashboard.
  //
  // Admin → /admin
  // Customer → /dashboard
  //
  // ==========================================================

  if (isAuthenticated && user) {

    const currentUserIsAdmin =
      isAdminRole(
        user
      );


    const currentUserIsCustomer =
      isCustomerRole(
        user
      );


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
              ACCOUNT ACTIVE
          ================================================== */}

          <div className="auth-header">

            <span className="eyebrow">
              Account Active
            </span>


            <h1>
              You are already signed in
            </h1>


            <p>

              Welcome back,{' '}

              <strong>
                {user.name ||
                  user.email}
              </strong>

              .

            </p>

          </div>


          {/* ==================================================
              ADMIN DESTINATION
          ================================================== */}

          {currentUserIsAdmin && (

            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => {

                navigate(
                  '/admin',
                  {
                    replace: true,
                  }
                );

              }}
            >

              Open Admin Dashboard

              <Icon
                name="arrowRight"
                size={16}
              />

            </button>

          )}


          {/* ==================================================
              CUSTOMER DESTINATION
          ================================================== */}

          {currentUserIsCustomer && (

            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => {

                navigate(
                  '/dashboard',
                  {
                    replace: true,
                  }
                );

              }}
            >

              Go to Customer Dashboard

              <Icon
                name="arrowRight"
                size={16}
              />

            </button>

          )}


          {/* ==================================================
              UNKNOWN ROLE
          ================================================== */}

          {!currentUserIsAdmin &&
            !currentUserIsCustomer && (

            <div
              className="auth-error"
              role="alert"
            >

              <Icon
                name="alert"
                size={17}
              />

              <span>
                Your account role is not recognized.
                Please contact Apex Machinery support.
              </span>

            </div>

          )}


          {/* ==================================================
              RETURN HOME
          ================================================== */}

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
  // LOGIN PAGE
  // ==========================================================

  return (

    <div
      className={
        `auth-page ${
          adminMode
            ? 'admin-auth-mode'
            : ''
        }`
      }
    >

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

            {adminMode
              ? 'Administrator Access'
              : 'Account Access'}

          </span>


          <h1>

            {adminMode
              ? 'Administrator Login'
              : 'Welcome Back'}

          </h1>


          <p>

            {adminMode

              ? 'Sign in with your administrator credentials to access the Apex Machinery control panel.'

              : 'Sign in to manage your industrial procurement account, orders and quotations.'}

          </p>

        </div>


        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (

          <div
            className="auth-error"
            role="alert"
            aria-live="polite"
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
            LOGIN FORM
        ================================================== */}

        <form
          onSubmit={handleSubmit}
          noValidate={false}
        >


          {/* ==================================================
              EMAIL
          ================================================== */}

          <div className="field">

            <label
              htmlFor="login-email"
            >

              {adminMode
                ? 'Administrator Email'
                : 'Email Address'}

            </label>


            <input
              id="login-email"
              name="email"
              required
              type="email"
              value={email}
              onChange={(e) => {

                setEmail(
                  e.target.value
                );

                if (error) {
                  setError('');
                }

              }}
              placeholder={
                adminMode
                  ? 'admin@apexmachinery.com'
                  : 'you@company.com'
              }
              autoComplete="username"
              disabled={loading}
              maxLength={254}
              autoFocus
            />

          </div>


          {/* ==================================================
              PASSWORD
          ================================================== */}

          <div className="field">

            <label
              htmlFor="login-password"
            >
              Password
            </label>


            <input
              id="login-password"
              name="password"
              required
              type="password"
              value={password}
              onChange={(e) => {

                setPassword(
                  e.target.value
                );

                if (error) {
                  setError('');
                }

              }}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={loading}
            />

          </div>


          {/* ==================================================
              CUSTOMER OPTIONS
          ================================================== */}

          {!adminMode && (

            <div className="auth-row">

              <label
                className="filters-checkbox"
              >

                <input
                  type="checkbox"
                  name="remember"
                />


                <span>
                  Remember me
                </span>

              </label>


              <Link
                to="/forgot-password"
              >
                Forgot password?
              </Link>

            </div>

          )}


          {/* ==================================================
              LOGIN BUTTON
          ================================================== */}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >

            {loading ? (

              <>
                Authenticating...
              </>

            ) : (

              <>

                {adminMode
                  ? 'Access Admin Dashboard'
                  : 'Sign In'}


                <Icon
                  name="arrowRight"
                  size={16}
                />

              </>

            )}

          </button>

        </form>


        {/* ==================================================
            CUSTOMER REGISTRATION
        ================================================== */}

        {!adminMode && (

          <p className="auth-switch">

            Don&apos;t have an account?{' '}


            <Link to="/register">
              Create one
            </Link>

          </p>

        )}


        {/* ==================================================
            ADMIN BACK LINK
        ================================================== */}

        {adminMode && (

          <div
            className="admin-login-back"
          >

            <Link to="/login">

              ← Customer Login

            </Link>

          </div>

        )}


        {/* ==================================================
            SECURITY MESSAGE
        ================================================== */}

        <div
          className="auth-security-note"
        >

          <Icon
            name="shield"
            size={16}
          />


          <span>

            Secure authentication is handled through
            the Apex Machinery backend and Supabase.

          </span>

        </div>

      </div>

    </div>

  );

}