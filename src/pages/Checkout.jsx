import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import Icon from '../components/Icon';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/format';
import './Checkout.css';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const [delivery, setDelivery] = useState('standard');
  const [payment, setPayment] = useState('card');
  const [placed, setPlaced] = useState(false);
  const navigate = useNavigate();

  const shippingCost = delivery === 'express' ? 250 : 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shippingCost + tax;

  function handleSubmit(e) {
    e.preventDefault();
    setPlaced(true);
    clearCart();
  }

  if (placed) {
    return (
      <div className="section">
        <div className="container checkout-confirm">
          <Icon name="check" size={48} />
          <h1>Order Confirmed</h1>
          <p>Your procurement order has been placed. A confirmation and invoice have been sent to your email, and our logistics team will begin processing shipment.</p>
          <div className="checkout-confirm-actions">
            <button className="btn btn-primary" onClick={() => navigate('/order-tracking')}>Track Your Order</button>
            <button className="btn btn-outline-navy" onClick={() => navigate('/shop')}>Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <Breadcrumb items={[{ to: '/cart', label: 'Cart' }, { label: 'Checkout' }]} />
        <h1 className="checkout-title">Secure Checkout</h1>

        <form className="checkout-layout" onSubmit={handleSubmit}>
          <div className="checkout-main">
            <section className="checkout-step">
              <h2><span className="checkout-step-num">1</span> Shipping Information</h2>
              <div className="form-row">
                <div className="field"><label>First Name</label><input required placeholder="Enter first name" /></div>
                <div className="field"><label>Last Name</label><input required placeholder="Enter last name" /></div>
              </div>
              <div className="field"><label>Email Address</label><input required type="email" placeholder="you@company.com" /></div>
              <div className="field"><label>Phone Number</label><input required placeholder="+1 XXX XXX XXXX" /></div>
              <div className="field"><label>Street Address</label><input required placeholder="Street address" /></div>
              <div className="form-row">
                <div className="field"><label>City</label><input required placeholder="City" /></div>
                <div className="field"><label>Country</label><input required placeholder="Country" /></div>
              </div>
            </section>

            <section className="checkout-step">
              <h2><span className="checkout-step-num">2</span> Delivery Method</h2>
              <div className="checkout-options">
                <label className={`checkout-option ${delivery === 'standard' ? 'selected' : ''}`}>
                  <input type="radio" name="delivery" checked={delivery === 'standard'} onChange={() => setDelivery('standard')} />
                  <div><strong>Standard Delivery</strong><span>3–5 Business Days</span></div>
                  <span className="checkout-option-price">Free</span>
                </label>
                <label className={`checkout-option ${delivery === 'express' ? 'selected' : ''}`}>
                  <input type="radio" name="delivery" checked={delivery === 'express'} onChange={() => setDelivery('express')} />
                  <div><strong>Express Logistics</strong><span>Next Day (Industrial)</span></div>
                  <span className="checkout-option-price">$250</span>
                </label>
              </div>
            </section>

            <section className="checkout-step">
              <h2><span className="checkout-step-num">3</span> Payment Selection</h2>
              <div className="checkout-payment-tabs">
                <button type="button" className={payment === 'card' ? 'active' : ''} onClick={() => setPayment('card')}>International Card</button>
                <button type="button" className={payment === 'invoice' ? 'active' : ''} onClick={() => setPayment('invoice')}>Enterprise Invoice</button>
              </div>
              <p className="checkout-ssl"><Icon name="shield" size={16} /> Your transaction is secured with 256-bit SSL encryption.</p>
              {payment === 'card' ? (
                <>
                  <div className="field"><label>Cardholder Name</label><input required placeholder="Full name as on card" /></div>
                  <div className="field"><label>Card Number</label><input required placeholder="0000 0000 0000 0000" /></div>
                  <div className="form-row">
                    <div className="field"><label>Expiry Date</label><input required placeholder="MM / YY" /></div>
                    <div className="field"><label>CVV</label><input required placeholder="123" /></div>
                  </div>
                </>
              ) : (
                <div className="field"><label>Purchase Order Number</label><input placeholder="PO-2026-XXXX" /></div>
              )}
            </section>
          </div>

          <aside className="checkout-summary card">
            <h3>Order Summary</h3>
            {items.map((item) => (
              <div key={item.id} className="checkout-summary-item">
                <img src={item.image} alt={item.name} />
                <div>
                  <strong>{item.name}</strong>
                  <span>Qty: {item.qty}</span>
                </div>
                <span>{formatCurrency(item.price * item.qty)}</span>
              </div>
            ))}
            <div className="cart-summary-row"><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
            <div className="cart-summary-row"><span>Shipping</span><strong>{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}</strong></div>
            <div className="cart-summary-row"><span>Tax</span><strong>{formatCurrency(tax)}</strong></div>
            <div className="cart-summary-total"><span>Total</span><strong>{formatCurrency(total)}</strong></div>
            <button type="submit" className="btn btn-primary btn-block" disabled={items.length === 0}>
              Complete Secure Payment
            </button>
          </aside>
        </form>
      </div>
    </div>
  );
}
