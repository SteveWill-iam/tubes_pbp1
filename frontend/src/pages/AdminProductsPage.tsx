import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { setProducts, addProduct, updateProduct, deleteProduct } from '../redux/slices/productsSlice';
import { fetchCategories } from '../redux/slices/categoriesSlice';
import apiClient from '../api/client';
import { getImageUrl } from '../utils/imageUrl';
import { AdminLayout } from '../components/AdminLayout';

export const AdminProductsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list: products } = useSelector((state: RootState) => state.products);
  const { categories } = useSelector((state: RootState) => state.categories);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categories: [] as string[],
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
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prev) => ({ ...prev, categories: selectedOptions }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.categories.length === 0) {
      alert('Please select at least one category');
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('categories', JSON.stringify(formData.categories));
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

      setFormData({ name: '', description: '', categories: [], price: '' });
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
      categories: product.categories ? product.categories.map((c: any) => c.id) : [],
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

  return (
    <AdminLayout title="Product Management">
      <button
        onClick={() => {
          setShowForm(!showForm);
          setEditingId(null);
          setFormData({ name: '', description: '', categories: [], price: '' });
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
                multiple
                value={formData.categories}
                onChange={handleCategoryChange}
                required
                className="px-3 py-2 border border-gray-300 rounded"
                size={4}
              >
                {categories && categories.length > 0 ? (
                  categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No categories available</option>
                )}
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
              <div className="flex flex-wrap gap-1 mb-2">
                {product.categories && product.categories.length > 0 ? (
                  product.categories.map((cat: any) => (
                    <span key={cat.id} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {cat.name}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-600">No categories</span>
                )}
              </div>
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
    </AdminLayout>
  );
};
