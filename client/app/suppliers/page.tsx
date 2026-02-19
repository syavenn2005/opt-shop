'use client';

import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import SuppliersList from '../components/suppliers/SuppliersList';
import SupplierGoods from '../components/suppliers/SupplierGoods';

interface Supplier {
  _id: string;
  companyName: string;
  companyNameEn?: string;
  description?: string;
  email: string;
  phone: string;
  logo?: string;
  photos?: string[];
  legalAddress: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  contactPerson: {
    fullName: string;
    position: string;
    phone: string;
    email?: string;
  };
  isVerified: boolean;
  rating?: number;
  reviewsCount?: number;
  createdAt: string;
}

interface SuppliersResponse {
  suppliers: Supplier[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [selectedSupplierName, setSelectedSupplierName] = useState<string>('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Завантаження постачальників
  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        params.append('page', currentPage.toString());
        params.append('limit', '12');

        const response = await fetch(`${API_URL}/users/suppliers?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Помилка завантаження постачальників');
        }

        const data: SuppliersResponse = await response.json();
        setSuppliers(data.suppliers);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Невідома помилка');
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, [currentPage, searchQuery, API_URL]);

  const handleSupplierClick = (supplierId: string) => {
    const supplier = suppliers.find((s) => s._id === supplierId);
    if (supplier) {
      if (selectedSupplierId === supplierId) {
        // Якщо клікнули на вже вибраного постачальника, закриваємо
        setSelectedSupplierId(null);
        setSelectedSupplierName('');
      } else {
        setSelectedSupplierId(supplierId);
        setSelectedSupplierName(supplier.companyName);
      }
    }
  };

  const handleCloseGoods = () => {
    setSelectedSupplierId(null);
    setSelectedSupplierName('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Скидаємо на першу сторінку при пошуку
  };

  return (
    <MainLayout>
      <div className="auth-background min-h-screen py-8 px-4 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl font-bold text-white mb-8">Постачальники</h1>

          {/* Пошук */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Пошук по назві компанії або email..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Список постачальників */}
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
                {searchQuery ? 'Постачальників не знайдено' : 'Поки що немає постачальників'}
              </p>
            </div>
          ) : (
            <>
              <SuppliersList
                suppliers={suppliers}
                onSupplierClick={handleSupplierClick}
                selectedSupplierId={selectedSupplierId || undefined}
              />

              {/* Пагінація */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Попередня
                  </button>
                  <span className="px-4 py-2 bg-white/10 text-white rounded-lg">
                    Сторінка {currentPage} з {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Наступна
                  </button>
                </div>
              )}
            </>
          )}

          {/* Товари вибраного постачальника */}
          {selectedSupplierId && selectedSupplierName && (
            <SupplierGoods
              supplierId={selectedSupplierId}
              supplierName={selectedSupplierName}
              onClose={handleCloseGoods}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
