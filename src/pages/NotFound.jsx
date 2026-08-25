import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="container notfound-inner">
        <span className="notfound-code">404</span>
        <h1>Page Not Found</h1>
        <p>The page you're looking for may have been moved, removed, or doesn't exist. Let's get you back on track.</p>
        <div className="notfound-actions">
          <Link to="/" className="btn btn-primary"><Icon name="arrowRight" size={16} style={{ transform: 'rotate(180deg)' }} /> Back to Home</Link>
          <Link to="/shop" className="btn btn-outline-navy">Browse Catalog</Link>
        </div>
      </div>
    </div>
  );
}
