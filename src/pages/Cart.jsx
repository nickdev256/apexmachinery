import { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import Icon from '../components/Icon';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { getFeaturedProducts } from '../data/products';
import { formatCurrency } from '../utils/format';
import './Cart.css';

export default function Cart() {
  const { items, updateQty, removeFromCart, subtotal } = useCart();
  const [promo, setPromo] = useState('');
  const [promoMsg, setPromoMsg] = useState('');

  const tax = Math.round(subtotal * 0.08);
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 250;
  const total = subtotal + tax + shipping;
  const recommended = getFeaturedProducts(4);

  function applyPromo(e) {
    e.preventDefault();
    setPromoMsg(promo.trim() ? 'Promo code applied to enterprise accounts at checkout.' : '');
  }

  return (
    <div className="section">
      <div className="container">
        <Breadcrumb items={[{ label: 'Cart' }]} />
        <h1 className="cart-title">Shopping Cart</h1>
        <p className="cart-count">({items.length} item{items.length !== 1 ? 's' : ''})</p>

        {items.length === 0 ? (
          <div className="cart-empty">
            <Icon name="cart" size={40} />
            <h3>Your cart is empty</h3>
            <p>Browse the catalog to add industrial equipment and tools.</p>
            <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.id} className="cart-item card">
                  <div className="cart-item-media">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item-body">
                    <span className="eyebrow">{item.category}</span>
                    <Link to={`/product/${item.id}`} className="cart-item-name">{item.name}</Link>
                    <span className="cart-item-sku">Brand: {item.brand}</span>
                  </div>
                  <div className="cart-item-qty">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} aria-label="Decrease"><Icon name="minus" size={14} /></button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} aria-label="Increase"><Icon name="plus" size={14} /></button>
                  </div>
                  <div className="cart-item-price">
                    <span className="cart-item-unit">Unit Price</span>
                    {formatCurrency(item.price)}
                  </div>
                  <button className="cart-item-remove" onClick={() => removeFromCart(item.id)} aria-label="Remove item">
                    <Icon name="trash" size={18} />
                  </button>
                </div>
              ))}

              <div className="cart-trust">
                <div className="card cart-trust-card">
                  <Icon name="truck" size={22} />
                  <div>
                    <strong>Reliable Logistics</strong>
                    <p>Fast, insured shipping for heavy machinery nationwide.</p>
                  </div>
                </div>
                <div className="card cart-trust-card">
                  <Icon name="shield" size={22} />
                  <div>
                    <strong>Buyer Protection</strong>
                    <p>Secure, encrypted transactions for every procurement order.</p>
                  </div>
                </div>
              </div>
            </div>

            <aside className="cart-summary card">
              <h3><Icon name="package" size={18} /> Order Summary</h3>
              <div className="cart-summary-row"><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
              <div className="cart-summary-row"><span>Tax (8%)</span><strong>{formatCurrency(tax)}</strong></div>
              <div className="cart-summary-row"><span>Shipping</span><strong>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</strong></div>
              <div className="cart-summary-total"><span>Grand Total</span><strong>{formatCurrency(total)}</strong></div>

              <form className="cart-promo" onSubmit={applyPromo}>
                <label>Have a promo code?</label>
                <div className="cart-promo-row">
                  <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="PROMO2026" />
                  <button type="submit" className="btn btn-outline-navy btn-sm">Apply</button>
                </div>
                {promoMsg && <p className="cart-promo-msg">{promoMsg}</p>}
              </form>

              <Link to="/checkout" className="btn btn-primary btn-block">
                Proceed to Checkout <Icon name="arrowRight" size={16} />
              </Link>
              <Link to="/shop" className="cart-continue">Continue Shopping</Link>

              <div className="cart-enterprise">
                <Icon name="package" size={16} />
                <p>Buying for an organization? Convert this cart to a formal RFQ in the checkout panel.</p>
              </div>
            </aside>
          </div>
        )}

        {items.length > 0 && (
          <section className="cart-recommended">
            <h2 className="section-heading">Recommended for You</h2>
            <div className="grid-4">
              {recommended.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
