import { useState } from 'react';
import {
  Link,
  useNavigate,
} from 'react-router-dom';

import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpg';

import './Auth.css';


// ============================================================
// APEX MACHINERY
// LOGIN PAGE
// ============================================================
//
// ONE LOGIN FOR ALL EXISTING ACCOUNTS
//
// Customer credentials
//      ↓
// POST /api/auth/login
//      ↓
// role = customer
//      ↓
// /dashboard
//
//
// Administrator credentials
//      ↓
// POST /api/auth/login
//      ↓
// role = admin
//      ↓
// /admin
//
// IMPORTANT:
//
// The frontend does NOT decide the user's role.
// The role comes from the backend "profiles" table.
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
  // AUTH
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
  // GET USER ROLE
  // ==========================================================

  function getUserRole(
    authenticatedUser
  ) {

    return String(
      authenticatedUser?.role || ''
    )
      .trim()
      .toLowerCase();

  }


  // ==========================================================
  // CHECK ADMIN ROLE
  // ==========================================================

  function isAdminRole(
    authenticatedUser
  ) {

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
  // CHECK CUSTOMER ROLE
  // ==========================================================

  function isCustomerRole(
    authenticatedUser
  ) {

    return (
      getUserRole(
        authenticatedUser
      ) === 'customer'
    );

  }


  // ==========================================================
  // GET DASHBOARD
  // ==========================================================

  function getDashboard(
    authenticatedUser
  ) {

    if (
      isAdminRole(
        authenticatedUser
      )
    ) {

      return '/admin';

    }


    if (
      isCustomerRole(
        authenticatedUser
      )
    ) {

      return '/dashboard';

    }


    return null;

  }


  // ==========================================================
  // HANDLE LOGIN
  // ==========================================================

  async function handleSubmit(e) {

    e.preventDefault();


    if (loading) {
      return;
    }


    setError('');


    // ========================================================
    // CLEAN INPUT
    // ========================================================

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
      // EMAIL VALIDATION
      // ======================================================

      if (!cleanEmail) {

        throw new Error(
          'Please enter your email address.'
        );

      }


      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


      if (
        !emailPattern.test(
          cleanEmail
        )
      ) {

        throw new Error(
          'Please enter a valid email address.'
        );

      }


      // ======================================================
      // PASSWORD VALIDATION
      // ======================================================

      if (!cleanPassword) {

        throw new Error(
          'Please enter your password.'
        );

      }


      // ======================================================
      // START LOGIN
      // ======================================================

      setLoading(true);


      // ======================================================
      // AUTHENTICATE
      // ======================================================
      //
      // Same endpoint for customers and administrators.
      //
      // POST /api/auth/login
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
      // GET ROLE FROM BACKEND RESPONSE
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
      // CUSTOMER
      // ======================================================

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
      // ADMINISTRATOR
      // ======================================================

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


      // ======================================================
      // UNKNOWN ROLE
      // ======================================================

      throw new Error(
        `Your account role "${role || 'unknown'}" is not authorized to access this system.`
      );


    } catch (err) {

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

      setLoading(false);

    }

  }


  // ==========================================================
  // ALREADY AUTHENTICATED
  // ==========================================================

  if (
    isAuthenticated &&
    user
  ) {

    const destination =
      getDashboard(
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
              VALID ACCOUNT
          ================================================== */}

          {destination && (

            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() =>
                navigate(
                  destination,
                  {
                    replace: true,
                  }
                )
              }
            >

              {isAdminRole(user)
                ? 'Open Admin Dashboard'
                : 'Go to Dashboard'}

              <Icon
                name="arrowRight"
                size={16}
              />

            </button>

          )}


          {/* ==================================================
              INVALID ROLE
          ================================================== */}

          {!destination && (

            <div
              className="auth-error"
              role="alert"
            >

              <Icon
                name="alert"
                size={17}
              />

              <span>
                Your account does not have a recognized
                access role. Please contact Apex Machinery
                support.
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
            Account Access
          </span>


          <h1>
            Welcome Back
          </h1>


          <p>
            Sign in to access your Apex Machinery
            account and continue managing your
            operations.
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
          noValidate
        >


          {/* ==================================================
              EMAIL
          ================================================== */}

          <div className="field">

            <label
              htmlFor="login-email"
            >
              Email Address
            </label>


            <input
              id="login-email"
              name="email"
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
              placeholder="you@company.com"
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
              LOGIN OPTIONS
          ================================================== */}

          <div className="auth-row">

            <label
              className="filters-checkbox"
            >

              <input
                type="checkbox"
                name="remember"
                disabled={loading}
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


          {/* ==================================================
              LOGIN BUTTON
          ================================================== */}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >

            {loading ? (

              'Signing In...'

            ) : (

              <>

                Sign In

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

        <p className="auth-switch">

          Don&apos;t have an account?{' '}

          <Link to="/register">
            Create one
          </Link>

        </p>


        {/* ==================================================
            SECURITY MESSAGE
        ================================================== */}

        <div className="auth-security-note">

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