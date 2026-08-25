import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import ProductCard from '../components/ProductCard';
import { searchProducts, getFeaturedProducts } from '../data/products';
import './SearchResults.css';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [sort, setSort] = useState('relevance');

  const results = useMemo(() => {
    let list = searchProducts(query);
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [query, sort]);

  const suggestions = getFeaturedProducts(5);

  return (
    <div className="section">
      <div className="container">
        <Breadcrumb items={[{ label: 'Search' }]} />
        <h1 className="search-title">Results for &ldquo;{query}&rdquo;</h1>
        <div className="search-toolbar">
          <span>Showing {results.length} item{results.length !== 1 ? 's' : ''}</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="relevance">Relevance</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {results.length === 0 ? (
          <div className="search-empty">
            <p>No products matched &ldquo;{query}&rdquo;. Try a different term or browse our categories.</p>
          </div>
        ) : (
          <div className="grid-4">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="search-suggestions">
          <h2 className="section-heading">You May Also Need</h2>
          <div className="grid-4">
            {suggestions.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
