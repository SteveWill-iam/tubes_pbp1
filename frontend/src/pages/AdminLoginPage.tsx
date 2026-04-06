import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { setLoading, setError, loginSuccess } from '../redux/slices/authSlice';
import apiClient from '../api/client';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    dispatch(setLoading(true));

    try {
      const response = await apiClient.post('/auth/login', { username, password });
      dispatch(loginSuccess(response.data));
      navigate('/admin');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      setLocalError(errorMessage);
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-red-600 to-red-700">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full border-4 border-yellow-400">
        <h1 className="text-3xl font-bold text-center text-red-600 mb-6">🔐 Admin Login</h1>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border-2 border-red-600 rounded-lg focus:outline-none focus:border-red-700 focus:ring-2 focus:ring-yellow-300"
              placeholder="Enter username"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border-2 border-red-600 rounded-lg focus:outline-none focus:border-red-700 focus:ring-2 focus:ring-yellow-300"
              placeholder="Enter password"
              required
            />
          </div>

          {localError && <div className="text-red-600 text-sm mb-4 p-2 bg-red-100 rounded">{localError}</div>}

          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-lg">
            Login
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 pt-6 border-t-2 border-yellow-400 bg-yellow-50 p-4 rounded\">\n          <p className="text-center text-xs text-red-600 mb-2 font-bold\">📝 Demo Credentials:</p>\n          <p className="text-center text-sm text-gray-700\">Username: <span className="font-mono font-bold text-red-600\">admin</span></p>\n          <p className="text-center text-sm text-gray-700\">Password: <span className="font-mono font-bold text-red-600\">admin123</span></p>\n        </div>
      </div>
    </div>
  );
};
