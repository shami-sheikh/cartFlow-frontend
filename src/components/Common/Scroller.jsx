import React, { useState, useEffect } from "react";

export default function Scroller() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 200) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-10 right-16 md:bottom-10 md:right-10  z-50">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="flex items-center justify-center p-3 font-bold border-2 border-yellow-500  shadow-lg rounded-full hover:shadow-xl transition duration-300 ease-in-out opacity-90 hover:opacity-100 transform hover:scale-110"
        >
         <img src="https://cdn-icons-png.flaticon.com/128/3518/3518253.png" className="w-auto h-6 rotate-180 " alt="" />
        </button>
      )}
    </div>
  );
}
