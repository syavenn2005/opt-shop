'use client';

import { useState } from 'react';

interface Step3Props {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export default function Step3({ formData, updateFormData, onSubmit, onBack }: Step3Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit();
      // onSubmit тепер виконує редирект, тому тут нічого не робимо
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка реєстрації');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Перевірте дані
        </h2>
        <p className="text-gray-600">
          Перевірте введену інформацію перед завершенням реєстрації
        </p>
      </div>

      <div className="space-y-4 bg-gray-50 rounded-lg p-6">
        <div className="border-b pb-3">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Облікові дані</h3>
          <div className="space-y-1">
            <p className="text-gray-900">
              <span className="font-medium">Email:</span> {formData.email}
            </p>
          </div>
        </div>

        <div className="border-b pb-3">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Компанія</h3>
          <div className="space-y-1">
            <p className="text-gray-900">
              <span className="font-medium">Назва:</span> {formData.companyName || 'Не вказано'}
            </p>
            <p className="text-gray-900">
              <span className="font-medium">Телефон:</span> {formData.phone || 'Не вказано'}
            </p>
          </div>
        </div>

        <div className="border-b pb-3">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Контактна особа</h3>
          <div className="space-y-1">
            <p className="text-gray-900">
              <span className="font-medium">ПІБ:</span> {formData.contactPerson.fullName || 'Не вказано'}
            </p>
            <p className="text-gray-900">
              <span className="font-medium">Посада:</span> {formData.contactPerson.position || 'Не вказано'}
            </p>
            <p className="text-gray-900">
              <span className="font-medium">Телефон:</span> {formData.contactPerson.phone || 'Не вказано'}
            </p>
            {formData.contactPerson.email && (
              <p className="text-gray-900">
                <span className="font-medium">Email:</span> {formData.contactPerson.email}
              </p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Юридична адреса</h3>
          <div className="space-y-1">
            <p className="text-gray-900">
              <span className="font-medium">Вулиця:</span> {formData.legalAddress?.street || 'Не вказано'}
            </p>
            <p className="text-gray-900">
              <span className="font-medium">Місто:</span> {formData.legalAddress?.city || 'Не вказано'}
            </p>
            <p className="text-gray-900">
              <span className="font-medium">Область:</span> {formData.legalAddress?.region || 'Не вказано'}
            </p>
            <p className="text-gray-900">
              <span className="font-medium">Поштовий індекс:</span> {formData.legalAddress?.postalCode || 'Не вказано'}
            </p>
            <p className="text-gray-900">
              <span className="font-medium">Країна:</span> {formData.legalAddress?.country || 'Не вказано'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Примітка:</span> Після реєстрації ви зможете додати додаткову інформацію про компанію, включаючи адреси, реєстраційні дані та бізнес-умови.
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Назад
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 bg-[#ff6b35] hover:bg-[#ff8555] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Обробка...
            </>
          ) : (
            <>
              Завершити реєстрацію
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
