import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import client from '../../api/client';

export interface AdminUser {
  id: string;
  username: string;
  role: 'admin' | 'cashier';
  created_at: string;
}

interface AdminsState {
  items: AdminUser[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AdminsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchAdmins = createAsyncThunk('admins/fetchAdmins', async () => {
  const response = await client.get('/admins');
  return response.data;
});

export const createAdmin = createAsyncThunk('admins/createAdmin', async (data: any) => {
  const response = await client.post('/admins', data);
  return response.data;
});

export const updateAdmin = createAsyncThunk('admins/updateAdmin', async ({ id, data }: { id: string; data: any }) => {
  const response = await client.put(`/admins/${id}`, data);
  return response.data;
});

export const deleteAdmin = createAsyncThunk('admins/deleteAdmin', async (id: string) => {
  await client.delete(`/admins/${id}`);
  return id;
});

const adminsSlice = createSlice({
  name: 'admins',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmins.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAdmins.fulfilled, (state, action: PayloadAction<AdminUser[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch admins';
      })
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateAdmin.fulfilled, (state, action) => {
        const index = state.items.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.items = state.items.filter(a => a.id !== action.payload);
      });
  },
});

export default adminsSlice.reducer;