'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '../../components/layout/MainLayout';
import OrderForm from '../../components/goods/OrderForm';

interface Good {
  _id: string;
  name: string;
  nameEn?: string;
  description?: string;
  category: string;
  subcategory?: string;
  price: number;
  currency: string;
  unit: string;
  minimumOrderQuantity: number;
  inStock: boolean;
  stockQuantity?: number;
  photos: string[];
  specifications?: Record<string, string | number>;
  licenses?: {
    type: string;
    description?: string;
    validUntil?: string;
    certificateNumber?: string;
    issuer?: string;
  }[];
  supplier: {
    _id: string;
    companyName: string;
    email?: string;
    phone?: string;
    logo?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function GoodDetailPage() {
  const params = useParams();
  const router = useRouter();
  const goodId = params.id as string;

  const [good, setGood] = useState<Good | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isMyGood, setIsMyGood] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    // Отримуємо ID поточного користувача
    const userId = localStorage.getItem('userId');
    setCurrentUserId(userId);
  }, []);

  useEffect(() => {
    const fetchGood = async () => {
      if (!goodId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/goods/${goodId}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Товар не знайдено');
          }
          throw new Error('Помилка завантаження товару');
        }

        const data = await response.json();
        const goodData = data.good;

        setGood(goodData);

        // Перевіряємо, чи товар належить поточному користувачу
        const userId = localStorage.getItem('userId');
        if (userId && goodData.supplier?._id === userId) {
          setIsMyGood(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Невідома помилка');
      } finally {
        setLoading(false);
      }
    };

    fetchGood();
  }, [goodId, API_URL]);

  if (loading) {
    return (
      <MainLayout>
        <div className="auth-background min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="text-white mt-4">Завантаження...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !good) {
    return (
      <MainLayout>
        <div className="auth-background min-h-screen py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error || 'Товар не знайдено'}
            </div>
            <button
              onClick={() => router.push('/goods')}
              className="mt-4 px-4 py-2 bg-[#ff6b35] hover:bg-[#ff8555] text-white rounded-lg transition-colors"
            >
              Повернутися до списку товарів
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="auth-background min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Кнопка назад */}
          <button
            onClick={() => router.push('/goods')}
            className="mb-6 text-white hover:text-gray-200 flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Назад до товарів
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ліва колонка - Фото та основна інформація */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {/* Фото товару */}
              {good.photos && good.photos.length > 0 ? (
                <div className="mb-6">
                  <img
                    src={`${API_URL}${good.photos[0]}`}
                    alt={good.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  {good.photos.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {good.photos.slice(1, 5).map((photo, index) => (
                        <img
                          key={index}
                          src={`${API_URL}${photo}`}
                          alt={`${good.name} ${index + 2}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg mb-6 flex items-center justify-center">
                  <span className="text-gray-400">Немає фото</span>
                </div>
              )}

              {/* Назва та основна інформація */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{good.name}</h1>
              {good.nameEn && (
                <p className="text-lg text-gray-600 mb-4">{good.nameEn}</p>
              )}

              {/* Категорія */}
              <div className="mb-4">
                <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm">
                  {good.category}
                  {good.subcategory && ` / ${good.subcategory}`}
                </span>
              </div>

              {/* Ціна */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[#ff6b35]">
                    {good.price} {good.currency}
                  </span>
                  <span className="text-gray-500">/ {good.unit}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Мінімальна кількість замовлення: {good.minimumOrderQuantity} {good.unit}
                </p>
              </div>

              {/* Наявність */}
              <div className="mb-6">
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                    good.inStock
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  <span className="font-semibold">
                    {good.inStock ? 'В наявності' : 'Немає в наявності'}
                  </span>
                  {good.inStock && good.stockQuantity !== undefined && (
                    <span className="text-sm">
                      (На складі: {good.stockQuantity} {good.unit})
                    </span>
                  )}
                </div>
              </div>

              {/* Постачальник */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Постачальник</h3>
                <div className="flex items-center gap-4">
                  {good.supplier.logo && (
                    <img
                      src={good.supplier.logo}
                      alt={good.supplier.companyName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{good.supplier.companyName}</p>
                    {good.supplier.phone && (
                      <p className="text-sm text-gray-600">{good.supplier.phone}</p>
                    )}
                    {good.supplier.email && (
                      <p className="text-sm text-gray-600">{good.supplier.email}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Права колонка - Опис, характеристики, ліцензії */}
            <div className="space-y-6">
              {/* Опис */}
              {good.description && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Опис</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">{good.description}</p>
                </div>
              )}

              {/* Характеристики */}
              {good.specifications && Object.keys(good.specifications).length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Характеристики</h2>
                  <dl className="space-y-2">
                    {Object.entries(good.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between border-b border-gray-100 pb-2">
                        <dt className="text-gray-600">{key}:</dt>
                        <dd className="text-gray-900 font-medium">{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Ліцензії */}
              {good.licenses && good.licenses.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Ліцензії та сертифікати</h2>
                  <div className="space-y-4">
                    {good.licenses.map((license, idx) => (
                      <div key={idx} className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h3 className="font-semibold text-green-800 mb-2">{license.type}</h3>
                        {license.issuer && (
                          <p className="text-sm text-green-700">Видано: {license.issuer}</p>
                        )}
                        {license.certificateNumber && (
                          <p className="text-sm text-green-700">Сертифікат: {license.certificateNumber}</p>
                        )}
                        {license.validUntil && (
                          <p className="text-sm text-green-700">
                            Дійсна до: {new Date(license.validUntil).toLocaleDateString('uk-UA')}
                          </p>
                        )}
                        {license.description && (
                          <p className="text-sm text-green-600 mt-2">{license.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Форма замовлення (якщо товар не належить користувачу) */}
              {!isMyGood && good.inStock && currentUserId && (
                <OrderForm good={good} />
              )}

              {isMyGood && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                  <p className="text-blue-800 font-medium">
                    Це ваш товар. Ви не можете зробити замовлення на власний товар.
                  </p>
                </div>
              )}

              {!currentUserId && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                  <p className="text-yellow-800 font-medium">
                    Будь ласка, увійдіть в систему, щоб зробити замовлення.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
