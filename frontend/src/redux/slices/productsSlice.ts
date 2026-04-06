import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image_url: string | null;
  created_at: string;
}

interface ProductsState {
  list: Product[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  list: [],
  isLoading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.list = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    addProduct: (state, action: PayloadAction<Product>) => {
      state.list.unshift(action.payload);
    },

    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.list.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },

    deleteProduct: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((p) => p.id !== action.payload);
    },
  },
});

export const { setLoading, setError, setProducts, addProduct, updateProduct, deleteProduct } = productsSlice.actions;
export default productsSlice.reducer;
