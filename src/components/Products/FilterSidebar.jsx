import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

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
  "Light Blue": "#ADD8E6",
  Khaki: "#F0E68C",
};

const FilterSidebar = ({ onFilterChange, filters, products = [] }) => {
  const { register, watch, setValue, reset } = useForm({
    defaultValues: filters,
  });
  // Local state for price range
  const [price, setPrice] = React.useState(filters.maxPrice || 100);

  // Reset form when filters prop changes (from URL or parent)
  useEffect(() => {
    reset(filters);
    setPrice(filters.maxPrice || 100);
  }, [filters, reset]);

  const categories = ["Top Wear", "Bottom Wear"];
  // Dynamically extract unique colors from products
  const colors = useMemo(() => {
    const colorSet = new Set();
    products.forEach((p) => {
      if (Array.isArray(p.colors)) {
        p.colors.forEach((c) => colorSet.add(c));
      }
    });
    // Return as array of { name, hex }
    return Array.from(colorSet).map((name) => ({
      name,
      hex: COLOR_HEX_MAP[name] || "#CCCCCC", // fallback gray
    }));
  }, [products]);
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const materials = ["Cotton", "Polyester", "Denim", "Viscose", "Fleece"];
  // Only show top 5 brands
  const brands = ["Nike", "Zara", "Levi's", "Adidas", "Reebok"];
  const genders = ["Men", "Women"];

  const filter = {
    ...watch(),
    minPrice: 0,
    maxPrice: price,
  };

  // Call parent only when filter actually changes
  useEffect(() => {
    onFilterChange(filter);
  }, [filter, onFilterChange]);

  const toggleArrayValue = (key, value) => {
    const current = filter[key] || [];
    if (current.includes(value)) {
      setValue(key, current.filter((v) => v !== value));
    } else {
      setValue(key, [...current, value]);
    }
  };

  return (
    <div className="p-5 space-y-6 bg-[#1c1917] text-[#f7e7b7] rounded-2xl shadow-lg w-full">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">Filters</h2>

      {/* Category */}
      <div>
        <label className="font-semibold text-[#eacd89]">Category</label>
        <div className="mt-2 flex flex-col gap-1">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value={cat} {...register("category")} className="w-4 h-4 text-yellow-400" />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div>
        <label className="font-semibold text-[#eacd89]">Gender</label>
        <div className="mt-2 flex flex-col gap-1">
          {genders.map((g) => (
            <label key={g} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value={g} {...register("gender")} className="w-4 h-4 text-yellow-400" />
              {g}
            </label>
          ))}
        </div>
      </div>

      {/* Color */}
      <div className="mt-2 flex flex-wrap gap-2">
        {colors.length === 0 ? (
          <span className="text-gray-400 text-sm">No colors found</span>
        ) : (
          colors.map((c) => (
            <button
              type="button"
              key={c.name}
              onClick={() => toggleArrayValue("color", c.name)}
              className={`w-7 h-7 rounded-full transform transition-transform duration-300 hover:scale-110 ${
                (filter.color || []).includes(c.name) && "ring-2 ring-[#eacd89]"
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))
        )}
      </div>

      {/* Sizes */}
      <div>
        <label className="font-bold text-[#eacd89]">Sizes</label>
        <div className="mt-2 flex flex-col gap-2">
          {sizes.map((s) => (
            <label key={s} className="flex items-center gap-1 cursor-pointer p-1 rounded-lg hover:bg-yellow-400 hover:text-black transition-colors duration-300">
              <input type="checkbox" value={s} {...register("size")} className="w-4 h-4 text-yellow-400" />
              {s}
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <label className="font-bold text-[#eacd89]">Brands</label>
        <div className="mt-2 flex flex-col flex-wrap gap-2">
          {brands.map((b) => (
            <label key={b} className="flex items-center text-nowrap gap-1 cursor-pointer p-1 rounded-lg hover:bg-yellow-400 hover:text-black transition-colors duration-300">
              <input type="checkbox" value={b} {...register("brand")} className="w-4 h-4 text-yellow-400" />
              {b}
            </label>
          ))}
        </div>
      </div>

      {/* Material */}
      <div>
        <label className="font-bold text-[#eacd89]">Material</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {materials.map((m) => (
            <label key={m} className="flex items-center gap-1 cursor-pointer p-1 rounded-lg hover:bg-yellow-400 hover:text-black transition-colors duration-300">
              <input type="checkbox" value={m} {...register("material")} className="w-4 h-4 text-yellow-400" />
              {m}
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <label className="font-semibold text-[#eacd89] mb-2 block">Price: Up to ₹{price}</label>
        <input
          type="range"
          min={0}
          max={100}
          value={price}
          onChange={e => setPrice(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 cursor-pointer rounded-lg accent-yellow-400"
        />
      </div>
    </div>
  );
};

export default FilterSidebar;
