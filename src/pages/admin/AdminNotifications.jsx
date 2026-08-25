import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import './AdminNotifications.css';

// ============================================================
// INITIAL NOTIFICATIONS
// ============================================================

const initialNotifications = [
  {
    id: 1,
    type: 'order',
    title: 'New Order Received',
    message:
      'Order #APX-9921 has been placed by Webb Steelworks.',
    date: '08 August 2026',
    time: '10 minutes ago',
    read: false,
    priority: 'high',
  },

  {
    id: 2,
    type: 'inventory',
    title: 'Low Stock Alert',
    message:
      'Industrial Diesel Generator 250 kVA has only 2 units remaining. Please review inventory and consider restocking this product.',
    date: '08 August 2026',
    time: '35 minutes ago',
    read: false,
    priority: 'high',
  },

  {
    id: 3,
    type: 'payment',
    title: 'Payment Confirmed',
    message:
      'Payment of UGX 45,200,000 for order #APX-9918 has been confirmed successfully.',
    date: '08 August 2026',
    time: '1 hour ago',
    read: true,
    priority: 'normal',
  },

  {
    id: 4,
    type: 'customer',
    title: 'New Customer Registered',
    message:
      'Global Trade Hub has created a new business account and is now available in the customer management section.',
    date: '08 August 2026',
    time: '2 hours ago',
    read: false,
    priority: 'normal',
  },

  {
    id: 5,
    type: 'order',
    title: 'Order Shipped',
    message:
      'Order #APX-9918 has been dispatched for delivery. The customer can now track the order from their account.',
    date: '08 August 2026',
    time: '3 hours ago',
    read: true,
    priority: 'normal',
  },

  {
    id: 6,
    type: 'inventory',
    title: 'Restock Required',
    message:
      'Heavy Duty Air Compressor has reached its reorder level. Review the inventory and add additional units if required.',
    date: '08 August 2026',
    time: '5 hours ago',
    read: false,
    priority: 'high',
  },

  {
    id: 7,
    type: 'system',
    title: 'System Backup Completed',
    message:
      'The scheduled Apex Machinery system backup completed successfully. All configured system data was backed up.',
    date: '07 August 2026',
    time: 'Yesterday',
    read: true,
    priority: 'normal',
  },

  {
    id: 8,
    type: 'customer',
    title: 'Quote Request',
    message:
      'A new enterprise customer has requested a bulk machinery quotation. Review the request and respond through the customer management system.',
    date: '07 August 2026',
    time: 'Yesterday',
    read: true,
    priority: 'normal',
  },
];

// ============================================================
// ADMIN NOTIFICATIONS
// ============================================================

export default function AdminNotifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] =
    useState(initialNotifications);

  const [filter, setFilter] =
    useState('all');

  const [search, setSearch] =
    useState('');

  const [selectedNotification, setSelectedNotification] =
    useState(null);


  // ==========================================================
  // BACK TO DASHBOARD
  // ==========================================================

  const handleBack = () => {
    navigate('/admin');
  };


  // ==========================================================
  // FILTER NOTIFICATIONS
  // ==========================================================

  const filteredNotifications = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return notifications.filter((notification) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'unread' &&
          !notification.read) ||
        (filter === 'read' &&
          notification.read) ||
        notification.type === filter;

      const matchesSearch =
        !query ||
        notification.title
          .toLowerCase()
          .includes(query) ||
        notification.message
          .toLowerCase()
          .includes(query);

      return (
        matchesFilter &&
        matchesSearch
      );
    });
  }, [
    notifications,
    filter,
    search,
  ]);


  // ==========================================================
  // STATISTICS
  // ==========================================================

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read
    ).length;

  const readCount =
    notifications.length -
    unreadCount;

  const orderCount =
    notifications.filter(
      (notification) =>
        notification.type === 'order'
    ).length;

  const inventoryCount =
    notifications.filter(
      (notification) =>
        notification.type === 'inventory'
    ).length;


  // ==========================================================
  // MARK AS READ
  // ==========================================================

  const markAsRead = (id) => {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    );
  };


  // ==========================================================
  // MARK ALL AS READ
  // ==========================================================

  const markAllAsRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };


  // ==========================================================
  // DELETE
  // ==========================================================

  const deleteNotification = (id) => {
    setNotifications((previous) =>
      previous.filter(
        (notification) =>
          notification.id !== id
      )
    );

    if (
      selectedNotification?.id === id
    ) {
      setSelectedNotification(null);
    }
  };


  // ==========================================================
  // CLEAR READ
  // ==========================================================

  const clearReadNotifications = () => {
    setNotifications((previous) =>
      previous.filter(
        (notification) =>
          !notification.read
      )
    );

    setSelectedNotification(null);
  };


  // ==========================================================
  // VIEW MESSAGE
  // ==========================================================

  const viewNotification = (notification) => {
    setSelectedNotification({
      ...notification,
      read: true,
    });

    markAsRead(notification.id);
  };


  // ==========================================================
  // CLOSE MESSAGE
  // ==========================================================

  const closeMessage = () => {
    setSelectedNotification(null);
  };


  // ==========================================================
  // ICON
  // ==========================================================

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return 'cart';

      case 'inventory':
        return 'package';

      case 'payment':
        return 'check';

      case 'customer':
        return 'user';

      case 'system':
        return 'settings';

      default:
        return 'clock';
    }
  };


  // ==========================================================
  // TYPE LABEL
  // ==========================================================

  const getTypeLabel = (type) => {
    switch (type) {
      case 'order':
        return 'Order';

      case 'inventory':
        return 'Inventory';

      case 'payment':
        return 'Payment';

      case 'customer':
        return 'Customer';

      case 'system':
        return 'System';

      default:
        return 'Notification';
    }
  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="admin-notifications-page">

      {/* ====================================================
          BACK TO DASHBOARD
      ==================================================== */}

      <div className="admin-back-row">

        <button
          type="button"
          className="admin-back-button"
          onClick={handleBack}
        >
          <Icon
            name="arrowLeft"
            size={16}
          />

          Back to Dashboard
        </button>

      </div>


      {/* ====================================================
          PAGE HEADER
      ==================================================== */}

      <div className="admin-page-header">

        <div>

          <span className="eyebrow">
            System Notifications
          </span>

          <h1>
            Notifications
          </h1>

          <p>
            Stay updated on orders,
            inventory, customers and
            system activity.
          </p>

        </div>


        <div className="admin-notification-header-actions">

          <button
            type="button"
            className="btn btn-outline-navy"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >

            <Icon
              name="check"
              size={16}
            />

            Mark All as Read

          </button>

        </div>

      </div>


      {/* ====================================================
          STATISTICS
      ==================================================== */}

      <div className="admin-notification-stats">

        <div className="card notification-stat">

          <div className="notification-stat-icon">
            <Icon
              name="clock"
              size={20}
            />
          </div>

          <div>
            <strong>
              {unreadCount}
            </strong>

            <span>
              Unread
            </span>
          </div>

        </div>


        <div className="card notification-stat">

          <div className="notification-stat-icon">
            <Icon
              name="check"
              size={20}
            />
          </div>

          <div>
            <strong>
              {readCount}
            </strong>

            <span>
              Read
            </span>
          </div>

        </div>


        <div className="card notification-stat">

          <div className="notification-stat-icon">
            <Icon
              name="cart"
              size={20}
            />
          </div>

          <div>
            <strong>
              {orderCount}
            </strong>

            <span>
              Order Alerts
            </span>
          </div>

        </div>


        <div className="card notification-stat">

          <div className="notification-stat-icon">
            <Icon
              name="package"
              size={20}
            />
          </div>

          <div>
            <strong>
              {inventoryCount}
            </strong>

            <span>
              Inventory Alerts
            </span>
          </div>

        </div>

      </div>


      {/* ====================================================
          NOTIFICATIONS
      ==================================================== */}

      <div className="card admin-notifications-container">

        {/* TOOLBAR */}

        <div className="admin-notifications-toolbar">

          <div className="admin-notification-search">

            <Icon
              name="search"
              size={18}
            />

            <input
              type="text"
              placeholder="Search notifications..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <div className="notification-filters">

            <button
              type="button"
              className={
                filter === 'all'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setFilter('all')
              }
            >
              All
            </button>

            <button
              type="button"
              className={
                filter === 'unread'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setFilter('unread')
              }
            >
              Unread
            </button>

            <button
              type="button"
              className={
                filter === 'read'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setFilter('read')
              }
            >
              Read
            </button>

            <button
              type="button"
              className={
                filter === 'order'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setFilter('order')
              }
            >
              Orders
            </button>

            <button
              type="button"
              className={
                filter === 'inventory'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setFilter('inventory')
              }
            >
              Inventory
            </button>

          </div>


          <button
            type="button"
            className="admin-clear-read"
            onClick={
              clearReadNotifications
            }
            disabled={readCount === 0}
          >
            Clear Read
          </button>

        </div>


        {/* COUNT */}

        <div className="admin-notification-result-count">
          Showing {filteredNotifications.length}{' '}
          of {notifications.length} notifications
        </div>


        {/* ==================================================
            NOTIFICATION LIST
        ================================================== */}

        <div className="notification-list">

          {filteredNotifications.length === 0 ? (

            <div className="admin-notification-empty">

              <Icon
                name="check"
                size={32}
              />

              <h3>
                No notifications found
              </h3>

              <p>
                There are no notifications
                matching your current filters.
              </p>

            </div>

          ) : (

            filteredNotifications.map(
              (notification) => (

                <div
                  key={notification.id}
                  className={`notification-item ${
                    notification.read
                      ? 'read'
                      : 'unread'
                  }`}
                >

                  {/* ICON */}

                  <div
                    className={`notification-icon notification-${notification.type}`}
                  >

                    <Icon
                      name={getNotificationIcon(
                        notification.type
                      )}
                      size={20}
                    />

                  </div>


                  {/* CONTENT */}

                  <div className="notification-content">

                    <div className="notification-top">

                      <div className="notification-labels">

                        <span className="notification-type">
                          {getTypeLabel(
                            notification.type
                          )}
                        </span>

                        {notification.priority ===
                          'high' && (

                          <span className="notification-priority">
                            Important
                          </span>

                        )}

                      </div>


                      <span className="notification-time">
                        {notification.time}
                      </span>

                    </div>


                    <h3>
                      {notification.title}
                    </h3>

                    <p>
                      {notification.message}
                    </p>


                    {/* ACTIONS */}

                    <div className="notification-actions">

                      {/* VIEW */}

                      <button
                        type="button"
                        className="notification-view-button"
                        title="View full message"
                        onClick={() =>
                          viewNotification(
                            notification
                          )
                        }
                      >

                        <Icon
                          name="eye"
                          size={15}
                        />

                        View Message

                      </button>


                      {/* MARK READ */}

                      {!notification.read && (

                        <button
                          type="button"
                          onClick={() =>
                            markAsRead(
                              notification.id
                            )
                          }
                        >

                          <Icon
                            name="check"
                            size={14}
                          />

                          Mark as Read

                        </button>

                      )}


                      {/* DELETE */}

                      <button
                        type="button"
                        className="notification-delete"
                        title="Delete notification"
                        onClick={() =>
                          deleteNotification(
                            notification.id
                          )
                        }
                      >

                        <Icon
                          name="trash"
                          size={14}
                        />

                        Delete

                      </button>

                    </div>

                  </div>


                  {/* UNREAD DOT */}

                  {!notification.read && (

                    <span
                      className="notification-unread-dot"
                      title="Unread"
                    />

                  )}

                </div>

              )
            )

          )}

        </div>

      </div>


      {/* ====================================================
          VIEW MESSAGE MODAL
      ==================================================== */}

      {selectedNotification && (

        <div
          className="notification-message-overlay"
          onClick={closeMessage}
        >

          <div
            className="notification-message-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="notification-message-header">

              <div className="notification-message-heading">

                <span className="eyebrow">
                  {getTypeLabel(
                    selectedNotification.type
                  )}
                </span>

                <h2>
                  {selectedNotification.title}
                </h2>

              </div>


              <button
                type="button"
                className="notification-message-close"
                onClick={closeMessage}
              >
                ×
              </button>

            </div>


            {/* META */}

            <div className="notification-message-meta">

              <div>
                <span>
                  Date
                </span>

                <strong>
                  {selectedNotification.date}
                </strong>
              </div>


              <div>
                <span>
                  Time
                </span>

                <strong>
                  {selectedNotification.time}
                </strong>
              </div>


              <div>
                <span>
                  Priority
                </span>

                <strong
                  className={
                    selectedNotification.priority ===
                    'high'
                      ? 'message-priority-high'
                      : ''
                  }
                >
                  {selectedNotification.priority ===
                  'high'
                    ? 'Important'
                    : 'Normal'}
                </strong>
              </div>


              <div>
                <span>
                  Status
                </span>

                <strong>
                  Read
                </strong>
              </div>

            </div>


            {/* FULL MESSAGE */}

            <div className="notification-full-message">

              <div className="notification-full-message-icon">

                <Icon
                  name={getNotificationIcon(
                    selectedNotification.type
                  )}
                  size={24}
                />

              </div>


              <div>

                <span className="notification-full-message-label">
                  Notification Message
                </span>

                <p>
                  {selectedNotification.message}
                </p>

              </div>

            </div>


            {/* ACTIONS */}

            <div className="notification-message-actions">

              <button
                type="button"
                className="btn btn-outline-navy"
                onClick={closeMessage}
              >
                Close
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  markAsRead(
                    selectedNotification.id
                  );

                  setSelectedNotification(
                    (previous) =>
                      previous
                        ? {
                            ...previous,
                            read: true,
                          }
                        : previous
                  );
                }}
              >

                <Icon
                  name="check"
                  size={15}
                />

                Mark as Read

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}