'use client';

import { useState, useEffect } from 'react';

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
}

interface SupplierGoodsProps {
  supplierId: string;
  supplierName: string;
  onClose: () => void;
}

export default function SupplierGoods({
  supplierId,
  supplierName,
  onClose,
}: SupplierGoodsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Товари постачальника: {supplierName}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <SupplierGoodsList supplierId={supplierId} />
    </div>
  );
}

function SupplierGoodsList({ supplierId }: { supplierId: string }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const [goods, setGoods] = useState<Good[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoods = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_URL}/goods?supplier=${supplierId}&limit=100`
        );
        if (!response.ok) {
          throw new Error('Помилка завантаження товарів');
        }
        const data = await response.json();
        setGoods(data.goods || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Невідома помилка');
      } finally {
        setLoading(false);
      }
    };

    if (supplierId) {
      fetchGoods();
    }
  }, [supplierId, API_URL]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b35]"></div>
        <p className="text-gray-600 mt-4">Завантаження товарів...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  if (goods.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">У цього постачальника поки що немає товарів</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {goods.map((good) => (
        <div
          key={good._id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
        >
          {/* Фото товару */}
          {good.photos && good.photos.length > 0 ? (
            <img
              src={`${API_URL}${good.photos[0]}`}
              alt={good.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-gray-400">Немає фото</span>
            </div>
          )}

          {/* Назва та опис */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{good.name}</h3>
          {good.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{good.description}</p>
          )}

          {/* Категорія */}
          <div className="mb-4">
            <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
              {good.category}
              {good.subcategory && ` / ${good.subcategory}`}
            </span>
          </div>

          {/* Ціна та наявність */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xl font-bold text-[#ff6b35]">
                {good.price} {good.currency}
              </p>
              <p className="text-sm text-gray-600">
                за {good.unit} • мін. замовлення: {good.minimumOrderQuantity}
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                good.inStock
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {good.inStock ? 'В наявності' : 'Немає'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
