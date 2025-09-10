import React, { useEffect, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { Link } from "react-router-dom";
import axios from "axios";

const NewArrivals = () => {
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
        );
        setNewArrivals(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNewArrivals();
  }, []);

  return (
    <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700 bg-clip-text text-transparent drop-shadow-lg">
          ✨ Luxury New Arrivals ✨
        </h2>
        <p className="text-gray-400 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
          Hand-picked premium pieces designed to elevate your everyday look —
          timeless style meets modern comfort.
        </p>
      </div>

      {/* Slider */}
      <Splide
        options={{
          perPage: 4,
          perMove: 1,
          gap: "1.5rem",
          pagination: true,
          arrows: true,
          breakpoints: {
            1280: { perPage: 3 },
            1024: { perPage: 2 },
            640: { perPage: 1 },
          },
        }}
        aria-label="New Arrivals"
      >
        {newArrivals.map((item) => (
          <SplideSlide key={item._id}>
            <div className="p-2">
              <Link
                to={`/product/${item._id}`}
                className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#1c1917] to-[#2a2520] border border-[#eacd89]/30 shadow-[0_3px_15px_rgba(234,205,137,0.12)] hover:shadow-[0_6px_25px_rgba(234,205,137,0.25)] hover:border-[#eacd89]/70 transition-all duration-500 flex flex-col"
              >
                {/* New Badge */}
                <span className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs font-semibold px-3 py-1 rounded-full shadow-md z-10">
                  New
                </span>

                {/* Product Image */}
                <div className="w-full h-72 overflow-hidden">
                  <img
                    src={item.images?.[0]?.url || item.image || "/placeholder.png"}
                    alt={item.name}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 hover:opacity-100 transition duration-500" />
                </div>

                {/* Info Section */}
                <div className="p-5 flex flex-col gap-2 text-center">
                  <h3 className="text-lg font-semibold text-[#f6e6b7] group-hover:text-[#eacd89] transition-colors duration-300 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-400 italic line-clamp-1">
                    {item.brand || "Exclusive Brand"} • {item.category}
                  </p>

                  <div className="flex items-center justify-center gap-3 mt-2">
                    <span className="text-xl font-bold text-[#eacd89]">
                      ₹{item.price}
                    </span>
                    {item.discountPrice && (
                      <span className="text-sm line-through text-gray-500">
                        ₹{item.discountPrice}
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  {item.rating && (
                    <div className="flex justify-center gap-1 mt-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < Math.round(item.rating)
                              ? "text-yellow-400"
                              : "text-gray-600"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="text-xs text-gray-400 ml-1">
                        ({item.numReviews || 0})
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          </SplideSlide>
        ))}
      </Splide>

      {/* Custom Slider Styles */}
      <style>
        {`
          .splide__arrow {
            background: rgba(28, 25, 23, 0.7);
            border-radius: 50%;
            padding: 8px;
            transition: all 0.3s ease;
          }
          .splide__arrow:hover {
            background: rgba(28, 25, 23, 0.9);
            transform: scale(1.1);
          }
          .splide__arrow svg {
            fill: #eacd89;
            width: 18px;
            height: 18px;
          }
          .splide__pagination {
            margin-top: 1.5rem;
            bottom: -25px;
          }
          .splide__pagination__page {
            background: #9ca3af;
            opacity: 0.6;
            width: 10px;
            height: 10px;
            transition: all 0.3s ease;
          }
          .splide__pagination__page.is-active {
            background: #eacd89;
            transform: scale(1.3);
            opacity: 1;
          }
        `}
      </style>
    </section>
  );
};

export default NewArrivals;
