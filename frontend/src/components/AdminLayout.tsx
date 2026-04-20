import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { logout } from '../redux/slices/authSlice';

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ title, children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { admin } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-yellow-50">
      <nav className="bg-red-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome, {admin?.username} ({admin?.role})!</span>
            <button
              onClick={() => navigate('/admin')}
              className="bg-yellow-400 hover:bg-yellow-500 text-red-600 font-bold px-4 py-2 rounded"
            >
              ?? Dashboard
            </button>
            {admin?.role === 'admin' && (
              <>
                <button
                  onClick={() => navigate('/admin/products')}
                  className="bg-yellow-400 hover:bg-yellow-500 text-red-600 font-bold px-4 py-2 rounded"
                >
                  ?? Products
                </button>
                <button
                  onClick={() => navigate('/admin/categories')}
                  className="bg-yellow-400 hover:bg-yellow-500 text-red-600 font-bold px-4 py-2 rounded"
                >
                  ??? Categories
                </button>
                <button
                  onClick={() => navigate('/admin/users')}
                  className="bg-yellow-400 hover:bg-yellow-500 text-red-600 font-bold px-4 py-2 rounded"
                >
                  ?? Staff
                </button>
              </>
            )}
            <button
              onClick={handleLogout}
              className="bg-yellow-400 hover:bg-yellow-500 text-red-600 font-bold px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4">
        {children}
      </div>
    </div>
  );
};
