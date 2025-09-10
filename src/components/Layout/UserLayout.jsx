import  { useEffect } from "react";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../../redux/slices/cartSlice";

const UserLayout = () => {
  const dispatch = useDispatch();
  const { user, guestId } = useSelector((state) => state.auth);

  useEffect(() => {
    // Always fetch cart from backend on mount and when user/guestId changes
    dispatch(fetchCart({ userId: user?._id, guestId }));
  }, [dispatch, user?._id, guestId]);

  return (
    <>
      <Header />
      <main className="bg-gradient-to-r from-[#3f3224] to-[#131111] text-luxury">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default UserLayout;
