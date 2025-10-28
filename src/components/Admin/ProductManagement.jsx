import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { FiEdit2, FiTrash2, FiPlus, FiPackage } from "react-icons/fi";
import {
  fetchAdminProducts,
  deleteAdminProduct,
} from "../../redux/slices/adminProductSlice";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.adminProducts
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      const promise = dispatch(
        deleteAdminProduct(productToDelete._id)
      ).unwrap();

      toast.promise(promise, {
        loading: "Deleting product...",
        success: () => {
          setShowDeleteModal(false);
          setProductToDelete(null);
          return "Product deleted successfully!";
        },
        error: (error) => {
          return error.message || "Failed to delete product";
        },
      });
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const getStockColor = (countInStock) => {
    if (countInStock === 0) return "text-red-400 bg-red-500/10 border-red-500/20";
    if (countInStock < 10) return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    return "text-green-400 bg-green-500/10 border-green-500/20";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-yellow-400 text-lg">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-white">
            Product <span className="text-yellow-400">Management</span>
          </h2>
          <Link
            to="/admin/products/add"
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 font-semibold lg:py-3 lg:px-6 px-2 text-center rounded-lg flex items-center gap-2 transition-all duration-300 ml-2 shadow-lg hover:shadow-yellow-500/20"
          >
            <FiPlus className="text-lg" />
            Add Product
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-600 text-white px-6 py-3 rounded-md mb-6">
            Error: {error}
          </div>
        )}

        {/* Products Table */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-white">
              Product Catalog
            </h3>
            <div className="text-sm text-gray-400">
              {products?.length || 0} product{products?.length !== 1 ? "s" : ""}{" "}
              total
            </div>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Image</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {products && products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-750/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0].url}
                              alt={product.images[0].altText || product.name}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <FiPackage className="text-xl text-gray-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <h4 className="text-lg font-semibold text-white">
                            {product.name}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            SKU: {product.sku}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xl font-bold text-yellow-400">
                          ₹{product.price}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 flex text-nowrap rounded-full text-xs font-medium border ${getStockColor(product.countInStock)}`}>
                          {product.countInStock} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300">{product.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                          >
                            <FiEdit2 className="text-sm" />
                            Edit
                          </Link>

                          <button
                            onClick={() => handleDeleteClick(product)}
                            className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                          >
                            <FiTrash2 className="text-sm" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="text-gray-500 text-6xl mb-4">📦</div>
                      <h4 className="text-xl font-semibold text-gray-300 mb-2">
                        No products found
                      </h4>
                      <p className="text-gray-400 mb-6">
                        Get started by adding your first product to the catalog.
                      </p>
                      <Link
                        to="/admin/products/add"
                        className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 font-semibold py-3 px-6 rounded-lg inline-flex items-center gap-2 transition-all duration-300"
                      >
                        <FiPlus className="text-lg" />
                        Add Your First Product
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-gray-800 bg-opacity-50 border border-gray-700 p-6 rounded-2xl">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {products?.length || 0}
            </div>
            <div className="text-gray-300">Total Products</div>
          </div>
          <div className="bg-gray-800 bg-opacity-50 border border-gray-700 p-6 rounded-2xl">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {products?.reduce(
                (total, product) => total + (product.countInStock || 0),
                0
              ) || 0}
            </div>
            <div className="text-gray-300">Total Stock</div>
          </div>
          <div className="bg-gray-800 bg-opacity-50 border border-gray-700 p-6 rounded-2xl">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {new Set(products?.map((p) => p.category)).size || 0}
            </div>
            <div className="text-gray-300">Categories</div>
          </div>
          <div className="bg-gray-800 bg-opacity-50 border border-gray-700 p-6 rounded-2xl">
  <div className="text-3xl font-bold text-purple-400 mb-2">
    ₹
    {(products?.reduce(
      (total, product) => total + (product.price || 0),
      0
    ) || 0).toFixed(2)}
  </div>
  <div className="text-gray-300">Total Value</div>
</div>

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl shadow-2xl max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-2">
              Confirm Deletion
            </h3>
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete the product{" "}
              <span className="font-semibold text-yellow-400">
                "{productToDelete?.name}"
              </span>
              ?
            </p>
            <p className="text-red-400 text-sm mb-6">
              ⚠️ This action cannot be undone and will permanently remove the
              product from your catalog.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;