'use client';

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBagIcon, EyeIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/app/context/CartContext'
import { toast } from 'react-hot-toast'

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    oldPrice?: number
    imageUrl: string
    slug: string
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    })
    toast.success('Ürün sepetinize eklendi')
  }

  return (
    <div className="product-card group">
      {/* İndirim Etiketi */}
      {product.oldPrice && (
        <div className="absolute top-2 right-2 bg-primary text-white text-sm font-medium px-2 py-1 rounded-full z-10">
          {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% İndirim
        </div>
      )}

      {/* Ürün Görseli ve Detay Linki */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transform group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart();
                }}
                className="btn-primary !px-3 !py-2"
                aria-label="Sepete Ekle"
              >
                <ShoppingBagIcon className="h-5 w-5" />
              </button>
              <div
                className="btn-secondary !px-3 !py-2"
                aria-label="Ürün Detayları"
              >
                <EyeIcon className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Ürün Bilgileri */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="space-y-2">
          <h3 className="text-text-primary font-medium line-clamp-2">{product.name}</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-lg font-bold text-primary">
              {product.price.toLocaleString('tr-TR')} TL
            </span>
            {product.oldPrice && (
              <span className="text-sm text-text-secondary line-through">
                {product.oldPrice.toLocaleString('tr-TR')} TL
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
} 