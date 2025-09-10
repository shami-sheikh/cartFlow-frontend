import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// asycn thunk for fetch products by collection and optional filters
export const fetchProductByFilters = createAsyncThunk(
  "products/fetchByFilters",
  async ({
    collection,
    size,
    color,
    gender,
    minPrice,
    maxPrice,
    sort,
    search,
    category,
    material,
    brand,
    limit,
  }) => {
    const query = new URLSearchParams();
    if (collection) query.append("collection", collection);
    if (Array.isArray(size)) {
      size.forEach((s) => query.append("size", s));
    } else if (size) {
      query.append("size", size);
    }
    if (Array.isArray(color)) {
      color.forEach((c) => query.append("color", c));
    } else if (color) {
      query.append("color", color);
    }
    if (gender) query.append("gender", gender);
    if (minPrice) query.append("minPrice", minPrice);
    if (maxPrice) query.append("maxPrice", maxPrice);
  if (sort) query.append("sort", sort);
    if (search) query.append("search", search);
    if (category) query.append("category", category);
    if (Array.isArray(material)) {
      material.forEach((m) => query.append("material", m));
    } else if (material) {
      query.append("material", material);
    }
    if (Array.isArray(brand)) {
      brand.forEach((b) => query.append("brand", b));
    } else if (brand) {
      query.append("brand", brand);
    }
    if (limit) query.append("limit", limit);

    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/all-collections?${query.toString()}`
    );
    return response.data;
  }
);

// fetch a single product by id
export const FetchProductDetails = createAsyncThunk("products/fetchById",async (id)=> {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/all-collections/${id}`)
  return response.data
})

export const updateProductById = createAsyncThunk("products/updateById",async ({id,productData})=> {
const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,productData,{
  headers:{
    Authorization:`Bearer ${localStorage.getItem("userToken")}`
  }
})
return response.data;
})

export const similarProducts = createAsyncThunk("products/similarProducts",async ({id})=> {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`);
  return response.data
})


const initialState = {
  products: [],
  selectedProduct: null,
  bestSellers: [],
  newArrivals: [],
  similar: [],
  loading: false,
  error: null,
  success: null,
  filters:{
    category:"",
    size:"",
    color:"",
    gender:"",
    brand:"",
    minPrice:"",
    maxPrice:"",
    sortBy:"",
    search:"",
    material:"",
    collection:"",
  }
};

const productSlice = createSlice({
  name:"products",
  initialState,
  reducers:{
    setFilters:(state,action) => {
      state.filters = {...state.filters,...action.payload}
    },
    clearFilters:(state)=> {
      state.filters ={
      category:"",
      size:"",
      color:"",
      gender:"",
      brand:"",
      minPrice:"",
      maxPrice:"",
      sortBy:"",
      search,
      material:"",
      collection:"",
      }
    }
  },
  extraReducers:(builder) => {
    builder
    // fetch products by filter
    .addCase(fetchProductByFilters.pending , (state)=> {
      state.loading = true,
      state.error = null
    })
   .addCase(fetchProductByFilters.fulfilled , (state,action) => {
  state.loading = false
  state.products = action.payload; 
})
    .addCase(fetchProductByFilters.rejected , (state,action)=>{
      state.loading = false
      state.error = action.error.message
    })
      // fetching single product details
     .addCase(FetchProductDetails.pending , (state)=> {
      state.loading = true,
      state.error = null
    })
    .addCase(FetchProductDetails.fulfilled , (state,action) => {
      state.loading = false
      state.selectedProduct = action.payload
    })
    .addCase(FetchProductDetails.rejected , (state,action)=>{
      state.loading = false
      state.error = action.error.message
    })

    // updated product
     .addCase(updateProductById.pending , (state)=> {
      state.loading = true,
      state.error = null
    })
    .addCase(updateProductById.fulfilled , (state,action) => {
      state.loading = false
      const updatedProduct = action.payload
      const index = state.products.findIndex((prodoct)=>prodoct._id === updatedProduct._id)
      if (index !== -1) {
       state.products[index] = updatedProduct 
      }
    })
    .addCase(updateProductById.rejected , (state,action)=>{
      state.loading = false
      state.error = action.error.message
    })

       // fetching similar product 
     .addCase(similarProducts.pending , (state)=> {
      state.loading = true,
      state.error = null
    })
    .addCase(similarProducts.fulfilled , (state,action) => {
      state.loading = false
      state.similar = action.payload
    })
    .addCase(similarProducts.rejected , (state,action)=>{
      state.loading = false
      state.error = action.error.message
    })

  }
})

export const {setFilters,clearFilters} = productSlice.actions
export default productSlice.reducer