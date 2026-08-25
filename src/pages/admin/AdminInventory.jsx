import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import { products } from '../../data/products';
import './AdminInventory.css';

// ============================================================
// ADMIN INVENTORY
// ============================================================

export default function AdminInventory() {
  const navigate = useNavigate();

  // ==========================================================
  // INITIAL INVENTORY
  // ==========================================================

  const [inventory, setInventory] = useState(
    products.map((product) => {
      const stock = Number(product.stock || 0);
      const reorderLevel = Number(product.reorderLevel || 5);

      let stockStatus = product.stockStatus;

      if (!stockStatus) {
        if (stock <= 0) {
          stockStatus = 'Out of Stock';
        } else if (stock <= reorderLevel) {
          stockStatus = 'Low Stock';
        } else {
          stockStatus = 'In Stock';
        }
      }

      return {
        ...product,
        stock,
        reorderLevel,
        stockStatus,
      };
    })
  );

  // ==========================================================
  // STATE
  // ==========================================================

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    stock: 0,
    reorderLevel: 5,
    stockStatus: 'In Stock',
  });

  // ==========================================================
  // CATEGORIES
  // ==========================================================

  const categoryList = useMemo(() => {
    const values = inventory
      .map((product) => product.category)
      .filter(Boolean);

    return [...new Set(values)];
  }, [inventory]);

  // ==========================================================
  // FILTER INVENTORY
  // ==========================================================

  const filteredInventory = useMemo(() => {
    const query = search.trim().toLowerCase();

    return inventory.filter((product) => {
      const name = String(product.name || '').toLowerCase();

      const sku = String(
        product.slug ||
          product.sku ||
          product.id ||
          ''
      ).toLowerCase();

      const brand = String(
        product.brand || ''
      ).toLowerCase();

      const matchesSearch =
        !query ||
        name.includes(query) ||
        sku.includes(query) ||
        brand.includes(query);

      const matchesCategory =
        categoryFilter === 'All' ||
        product.category === categoryFilter;

      let matchesStock = true;

      if (stockFilter === 'In Stock') {
        matchesStock =
          product.stockStatus === 'In Stock';
      }

      if (stockFilter === 'Low Stock') {
        matchesStock =
          product.stockStatus === 'Low Stock';
      }

      if (stockFilter === 'Out of Stock') {
        matchesStock =
          product.stockStatus === 'Out of Stock';
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStock
      );
    });
  }, [
    inventory,
    search,
    categoryFilter,
    stockFilter,
  ]);

  // ==========================================================
  // STATISTICS
  // ==========================================================

  const totalProducts = inventory.length;

  const totalUnits = inventory.reduce(
    (total, product) =>
      total + Number(product.stock || 0),
    0
  );

  const inStock = inventory.filter(
    (product) =>
      product.stockStatus === 'In Stock'
  ).length;

  const lowStock = inventory.filter(
    (product) =>
      product.stockStatus === 'Low Stock'
  ).length;

  const outOfStock = inventory.filter(
    (product) =>
      product.stockStatus === 'Out of Stock'
  ).length;

  // ==========================================================
  // CURRENCY
  // ==========================================================

  const formatCurrency = (value) => {
    return `UGX ${Number(
      value || 0
    ).toLocaleString()}`;
  };

  // ==========================================================
  // OPEN EDIT MODAL
  // ==========================================================

  const handleEdit = (product) => {
    setEditingProduct(product);

    setForm({
      stock: Number(product.stock || 0),
      reorderLevel: Number(
        product.reorderLevel || 5
      ),
      stockStatus:
        product.stockStatus ||
        'In Stock',
    });

    setShowModal(true);
  };

  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================================
  // UPDATE INVENTORY
  // ==========================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!editingProduct) {
      return;
    }

    const stock = Math.max(
      0,
      Number(form.stock || 0)
    );

    const reorderLevel = Math.max(
      0,
      Number(form.reorderLevel || 0)
    );

    let stockStatus = form.stockStatus;

    // If manually marked Out of Stock,
    // force quantity to zero.
    if (stockStatus === 'Out of Stock') {
      setInventory((previous) =>
        previous.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                stock: 0,
                reorderLevel,
                stockStatus: 'Out of Stock',
                status: 'Out of Stock',
              }
            : product
        )
      );
    } else {
      setInventory((previous) =>
        previous.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                stock,
                reorderLevel,
                stockStatus,
                status: stockStatus,
              }
            : product
        )
      );
    }

    closeModal();
  };

  // ==========================================================
  // RESTOCK
  // ==========================================================

  const handleRestock = (product) => {
    const quantity = window.prompt(
      `How many units would you like to add to ${product.name}?`,
      '10'
    );

    if (
      quantity === null ||
      quantity === ''
    ) {
      return;
    }

    const amount = Number(quantity);

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      window.alert(
        'Please enter a valid quantity.'
      );

      return;
    }

    setInventory((previous) =>
      previous.map((item) => {
        if (item.id !== product.id) {
          return item;
        }

        const newStock =
          Number(item.stock || 0) +
          amount;

        let newStatus = item.stockStatus;

        if (
          item.stockStatus ===
          'Out of Stock'
        ) {
          newStatus =
            newStock <=
            Number(item.reorderLevel || 5)
              ? 'Low Stock'
              : 'In Stock';
        }

        return {
          ...item,
          stock: newStock,
          stockStatus: newStatus,
          status: newStatus,
        };
      })
    );
  };

  // ==========================================================
  // QUICK MARK IN STOCK
  // ==========================================================

  const markInStock = (product) => {
    setInventory((previous) =>
      previous.map((item) =>
        item.id === product.id
          ? {
              ...item,
              stock:
                Number(item.stock || 0) > 0
                  ? Number(item.stock)
                  : 1,
              stockStatus: 'In Stock',
              status: 'In Stock',
            }
          : item
      )
    );
  };

  // ==========================================================
  // QUICK MARK LOW STOCK
  // ==========================================================

  const markLowStock = (product) => {
    const reorderLevel = Number(
      product.reorderLevel || 5
    );

    setInventory((previous) =>
      previous.map((item) =>
        item.id === product.id
          ? {
              ...item,
              stock:
                Number(item.stock || 0) >
                reorderLevel
                  ? reorderLevel
                  : Number(item.stock || 1),
              stockStatus: 'Low Stock',
              status: 'Low Stock',
            }
          : item
      )
    );
  };

  // ==========================================================
  // QUICK MARK OUT OF STOCK
  // ==========================================================

  const markOutOfStock = (product) => {
    const confirmed = window.confirm(
      `Mark "${product.name}" as out of stock?`
    );

    if (!confirmed) {
      return;
    }

    setInventory((previous) =>
      previous.map((item) =>
        item.id === product.id
          ? {
              ...item,
              stock: 0,
              stockStatus: 'Out of Stock',
              status: 'Out of Stock',
            }
          : item
      )
    );
  };

  // ==========================================================
  // VIEW PRODUCT
  // ==========================================================

  const handleView = (product) => {
    setSelectedProduct(product);
  };

  // ==========================================================
  // CLOSE EDIT MODAL
  // ==========================================================

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  // ==========================================================
  // CLOSE PRODUCT DETAILS
  // ==========================================================

  const closeProductDetails = () => {
    setSelectedProduct(null);
  };

  // ==========================================================
  // STOCK STATUS CLASS
  // ==========================================================

  const getStockStatusClass = (status) => {
    return String(status || '')
      .toLowerCase()
      .replace(/\s+/g, '-');
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="admin-inventory-page">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="admin-page-header">

        <div className="admin-header-left">

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

            <span>
              Back to Dashboard
            </span>
          </button>

          <span className="eyebrow">
            Inventory Management
          </span>

          <h1>
            Inventory
          </h1>

          <p>
            Monitor stock levels, product
            availability and replenishment.
          </p>

        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            if (inventory.length > 0) {
              handleRestock(
                inventory[0]
              );
            }
          }}
        >
          <Icon
            name="package"
            size={16}
          />

          Restock Inventory
        </button>

      </div>


      {/* ====================================================
          STATISTICS
      ==================================================== */}

      <div className="admin-inventory-stats">

        <div className="card admin-inventory-stat">

          <div className="admin-inventory-stat-icon">
            <Icon
              name="package"
              size={20}
            />
          </div>

          <div>
            <strong>
              {totalProducts}
            </strong>

            <span>
              Products
            </span>
          </div>

        </div>


        <div className="card admin-inventory-stat">

          <div className="admin-inventory-stat-icon">
            <Icon
              name="grid"
              size={20}
            />
          </div>

          <div>
            <strong>
              {totalUnits.toLocaleString()}
            </strong>

            <span>
              Units in Stock
            </span>
          </div>

        </div>


        <div className="card admin-inventory-stat">

          <div className="admin-inventory-stat-icon">
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


        <div className="card admin-inventory-stat">

          <div className="admin-inventory-stat-icon">
            <Icon
              name="clock"
              size={20}
            />
          </div>

          <div>
            <strong>
              {lowStock}
            </strong>

            <span>
              Low Stock
            </span>
          </div>

        </div>


        <div className="card admin-inventory-stat inventory-stat-danger">

          <div className="admin-inventory-stat-icon">
            <Icon
              name="bolt"
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

      </div>


      {/* ====================================================
          INVENTORY TABLE
      ==================================================== */}

      <div className="card admin-inventory-container">

        {/* TOOLBAR */}

        <div className="admin-inventory-toolbar">

          <div className="admin-inventory-search">

            <Icon
              name="search"
              size={18}
            />

            <input
              type="text"
              placeholder="Search products, SKU or brand..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>


          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(
                e.target.value
              )
            }
          >
            <option value="All">
              All Categories
            </option>

            {categoryList.map(
              (category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              )
            )}

          </select>


          <select
            value={stockFilter}
            onChange={(e) =>
              setStockFilter(
                e.target.value
              )
            }
          >
            <option value="All">
              All Stock
            </option>

            <option value="In Stock">
              In Stock
            </option>

            <option value="Low Stock">
              Low Stock
            </option>

            <option value="Out of Stock">
              Out of Stock
            </option>

          </select>


          <span className="admin-inventory-count">
            {filteredInventory.length}{' '}
            products
          </span>

        </div>


        {/* TABLE */}

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

              {filteredInventory.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="admin-empty"
                  >

                    <Icon
                      name="search"
                      size={28}
                    />

                    <strong>
                      No inventory found
                    </strong>

                    <span>
                      Try changing your search
                      or filters.
                    </span>

                  </td>

                </tr>

              ) : (

                filteredInventory.map(
                  (product) => {

                    const stockStatus =
                      product.stockStatus ||
                      'In Stock';

                    return (

                      <tr
                        key={product.id}
                      >

                        {/* PRODUCT */}

                        <td>

                          <div className="admin-inventory-product">

                            <div className="admin-inventory-image">

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
                                  name="package"
                                  size={22}
                                />

                              )}

                            </div>


                            <div>

                              <strong>
                                {product.name}
                              </strong>

                              <small>
                                {product.slug ||
                                  product.sku ||
                                  product.id}
                              </small>

                            </div>

                          </div>

                        </td>


                        {/* CATEGORY */}

                        <td>
                          {product.categoryName ||
                            product.category ||
                            'Uncategorized'}
                        </td>


                        {/* PRICE */}

                        <td>
                          <strong>
                            {formatCurrency(
                              product.price
                            )}
                          </strong>
                        </td>


                        {/* STOCK */}

                        <td>

                          <strong>
                            {Number(
                              product.stock || 0
                            )}
                          </strong>

                          <small>
                            {' '}units
                          </small>

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={`admin-stock-status ${getStockStatusClass(
                              stockStatus
                            )}`}
                          >
                            <span />
                            {stockStatus}
                          </span>

                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div className="admin-inventory-actions">

                            <button
                              type="button"
                              className="admin-action-btn"
                              title="View product"
                              onClick={() =>
                                handleView(
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
                              className="admin-action-btn"
                              title="Edit inventory"
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
                              className="admin-action-btn"
                              title="Restock"
                              onClick={() =>
                                handleRestock(
                                  product
                                )
                              }
                            >
                              <Icon
                                name="plus"
                                size={16}
                              />
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ====================================================
          EDIT INVENTORY MODAL
      ==================================================== */}

      {showModal && (

        <div
          className="admin-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="admin-modal inventory-edit-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="admin-modal-header">

              <div>

                <span className="eyebrow">
                  Inventory Management
                </span>

                <h2>
                  Update Inventory
                </h2>

              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={closeModal}
              >
                ×
              </button>

            </div>


            <form
              className="admin-inventory-form"
              onSubmit={handleSubmit}
            >

              <div className="admin-selected-product">

                <strong>
                  {editingProduct?.name}
                </strong>

                <span>
                  {editingProduct?.categoryName ||
                    editingProduct?.category ||
                    'Product'}
                </span>

              </div>


              {/* STOCK STATUS */}

              <div className="field">

                <label>
                  Stock Status
                </label>

                <select
                  name="stockStatus"
                  value={
                    form.stockStatus
                  }
                  onChange={handleChange}
                >

                  <option value="In Stock">
                    In Stock
                  </option>

                  <option value="Low Stock">
                    Low Stock
                  </option>

                  <option value="Out of Stock">
                    Out of Stock
                  </option>

                </select>

                <small className="admin-field-help">
                  Choose whether customers can
                  currently purchase this product.
                </small>

              </div>


              {/* STOCK + REORDER */}

              <div className="admin-form-grid">

                <div className="field">

                  <label>
                    Current Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    min="0"
                    value={
                      form.stock
                    }
                    onChange={handleChange}
                    disabled={
                      form.stockStatus ===
                      'Out of Stock'
                    }
                    required
                  />

                  {form.stockStatus ===
                    'Out of Stock' && (
                    <small className="admin-field-help">
                      Stock quantity will be
                      set to 0 when saved.
                    </small>
                  )}

                </div>


                <div className="field">

                  <label>
                    Reorder Level
                  </label>

                  <input
                    type="number"
                    name="reorderLevel"
                    min="0"
                    value={
                      form.reorderLevel
                    }
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              {/* STATUS PREVIEW */}

              <div className="admin-status-preview">

                <span>
                  Customer Store Status
                </span>

                <strong
                  className={`admin-stock-status ${getStockStatusClass(
                    form.stockStatus
                  )}`}
                >
                  <span />
                  {form.stockStatus}
                </strong>

              </div>


              {/* ACTIONS */}

              <div className="admin-modal-actions">

                <button
                  type="button"
                  className="btn btn-outline-navy"
                  onClick={closeModal}
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

                  Save Inventory

                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* ====================================================
          PRODUCT DETAILS MODAL
      ==================================================== */}

      {selectedProduct && (

        <div
          className="admin-modal-overlay"
          onClick={
            closeProductDetails
          }
        >

          <div
            className="admin-modal inventory-details-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="admin-modal-header">

              <div>

                <span className="eyebrow">
                  Product Inventory
                </span>

                <h2>
                  {selectedProduct.name}
                </h2>

              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={
                  closeProductDetails
                }
              >
                ×
              </button>

            </div>


            <div className="inventory-details">

              {selectedProduct.image && (

                <img
                  src={
                    selectedProduct.image
                  }
                  alt={
                    selectedProduct.name
                  }
                  className="inventory-details-image"
                />

              )}


              <div className="inventory-detail-row">

                <span>
                  Product ID
                </span>

                <strong>
                  {selectedProduct.id}
                </strong>

              </div>


              <div className="inventory-detail-row">

                <span>
                  Category
                </span>

                <strong>
                  {selectedProduct.categoryName ||
                    selectedProduct.category}
                </strong>

              </div>


              <div className="inventory-detail-row">

                <span>
                  Brand
                </span>

                <strong>
                  {selectedProduct.brand ||
                    'Apex Machinery'}
                </strong>

              </div>


              <div className="inventory-detail-row">

                <span>
                  Price
                </span>

                <strong>
                  {formatCurrency(
                    selectedProduct.price
                  )}
                </strong>

              </div>


              <div className="inventory-detail-row">

                <span>
                  Current Stock
                </span>

                <strong>
                  {selectedProduct.stock}
                  {' '}units
                </strong>

              </div>


              <div className="inventory-detail-row">

                <span>
                  Stock Status
                </span>

                <strong
                  className={`admin-stock-status ${getStockStatusClass(
                    selectedProduct.stockStatus
                  )}`}
                >
                  <span />
                  {selectedProduct.stockStatus}
                </strong>

              </div>


              <div className="inventory-detail-row">

                <span>
                  Reorder Level
                </span>

                <strong>
                  {selectedProduct.reorderLevel}
                  {' '}units
                </strong>

              </div>

            </div>


            <div className="admin-modal-actions">

              <button
                type="button"
                className="btn btn-outline-navy"
                onClick={
                  closeProductDetails
                }
              >
                Close
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  closeProductDetails();
                  handleEdit(
                    selectedProduct
                  );
                }}
              >
                <Icon
                  name="edit"
                  size={16}
                />

                Update Inventory
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}