'use client';

import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';

interface Order {
  _id: string;
  buyer: {
    _id: string;
    companyName: string;
    email?: string;
    phone?: string;
  };
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
    price: number;
    currency: string;
    unit: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  deliveryAddress?: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  contactPerson?: {
    fullName: string;
    phone: string;
    email?: string;
  };
  notes?: string;
  supplierNotes?: string;
  createdAt: string;
  updatedAt: string;
}

const statusLabels: Record<Order['status'], string> = {
  pending: 'Очікує підтвердження',
  confirmed: 'Підтверджено',
  processing: 'Обробляється',
  shipped: 'Відправлено',
  delivered: 'Доставлено',
  cancelled: 'Скасовано',
};

const statusColors: Record<Order['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function PurchasesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('Користувач не авторизований');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const url = statusFilter
          ? `${API_URL}/orders/buyer/${userId}?status=${statusFilter}`
          : `${API_URL}/orders/buyer/${userId}`;

        const response = await fetch(url, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Помилка завантаження замовлень');
        }

        const data = await response.json();
        setOrders(data.orders || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Невідома помилка');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [statusFilter, API_URL]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <MainLayout>
      <div className="auth-background min-h-screen py-8 px-4 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl font-bold text-white mb-8">Мої покупки</h1>

          {/* Фільтр за статусом */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Фільтр за статусом:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900"
              >
                <option value="">Всі замовлення</option>
                <option value="pending">Очікує підтвердження</option>
                <option value="confirmed">Підтверджено</option>
                <option value="processing">Обробляється</option>
                <option value="shipped">Відправлено</option>
                <option value="delivered">Доставлено</option>
                <option value="cancelled">Скасовано</option>
              </select>
            </div>
          </div>

          {/* Список замовлень */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="text-white mt-4">Завантаження...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <p className="text-gray-600 text-lg">
                {statusFilter ? 'Замовлень з таким статусом не знайдено' : 'У вас поки що немає замовлень'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-200 cursor-pointer"
                  onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Ліва частина - інформація про товар */}
                      <div className="flex gap-4 flex-1">
                        {/* Фото товару */}
                        {order.good.photos && order.good.photos.length > 0 ? (
                          <img
                            src={`${API_URL}${order.good.photos[0]}`}
                            alt={order.good.name}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 text-xs">Немає фото</span>
                          </div>
                        )}

                        {/* Інформація про товар */}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{order.good.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <span>Кількість: {order.quantity} {order.good.unit}</span>
                            <span>Ціна за одиницю: {order.unitPrice} {order.currency}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-lg font-bold text-[#ff6b35]">
                              Загальна сума: {order.totalPrice} {order.currency}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Права частина - статус та дата */}
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}
                        >
                          {statusLabels[order.status]}
                        </span>
                        <span className="text-sm text-gray-600">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Інформація про постачальника */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-3">
                        {order.supplier.logo && (
                          <img
                            src={order.supplier.logo}
                            alt={order.supplier.companyName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Постачальник: {order.supplier.companyName}
                          </p>
                          {order.supplier.phone && (
                            <p className="text-xs text-gray-500">{order.supplier.phone}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Розгорнута інформація */}
                    {selectedOrder?._id === order._id && (
                      <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                        {/* Адреса доставки */}
                        {order.deliveryAddress && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Адреса доставки:</h4>
                            <p className="text-sm text-gray-600">
                              {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.region}, {order.deliveryAddress.postalCode}, {order.deliveryAddress.country}
                            </p>
                          </div>
                        )}

                        {/* Контактна особа */}
                        {order.contactPerson && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Контактна особа:</h4>
                            <p className="text-sm text-gray-600">
                              {order.contactPerson.fullName}, {order.contactPerson.phone}
                              {order.contactPerson.email && `, ${order.contactPerson.email}`}
                            </p>
                          </div>
                        )}

                        {/* Примітки */}
                        {order.notes && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Ваші примітки:</h4>
                            <p className="text-sm text-gray-600">{order.notes}</p>
                          </div>
                        )}

                        {/* Примітки від постачальника */}
                        {order.supplierNotes && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Примітки від постачальника:</h4>
                            <p className="text-sm text-gray-600">{order.supplierNotes}</p>
                          </div>
                        )}

                        {/* Дата оновлення */}
                        <div className="text-xs text-gray-500">
                          Оновлено: {formatDate(order.updatedAt)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
