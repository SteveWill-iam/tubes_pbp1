import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setPaymentMethod } from '../redux/slices/cartSlice';

export const PaymentMethodPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center border-4 border-red-600">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Cart Empty</h1>
          <button
            onClick={() => navigate('/menu')}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold shadow-lg"
          >
            Return to Menu
          </button>
        </div>
      </div>
    );
  }

  const handlePaymentMethod = (method: 'counter' | 'machine') => {
    dispatch(setPaymentMethod(method));
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-yellow-50 p-4 flex flex-col items-center justify-center">
      <div className="max-w-2xl mx-auto w-full">
        <h1 className="text-4xl font-bold text-red-600 mb-8 text-center">💳 Pilih Metode Pembayaran</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Counter Payment Button */}
          <button
            onClick={() => handlePaymentMethod('counter')}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl hover:scale-105 transform transition-all duration-200 border-4 border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95"
          >
            <div className="text-6xl mb-4">🏪</div>
            <h2 className="text-2xl font-bold text-blue-600 mb-2">Bayar di Kasir</h2>
            <p className="text-gray-600 text-lg">Pembayaran di kasir</p>
          </button>

          {/* Machine/QRIS Payment Button */}
          <button
            onClick={() => handlePaymentMethod('machine')}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl hover:scale-105 transform transition-all duration-200 border-4 border-green-500 focus:outline-none focus:ring-4 focus:ring-green-300 active:scale-95"
          >
            <div className="text-6xl mb-4">📱</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Bayar di Mesin</h2>
            <p className="text-gray-600 text-lg">QRIS / Mesin Pembayaran</p>
          </button>
        </div>

        <button
          onClick={() => navigate('/cart')}
          className="w-full mt-8 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg text-lg"
        >
          Kembali ke Keranjang
        </button>
      </div>
    </div>
  );
};
