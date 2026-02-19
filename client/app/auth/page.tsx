'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Step1 from '@/app/components/auth/Step1';
import Step2 from '@/app/components/auth/Step2';
import Step3 from '@/app/components/auth/Step3';
import LoginForm from '@/app/components/auth/LoginForm';

type AuthMode = 'login' | 'register';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('login');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    phone: '',
    contactPerson: {
      fullName: '',
      position: '',
      phone: '',
      email: '',
    },
    legalAddress: {
      street: '',
      city: '',
      region: '',
      postalCode: '',
      country: 'Україна',
    },
  });

  const totalSteps = 3;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Валідація обов'язкових полів перед відправкою
      if (!formData.companyName?.trim()) {
        throw new Error('Назва компанії обов\'язкова');
      }
      if (!formData.phone?.trim()) {
        throw new Error('Телефон компанії обов\'язковий');
      }
      if (!formData.contactPerson?.fullName?.trim()) {
        throw new Error('ПІБ контактної особи обов\'язковий');
      }
      if (!formData.contactPerson?.position?.trim()) {
        throw new Error('Посада контактної особи обов\'язкова');
      }
      if (!formData.contactPerson?.phone?.trim()) {
        throw new Error('Телефон контактної особи обов\'язковий');
      }
      if (!formData.legalAddress?.street?.trim()) {
        throw new Error('Вулиця юридичної адреси обов\'язкова');
      }
      if (!formData.legalAddress?.city?.trim()) {
        throw new Error('Місто обов\'язкове');
      }
      if (!formData.legalAddress?.region?.trim()) {
        throw new Error('Область обов\'язкова');
      }
      if (!formData.legalAddress?.postalCode?.trim()) {
        throw new Error('Поштовий індекс обов\'язковий');
      }
      if (!formData.legalAddress?.country?.trim()) {
        throw new Error('Країна обов\'язкова');
      }

      // Підготовка даних для реєстрації
      const registrationData = {
        email: formData.email,
        password: formData.password,
        businessProfile: {
          companyName: formData.companyName.trim(),
          phone: formData.phone.trim(),
          contactPerson: {
            fullName: formData.contactPerson.fullName.trim(),
            position: formData.contactPerson.position.trim(),
            phone: formData.contactPerson.phone.trim(),
            email: formData.contactPerson.email?.trim() || undefined,
          },
          legalAddress: {
            street: formData.legalAddress.street.trim(),
            city: formData.legalAddress.city.trim(),
            region: formData.legalAddress.region.trim(),
            postalCode: formData.legalAddress.postalCode.trim(),
            country: formData.legalAddress.country.trim(),
          },
        },
      };

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Для отримання cookies
        body: JSON.stringify(registrationData),
      });

      // Перевіряємо Content-Type перед парсингом JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Сервер повернув не JSON:', text.substring(0, 200));
        throw new Error('Сервер повернув некоректну відповідь. Перевірте, чи запущено API сервер.');
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Помилка реєстрації');
      }

      const data = await response.json();
      console.log('Реєстрація успішна:', data);

      // Зберігаємо дані користувача
      if (data.user?.id) {
        localStorage.setItem('userId', data.user.id);
      }
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
      }

      // Редирект на сторінку товарів
      router.push('/goods');
    } catch (error) {
      console.error('Помилка реєстрації:', error);
      throw error;
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Для отримання cookies
        body: JSON.stringify({ email, password }),
      });

      // Перевіряємо Content-Type перед парсингом JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Сервер повернув не JSON:', text.substring(0, 200));
        throw new Error('Сервер повернув некоректну відповідь. Перевірте, чи запущено API сервер.');
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Помилка входу');
      }

      const data = await response.json();
      console.log('Вхід успішний:', data);

      // Зберігаємо дані користувача
      if (data.user?.id) {
        localStorage.setItem('userId', data.user.id);
      }
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
      }

      // Редирект на сторінку товарів
      router.push('/goods');
    } catch (error) {
      console.error('Помилка входу:', error);
      throw error;
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="auth-background min-h-screen flex items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-md">
        {/* Mode Toggle */}
        <div className="mb-6 flex bg-white/10 backdrop-blur-sm rounded-lg p-1">
          <button
            onClick={() => {
              setMode('login');
              setCurrentStep(1);
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              mode === 'login'
                ? 'bg-white text-[#1a4d3a] shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Вхід
          </button>
          <button
            onClick={() => {
              setMode('register');
              setCurrentStep(1);
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              mode === 'register'
                ? 'bg-white text-[#1a4d3a] shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Реєстрація
          </button>
        </div>

        {/* Progress Bar - тільки для реєстрації */}
        {mode === 'register' && (
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 mx-1 rounded-full transition-all duration-300 ${
                    index + 1 <= currentStep
                      ? 'bg-[#ff6b35]'
                      : 'bg-[#2d6b4f] opacity-30'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-white/70 text-center">
              Крок {currentStep} з {totalSteps}
            </p>
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Content */}
          <div className="min-h-[400px]">
            {mode === 'login' ? (
              <LoginForm 
                onLogin={handleLogin}
                onSwitchToRegister={() => setMode('register')}
              />
            ) : (
              <>
                {currentStep === 1 && (
                  <Step1
                    formData={formData}
                    updateFormData={updateFormData}
                    onNext={handleNext}
                    onSwitchToLogin={() => setMode('login')}
                  />
                )}
                {currentStep === 2 && (
                  <Step2
                    formData={formData}
                    updateFormData={updateFormData}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                )}
                {currentStep === 3 && (
                  <Step3
                    formData={formData}
                    updateFormData={updateFormData}
                    onSubmit={handleSubmit}
                    onBack={handleBack}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#ff6b35]/10 rounded-full blur-3xl -z-0" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#2d6b4f]/20 rounded-full blur-3xl -z-0" />
      </div>
    </div>
  );
}
