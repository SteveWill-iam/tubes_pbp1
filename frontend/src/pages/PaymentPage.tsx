import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { setCurrentOrder } from '../redux/slices/ordersSlice';
import { clearCart } from '../redux/slices/cartSlice';
import apiClient from '../api/client';

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { items, total, order_type } = useSelector((state: RootState) => state.cart);
  const [status, setStatus] = useState<'processing' | 'completed' | 'error'>('processing');
  const [message, setMessage] = useState('Processing payment...');
  const paymentProcessed = useRef(false);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/menu');
      return;
    }

    // Prevent processing payment multiple times
    if (paymentProcessed.current) {
      return;
    }

    const processPayment = async () => {
      try {
        // Mark as processing to prevent double execution
        paymentProcessed.current = true;

        // Simulate 2-second payment delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Create order on backend
        const response = await apiClient.post('/orders', {
          items: items.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
          })),
          order_type,
        });

        // Set current order and clear cart
        dispatch(setCurrentOrder(response.data));
        dispatch(clearCart());
        setStatus('completed');
        setMessage('Order created successfully!');

        // Redirect to receipt after 1 second
        setTimeout(() => {
          navigate('/receipt');
        }, 1000);
      } catch (error: any) {
        console.error('Payment error:', error);
        paymentProcessed.current = false; // Reset so user can retry
        setStatus('error');
        setMessage(error.response?.data?.error || 'Payment failed. Please try again.');
      }
    };

    processPayment();
  }, [items, order_type, dispatch, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-red-600 to-yellow-400">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md text-center border-4 border-red-600">
        {status === 'processing' && (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Processing Payment</h1>
            <div className="mb-6 flex justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent"></div>
            </div>
            <div className="bg-yellow-200 p-6 rounded-lg mb-6 border-2 border-dashed border-red-600">
              <p className="text-red-600 text-sm mb-2 font-bold">Total Amount:</p>
              <p className="text-3xl font-bold text-red-600">Rp {total.toLocaleString()}</p>
            </div>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'completed' && (
          <>
            <h1 className="text-2xl font-bold text-green-600 mb-6">✓ Payment Successful!</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex justify-center mb-6">
              <div className="text-6xl">🎉</div>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-6">✗ Payment Failed</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => navigate('/checkout')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded shadow-lg"
            >
              Retry
            </button>
          </>
        )}
      </div>
    </div>
  );
};
