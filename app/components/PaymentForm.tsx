'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { CreditCardIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/app/context/CartContext'
import { useRouter } from 'next/navigation'

interface PaymentFormData {
  fullName: string
  cardNumber: string
  expiryDate: string
  cvc: string
  address: string
}

export default function PaymentForm() {
  const [formData, setFormData] = useState<PaymentFormData>({
    fullName: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    address: ''
  })

  const [errors, setErrors] = useState<Partial<PaymentFormData>>({})

  const { items, clearCart } = useCart();
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: Partial<PaymentFormData> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Ad Soyad gerekli'
    }

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Kart numarası gerekli'
    } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Geçerli bir kart numarası girin'
    }

    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'Son kullanma tarihi gerekli'
    } else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Geçerli bir tarih girin (AA/YY)'
    }

    if (!formData.cvc.trim()) {
      newErrors.cvc = 'CVC gerekli'
    } else if (!/^\d{3,4}$/.test(formData.cvc)) {
      newErrors.cvc = 'Geçerli bir CVC girin'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Fatura adresi gerekli'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatCardNumber = (value: string): string => {
    const numbers = value.replace(/\D/g, '')
    const groups = numbers.match(/.{1,4}/g)
    return groups ? groups.join(' ') : numbers
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    if (name === 'cardNumber') {
      setFormData(prev => ({
        ...prev,
        [name]: formatCardNumber(value)
      }))
    } else if (name === 'expiryDate') {
      // AA/YY formatında giriş
      const formatted = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})/, '$1/')
        .substr(0, 5)
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }))
    } else if (name === 'cvc') {
      // Sadece sayı ve maksimum 4 karakter
      const formatted = value.replace(/\D/g, '').substr(0, 4)
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Sipariş oluşturma isteği
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items,
            address: formData.address,
            fullName: formData.fullName
          })
        });
        if (res.ok) {
          toast.success('Siparişiniz başarıyla oluşturuldu!');
          clearCart();
          router.push('/'); // Ana sayfaya veya sipariş onay sayfasına yönlendir
        } else {
          const data = await res.json();
          toast.error(data.error || 'Sipariş oluşturulamadı');
        }
      } catch (err) {
        toast.error('Bir hata oluştu, lütfen tekrar deneyin.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Ad Soyad
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            errors.fullName
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          }`}
        />
        {errors.fullName && (
          <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
        )}
      </div>

      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
          Kart Numarası
        </label>
        <div className="relative mt-1">
          <CreditCardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className={`pl-10 block w-full rounded-md shadow-sm ${
              errors.cardNumber
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
            }`}
          />
        </div>
        {errors.cardNumber && (
          <p className="mt-1 text-xs text-red-600">{errors.cardNumber}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
            Son Kullanma Tarihi
          </label>
          <input
            type="text"
            id="expiryDate"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            placeholder="AA/YY"
            maxLength={5}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.expiryDate
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
            }`}
          />
          {errors.expiryDate && (
            <p className="mt-1 text-xs text-red-600">{errors.expiryDate}</p>
          )}
        </div>

        <div>
          <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
            CVC
          </label>
          <input
            type="text"
            id="cvc"
            name="cvc"
            value={formData.cvc}
            onChange={handleChange}
            placeholder="123"
            maxLength={4}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.cvc
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
            }`}
          />
          {errors.cvc && (
            <p className="mt-1 text-xs text-red-600">{errors.cvc}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Fatura Adresi
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            errors.address
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          }`}
        />
        {errors.address && (
          <p className="mt-1 text-xs text-red-600">{errors.address}</p>
        )}
      </div>

      <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
        <LockClosedIcon className="h-4 w-4 mr-1" />
        <span>256-bit SSL ile güvenli ödeme</span>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Ödemeyi Tamamla
      </button>
    </form>
  )
} 