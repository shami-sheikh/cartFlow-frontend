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
    <div>
      <Hero />
      <GenderCollection />
      <NewArrivals />

      {/* Best Sellers */}
      <h2 className="text-yellow-500 font-bold md:text-3xl text-2xl mt-8 text-center">
        Best in CartFlow
      </h2>
      <div className="h-[3px] w-28 mt-1 mx-auto mb-5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600"></div>

      {bestSellerProduct ? (
        <ProductDetails productId={bestSellerProduct._id} />
      ) : (
        <p className="text-center text-gray-400">Loading best seller...</p>
      )}

      {/* Women Collection */}
      <div>
        <h2 className="capitalize text-yellow-500 font-bold md:text-3xl text-2xl mt-8 text-center ">
          Top wears for women
        </h2>
        <div className="h-[3px] w-44 mt-2 mx-auto rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
      <ProductGrid products={products?.products} loading={loading} error={error} />
      </div>

      <Featured />
      <ContactUs />
    </div>
  );
};

export default Home;
