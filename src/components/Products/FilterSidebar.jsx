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
  "Navy Blue": "#001F3F",
  Gray: "#8C8C8C",
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
  Khaki: "#F0E68C",
};

const FilterSidebar = ({ onFilterChange, filters, products = [] }) => {
  const { register, watch, setValue, reset } = useForm({
    defaultValues: filters,
  });
  const [price, setPrice] = React.useState(filters.maxPrice || 1000);

  useEffect(() => {
    reset(filters);
    setPrice(filters.maxPrice || 1000);
  }, [filters, reset]);

  const categories = ["Top Wear", "Bottom Wear"];
  const colors = useMemo(() => {
    const colorSet = new Set();
    products.forEach((p) => {
      if (Array.isArray(p.colors)) {
        p.colors.forEach((c) => colorSet.add(c));
      }
    });
    return Array.from(colorSet).map((name) => ({
      name,
      hex: COLOR_HEX_MAP[name] || "#CCCCCC",
    }));
  }, [products]);
  const sizes = ["S", "M", "L", "XL", "XXL"];
  const materials = ["Cotton", "Polyester", "Denim", "Viscose", "Fleece"];
  const brands = ["Nike", "Zara", "Levi's", "Adidas", "Reebok"];
  const genders = ["Men", "Women"];

  const filter = {
    ...watch(),
    minPrice: 0,
    maxPrice: price,
  };

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

  const pricePct = Math.min(100, (price / 1000) * 100);

  return (
    <div className="p-5 space-y-6 bg-white border border-[#ebdccb]/60 text-[#0f0d0b] rounded-2xl shadow-sm w-full">
      <h2
        className="text-2xl font-light text-[#0f0d0b] mb-4"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        Filters
      </h2>

      {/* Category */}
      <div>
        <label className="font-semibold text-[10px] uppercase tracking-widest text-[#8e8577]">Category</label>
        <div className="mt-2 flex flex-col gap-1.5">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer text-sm text-[#0f0d0b]">
              <input type="radio" value={cat} {...register("category")} className="w-4 h-4 accent-[#c9973f]" />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div>
        <label className="font-semibold text-[10px] uppercase tracking-widest text-[#8e8577]">Gender</label>
        <div className="mt-2 flex flex-col gap-1.5">
          {genders.map((g) => (
            <label key={g} className="flex items-center gap-2 cursor-pointer text-sm text-[#0f0d0b]">
              <input type="radio" value={g} {...register("gender")} className="w-4 h-4 accent-[#c9973f]" />
              {g}
            </label>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="font-semibold text-[10px] uppercase tracking-widest text-[#8e8577]">Color</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {colors.length === 0 ? (
            <span className="text-[#aba293] text-sm">No colors found</span>
          ) : (
            colors.map((c) => (
              <button
                type="button"
                key={c.name}
                onClick={() => toggleArrayValue("color", c.name)}
                className={`w-7 h-7 rounded-full border border-black/10 transform transition-transform duration-300 hover:scale-110 ${
                  (filter.color || []).includes(c.name) && "ring-2 ring-offset-2 ring-offset-white ring-[#c9973f]"
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))
          )}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <label className="font-semibold text-[10px] uppercase tracking-widest text-[#8e8577]">Sizes</label>
        <div className="mt-2 flex flex-col gap-1">
          {sizes.map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg text-sm text-[#0f0d0b] hover:bg-[#c9973f] hover:text-white transition-colors duration-300">
              <input type="checkbox" value={s} {...register("size")} className="w-4 h-4 accent-[#c9973f]" />
              {s}
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <label className="font-semibold text-[10px] uppercase tracking-widest text-[#8e8577]">Brands</label>
        <div className="mt-2 flex flex-col flex-wrap gap-1">
          {brands.map((b) => (
            <label key={b} className="flex items-center text-nowrap gap-2 cursor-pointer p-1.5 rounded-lg text-sm text-[#0f0d0b] hover:bg-[#c9973f] hover:text-white transition-colors duration-300">
              <input type="checkbox" value={b} {...register("brand")} className="w-4 h-4 accent-[#c9973f]" />
              {b}
            </label>
          ))}
        </div>
      </div>

      {/* Material */}
      <div>
        <label className="font-semibold text-[10px] uppercase tracking-widest text-[#8e8577]">Material</label>
        <div className="mt-2 flex flex-col gap-1">
          {materials.map((m) => (
            <label key={m} className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg text-sm text-[#0f0d0b] hover:bg-[#c9973f] hover:text-white transition-colors duration-300">
              <input type="checkbox" value={m} {...register("material")} className="w-4 h-4 accent-[#c9973f]" />
              {m}
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="font-semibold text-[10px] uppercase tracking-widest text-[#8e8577]">Price</label>
          <span className="text-sm font-bold text-[#a87b32]">Up to ₹{price}</span>
        </div>
        <div className="relative flex items-center h-5">
          {/* Track background */}
          <div className="absolute w-full h-1.5 rounded-full bg-[#ebdccb]" />
          {/* Filled portion, reflects current value */}
          <div
            className="absolute h-1.5 rounded-full bg-gradient-to-r from-[#c9973f] to-[#a87b32] pointer-events-none"
            style={{ width: `${pricePct}%` }}
          />
          <input
            type="range"
            min={0}
            max={1000}
            step={10}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="price-range-slider relative w-full h-5 bg-transparent appearance-none cursor-pointer"
          />
        </div>
        <div className="flex justify-between text-[10px] text-[#aba293] mt-1">
          <span>₹0</span>
          <span>₹1000</span>
        </div>
      </div>

      <style>{`
        .price-range-slider {
          -webkit-appearance: none;
        }
        .price-range-slider::-webkit-slider-runnable-track {
          background: transparent;
          height: 6px;
        }
        .price-range-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ffffff;
          border: 3px solid #c9973f;
          box-shadow: 0 2px 6px rgba(168, 123, 50, 0.3);
          cursor: pointer;
          margin-top: -6px;
          transition: transform 0.2s ease;
        }
        .price-range-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .price-range-slider::-moz-range-track {
          background: transparent;
          height: 6px;
        }
        .price-range-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ffffff;
          border: 3px solid #c9973f;
          box-shadow: 0 2px 6px rgba(168, 123, 50, 0.3);
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .price-range-slider::-moz-range-thumb:hover {
          transform: scale(1.15);
        }
      `}</style>
    </div>
  );
};

export default FilterSidebar;