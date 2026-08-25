import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Icon from './Icon';

import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

import logo from '../assets/logo.jpg';

import './Navbar.css';


// ============================================================
// PUBLIC NAVIGATION LINKS
// ============================================================

const links = [
  {
    to: '/shop',
    label: 'Shop',
  },

  {
    to: '/industrial-equipment',
    label: 'Industrial',
  },

  {
    to: '/power-tools',
    label: 'Tools',
  },

  {
    to: '/brands',
    label: 'Brands',
  },
];


// ============================================================
// NAVBAR
// ============================================================

export default function Navbar() {

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [query, setQuery] =
    useState('');


  // ==========================================================
  // CONTEXT
  // ==========================================================

  const { itemCount } =
    useCart();

  const { items: wishlistItems } =
    useWishlist();

  const { user } =
    useAuth();


  const navigate =
    useNavigate();


  // ==========================================================
  // TRIPLE TAP / CLICK ADMIN ACCESS
  // ==========================================================

  const logoClickCount =
    useRef(0);

  const logoClickTimer =
    useRef(null);


  function handleLogoTripleClick(e) {

    /*
     * Prevent the normal "/" navigation
     * while checking for triple tap.
     */
    e.preventDefault();


    logoClickCount.current += 1;


    /*
     * Clear the previous timer.
     */
    clearTimeout(
      logoClickTimer.current
    );


    /*
     * Reset the counter if the
     * user stops tapping.
     */
    logoClickTimer.current =
      setTimeout(() => {

        logoClickCount.current = 0;

      }, 1000);


    // ========================================================
    // THREE TAPS
    // ========================================================

    if (
      logoClickCount.current === 3
    ) {

      clearTimeout(
        logoClickTimer.current
      );


      logoClickCount.current = 0;


      setMenuOpen(false);


      /*
       * IMPORTANT:
       *
       * We use the SAME LOGIN PAGE.
       *
       * We do NOT navigate to:
       *
       * /admin-login
       *
       * because there is no separate
       * admin-login route.
       *
       * Instead we tell Login.jsx that
       * the login attempt came through
       * administrator access.
       */

      navigate('/login', {
        state: {
          adminAccess: true,
        },
      });

    }

  }


  // ==========================================================
  // SEARCH
  // ==========================================================

  function handleSearch(e) {

    e.preventDefault();


    const value =
      query.trim();


    if (!value) {
      return;
    }


    navigate(
      `/search?q=${encodeURIComponent(value)}`
    );


    setMenuOpen(false);

  }


  // ==========================================================
  // ACCOUNT DESTINATION
  // ==========================================================

  function getAccountPath() {

    /*
     * No authenticated user
     */
    if (!user) {

      return '/login';

    }


    /*
     * Administrator
     */
    if (
      user.role === 'admin' ||
      user.role === 'administrator'
    ) {

      return '/admin';

    }


    /*
     * Normal customer
     */
    return '/dashboard';

  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <header className="navbar">

      <div className="container navbar-inner">


        {/* ==================================================
            LOGO
        ================================================== */}

        <Link
          to="/"
          className="navbar-brand"
          onClick={
            handleLogoTripleClick
          }
          aria-label="Apex Machinery"
        >

          <img
            src={logo}
            alt="Apex Machinery"
            className="navbar-logo"
          />


          <div className="navbar-brand-text">

            <strong>
              APEX MACHINERY
            </strong>

            <span>
              Powering Industry. Building Futures.
            </span>

          </div>

        </Link>


        {/* ==================================================
            NAVIGATION
        ================================================== */}

        <nav
          className={`navbar-links ${
            menuOpen
              ? 'open'
              : ''
          }`}
        >

          {links.map((link) => (

            <Link
              key={link.to}
              to={link.to}
              onClick={() =>
                setMenuOpen(false)
              }
            >

              {link.label}

            </Link>

          ))}


          {/* =================================================
              SEARCH
          ================================================= */}

          <form
            className="navbar-search"
            onSubmit={
              handleSearch
            }
          >

            <Icon
              name="search"
              size={18}
            />


            <input
              type="search"
              placeholder="Search industrial machinery..."
              value={query}
              onChange={(e) =>
                setQuery(
                  e.target.value
                )
              }
              aria-label="Search products"
            />

          </form>

        </nav>


        {/* ==================================================
            NAVBAR ACTIONS
        ================================================== */}

        <div className="navbar-actions">


          {/* =================================================
              WISHLIST
          ================================================= */}

          <Link
            to="/wishlist"
            className="navbar-icon-btn"
            aria-label="Wishlist"
          >

            <Icon
              name="heart"
            />


            {wishlistItems.length > 0 && (

              <span className="navbar-badge">

                {wishlistItems.length}

              </span>

            )}

          </Link>


          {/* =================================================
              CART
          ================================================= */}

          <Link
            to="/cart"
            className="navbar-icon-btn"
            aria-label="Cart"
          >

            <Icon
              name="cart"
            />


            {itemCount > 0 && (

              <span className="navbar-badge">

                {itemCount}

              </span>

            )}

          </Link>


          {/* =================================================
              ACCOUNT
          ================================================= */}

          <Link
            to={getAccountPath()}
            className="navbar-icon-btn"
            aria-label="Account"
          >

            <Icon
              name="user"
            />

          </Link>


          {/* =================================================
              MOBILE MENU
          ================================================= */}

          <button
            type="button"
            className="navbar-menu-toggle"
            onClick={() =>
              setMenuOpen(
                (open) => !open
              )
            }
            aria-label="Toggle menu"
          >

            <Icon
              name={
                menuOpen
                  ? 'close'
                  : 'menu'
              }
            />

          </button>

        </div>

      </div>

    </header>

  );

}