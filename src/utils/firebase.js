import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAUaFU654LnDdOxy0pxvufPvSJV_I_lyNY",
  authDomain: "cart-flow-6b3fb.firebaseapp.com",
  projectId: "cart-flow-6b3fb",
  storageBucket: "cart-flow-6b3fb.firebasestorage.app",
  messagingSenderId: "180273837644",
  appId: "1:180273837644:web:9f6b74f7bc5b5eef6366e9",
  measurementId: "G-HTHSBQEFLN",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export default app;