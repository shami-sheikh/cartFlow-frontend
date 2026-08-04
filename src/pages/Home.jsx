import React, { useEffect, useState } from "react";
import Hero from "../components/Layout/Hero";
import GenderCollection from "../components/Products/GenderCollection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails";
import ProductGrid from "../components/Products/ProductGrid";
import Featured from "../components/Products/Featured";
import ContactUs from "../components/Products/ContactUs";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductByFilters } from "../redux/slices/productSlice.js";
import axios from "axios";

const Home = () => {
  const dispatch = useDispatch();
  const [bestSellerProduct, setBestSellerProduct] = useState(null);
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    dispatch(
      fetchProductByFilters({
        gender: "Women",
        category: "Top Wear",
        limit: 8,
      })
    );

    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
        );
        setBestSellerProduct(response.data || null);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBestSeller();
  }, [dispatch]);

  return (
    <div className="bg-[#fcfaf6]">
      <Hero />
      <GenderCollection />
      <NewArrivals />

      {/* Best Sellers */}
      <h2
        className="text-[#0f0d0b] font-light md:text-3xl text-2xl mt-8 text-center"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        Best in CartFlow
      </h2>
      <div className="h-[3px] w-28 mt-3 mx-auto mb-5 rounded-full bg-gradient-to-r from-[#c9973f] to-[#a87b32]"></div>

      {bestSellerProduct ? (
        <ProductDetails productId={bestSellerProduct._id} />
      ) : (
        <p className="text-center text-[#aba293]">Loading best seller...</p>
      )}

      {/* Women Collection */}
      <div className="p-10">
        <h2
          className="text-[#0f0d0b] font-light md:text-3xl text-2xl mt-8 text-center"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Top Wears for Women
        </h2>
        <div className="h-[3px] w-44 mt-3 mb-4 mx-auto rounded-full bg-gradient-to-r from-[#c9973f] to-[#a87b32]"></div>
        <ProductGrid products={products?.products} loading={loading} error={error} />
      </div>

      <Featured />
      <ContactUs />
    </div>
  );
};

export default Home;