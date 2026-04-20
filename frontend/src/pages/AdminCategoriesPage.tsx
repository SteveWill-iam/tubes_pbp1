import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  clearError,
} from '../redux/slices/categoriesSlice';
import { AdminLayout } from '../components/AdminLayout';

interface Category {
  id: string;
  name: string;
  description?: string;
}

export function AdminCategoriesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading, error } = useSelector(
    (state: RootState) => state.categories
  );

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ name: string; description: string }>({
    name: '',
    description: '',
  });

  useEffect(() => {
    dispatch(fetchCategories(false));
  }, [dispatch]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingId(null);
    setFormData({ name: '', description: '' });
    dispatch(clearError());
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setIsAddingNew(false);
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    dispatch(clearError());
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingId(null);
    setFormData({ name: '', description: '' });
    dispatch(clearError());
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('Category name is required');
      return;
    }

    if (isAddingNew) {
      const result = await dispatch(
        createCategory({
          name: formData.name,
          description: formData.description || undefined,
        })
      );

      if (!result.payload || typeof result.payload === 'string') {
        return;
      }

      setIsAddingNew(false);
      setFormData({ name: '', description: '' });
    } else if (editingId) {
      const result = await dispatch(
        updateCategory({
          id: editingId,
          name: formData.name,
          description: formData.description || undefined,
        })
      );

      if (!result.payload || typeof result.payload === 'string') {
        return;
      }

      setEditingId(null);
      setFormData({ name: '', description: '' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    await dispatch(deleteCategory(id));
  };

  return (
    <AdminLayout title="Kategori">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kategori</h1>
        {!isAddingNew && !editingId && (
          <button
            onClick={handleAddNew}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Tambah Kategori
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Add/Edit Form */}
        {(isAddingNew || editingId) && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold mb-4">
              {isAddingNew ? 'Tambah Kategori Baru' : 'Edit Kategori'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Kategori *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Ayam"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Menu dengan ayam"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Batalkan
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Categories Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Deskripsi
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {categories && categories.length > 0 ? (
                categories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {category.description || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-right flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        disabled={loading}
                        className="text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Tidak ada kategori
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminCategoriesPage;
