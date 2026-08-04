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
      <main className=""
      style={{
          background:
            "radial-gradient(circle at 15% 50%, #f8f6f2, #ece7de 25%, #e2dbcd 50%, #f8f6f2 75%)",
          backgroundSize: "200% auto",
        }}
      >
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default UserLayout;
