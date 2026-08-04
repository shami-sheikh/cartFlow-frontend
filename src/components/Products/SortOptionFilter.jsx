import React from "react";

const SortOptionFilter = ({ value, onChange }) => {
  return (
    <div className="mb-4 flex justify-end items-center">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-2.5 bg-white text-[#0f0d0b] cursor-pointer border border-[#e1dacd] rounded-md text-sm
                   focus:outline-none focus:border-[#c9973f] focus:ring-1 focus:ring-[#c9973f]/30 transition"
      >
        <option value="">Recommended</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>
  );
};

export default SortOptionFilter;