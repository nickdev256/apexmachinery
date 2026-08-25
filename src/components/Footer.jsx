import { Link } from 'react-router-dom';

import Icon from './Icon';

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from 'react-icons/fa';

import { FaXTwitter } from 'react-icons/fa6';

import logo from '../assets/logo.jpg';

import './Footer.css';


export default function Footer() {

  return (

    <footer className="footer">

      <div className="container footer-grid">


        {/* ======================================================
            COMPANY INFORMATION
        ====================================================== */}

        <div className="footer-brand">

          <img
            src={logo}
            alt="Apex Machinery"
            className="footer-logo"
          />

          <h3>
            APEX MACHINERY
          </h3>

          <p>
            Powering Industry. Building Futures.
          </p>


          <div className="footer-contact">

            <div>
              <Icon
                name="map-pin"
                size={16}
              />

              <span>
                Katwe, Kampala, Uganda
              </span>
            </div>


            <div>
              <Icon
                name="phone"
                size={16}
              />

              <span>
                +256 703 784893
              </span>
            </div>


            <div>
              <Icon
                name="mail"
                size={16}
              />

              <span>
                info@apexmachinery.ug
              </span>
            </div>


            <div>
              <Icon
                name="clock"
                size={16}
              />

              <span>
                Mon–Sat: 8:00 AM – 6:00 PM EAT
              </span>
            </div>

          </div>

        </div>


        {/* ======================================================
            PLATFORM
        ====================================================== */}

        <div className="footer-col">

          <h4>
            Platform
          </h4>

          <ul>

            <li>
              <Link to="/shop">
                Shop All
              </Link>
            </li>

            <li>
              <Link to="/shop?category=industrial-machinery">
                Industrial Equipment
              </Link>
            </li>

            <li>
              <Link to="/shop?category=power-tools">
                Power Tools
              </Link>
            </li>

            <li>
              <Link to="/brands">
                Brands
              </Link>
            </li>

          </ul>

        </div>


        {/* ======================================================
            COMPANY
        ====================================================== */}

        <div className="footer-col">

          <h4>
            Company
          </h4>

          <ul>

            <li>
              <Link to="/about">
                About Us
              </Link>
            </li>

            <li>
              <Link to="/order-tracking">
                Order Tracking
              </Link>
            </li>

            <li>
              <Link to="/contact">
                Contact
              </Link>
            </li>

            <li>
              <Link to="/dashboard">
                My Account
              </Link>
            </li>

          </ul>

        </div>


        {/* ======================================================
            LEGAL
        ====================================================== */}

        <div className="footer-col">

          <h4>
            Legal
          </h4>

          <ul>

            <li>
              <Link to="/privacy">
                Privacy Policy
              </Link>
            </li>

            <li>
              <Link to="/terms">
                Terms of Service
              </Link>
            </li>

            <li>
              <Link to="/cookies">
                Cookie Policy
              </Link>
            </li>

            <li>
              <Link to="/compliance">
                Compliance
              </Link>
            </li>

          </ul>

        </div>

      </div>


      {/* ======================================================
          FOOTER BOTTOM
      ====================================================== */}

      <div className="container footer-bottom">

        <p>
          © 2026 Apex Machinery. All rights reserved.
        </p>


        {/* ======================================================
            SOCIAL MEDIA
        ====================================================== */}

        <div className="footer-social">


          {/* FACEBOOK */}

          <a
            href="#"
            aria-label="Facebook"
            title="Facebook"
          >
            <FaFacebookF />
          </a>


          {/* INSTAGRAM */}

          <a
            href="#"
            aria-label="Instagram"
            title="Instagram"
          >
            <FaInstagram />
          </a>


          {/* LINKEDIN */}

          <a
            href="#"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <FaLinkedinIn />
          </a>


          {/* X */}

          <a
            href="#"
            aria-label="X"
            title="X"
          >
            <FaXTwitter />
          </a>


          {/* WHATSAPP */}

          <a
            href="#"
            aria-label="WhatsApp"
            title="WhatsApp"
          >
            <FaWhatsapp />
          </a>

        </div>

      </div>

    </footer>

  );
}