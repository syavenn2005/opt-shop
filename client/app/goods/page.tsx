'use client';

import { useState, useEffect } from 'react';
import GoodsList from '../components/goods/GoodsList';
import GoodsFilters from '../components/goods/GoodsFilters';
import CreateGoodModal from '../components/goods/CreateGoodModal';
import MainLayout from '../components/layout/MainLayout';

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

interface GoodsResponse {
  goods: Good[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function GoodsPage() {
  const [goods, setGoods] = useState<Good[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Фільтри
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    subcategory: '',
    minPrice: '',
    maxPrice: '',
    inStock: '',
    sortBy: 'createdAt' as 'price' | 'createdAt' | 'name',
    sortOrder: 'desc' as 'asc' | 'desc',
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Завантаження категорій
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/goods/categories/list`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error('Помилка завантаження категорій:', err);
      }
    };
    fetchCategories();
  }, [API_URL]);

  // Завантаження підкатегорій
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!filters.category) {
        setSubcategories([]);
        return;
      }
      try {
        const response = await fetch(`${API_URL}/goods/categories/${encodeURIComponent(filters.category)}/subcategories`);
        if (response.ok) {
          const data = await response.json();
          setSubcategories(data.subcategories || []);
        }
      } catch (err) {
        console.error('Помилка завантаження підкатегорій:', err);
      }
    };
    fetchSubcategories();
  }, [filters.category, API_URL]);

  // Завантаження товарів
  useEffect(() => {
    const fetchGoods = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.category) params.append('category', filters.category);
        if (filters.subcategory) params.append('subcategory', filters.subcategory);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.inStock) params.append('inStock', filters.inStock);
        params.append('sortBy', filters.sortBy);
        params.append('sortOrder', filters.sortOrder);
        params.append('page', currentPage.toString());
        params.append('limit', '12');

        const response = await fetch(`${API_URL}/goods?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Помилка завантаження товарів');
        }

        const data: GoodsResponse = await response.json();
        setGoods(data.goods);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Невідома помилка');
      } finally {
        setLoading(false);
      }
    };

    fetchGoods();
  }, [filters, currentPage, API_URL]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Скидаємо на першу сторінку при зміні фільтрів
  };

  const handleCreateGood = async (goodData: any) => {
    try {
      // Отримуємо ID користувача з localStorage
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('Користувач не авторизований. Будь ласка, увійдіть в систему.');
      }

      // Додаємо supplier до даних товару
      const dataWithSupplier = {
        ...goodData,
        supplier: userId,
      };

      const response = await fetch(`${API_URL}/goods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dataWithSupplier),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Помилка створення товару');
      }

      // Оновлюємо список товарів
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
      params.append('page', currentPage.toString());
      params.append('limit', '12');

      const refreshResponse = await fetch(`${API_URL}/goods?${params.toString()}`);
      if (refreshResponse.ok) {
        const data: GoodsResponse = await refreshResponse.json();
        setGoods(data.goods);
        setTotalPages(data.totalPages);
      }

      setIsCreateModalOpen(false);
    } catch (err) {
      throw err;
    }
  };

  return (
    <MainLayout>
      <div className="auth-background min-h-screen py-8 px-4 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Заголовок та кнопка створення */}
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h1 className="text-4xl font-bold text-white">Товари</h1>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[#ff6b35] hover:bg-[#ff8555] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl relative z-10 cursor-pointer"
              type="button"
            >
              + Додати товар
            </button>
          </div>

        {/* Фільтри */}
        <GoodsFilters
          filters={filters}
          categories={categories}
          subcategories={subcategories}
          onFilterChange={handleFilterChange}
        />

        {/* Список товарів */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="text-white mt-4">Завантаження...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : goods.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <p className="text-gray-600 text-lg">Товари не знайдено</p>
          </div>
        ) : (
          <>
            <GoodsList goods={goods} />
            
            {/* Пагінація */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Попередня
                </button>
                <span className="px-4 py-2 bg-white/10 text-white rounded-lg">
                  Сторінка {currentPage} з {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Наступна
                </button>
              </div>
            )}
          </>
        )}

        {/* Модальне вікно створення товару */}
        {isCreateModalOpen && (
          <CreateGoodModal
            categories={categories}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreateGood}
          />
        )}
        </div>
      </div>
    </MainLayout>
  );
}
