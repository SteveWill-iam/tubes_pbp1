import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  admin: { id: string; username: string; role: 'admin' | 'cashier' } | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  admin: localStorage.getItem('admin') ? JSON.parse(localStorage.getItem('admin')!) : null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    loginSuccess: (state, action: PayloadAction<{ token: string; admin: { id: string; username: string; role: 'admin' | 'cashier' } }>) => {
      state.token = action.payload.token;
      state.admin = action.payload.admin;
      state.isLoading = false;
      state.error = null;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('admin', JSON.stringify(action.payload.admin));
    },

    logout: (state) => {
      state.token = null;
      state.admin = null;
      state.isLoading = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
    },
  },
});

export const { setLoading, setError, loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
