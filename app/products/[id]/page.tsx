'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
}

const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

export default function ProductDetail() {
  const params = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) {
          throw new Error('Ürün bulunamadı');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      toast.error('Lütfen bir beden seçin');
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
      size: selectedSize,
    });

    toast.success('Ürün sepetinize eklendi');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Hata</h2>
          <p className="text-gray-600">{error || 'Ürün bulunamadı'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Ürün Görseli */}
          <div className="relative h-[600px] rounded-lg overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Ürün Detayları */}
          <div className="mt-10 lg:mt-0">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            
            <div className="mt-4">
              <span className="text-2xl font-bold text-gray-900">
                {product.price.toLocaleString('tr-TR', {
                  style: 'currency',
                  currency: 'TRY'
                })}
              </span>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">Ürün Açıklaması</h2>
              <div className="mt-2 prose prose-sm text-gray-600">
                {product.description}
              </div>
            </div>

            {/* Beden Seçimi */}
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900">Beden</h2>
              <div className="mt-4 grid grid-cols-5 gap-4">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex items-center justify-center px-4 py-3 border rounded-md text-sm font-medium
                      ${selectedSize === size
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-gray-300 text-gray-900 hover:bg-gray-50'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Stok Durumu */}
            <div className="mt-6">
              <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? 'Stokta Var' : 'Stokta Yok'}
                {product.stock > 0 && product.stock <= 5 && ` (Son ${product.stock} ürün)`}
              </p>
            </div>

            {/* Sepete Ekle Butonu */}
            <div className="mt-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full flex items-center justify-center px-8 py-4 border border-transparent rounded-md text-base font-medium text-white
                  ${product.stock > 0
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-gray-400 cursor-not-allowed'
                  }`}
              >
                {product.stock > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
              </button>
            </div>

            {/* Ek Bilgiler */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h2 className="text-lg font-medium text-gray-900">Ürün Özellikleri</h2>
              <div className="mt-4 prose prose-sm text-gray-600">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Yüksek kalite kumaş</li>
                  <li>Rahat kesim</li>
                  <li>Kolay ütülenir</li>
                  <li>30°C'de yıkanabilir</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 