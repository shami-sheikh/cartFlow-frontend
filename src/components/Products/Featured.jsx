import React from "react";
import { Link } from "react-router-dom";

const Featured = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-12">
      <div
        className="container mx-auto flex flex-col-reverse lg:flex-row items-center gap-10 
                   rounded-3xl bg-gradient-to-r from-[#1c1917] via-[#29221C] to-[#0d0d0d] 
                   border border-[#eacd89]/30 shadow-[0_8px_30px_rgba(234,205,137,0.15)] overflow-hidden"
      >
        {/* Left Text */}
        <div className="lg:w-1/2 p-6 sm:p-10 text-center lg:text-left">
          <h3 className="text-xl sm:text-2xl font-semibold text-[#eacd89] mb-3 sm:mb-4 tracking-wide">
            Featured Products
          </h3>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-snug mb-5">
            Elevate Your Style <br className="hidden sm:block" /> with Our Top Picks
          </h2>
          <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
            Discover our exclusive range of featured products carefully
            handpicked just for you. Indulge in timeless elegance with our top
            selections.
          </p>
          <Link
            to="/collections/all"
            className="inline-block px-6 py-3 text-sm sm:text-base rounded-full 
                       border border-[#eacd89] text-[#eacd89] 
                       hover:bg-[#eacd89] hover:text-black 
                       transition duration-300 shadow-md"
          >
            Shop Now
          </Link>
        </div>

        {/* Right Image */}
        <div className="lg:w-1/2 flex h-1/2 justify-center lg:justify-end relative">
          <div className="relative w-[90%] sm:w-[80%] max-w-md rounded-2xl overflow-hidden shadow-lg border border-[#eacd89]/40">
            <img
              src="https://images.unsplash.com/photo-1679101893301-6c87f1508e2e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTg2fHxFbGV2YXRlJTIwWW91ciUyMFN0eWxlJTIwd2l0aCUyME91ciUyMFRvcCUyMFBpY2tzfGVufDB8fDB8fHww"
              alt="Featured Products"
              className="w-full h-full object-cover transform hover:scale-105 transition duration-700"
            />
            {/* Golden overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Featured;
