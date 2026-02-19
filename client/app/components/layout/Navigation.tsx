'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavigationProps {
  onLogout?: () => void;
}

export default function Navigation({ onLogout }: NavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const menuItems = [
    { label: 'Товари', path: '/goods' },
    { label: 'Постачальники', path: '/suppliers' },
    { label: 'Мої постачальники', path: '/my-suppliers' },
    { label: 'Продажі', path: '/sales' },
    { label: 'Покупки', path: '/purchases' },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Очищаємо localStorage
        localStorage.removeItem('userId');
        localStorage.removeItem('accessToken');
        
        // Викликаємо callback якщо він є
        if (onLogout) {
          onLogout();
        }
        
        // Перенаправляємо на сторінку авторизації
        router.push('/auth');
      } else {
        console.error('Помилка виходу з акаунта');
        // Все одно очищаємо localStorage і перенаправляємо
        localStorage.removeItem('userId');
        localStorage.removeItem('accessToken');
        router.push('/auth');
      }
    } catch (error) {
      console.error('Помилка виходу з акаунта:', error);
      // Все одно очищаємо localStorage і перенаправляємо
      localStorage.removeItem('userId');
      localStorage.removeItem('accessToken');
      router.push('/auth');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Логотип/Назва */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-[#ff6b35]">Opt-Shop</h1>
          </div>

          {/* Навігаційні посилання */}
          <div className="hidden md:flex space-x-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-[#ff6b35] text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-[#ff6b35]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Кнопка виходу */}
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoggingOut ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Вихід...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Вийти з акаунта
                </>
              )}
            </button>
          </div>
        </div>

        {/* Мобільне меню */}
        <div className="md:hidden pb-4">
          <div className="flex flex-col space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-left ${
                    isActive
                      ? 'bg-[#ff6b35] text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-[#ff6b35]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
