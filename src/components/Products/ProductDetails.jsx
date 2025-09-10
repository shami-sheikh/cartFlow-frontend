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
  const { selectedProduct, similar, loading, error } = useSelector(
    (state) => state.products
  );
  const { user, guestId } = useSelector((state) => state.auth);
  const { id } = useParams();
  const [mainImage, setMainImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  // useForm
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

  const quantity = watch("quantity");
  const selectedSize = watch("size");
  const selectedColor = watch("color");

  const handleIncrease = () => setValue("quantity", quantity + 1);
  const handleDecrease = () =>
    setValue("quantity", quantity > 1 ? quantity - 1 : 1);

  const onSubmit = async (data) => {
    if (!data.size || !data.color) {
      toast.error("Please select a size and color", { duration: 2000 });
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(
        addToCart({
          productId: ProductFetchId,
          quantity,
          size: selectedSize,
          color: selectedColor,
          guestId,
          userId: user?._id,
        })
      );
      toast.success("Product added to cart", { duration: 2000 });
      reset({ quantity: 1 }); // reset only quantity
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center">Error: {error}</p>;

  return (
    <>
      <section className="p-6 min-h-screen">
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
                border border-[#eacd89] text-[#eacd89] 
                hover:bg-[#eacd89] hover:text-black 
                font-semibold rounded-lg transition"
            >
              <IoReturnDownBackOutline className="text-lg" />
              <span className="font-medium">Back</span>
            </button>
          </motion.div>
        )}

        {/* Product card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-6xl mx-auto p-8 rounded-2xl shadow-2xl bg-[#26211d] text-white"
        >
          {selectedProduct && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col md:flex-row gap-10"
            >
              {/* Thumbnails */}
              <div className="hidden md:flex flex-col space-y-4">
                {selectedProduct.images?.map((image, index) => (
                  <motion.img
                    key={index}
                    src={image.url}
                    alt={image.alt || "thumbnail"}
                    whileHover={{ scale: 1.1 }}
                    className="w-20 h-20 object-cover rounded-lg cursor-pointer border border-[#eacd89] transition"
                    onClick={() => setMainImage(image.url)}
                  />
                ))}
              </div>

              {/* Main Image */}
              <motion.div
                layout
                className="md:w-1/2 flex justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src={mainImage}
                  alt="Main Product"
                  className="w-full max-h-[500px] object-cover rounded-xl shadow-lg border border-[#eacd89]/40"
                />
              </motion.div>

              {/* Right Side */}
              <div className="md:w-1/2 space-y-6">
                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold text-[#eacd89]"
                >
                  {selectedProduct.name}
                </motion.h1>

                {/* Description */}
                <p className="text-gray-300 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Price */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-extrabold text-[#eacd89]">
                    ₹{selectedProduct.price}
                  </span>
                  {selectedProduct.originalPrice && (
                    <span className="line-through text-gray-500">
                      ₹{selectedProduct.originalPrice}
                    </span>
                  )}
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <h3 className="font-semibold text-[#eacd89]">Quantity:</h3>
                  <div className="flex items-center border border-[#eacd89] rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={handleDecrease}
                      className="px-4 py-2 hover:bg-[#eacd89] hover:text-black text-[#eacd89] font-bold text-lg transition"
                    >
                      −
                    </button>
                    <span className="px-6 py-2 bg-[#2322219a] text-white font-semibold">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={handleIncrease}
                      className="px-4 py-2 hover:bg-[#eacd89] hover:text-black transition text-[#eacd89] font-bold text-lg "
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Sizes */}
                {selectedProduct.sizes?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-[#eacd89] mb-2">Sizes</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.sizes.map((size, index) => (
                        <motion.button
                          key={index}
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          onClick={() => setValue("size", size)}
                          className={`px-3 py-1 border border-[#eacd89] rounded-lg transition
                            ${
                              selectedSize === size
                                ? "bg-[#eacd89] text-black"
                                : "text-white"
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
                    <h3 className="font-semibold text-[#eacd89] mb-2">
                      Colors
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.colors.map((color, index) => (
                        <motion.button
                          key={index}
                          type="button"
                          whileHover={{ scale: 1.15 }}
                          onClick={() => setValue("color", color)}
                          className={`px-4 py-3.5 rounded-full cursor-pointer transition 
                            ${
                              selectedColor === color
                                ? "border-2 border-yellow-400"
                                : ""
                            } `}
                          style={{
                            backgroundColor: color.toLowerCase(),
                            filter:
                              selectedColor === color
                                ? "brightness(0.9)"
                                : "none",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 ${
                    isLoading && "cursor-not-allowed opacity-50"
                  } py-3 w-full border border-[#eacd89] text-[#eacd89] hover:bg-[#eacd89] hover:text-black font-semibold rounded-lg transition flex justify-center items-center`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      Adding... <PulseLoader size={8} color="#000" />
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
      >
        <h2 className="text-yellow-500 font-bold md:text-3xl text-2xl mt-8 text-center capitalize">
          You may also like
        </h2>
        <div className="h-[3px] w-44 mt-2 mx-auto rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
        <div className="max-w-6xl mx-auto p-8">
          <ProductGrid products={similar} loading={loading} error={error} />
        </div>
      </motion.div>
    </>
  );
};

export default ProductDetails;
