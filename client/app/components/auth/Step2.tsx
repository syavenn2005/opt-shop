'use client';

interface Step2Props {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2({ formData, updateFormData, onNext, onBack }: Step2Props) {
  const handleContactPersonChange = (field: string, value: string) => {
    updateFormData('contactPerson', {
      ...formData.contactPerson,
      [field]: value,
    });
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] transition-colors"
            placeholder="ТОВ 'Назва компанії'"
          />
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] transition-colors"
            placeholder="+380 XX XXX XXXX"
          />
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] transition-colors"
                placeholder="Іван Іванович Іванов"
              />
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] transition-colors"
                placeholder="Директор"
              />
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] transition-colors"
                placeholder="+380 XX XXX XXXX"
              />
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
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          Назад
        </button>
        <button
          onClick={onNext}
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
