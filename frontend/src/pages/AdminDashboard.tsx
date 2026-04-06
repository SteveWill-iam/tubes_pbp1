import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../redux/store';
import { setOrders, updateOrderStatus } from '../redux/slices/ordersSlice';
import { logout } from '../redux/slices/authSlice';
import apiClient from '../api/client';

interface Stats {
  total_orders: number;
  total_revenue: number;
  today_orders: number;
  today_revenue: number;
  timestamp: string;
}

export const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { list: orders } = useSelector((state: RootState) => state.orders);
  const { admin } = useSelector((state: RootState) => state.auth);
  const [stats, setLocalStats] = useState<Stats | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get('/orders');
        dispatch(setOrders(response.data.orders || response.data));
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/stats');
        setLocalStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    // Initial fetch
    fetchOrders();
    fetchStats();

    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      fetchOrders();
      fetchStats();
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const isNewOrder = (createdAt: string) => {
    const orderTime = new Date(createdAt).getTime();
    const now = Date.now();
    return now - orderTime < 60000; // Less than 1 minute
  };

  const handleStatusUpdate = async (orderId: string, newStatus: 'processed' | 'completed') => {
    try {
      await apiClient.patch(`/orders/${orderId}/status`, { status: newStatus });
      dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
      setSelectedOrder(null);
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-yellow-50">
      <nav className="bg-red-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome, {admin?.username}!</span>
            <button
              onClick={() => navigate('/admin/products')}
              className="bg-yellow-400 hover:bg-yellow-500 text-red-600 font-bold px-4 py-2 rounded"
            >
              📋 Products
            </button>
            <button onClick={handleLogout} className="bg-yellow-400 hover:bg-yellow-500 text-red-600 font-bold px-4 py-2 rounded">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total_orders}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600">Rp {stats.total_revenue.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Today's Orders</p>
              <p className="text-3xl font-bold text-purple-600">{stats.today_orders}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Today's Revenue</p>
              <p className="text-3xl font-bold text-orange-600">Rp {stats.today_revenue.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">Orders (Auto-refreshes every 5s)</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800">#</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800">Order ID</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800">Time</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className={`border-t ${
                      isNewOrder(order.created_at) ? 'bg-yellow-100' : ''
                    } hover:bg-gray-50`}
                  >
                    <td className="px-6 py-3 text-lg font-bold text-blue-600">{order.queue_number}</td>
                    <td className="px-6 py-3 font-mono text-xs">{order.id.substring(0, 8)}...</td>
                    <td className="px-6 py-3">{order.order_type === 'dine_in' ? '🍽️' : '🛍️'}</td>
                    <td className="px-6 py-3 font-bold">Rp {order.total_price.toLocaleString()}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 rounded text-sm font-bold ${
                          order.status === 'completed' ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      {new Date(order.created_at).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Order #{selectedOrder.queue_number}</h3>

            <div className="mb-4 pb-4 border-b">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Total:</strong> Rp {selectedOrder.total_price.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Type:</strong> {selectedOrder.order_type === 'dine_in' ? 'Dine In' : 'Takeaway'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Status:</strong> {selectedOrder.status}
              </p>
            </div>

            <div className="mb-6">
              <h4 className="font-bold text-gray-800 mb-2">Items:</h4>
              {selectedOrder.items?.map((item: any) => (
                <p key={item.id} className="text-sm text-gray-600">
                  {item.product?.name} × {item.quantity}
                </p>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  handleStatusUpdate(
                    selectedOrder.id,
                    selectedOrder.status === 'processed' ? 'completed' : 'processed'
                  )
                }
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                {selectedOrder.status === 'processed' ? 'Mark Complete' : 'Mark Processing'}
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
