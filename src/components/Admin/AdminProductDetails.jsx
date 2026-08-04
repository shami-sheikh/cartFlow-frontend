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
      <div className="min-h-[80vh] flex items-center justify-center bg-[#fcfaf6]">
        <div className="text-[#8e8577] font-medium text-lg">Loading product details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#fcfaf6]">
        <div className="text-red-500 font-medium text-lg">Error: {error}</div>
      </div>
    );
  }

  if (!productDetails) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#fcfaf6]">
        <div className="text-[#8e8577] font-medium text-lg">Product not found</div>
      </div>
    );
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: "Out of Stock", color: "text-red-500 bg-red-50 border border-red-100" };
    if (stock < 10) return { text: "Low Stock", color: "text-[#a87b32] bg-[#fcfaf6] border border-[#ebdccb]" };
    return { text: "In Stock", color: "text-emerald-600 bg-emerald-50 border border-emerald-100" };
  };

  const stockStatus = getStockStatus(productDetails.stock);

  return (
    <div className="min-h-screen bg-[#fcfaf6] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            to="/admin/products"
            className="flex items-center text-[#5c5548] hover:text-[#0f0d0b] font-medium transition-colors mr-6"
          >
            <FiArrowLeft className="mr-2" />
            Back
          </Link>
          <h2
            className="text-3xl font-light text-[#0f0d0b]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Product Details
          </h2>
        </div>

        {/* Product Content */}
        <div className="bg-white border border-[#ebdccb]/60 rounded-2xl shadow-sm overflow-hidden">
          {/* Header with Actions */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center p-6 border-b border-[#ebdccb]/60 gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-[#0f0d0b]">{productDetails.name}</h1>
              <p className="text-[#8e8577]">{productDetails.category}</p>
            </div>
            <div className="flex gap-3">
              <Link
                to={`/admin/products/${id}/edit`}
                className="bg-[#fcfaf6] border border-[#ebdccb] hover:border-[#c9973f]/60 text-[#0f0d0b] px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors font-medium shadow-sm"
              >
                <FiEdit2 className="text-sm" />
                Edit Product
              </Link>
              <button
                onClick={() => navigate('/admin/products')}
                className="bg-red-50 border border-red-100 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors font-medium"
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
                <div className="bg-[#f0ece2] border border-[#ebdccb] rounded-2xl p-6 h-96 flex items-center justify-center overflow-hidden">
                  {productDetails.image ? (
                    <img
                      src={productDetails.image}
                      alt={productDetails.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <FiPackage className="text-8xl text-[#aba293]" />
                  )}
                </div>
              </div>

              {/* Product Details */}
              <div>
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white border border-[#ebdccb]/60 shadow-sm p-5 rounded-xl">
                      <div className="flex items-center gap-2 text-[#8e8577] mb-2 font-medium">
                        <FiDollarSign className="text-[#c9973f]" />
                        <span className="text-sm uppercase tracking-wider">Price</span>
                      </div>
                      <div className="text-2xl font-bold text-[#a87b32]">₹{productDetails.price}</div>
                    </div>

                    <div className="bg-white border border-[#ebdccb]/60 shadow-sm p-5 rounded-xl">
                      <div className="flex items-center gap-2 text-[#8e8577] mb-2 font-medium">
                        <FiBox className="text-[#c9973f]" />
                        <span className="text-sm uppercase tracking-wider">Stock</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-[#0f0d0b]">{productDetails.stock}</div>
                        <div className={`text-xs px-2.5 py-1 rounded-full font-medium ${stockStatus.color}`}>
                          {stockStatus.text}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SKU */}
                  <div className="bg-white border border-[#ebdccb]/60 shadow-sm p-5 rounded-xl">
                    <div className="flex items-center gap-2 text-[#8e8577] mb-2 font-medium">
                      <FiTag className="text-[#c9973f]" />
                      <span className="text-sm uppercase tracking-wider">SKU</span>
                    </div>
                    <div className="text-lg font-mono font-medium text-[#0f0d0b]">{productDetails.sku}</div>
                  </div>

                  {/* Description */}
                  {productDetails.description && (
                    <div className="bg-white border border-[#ebdccb]/60 shadow-sm p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-[#0f0d0b] mb-3">Description</h3>
                      <p className="text-[#5c5548] leading-relaxed">{productDetails.description}</p>
                    </div>
                  )}

                  {/* Additional Details */}
                  <div className="bg-white border border-[#ebdccb]/60 shadow-sm p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-[#0f0d0b] mb-4">Product Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center border-b border-[#ebdccb]/30 pb-2">
                        <span className="text-[#8e8577] font-medium">Category</span>
                        <span className="text-[#0f0d0b] font-medium">{productDetails.category}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-[#ebdccb]/30 pb-2">
                        <span className="text-[#8e8577] font-medium">Status</span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${stockStatus.color}`}>
                          {stockStatus.text}
                        </span>
                      </div>
                      {productDetails.brand && (
                        <div className="flex justify-between items-center border-b border-[#ebdccb]/30 pb-2">
                          <span className="text-[#8e8577] font-medium">Brand</span>
                          <span className="text-[#0f0d0b] font-medium">{productDetails.brand}</span>
                        </div>
                      )}
                      {productDetails.weight && (
                        <div className="flex justify-between items-center border-b border-[#ebdccb]/30 pb-2">
                          <span className="text-[#8e8577] font-medium">Weight</span>
                          <span className="text-[#0f0d0b] font-medium">{productDetails.weight}</span>
                        </div>
                      )}
                      {productDetails.dimensions && (
                        <div className="flex justify-between items-center">
                          <span className="text-[#8e8577] font-medium">Dimensions</span>
                          <span className="text-[#0f0d0b] font-medium">{productDetails.dimensions}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Sections */}
            {productDetails.features && (
              <div className="mt-8 bg-[#fcfaf6] border border-[#ebdccb]/60 shadow-sm p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-[#0f0d0b] mb-4">Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {productDetails.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-[#5c5548]">
                      <FiAlertCircle className="text-[#a87b32] mt-1 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {productDetails.specifications && (
              <div className="mt-6 bg-[#fcfaf6] border border-[#ebdccb]/60 shadow-sm p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-[#0f0d0b] mb-4">Specifications</h3>
                <div className="space-y-3">
                  {Object.entries(productDetails.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center border-b border-[#ebdccb]/40 pb-3">
                      <span className="text-[#8e8577] font-medium capitalize">{key}</span>
                      <span className="text-[#0f0d0b] font-medium text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white border border-[#ebdccb]/60 shadow-sm p-6 rounded-2xl">
            <div className="text-3xl font-bold text-[#a87b32] mb-1">
              ₹{(productDetails.price * productDetails.stock).toLocaleString()}
            </div>
            <div className="text-[#8e8577] font-medium uppercase tracking-wider text-sm">Inventory Value</div>
          </div>
          <div className="bg-white border border-[#ebdccb]/60 shadow-sm p-6 rounded-2xl">
            <div className="text-3xl font-bold text-[#0f0d0b] mb-1">
              {productDetails.stock}
            </div>
            <div className="text-[#8e8577] font-medium uppercase tracking-wider text-sm">Units Available</div>
          </div>
          <div className="bg-white border border-[#ebdccb]/60 shadow-sm p-6 rounded-2xl">
            <div className="text-3xl font-bold text-[#0f0d0b] mb-1 truncate">
              {productDetails.category}
            </div>
            <div className="text-[#8e8577] font-medium uppercase tracking-wider text-sm">Category</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductDetails;