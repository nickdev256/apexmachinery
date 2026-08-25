import Icon from './Icon';
import './Filters.css';

export default function Filters({
  categories,
  brands,
  selectedCategories,
  selectedBrands,
  availability,
  priceRange,
  maxPrice,
  onToggleCategory,
  onToggleBrand,
  onToggleAvailability,
  onPriceChange,
  onClear,
}) {
  return (
    <aside className="filters card">
      <div className="filters-header">
        <span><Icon name="menu" size={16} /> Filters</span>
        <button onClick={onClear} className="filters-clear">Clear All</button>
      </div>

      <div className="filters-group">
        <h4>Category</h4>
        {categories.map((c) => (
          <label key={c.id} className="filters-checkbox">
            <input
              type="checkbox"
              checked={selectedCategories.includes(c.id)}
              onChange={() => onToggleCategory(c.id)}
            />
            {c.name}
          </label>
        ))}
      </div>

      <div className="filters-group">
        <h4>Brand</h4>
        {brands.map((b) => (
          <label key={b} className="filters-checkbox">
            <input
              type="checkbox"
              checked={selectedBrands.includes(b)}
              onChange={() => onToggleBrand(b)}
            />
            {b}
          </label>
        ))}
      </div>

      <div className="filters-group">
        <h4>Availability</h4>
        {['In Stock', 'Limited', 'Out of Stock'].map((a) => (
          <label key={a} className="filters-checkbox">
            <input
              type="checkbox"
              checked={availability.includes(a)}
              onChange={() => onToggleAvailability(a)}
            />
            {a}
          </label>
        ))}
      </div>

      <div className="filters-group">
        <h4>Price Range</h4>
        <input
          type="range"
          min={0}
          max={maxPrice}
          value={priceRange}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="filters-range"
        />
        <div className="filters-range-value">Up to ${priceRange.toLocaleString()}</div>
      </div>

      <div className="filters-promo">
        <Icon name="bolt" size={22} />
        <strong>Urgent Procurement?</strong>
        <p>Our technical advisors are available 24/7 for custom industrial quotes.</p>
        <a href="/contact" className="btn btn-gold btn-sm btn-block">Speak to an Expert</a>
      </div>
    </aside>
  );
}
