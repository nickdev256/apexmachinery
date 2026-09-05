import {
  useLocation,
  useNavigate,
} from 'react-router-dom';

import Icon from '../Icon';
import { useAuth } from '../../context/AuthContext';

import './AdminLayout.css';


// ============================================================
// SIDEBAR ITEMS
// ============================================================

const sidebarItems = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: 'settings',
    path: '/admin',
  },

  {
    key: 'orders',
    label: 'Orders',
    icon: 'cart',
    path: '/admin/orders',
  },

  {
    key: 'inventory',
    label: 'Inventory',
    icon: 'package',
    path: '/admin/inventory',
  },

  {
    key: 'customers',
    label: 'Customers',
    icon: 'user',
    path: '/admin/customers',
  },

  {
    key: 'products',
    label: 'Products',
    icon: 'tool',
    path: '/admin/products',
  },

  {
    key: 'categories',
    label: 'Categories',
    icon: 'grid',
    path: '/admin/categories',
  },

  {
    key: 'reports',
    label: 'Reports',
    icon: 'eye',
    path: '/admin/reports',
  },

  {
    key: 'notifications',
    label: 'Notifications',
    icon: 'clock',
    path: '/admin/notifications',
  },

  {
    key: 'settings',
    label: 'Settings',
    icon: 'settings',
    path: '/admin/settings',
  },
];


// ============================================================
// ADMIN SIDEBAR
// ============================================================

export default function AdminSidebar() {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    user,
    logout,
  } =
    useAuth();


  // ==========================================================
  // ADMIN DETAILS
  // ==========================================================

  const adminName =
    user?.name ||
    'Apex Administrator';


  const adminEmail =
    user?.email ||
    'admin@apexmachinery.com';


  const adminInitial =
    adminName
      .charAt(0)
      .toUpperCase();


  // ==========================================================
  // ACTIVE ROUTE
  // ==========================================================

  function isActive(item) {

    if (
      item.path === '/admin'
    ) {

      return (
        location.pathname ===
        '/admin'
      );

    }


    return (
      location.pathname === item.path ||
      location.pathname.startsWith(
        `${item.path}/`
      )
    );

  }


  // ==========================================================
  // LOGOUT
  // ==========================================================

  async function handleLogout() {

    const confirmed =
      window.confirm(
        'Are you sure you want to log out of the admin dashboard?'
      );


    if (!confirmed) {

      return;

    }


    try {

      await logout();

    } catch (error) {

      console.error(
        '[ADMIN LOGOUT]',
        error
      );

    } finally {

      navigate(
        '/login',
        {
          replace: true,
        }
      );

    }

  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <aside className="admin-sidebar">


      {/* ====================================================
          PROFILE
      ==================================================== */}

      <div className="admin-profile">

        <div className="admin-avatar">

          {adminInitial}

        </div>


        <div className="admin-profile-info">

          <strong>
            {adminName}
          </strong>


          <span>
            System Administrator
          </span>

        </div>

      </div>


      {/* ====================================================
          NAVIGATION
      ==================================================== */}

      <nav className="admin-nav">

        {sidebarItems.map(
          (item) => {

            const active =
              isActive(item);


            return (

              <button
                key={item.key}
                type="button"
                className={
                  active
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  navigate(
                    item.path
                  )
                }
              >

                <Icon
                  name={item.icon}
                  size={18}
                />


                <span>
                  {item.label}
                </span>

              </button>

            );

          }
        )}

      </nav>


      {/* ====================================================
          BOTTOM
      ==================================================== */}

      <div className="admin-sidebar-bottom">


        {/* SYSTEM STATUS */}

        <div className="admin-sidebar-footer">

          <span className="admin-status-dot" />


          <div>

            <strong>
              System Operational
            </strong>


            <small>
              All services running
            </small>

          </div>

        </div>


        {/* LOGOUT */}

        <button
          type="button"
          className="admin-logout-button"
          onClick={handleLogout}
          title={`Logout ${adminEmail}`}
        >

          <Icon
            name="logout"
            size={18}
          />


          <span>
            Log Out
          </span>

        </button>

      </div>

    </aside>

  );

}