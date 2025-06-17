'use client';

import { useEffect, useState } from 'react';

export default function HakkimizdaPage() {
  const [about, setAbout] = useState('');

  useEffect(() => {
    fetch('/api/settings/about')
      .then(res => res.json())
      .then(data => setAbout(data.aboutText || 'Galip Giyim, kalite ve şıklığı bir arada sunan erkek giyim mağazasıdır.'));
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center">
      <h1 className="text-3xl font-bold mb-6">Galip Giyim Hakkında</h1>
      <div className="text-lg text-gray-700 mb-8 whitespace-pre-line">
        {about}
      </div>
    </div>
  );
} 