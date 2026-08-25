import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';


// ============================================================
// APEX MACHINERY
// PROTECTED CUSTOMER ROUTE
// ============================================================
//
// Protects customer-only pages.
//
// Authentication flow:
//
// Not logged in
//      ↓
// /login
//
// Logged in as customer
//      ↓
// Allow access
//
// Logged in as admin
//      ↓
// /admin
//
// ============================================================


export default function ProtectedCustomerRoute() {

  const {
    user,
    loading,
    isAuthenticated,
    isCustomer,
    isAdmin,
  } = useAuth();


  const location =
    useLocation();


  // ==========================================================
  // CHECKING AUTHENTICATION
  // ==========================================================

  if (loading) {

    return (

      <div className="admin-auth-loading">

        <div className="admin-auth-spinner" />

        <h2>
          Checking your account...
        </h2>

        <p>
          Please wait while we verify your authentication.
        </p>

      </div>

    );

  }


  // ==========================================================
  // NOT AUTHENTICATED
  // ==========================================================

  if (
    !isAuthenticated ||
    !user
  ) {

    return (

      <Navigate
        to="/login"
        replace
        state={{
          from:
            location.pathname +
            location.search,
        }}
      />

    );

  }


  // ==========================================================
  // ADMIN ACCOUNT
  // ==========================================================
  //
  // Admins should never be treated as customers.
  //
  // ==========================================================

  if (isAdmin) {

    return (

      <Navigate
        to="/admin"
        replace
      />

    );

  }


  // ==========================================================
  // CUSTOMER ACCOUNT
  // ==========================================================

  if (isCustomer) {

    return (
      <Outlet />
    );

  }


  // ==========================================================
  // UNKNOWN ROLE
  // ==========================================================

  return (

    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-header">

          <span className="eyebrow">
            Access Denied
          </span>

          <h1>
            Account Access Error
          </h1>

          <p>
            Your account does not have a valid
            customer access role.
          </p>

        </div>


        <div
          className="auth-error"
          role="alert"
        >

          <span>
            Please contact Apex Machinery support
            to verify your account permissions.
          </span>

        </div>

      </div>

    </div>

  );

}