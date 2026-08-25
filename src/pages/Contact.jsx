import { useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import Icon from '../components/Icon';
import './Contact.css';

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div className="contact-page">
      <section className="page-hero">
        <div className="container">
          <Breadcrumb items={[{ label: 'Contact' }]} />
          <h1>Contact Our Expert Team</h1>
          <p>Connecting industrial professionals with premium machinery and world-class procurement support.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">Direct Channels</span>
          <h2 className="section-heading">Reach the Right Department</h2>
          <div className="grid-3">
            <div className="contact-channel card">
              <Icon name="phone" size={22} />
              <div>
                <strong>Hotline</strong>
                <p>+1 (713) 555-0142</p>
                <span>Toll-free in the US</span>
              </div>
            </div>
            <div className="contact-channel card">
              <Icon name="mail" size={22} />
              <div>
                <strong>Email</strong>
                <p>support@apexmachinery.com</p>
                <span>Average 4h response time</span>
              </div>
            </div>
            <div className="contact-channel card">
              <Icon name="clock" size={22} />
              <div>
                <strong>Business Hours</strong>
                <p>Mon–Fri: 8AM – 6PM</p>
                <span>CST Timezone</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="container contact-form-grid">
          <div className="card contact-form-card">
            {sent ? (
              <div className="contact-sent">
                <Icon name="check" size={40} />
                <h3>Ticket Submitted</h3>
                <p>Our team will respond within one business day.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                <h3>Support Request</h3>
                <div className="form-row">
                  <div className="field"><label>First Name</label><input required placeholder="John" /></div>
                  <div className="field"><label>Last Name</label><input required placeholder="Doe" /></div>
                </div>
                <div className="field"><label>Work Email</label><input required type="email" placeholder="you@enterprise.com" /></div>
                <div className="field"><label>How can we help?</label><textarea rows="4" required placeholder="Describe your technical issue or request..." /></div>
                <button type="submit" className="btn btn-primary btn-block">Submit Ticket</button>
              </form>
            )}
          </div>

          <div className="contact-enterprise">
            <h3>Enterprise Inquiries</h3>
            <p>For bulk orders exceeding $50,000 or ongoing supply contracts, specify your procurement volume for specialized pricing.</p>
            <div className="contact-enterprise-item">
              <Icon name="mail" size={18} />
              <div><strong>Live Chat Available</strong><span>Online: 9:00 – 17:00 CST</span></div>
            </div>
            <div className="contact-enterprise-item">
              <Icon name="location" size={18} />
              <div><strong>Logistics Hub</strong><span>Industrial Zone 4, Houston, TX</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="badge badge-navy">Headquarters</span>
          <h2 className="section-heading" style={{ marginTop: 12 }}>Houston Operations Center</h2>
          <div className="contact-map">
            <Icon name="location" size={30} />
            <span>Interactive Regional Map</span>
          </div>
        </div>
      </section>
    </div>
  );
}
