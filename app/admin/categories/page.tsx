'use client';

import React, { useEffect, useState } from 'react';

interface Category {
  id: number;
  name: string;
  createdAt: string;
  // description: string; // Modelde yok, placeholder olarak gösterilecek
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '' });
  const [adding, setAdding] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; id: number | null; name: string }>({ open: false, id: null, name: '' });
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (e) {
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });
      if (res.ok) {
        setShowModal(false);
        setNewCategory({ name: '' });
        fetchCategories();
      }
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) fetchCategories();
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (cat: Category) => {
    setEditModal({ open: true, id: cat.id, name: cat.name });
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal.id) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/categories/${editModal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editModal.name }),
      });
      if (res.ok) {
        setEditModal({ open: false, id: null, name: '' });
        fetchCategories();
      }
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="py-8 max-w-5xl mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Kategorileri Yönet</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
        >
          Yeni Kategori Ekle
        </button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">Kayıtlı kategori bulunamadı</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white shadow rounded-lg p-5 flex flex-col">
              <div className="text-lg font-medium text-gray-900 mb-1">{cat.name}</div>
              <div className="text-sm text-gray-500 mb-2">Açıklama: <span className="italic">(Henüz açıklama yok)</span></div>
              <div className="text-xs text-gray-400 mb-4">Oluşturulma: {new Date(cat.createdAt).toLocaleDateString('tr-TR')}</div>
              <div className="flex gap-2 mt-auto">
                <button onClick={() => handleEdit(cat)} className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm">Düzenle</button>
                <button onClick={() => handleDelete(cat.id)} disabled={deletingId === cat.id} className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm disabled:opacity-50">{deletingId === cat.id ? 'Siliniyor...' : 'Sil'}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Yeni Kategori Ekle</h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Adı</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={e => setNewCategory({ name: e.target.value })}
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                  {adding ? 'Ekleniyor...' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Kategori Düzenle</h2>
            <form onSubmit={handleUpdateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Adı</label>
                <input
                  type="text"
                  value={editModal.name}
                  onChange={e => setEditModal(m => ({ ...m, name: e.target.value }))}
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModal({ open: false, id: null, name: '' })}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                  {updating ? 'Güncelleniyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 