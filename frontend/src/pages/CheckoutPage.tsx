import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { getImageUrl } from '../utils/imageUrl';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, total, order_type } = useSelector((state: RootState) => state.cart);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center border-4 border-red-600">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Cart Empty</h1>
          <button onClick={() => navigate('/menu')} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold shadow-lg">
            Return to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-red-600 mb-6">📋 Order Summary</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Items</h2>
          {items.map((item) => (
            <div key={item.product_id} className="flex gap-3 py-3 border-b last:border-b-0">
              {item.image_url && (
                <div className="flex-shrink-0 bg-gray-100 rounded flex items-center justify-center w-16 h-16">
                  <img src={getImageUrl(item.image_url)} alt={item.name} className="w-16 h-16 object-contain rounded" />
                </div>
              )}
              <div className="flex-1 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{item.name} × {item.quantity}</p>
                  <p className="text-sm text-gray-600">Rp {item.price.toLocaleString()} each</p>
                </div>
                <span className="font-bold">Rp {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            </div>
          ))}

          <div className="mt-4 pt-4 border-t-2">
            <div className="flex justify-between text-2xl font-bold">
              <span>Total:</span>
              <span className="text-red-600">Rp {total.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <p className="text-gray-600">
              <strong>Order Type:</strong> {order_type === 'dine_in' ? '🍽️ Dine In' : '🛍️ Takeaway'}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/cart')}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded"
          >
            Back to Cart
          </button>
          <button
            onClick={() => navigate('/payment-method')}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};
