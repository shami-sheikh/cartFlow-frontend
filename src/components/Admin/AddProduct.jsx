import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { addAdminProduct } from "../../redux/slices/adminProductSlice";

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.adminProducts);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    salePrice: "",
    stock: "",
    category: "",
    brand: "",
    sizes: "",
    colors: "",
    collections: "",
    material: "",
    gender: "",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  // handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // upload images to Cloudinary (via your backend route /api/upload)
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    try {
      const uploadedUrls = [];

      for (let file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        uploadedUrls.push(data.url);
      }

      setImages((prev) => [...prev, ...uploadedUrls]);
      setImagePreviews((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      console.error("Image upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  // submit product
  const handleSubmit = (e) => {
    e.preventDefault();

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
      stock: parseInt(formData.stock),
      sizes: formData.sizes
        ? formData.sizes.split(",").map((s) => s.trim())
        : [],
      colors: formData.colors
        ? formData.colors.split(",").map((c) => c.trim())
        : [],
      images,
    };

    dispatch(addAdminProduct(productData))
      .unwrap()
      .then(() => navigate("/admin/products"))
      .catch((err) => console.error(err));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-6">
      <div className="bg-gray-800 shadow-xl rounded-2xl w-full max-w-3xl p-8">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6">
          Add New Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="border p-3 w-full rounded bg-gray-700 text-white"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-3 w-full rounded bg-gray-700 text-white"
            required
          />
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="border p-3 w-full rounded bg-gray-700 text-white"
            required
          />
          <input
            name="salePrice"
            type="number"
            value={formData.salePrice}
            onChange={handleChange}
            placeholder="Sale Price"
            className="border p-3 w-full rounded bg-gray-700 text-white"
          />
          <input
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Stock Count"
            className="border p-3 w-full rounded bg-gray-700 text-white"
            required
          />
          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            className="border p-3 w-full rounded bg-gray-700 text-white"
          />
          <input
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Brand"
            className="border p-3 w-full rounded bg-gray-700 text-white"
          />
          <input
            name="sizes"
            value={formData.sizes}
            onChange={handleChange}
            placeholder="Sizes (comma separated)"
            className="border p-3 w-full rounded bg-gray-700 text-white"
          />
          <input
            name="colors"
            value={formData.colors}
            onChange={handleChange}
            placeholder="Colors (comma separated)"
            className="border p-3 w-full rounded bg-gray-700 text-white"
          />
          <input
            name="collections"
            value={formData.collections}
            onChange={handleChange}
            placeholder="Collection"
            className="border p-3 w-full rounded bg-gray-700 text-white"
          />
          <input
            name="material"
            value={formData.material}
            onChange={handleChange}
            placeholder="Material"
            className="border p-3 w-full rounded bg-gray-700 text-white"
          />
          <input
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            placeholder="Gender"
            className="border p-3 w-full rounded bg-gray-700 text-white"
          />

          {/* Image Upload */}
          <div>
            <label className="block font-medium mb-2">Upload Images</label>
            <input
              type="file"
              multiple
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 
                         file:rounded-full file:border-0 file:text-sm file:font-semibold 
                         file:bg-yellow-500 file:text-gray-900 hover:file:bg-yellow-600"
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {imagePreviews.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Preview ${i}`}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-600"
                />
              ))}
            </div>
            {uploading && <p className="text-yellow-400 mt-2">Uploading...</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 
                       hover:from-yellow-600 hover:to-yellow-700 text-gray-900 
                       font-semibold px-8 py-3 rounded-lg transition-all 
                       duration-300 shadow-lg hover:shadow-yellow-500/20 
                       disabled:opacity-50"
          >
            {loading || uploading ? "Saving..." : "Create Product"}
          </button>

          {error && <p className="text-red-400 mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
