import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PulseLoader } from "react-spinners";
import ProductGrid from "./ProductGrid";
import { IoReturnDownBackOutline } from "react-icons/io5";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FetchProductDetails,
  similarProducts,
} from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import { motion } from "framer-motion";

const ProductDetails = ({ productId }) => {
  const dispatch = useDispatch();
  const { selectedProduct, similar, loading, error } = useSelector((state) => state.products);
  const cartLoading = useSelector((state) => state.cart.loading);
  const { user, guestId } = useSelector((state) => state.auth);
  const { id } = useParams();
  const [mainImage, setMainImage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const ProductFetchId = productId || id;

  // Fetch product + similar
  useEffect(() => {
    if (ProductFetchId) {
      dispatch(FetchProductDetails(ProductFetchId));
      dispatch(similarProducts({ id: ProductFetchId }));
    }
  }, [dispatch, ProductFetchId]);

  // Update main image when product changes
  useEffect(() => {
    if (selectedProduct?.images?.length) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      quantity: 1,
      size: "",
      color: "",
    },
  });

  // Auto-select the first available size and color when a product loads
  useEffect(() => {
    if (selectedProduct?.sizes?.length) {
      setValue("size", selectedProduct.sizes[0]);
    }
    if (selectedProduct?.colors?.length) {
      setValue("color", selectedProduct.colors[0]);
    }
  }, [selectedProduct, setValue]);

  const quantity = watch("quantity");
  const selectedSize = watch("size");
  const selectedColor = watch("color");

  // Color name to hex mapping (extend as needed)
  const COLOR_HEX_MAP = {
    Red: "#FF4D4F",
    Blue: "#1890FF",
    Green: "#52C41A",
    Black: "#000000",
    White: "#FFFFFF",
    Yellow: "#FADB14",
    Pink: "#FF85C0",
    Beige: "#F5F5DC",
    Navy: "#001F3F",
    Gray: "#8C8C8C",
    "Navy Blue": "#001F3F",
    Burgundy: "#800020",
    "Light Blue": "#ADD8E6",
    "Dark Wash": "#223A5E",
    "Tropical Print": "#2EC4B6",
    "Navy Palms": "#254E70",
    Olive: "#808000",
    Charcoal: "#36454F",
    "Dark Green": "#013220",
    Brown: "#8B4513",
    Lavender: "#E6E6FA",
    Khaki: "#F0E68C",
  };

  const handleIncrease = () => setValue("quantity", quantity + 1);
  const handleDecrease = () =>
    setValue("quantity", quantity > 1 ? quantity - 1 : 1);

  const onSubmit = async (data) => {
    if (!data.size || !data.color) {
      toast.error("Please select a size and color", { duration: 2000 });
      return;
    }

    dispatch(
      addToCart({
        productId: ProductFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        image: mainImage,
        guestId,
        userId: user?._id,
      })
    ).then((action) => {
      if (!action.error) {
        toast.success("Product added to cart", { duration: 2000 });
        reset({ quantity: 1 });
      }
    });
  };

  if (loading)
    return (
      <p className="text-center py-20 text-[#8e8577]">Loading...</p>
    );
  if (error)
    return (
      <p className="text-center py-20 text-red-500">Error: {error}</p>
    );

  return (
    <>
      <section className="p-6 min-h-screen bg-[#fcfaf6]">
        {/* Back button */}
        {location.pathname !== "/" && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2.5
                border border-[#c9973f] text-[#a87b32]
                hover:bg-[#c9973f] hover:text-white
                font-semibold rounded-lg transition"
            >
              <IoReturnDownBackOutline className="text-lg" />
              <span className="font-medium">Back</span>
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {selectedProduct && (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-8">
              {/* Left Side - Images */}
              <div className="md:w-1/2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="mb-4"
                >
                  <img
                    src={mainImage}
                    alt="Main Product"
                    className="w-full max-h-[500px] object-cover rounded-xl shadow-sm border border-[#ebdccb] bg-[#f0ece2]"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/500x500/f0ece2/a87b32?text=Image+Not+Found";
                    }}
                  />
                </motion.div>

                {/* Thumbnails for desktop (grid layout) */}
                <div className="hidden md:grid grid-cols-4 gap-3">
                  {selectedProduct.images?.map((image, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className={`cursor-pointer border-2 rounded-lg overflow-hidden ${
                        mainImage === image.url
                          ? "border-[#c9973f]"
                          : "border-[#ebdccb]"
                      }`}
                      onClick={() => setMainImage(image.url)}
                    >
                      <img
                        src={image.url}
                        alt={image.alt || `Thumbnail ${index + 1}`}
                        className="w-full h-20 object-cover bg-[#f0ece2]"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/100x100/f0ece2/a87b32?text=Image+Error";
                        }}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Thumbnails for mobile (horizontal scroll) */}
                <div className="flex md:hidden overflow-x-auto gap-3 mt-4 w-full pb-2">
                  {selectedProduct.images?.map((image, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      className={`flex-shrink-0 cursor-pointer border-2 rounded-lg overflow-hidden ${
                        mainImage === image.url
                          ? "border-[#c9973f]"
                          : "border-[#ebdccb]"
                      }`}
                      onClick={() => setMainImage(image.url)}
                    >
                      <img
                        src={image.url}
                        alt={image.alt || `Thumbnail ${index + 1}`}
                        className="w-20 h-20 object-cover bg-[#f0ece2]"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/100x100/f0ece2/a87b32?text=Image+Error";
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Side */}
              <div className="md:w-1/2 space-y-6">
                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold text-[#0f0d0b]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {selectedProduct.name}
                </motion.h1>

                {/* Description */}
                <p className="text-[#5c5548] leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Price */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-extrabold text-[#a87b32]">
                    ₹{selectedProduct.price}
                  </span>
                  {selectedProduct.originalPrice && (
                    <span className="line-through text-[#aba293]">
                      ₹{selectedProduct.originalPrice}
                    </span>
                  )}
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <h3 className="font-semibold text-[#0f0d0b]">Quantity:</h3>
                  <div className="flex items-center border border-[#c9973f] rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={handleDecrease}
                      className="px-4 py-2 hover:bg-[#c9973f] hover:text-white text-[#a87b32] font-bold text-lg transition"
                    >
                      −
                    </button>
                    <span className="px-6 py-2 bg-[#f0ece2] text-[#0f0d0b] font-semibold">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={handleIncrease}
                      className="px-4 py-2 hover:bg-[#c9973f] hover:text-white transition text-[#a87b32] font-bold text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Sizes */}
                {selectedProduct.sizes?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-[#0f0d0b] mb-2">Sizes</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.sizes.map((size, index) => (
                        <motion.button
                          key={index}
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          onClick={() => setValue("size", size)}
                          className={`px-3 py-1 border border-[#c9973f] rounded-lg transition
                            ${
                              selectedSize === size
                                ? "bg-[#c9973f] text-white"
                                : "text-[#0f0d0b] hover:bg-[#f0ece2]"
                            }`}
                        >
                          {size}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Colors */}
                {selectedProduct.colors?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-[#0f0d0b] mb-2">
                      Colors
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.colors.map((color, index) => {
                        const hex = COLOR_HEX_MAP[color] || "#CCCCCC";
                        return (
                          <motion.button
                            key={index}
                            type="button"
                            whileHover={{ scale: 1.15 }}
                            onClick={() => setValue("color", color)}
                            className={`w-8 h-8 rounded-full cursor-pointer transition border-2 shadow-sm ${
                              selectedColor === color
                                ? "border-[#c9973f]"
                                : "border-[#e1dacd]"
                            }`}
                            style={{ backgroundColor: hex, filter: selectedColor === color ? "brightness(0.92)" : "none" }}
                            title={color}
                          ></motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <motion.button
                  type="submit"
                  disabled={cartLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 ${
                    cartLoading && "cursor-not-allowed opacity-50"
                  } py-3 w-full bg-[#0f0d0b] text-white hover:bg-[#c9973f] font-semibold rounded-lg transition flex justify-center items-center`}
                >
                  {cartLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      Adding... <PulseLoader size={8} color="#fff" />
                    </span>
                  ) : (
                    "Add to Cart"
                  )}
                </motion.button>
              </div>
            </form>
          )}
        </motion.div>
      </section>

      {/* Similar Products */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-[#fcfaf6]"
      >
        <h2
          className="text-[#0f0d0b] font-light md:text-3xl text-2xl mt-8 text-center"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          You may also like
        </h2>
        <div className="h-[3px] w-44 mt-3 mx-auto rounded-full bg-gradient-to-r from-[#c9973f] to-[#a87b32]"></div>
        <div className="max-w-6xl mx-auto p-8">
          <ProductGrid products={similar} loading={loading} error={error} />
        </div>
      </motion.div>
    </>
  );
};

export default ProductDetails;