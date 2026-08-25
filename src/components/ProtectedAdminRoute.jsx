import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


// ============================================================
// PROTECTED ADMIN ROUTE
// ============================================================

export default function ProtectedAdminRoute() {

  const {
    user,
    loading,
    isAdmin,
  } = useAuth();


  // ==========================================================
  // AUTHENTICATION CHECK
  // ==========================================================

  if (loading) {

    return (

      <div className="admin-auth-loading">

        <div className="admin-auth-spinner" />

        <h2>
          Checking administrator access...
        </h2>

        <p>
          Please wait.
        </p>

      </div>

    );

  }


  // ==========================================================
  // NOT LOGGED IN
  // ==========================================================

  if (!user) {

    return (

      <Navigate
        to="/login"
        replace
      />

    );

  }


  // ==========================================================
  // CUSTOMER TRYING TO ACCESS ADMIN
  // ==========================================================

  if (!isAdmin) {

    return (

      <Navigate
        to="/dashboard"
        replace
      />

    );

  }


  // ==========================================================
  // ADMIN AUTHORIZED
  // ==========================================================

  return <Outlet />;

}