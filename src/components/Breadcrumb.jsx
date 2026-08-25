import { Link } from 'react-router-dom';
import Icon from './Icon';

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      {items.map((item, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon name="chevronRight" size={14} className="sep" />
          {item.to ? <Link to={item.to}>{item.label}</Link> : <span className="current">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
