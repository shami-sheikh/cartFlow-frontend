import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { FiEdit2, FiTrash2, FiPlus, FiPackage } from "react-icons/fi";
import noproduct from "../../assets/productnotfound.mp4";
import {
  fetchAdminProducts,
  deleteAdminProduct,
} from "../../redux/slices/adminProductSlice";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.adminProducts,
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
        deleteAdminProduct(productToDelete._id),
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
    if (countInStock === 0) return "text-red-600 bg-red-50 border-red-200";
    if (countInStock < 10)
      return "text-[#a87b32] bg-[#fcfaf6] border-[#ebdccb]";
    return "text-emerald-600 bg-emerald-50 border-emerald-200";
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#fcfaf6]">
        <div className="text-[#8e8577] font-medium text-lg">
          Loading products...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf6] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h2
            className="text-4xl font-light text-[#0f0d0b]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Product Management
          </h2>
          <Link
            to="/admin/products/add"
            className="bg-[#0f0d0b] text-white hover:bg-[#c9973f] font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
          >
            <FiPlus className="text-lg" />
            <span className="hidden sm:inline">Add Product</span>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl mb-8 font-medium">
            Error: {error}
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white border border-[#ebdccb]/60 p-8 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3
              className="text-2xl font-light text-[#0f0d0b]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Product Catalog
            </h3>
            <div className="text-sm font-medium text-[#8e8577] bg-[#fcfaf6] px-3 py-1 rounded-full border border-[#ebdccb]/60">
              {products?.length || 0} product{products?.length !== 1 ? "s" : ""}{" "}
              total
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#ebdccb]/40">
            <table className="w-full">
              <thead className="bg-[#fcfaf6] border-b border-[#ebdccb]/60">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#8e8577] uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#8e8577] uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#8e8577] uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#8e8577] uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#8e8577] uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-[#8e8577] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebdccb]/40 bg-white">
                {products && products.length > 0 ? (
                  products.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-[#fcfaf6] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="w-16 h-16 bg-[#f0ece2] border border-[#ebdccb]/60 rounded-xl flex items-center justify-center overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0].url}
                              alt={product.images[0].altText || product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <FiPackage className="text-xl text-[#aba293]" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <h4 className="text-base font-semibold text-[#0f0d0b]">
                            {product.name}
                          </h4>
                          <p className="text-[#8e8577] text-sm mt-0.5">
                            SKU: {product.sku}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-bold text-[#a87b32]">
                          ₹{product.price}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 flex w-fit text-nowrap rounded-full text-xs font-semibold border ${getStockColor(
                            product.countInStock,
                          )}`}
                        >
                          {product.countInStock} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[#5c5548] font-medium">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-3">
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="bg-white border border-[#ebdccb] hover:border-[#c9973f]/60 text-[#5c5548] hover:text-[#0f0d0b] py-2 px-3 rounded-lg flex items-center justify-center transition-colors shadow-sm"
                            title="Edit"
                          >
                            <FiEdit2 className="text-sm" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(product)}
                            className="bg-red-50 border border-red-100 hover:bg-red-100 text-red-500 py-2 px-3 rounded-lg flex items-center justify-center transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="text-[#aba293] text-5xl mb-4">📦</div>

                      {/* Added autoPlay, playsInline, and some sizing classes so it doesn't break your table layout */}
                      <video
                        src={noproduct}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="max-w-xs mx-auto mb-4"
                      />

                      <p className="text-[#8e8577] mb-6">
                        Get started by adding your first product to the catalog.
                      </p>
                      <Link
                        to="/admin/products/add"
                        className="bg-[#0f0d0b] hover:bg-[#c9973f] text-white font-semibold py-3 px-6 rounded-xl inline-flex items-center gap-2 transition-colors shadow-sm"
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
          <div className="bg-white border border-[#ebdccb]/60 p-6 rounded-2xl shadow-sm">
            <div className="text-3xl font-bold text-[#0f0d0b] mb-1">
              {products?.length || 0}
            </div>
            <div className="text-[#8e8577] font-medium uppercase tracking-wider text-sm">
              Total Products
            </div>
          </div>
          <div className="bg-white border border-[#ebdccb]/60 p-6 rounded-2xl shadow-sm">
            <div className="text-3xl font-bold text-emerald-600 mb-1">
              {products?.reduce(
                (total, product) => total + (product.countInStock || 0),
                0,
              ) || 0}
            </div>
            <div className="text-[#8e8577] font-medium uppercase tracking-wider text-sm">
              Total Stock Units
            </div>
          </div>
          <div className="bg-white border border-[#ebdccb]/60 p-6 rounded-2xl shadow-sm">
            <div className="text-3xl font-bold text-[#0f0d0b] mb-1">
              {new Set(products?.map((p) => p.category)).size || 0}
            </div>
            <div className="text-[#8e8577] font-medium uppercase tracking-wider text-sm">
              Categories
            </div>
          </div>
          <div className="bg-white border border-[#ebdccb]/60 p-6 rounded-2xl shadow-sm">
            <div className="text-3xl font-bold text-[#a87b32] mb-1 truncate">
              ₹
              {(
                products?.reduce(
                  (total, product) => total + (product.price || 0),
                  0,
                ) || 0
              ).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="text-[#8e8577] font-medium uppercase tracking-wider text-sm">
              Avg Price Potential
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#ebdccb]/60 p-8 rounded-2xl shadow-lg max-w-md w-full">
            <h3
              className="text-2xl font-light text-[#0f0d0b] mb-3"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Confirm Deletion
            </h3>
            <p className="text-[#5c5548] mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#0f0d0b]">
                "{productToDelete?.name}"
              </span>
              ?
            </p>
            <p className="text-red-500 bg-red-50 px-4 py-3 rounded-xl text-sm font-medium mb-8">
              ⚠️ This action cannot be undone and will permanently remove the
              product from your catalog.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleDeleteCancel}
                className="px-6 py-2.5 border border-[#ebdccb] text-[#5c5548] rounded-xl hover:border-[#c9973f]/60 hover:text-[#0f0d0b] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
