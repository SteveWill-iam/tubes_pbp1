import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { setCurrentOrder } from '../redux/slices/ordersSlice';
import { clearCart } from '../redux/slices/cartSlice';
import apiClient from '../api/client';
import { QRCodeSimulator } from '../components/QRCodeSimulator';

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { items, total, order_type, payment_method } = useSelector((state: RootState) => state.cart);
  const [status, setStatus] = useState<'qr' | 'processing' | 'completed' | 'error'>('qr');
  const [message, setMessage] = useState('Processing payment...');
  const paymentProcessed = useRef(false);

  // Redirect if no items or payment method not selected
  useEffect(() => {
    if (items.length === 0) {
      navigate('/menu');
      return;
    }

    if (!payment_method) {
      navigate('/payment-method');
      return;
    }

    // If payment method is counter, skip QR and go straight to processing
    if (payment_method === 'counter') {
      setStatus('processing');
    }
  }, [items, payment_method, navigate]);

  // Handle QR completion or immediate processing
  const handleQRComplete = () => {
    setStatus('processing');
  };

  // Process payment
  useEffect(() => {
    if (status !== 'processing' || paymentProcessed.current || items.length === 0 || !payment_method) {
      return;
    }

    const processPayment = async () => {
      try {
        paymentProcessed.current = true;

        // Simulate 2-second payment delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Create order on backend with payment_method
        const response = await apiClient.post('/orders', {
          items: items.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
          })),
          order_type,
          payment_method,
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
  }, [status, items, order_type, payment_method, dispatch, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-red-600 to-yellow-400">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full text-center border-4 border-red-600">
        {/* QR Payment State */}
        {status === 'qr' && payment_method === 'machine' && (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">💳 Silakan Bayar</h1>
            <div className="bg-yellow-200 p-4 rounded-lg mb-6 border-2 border-dashed border-red-600">
              <p className="text-red-600 text-sm mb-2 font-bold">Total Amount:</p>
              <p className="text-3xl font-bold text-red-600">Rp {total.toLocaleString()}</p>
            </div>
            <QRCodeSimulator onComplete={handleQRComplete} />
          </>
        )}

        {/* Processing State */}
        {status === 'processing' && (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              {payment_method === 'counter' ? '💰 Menunggu Pembayaran di Kasir' : 'Processing Payment'}
            </h1>
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

        {/* Completed State */}
        {status === 'completed' && (
          <>
            <h1 className="text-2xl font-bold text-green-600 mb-6">✓ Pesanan Berhasil!</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex justify-center mb-6">
              <div className="text-6xl">🎉</div>
            </div>
          </>
        )}

        {/* Error State */}
        {status === 'error' && (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-6">✗ Pembayaran Gagal</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => {
                paymentProcessed.current = false;
                setStatus('processing');
                navigate('/checkout');
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded shadow-lg"
            >
              Coba Lagi
            </button>
          </>
        )}
      </div>
    </div>
  );
};
