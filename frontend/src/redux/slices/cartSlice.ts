import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
}

interface CartState {
  items: CartItem[];
  total: number;
  order_type: 'dine_in' | 'takeaway' | null;
}

const initialState: CartState = {
  items: (() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved).items : [];
  })(),
  total: (() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved).total : 0;
  })(),
  order_type: (() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved).order_type : null;
  })(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.product_id === action.payload.product_id);

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      localStorage.setItem('cart', JSON.stringify(state));
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.product_id !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      localStorage.setItem('cart', JSON.stringify(state));
    },

    updateQuantity: (state, action: PayloadAction<{ product_id: string; quantity: number }>) => {
      const item = state.items.find((item) => item.product_id === action.payload.product_id);

      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((i) => i.product_id !== action.payload.product_id);
        } else {
          item.quantity = action.payload.quantity;
        }
      }

      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      localStorage.setItem('cart', JSON.stringify(state));
    },

    setOrderType: (state, action: PayloadAction<'dine_in' | 'takeaway'>) => {
      state.order_type = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.order_type = null;
      localStorage.setItem('cart', JSON.stringify(state));
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, setOrderType, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
