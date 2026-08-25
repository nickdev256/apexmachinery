import { useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import Icon from '../components/Icon';
import { ProgressBar, Timeline } from '../components/Timeline';
import './OrderTracking.css';

const milestones = [
  { title: 'Order Placed', date: 'Jul 12, 10:30 AM', note: 'Order confirmed and ready for processing.', status: 'done' },
  { title: 'Inventory Reserved', date: 'Jul 12, 02:15 PM', note: 'Stock allocated at regional warehouse.', status: 'done' },
  { title: 'Heavy Equipment Loading', date: 'Jul 14, 09:00 AM', note: 'Loaded onto freight carrier.', status: 'done' },
  { title: 'In Transit to Hub', date: 'Expected Jul 18', note: 'Current stage in progress.', status: 'current' },
  { title: 'Delivered', date: 'Pending', note: 'Awaiting final delivery confirmation.', status: 'pending' },
];

const activity = [
  { time: '2 hours ago', place: 'Houston Logistics City', text: 'Arrived at sorting facility' },
  { time: 'Yesterday', place: 'Dallas Industrial Zone', text: 'Departed from main warehouse' },
  { time: 'Jul 13', place: 'Customs Office', text: 'Shipment documentation verified' },
  { time: 'Jul 12', place: 'Apex Hub', text: 'Order confirmed and ready' },
];

export default function OrderTracking() {
  const [orderId, setOrderId] = useState('APX-842291');
  const [tracked, setTracked] = useState(true);

  return (
    <div className="ot-page">
      <section className="page-hero">
        <div className="container">
          <Breadcrumb items={[{ label: 'Order Tracking' }]} />
          <h1>Order Tracking</h1>
          <p>Real-time updates on your industrial equipment shipments.</p>
        </div>
      </section>

      <section className="section">
        <div className="container ot-layout">
          <div className="card ot-search">
            <h3><Icon name="search" size={18} /> Track Your Shipment</h3>
            <form onSubmit={(e) => { e.preventDefault(); setTracked(true); }}>
              <div className="field">
                <label>Order ID (e.g. APX-98765)</label>
                <input value={orderId} onChange={(e) => setOrderId(e.target.value)} />
              </div>
              <div className="field">
                <label>Email Address</label>
                <input type="email" placeholder="email@company.com" />
              </div>
              <button type="submit" className="btn btn-primary btn-block">Track Shipment</button>
            </form>
            <p className="ot-secure"><Icon name="shield" size={14} /> Enterprise data encryption active. Your shipment info is protected.</p>

            <div className="ot-help">
              <strong>Need Assistance?</strong>
              <p>Our logistics team is available 24/7 for enterprise support.</p>
              <a href="/contact" className="btn btn-outline btn-block">Contact Support</a>
            </div>
          </div>

          {tracked && (
            <div className="ot-status card">
              <div className="ot-status-header">
                <div>
                  <strong>Tracking Status</strong>
                  <span>ID: {orderId}</span>
                </div>
                <span className="badge badge-navy">In Transit</span>
              </div>
              <ProgressBar steps={['Order Placed', 'Processing', 'Shipped', 'Delivered']} activeIndex={2} />
              <div className="ot-details">
                <div><span>Estimated Delivery</span><strong>Jul 24, 2026</strong></div>
                <div><span>Ship To</span><strong>Industrial City 1, Jebel Ali</strong></div>
                <div><span>Carrier</span><strong>Apex Global Logix</strong></div>
              </div>

              <div className="ot-columns">
                <div>
                  <h3>Milestones</h3>
                  <Timeline milestones={milestones} />
                </div>
                <div>
                  <h3>Recent Activity</h3>
                  <ul className="ot-activity">
                    {activity.map((a, i) => (
                      <li key={i}>
                        <span className="ot-activity-time">{a.time}</span>
                        <strong>{a.text}</strong>
                        <span className="ot-activity-place"><Icon name="location" size={13} /> {a.place}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
