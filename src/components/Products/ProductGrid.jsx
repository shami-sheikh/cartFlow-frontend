import React from "react";
import useScrollToTop from "../../hooks/useScrollToTop";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const ProductGrid = ({ products = [], loading, error, selectedColors = [] }) => {
  useScrollToTop([products]);

  if (loading) {
    return <p className="text-center py-20">Loading...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }
  if (!products || products.length === 0) {
    return <p className="text-center py-20 text-gray-400">No products found</p>;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {products.map((item) => {
        // Color-to-image logic
        let imageToShow = item.images?.[0]?.url || "https://via.placeholder.com/300x300/1a1a1a/eacd89?text=No+Image";
        let altToShow = item.name;
        if (selectedColors && selectedColors.length > 0 && Array.isArray(item.colors) && Array.isArray(item.images)) {
          const matchColor = selectedColors.find((c) => item.colors.includes(c));
          if (matchColor) {
            const colorIdx = item.colors.indexOf(matchColor);
            if (item.images[colorIdx]) {
              imageToShow = item.images[colorIdx].url;
              altToShow = item.images[colorIdx].altText || item.name;
            }
          }
        }
        return (
          <motion.div
            key={item._id}
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-[#1a1a1a] border border-[#eacd89]/30 rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition"
          >
            <Link to={`/product/${item._id}`}>
              {/* Product Image */}
              <div className="relative w-full h-64 overflow-hidden">
                <img
                  src={imageToShow}
                  alt={altToShow}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x300/1a1a1a/eacd89?text=No+Image";
                  }}
                />
                {item.discountPrice && item.discountPrice < item.price && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Sale
                  </span>
                )}
              </div>
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
                    Stock: {item.countInStock > 0 ? item.countInStock : "Out of Stock"}
                  </span>
                  <span>{item.material}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default ProductGrid;