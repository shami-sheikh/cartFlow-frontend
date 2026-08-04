import React from "react";
import { Link } from "react-router-dom";

const Featured = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-12">
      <div
        className="container mx-auto flex flex-col-reverse lg:flex-row items-center gap-10
                   rounded-3xl overflow-hidden border border-[#ebdccb]/60"
        style={{
          background:
            "radial-gradient(circle at 15% 50%, #f8f6f2, #ece7de 25%, #e2dbcd 50%, #f8f6f2 75%)",
          backgroundSize: "200% auto",
        }}
      >
        {/* Left Text */}
        <div className="lg:w-1/2 p-6 sm:p-10 text-center lg:text-left">
          <h3 className="text-xl sm:text-2xl font-semibold text-[#c9973f] mb-3 sm:mb-4 tracking-wide">
            Featured Products
          </h3>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#0f0d0b] leading-snug mb-5"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Elevate Your Style <br className="hidden sm:block" /> with Our Top Picks
          </h2>
          <p className="text-base sm:text-lg text-[#5c5548] mb-8 max-w-lg mx-auto lg:mx-0">
            Discover our exclusive range of featured products carefully
            handpicked just for you. Indulge in timeless elegance with our top
            selections.
          </p>
          <Link
            to="/collections/all"
            className="inline-block px-6 py-3 text-sm sm:text-base rounded-full
                       border border-[#c9973f] text-[#a87b32]
                       hover:bg-[#c9973f] hover:text-white
                       transition duration-300 shadow-sm"
          >
            Shop Now
          </Link>
        </div>

        {/* Right Image */}
        <div className="lg:w-1/2 flex h-1/2 justify-center lg:justify-end relative">
          <div className="relative w-[90%] sm:w-[80%] max-w-md rounded-2xl overflow-hidden shadow-lg border border-[#c9973f]/30 bg-[#f0ece2]">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=60"
              alt="Featured Products"
              className="w-full h-full object-cover transform hover:scale-105 transition duration-700"
            />
            {/* Soft warm overlay, matching the light theme instead of a heavy black fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0d0b]/25 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Featured;