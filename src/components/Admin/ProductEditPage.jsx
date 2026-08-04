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
      <div className="min-h-screen bg-[#fcfaf6] flex items-center justify-center text-[#8e8577]">
        Loading product...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fcfaf6] flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  const inputClasses = "w-full px-4 py-3 bg-[#fcfaf6] border border-[#e1dacd] rounded-xl text-[#0f0d0b] placeholder-[#aba293] focus:outline-none focus:ring-1 focus:ring-[#c9973f]/40 focus:border-[#c9973f] hover:border-[#c9973f]/60 transition-colors";
  const labelClasses = "block text-sm text-[#0f0d0b] mb-2 font-medium";

  return (
    <div className="min-h-screen bg-[#fcfaf6] py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-[#ebdccb]/60 overflow-hidden">
        <div className="p-8 border-b border-[#ebdccb]/60 bg-[#fcfaf6]">
          <h2
            className="text-3xl font-light text-[#0f0d0b]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Edit Product
          </h2>
          <p className="text-[#8e8577] mt-2">Manage your product details</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Product Name *</label>
              <input name="name" value={formData.name} onChange={handleChange} className={inputClasses} placeholder="Enter product name" required />
            </div>
            <div>
              <label className={labelClasses}>SKU *</label>
              <input name="sku" value={formData.sku} onChange={handleChange} className={inputClasses} placeholder="Product SKU" required />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelClasses}>Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className={inputClasses} placeholder="Describe your product..." required />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Price (₹) *</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className={inputClasses} required min="0" />
            </div>
            <div>
              <label className={labelClasses}>Stock Count *</label>
              <input type="number" name="countInStock" value={formData.countInStock} onChange={handleChange} className={inputClasses} required min="0" />
            </div>
          </div>

          {/* Category, Brand, Collection, Material, Gender, Rating, NumReviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Discount Price</label>
              <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} className={inputClasses} min="0" placeholder="Enter discount price (optional)" />
            </div>
            <div>
              <label className={labelClasses}>Category *</label>
              <input name="category" value={formData.category} onChange={handleChange} className={inputClasses} placeholder="Enter category" required />
            </div>
            <div>
              <label className={labelClasses}>Brand</label>
              <input name="brand" value={formData.brand} onChange={handleChange} className={inputClasses} placeholder="Enter brand" />
            </div>
            <div>
              <label className={labelClasses}>Collection *</label>
              <input name="collections" value={formData.collections} onChange={handleChange} className={inputClasses} placeholder="Enter collection" required />
            </div>
            <div>
              <label className={labelClasses}>Material</label>
              <input name="material" value={formData.material} onChange={handleChange} className={inputClasses} placeholder="Enter material" />
            </div>
            <div>
              <label className={labelClasses}>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className={inputClasses}>
                <option value="">Select Gender</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>
            <div>
              <label className={labelClasses}>Rating</label>
              <input type="number" name="rating" value={formData.rating} onChange={handleChange} className={inputClasses} min="0" max="5" step="0.1" placeholder="Enter rating (0-5)" />
            </div>
            <div>
              <label className={labelClasses}>Number of Reviews</label>
              <input type="number" name="numReviews" value={formData.numReviews} onChange={handleChange} className={inputClasses} min="0" placeholder="Enter number of reviews" />
            </div>
          </div>

          {/* Sizes and Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Sizes (comma separated)</label>
              <input name="sizes" value={formData.sizes} onChange={handleChange} className={inputClasses} placeholder="S, M, L, XL" />
            </div>
            <div>
              <label className={labelClasses}>Colors (comma separated)</label>
              <input name="colors" value={formData.colors} onChange={handleChange} className={inputClasses} placeholder="Red, Blue, Green" />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className={labelClasses}>Product Images</label>
            <div className="border-2 border-dashed border-[#ebdccb] bg-[#fcfaf6] hover:border-[#c9973f]/60 transition-colors rounded-xl p-8 text-center cursor-pointer relative">
              {uploading && <p className="text-[#a87b32] font-medium mb-2">Uploading images...</p>}
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="image-upload" />
              <div className="pointer-events-none">
                <Upload className="mx-auto text-[#a87b32] mb-3" size={28} />
                <p className="text-[#5c5548] font-medium">Click to upload images or drag and drop</p>
                <p className="text-sm text-[#8e8577] mt-1">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {imagePreviews.map((img, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden border border-[#ebdccb]">
                    <img src={img} alt={`preview-${i}`} className="w-full h-32 object-cover bg-[#f0ece2]" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 bg-white text-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-8 border-t border-[#ebdccb]/60">
            <button type="submit" disabled={loading || uploading} className="px-8 py-3 bg-[#0f0d0b] text-white font-semibold rounded-xl hover:bg-[#c9973f] transition-colors disabled:opacity-50">
              Update Product
            </button>
            <button type="button" onClick={() => navigate("/admin/products")} className="px-8 py-3 border border-[#ebdccb] text-[#5c5548] font-medium rounded-xl hover:border-[#c9973f]/60 hover:text-[#0f0d0b] transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditPage;