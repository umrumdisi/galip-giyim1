'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import AuthModal from './AuthModal'
import { useRouter } from 'next/navigation'
import { Dialog } from '@headlessui/react'

export default function Header() {
  const { data: session, status } = useSession()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [showAboutDropdown, setShowAboutDropdown] = useState(false)
  const [aboutContent, setAboutContent] = useState('')
  const router = useRouter()
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [messageTitle, setMessageTitle] = useState('')
  const [messageContent, setMessageContent] = useState('')
  const [sending, setSending] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false)

  useEffect(() => {
    if (showAboutDropdown && !aboutContent) {
      fetch('/api/settings/about')
        .then(res => res.json())
        .then(data => setAboutContent(data.aboutContent || ''));
    }
  }, [showAboutDropdown, aboutContent]);

  return (
    <header className="bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-primary-600">Galip Giyim</span>
          </Link>

          {/* Sağ Taraf Butonları */}
          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50"
            >
              Sepet
            </Link>
            
            {status === 'loading' ? (
              <div className="w-20 h-10"></div>
            ) : session?.user ? (
              <div className="flex items-center space-x-4">
                {session.user?.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-primary-50 hover:bg-primary-100"
                  >
                    Admin Paneli
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  Çıkış
                </button>
                {session?.user && (
                  <button
                    onClick={() => setIsMessageModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50"
                  >
                    Mesajlar
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Giriş Yap
                </button>
                {/* Hakkımızda Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => router.push('/hakkimizda')}
                    className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50"
                  >
                    Hakkımızda
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} setIsOpen={setIsAuthModalOpen} />

      <Dialog open={isMessageModalOpen} onClose={() => setIsMessageModalOpen(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="relative bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto z-50">
            <Dialog.Title className="text-lg font-semibold mb-4">Mesaj Gönder</Dialog.Title>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setSending(true);
              setSendSuccess(false);
              await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: messageTitle, content: messageContent }),
              });
              setSending(false);
              setSendSuccess(true);
              setMessageTitle('');
              setMessageContent('');
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Başlık</label>
                <input type="text" value={messageTitle} onChange={e => setMessageTitle(e.target.value)} required className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mesaj</label>
                <textarea value={messageContent} onChange={e => setMessageContent(e.target.value)} required rows={4} className="w-full border rounded px-3 py-2" />
              </div>
              <button type="submit" disabled={sending} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50">{sending ? 'Gönderiliyor...' : 'Gönder'}</button>
              {sendSuccess && <div className="text-green-600 mt-2">Mesajınız gönderildi.</div>}
            </form>
            <button onClick={() => setIsMessageModalOpen(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">Kapat</button>
          </div>
        </div>
      </Dialog>
    </header>
  )
} 