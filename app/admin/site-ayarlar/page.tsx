'use client';

import { useEffect, useState } from 'react';

export default function SiteAyarlarPage() {
  const [about, setAbout] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch('/api/settings/about');
        const data = await res.json();
        setAbout(data.aboutText || '');
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    await fetch('/api/settings/about', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aboutText: about }),
    });
    setSaving(false);
    setSuccess(true);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Site Ayarları</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Hakkımızda Metni</label>
          <textarea
            value={about}
            onChange={e => setAbout(e.target.value)}
            rows={8}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
        {success && <div className="text-green-600 mt-2">Başarıyla kaydedildi.</div>}
      </form>
    </div>
  );
} 