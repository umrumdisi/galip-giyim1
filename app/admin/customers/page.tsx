'use client';

import React, { useEffect, useState } from 'react';

interface User {
  id: string;
  name?: string;
  email: string;
}

export default function CustomersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="py-8 max-w-4xl mx-auto px-4">
      <h1 className="text-2xl font-semibold mb-6">Müşteriler</h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">Kayıtlı müşteri bulunamadı</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user.id} className="bg-white shadow rounded-lg p-5 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                <span className="text-xl text-gray-500">👤</span>
              </div>
              <div className="text-lg font-medium text-gray-900">
                {user.name ? user.name : user.email}
              </div>
              {user.name && (
                <div className="text-sm text-gray-500 mt-1">{user.email}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 