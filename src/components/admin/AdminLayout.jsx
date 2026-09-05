import {
  Outlet,
} from 'react-router-dom';

import AdminSidebar from './AdminSidebar';

import './AdminLayout.css';


// ============================================================
// ADMIN LAYOUT
// ============================================================

export default function AdminLayout({
  children,
}) {

  return (

    <div className="admin-dashboard">


      {/* ====================================================
          SIDEBAR
      ==================================================== */}

      <AdminSidebar />


      {/* ====================================================
          MAIN ADMIN CONTENT
      ==================================================== */}

      <main className="admin-content">

        {
          children ||
          <Outlet />
        }

      </main>

    </div>

  );

}