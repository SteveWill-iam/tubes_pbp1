import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StatsState {
  total_orders: number;
  total_revenue: number;
  today_orders: number;
  today_revenue: number;
}

const initialState: StatsState = {
  total_orders: 0,
  total_revenue: 0,
  today_orders: 0,
  today_revenue: 0,
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    setStats: (_state, action: PayloadAction<StatsState>) => {
      return action.payload;
    },
  },
});

export const { setStats } = statsSlice.actions;
export default statsSlice.reducer;
