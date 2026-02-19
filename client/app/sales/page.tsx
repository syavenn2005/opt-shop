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

const nextStatusOptions: Record<Order['status'], Order['status'][]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

export default function SalesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [supplierNotes, setSupplierNotes] = useState<Record<string, string>>({});

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
          ? `${API_URL}/orders/supplier/${userId}?status=${statusFilter}`
          : `${API_URL}/orders/supplier/${userId}`;

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

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingStatus(orderId);
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('Користувач не авторизований');
      }

      const notes = supplierNotes[orderId] || '';

      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          supplierId: userId,
          status: newStatus,
          supplierNotes: notes || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Помилка оновлення статусу');
      }

      // Оновлюємо список замовлень
      const updatedOrders = orders.map((order) =>
        order._id === orderId
          ? { ...order, status: newStatus, supplierNotes: notes || order.supplierNotes }
          : order
      );
      setOrders(updatedOrders);
      setSelectedOrder(null);
      setSupplierNotes({ ...supplierNotes, [orderId]: '' });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Помилка оновлення статусу');
    } finally {
      setUpdatingStatus(null);
    }
  };

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
          <h1 className="text-4xl font-bold text-white mb-8">Продажі</h1>

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
              {orders.map((order) => {
                const nextStatuses = nextStatusOptions[order.status];
                const isExpanded = selectedOrder?._id === order._id;
                return (
                  <div
                    key={order._id}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-200"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Ліва частина - інформація про товар та покупця */}
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

                          {/* Інформація про товар та покупця */}
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{order.good.name}</h3>
                            <div className="space-y-1 mb-2">
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>Кількість: {order.quantity} {order.good.unit}</span>
                                <span>Ціна за одиницю: {order.unitPrice} {order.currency}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-lg font-bold text-[#ff6b35]">
                                  Загальна сума: {order.totalPrice} {order.currency}
                                </span>
                              </div>
                            </div>
                            {/* Інформація про покупця */}
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <p className="text-sm font-semibold text-gray-900">
                                Покупець: {order.buyer.companyName}
                              </p>
                              {order.buyer.phone && (
                                <p className="text-xs text-gray-500">{order.buyer.phone}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Права частина - статус та дії */}
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}
                          >
                            {statusLabels[order.status]}
                          </span>
                          <span className="text-sm text-gray-600">
                            {formatDate(order.createdAt)}
                          </span>
                          <button
                            onClick={() => setSelectedOrder(isExpanded ? null : order)}
                            className="text-sm text-[#ff6b35] hover:text-[#ff8555] font-medium"
                          >
                            {isExpanded ? 'Приховати деталі' : 'Показати деталі'}
                          </button>
                        </div>
                      </div>

                      {/* Розгорнута інформація */}
                      {isExpanded && (
                        <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                          {/* Інформація про покупця */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Інформація про покупця:</h4>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-900">
                                <span className="font-medium">Компанія:</span> {order.buyer.companyName}
                              </p>
                              {order.buyer.phone && (
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Телефон:</span> {order.buyer.phone}
                                </p>
                              )}
                              {order.buyer.email && (
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Email:</span> {order.buyer.email}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Адреса доставки */}
                          {order.deliveryAddress && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Адреса доставки:</h4>
                              <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                                {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.region}, {order.deliveryAddress.postalCode}, {order.deliveryAddress.country}
                              </p>
                            </div>
                          )}

                          {/* Контактна особа */}
                          {order.contactPerson && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Контактна особа:</h4>
                              <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                                {order.contactPerson.fullName}, {order.contactPerson.phone}
                                {order.contactPerson.email && `, ${order.contactPerson.email}`}
                              </p>
                            </div>
                          )}

                          {/* Примітки від покупця */}
                          {order.notes && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Примітки від покупця:</h4>
                              <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">{order.notes}</p>
                            </div>
                          )}

                          {/* Примітки від постачальника */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Ваші примітки:</h4>
                            <textarea
                              value={supplierNotes[order._id] || order.supplierNotes || ''}
                              onChange={(e) =>
                                setSupplierNotes({ ...supplierNotes, [order._id]: e.target.value })
                              }
                              rows={3}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900"
                              placeholder="Додайте примітки до замовлення..."
                            />
                          </div>

                          {/* Зміна статусу */}
                          {nextStatuses.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Змінити статус:</h4>
                              <div className="flex flex-wrap gap-2">
                                {nextStatuses.map((status) => (
                                  <button
                                    key={status}
                                    onClick={() => handleStatusUpdate(order._id, status)}
                                    disabled={updatingStatus === order._id}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                      status === 'cancelled'
                                        ? 'bg-red-500 hover:bg-red-600 text-white'
                                        : 'bg-[#ff6b35] hover:bg-[#ff8555] text-white'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                  >
                                    {updatingStatus === order._id
                                      ? 'Оновлення...'
                                      : statusLabels[status]}
                                  </button>
                                ))}
                              </div>
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
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
