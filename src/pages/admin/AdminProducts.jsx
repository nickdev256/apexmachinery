import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import Icon from '../../components/Icon';

import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminCategories,
  getAdminProducts,
  updateAdminProduct,
} from '../../services/adminApi';

import './AdminProducts.css';


// ============================================================
// EMPTY FORM
// ============================================================

const EMPTY_FORM = {
  name: '',
  categoryId: '',
  brand: '',
  price: '',
  stock: 0,
  status: 'Out of Stock',
  description: '',
  image: '',
};


// ============================================================
// ADMIN PRODUCTS
// ============================================================

export default function AdminProducts() {
  const navigate =
    useNavigate();


  // ==========================================================
  // DATA
  // ==========================================================

  const [
    productList,
    setProductList,
  ] =
    useState([]);

  const [
    categoryList,
    setCategoryList,
  ] =
    useState([]);


  // ==========================================================
  // UI STATE
  // ==========================================================

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState('');

  const [
    search,
    setSearch,
  ] =
    useState('');

  const [
    category,
    setCategory,
  ] =
    useState('all');

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState('all');


  // ==========================================================
  // MODALS
  // ==========================================================

  const [
    selectedProduct,
    setSelectedProduct,
  ] =
    useState(null);

  const [
    editingProduct,
    setEditingProduct,
  ] =
    useState(null);

  const [
    showProductModal,
    setShowProductModal,
  ] =
    useState(false);

  const [
    showAddModal,
    setShowAddModal,
  ] =
    useState(false);


  // ==========================================================
  // FORM
  // ==========================================================

  const [
    form,
    setForm,
  ] =
    useState(
      EMPTY_FORM
    );


  // ==========================================================
  // LOAD DATA
  // ==========================================================

  const loadData =
    useCallback(
      async (
        showLoader = true
      ) => {
        try {
          if (
            showLoader
          ) {
            setLoading(
              true
            );
          }

          setError('');

          const [
            productResult,
            categoryResult,
          ] =
            await Promise.all([
              getAdminProducts(),
              getAdminCategories(),
            ]);

          setProductList(
            productResult
              ?.products ||
            productResult ||
            []
          );

          setCategoryList(
            categoryResult
              ?.categories ||
            categoryResult ||
            []
          );
        } catch (
          requestError
        ) {
          console.error(
            'Unable to load products:',
            requestError
          );

          setError(
            requestError
              ?.response
              ?.data
              ?.message ||
            'Unable to load products.'
          );
        } finally {
          if (
            showLoader
          ) {
            setLoading(
              false
            );
          }
        }
      },
      []
    );


  useEffect(
    () => {
      loadData();
    },
    [
      loadData,
    ]
  );


  // ==========================================================
  // FILTER PRODUCTS
  // ==========================================================

  const filteredProducts =
    useMemo(
      () => {
        const query =
          search
            .trim()
            .toLowerCase();

        return productList.filter(
          (
            product
          ) => {
            const searchable =
              [
                product.name,
                product.brand,
                product.categoryName,
                product.id,
                product.slug,
              ]
                .join(' ')
                .toLowerCase();

            const matchesSearch =
              !query ||
              searchable.includes(
                query
              );

            const matchesCategory =
              category ===
                'all' ||
              product.categoryId ===
                category;

            const matchesStatus =
              statusFilter ===
                'all' ||
              product.status ===
                statusFilter;

            return (
              matchesSearch &&
              matchesCategory &&
              matchesStatus
            );
          }
        );
      },
      [
        productList,
        search,
        category,
        statusFilter,
      ]
    );


  // ==========================================================
  // STATISTICS
  // ==========================================================

  const totalProducts =
    productList.length;

  const inStock =
    productList.filter(
      (
        product
      ) =>
        product.status ===
          'In Stock' &&
        Number(
          product.stock ||
          0
        ) > 0
    ).length;

  const outOfStock =
    productList.filter(
      (
        product
      ) =>
        product.status ===
          'Out of Stock' ||
        Number(
          product.stock ||
          0
        ) <= 0
    ).length;

  const totalUnits =
    productList.reduce(
      (
        total,
        product
      ) =>
        total +
        Number(
          product.stock ||
          0
        ),
      0
    );


  // ==========================================================
  // CURRENCY
  // ==========================================================

  const formatCurrency =
    (
      value
    ) => {
      if (
        value === null ||
        value === undefined ||
        value === ''
      ) {
        return 'Request Quote';
      }

      return `UGX ${Number(
        value
      ).toLocaleString()}`;
    };


  // ==========================================================
  // RESET FORM
  // ==========================================================

  const resetForm =
    () => {
      setForm({
        ...EMPTY_FORM,
      });

      setEditingProduct(
        null
      );
    };


  // ==========================================================
  // ADD PRODUCT
  // ==========================================================

  const handleAddProduct =
    () => {
      setEditingProduct(
        null
      );

      setForm({
        ...EMPTY_FORM,

        categoryId:
          categoryList[0]
            ?.id ||
          '',
      });

      setShowAddModal(
        true
      );
    };


  // ==========================================================
  // EDIT PRODUCT
  // ==========================================================

  const handleEdit =
    (
      product
    ) => {
      setEditingProduct(
        product
      );

      setForm({
        name:
          product.name ||
          '',

        categoryId:
          product.categoryId ||
          '',

        brand:
          product.brand ||
          '',

        price:
          product.price ??
          '',

        stock:
          Number(
            product.stock ||
            0
          ),

        status:
          Number(
            product.stock ||
            0
          ) > 0
            ? 'In Stock'
            : 'Out of Stock',

        description:
          product.description ||
          '',

        image:
          product.image ||
          '',
      });

      setSelectedProduct(
        null
      );

      setShowProductModal(
        true
      );
    };


  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  const handleChange =
    (
      event
    ) => {
      const {
        name,
        value,
      } =
        event.target;

      setForm(
        (
          previous
        ) => ({
          ...previous,
          [name]:
            value,
        })
      );
    };


  // ==========================================================
  // STOCK CHANGE
  // ==========================================================

  const handleStockChange =
    (
      event
    ) => {
      const value =
        Math.max(
          0,
          Number(
            event.target
              .value ||
            0
          )
        );

      setForm(
        (
          previous
        ) => ({
          ...previous,

          stock:
            value,

          status:
            value > 0
              ? 'In Stock'
              : 'Out of Stock',
        })
      );
    };


  // ==========================================================
  // STATUS CHANGE
  // ==========================================================

  const handleStatusChange =
    (
      event
    ) => {
      const value =
        event.target
          .value;

      setForm(
        (
          previous
        ) => ({
          ...previous,

          status:
            value,

          stock:
            value ===
              'Out of Stock'
              ? 0
              : Math.max(
                  Number(
                    previous
                      .stock ||
                    0
                  ),
                  1
                ),
        })
      );
    };


  // ==========================================================
  // SAVE PRODUCT
  // ==========================================================

  const handleSaveProduct =
    async (
      event
    ) => {
      event.preventDefault();

      if (
        !form.name.trim()
      ) {
        window.alert(
          'Product name is required.'
        );

        return;
      }

      if (
        !form.categoryId
      ) {
        window.alert(
          'Please select a category.'
        );

        return;
      }

      const stock =
        form.status ===
          'Out of Stock'
          ? 0
          : Math.max(
              1,
              Number(
                form.stock ||
                0
              )
            );

      const payload = {
        name:
          form.name.trim(),

        categoryId:
          form.categoryId,

        brand:
          form.brand.trim(),

        price:
          form.price,

        stock,

        status:
          stock > 0
            ? 'In Stock'
            : 'Out of Stock',

        description:
          form.description
            .trim(),

        image:
          form.image
            .trim(),
      };

      try {
        setSaving(
          true
        );

        setError('');

        if (
          editingProduct
        ) {
          const updated =
            await updateAdminProduct(
              editingProduct.id,
              payload
            );

          setProductList(
            (
              previous
            ) =>
              previous.map(
                (
                  product
                ) =>
                  product.id ===
                    editingProduct.id
                    ? updated
                    : product
              )
          );

          setShowProductModal(
            false
          );
        } else {
          const created =
            await createAdminProduct(
              payload
            );

          setProductList(
            (
              previous
            ) => [
              created,
              ...previous,
            ]
          );

          setShowAddModal(
            false
          );
        }

        resetForm();
      } catch (
        requestError
      ) {
        console.error(
          'Save product error:',
          requestError
        );

        const message =
          requestError
            ?.response
            ?.data
            ?.message ||
          'Unable to save product.';

        setError(
          message
        );

        window.alert(
          message
        );
      } finally {
        setSaving(
          false
        );
      }
    };


  // ==========================================================
  // DELETE PRODUCT
  // ==========================================================

  const handleDelete =
    async (
      product
    ) => {
      const confirmed =
        window.confirm(
          `Are you sure you want to delete "${product.name}"?`
        );

      if (
        !confirmed
      ) {
        return;
      }

      try {
        setError('');

        await deleteAdminProduct(
          product.id
        );

        setProductList(
          (
            previous
          ) =>
            previous.filter(
              (
                item
              ) =>
                item.id !==
                product.id
            )
        );

        setSelectedProduct(
          null
        );
      } catch (
        requestError
      ) {
        console.error(
          'Delete product error:',
          requestError
        );

        window.alert(
          requestError
            ?.response
            ?.data
            ?.message ||
          'Unable to delete product.'
        );
      }
    };


  // ==========================================================
  // TOGGLE STOCK
  // ==========================================================

  const toggleStock =
    async (
      product
    ) => {
      const nextStock =
        product.status ===
          'In Stock'
          ? 0
          : Math.max(
              1,
              Number(
                product.stock ||
                0
              )
            );

      try {
        const updated =
          await updateAdminProduct(
            product.id,
            {
              stock:
                nextStock,
            }
          );

        setProductList(
          (
            previous
          ) =>
            previous.map(
              (
                item
              ) =>
                item.id ===
                  product.id
                  ? updated
                  : item
            )
        );

        setSelectedProduct(
          (
            previous
          ) =>
            previous?.id ===
              product.id
              ? updated
              : previous
        );
      } catch (
        requestError
      ) {
        console.error(
          'Stock update error:',
          requestError
        );

        window.alert(
          requestError
            ?.response
            ?.data
            ?.message ||
          'Unable to update stock.'
        );
      }
    };


  // ==========================================================
  // CLOSE MODALS
  // ==========================================================

  const closeEditModal =
    () => {
      setShowProductModal(
        false
      );

      resetForm();
    };


  const closeAddModal =
    () => {
      setShowAddModal(
        false
      );

      resetForm();
    };


  // ==========================================================
  // LOADING
  // ==========================================================

  if (
    loading
  ) {
    return (
      <div className="admin-products-page">
        <div className="card admin-empty">
          <strong>
            Loading products...
          </strong>

          <span>
            Fetching your Apex Machinery catalogue.
          </span>
        </div>
      </div>
    );
  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="admin-products-page">

      <div className="admin-page-header">
        <div>
          <button
            type="button"
            className="admin-back-button"
            onClick={() =>
              navigate(
                '/admin'
              )
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
            Manage machinery,
            equipment, stock and
            catalogue pricing.
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


      {error && (
        <div className="card admin-products-error">
          {error}

          <button
            type="button"
            onClick={() =>
              loadData()
            }
          >
            Retry
          </button>
        </div>
      )}


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
              {totalUnits
                .toLocaleString()}
            </strong>

            <span>
              Units Available
            </span>
          </div>
        </div>

      </div>


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
            onChange={(
              event
            ) =>
              setSearch(
                event.target
                  .value
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
          onChange={(
            event
          ) =>
            setCategory(
              event.target
                .value
            )
          }
        >
          <option value="all">
            All Categories
          </option>

          {categoryList.map(
            (
              item
            ) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.name}
              </option>
            )
          )}
        </select>


        <select
          value={
            statusFilter
          }
          onChange={(
            event
          ) =>
            setStatusFilter(
              event.target
                .value
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
          {
            filteredProducts.length
          }{' '}
          Products
        </span>

      </div>


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
                  (
                    product
                  ) => (
                    <tr
                      key={
                        product.id
                      }
                    >

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
                              {
                                product.name
                              }
                            </strong>

                            <small>
                              ID:{' '}
                              {
                                product.id
                              }
                            </small>

                            {product.brand && (
                              <small>
                                {
                                  product.brand
                                }
                              </small>
                            )}
                          </div>

                        </div>
                      </td>


                      <td>
                        {product.categoryName ||
                          'Uncategorized'}
                      </td>


                      <td>
                        <strong>
                          {product.priceDisplay ||
                            formatCurrency(
                              product.price
                            )}
                        </strong>
                      </td>


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

                          {
                            product.status
                          }
                        </button>
                      </td>


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


      {selectedProduct && (
        <div
          className="admin-modal-backdrop"
          onClick={() =>
            setSelectedProduct(
              null
            )
          }
        >
          <div
            className="admin-modal product-view-modal"
            onClick={(
              event
            ) =>
              event
                .stopPropagation()
            }
          >

            <button
              className="admin-modal-close"
              type="button"
              onClick={() =>
                setSelectedProduct(
                  null
                )
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
              {
                selectedProduct.name
              }
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
                  {
                    selectedProduct.id
                  }
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
                  {
                    selectedProduct.stock
                  }{' '}
                  units
                </strong>
              </div>


              <div>
                <span>
                  Status
                </span>

                <strong>
                  {
                    selectedProduct.status
                  }
                </strong>
              </div>

            </div>


            <div className="admin-modal-actions">

              <button
                type="button"
                className="btn btn-outline-navy"
                onClick={() =>
                  setSelectedProduct(
                    null
                  )
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


      {(
        showProductModal ||
        showAddModal
      ) && (
        <div
          className="admin-modal-backdrop"
          onClick={
            showProductModal
              ? closeEditModal
              : closeAddModal
          }
        >

          <div
            className="admin-modal"
            onClick={(
              event
            ) =>
              event
                .stopPropagation()
            }
          >

            <div className="admin-modal-header">

              <div>
                <span className="eyebrow">
                  Product Management
                </span>

                <h2>
                  {editingProduct
                    ? 'Edit Product'
                    : 'Add Product'}
                </h2>
              </div>


              <button
                className="admin-modal-close"
                type="button"
                onClick={
                  editingProduct
                    ? closeEditModal
                    : closeAddModal
                }
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
                  value={
                    form.name
                  }
                  onChange={
                    handleChange
                  }
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
                    value={
                      form.brand
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Apex Machinery"
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
                    value={
                      form.price
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="UGX"
                  />
                </div>

              </div>


              <div className="field">
                <label>
                  Category
                </label>

                <select
                  name="categoryId"
                  value={
                    form.categoryId
                  }
                  onChange={
                    handleChange
                  }
                  required
                >
                  <option value="">
                    Select Category
                  </option>

                  {categoryList.map(
                    (
                      item
                    ) => (
                      <option
                        key={
                          item.id
                        }
                        value={
                          item.id
                        }
                      >
                        {
                          item.name
                        }
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
                    value={
                      form.stock
                    }
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
                    value={
                      form.status
                    }
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
                  Product Image Path
                </label>

                <input
                  name="image"
                  value={
                    form.image
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="/images/machines/example-machine.jpg"
                />
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
                    editingProduct
                      ? closeEditModal
                      : closeAddModal
                  }
                  disabled={
                    saving
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    saving
                  }
                >
                  <Icon
                    name={
                      editingProduct
                        ? 'check'
                        : 'plus'
                    }
                    size={16}
                  />

                  {saving
                    ? 'Saving...'
                    : editingProduct
                      ? 'Save Product'
                      : 'Create Product'}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}