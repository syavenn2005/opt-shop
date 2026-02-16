'use client';

import Link from 'next/link';

export default function Home() {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      const offset = 80; // Відступ від верху
      const elementPosition = featuresSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="auth-background min-h-screen relative">
      {/* Hero Section */}
      <section className="relative z-20 min-h-[80vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
            Оптові постачальники товарів
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Платформа для пошуку надійних оптових постачальників та розвитку вашого бізнесу
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/auth"
              className="bg-[#ff6b35] hover:bg-[#ff8555] text-white font-semibold py-5 px-10 rounded-lg transition-colors duration-200 text-xl shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Почати роботу
            </Link>
            <button
              onClick={scrollToFeatures}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold py-5 px-10 rounded-lg transition-colors duration-200 text-xl border-2 border-white/30 hover:border-white/50"
            >
              Дізнатися більше
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-20 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Чому обирають нас?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="w-16 h-16 bg-[#ff6b35]/10 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-[#ff6b35]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Надійні постачальники
              </h3>
              <p className="text-gray-600">
                Всі постачальники проходять верифікацію та мають перевірену репутацію на ринку
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="w-16 h-16 bg-[#ff6b35]/10 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-[#ff6b35]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Швидкий пошук
              </h3>
              <p className="text-gray-600">
                Знайдіть потрібного постачальника за кілька хвилин завдяки зручній системі пошуку та фільтрів
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="w-16 h-16 bg-[#ff6b35]/10 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-[#ff6b35]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Вигідні умови
              </h3>
              <p className="text-gray-600">
                Отримуйте найкращі ціни та умови співпраці від перевірених оптових постачальників
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-20 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Як це працює?
          </h2>
          
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-[#ff6b35] text-white rounded-full flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Зареєструйтеся
                </h3>
                <p className="text-gray-600">
                  Створіть обліковий запис та заповніть інформацію про вашу компанію. Це займе лише кілька хвилин.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-[#ff6b35] text-white rounded-full flex items-center justify-center text-2xl font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Знайдіть постачальників
                </h3>
                <p className="text-gray-600">
                  Використовуйте пошук та фільтри для знаходження постачальників, які відповідають вашим вимогам.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-[#ff6b35] text-white rounded-full flex items-center justify-center text-2xl font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Починайте співпрацю
                </h3>
                <p className="text-gray-600">
                  Зв'яжіться з постачальниками, обговоріть умови та розпочніть успішну співпрацю.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-20 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Готові почати?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Приєднуйтесь до сотень компаній, які вже знайшли своїх ідеальних постачальників
            </p>
            <Link
              href="/auth"
              className="inline-block bg-[#ff6b35] hover:bg-[#ff8555] text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              Створити обліковий запис
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 py-8 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-white/70">
          <p className="text-sm">
            © 2024 Оптові постачальники товарів. Всі права захищені.
          </p>
        </div>
      </footer>

      {/* Decorative elements */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-[#ff6b35]/15 rounded-full blur-[80px] bg-decoration pointer-events-none z-0" style={{ animationDelay: '0s' }} />
      <div className="fixed bottom-20 right-10 w-80 h-80 bg-[#2d6b4f]/20 rounded-full blur-[100px] bg-decoration pointer-events-none z-0" style={{ animationDelay: '2s' }} />
      <div className="fixed top-1/2 left-1/4 w-48 h-48 bg-[#ff6b35]/10 rounded-full blur-[70px] bg-decoration pointer-events-none z-0" style={{ animationDelay: '4s' }} />
      <div className="fixed top-1/3 right-1/4 w-56 h-56 bg-[#2d6b4f]/15 rounded-full blur-[90px] bg-decoration pointer-events-none z-0" style={{ animationDelay: '1s' }} />
      <div className="fixed bottom-1/3 left-1/3 w-40 h-40 bg-[#ff6b35]/12 rounded-full blur-[60px] bg-decoration pointer-events-none z-0" style={{ animationDelay: '3s' }} />
      
      {/* Додаткові світлові ефекти */}
      <div className="fixed top-0 left-1/2 w-96 h-96 bg-[#ff6b35]/5 rounded-full blur-[120px] pointer-events-none transform -translate-x-1/2 z-0" />
      <div className="fixed bottom-0 right-1/3 w-72 h-72 bg-[#2d6b4f]/8 rounded-full blur-[100px] pointer-events-none z-0" />
    </div>
  );
}
