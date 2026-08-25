import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import './AdminSettings.css';

export default function AdminSettings() {
  const navigate = useNavigate();

  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    companyName: 'Apex Machinery',
    companyEmail: 'info@apexmachinery.com',
    phone: '+256 700 000000',
    address: 'Kampala, Uganda',

    currency: 'UGX',
    timezone: 'Africa/Kampala',

    lowStockThreshold: 5,
    defaultOrderStatus: 'Pending',

    emailNotifications: true,
    orderNotifications: true,
    inventoryNotifications: true,
    customerNotifications: true,

    maintenanceMode: false,
  });

  // ============================================================
  // HANDLE INPUT CHANGE
  // ============================================================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setSaved(false);
  };

  // ============================================================
  // SAVE SETTINGS
  // ============================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    // Save locally for now.
    // Later this can be connected to your backend/API.
    localStorage.setItem(
      'apex_admin_settings',
      JSON.stringify(settings)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  // ============================================================
  // RESET SETTINGS
  // ============================================================

  const handleReset = () => {
    const confirmed = window.confirm(
      'Reset all settings to their default values?'
    );

    if (!confirmed) {
      return;
    }

    setSettings({
      companyName: 'Apex Machinery',
      companyEmail: 'info@apexmachinery.com',
      phone: '+256 700 000000',
      address: 'Kampala, Uganda',

      currency: 'UGX',
      timezone: 'Africa/Kampala',

      lowStockThreshold: 5,
      defaultOrderStatus: 'Pending',

      emailNotifications: true,
      orderNotifications: true,
      inventoryNotifications: true,
      customerNotifications: true,

      maintenanceMode: false,
    });

    setSaved(false);
  };

  return (
    <div className="admin-settings-page">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="admin-settings-header">

        <div>

          <button
            type="button"
            className="admin-back-button"
            onClick={() => navigate('/admin')}
          >
            <Icon name="arrow-left" size={16} />
            Back to Dashboard
          </button>

          <span className="eyebrow">
            System Administration
          </span>

          <h1>
            Settings
          </h1>

          <p>
            Configure Apex Machinery system,
            company, inventory and notification settings.
          </p>

        </div>

      </div>


      {/* ======================================================
          SUCCESS MESSAGE
      ====================================================== */}

      {saved && (
        <div className="admin-settings-success">

          <Icon
            name="check"
            size={18}
          />

          <span>
            Settings saved successfully.
          </span>

        </div>
      )}


      {/* ======================================================
          SETTINGS FORM
      ====================================================== */}

      <form
        className="admin-settings-form"
        onSubmit={handleSubmit}
      >


        {/* ====================================================
            COMPANY INFORMATION
        ==================================================== */}

        <section className="card admin-settings-card">

          <div className="admin-settings-card-header">

            <div className="admin-settings-icon">
              <Icon
                name="settings"
                size={20}
              />
            </div>

            <div>
              <h2>
                Company Information
              </h2>

              <p>
                Basic information displayed across
                the Apex Machinery system.
              </p>
            </div>

          </div>


          <div className="admin-settings-grid">

            <div className="field">

              <label htmlFor="companyName">
                Company Name
              </label>

              <input
                id="companyName"
                name="companyName"
                type="text"
                value={settings.companyName}
                onChange={handleChange}
                required
              />

            </div>


            <div className="field">

              <label htmlFor="companyEmail">
                Company Email
              </label>

              <input
                id="companyEmail"
                name="companyEmail"
                type="email"
                value={settings.companyEmail}
                onChange={handleChange}
                required
              />

            </div>


            <div className="field">

              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={settings.phone}
                onChange={handleChange}
              />

            </div>


            <div className="field">

              <label htmlFor="address">
                Business Address
              </label>

              <input
                id="address"
                name="address"
                type="text"
                value={settings.address}
                onChange={handleChange}
              />

            </div>

          </div>

        </section>


        {/* ====================================================
            REGIONAL SETTINGS
        ==================================================== */}

        <section className="card admin-settings-card">

          <div className="admin-settings-card-header">

            <div className="admin-settings-icon">
              <Icon
                name="grid"
                size={20}
              />
            </div>

            <div>

              <h2>
                Regional Settings
              </h2>

              <p>
                Configure currency and timezone
                used by the administration system.
              </p>

            </div>

          </div>


          <div className="admin-settings-grid">

            <div className="field">

              <label htmlFor="currency">
                Currency
              </label>

              <select
                id="currency"
                name="currency"
                value={settings.currency}
                onChange={handleChange}
              >

                <option value="UGX">
                  UGX — Ugandan Shilling
                </option>

                <option value="USD">
                  USD — US Dollar
                </option>

                <option value="EUR">
                  EUR — Euro
                </option>

                <option value="GBP">
                  GBP — British Pound
                </option>

              </select>

            </div>


            <div className="field">

              <label htmlFor="timezone">
                Timezone
              </label>

              <select
                id="timezone"
                name="timezone"
                value={settings.timezone}
                onChange={handleChange}
              >

                <option value="Africa/Kampala">
                  Africa/Kampala
                </option>

                <option value="Africa/Nairobi">
                  Africa/Nairobi
                </option>

                <option value="Africa/Johannesburg">
                  Africa/Johannesburg
                </option>

                <option value="UTC">
                  UTC
                </option>

              </select>

            </div>

          </div>

        </section>


        {/* ====================================================
            INVENTORY SETTINGS
        ==================================================== */}

        <section className="card admin-settings-card">

          <div className="admin-settings-card-header">

            <div className="admin-settings-icon">
              <Icon
                name="package"
                size={20}
              />
            </div>

            <div>

              <h2>
                Inventory Settings
              </h2>

              <p>
                Control stock warnings and
                inventory behaviour.
              </p>

            </div>

          </div>


          <div className="admin-settings-grid">

            <div className="field">

              <label htmlFor="lowStockThreshold">
                Low Stock Threshold
              </label>

              <input
                id="lowStockThreshold"
                name="lowStockThreshold"
                type="number"
                min="0"
                value={settings.lowStockThreshold}
                onChange={handleChange}
              />

              <small>
                Products at or below this quantity
                will be marked as low stock.
              </small>

            </div>


            <div className="field">

              <label htmlFor="defaultOrderStatus">
                Default Order Status
              </label>

              <select
                id="defaultOrderStatus"
                name="defaultOrderStatus"
                value={settings.defaultOrderStatus}
                onChange={handleChange}
              >

                <option value="Pending">
                  Pending
                </option>

                <option value="Processing">
                  Processing
                </option>

                <option value="Shipped">
                  Shipped
                </option>

              </select>

            </div>

          </div>

        </section>


        {/* ====================================================
            NOTIFICATIONS
        ==================================================== */}

        <section className="card admin-settings-card">

          <div className="admin-settings-card-header">

            <div className="admin-settings-icon">
              <Icon
                name="clock"
                size={20}
              />
            </div>

            <div>

              <h2>
                Notifications
              </h2>

              <p>
                Choose which system events should
                generate administrator notifications.
              </p>

            </div>

          </div>


          <div className="admin-settings-options">

            <label className="admin-setting-toggle">

              <div>

                <strong>
                  Email Notifications
                </strong>

                <span>
                  Receive important system notifications
                  by email.
                </span>

              </div>

              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleChange}
              />

              <span className="toggle-slider" />

            </label>


            <label className="admin-setting-toggle">

              <div>

                <strong>
                  Order Notifications
                </strong>

                <span>
                  Notify administrators when new
                  orders are received.
                </span>

              </div>

              <input
                type="checkbox"
                name="orderNotifications"
                checked={settings.orderNotifications}
                onChange={handleChange}
              />

              <span className="toggle-slider" />

            </label>


            <label className="admin-setting-toggle">

              <div>

                <strong>
                  Inventory Notifications
                </strong>

                <span>
                  Notify administrators when products
                  reach their reorder level.
                </span>

              </div>

              <input
                type="checkbox"
                name="inventoryNotifications"
                checked={settings.inventoryNotifications}
                onChange={handleChange}
              />

              <span className="toggle-slider" />

            </label>


            <label className="admin-setting-toggle">

              <div>

                <strong>
                  Customer Notifications
                </strong>

                <span>
                  Receive notifications about customer
                  registrations and enquiries.
                </span>

              </div>

              <input
                type="checkbox"
                name="customerNotifications"
                checked={settings.customerNotifications}
                onChange={handleChange}
              />

              <span className="toggle-slider" />

            </label>

          </div>

        </section>


        {/* ====================================================
            SYSTEM SETTINGS
        ==================================================== */}

        <section className="card admin-settings-card">

          <div className="admin-settings-card-header">

            <div className="admin-settings-icon">
              <Icon
                name="settings"
                size={20}
              />
            </div>

            <div>

              <h2>
                System Settings
              </h2>

              <p>
                Manage system availability and
                administrative behaviour.
              </p>

            </div>

          </div>


          <label className="admin-setting-toggle maintenance-toggle">

            <div>

              <strong>
                Maintenance Mode
              </strong>

              <span>
                Temporarily disable customer access
                while maintenance is being performed.
              </span>

            </div>

            <input
              type="checkbox"
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
            />

            <span className="toggle-slider" />

          </label>

          {settings.maintenanceMode && (
            <div className="maintenance-warning">

              <Icon
                name="clock"
                size={18}
              />

              <span>
                Maintenance mode is currently enabled.
                Customers may not be able to access the
                public store.
              </span>

            </div>
          )}

        </section>


        {/* ====================================================
            ACTIONS
        ==================================================== */}

        <div className="admin-settings-actions">

          <button
            type="button"
            className="btn btn-outline-navy"
            onClick={handleReset}
          >
            Reset Defaults
          </button>


          <button
            type="submit"
            className="btn btn-primary"
          >

            <Icon
              name="check"
              size={16}
            />

            Save Settings

          </button>

        </div>

      </form>

    </div>
  );
}