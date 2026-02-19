'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Good {
  _id: string;
  name: string;
  price: number;
  currency: string;
  unit: string;
  minimumOrderQuantity: number;
  inStock: boolean;
  stockQuantity?: number;
}

interface OrderFormProps {
  good: Good;
}

export default function OrderForm({ good }: OrderFormProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(good.minimumOrderQuantity);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    region: '',
    postalCode: '',
    country: 'Україна',
  });
  const [contactPerson, setContactPerson] = useState({
    fullName: '',
    phone: '',
    email: '',
  });
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const totalPrice = quantity * good.price;
  const maxQuantity = good.stockQuantity || Infinity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('Користувач не авторизований');
      }

      // Валідація
      if (quantity < good.minimumOrderQuantity) {
        throw new Error(`Мінімальна кількість замовлення: ${good.minimumOrderQuantity} ${good.unit}`);
      }

      if (quantity > maxQuantity) {
        throw new Error(`Доступна кількість: ${maxQuantity} ${good.unit}`);
      }

      if (!deliveryAddress.street.trim() || !deliveryAddress.city.trim() || !deliveryAddress.region.trim()) {
        throw new Error('Заповніть адресу доставки');
      }

      if (!contactPerson.fullName.trim() || !contactPerson.phone.trim()) {
        throw new Error('Заповніть контактну інформацію');
      }

      const requestBody = {
        userId,
        goodId: good._id,
        quantity: Number(quantity),
        deliveryAddress,
        contactPerson: {
          fullName: contactPerson.fullName.trim(),
          phone: contactPerson.phone.trim(),
          email: contactPerson.email.trim() || undefined,
        },
        notes: notes.trim() || undefined,
      };

      console.log('Відправка замовлення:', { ...requestBody, contactPerson: { ...requestBody.contactPerson } });

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });

      console.log('Відповідь сервера:', response.status, response.statusText);

      // Перевіряємо content-type перед парсингом JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Сервер повернув не JSON:', text.substring(0, 500));
        throw new Error('Сервер повернув некоректну відповідь. Перевірте, чи запущено API сервер на порту 3001.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Помилка від сервера:', errorData);
        throw new Error(errorData.error || 'Помилка створення замовлення');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/purchases');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Невідома помилка');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Замовлення успішно створено!</h3>
          <p className="text-gray-600">Перенаправлення на сторінку покупок...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Зробити замовлення</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Кількість */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Кількість ({good.unit}) *
          </label>
          <input
            type="number"
            min={good.minimumOrderQuantity}
            max={maxQuantity}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || good.minimumOrderQuantity)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900"
            required
          />
          <p className="text-sm text-gray-600 mt-1">
            Мін: {good.minimumOrderQuantity} {good.unit}
            {good.stockQuantity !== undefined && ` • Макс: ${good.stockQuantity} ${good.unit}`}
          </p>
        </div>

        {/* Загальна сума */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Загальна сума:</span>
            <span className="text-2xl font-bold text-[#ff6b35]">
              {totalPrice.toFixed(2)} {good.currency}
            </span>
          </div>
        </div>

        {/* Адреса доставки */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Адреса доставки</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Вулиця *</label>
              <input
                type="text"
                value={deliveryAddress.street}
                onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Місто *</label>
                <input
                  type="text"
                  value={deliveryAddress.city}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Область *</label>
                <input
                  type="text"
                  value={deliveryAddress.region}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, region: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Поштовий індекс *</label>
                <input
                  type="text"
                  value={deliveryAddress.postalCode}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, postalCode: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Країна *</label>
                <input
                  type="text"
                  value={deliveryAddress.country}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, country: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Контактна особа */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Контактна особа</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ПІБ *</label>
              <input
                type="text"
                value={contactPerson.fullName}
                onChange={(e) => setContactPerson({ ...contactPerson, fullName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Телефон *</label>
                <input
                  type="tel"
                  value={contactPerson.phone}
                  onChange={(e) => setContactPerson({ ...contactPerson, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={contactPerson.email}
                  onChange={(e) => setContactPerson({ ...contactPerson, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Примітки */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Додаткові примітки</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900"
            placeholder="Додаткові побажання щодо замовлення..."
          />
        </div>

        {/* Кнопка відправки */}
        <button
          type="submit"
          disabled={loading || !good.inStock}
          className="w-full bg-[#ff6b35] hover:bg-[#ff8555] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Створення замовлення...' : 'Зробити замовлення'}
        </button>
      </form>
    </div>
  );
}
