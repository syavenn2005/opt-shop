'use client';

import { useState } from 'react';
import Step1 from '@/app/components/auth/Step1';
import Step2 from '@/app/components/auth/Step2';
import Step3 from '@/app/components/auth/Step3';
import LoginForm from '@/app/components/auth/LoginForm';

type AuthMode = 'login' | 'register';

export default function AuthPage() {
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
  });

  const totalSteps = 3;

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
    // Тут буде логіка відправки даних на сервер
    console.log('Submitting form data:', formData);
    // TODO: Викликати API для реєстрації
  };

  const handleLogin = async (email: string, password: string) => {
    // Тут буде логіка входу
    console.log('Logging in with:', { email, password });
    // TODO: Викликати API для входу
    // Приклад:
    // const response = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password }),
    // });
    // if (!response.ok) throw new Error('Помилка входу');
    // const data = await response.json();
    // // Зберегти токен та перенаправити
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
