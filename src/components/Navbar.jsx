import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom';

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

  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  const [
    query,
    setQuery,
  ] = useState('');


  // ==========================================================
  // ROUTER
  // ==========================================================

  const navigate =
    useNavigate();

  const location =
    useLocation();


  // ==========================================================
  // CONTEXT
  // ==========================================================

  const {
    itemCount = 0,
  } = useCart();


  const {
    items: wishlistItems = [],
  } = useWishlist();


  const {
    user,
  } = useAuth();


  // ==========================================================
  // CLOSE MOBILE MENU WHEN ROUTE CHANGES
  // ==========================================================

  useEffect(
    () => {

      setMenuOpen(false);

    },
    [
      location.pathname,
      location.search,
    ]
  );


  // ==========================================================
  // ESCAPE KEY CLOSES MENU
  // ==========================================================

  useEffect(
    () => {

      function handleKeyDown(
        event
      ) {

        if (
          event.key ===
          'Escape'
        ) {

          setMenuOpen(false);

        }

      }


      window.addEventListener(
        'keydown',
        handleKeyDown
      );


      return () => {

        window.removeEventListener(
          'keydown',
          handleKeyDown
        );

      };

    },
    []
  );


  // ==========================================================
  // PREVENT BACKGROUND SCROLL WHEN MOBILE MENU IS OPEN
  // ==========================================================

  useEffect(
    () => {

      if (
        menuOpen
      ) {

        document.body.classList.add(
          'navbar-menu-open'
        );

      } else {

        document.body.classList.remove(
          'navbar-menu-open'
        );

      }


      return () => {

        document.body.classList.remove(
          'navbar-menu-open'
        );

      };

    },
    [
      menuOpen,
    ]
  );


  // ==========================================================
  // LOGO TRIPLE CLICK ADMIN ACCESS
  // ==========================================================

  const logoClickCount =
    useRef(0);

  const logoClickTimer =
    useRef(null);


  function handleLogoClick(
    event
  ) {

    event.preventDefault();


    logoClickCount.current += 1;


    clearTimeout(
      logoClickTimer.current
    );


    // ========================================================
    // THIRD CLICK
    // ========================================================

    if (
      logoClickCount.current >= 3
    ) {

      logoClickCount.current = 0;


      clearTimeout(
        logoClickTimer.current
      );


      setMenuOpen(false);


      navigate(
        '/login',
        {
          state: {
            adminAccess: true,
          },
        }
      );


      return;

    }


    // ========================================================
    // NORMAL LOGO CLICK
    // ========================================================

    logoClickTimer.current =
      setTimeout(
        () => {

          logoClickCount.current = 0;


          navigate('/');

        },
        450
      );

  }


  // ==========================================================
  // CLEAN UP LOGO TIMER
  // ==========================================================

  useEffect(
    () => {

      return () => {

        clearTimeout(
          logoClickTimer.current
        );

      };

    },
    []
  );


  // ==========================================================
  // SEARCH
  // ==========================================================

  function handleSearch(
    event
  ) {

    event.preventDefault();


    const value =
      query.trim();


    if (
      !value
    ) {
      return;
    }


    navigate(
      `/search?q=${encodeURIComponent(
        value
      )}`
    );


    setMenuOpen(false);

  }


  // ==========================================================
  // ACCOUNT DESTINATION
  // ==========================================================

  function getAccountPath() {

    if (
      !user
    ) {

      return '/login';

    }


    if (
      user.role === 'admin' ||
      user.role === 'administrator'
    ) {

      return '/admin';

    }


    return '/dashboard';

  }


  // ==========================================================
  // MENU TOGGLE
  // ==========================================================

  function toggleMenu() {

    setMenuOpen(
      (
        current
      ) =>
        !current
    );

  }


  function closeMenu() {

    setMenuOpen(false);

  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <header className="navbar">


      {/* ======================================================
          MAIN NAVBAR
      ====================================================== */}

      <div className="container navbar-inner">


        {/* ====================================================
            LOGO
        ==================================================== */}

        <Link
          to="/"
          className="navbar-brand"
          onClick={
            handleLogoClick
          }
          aria-label="Apex Machinery home"
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


        {/* ====================================================
            DESKTOP / MOBILE NAVIGATION
        ==================================================== */}

        <nav
          id="main-navigation"
          className={
            `navbar-links ${
              menuOpen
                ? 'open'
                : ''
            }`
          }
          aria-label="Main navigation"
        >


          {/* ==================================================
              NAVIGATION LINKS
          ================================================== */}

          <div className="navbar-nav-links">

            {
              links.map(
                (
                  link
                ) => (

                  <NavLink
                    key={
                      link.to
                    }
                    to={
                      link.to
                    }
                    onClick={
                      closeMenu
                    }
                    className={
                      (
                        {
                          isActive,
                        }
                      ) =>
                        isActive
                          ? 'navbar-link active'
                          : 'navbar-link'
                    }
                  >

                    {
                      link.label
                    }

                  </NavLink>

                )
              )
            }

          </div>


          {/* ==================================================
              SEARCH
          ================================================== */}

          <form
            className="navbar-search"
            onSubmit={
              handleSearch
            }
          >

            <span className="navbar-search-icon">

              <Icon
                name="search"
                size={18}
              />

            </span>


            <input
              type="search"
              placeholder="Search machinery..."
              value={
                query
              }
              onChange={
                (
                  event
                ) =>
                  setQuery(
                    event.target.value
                  )
              }
              aria-label="Search products"
            />


            <button
              type="submit"
              className="navbar-search-submit"
              aria-label="Search"
            >

              <Icon
                name="search"
                size={18}
              />

            </button>

          </form>


          {/* ==================================================
              MOBILE ACCOUNT LINKS
          ================================================== */}

          <div className="navbar-mobile-actions">

            <Link
              to="/wishlist"
              onClick={
                closeMenu
              }
            >

              <Icon
                name="heart"
                size={19}
              />

              <span>
                Wishlist
              </span>

              {
                wishlistItems.length >
                0 && (

                  <span className="navbar-mobile-count">

                    {
                      wishlistItems.length
                    }

                  </span>

                )
              }

            </Link>


            <Link
              to="/cart"
              onClick={
                closeMenu
              }
            >

              <Icon
                name="cart"
                size={19}
              />

              <span>
                Cart
              </span>

              {
                itemCount >
                0 && (

                  <span className="navbar-mobile-count">

                    {
                      itemCount
                    }

                  </span>

                )
              }

            </Link>


            <Link
              to={
                getAccountPath()
              }
              onClick={
                closeMenu
              }
            >

              <Icon
                name="user"
                size={19}
              />

              <span>
                {
                  user
                    ? 'My Account'
                    : 'Login'
                }
              </span>

            </Link>

          </div>

        </nav>


        {/* ====================================================
            DESKTOP ACTIONS
        ==================================================== */}

        <div className="navbar-actions">


          {/* ==================================================
              WISHLIST
          ================================================== */}

          <Link
            to="/wishlist"
            className="navbar-icon-btn navbar-desktop-action"
            aria-label={
              `Wishlist ${
                wishlistItems.length
              } items`
            }
          >

            <Icon
              name="heart"
            />


            {
              wishlistItems.length >
              0 && (

                <span className="navbar-badge">

                  {
                    wishlistItems.length >
                    99
                      ? '99+'
                      : wishlistItems.length
                  }

                </span>

              )
            }

          </Link>


          {/* ==================================================
              CART
          ================================================== */}

          <Link
            to="/cart"
            className="navbar-icon-btn navbar-desktop-action"
            aria-label={
              `Cart ${
                itemCount
              } items`
            }
          >

            <Icon
              name="cart"
            />


            {
              itemCount >
              0 && (

                <span className="navbar-badge">

                  {
                    itemCount >
                    99
                      ? '99+'
                      : itemCount
                  }

                </span>

              )
            }

          </Link>


          {/* ==================================================
              ACCOUNT
          ================================================== */}

          <Link
            to={
              getAccountPath()
            }
            className="navbar-icon-btn navbar-desktop-action"
            aria-label={
              user
                ? 'My account'
                : 'Login'
            }
          >

            <Icon
              name="user"
            />

          </Link>


          {/* ==================================================
              MOBILE MENU BUTTON
          ================================================== */}

          <button
            type="button"
            className="navbar-menu-toggle"
            onClick={
              toggleMenu
            }
            aria-label={
              menuOpen
                ? 'Close navigation menu'
                : 'Open navigation menu'
            }
            aria-expanded={
              menuOpen
            }
            aria-controls="main-navigation"
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


      {/* ======================================================
          MOBILE BACKDROP
      ====================================================== */}

      {
        menuOpen && (

          <button
            type="button"
            className="navbar-backdrop"
            onClick={
              closeMenu
            }
            aria-label="Close navigation menu"
          />

        )
      }

    </header>

  );

}