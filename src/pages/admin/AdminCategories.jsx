import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import { categories } from '../../data/categories';
import './AdminCategories.css';

// ============================================================
// ADMIN CATEGORIES
// ============================================================

export default function AdminCategories() {
  const navigate = useNavigate();

  // ==========================================================
  // CATEGORY STATE
  // ==========================================================

  const [categoryList, setCategoryList] = useState(
    categories.map((category, index) => ({
      ...category,
      products: Number(category.products || 0),
      status: category.status || 'Active',
      order: index + 1,
    }))
  );

  const [search, setSearch] = useState('');

  const [showModal, setShowModal] =
    useState(false);

  const [editingCategory, setEditingCategory] =
    useState(null);

  const [form, setForm] = useState({
    name: '',
    icon: 'settings',
    status: 'Active',
  });

  // ==========================================================
  // FILTER CATEGORIES
  // ==========================================================

  const filteredCategories = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) {
      return categoryList;
    }

    return categoryList.filter(
      (category) =>
        String(category.name || '')
          .toLowerCase()
          .includes(query) ||
        String(category.id || '')
          .toLowerCase()
          .includes(query)
    );
  }, [
    categoryList,
    search,
  ]);

  // ==========================================================
  // STATISTICS
  // ==========================================================

  const totalCategories =
    categoryList.length;

  const activeCategories =
    categoryList.filter(
      (category) =>
        category.status === 'Active'
    ).length;

  const inactiveCategories =
    categoryList.filter(
      (category) =>
        category.status === 'Inactive'
    ).length;

  const totalProducts =
    categoryList.reduce(
      (total, category) =>
        total +
        Number(category.products || 0),
      0
    );

  // ==========================================================
  // ADD CATEGORY
  // ==========================================================

  const handleAdd = () => {
    setEditingCategory(null);

    setForm({
      name: '',
      icon: 'settings',
      status: 'Active',
    });

    setShowModal(true);
  };

  // ==========================================================
  // EDIT CATEGORY
  // ==========================================================

  const handleEdit = (category) => {
    setEditingCategory(category);

    setForm({
      name: category.name || '',
      icon:
        category.icon ||
        'settings',
      status:
        category.status ||
        'Active',
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
  // CREATE / UPDATE CATEGORY
  // ==========================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    const categoryName =
      form.name.trim();

    if (!categoryName) {
      window.alert(
        'Please enter a category name.'
      );

      return;
    }

    // --------------------------------------------------------
    // CHECK DUPLICATE CATEGORY
    // --------------------------------------------------------

    const duplicate =
      categoryList.some(
        (category) =>
          category.name
            .toLowerCase() ===
            categoryName.toLowerCase() &&
          category.id !==
            editingCategory?.id
      );

    if (duplicate) {
      window.alert(
        'A category with this name already exists.'
      );

      return;
    }

    // --------------------------------------------------------
    // EDIT
    // --------------------------------------------------------

    if (editingCategory) {
      setCategoryList((previous) =>
        previous.map((category) =>
          category.id ===
          editingCategory.id
            ? {
                ...category,
                name: categoryName,
                icon:
                  form.icon.trim() ||
                  'settings',
                status:
                  form.status,
              }
            : category
        )
      );
    }

    // --------------------------------------------------------
    // CREATE
    // --------------------------------------------------------

    else {
      const baseId =
        categoryName
          .toLowerCase()
          .replace(
            /[^a-z0-9]+/g,
            '-'
          )
          .replace(
            /^-+|-+$/g,
            '');

      let newId = baseId;
      let counter = 1;

      while (
        categoryList.some(
          (category) =>
            category.id === newId
        )
      ) {
        newId =
          `${baseId}-${counter}`;
        counter++;
      }

      const newCategory = {
        id: newId,

        name:
          categoryName,

        icon:
          form.icon.trim() ||
          'settings',

        status:
          form.status,

        products: 0,

        order:
          categoryList.length + 1,
      };

      setCategoryList((previous) => [
        ...previous,
        newCategory,
      ]);
    }

    closeModal();
  };

  // ==========================================================
  // DELETE CATEGORY
  // ==========================================================

  const handleDelete = (category) => {
    if (
      Number(category.products || 0) > 0
    ) {
      const confirmed =
        window.confirm(
          `"${category.name}" currently has ${category.products} product(s) assigned to it.\n\nAre you sure you want to delete this category?`
        );

      if (!confirmed) {
        return;
      }
    } else {
      const confirmed =
        window.confirm(
          `Are you sure you want to delete "${category.name}"?`
        );

      if (!confirmed) {
        return;
      }
    }

    setCategoryList((previous) =>
      previous
        .filter(
          (item) =>
            item.id !== category.id
        )
        .map((item, index) => ({
          ...item,
          order: index + 1,
        }))
    );
  };

  // ==========================================================
  // TOGGLE STATUS
  // ==========================================================

  const toggleStatus = (category) => {
    const newStatus =
      category.status === 'Active'
        ? 'Inactive'
        : 'Active';

    setCategoryList((previous) =>
      previous.map((item) =>
        item.id === category.id
          ? {
              ...item,
              status: newStatus,
            }
          : item
      )
    );
  };

  // ==========================================================
  // CLOSE MODAL
  // ==========================================================

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);

    setForm({
      name: '',
      icon: 'settings',
      status: 'Active',
    });
  };

  // ==========================================================
  // CLEAR SEARCH
  // ==========================================================

  const clearSearch = () => {
    setSearch('');
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="admin-categories-page">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="admin-page-header">

        <div className="admin-categories-header-left">

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
            Product Management
          </span>

          <h1>
            Categories
          </h1>

          <p>
            Manage product categories used
            across Apex Machinery.
          </p>

        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAdd}
        >
          <Icon
            name="plus"
            size={16}
          />

          Add Category
        </button>

      </div>

      {/* ====================================================
          STATISTICS
      ==================================================== */}

      <div className="admin-category-stats">

        <div className="card admin-category-stat">

          <div className="admin-category-stat-icon">
            <Icon
              name="grid"
              size={20}
            />
          </div>

          <div>
            <strong>
              {totalCategories}
            </strong>

            <span>
              Total Categories
            </span>
          </div>

        </div>

        <div className="card admin-category-stat">

          <div className="admin-category-stat-icon">
            <Icon
              name="check"
              size={20}
            />
          </div>

          <div>
            <strong>
              {activeCategories}
            </strong>

            <span>
              Active Categories
            </span>
          </div>

        </div>

        <div className="card admin-category-stat">

          <div className="admin-category-stat-icon">
            <Icon
              name="clock"
              size={20}
            />
          </div>

          <div>
            <strong>
              {inactiveCategories}
            </strong>

            <span>
              Inactive Categories
            </span>
          </div>

        </div>

        <div className="card admin-category-stat">

          <div className="admin-category-stat-icon">
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
              Products Assigned
            </span>
          </div>

        </div>

      </div>

      {/* ====================================================
          CATEGORY MANAGEMENT
      ==================================================== */}

      <div className="card admin-category-container">

        {/* TOOLBAR */}

        <div className="admin-category-toolbar">

          <div className="admin-category-search">

            <Icon
              name="search"
              size={18}
            />

            <input
              type="search"
              placeholder="Search category or category ID..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

            {search && (
              <button
                type="button"
                className="admin-category-search-clear"
                onClick={clearSearch}
              >
                ×
              </button>
            )}

          </div>

          <span className="admin-category-count">
            Showing{' '}
            {filteredCategories.length}{' '}
            of {categoryList.length}
          </span>

        </div>

        {/* ==================================================
            TABLE
        ================================================== */}

        <div className="admin-table-wrapper">

          <table className="dashboard-table">

            <thead>

              <tr>

                <th>
                  #
                </th>

                <th>
                  Category
                </th>

                <th>
                  Category ID
                </th>

                <th>
                  Products
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

              {filteredCategories.length ===
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
                      No categories found
                    </strong>

                    <span>
                      Try another search term.
                    </span>

                    <button
                      type="button"
                      className="admin-empty-button"
                      onClick={clearSearch}
                    >
                      Clear Search
                    </button>

                  </td>

                </tr>

              ) : (

                filteredCategories.map(
                  (category, index) => (

                    <tr
                      key={category.id}
                    >

                      {/* NUMBER */}

                      <td>
                        <span className="category-number">
                          {index + 1}
                        </span>
                      </td>

                      {/* CATEGORY */}

                      <td>

                        <div className="admin-category-name">

                          <div className="admin-category-icon">

                            <Icon
                              name={
                                category.icon ||
                                'settings'
                              }
                              size={19}
                            />

                          </div>

                          <div>

                            <strong>
                              {category.name}
                            </strong>

                            <small>
                              Category
                            </small>

                          </div>

                        </div>

                      </td>

                      {/* ID */}

                      <td>

                        <code>
                          {category.id}
                        </code>

                      </td>

                      {/* PRODUCTS */}

                      <td>

                        <strong>
                          {Number(
                            category.products ||
                              0
                          )}
                        </strong>

                        <small>
                          {' '}products
                        </small>

                      </td>

                      {/* STATUS */}

                      <td>

                        <button
                          type="button"
                          className={`admin-status ${
                            category.status ===
                            'Active'
                              ? 'active'
                              : 'inactive'
                          }`}
                          onClick={() =>
                            toggleStatus(
                              category
                            )
                          }
                          title={`Click to make ${
                            category.status ===
                            'Active'
                              ? 'Inactive'
                              : 'Active'
                          }`}
                        >

                          <span />

                          {category.status}

                        </button>

                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div className="admin-category-actions">

                          <button
                            type="button"
                            className="admin-action-btn"
                            title="Edit category"
                            onClick={() =>
                              handleEdit(
                                category
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
                            className="admin-action-btn danger"
                            title="Delete category"
                            onClick={() =>
                              handleDelete(
                                category
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
          ADD / EDIT MODAL
      ==================================================== */}

      {showModal && (

        <div
          className="admin-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="admin-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="admin-modal-header">

              <div>

                <span className="eyebrow">
                  Category Management
                </span>

                <h2>
                  {editingCategory
                    ? 'Edit Category'
                    : 'Add Category'}
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

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="admin-category-form"
            >

              <div className="field">

                <label htmlFor="category-name">
                  Category Name
                </label>

                <input
                  id="category-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Cleaning Equipment"
                  required
                />

              </div>

              <div className="field">

                <label htmlFor="category-icon">
                  Icon Name
                </label>

                <input
                  id="category-icon"
                  name="icon"
                  value={form.icon}
                  onChange={handleChange}
                  placeholder="settings"
                />

                <small>
                  Enter an icon name supported
                  by your Icon component.
                </small>

              </div>

              <div className="category-icon-preview">

                <span>
                  Preview
                </span>

                <div>
                  <Icon
                    name={
                      form.icon ||
                      'settings'
                    }
                    size={20}
                  />
                </div>

                <strong>
                  {form.name ||
                    'Category Name'}
                </strong>

              </div>

              <div className="field">

                <label htmlFor="category-status">
                  Status
                </label>

                <select
                  id="category-status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>

              </div>

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

                  {editingCategory
                    ? 'Save Changes'
                    : 'Create Category'}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}