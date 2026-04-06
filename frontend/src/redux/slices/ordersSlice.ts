import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: {
    name: string;
    image_url: string | null;
  };
}

interface Order {
  id: string;
  queue_number: number;
  status: 'processed' | 'completed';
  order_type: 'dine_in' | 'takeaway';
  total_price: number;
  created_at: string;
  items?: OrderItem[];
}

interface OrdersState {
  currentOrder: Order | null;
  list: Order[];
  isLoading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  currentOrder: null,
  list: [],
  isLoading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setCurrentOrder: (state, action: PayloadAction<Order>) => {
      state.currentOrder = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.list = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    updateOrderStatus: (state, action: PayloadAction<{ id: string; status: 'processed' | 'completed' }>) => {
      const order = state.list.find((o) => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
      }
    },

    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
});

export const { setLoading, setError, setCurrentOrder, setOrders, updateOrderStatus, clearCurrentOrder } =
  ordersSlice.actions;
export default ordersSlice.reducer;
