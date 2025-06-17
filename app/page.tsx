'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import HomeSlider from './components/HomeSlider'
import SearchBar from './components/SearchBar'
import AboutSection from './components/AboutSection'
import ProductCard from './components/ProductCard'

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  imageUrl: string
  categoryId: string
  slug: string
}

interface Category {
  id: string
  name: string
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const categoryId = searchParams.get('category')

  useEffect(() => {
    if (categoryId) {
      setSelectedCategory(categoryId)
    }
  }, [categoryId])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/products')
        if (!response.ok) {
          throw new Error('Ürünler yüklenemedi')
        }
        const data = await response.json()
        const shuffledProducts = Array.isArray(data) ? [...data].sort(() => Math.random() - 0.5) : []
        setProducts(shuffledProducts)
        setError(null)
      } catch (error) {
        console.error('Ürünler yüklenirken hata:', error)
        setError(error instanceof Error ? error.message : 'Ürünler yüklenemedi')
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.categoryId === selectedCategory)
    : products

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Slider Bölümü */}
      <HomeSlider />

      {/* Kategoriler */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-4 space-x-8 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`whitespace-nowrap px-3 py-2 text-sm font-medium border-b-2 ${
                selectedCategory === null
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tüm Ürünler
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`whitespace-nowrap px-3 py-2 text-sm font-medium border-b-2 ${
                  selectedCategory === category.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Arama Çubuğu */}
        <div className="max-w-2xl mx-auto mb-12">
          <SearchBar />
        </div>

        {/* Ürünler */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">Bu kategoride henüz ürün bulunmuyor.</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>

      {/* Hakkımızda Bölümü */}
      <AboutSection />
    </div>
  )
} 