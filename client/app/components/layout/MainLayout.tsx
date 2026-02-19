'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navigation from './Navigation';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Перевіряємо, чи користувач авторизований
    const checkAuth = () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        router.push('/auth');
        return false;
      }
      return true;
    };

    const isAuth = checkAuth();
    setIsAuthenticated(isAuth);
    setIsChecking(false);
  }, [router]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    router.push('/auth');
  };

  if (isChecking) {
    return (
      <div className="auth-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white mt-4">Завантаження...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Буде перенаправлено на /auth
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onLogout={handleLogout} />
      <main className="relative">
        {children}
      </main>
    </div>
  );
}
