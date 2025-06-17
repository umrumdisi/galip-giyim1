'use client'

import Image from 'next/image'
import { TrashIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/app/context/CartContext'
import QuantitySelector from './QuantitySelector'

interface CartItemProps {
  item: {
    id: string
    name: string
    price: number
    quantity: number
    imageUrl: string
    size?: string
  }
}

export default function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCart()

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.id, newQuantity, item.size)
  }

  return (
    <div className="py-6 first:pt-0 last:pb-0">
      <div className="flex items-center space-x-4">
        {/* Ürün Görseli */}
        <div className="flex-shrink-0 w-24 h-24 relative rounded-md overflow-hidden">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 96px) 100vw, 96px"
          />
        </div>

        {/* Ürün Detayları */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium text-gray-900 truncate">
            {item.name}
          </h3>
          {item.size && (
            <p className="mt-1 text-sm text-gray-500">
              Beden: {item.size}
            </p>
          )}
          <div className="mt-2 flex items-center space-x-4">
            <QuantitySelector
              quantity={item.quantity}
              onQuantityChange={handleQuantityChange}
            />
            <button
              onClick={() => removeItem(item.id, item.size)}
              className="text-sm text-red-600 hover:text-red-800 flex items-center"
            >
              <TrashIcon className="h-5 w-5" />
              <span className="sr-only">Ürünü Kaldır</span>
            </button>
          </div>
        </div>

        {/* Fiyat */}
        <div className="flex-shrink-0">
          <span className="text-base font-medium text-gray-900">
            {(item.price * item.quantity).toLocaleString('tr-TR')} TL
          </span>
        </div>
      </div>
    </div>
  )
} 