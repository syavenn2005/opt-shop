'use client';

import Image from 'next/image';

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

interface GoodsListProps {
  goods: Good[];
}

export default function GoodsList({ goods }: GoodsListProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {goods.map((good) => (
        <div
          key={good._id}
          className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-200"
        >
          {/* Фото товару */}
          <div className="relative h-48 bg-gray-200">
            {good.photos && good.photos.length > 0 ? (
              <img
                src={`${API_URL}${good.photos[0]}`}
                alt={good.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            {!good.inStock && (
              <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Немає в наявності
              </div>
            )}
          </div>

          {/* Інформація про товар */}
          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-gray-900">{good.name}</h3>
              {good.licenses && good.licenses.length > 0 && (
                <div className="flex gap-1">
                  {good.licenses.map((license, idx) => (
                    <span
                      key={idx}
                      className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                      title={`Ліцензія: ${license.type}${license.issuer ? ` від ${license.issuer}` : ''}`}
                    >
                      ✓
                    </span>
                  ))}
                </div>
              )}
            </div>

            {good.nameEn && (
              <p className="text-sm text-gray-500 mb-2">{good.nameEn}</p>
            )}

            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-600">{good.category}</span>
              {good.subcategory && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600">{good.subcategory}</span>
                </>
              )}
            </div>

            {good.description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{good.description}</p>
            )}

            {/* Ціна та мінімальна кількість */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-2xl font-bold text-[#ff6b35]">
                  {good.price} {good.currency}
                </span>
                <span className="text-gray-500 text-sm ml-1">/ {good.unit}</span>
              </div>
              {good.inStock && good.stockQuantity !== undefined && (
                <span className="text-sm text-gray-600">
                  На складі: {good.stockQuantity} {good.unit}
                </span>
              )}
            </div>

            <div className="text-sm text-gray-600 mb-4">
              Мін. замовлення: {good.minimumOrderQuantity} {good.unit}
            </div>

            {/* Постачальник */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              {good.supplier.logo && (
                <img
                  src={good.supplier.logo}
                  alt={good.supplier.companyName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{good.supplier.companyName}</p>
                {good.supplier.phone && (
                  <p className="text-xs text-gray-500">{good.supplier.phone}</p>
                )}
              </div>
            </div>

            {/* Ліцензії (детальна інформація) */}
            {good.licenses && good.licenses.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-2">Ліцензії:</p>
                <div className="space-y-2">
                  {good.licenses.map((license, idx) => (
                    <div key={idx} className="bg-green-50 p-2 rounded-lg">
                      <p className="text-xs font-medium text-green-800">{license.type}</p>
                      {license.issuer && (
                        <p className="text-xs text-green-700">Видано: {license.issuer}</p>
                      )}
                      {license.certificateNumber && (
                        <p className="text-xs text-green-700">Сертифікат: {license.certificateNumber}</p>
                      )}
                      {license.validUntil && (
                        <p className="text-xs text-green-700">
                          Дійсна до: {new Date(license.validUntil).toLocaleDateString('uk-UA')}
                        </p>
                      )}
                      {license.description && (
                        <p className="text-xs text-green-600 mt-1">{license.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
