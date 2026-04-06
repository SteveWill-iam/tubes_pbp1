import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../redux/store';
import { setProducts, addProduct, updateProduct, deleteProduct } from '../redux/slices/productsSlice';
import { logout } from '../redux/slices/authSlice';
import apiClient from '../api/client';
import { getImageUrl } from '../utils/imageUrl';

export const AdminProductsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { list: products } = useSelector((state: RootState) => state.products);
  const { admin } = useSelector((state: RootState) => state.auth);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get('/products');
        dispatch(setProducts(response.data.products || response.data));
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('price', formData.price);
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      if (editingId) {
        const response = await apiClient.put(`/products/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        dispatch(updateProduct(response.data));
      } else {
        const response = await apiClient.post('/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        dispatch(addProduct(response.data));
      }

      setFormData({ name: '', description: '', category: '', price: '' });
      setImageFile(null);
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleEdit = (product: any) => {
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await apiClient.delete(`/products/${id}`);
        dispatch(deleteProduct(id));
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
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
          <h1 className="text-2xl font-bold">Product Management</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome, {admin?.username}!</span>
            <button
              onClick={() => navigate('/admin')}
              className="bg-yellow-400 hover:bg-yellow-500 text-red-600 font-bold px-4 py-2 rounded"
            >
              📊 Dashboard
            </button>
            <button onClick={handleLogout} className="bg-yellow-400 hover:bg-yellow-500 text-red-600 font-bold px-4 py-2 rounded">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: '', description: '', category: '', price: '' });
          }}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-6 shadow-lg"
        >
          {showForm ? '❌ Cancel' : '➕ Add Product'}
        </button>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Product name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="px-3 py-2 border border-gray-300 rounded"
                />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="">Select category</option>
                  <option value="Burger">Burger</option>
                  <option value="Sandwich">Sandwich</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Beverage">Beverage</option>
                  <option value="Side">Side</option>
                </select>
              </div>

              <textarea
                name="description"
                placeholder="Product description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="px-3 py-2 border border-gray-300 rounded"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-lg">
                {editingId ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
              {product.image_url && (
                <div className="bg-gray-100 flex items-center justify-center h-40">
                  <img src={getImageUrl(product.image_url)} alt={product.name} className="w-full h-40 object-contain" />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                <p className="text-lg font-bold text-red-600 mb-3">Rp {product.price.toLocaleString()}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-red-600 font-bold py-2 px-2 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-2 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
