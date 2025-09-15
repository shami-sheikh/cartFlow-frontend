import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { X, Upload } from "lucide-react";
import {
  fetchAdminProductById,
  updateAdminProduct,
} from "../../redux/slices/adminProductSlice";

const ProductEditPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { productDetails, loading, error } = useSelector((state) => state.adminProducts);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    discountPrice: "",
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: "",
    colors: "",
    collections: "",
    material: "",
    gender: "",
    rating: "",
    numReviews: "",
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (productDetails) {
      setFormData({
        name: productDetails.name || "",
        description: productDetails.description || "",
        price: productDetails.price || 0,
        discountPrice: productDetails.discountPrice || "",
        countInStock: productDetails.countInStock || 0,
        sku: productDetails.sku || "",
        category: productDetails.category || "",
        brand: productDetails.brand || "",
        sizes: productDetails.sizes?.join(", ") || "",
        colors: productDetails.colors?.join(", ") || "",
        collections: productDetails.collections || "",
        material: productDetails.material || "",
        gender: productDetails.gender || "",
        rating: productDetails.rating || "",
        numReviews: productDetails.numReviews || "",
      });

      if (productDetails.images?.length > 0) {
        setImagePreviews(productDetails.images.map((img) => img.url));
      }
    }
  }, [productDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Upload image to Cloudinary via backend
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formDataUpload = new FormData();
    files.forEach(file => {
      formDataUpload.append("image", file);
    });

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formDataUpload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`
          }
        }
      );

      // Add new images to previews
      const newImageUrl = data.imageUrl;
      setImagePreviews((prev) => [...prev, newImageUrl]);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedData = {
      ...formData,
      sizes: formData.sizes
        ? formData.sizes.split(",").map((s) => s.trim())
        : [],
      colors: formData.colors
        ? formData.colors.split(",").map((c) => c.trim())
        : [],
      images: imagePreviews.map(url => ({ url, altText: formData.name }))
    };

    dispatch(updateAdminProduct({ id, updates: updatedData }))
      .unwrap()
      .then(() => {
        toast.success("Product updated successfully!");
        setTimeout(() => navigate("/admin/products"), 800);
      })
      .catch(console.error);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-yellow-400 text-lg">Loading product...</div>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1714] to-[#2a2520] py-8 px-4">
      <div className="max-w-4xl mx-auto bg-[#1F1A16] rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#C6A15B] to-[#8C6C3A] p-6">
          <h2 className="text-3xl font-bold text-black">Edit Product</h2>
          <p className="text-black/80 mt-1">Manage your product details</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#f6e6b7]">Product Name *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#29221C] border border-[#3D342D] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6A15B] transition-all"
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#f6e6b7]">SKU *</label>
              <input
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#29221C] border border-[#3D342D] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6A15B] transition-all"
                placeholder="Product SKU"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-[#f6e6b7]">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-[#29221C] border border-[#3D342D] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6A15B] transition-all"
              placeholder="Describe your product..."
              required
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#f6e6b7]">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#29221C] border border-[#3D342D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C6A15B] transition-all"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#f6e6b7]">Stock Count *</label>
              <input
                type="number"
                name="countInStock"
                value={formData.countInStock}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#29221C] border border-[#3D342D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C6A15B] transition-all"
                required
                min="0"
              />
            </div>
          </div>

          {/* Discount Price, Category, Brand, Collection, Material, Gender, Rating, NumReviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#f6e6b7]">Discount Price</label>
              <input
                type="number"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#29221C] border border-[#3D342D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C6A15B] transition-all"
                min="0"
                placeholder="Enter discount price (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#f6e6b7]">Category *</label>
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#29221C] border border-[#3D342D] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6A15B] transition-all"
                placeholder="Enter category"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#f6e6b7]">Brand</label>
              <input
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#29221C] border border-[#3D342D] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6A15B] transition-all"
                placeholder="Enter brand"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#f6e6b7]">Collection *</label>
              <input
                name="collections"
                value={formData.collections}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#29221C] border border-[#3D342D] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6A15B] transition-all"
                placeholder="Enter collection"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#f6e6b7]">Material</label>
              <input
                name="material"
                value={formData.material}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#29221C] border border-[#3D342D] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6A15B] transition-all"
                placeholder="Enter material"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#f6e6b7]">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#29221C] border border-[#3D342D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C6A15B] transition-all"
              >
                <option value="">Select Gender</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-[#f6e6b7]">Rating</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#29221C] border border-[#3D342D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C6A15B] transition-all"
                min="0"
                max="5"
                step="0.1"
                placeholder="Enter rating (0-5)"
              />
            </div>

            {/* Number of Reviews */}
            <div>
              <label className="block text-sm font-semibold text-[#f6e6b7]">Number of Reviews</label>
              <input
                type="number"
                name="numReviews"
                value={formData.numReviews}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#29221C] border border-[#3D342D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C6A15B] transition-all"
                min="0"
                placeholder="Enter number of reviews"
              />
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-semibold text-[#f6e6b7]">Sizes (comma separated)</label>
            <input
              name="sizes"
              value={formData.sizes}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#29221C] border border-[#3D342D] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6A15B] transition-all"
              placeholder="S, M, L, XL"
            />
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-semibold text-[#f6e6b7]">Colors (comma separated)</label>
            <input
              name="colors"
              value={formData.colors}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#29221C] border border-[#3D342D] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6A15B] transition-all"
              placeholder="Red, Blue, Green"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-[#f6e6b7]">Product Images</label>
            <div className="border-2 border-dashed border-[#3D342D] rounded-lg p-6 text-center">
              {uploading && <p className="text-yellow-400">Uploading images...</p>}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="mx-auto text-[#C6A15B] mb-2" size={24} />
                <p className="text-gray-400">Click to upload images or drag and drop</p>
                <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </label>
            </div>
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {imagePreviews.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={img} alt={`preview-${i}`} className="w-full h-32 object-cover rounded-lg" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-6 border-t border-[#3D342D]">
            <button type="submit" className="px-8 py-3 bg-[#C6A15B] text-black font-semibold rounded-lg hover:bg-[#d4b16c] transition-colors">
              Update Product
            </button>
            <button type="button" onClick={() => navigate("/admin/products")} className="px-8 py-3 border border-[#3D342D] text-gray-300 rounded-lg hover:bg-[#3D342D] transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditPage;