import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../redux/store';
import { removeFromCart, updateQuantity } from '../redux/slices/cartSlice';
import { getImageUrl } from '../utils/imageUrl';

export const CartPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, total } = useSelector((state: RootState) => state.cart);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center border-4 border-red-600">
          <h1 className="text-2xl font-bold text-red-600 mb-4">🛒 Empty Cart</h1>
          <p className="text-gray-600 mb-6">Your cart is empty. Please add items from the menu.</p>
          <button
            onClick={() => navigate('/menu')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-red-600 mb-6">📄 Shopping Cart</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {items.map((item) => (
            <div key={item.product_id} className="flex gap-4 items-center py-4 border-b last:border-b-0">
              {item.image_url && (
                <div className="flex-shrink-0 bg-gray-100 rounded flex items-center justify-center w-20 h-20">
                  <img src={getImageUrl(item.image_url)} alt={item.name} className="w-20 h-20 object-contain rounded" />
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600">Rp {item.price.toLocaleString()} each</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => dispatch(updateQuantity({ product_id: item.product_id, quantity: item.quantity - 1 }))}
                  className="bg-yellow-400 hover:bg-yellow-500 text-red-600 font-bold py-1 px-3 rounded"
                >
                  −
                </button>
                <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => dispatch(updateQuantity({ product_id: item.product_id, quantity: item.quantity + 1 }))}
                  className="bg-yellow-400 hover:bg-yellow-500 text-red-600 font-bold py-1 px-3 rounded"
                >
                  +
                </button>
              </div>

              <span className="font-bold text-lg text-red-600 w-24 text-right">
                Rp {(item.price * item.quantity).toLocaleString()}
              </span>

              <button
                onClick={() => dispatch(removeFromCart(item.product_id))}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded ml-4"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center text-2xl font-bold">
            <span>Total:</span>
            <span className="text-red-600">Rp {total.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/menu')}
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-red-600 font-bold py-3 px-4 rounded shadow-lg"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate('/checkout')}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded shadow-lg"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};
