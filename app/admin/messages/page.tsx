'use client';

import { useEffect, useState } from 'react';

interface Message {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  adminReply?: string | null;
  repliedAt?: string | null;
  user: {
    name?: string | null;
    email: string;
  };
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState<{ [id: number]: string }>({});
  const [saving, setSaving] = useState<{ [id: number]: boolean }>({});

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    let data = [];
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        data = await res.json();
      } else {
        const err = await res.text();
        console.error('API error:', err);
      }
    } catch (e) {
      console.error('JSON parse error:', e);
    }
    setMessages(data);
    setLoading(false);
  };

  const handleReply = async (id: number) => {
    setSaving(s => ({ ...s, [id]: true }));
    await fetch(`/api/messages/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminReply: reply[id] }),
    });
    setReply(r => ({ ...r, [id]: '' }));
    setSaving(s => ({ ...s, [id]: false }));
    fetchMessages();
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-8">Kullanıcı Mesajları</h1>
      {loading ? (
        <div>Yükleniyor...</div>
      ) : messages.length === 0 ? (
        <div>Hiç mesaj yok.</div>
      ) : (
        <div className="space-y-8">
          {messages.map(msg => (
            <div key={msg.id} className="bg-white rounded-lg shadow p-6">
              <div className="mb-2 text-sm text-gray-500">{new Date(msg.createdAt).toLocaleString('tr-TR')}</div>
              <div className="font-semibold text-gray-900 mb-1">{msg.title}</div>
              <div className="mb-2 text-gray-700 whitespace-pre-line">{msg.content}</div>
              <div className="mb-2 text-xs text-gray-500">Gönderen: {msg.user.name || msg.user.email}</div>
              {msg.adminReply ? (
                <div className="mt-4 p-3 bg-green-50 rounded text-green-800">
                  <div className="font-medium">Admin Yanıtı:</div>
                  <div>{msg.adminReply}</div>
                  <div className="text-xs text-gray-400 mt-1">{msg.repliedAt ? new Date(msg.repliedAt).toLocaleString('tr-TR') : ''}</div>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); handleReply(msg.id); }} className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={reply[msg.id] || ''}
                    onChange={e => setReply(r => ({ ...r, [msg.id]: e.target.value }))}
                    placeholder="Yanıt yaz..."
                    className="flex-1 border rounded px-3 py-2"
                    required
                  />
                  <button
                    type="submit"
                    disabled={saving[msg.id]}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {saving[msg.id] ? 'Kaydediliyor...' : 'Yanıtla'}
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 