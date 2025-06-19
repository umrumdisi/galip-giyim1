'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ShoppingBagIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'

interface DashboardStats {
  totalProducts: number;
  totalCustomers: number;
  recentOrders: Array<{
    id: string;
    customerName: string;
    status: string;
    date: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCustomers: 0,
    recentOrders: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [productsRes, customersRes, ordersRes] = await Promise.all([
          fetch('/api/products/count'),
          fetch('/api/users/count'),
          fetch('/api/orders/stats')
        ]);

        const [productsData, customersData, ordersData] = await Promise.all([
          productsRes.json(),
          customersRes.json(),
          ordersRes.json()
        ]);

        setStats({
          totalProducts: productsData.count || 0,
          totalCustomers: customersData.count || 0,
          recentOrders: ordersData.recentOrders || []
        });
      } catch (error) {
        console.error('Dashboard verilerini getirirken hata:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const statCards = [
    {
      name: 'Toplam Ürün',
      value: isLoading ? '...' : stats.totalProducts.toString(),
      icon: ShoppingBagIcon,
      href: '/admin/products',
    },
    {
      name: 'Toplam Müşteri',
      value: isLoading ? '...' : stats.totalCustomers.toString(),
      icon: UserGroupIcon,
      href: '/admin/customers',
    },
  ];

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8">Dashboard</h1>

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {statCards.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <item.icon
                      className="h-6 w-6 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {item.name}
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        {item.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Hızlı Erişim ve Son Aktiviteler */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Hızlı İşlemler
              </h3>
              <div className="space-y-3">
                <Link
                  href="/admin/products/new"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Yeni Ürün Ekle
                </Link>
                <Link
                  href="/admin/categories"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Kategorileri Yönet
                </Link>
                <Link
                  href="/admin/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Site Ayarlarını Düzenle
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Son Siparişler
              </h3>
              <div className="space-y-3">
                {isLoading ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  </div>
                ) : stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center text-sm text-gray-600">
                      <span className="w-4 h-4 rounded-full bg-blue-100 mr-2 flex-shrink-0" />
                      <a href={`/admin/orders/${order.id}`} className="text-indigo-600 hover:underline">
                        {order.customerName} - Sipariş #{order.id}
                      </a>
                      <span className="ml-auto text-xs text-gray-400">
                        {new Date(order.date).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center">Henüz sipariş bulunmuyor</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 