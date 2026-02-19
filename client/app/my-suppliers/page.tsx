'use client';

import MainLayout from '../components/layout/MainLayout';

export default function MySuppliersPage() {
  return (
    <MainLayout>
      <div className="auth-background min-h-screen py-8 px-4 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl font-bold text-white mb-8">Мої постачальники</h1>
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <p className="text-gray-600 text-lg">Сторінка моїх постачальників в розробці</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
