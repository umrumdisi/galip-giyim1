'use client';

import { useState, useEffect } from 'react';
import { ShieldCheckIcon, TruckIcon, SparklesIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function AboutSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [aboutContent, setAboutContent] = useState('');

  useEffect(() => {
    fetch('/api/settings/about')
      .then(res => res.json())
      .then(data => setAboutContent(data.aboutText || 'Galip Giyim, kalite ve şıklığı bir arada sunan erkek giyim mağazasıdır.'));
  }, []);

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Galip Giyim</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-4 whitespace-pre-line">
            {aboutContent}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <ShieldCheckIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Kalite Garantisi</h3>
            <p className="text-gray-600">
              Premium kumaşlar ve özenli dikimle üretilen ürünlerimiz uzun ömürlü kullanım sağlar.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <TruckIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hızlı Teslimat</h3>
            <p className="text-gray-600">
              Siparişleriniz özenle paketlenir ve en kısa sürede adresinize teslim edilir.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <SparklesIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Trend Tasarımlar</h3>
            <p className="text-gray-600">
              Sürekli yenilenen koleksiyonumuzla modayı yakından takip ediyoruz.
            </p>
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
          >
            <span>Daha Fazla Bilgi</span>
            {isExpanded ? (
              <ChevronUpIcon className="ml-2 h-5 w-5" />
            ) : (
              <ChevronDownIcon className="ml-2 h-5 w-5" />
            )}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-8 max-w-4xl mx-auto animate-fadeIn">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Vizyonumuz</h3>
                  <p className="text-gray-600">
                    Erkek giyiminde kalite ve şıklığı ulaşılabilir fiyatlarla sunarak, 
                    her erkeğin kendini özel hissetmesini sağlamak.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Misyonumuz</h3>
                  <p className="text-gray-600">
                    Müşterilerimize en kaliteli ürünleri, en iyi hizmet anlayışıyla sunmak ve 
                    sürdürülebilir moda anlayışını desteklemek.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Değerlerimiz</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Müşteri Odaklılık</h4>
                    <p className="text-gray-600">
                      Müşteri memnuniyetini her şeyin üstünde tutuyor, beklentileri aşmayı hedefliyoruz.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Kalite</h4>
                    <p className="text-gray-600">
                      En kaliteli kumaşları ve işçiliği kullanarak, uzun ömürlü ürünler üretiyoruz.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Yenilikçilik</h4>
                    <p className="text-gray-600">
                      Moda trendlerini yakından takip ederek, yenilikçi tasarımlar sunuyoruz.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Sürdürülebilirlik</h4>
                    <p className="text-gray-600">
                      Çevreye duyarlı üretim süreçleri ve sürdürülebilir moda anlayışını destekliyoruz.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Neden Biz?</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span>Geniş ürün yelpazesi ve her tarza uygun seçenekler</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span>Uygun fiyat politikası ve düzenli kampanyalar</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span>Hızlı ve güvenilir teslimat seçenekleri</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span>7/24 müşteri desteği ve kolay iade süreci</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 