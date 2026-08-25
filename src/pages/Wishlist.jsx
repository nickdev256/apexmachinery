import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import Icon from '../components/Icon';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/format';
import './Wishlist.css';

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  function moveAllToCart() {
    items.forEach((p) => addToCart(p));
  }

  return (
    <div className="section">
      <div className="container">
        <Breadcrumb items={[{ label: 'My Wishlist' }]} />
        <div className="wishlist-header">
          <div>
            <h1>Your Procurement Wishlist</h1>
            <p>Manage your planned industrial acquisitions and move items to your cart when ready.</p>
          </div>
          {items.length > 0 && (
            <button className="btn btn-primary" onClick={moveAllToCart}>
              <Icon name="cart" size={16} /> Move All to Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="wishlist-empty">
            <Icon name="heart" size={40} />
            <h3>Your wishlist is empty</h3>
            <p>Save industrial equipment here to review or request quotes later.</p>
            <Link to="/shop" className="btn btn-primary">Browse Catalog</Link>
          </div>
        ) : (
          <div className="grid-4 wishlist-grid">
            {items.map((p) => (
              <div key={p.id} className="wishlist-card card">
                <button className="wishlist-remove" onClick={() => removeFromWishlist(p.id)} aria-label="Remove">
                  <Icon name="trash" size={16} />
                </button>
                <div className="wishlist-card-media">
                  <img src={p.images ? p.images[0] : p.image} alt={p.name} />
                </div>
                <div className="wishlist-card-body">
                  <span className="eyebrow">{p.categoryName || p.category}</span>
                  <h4>{p.name}</h4>
                  <div className="wishlist-price">{formatCurrency(p.price)}</div>
                  <button className="btn btn-primary btn-block btn-sm" onClick={() => addToCart(p)}>Add to Cart</button>
                  <Link to={`/product/${p.id}`} className="btn btn-outline-navy btn-block btn-sm">View Details</Link>
                </div>
              </div>
            ))}

            <Link to="/shop" className="wishlist-add-tile">
              <Icon name="plus" size={24} />
              <strong>Add More Products</strong>
              <span>Browse our catalog to add more industrial equipment.</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
