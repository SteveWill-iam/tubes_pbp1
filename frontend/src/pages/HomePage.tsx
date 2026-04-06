import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setOrderType } from '../redux/slices/cartSlice';

export const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSelectOrderType = (type: 'dine_in' | 'takeaway') => {
    dispatch(setOrderType(type));
    navigate('/menu');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-red-600 to-yellow-400">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl border-4 border-red-600">
        <h1 className="text-4xl font-bold text-center text-red-600 mb-2">🍔 Self-Service Kiosk</h1>
        <p className="text-center text-gray-600 mb-8">Welcome! Please select how you'd like to order.</p>

        <div className="grid grid-cols-2 gap-6">
          <button
            onClick={() => handleSelectOrderType('dine_in')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-6 px-4 rounded-lg transition text-xl shadow-lg"
          >
            🍽️<br />
            Dine In
          </button>
          <button
            onClick={() => handleSelectOrderType('takeaway')}
            className="bg-yellow-400 hover:bg-yellow-500 text-red-600 font-bold py-6 px-4 rounded-lg transition text-xl shadow-lg"
          >
            🛍️<br />
            Takeaway
          </button>
        </div>
      </div>
    </div>
  );
};
