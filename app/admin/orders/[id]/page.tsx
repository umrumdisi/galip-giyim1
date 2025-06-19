"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders?id=${orderId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Sipariş bulunamadı");
        setOrder(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return <div className="p-8">Yükleniyor...</div>;
  }
  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }
  if (!order) {
    return <div className="p-8">Sipariş bulunamadı.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
      <h1 className="text-2xl font-bold mb-4">Sipariş Detayı</h1>
      <div className="mb-4">
        <strong>Sipariş ID:</strong> {order.id}
      </div>
      <div className="mb-4">
        <strong>Müşteri:</strong> {order.user?.name || order.user?.email || "-"}
      </div>
      <div className="mb-4">
        <strong>Durum:</strong> {order.status}
      </div>
      <div className="mb-4">
        <strong>Toplam Tutar:</strong> {order.totalAmount} TL
      </div>
      <div className="mb-4">
        <strong>Ürünler:</strong>
        <ul className="list-disc ml-6 mt-2">
          {order.items.map((item: any) => (
            <li key={item.id}>
              {item.product?.name} - {item.quantity} adet - {item.price} TL
            </li>
          ))}
        </ul>
      </div>
      <div className="text-gray-500 text-sm">Oluşturulma: {new Date(order.createdAt).toLocaleString("tr-TR")}</div>
    </div>
  );
} 