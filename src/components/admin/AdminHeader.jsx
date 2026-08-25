import Icon from '../Icon';
import './AdminLayout.css';

export default function AdminHeader({
  title,
  description,
  onNew
}) {
  return (
    <div className="admin-header">

      <div>
        <span className="eyebrow">
          Apex Machinery
        </span>

        <h1>{title}</h1>

        <p>{description}</p>
      </div>

      {onNew && (
        <button
          type="button"
          className="btn btn-primary"
          onClick={onNew}
        >
          <Icon name="plus" size={16} />
          New
        </button>
      )}

    </div>
  );
}