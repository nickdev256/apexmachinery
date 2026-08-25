import Icon from '../Icon';

export default function AdminStatCard({
  label,
  value,
  change,
  up = true,
  icon
}) {
  return (
    <div className="card admin-stat">

      <div className="admin-stat-top">

        <div className="admin-stat-icon">
          <Icon name={icon} size={18} />
        </div>

        <span
          className={
            up
              ? 'admin-up'
              : 'admin-down'
          }
        >
          {change}
        </span>

      </div>

      <strong>{value}</strong>

      <span className="admin-stat-label">
        {label}
      </span>

    </div>
  );
}