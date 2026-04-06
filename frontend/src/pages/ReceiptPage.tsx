import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { clearCurrentOrder } from '../redux/slices/ordersSlice';
import { getImageUrl } from '../utils/imageUrl';

export const ReceiptPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const receiptRef = useRef<HTMLDivElement>(null);
  const { currentOrder } = useSelector((state: RootState) => state.orders);

  if (!currentOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center border-4 border-red-600">
          <h1 className="text-2xl font-bold text-red-600 mb-4">No Order</h1>
          <p className="text-gray-600 mb-6">No order found. Please complete the checkout process.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-lg"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleReturnHome = () => {
    dispatch(clearCurrentOrder());
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-yellow-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div
          ref={receiptRef}
          className="bg-white rounded-lg shadow-md p-8 mb-6 print:shadow-none print:border print:border-black"
        >
          <div className="text-center mb-8 pb-4 border-b-2 border-dashed">
            <h1 className="text-4xl font-bold text-red-600 mb-2">RECEIPT</h1>
            <p className="text-gray-600">Thank you for your order!</p>
          </div>

          <div className="text-center mb-8 pb-4 border-b-2 border-dashed">
            <p className="text-gray-600 text-sm mb-2">QUEUE NUMBER</p>
            <p className="text-6xl font-bold text-red-600">{currentOrder.queue_number}</p>
          </div>

          <div className="mb-6 pb-4 border-b">
            <h3 className="font-bold text-lg text-gray-800 mb-3">Order Details</h3>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Order Type:</span>
              <span>{currentOrder.order_type === 'dine_in' ? '🍽️ Dine In' : '🛍️ Takeaway'}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Order ID:</span>
              <span className="font-mono text-xs">{currentOrder.id.substring(0, 8)}...</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Time:</span>
              <span>{new Date(currentOrder.created_at).toLocaleString()}</span>
            </div>
          </div>

          <div className="mb-6 pb-4 border-b">
            <h3 className="font-bold text-lg text-gray-800 mb-3">Payment Information</h3>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Payment Method:</span>
              <span>{currentOrder.payment_method === 'counter' ? '🏪 Bayar di Kasir' : '📱 Bayar di Mesin'}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Payment Status:</span>
              <span className={currentOrder.payment_status === 'completed' ? 'font-bold text-green-600' : 'font-bold text-yellow-600'}>
                {currentOrder.payment_status === 'completed' ? '✓ Pembayaran Selesai' : '⏳ Menunggu Pembayaran'}
              </span>
            </div>
          </div>

          <div className="mb-6 pb-4 border-b">
            <h3 className="font-bold text-lg text-gray-800 mb-3">Items</h3>
            {currentOrder.items?.map((item) => (
              <div key={item.id} className="flex gap-3 mb-3 pb-3 border-b last:border-b-0 last:pb-0">
                {item.product?.image_url && (
                  <div className="flex-shrink-0 bg-gray-100 rounded flex items-center justify-center w-16 h-16">
                    <img src={getImageUrl(item.product.image_url)} alt={item.product.name} className="w-16 h-16 object-contain rounded" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-semibold">{item.product?.name || 'Unknown'} × {item.quantity}</span>
                    <span className="font-bold">Rp {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-600">Rp {item.price.toLocaleString()} each</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-8 pb-4 border-b-2 border-dashed">
            <div className="flex justify-between text-xl font-bold">
              <span>TOTAL:</span>
              <span className="text-red-600">Rp {currentOrder.total_price.toLocaleString()}</span>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500">
            <p>Please keep your queue number</p>
            <p>Your order will be called when ready</p>
          </div>
        </div>

        <div className="flex gap-4 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded shadow-lg"
          >
            🞨 Print Receipt
          </button>
          <button
            onClick={handleReturnHome}
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-red-600 font-bold py-3 px-4 rounded shadow-lg"
          >
            ↻ Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};
