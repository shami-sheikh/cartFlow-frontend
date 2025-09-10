import {configureStore} from '@reduxjs/toolkit'
import authReducer from "../redux/slices/authSlice.js"
import productReducer from "../redux/slices/productSlice.js"
import cartReducer from "../redux/slices/cartSlice.js"
import checkoutReducer from "../redux/slices/checkoutSlice.js"
import orderReducer from "../redux/slices/orderSlice.js"
import adminUserReducer from "../redux/slices/adminUserSlice.js"
import adminProductReducer from "../redux/slices/adminProductSlice.js"
import adminOrderSlice from "../redux/slices/adminOrderSlice.js"
const store = configureStore({
  reducer:{
    auth:authReducer,
    products:productReducer,
    cart:cartReducer,
    checkout:checkoutReducer,
    orders:orderReducer,
    adminUsers:adminUserReducer,
    adminProducts:adminProductReducer,
    adminOrders:adminOrderSlice
  },
})

export default store