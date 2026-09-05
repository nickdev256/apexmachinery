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
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from '../../services/adminApi';

import './AdminCategories.css';


// ============================================================
// NORMALIZE CATEGORY
// ============================================================

function normalizeCategory(
  category,
  index = 0
) {

  if (!category) {

    return null;

  }


  return {

    id:
      category.id,

    name:
      category.name ||
      'Unnamed Category',

    slug:
      category.slug ||
      '',

    icon:
      category.icon ||
      'settings',

    description:
      category.description ||
      '',

    status:
      String(
        category.status ||
        'active'
      ).toLowerCase() ===
      'inactive'
        ? 'Inactive'
        : 'Active',

    rawStatus:
      String(
        category.status ||
        'active'
      ).toLowerCase(),

    products:
      Number(
        category.products ??
        category.productCount ??
        category.product_count ??
        0
      ),

    order:
      Number(
        category.sortOrder ??
        category.sort_order ??
        category.order ??
        index + 1
      ),

    createdAt:
      category.createdAt ??
      category.created_at ??
      null,

    updatedAt:
      category.updatedAt ??
      category.updated_at ??
      null,

  };

}


// ============================================================
// ADMIN CATEGORIES
// ============================================================

export default function AdminCategories() {

  const navigate =
    useNavigate();


  // ==========================================================
  // STATE
  // ==========================================================

  const [
    categoryList,
    setCategoryList,
  ] =
    useState([]);


  const [
    search,
    setSearch,
  ] =
    useState('');


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    refreshing,
    setRefreshing,
  ] =
    useState(false);


  const [
    error,
    setError,
  ] =
    useState('');


  const [
    showModal,
    setShowModal,
  ] =
    useState(false);


  const [
    editingCategory,
    setEditingCategory,
  ] =
    useState(null);


  const [
    saving,
    setSaving,
  ] =
    useState(false);


  const [
    deletingId,
    setDeletingId,
  ] =
    useState(null);


  const [
    updatingStatusId,
    setUpdatingStatusId,
  ] =
    useState(null);


  const [
    form,
    setForm,
  ] =
    useState({

      name:
        '',

      icon:
        'settings',

      description:
        '',

      status:
        'active',

    });


  // ==========================================================
  // LOAD CATEGORIES
  // ==========================================================

  const loadCategories =
    useCallback(
      async (
        silent = false
      ) => {

        try {

          if (silent) {

            setRefreshing(
              true
            );

          } else {

            setLoading(
              true
            );

          }


          setError('');


          const response =
            await getAdminCategories();


          const rawCategories =
            Array.isArray(
              response
            )
              ? response
              : Array.isArray(
                    response?.categories
                  )
                ? response.categories
                : [];


          const normalized =
            rawCategories
              .map(
                (
                  category,
                  index
                ) =>
                  normalizeCategory(
                    category,
                    index
                  )
              )
              .filter(Boolean);


          setCategoryList(
            normalized
          );

        } catch (
          requestError
        ) {

          console.error(
            '[ADMIN CATEGORIES LOAD ERROR]',
            requestError
          );


          setError(
            requestError
              ?.response
              ?.data
              ?.message ||
            'Unable to load categories.'
          );

        } finally {

          setLoading(
            false
          );

          setRefreshing(
            false
          );

        }

      },
      []
    );


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(
    () => {

      loadCategories();

    },
    [
      loadCategories,
    ]
  );


  // ==========================================================
  // AUTO REFRESH
  // ==========================================================

  useEffect(
    () => {

      const timer =
        window.setInterval(
          () => {

            loadCategories(
              true
            );

          },
          30000
        );


      return () =>
        window.clearInterval(
          timer
        );

    },
    [
      loadCategories,
    ]
  );


  // ==========================================================
  // FILTER CATEGORIES
  // ==========================================================

  const filteredCategories =
    useMemo(
      () => {

        const query =
          search
            .trim()
            .toLowerCase();


        if (!query) {

          return categoryList;

        }


        return categoryList.filter(
          (
            category
          ) => {

            const searchable =
              [
                category.name,
                category.slug,
                category.id,
                category.description,
              ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();


            return searchable.includes(
              query
            );

          }
        );

      },
      [
        categoryList,
        search,
      ]
    );


  // ==========================================================
  // STATISTICS
  // ==========================================================

  const totalCategories =
    categoryList.length;


  const activeCategories =
    categoryList.filter(
      (
        category
      ) =>
        category.status ===
        'Active'
    ).length;


  const inactiveCategories =
    categoryList.filter(
      (
        category
      ) =>
        category.status ===
        'Inactive'
    ).length;


  const totalProducts =
    categoryList.reduce(
      (
        total,
        category
      ) =>
        total +
        Number(
          category.products ||
          0
        ),
      0
    );


  // ==========================================================
  // OPEN ADD
  // ==========================================================

  function handleAdd() {

    setEditingCategory(
      null
    );


    setForm({

      name:
        '',

      icon:
        'settings',

      description:
        '',

      status:
        'active',

    });


    setShowModal(
      true
    );

  }


  // ==========================================================
  // OPEN EDIT
  // ==========================================================

  function handleEdit(
    category
  ) {

    setEditingCategory(
      category
    );


    setForm({

      name:
        category.name ||
        '',

      icon:
        category.icon ||
        'settings',

      description:
        category.description ||
        '',

      status:
        category.rawStatus ||
        (
          category.status ===
          'Inactive'
            ? 'inactive'
            : 'active'
        ),

    });


    setShowModal(
      true
    );

  }


  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  function handleChange(
    event
  ) {

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

  }


  // ==========================================================
  // CLOSE MODAL
  // ==========================================================

  function closeModal() {

    if (saving) {

      return;

    }


    setShowModal(
      false
    );


    setEditingCategory(
      null
    );


    setForm({

      name:
        '',

      icon:
        'settings',

      description:
        '',

      status:
        'active',

    });

  }


  // ==========================================================
  // CREATE / UPDATE CATEGORY
  // ==========================================================

  async function handleSubmit(
    event
  ) {

    event.preventDefault();


    const categoryName =
      form.name.trim();


    if (!categoryName) {

      setError(
        'Please enter a category name.'
      );

      return;

    }


    try {

      setSaving(
        true
      );

      setError('');


      const payload = {

        name:
          categoryName,

        icon:
          form.icon.trim() ||
          'settings',

        description:
          form.description.trim(),

        status:
          form.status,

      };


      if (
        editingCategory
      ) {

        await updateAdminCategory(
          editingCategory.id,
          payload
        );

      } else {

        await createAdminCategory(
          payload
        );

      }


      closeModal();


      await loadCategories(
        true
      );

    } catch (
      requestError
    ) {

      console.error(
        '[SAVE CATEGORY ERROR]',
        requestError
      );


      setError(
        requestError
          ?.response
          ?.data
          ?.message ||
        'Unable to save category.'
      );

    } finally {

      setSaving(
        false
      );

    }

  }


  // ==========================================================
  // DELETE CATEGORY
  // ==========================================================

  async function handleDelete(
    category
  ) {

    if (
      Number(
        category.products ||
        0
      ) > 0
    ) {

      window.alert(
        `"${category.name}" still has ${category.products} product(s). Move or remove those products before deleting this category.`
      );

      return;

    }


    const confirmed =
      window.confirm(
        `Delete "${category.name}"?\n\nThis action cannot be undone.`
      );


    if (!confirmed) {

      return;

    }


    try {

      setDeletingId(
        category.id
      );

      setError('');


      await deleteAdminCategory(
        category.id
      );


      setCategoryList(
        (
          previous
        ) =>
          previous.filter(
            (
              item
            ) =>
              item.id !==
              category.id
          )
      );


      await loadCategories(
        true
      );

    } catch (
      requestError
    ) {

      console.error(
        '[DELETE CATEGORY ERROR]',
        requestError
      );


      setError(
        requestError
          ?.response
          ?.data
          ?.message ||
        'Unable to delete category.'
      );

    } finally {

      setDeletingId(
        null
      );

    }

  }


  // ==========================================================
  // TOGGLE STATUS
  // ==========================================================

  async function toggleStatus(
    category
  ) {

    const nextStatus =
      category.status ===
        'Active'
        ? 'inactive'
        : 'active';


    try {

      setUpdatingStatusId(
        category.id
      );

      setError('');


      await updateAdminCategory(
        category.id,
        {
          status:
            nextStatus,
        }
      );


      setCategoryList(
        (
          previous
        ) =>
          previous.map(
            (
              item
            ) =>
              item.id ===
              category.id
                ? {
                    ...item,

                    status:
                      nextStatus ===
                      'active'
                        ? 'Active'
                        : 'Inactive',

                    rawStatus:
                      nextStatus,
                  }
                : item
          )
      );


      await loadCategories(
        true
      );

    } catch (
      requestError
    ) {

      console.error(
        '[CATEGORY STATUS ERROR]',
        requestError
      );


      setError(
        requestError
          ?.response
          ?.data
          ?.message ||
        'Unable to update category status.'
      );

    } finally {

      setUpdatingStatusId(
        null
      );

    }

  }


  // ==========================================================
  // CLEAR SEARCH
  // ==========================================================

  function clearSearch() {

    setSearch('');

  }


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (

      <div className="admin-categories-page">

        <div className="card admin-category-container admin-empty">

          <Icon
            name="grid"
            size={34}
          />

          <strong>
            Loading categories...
          </strong>

          <span>
            Fetching product categories from Apex Machinery.
          </span>

        </div>

      </div>

    );

  }


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
              size={18}
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
            Manage product categories used across Apex Machinery.
          </p>

        </div>


        <div className="admin-category-header-actions">

          <button
            type="button"
            className="btn btn-outline-navy"
            disabled={
              refreshing
            }
            onClick={() =>
              loadCategories(
                true
              )
            }
          >

            <Icon
              name="refresh"
              size={17}
            />

            <span>
              {refreshing
                ? 'Refreshing...'
                : 'Refresh'}
            </span>

          </button>


          <button
            type="button"
            className="btn btn-primary"
            onClick={
              handleAdd
            }
          >

            <Icon
              name="plus"
              size={17}
            />

            <span>
              Add Category
            </span>

          </button>

        </div>

      </div>


      {/* ====================================================
          ERROR
      ==================================================== */}

      {error && (

        <div className="card admin-category-error">

          <Icon
            name="alert"
            size={18}
          />

          <span>
            {error}
          </span>

        </div>

      )}


      {/* ====================================================
          STATISTICS
      ==================================================== */}

      <div className="admin-category-stats">


        <div className="card admin-category-stat">

          <div className="admin-category-stat-icon">

            <Icon
              name="grid"
              size={21}
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
              size={21}
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
              size={21}
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
              size={21}
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
              placeholder="Search category, slug or ID..."
              value={
                search
              }
              onChange={
                (
                  event
                ) =>
                  setSearch(
                    event.target.value
                  )
              }
            />


            {search && (

              <button
                type="button"
                className="admin-category-search-clear"
                aria-label="Clear category search"
                title="Clear search"
                onClick={
                  clearSearch
                }
              >
                ×
              </button>

            )}

          </div>


          <span className="admin-category-count">

            Showing{' '}

            {filteredCategories.length}

            {' '}of{' '}

            {categoryList.length}

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
                      size={34}
                    />

                    <strong>
                      No categories found
                    </strong>

                    <span>
                      No product categories match your search.
                    </span>


                    {search && (

                      <button
                        type="button"
                        className="admin-empty-button"
                        onClick={
                          clearSearch
                        }
                      >
                        Clear Search
                      </button>

                    )}

                  </td>

                </tr>

              ) : (

                filteredCategories.map(
                  (
                    category,
                    index
                  ) => (

                    <tr
                      key={
                        category.id
                      }
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

                              {category.description ||
                                'Product category'}

                            </small>

                          </div>

                        </div>

                      </td>


                      {/* ID */}

                      <td>

                        <code>

                          {category.slug ||
                            category.id}

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
                          products
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
                          disabled={
                            updatingStatusId ===
                            category.id
                          }
                          title={`Click to ${
                            category.status ===
                            'Active'
                              ? 'deactivate'
                              : 'activate'
                          } category`}
                          onClick={() =>
                            toggleStatus(
                              category
                            )
                          }
                        >

                          <span />

                          {updatingStatusId ===
                          category.id
                            ? 'Updating...'
                            : category.status}

                        </button>

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div className="admin-category-actions">

                          <button
                            type="button"
                            className="admin-action-btn"
                            aria-label="Edit category"
                            title="Edit category"
                            disabled={
                              deletingId ===
                              category.id
                            }
                            onClick={() =>
                              handleEdit(
                                category
                              )
                            }
                          >

                            <Icon
                              name="edit"
                              size={17}
                            />

                          </button>


                          <button
                            type="button"
                            className="admin-action-btn danger"
                            aria-label="Delete category"
                            title="Delete category"
                            disabled={
                              deletingId ===
                              category.id
                            }
                            onClick={() =>
                              handleDelete(
                                category
                              )
                            }
                          >

                            <Icon
                              name="trash"
                              size={17}
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
          onClick={
            closeModal
          }
        >

          <div
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-modal-title"
            onClick={
              (
                event
              ) =>
                event.stopPropagation()
            }
          >


            {/* MODAL HEADER */}

            <div className="admin-modal-header">

              <div>

                <span className="eyebrow">
                  Category Management
                </span>

                <h2 id="category-modal-title">

                  {editingCategory
                    ? 'Edit Category'
                    : 'Add Category'}

                </h2>

              </div>


              <button
                type="button"
                className="admin-modal-close"
                aria-label="Close category modal"
                disabled={
                  saving
                }
                onClick={
                  closeModal
                }
              >
                ×
              </button>

            </div>


            {/* FORM */}

            <form
              className="admin-category-form"
              onSubmit={
                handleSubmit
              }
            >


              {/* NAME */}

              <div className="field">

                <label htmlFor="category-name">
                  Category Name *
                </label>

                <input
                  id="category-name"
                  name="name"
                  value={
                    form.name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="e.g. Cleaning Equipment"
                  disabled={
                    saving
                  }
                  required
                />

              </div>


              {/* DESCRIPTION */}

              <div className="field">

                <label htmlFor="category-description">
                  Description
                </label>

                <textarea
                  id="category-description"
                  name="description"
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Short category description"
                  rows={3}
                  disabled={
                    saving
                  }
                />

              </div>


              {/* ICON */}

              <div className="field">

                <label htmlFor="category-icon">
                  Icon Name
                </label>

                <input
                  id="category-icon"
                  name="icon"
                  value={
                    form.icon
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="settings"
                  disabled={
                    saving
                  }
                />

                <small>
                  Enter an icon name supported by your Icon component.
                </small>

              </div>


              {/* ICON PREVIEW */}

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
                    size={21}
                  />

                </div>


                <strong>

                  {form.name ||
                    'Category Name'}

                </strong>

              </div>


              {/* STATUS */}

              <div className="field">

                <label htmlFor="category-status">
                  Status
                </label>

                <select
                  id="category-status"
                  name="status"
                  value={
                    form.status
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    saving
                  }
                >

                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>

                </select>

              </div>


              {/* ACTIONS */}

              <div className="admin-modal-actions">

                <button
                  type="button"
                  className="btn btn-outline-navy"
                  disabled={
                    saving
                  }
                  onClick={
                    closeModal
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
                    name="check"
                    size={17}
                  />

                  <span>

                    {saving
                      ? 'Saving...'
                      : editingCategory
                        ? 'Save Changes'
                        : 'Create Category'}

                  </span>

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );

}