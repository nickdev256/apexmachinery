import { Link } from 'react-router-dom';
import Icon from './Icon';
import './InfoCards.css';

export function StatCard({ value, label }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export function FeatureCard({ icon, title, text }) {
  return (
    <div className="feature-card card">
      <div className="feature-icon"><Icon name={icon} size={26} /></div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export function CategoryCard({ id, name, image }) {
  return (
    <Link to={`/shop?category=${id}`} className="category-card">
      <div className="category-card-media">
        <img src={image} alt={name} loading="lazy" />
      </div>
      <div className="category-card-label">
        <span>{name}</span>
        <Icon name="arrowRight" size={16} />
      </div>
    </Link>
  );
}

export function BrandCard({ brand }) {
  return (
    <div className="brand-card card">
      <div className="brand-card-top">
        <div>
          <span className="eyebrow">{brand.tagline}</span>
          <h3>{brand.name}</h3>
        </div>
        <span className="stars">★ {brand.rating}</span>
      </div>
      <p className="brand-card-desc">{brand.description}</p>
      <div className="brand-card-stats">
        <div><strong>{brand.products}+</strong><span>Products</span></div>
        <div><strong>{brand.established}</strong><span>Established</span></div>
        <div className="brand-verified"><Icon name="shield" size={16} /><span>Verified</span></div>
      </div>
      <div className="brand-card-tags">
        {brand.tags.map((t) => <span key={t} className="badge badge-navy">{t}</span>)}
      </div>
      <Link to={`/shop?brand=${brand.id}`} className="btn btn-primary btn-block">
        View Catalog <Icon name="arrowRight" size={16} />
      </Link>
    </div>
  );
}
