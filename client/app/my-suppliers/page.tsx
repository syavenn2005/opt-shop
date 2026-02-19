'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '../components/layout/MainLayout';

interface Order {
  _id: string;
  supplier: {
    _id: string;
    companyName: string;
    email?: string;
    phone?: string;
    logo?: string;
  };
  good: {
    _id: string;
    name: string;
    photos?: string[];
  };
  quantity: number;
  totalPrice: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

interface SupplierStats {
  supplier: {
    _id: string;
    companyName: string;
    email?: string;
    phone?: string;
    logo?: string;
  };
  ordersCount: number;
  totalSpent: number;
  currency: string;
  lastOrderDate: string;
  orders: Order[];
}

export default function MySuppliersPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<SupplierStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const fetchMySuppliers = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('Користувач не авторизований');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Отримуємо всі замовлення користувача
        const response = await fetch(`${API_URL}/orders/buyer/${userId}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Помилка завантаження замовлень');
        }

        const data = await response.json();
        const orders: Order[] = data.orders || [];

        // Групуємо замовлення по постачальникам
        const supplierMap = new Map<string, SupplierStats>();

        orders.forEach((order) => {
          const supplierId = order.supplier._id;
          const existing = supplierMap.get(supplierId);

          if (existing) {
            existing.ordersCount += 1;
            existing.totalSpent += order.totalPrice;
            existing.orders.push(order);
            // Оновлюємо дату останнього замовлення, якщо це замовлення новіше
            if (new Date(order.createdAt) > new Date(existing.lastOrderDate)) {
              existing.lastOrderDate = order.createdAt;
            }
          } else {
            supplierMap.set(supplierId, {
              supplier: order.supplier,
              ordersCount: 1,
              totalSpent: order.totalPrice,
              currency: order.currency,
              lastOrderDate: order.createdAt,
              orders: [order],
            });
          }
        });

        // Конвертуємо Map в масив і сортуємо за датою останнього замовлення
        const suppliersList = Array.from(supplierMap.values()).sort(
          (a, b) => new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime()
        );

        setSuppliers(suppliersList);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Невідома помилка');
      } finally {
        setLoading(false);
      }
    };

    fetchMySuppliers();
  }, [API_URL]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSupplierClick = (supplierId: string) => {
    if (selectedSupplierId === supplierId) {
      setSelectedSupplierId(null);
    } else {
      setSelectedSupplierId(supplierId);
    }
  };

  const handleViewSupplier = (supplierId: string) => {
    router.push(`/suppliers`);
    // Можна додати scroll до конкретного постачальника або відкрити модальне вікно
  };

  return (
    <MainLayout>
      <div className="auth-background min-h-screen py-8 px-4 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl font-bold text-white mb-8">Мої постачальники</h1>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="text-white mt-4">Завантаження...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          ) : suppliers.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <p className="text-gray-600 text-lg">
                У вас поки що немає постачальників. Створіть замовлення, щоб додати постачальників до списку.
              </p>
              <button
                onClick={() => router.push('/goods')}
                className="mt-6 px-6 py-3 bg-[#ff6b35] hover:bg-[#ff8555] text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Переглянути товари
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {suppliers.map((supplierStats) => {
                const isSelected = selectedSupplierId === supplierStats.supplier._id;
                return (
                  <div
                    key={supplierStats.supplier._id}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-200"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        {/* Логотип або ініціали */}
                        <div className="flex-shrink-0">
                          {supplierStats.supplier.logo ? (
                            <img
                              src={supplierStats.supplier.logo}
                              alt={supplierStats.supplier.companyName}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-lg bg-[#ff6b35] flex items-center justify-center text-white font-bold text-2xl">
                              {supplierStats.supplier.companyName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* Основна інформація */}
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {supplierStats.supplier.companyName}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Кількість замовлень</p>
                              <p className="text-lg font-semibold text-gray-900">
                                {supplierStats.ordersCount}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Загальна сума</p>
                              <p className="text-lg font-semibold text-[#ff6b35]">
                                {supplierStats.totalSpent.toFixed(2)} {supplierStats.currency}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Останнє замовлення</p>
                              <p className="text-lg font-semibold text-gray-900">
                                {formatDate(supplierStats.lastOrderDate)}
                              </p>
                            </div>
                          </div>

                          {/* Контактна інформація */}
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            {supplierStats.supplier.phone && (
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                  />
                                </svg>
                                <span>{supplierStats.supplier.phone}</span>
                              </div>
                            )}
                            {supplierStats.supplier.email && (
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                  />
                                </svg>
                                <span>{supplierStats.supplier.email}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Кнопки дій */}
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleSupplierClick(supplierStats.supplier._id)}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                          >
                            {isSelected ? 'Приховати деталі' : 'Показати деталі'}
                          </button>
                          <button
                            onClick={() => handleViewSupplier(supplierStats.supplier._id)}
                            className="px-4 py-2 bg-[#ff6b35] hover:bg-[#ff8555] text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            Переглянути товари
                          </button>
                        </div>
                      </div>

                      {/* Розгорнута інформація про замовлення */}
                      {isSelected && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Історія замовлень ({supplierStats.orders.length})
                          </h4>
                          <div className="space-y-4">
                            {supplierStats.orders.map((order) => (
                              <div
                                key={order._id}
                                className="bg-gray-50 rounded-lg p-4 flex items-center gap-4"
                              >
                                {order.good.photos && order.good.photos.length > 0 ? (
                                  <img
                                    src={`${API_URL}${order.good.photos[0]}`}
                                    alt={order.good.name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">Немає фото</span>
                                  </div>
                                )}
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900">{order.good.name}</p>
                                  <p className="text-sm text-gray-600">
                                    Кількість: {order.quantity} • Сума: {order.totalPrice} {order.currency}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {formatDate(order.createdAt)}
                                  </p>
                                </div>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    order.status === 'delivered'
                                      ? 'bg-green-100 text-green-800'
                                      : order.status === 'cancelled'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {order.status === 'delivered'
                                    ? 'Доставлено'
                                    : order.status === 'cancelled'
                                    ? 'Скасовано'
                                    : 'В обробці'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
