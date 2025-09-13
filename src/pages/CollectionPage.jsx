import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { IoFilter } from "react-icons/io5";
import FilterSidebar from "../components/Products/FilterSidebar";
import SortOptionFilter from "../components/Products/SortOptionFilter";
import ProductGrid from "../components/Products/ProductGrid";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductByFilters } from "../redux/slices/productSlice";
import axios from "axios";

// Debounce hook
const useDebouncedEffect = (effect, deps, delay) => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);
    return () => clearTimeout(handler);
  }, [...(deps || []), delay]);
};

const CollectionPage = () => {
  // Initialize filters from URL searchParams on mount
  const getFiltersFromParams = (params) => {
    const obj = Object.fromEntries([...params]);
    return {
      category: obj.category || "",
      gender: obj.gender || "",
      color: params.getAll("color") || [],
      size: params.getAll("size") || [],
      material: params.getAll("material") || [],
      brand: params.getAll("brand") || [],
      minPrice: obj.minPrice || 0,
      maxPrice: obj.maxPrice || 100,
      sort: obj.sort || "",
      search: obj.search || "",
    };
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => getFiltersFromParams(searchParams));
  const [sortOption, setSortOption] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const {collectionId} = useParams()
  const dispatch = useDispatch()
  const { products,loading, error } = useSelector((state) => state.products);
  // State for all products (unfiltered, for color extraction)
  const [allProducts, setAllProducts] = useState([]);

  // Fetch all products on mount (for sidebar color extraction)
  useEffect(() => {
    async function fetchAll() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/all-collections`);
        setAllProducts(res.data.products || []);
      } catch (e) {
        setAllProducts([]);
      }
    }
    fetchAll();
  }, []);
  const queryParams = Object.fromEntries([...searchParams]);
  useEffect(() => {
    dispatch(fetchProductByFilters({
      collectionId,
      ...queryParams,
      minPrice: queryParams.minPrice || 0,
      maxPrice: queryParams.maxPrice || 100,
      sort: queryParams.sort || "",
      search: queryParams.search || ""
    }));
  }, [dispatch, collectionId, searchParams]);

  const handleFilterChange = useCallback((updatedFilter) => {
    setFilters((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(updatedFilter)) return prev;
      return updatedFilter;
    });
  }, []);

  const handleSortChange = (value) => setSortOption(value);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 

  // Sync filters & sort to URL (debounced)
  // Only update URL if filters actually change (not on initial mount)
  const isFirstRender = useRef(true);
  useDebouncedEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.gender) params.set("gender", filters.gender);
  filters.color.forEach((c) => params.append("color", c));
  filters.size.forEach((s) => params.append("size", s));
  filters.material.forEach((m) => params.append("material", m));
  filters.brand.forEach((b) => params.append("brand", b));
  if (filters.minPrice !== undefined) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice !== undefined) params.set("maxPrice", filters.maxPrice);
  if (filters.search) params.set("search", filters.search);
  if (sortOption) params.set("sort", sortOption);
  setSearchParams(params);
  }, [filters, sortOption], 300);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Mobile Filter Button */}
      <div className="lg:hidden p-4 border-b border-gray-700">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full py-2 px-4 bg-yellow-500 text-black font-medium rounded-md hover:bg-yellow-600 transition-colors"
        >
          <IoFilter className="mr-2" />
          Filter Products
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed lg:translate-x-0 lg:static top-0 left-0 w-80 lg:w-1/4 h-full lg:h-auto 
          bg-[#1a1714] border-r border-[#eacd89] shadow-2xl transition-transform duration-300 ease-in-out z-50
          overflow-y-auto`}
      >
        <div className="p-4 lg:p-6">
          <FilterSidebar 
            onFilterChange={handleFilterChange} 
            filters={filters} 
            products={allProducts}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-4 lg:p-6">
        <div className="">
          <h2 className="text-2xl lg:text-3xl font-bold text-yellow-400 uppercase ">All Collection</h2>
         
          <p className="font-Lora">Discover our premium collection of timeless fashion pieces, crafted for elegance and comfort. Unveil the essence of style with our premium collection, curated for modern trendsetters</p>
        </div>

        {/* Sort Options */}
        <div className="mb-6">
          <SortOptionFilter value={sortOption} onChange={handleSortChange} />
        </div>

        {/* Product Grid */}
        <ProductGrid 
          products={products?.products} 
          loading={loading} 
          error={error}
          searchTerm={queryParams.search || ""}
        />
      </div>
    </div>
  );
};

export default CollectionPage;
