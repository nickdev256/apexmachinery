import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import { products as initialProducts } from '../../data/products';
import './AdminProducts.css';


// ============================================================
// ADMIN PRODUCTS
// ============================================================

export default function AdminProducts() {
  const navigate = useNavigate();

  // ==========================================================
  // PRODUCTS
  // ==========================================================

  const [productList, setProductList] =
    useState(
      initialProducts.map((product) => ({
        ...product,
        stock: Number(product.stock || 0),
        status:
          Number(product.stock || 0) > 0
            ? 'In Stock'
            : 'Out of Stock',
      }))
    );

  // ==========================================================
  // FILTERS
  // ==========================================================

  const [search, setSearch] =
    useState('');

  const [category, setCategory] =
    useState('all');

  const [statusFilter, setStatusFilter] =
    useState('all');

  // ==========================================================
  // MODALS
  // ==========================================================

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [showProductModal, setShowProductModal] =
    useState(false);

  const [showAddModal, setShowAddModal] =
    useState(false);

  // ==========================================================
  // FORM
  // ==========================================================

  const [form, setForm] = useState({
    name: '',
    category: '',
    categoryName: '',
    brand: '',
    price: '',
    stock: 0,
    status: 'In Stock',
    description: '',
  });

  // ==========================================================
  // CATEGORIES
  // ==========================================================

  const categories = useMemo(() => {
    const map = new Map();

    productList.forEach((product) => {
      if (!product.category) {
        return;
      }

      map.set(
        product.category,
        product.categoryName ||
          product.category
      );
    });

    return Array.from(
      map.entries()
    );
  }, [productList]);

  // ==========================================================
  // FILTER PRODUCTS
  // ==========================================================

  const filteredProducts = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return productList.filter(
      (product) => {
        const name =
          String(
            product.name || ''
          ).toLowerCase();

        const categoryName =
          String(
            product.categoryName || ''
          ).toLowerCase();

        const brand =
          String(
            product.brand || ''
          ).toLowerCase();

        const id =
          String(
            product.id || ''
          ).toLowerCase();

        const matchesSearch =
          !query ||
          name.includes(query) ||
          categoryName.includes(query) ||
          brand.includes(query) ||
          id.includes(query);

        const matchesCategory =
          category === 'all' ||
          product.category === category;

        const matchesStatus =
          statusFilter === 'all' ||
          product.status === statusFilter;

        return (
          matchesSearch &&
          matchesCategory &&
          matchesStatus
        );
      }
    );
  }, [
    productList,
    search,
    category,
    statusFilter,
  ]);

  // ==========================================================
  // STATISTICS
  // ==========================================================

  const totalProducts =
    productList.length;

  const inStock =
    productList.filter(
      (product) =>
        product.status === 'In Stock'
    ).length;

  const outOfStock =
    productList.filter(
      (product) =>
        product.status === 'Out of Stock'
    ).length;

  const totalUnits =
    productList.reduce(
      (total, product) =>
        total +
        Number(product.stock || 0),
      0
    );

  // ==========================================================
  // FORMAT CURRENCY
  // ==========================================================

  const formatCurrency = (value) => {
    return `UGX ${Number(
      value || 0
    ).toLocaleString()}`;
  };

  // ==========================================================
  // OPEN ADD PRODUCT
  // ==========================================================

  const handleAddProduct = () => {
    setEditingProduct(null);

    setForm({
      name: '',
      category:
        categories[0]?.[0] || '',
      categoryName:
        categories[0]?.[1] || '',
      brand: '',
      price: '',
      stock: 0,
      status: 'Out of Stock',
      description: '',
    });

    setShowAddModal(true);
  };

  // ==========================================================
  // OPEN EDIT PRODUCT
  // ==========================================================

  const handleEdit = (product) => {
    setEditingProduct(product);

    setForm({
      name: product.name || '',
      category:
        product.category || '',
      categoryName:
        product.categoryName || '',
      brand:
        product.brand || '',
      price:
        product.price || '',
      stock:
        Number(product.stock || 0),
      status:
        Number(product.stock || 0) > 0
          ? 'In Stock'
          : 'Out of Stock',
      description:
        product.description || '',
    });

    setShowProductModal(true);
  };

  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================================
  // STOCK CHANGE
  // ==========================================================

  const handleStockChange = (event) => {
    const value =
      Number(event.target.value);

    setForm((previous) => ({
      ...previous,
      stock:
        value < 0 ? 0 : value,
      status:
        value > 0
          ? 'In Stock'
          : 'Out of Stock',
    }));
  };

  // ==========================================================
  // STATUS CHANGE
  // ==========================================================

  const handleStatusChange = (event) => {
    const value =
      event.target.value;

    setForm((previous) => ({
      ...previous,
      status: value,
      stock:
        value === 'Out of Stock'
          ? 0
          : Math.max(
              Number(previous.stock || 0),
              1
            ),
    }));
  };

  // ==========================================================
  // SAVE PRODUCT
  // ==========================================================

  const handleSaveProduct = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      window.alert(
        'Product name is required.'
      );

      return;
    }

    const stock =
      form.status === 'Out of Stock'
        ? 0
        : Number(form.stock || 0);

    // --------------------------------------------------------
    // EDIT
    // --------------------------------------------------------

    if (editingProduct) {
      setProductList((previous) =>
        previous.map((product) =>
          product.id ===
          editingProduct.id
            ? {
                ...product,

                name:
                  form.name.trim(),

                category:
                  form.category,

                categoryName:
                  form.categoryName,

                brand:
                  form.brand.trim(),

                price:
                  Number(form.price || 0),

                priceDisplay:
                  formatCurrency(
                    form.price
                  ),

                stock,

                status:
                  stock > 0
                    ? 'In Stock'
                    : 'Out of Stock',

                description:
                  form.description.trim(),
              }
            : product
        )
      );

      setSelectedProduct(null);
      setShowProductModal(false);
      setEditingProduct(null);

      return;
    }

    // --------------------------------------------------------
    // CREATE
    // --------------------------------------------------------

    const newId =
      `APX-${Date.now()}`;

    const newProduct = {
      id: newId,

      name:
        form.name.trim(),

      category:
        form.category,

      categoryName:
        form.categoryName,

      brand:
        form.brand.trim(),

      price:
        Number(form.price || 0),

      priceDisplay:
        formatCurrency(
          form.price
        ),

      stock,

      status:
        stock > 0
          ? 'In Stock'
          : 'Out of Stock',

      description:
        form.description.trim(),

      image: '',
    };

    setProductList((previous) => [
      newProduct,
      ...previous,
    ]);

    setShowAddModal(false);

    resetForm();
  };

  // ==========================================================
  // RESET FORM
  // ==========================================================

  const resetForm = () => {
    setForm({
      name: '',
      category: '',
      categoryName: '',
      brand: '',
      price: '',
      stock: 0,
      status: 'Out of Stock',
      description: '',
    });

    setEditingProduct(null);
  };

  // ==========================================================
  // DELETE PRODUCT
  // ==========================================================

  const handleDelete = (product) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${product.name}"?`
      );

    if (!confirmed) {
      return;
    }

    setProductList((previous) =>
      previous.filter(
        (item) =>
          item.id !== product.id
      )
    );

    setSelectedProduct(null);
  };

  // ==========================================================
  // TOGGLE STOCK
  // ==========================================================

  const toggleStock = (product) => {
    const newStatus =
      product.status === 'In Stock'
        ? 'Out of Stock'
        : 'In Stock';

    setProductList((previous) =>
      previous.map((item) =>
        item.id === product.id
          ? {
              ...item,

              status:
                newStatus,

              stock:
                newStatus ===
                'Out of Stock'
                  ? 0
                  : Math.max(
                      Number(
                        item.stock || 0
                      ),
                      1
                    ),
            }
          : item
      )
    );

    setSelectedProduct(
      (previous) =>
        previous &&
        previous.id === product.id
          ? {
              ...previous,

              status:
                newStatus,

              stock:
                newStatus ===
                'Out of Stock'
                  ? 0
                  : Math.max(
                      Number(
                        previous.stock ||
                          0
                      ),
                      1
                    ),
            }
          : previous
    );
  };

  // ==========================================================
  // CLOSE MODALS
  // ==========================================================

  const closeEditModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
    resetForm();
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    resetForm();
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="admin-products-page">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="admin-page-header">

        <div>

          {/* BACK BUTTON */}

          <button
            type="button"
            className="admin-back-button"
            onClick={() =>
              navigate('/admin')
            }
          >
            <Icon
              name="arrow-left"
              size={17}
            />

            Back to Dashboard
          </button>

          <span className="eyebrow">
            Apex Machinery
          </span>

          <h1>
            Products
          </h1>

          <p>
            Manage your machinery,
            equipment and product
            catalogue.
          </p>

        </div>

        <button
          className="btn btn-primary"
          type="button"
          onClick={
            handleAddProduct
          }
        >

          <Icon
            name="plus"
            size={16}
          />

          Add Product

        </button>

      </div>

      {/* ====================================================
          STATISTICS
      ==================================================== */}

      <div className="admin-products-stats">

        <div className="card admin-product-stat">

          <div className="admin-product-stat-icon">
            <Icon
              name="tool"
              size={20}
            />
          </div>

          <div>
            <strong>
              {totalProducts}
            </strong>

            <span>
              Total Products
            </span>
          </div>

        </div>

        <div className="card admin-product-stat">

          <div className="admin-product-stat-icon">
            <Icon
              name="check"
              size={20}
            />
          </div>

          <div>
            <strong>
              {inStock}
            </strong>

            <span>
              In Stock
            </span>
          </div>

        </div>

        <div className="card admin-product-stat">

          <div className="admin-product-stat-icon">
            <Icon
              name="clock"
              size={20}
            />
          </div>

          <div>
            <strong>
              {outOfStock}
            </strong>

            <span>
              Out of Stock
            </span>
          </div>

        </div>

        <div className="card admin-product-stat">

          <div className="admin-product-stat-icon">
            <Icon
              name="package"
              size={20}
            />
          </div>

          <div>
            <strong>
              {totalUnits.toLocaleString()}
            </strong>

            <span>
              Units Available
            </span>
          </div>

        </div>

      </div>

      {/* ====================================================
          FILTERS
      ==================================================== */}

      <div className="card admin-products-toolbar">

        <div className="admin-products-search">

          <Icon
            name="search"
            size={18}
          />

          <input
            type="search"
            placeholder="Search products, brands or IDs..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

          {search && (
            <button
              type="button"
              className="admin-search-clear"
              onClick={() =>
                setSearch('')
              }
            >
              ×
            </button>
          )}

        </div>

        <select
          value={category}
          onChange={(event) =>
            setCategory(
              event.target.value
            )
          }
        >

          <option value="all">
            All Categories
          </option>

          {categories.map(
            ([id, name]) => (

              <option
                key={id}
                value={id}
              >
                {name}
              </option>

            )
          )}

        </select>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
        >

          <option value="all">
            All Stock Status
          </option>

          <option value="In Stock">
            In Stock
          </option>

          <option value="Out of Stock">
            Out of Stock
          </option>

        </select>

        <span className="admin-products-count">
          {filteredProducts.length}{' '}
          Products
        </span>

      </div>

      {/* ====================================================
          PRODUCT TABLE
      ==================================================== */}

      <div className="card admin-products-table-card">

        <div className="admin-table-wrapper">

          <table className="dashboard-table">

            <thead>

              <tr>

                <th>
                  Product
                </th>

                <th>
                  Category
                </th>

                <th>
                  Price
                </th>

                <th>
                  Stock
                </th>

                <th>
                  Status
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredProducts.length ===
              0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="admin-empty"
                  >

                    <Icon
                      name="search"
                      size={30}
                    />

                    <strong>
                      No products found
                    </strong>

                    <span>
                      Try changing your
                      search or filters.
                    </span>

                  </td>

                </tr>

              ) : (

                filteredProducts.map(
                  (product) => (

                    <tr
                      key={product.id}
                    >

                      {/* PRODUCT */}

                      <td>

                        <div className="admin-product-cell">

                          <div className="admin-product-image">

                            {product.image ? (

                              <img
                                src={
                                  product.image
                                }
                                alt={
                                  product.name
                                }
                              />

                            ) : (

                              <Icon
                                name="tool"
                                size={23}
                              />

                            )}

                          </div>

                          <div>

                            <strong>
                              {product.name}
                            </strong>

                            <small>
                              ID: {product.id}
                            </small>

                            {product.brand && (
                              <small>
                                {product.brand}
                              </small>
                            )}

                          </div>

                        </div>

                      </td>

                      {/* CATEGORY */}

                      <td>
                        {product.categoryName ||
                          'Uncategorized'}
                      </td>

                      {/* PRICE */}

                      <td>
                        <strong>
                          {product.priceDisplay ||
                            formatCurrency(
                              product.price
                            )}
                        </strong>
                      </td>

                      {/* STOCK */}

                      <td>

                        <strong>
                          {Number(
                            product.stock ||
                              0
                          )}
                        </strong>

                        <small>
                          {' '}units
                        </small>

                      </td>

                      {/* STATUS */}

                      <td>

                        <button
                          type="button"
                          className={`product-stock-status ${
                            product.status ===
                            'In Stock'
                              ? 'in-stock'
                              : 'out-of-stock'
                          }`}
                          onClick={() =>
                            toggleStock(
                              product
                            )
                          }
                          title="Click to change stock status"
                        >

                          <span />

                          {product.status}

                        </button>

                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div className="admin-product-actions">

                          <button
                            type="button"
                            title="View product"
                            onClick={() =>
                              setSelectedProduct(
                                product
                              )
                            }
                          >

                            <Icon
                              name="eye"
                              size={16}
                            />

                          </button>

                          <button
                            type="button"
                            title="Edit product"
                            onClick={() =>
                              handleEdit(
                                product
                              )
                            }
                          >

                            <Icon
                              name="edit"
                              size={16}
                            />

                          </button>

                          <button
                            type="button"
                            title="Delete product"
                            className="danger"
                            onClick={() =>
                              handleDelete(
                                product
                              )
                            }
                          >

                            <Icon
                              name="trash"
                              size={16}
                            />

                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ====================================================
          VIEW PRODUCT MODAL
      ==================================================== */}

      {selectedProduct && (

        <div
          className="admin-modal-backdrop"
          onClick={() =>
            setSelectedProduct(null)
          }
        >

          <div
            className="admin-modal product-view-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              className="admin-modal-close"
              type="button"
              onClick={() =>
                setSelectedProduct(null)
              }
            >
              ×
            </button>

            <div className="product-modal-image">

              {selectedProduct.image ? (

                <img
                  src={
                    selectedProduct.image
                  }
                  alt={
                    selectedProduct.name
                  }
                />

              ) : (

                <Icon
                  name="tool"
                  size={45}
                />

              )}

            </div>

            <span className="eyebrow">
              Product Details
            </span>

            <h2>
              {selectedProduct.name}
            </h2>

            <p>
              {selectedProduct.description ||
                'No product description available.'}
            </p>

            <div className="admin-product-details">

              <div>
                <span>
                  Product ID
                </span>

                <strong>
                  {selectedProduct.id}
                </strong>
              </div>

              <div>
                <span>
                  Category
                </span>

                <strong>
                  {selectedProduct.categoryName ||
                    'Uncategorized'}
                </strong>
              </div>

              <div>
                <span>
                  Brand
                </span>

                <strong>
                  {selectedProduct.brand ||
                    'Apex Machinery'}
                </strong>
              </div>

              <div>
                <span>
                  Price
                </span>

                <strong>
                  {selectedProduct.priceDisplay ||
                    formatCurrency(
                      selectedProduct.price
                    )}
                </strong>
              </div>

              <div>
                <span>
                  Stock
                </span>

                <strong>
                  {selectedProduct.stock}
                  {' '}units
                </strong>
              </div>

              <div>
                <span>
                  Status
                </span>

                <strong>
                  {selectedProduct.status}
                </strong>
              </div>

            </div>

            <div className="admin-modal-actions">

              <button
                type="button"
                className="btn btn-outline-navy"
                onClick={() =>
                  setSelectedProduct(null)
                }
              >
                Close
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  handleEdit(
                    selectedProduct
                  )
                }
              >

                <Icon
                  name="edit"
                  size={16}
                />

                Edit Product

              </button>

            </div>

          </div>

        </div>

      )}

      {/* ====================================================
          EDIT PRODUCT MODAL
      ==================================================== */}

      {showProductModal && (

        <div
          className="admin-modal-backdrop"
          onClick={closeEditModal}
        >

          <div
            className="admin-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="admin-modal-header">

              <div>

                <span className="eyebrow">
                  Product Management
                </span>

                <h2>
                  Edit Product
                </h2>

              </div>

              <button
                className="admin-modal-close"
                type="button"
                onClick={closeEditModal}
              >
                ×
              </button>

            </div>

            <form
              className="admin-product-form"
              onSubmit={
                handleSaveProduct
              }
            >

              <div className="field">

                <label>
                  Product Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="admin-form-grid">

                <div className="field">

                  <label>
                    Brand
                  </label>

                  <input
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                  />

                </div>

                <div className="field">

                  <label>
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                  />

                </div>

              </div>

              <div className="field">

                <label>
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={(event) => {
                    const selected =
                      categories.find(
                        ([id]) =>
                          id ===
                          event.target.value
                      );

                    setForm(
                      (previous) => ({
                        ...previous,
                        category:
                          event.target
                            .value,
                        categoryName:
                          selected?.[1] ||
                          previous.categoryName,
                      })
                    );
                  }}
                >

                  {categories.map(
                    ([id, name]) => (

                      <option
                        key={id}
                        value={id}
                      >
                        {name}
                      </option>

                    )
                  )}

                </select>

              </div>

              <div className="admin-form-grid">

                <div className="field">

                  <label>
                    Stock Quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={
                      handleStockChange
                    }
                  />

                </div>

                <div className="field">

                  <label>
                    Stock Status
                  </label>

                  <select
                    value={form.status}
                    onChange={
                      handleStatusChange
                    }
                  >

                    <option value="In Stock">
                      In Stock
                    </option>

                    <option value="Out of Stock">
                      Out of Stock
                    </option>

                  </select>

                </div>

              </div>

              <div className="field">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  rows="5"
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              <div className="admin-modal-actions">

                <button
                  type="button"
                  className="btn btn-outline-navy"
                  onClick={
                    closeEditModal
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                >

                  <Icon
                    name="check"
                    size={16}
                  />

                  Save Product

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ====================================================
          ADD PRODUCT MODAL
      ==================================================== */}

      {showAddModal && (

        <div
          className="admin-modal-backdrop"
          onClick={closeAddModal}
        >

          <div
            className="admin-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="admin-modal-header">

              <div>

                <span className="eyebrow">
                  Product Management
                </span>

                <h2>
                  Add Product
                </h2>

              </div>

              <button
                className="admin-modal-close"
                type="button"
                onClick={closeAddModal}
              >
                ×
              </button>

            </div>

            <form
              className="admin-product-form"
              onSubmit={
                handleSaveProduct
              }
            >

              <div className="field">

                <label>
                  Product Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Industrial Diesel Generator 500 kVA"
                  required
                />

              </div>

              <div className="admin-form-grid">

                <div className="field">

                  <label>
                    Brand
                  </label>

                  <input
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    placeholder="Brand name"
                  />

                </div>

                <div className="field">

                  <label>
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="UGX"
                  />

                </div>

              </div>

              <div className="field">

                <label>
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={(event) => {
                    const selected =
                      categories.find(
                        ([id]) =>
                          id ===
                          event.target.value
                      );

                    setForm(
                      (previous) => ({
                        ...previous,
                        category:
                          event.target
                            .value,
                        categoryName:
                          selected?.[1] ||
                          '',
                      })
                    );
                  }}
                  required
                >

                  <option value="">
                    Select Category
                  </option>

                  {categories.map(
                    ([id, name]) => (

                      <option
                        key={id}
                        value={id}
                      >
                        {name}
                      </option>

                    )
                  )}

                </select>

              </div>

              <div className="admin-form-grid">

                <div className="field">

                  <label>
                    Initial Stock
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={
                      handleStockChange
                    }
                  />

                </div>

                <div className="field">

                  <label>
                    Stock Status
                  </label>

                  <select
                    value={form.status}
                    onChange={
                      handleStatusChange
                    }
                  >

                    <option value="In Stock">
                      In Stock
                    </option>

                    <option value="Out of Stock">
                      Out of Stock
                    </option>

                  </select>

                </div>

              </div>

              <div className="field">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  rows="5"
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Describe the product..."
                />

              </div>

              <div className="admin-modal-actions">

                <button
                  type="button"
                  className="btn btn-outline-navy"
                  onClick={
                    closeAddModal
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                >

                  <Icon
                    name="plus"
                    size={16}
                  />

                  Create Product

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}