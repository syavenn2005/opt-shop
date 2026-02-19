'use client';

import { useState } from 'react';

interface Step2Props {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2({ formData, updateFormData, onNext, onBack }: Step2Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState(false); // Чи була спроба відправити форму

  const handleContactPersonChange = (field: string, value: string) => {
    updateFormData('contactPerson', {
      ...formData.contactPerson,
      [field]: value,
    });
  };

  const handleLegalAddressChange = (field: string, value: string) => {
    updateFormData('legalAddress', {
      ...formData.legalAddress,
      [field]: value,
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName?.trim()) {
      newErrors.companyName = 'Назва компанії обов\'язкова';
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = 'Телефон компанії обов\'язковий';
    }

    if (!formData.contactPerson?.fullName?.trim()) {
      newErrors['contactPerson.fullName'] = 'ПІБ контактної особи обов\'язковий';
    }

    if (!formData.contactPerson?.position?.trim()) {
      newErrors['contactPerson.position'] = 'Посада контактної особи обов\'язкова';
    }

    if (!formData.contactPerson?.phone?.trim()) {
      newErrors['contactPerson.phone'] = 'Телефон контактної особи обов\'язковий';
    }

    if (!formData.legalAddress?.street?.trim()) {
      newErrors['legalAddress.street'] = 'Вулиця обов\'язкова';
    }

    if (!formData.legalAddress?.city?.trim()) {
      newErrors['legalAddress.city'] = 'Місто обов\'язкове';
    }

    if (!formData.legalAddress?.region?.trim()) {
      newErrors['legalAddress.region'] = 'Область обов\'язкова';
    }

    if (!formData.legalAddress?.postalCode?.trim()) {
      newErrors['legalAddress.postalCode'] = 'Поштовий індекс обов\'язковий';
    }

    if (!formData.legalAddress?.country?.trim()) {
      newErrors['legalAddress.country'] = 'Країна обов\'язкова';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    setTouched(true); // Позначаємо, що форма була спробована
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Інформація про компанію
        </h2>
        <p className="text-gray-600">
          Заповніть основну інформацію про вашу компанію
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
            Назва компанії *
          </label>
          <input
            id="companyName"
            type="text"
            value={formData.companyName}
            onChange={(e) => updateFormData('companyName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
              touched && errors.companyName
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-[#ff6b35]'
            }`}
            placeholder="ТОВ 'Назва компанії'"
          />
          {touched && errors.companyName && (
            <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Телефон *
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData('phone', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
              touched && errors.phone
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-[#ff6b35]'
            }`}
            placeholder="+380 XX XXX XXXX"
          />
          {touched && errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
          )}
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Контактна особа
          </h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="contactFullName" className="block text-sm font-medium text-gray-700 mb-2">
                ПІБ *
              </label>
              <input
                id="contactFullName"
                type="text"
                value={formData.contactPerson.fullName}
                onChange={(e) => handleContactPersonChange('fullName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                  touched && errors['contactPerson.fullName']
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-[#ff6b35]'
                }`}
                placeholder="Іван Іванович Іванов"
              />
              {touched && errors['contactPerson.fullName'] && (
                <p className="mt-1 text-sm text-red-500">{errors['contactPerson.fullName']}</p>
              )}
            </div>

            <div>
              <label htmlFor="contactPosition" className="block text-sm font-medium text-gray-700 mb-2">
                Посада *
              </label>
              <input
                id="contactPosition"
                type="text"
                value={formData.contactPerson.position}
                onChange={(e) => handleContactPersonChange('position', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                  touched && errors['contactPerson.position']
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-[#ff6b35]'
                }`}
                placeholder="Директор"
              />
              {touched && errors['contactPerson.position'] && (
                <p className="mt-1 text-sm text-red-500">{errors['contactPerson.position']}</p>
              )}
            </div>

            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                Телефон контактної особи *
              </label>
              <input
                id="contactPhone"
                type="tel"
                value={formData.contactPerson.phone}
                onChange={(e) => handleContactPersonChange('phone', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                  touched && errors['contactPerson.phone']
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-[#ff6b35]'
                }`}
                placeholder="+380 XX XXX XXXX"
              />
              {touched && errors['contactPerson.phone'] && (
                <p className="mt-1 text-sm text-red-500">{errors['contactPerson.phone']}</p>
              )}
            </div>

            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Email контактної особи
              </label>
              <input
                id="contactEmail"
                type="email"
                value={formData.contactPerson.email || ''}
                onChange={(e) => handleContactPersonChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] transition-colors"
                placeholder="contact@company.com"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Юридична адреса
          </h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="legalStreet" className="block text-sm font-medium text-gray-700 mb-2">
                Вулиця *
              </label>
              <input
                id="legalStreet"
                type="text"
                value={formData.legalAddress?.street || ''}
                onChange={(e) => handleLegalAddressChange('street', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                  touched && errors['legalAddress.street']
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-[#ff6b35]'
                }`}
                placeholder="вул. Хрещатик, 1"
              />
              {touched && errors['legalAddress.street'] && (
                <p className="mt-1 text-sm text-red-500">{errors['legalAddress.street']}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="legalCity" className="block text-sm font-medium text-gray-700 mb-2">
                  Місто *
                </label>
                <input
                  id="legalCity"
                  type="text"
                  value={formData.legalAddress?.city || ''}
                  onChange={(e) => handleLegalAddressChange('city', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                    touched && errors['legalAddress.city']
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-[#ff6b35]'
                  }`}
                  placeholder="Київ"
                />
                {touched && errors['legalAddress.city'] && (
                  <p className="mt-1 text-sm text-red-500">{errors['legalAddress.city']}</p>
                )}
              </div>

              <div>
                <label htmlFor="legalRegion" className="block text-sm font-medium text-gray-700 mb-2">
                  Область *
                </label>
                <input
                  id="legalRegion"
                  type="text"
                  value={formData.legalAddress?.region || ''}
                  onChange={(e) => handleLegalAddressChange('region', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                    touched && errors['legalAddress.region']
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-[#ff6b35]'
                  }`}
                  placeholder="Київська"
                />
                {touched && errors['legalAddress.region'] && (
                  <p className="mt-1 text-sm text-red-500">{errors['legalAddress.region']}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="legalPostalCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Поштовий індекс *
                </label>
                <input
                  id="legalPostalCode"
                  type="text"
                  value={formData.legalAddress?.postalCode || ''}
                  onChange={(e) => handleLegalAddressChange('postalCode', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                    touched && errors['legalAddress.postalCode']
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-[#ff6b35]'
                  }`}
                  placeholder="01001"
                />
                {touched && errors['legalAddress.postalCode'] && (
                  <p className="mt-1 text-sm text-red-500">{errors['legalAddress.postalCode']}</p>
                )}
              </div>

              <div>
                <label htmlFor="legalCountry" className="block text-sm font-medium text-gray-700 mb-2">
                  Країна *
                </label>
                <input
                  id="legalCountry"
                  type="text"
                  value={formData.legalAddress?.country || 'Україна'}
                  onChange={(e) => handleLegalAddressChange('country', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                    touched && errors['legalAddress.country']
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-[#ff6b35]'
                  }`}
                  placeholder="Україна"
                />
                {touched && errors['legalAddress.country'] && (
                  <p className="mt-1 text-sm text-red-500">{errors['legalAddress.country']}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          Назад
        </button>
        <button
          onClick={handleNext}
          className="flex-1 bg-[#ff6b35] hover:bg-[#ff8555] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          Продовжити
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
