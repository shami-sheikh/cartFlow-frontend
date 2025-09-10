import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiArrowLeft, FiEdit2, FiTrash2, FiPackage, FiTag, FiDollarSign, FiBox, FiAlertCircle } from "react-icons/fi";
import { fetchAdminProductById } from "../../redux/slices/adminProductSlice";

const AdminProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { productDetails, loading, error } = useSelector((state) => state.adminProducts);

  useEffect(() => {
    if (id) {
      dispatch(fetchAdminProductById(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-yellow-400 text-lg">Loading product details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-red-400 text-lg">Error: {error}</div>
      </div>
    );
  }

  if (!productDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-gray-400 text-lg">Product not found</div>
      </div>
    );
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: "Out of Stock", color: "text-red-400 bg-red-500/10" };
    if (stock < 10) return { text: "Low Stock", color: "text-yellow-400 bg-yellow-500/10" };
    return { text: "In Stock", color: "text-green-400 bg-green-500/10" };
  };

  const stockStatus = getStockStatus(productDetails.stock);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            to="/admin/products"
            className="flex items-center text-gray-400 hover:text-yellow-400 transition-colors mr-6"
          >
            <FiArrowLeft className="mr-2" />
            Back to Products
          </Link>
          <h2 className="text-3xl font-bold text-white">
            Product <span className="text-yellow-400">Details</span>
          </h2>
        </div>

        {/* Product Content */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-xl overflow-hidden">
          {/* Header with Actions */}
          <div className="flex justify-between items-center p-6 border-b border-gray-700">
            <div>
              <h1 className="text-2xl font-bold text-white">{productDetails.name}</h1>
              <p className="text-gray-400">{productDetails.category}</p>
            </div>
            <div className="flex gap-3">
              <Link
                to={`/admin/products/${id}/edit`}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FiEdit2 className="text-sm" />
                Edit Product
              </Link>
              <button
                onClick={() => navigate('/admin/products')}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FiTrash2 className="text-sm" />
                Delete
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image */}
              <div>
                <div className="bg-gray-750 border border-gray-700 rounded-2xl p-6 h-96 flex items-center justify-center">
                  {productDetails.image ? (
                    <img
                      src={productDetails.image}
                      alt={productDetails.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <FiPackage className="text-8xl text-gray-500" />
                  )}
                </div>
              </div>

              {/* Product Details */}
              <div>
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-750 border border-gray-700 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <FiDollarSign />
                        <span className="text-sm">Price</span>
                      </div>
                      <div className="text-2xl font-bold text-yellow-400">₹{productDetails.price}</div>
                    </div>

                    <div className="bg-gray-750 border border-gray-700 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <FiBox />
                        <span className="text-sm">Stock</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{productDetails.stock}</div>
                      <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${stockStatus.color}`}>
                        {stockStatus.text}
                      </div>
                    </div>
                  </div>

                  {/* SKU */}
                  <div className="bg-gray-750 border border-gray-700 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <FiTag />
                      <span className="text-sm">SKU</span>
                    </div>
                    <div className="text-lg font-mono text-white">{productDetails.sku}</div>
                  </div>

                  {/* Description */}
                  {productDetails.description && (
                    <div className="bg-gray-750 border border-gray-700 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                      <p className="text-gray-300 leading-relaxed">{productDetails.description}</p>
                    </div>
                  )}

                  {/* Additional Details */}
                  <div className="bg-gray-750 border border-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-3">Product Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Category:</span>
                        <span className="text-white">{productDetails.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${stockStatus.color}`}>
                          {stockStatus.text}
                        </span>
                      </div>
                      {productDetails.brand && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Brand:</span>
                          <span className="text-white">{productDetails.brand}</span>
                        </div>
                      )}
                      {productDetails.weight && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Weight:</span>
                          <span className="text-white">{productDetails.weight}</span>
                        </div>
                      )}
                      {productDetails.dimensions && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Dimensions:</span>
                          <span className="text-white">{productDetails.dimensions}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Sections */}
            {productDetails.features && (
              <div className="mt-8 bg-gray-750 border border-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {productDetails.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-300">
                      <FiAlertCircle className="text-yellow-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {productDetails.specifications && (
              <div className="mt-6 bg-gray-750 border border-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Specifications</h3>
                <div className="space-y-3">
                  {Object.entries(productDetails.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400 capitalize">{key}:</span>
                      <span className="text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gray-800 bg-opacity-50 border border-gray-700 p-6 rounded-2xl">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              ₹{(productDetails.price * productDetails.stock).toLocaleString()}
            </div>
            <div className="text-gray-300">Inventory Value</div>
          </div>
          <div className="bg-gray-800 bg-opacity-50 border border-gray-700 p-6 rounded-2xl">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {productDetails.stock}
            </div>
            <div className="text-gray-300">Units Available</div>
          </div>
          <div className="bg-gray-800 bg-opacity-50 border border-gray-700 p-6 rounded-2xl">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {productDetails.category}
            </div>
            <div className="text-gray-300">Category</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductDetails;