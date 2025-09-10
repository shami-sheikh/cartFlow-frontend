import React from "react";

const SortOptionFilter = ({ value, onChange }) => {
  return (
    <div className="mb-4 flex justify-end items-center ">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-2 bg-[#26211d] text-white cursor-pointer border-[#eacd89] border rounded-md"
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
