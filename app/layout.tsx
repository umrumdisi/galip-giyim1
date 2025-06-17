import './globals.css'
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/auth.config'
import SessionProvider from './components/SessionProvider'
import Header from './components/Header'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from './context/CartContext'
import type { Metadata } from "next"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Galip Giyim - Erkek Giyim Mağazası',
  description: 'Kaliteli ve şık erkek giyim ürünleri',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="tr">
      <body className={inter.className}>
        <CartProvider>
          <SessionProvider session={session}>
            <Header />
            <main>
              {children}
            </main>
            <footer className="w-full py-6 text-center text-gray-400 text-sm border-t bg-white mt-12">
              © 2024 Galip Giyim. Tüm hakları saklıdır.
            </footer>
            <Toaster />
          </SessionProvider>
        </CartProvider>
      </body>
    </html>
  )
} 