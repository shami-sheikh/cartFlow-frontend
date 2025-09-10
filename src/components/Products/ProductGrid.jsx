import React from "react";
import useScrollToTop from "../../hooks/useScrollToTop";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

// Parent container animation (stagger children)
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // stagger product cards
    },
  },
};

// Each product card animation
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const ProductGrid = ({ products, loading, error, searchTerm = "" }) => {
  useScrollToTop([products]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  if (!products || products.length === 0) {
    if (searchTerm) {
      return (
        <p className="text-center text-yellow-400 font-semibold py-10">
          No matches found for{" "}
          <span className="text-[#eacd89]">"{searchTerm}"</span>
        </p>
      );
    }
    return <p className="text-center text-gray-400">No products found</p>;
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-6 gap-10"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {products.map((item) => (
        <motion.div key={item._id} variants={cardVariants}>
          <Link
            to={`/product/${item._id}`}
            className="group relative rounded-xl overflow-hidden bg-[#1c1917] border border-[#eacd89]/30 
            shadow-[0_2px_8px_rgba(234,205,137,0.1)] hover:shadow-[0_6px_25px_rgba(234,205,137,0.25)] 
            hover:border-[#eacd89]/60 transition-all duration-500 flex flex-col"
          >
            {/* Product Image */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative w-full h-56 bg-[#29221C] overflow-hidden"
            >
              <img
                src={
                  item.images?.[0]?.url || "https://via.placeholder.com/300x300"
                }
                alt={item.images?.[0]?.altText || item.name}
                className="w-full h-full object-cover"
              />

              {/* Discount Badge */}
              {item.discountPrice && item.discountPrice < item.price && (
                <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow">
                  {Math.round(
                    ((item.price - item.discountPrice) / item.price) * 100
                  )}
                  % OFF
                </span>
              )}

              {/* Category / Brand */}
              <span className="absolute bottom-3 left-3 text-xs bg-[#eacd89]/90 text-black px-2 py-1 rounded-md font-medium">
                {item.category || item.brand}
              </span>

              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
              />
            </motion.div>

            {/* Product Info */}
            <div className="flex flex-col gap-3 p-5">
              <h3 className="text-lg font-medium tracking-wide text-[#f6e6b7] group-hover:text-[#eacd89] transition-colors duration-300 truncate">
                {item.name}
              </h3>

              {/* Ratings */}
              <div className="flex items-center gap-1 text-[#eacd89]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.floor(item.rating) ? "#eacd89" : "transparent"}
                    stroke="#eacd89"
                  />
                ))}
                <span className="text-xs text-gray-400 ml-1">
                  ({item.numReviews})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  {item.discountPrice && item.discountPrice < item.price ? (
                    <>
                      <span className="text-xl font-bold text-[#eacd89]">
                        ₹{item.discountPrice}
                      </span>
                      <span className="text-sm line-through text-gray-500">
                        ₹{item.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-[#eacd89]">
                      ₹{item.price}
                    </span>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-1.5 text-sm rounded-full border border-[#eacd89] text-[#eacd89] 
                  hover:bg-[#eacd89] hover:text-black transition-all duration-300"
                >
                  View
                </motion.button>
              </div>

              {/* Stock & Material */}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>
                  Stock:{" "}
                  {item.countInStock > 0 ? item.countInStock : "Out of Stock"}
                </span>
                <span>{item.material}</span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProductGrid;
