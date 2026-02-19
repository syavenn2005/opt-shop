'use client';

interface Supplier {
  _id: string;
  companyName: string;
  companyNameEn?: string;
  description?: string;
  email: string;
  phone: string;
  logo?: string;
  photos?: string[];
  legalAddress: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  contactPerson: {
    fullName: string;
    position: string;
    phone: string;
    email?: string;
  };
  isVerified: boolean;
  rating?: number;
  reviewsCount?: number;
  createdAt: string;
}

interface SuppliersListProps {
  suppliers: Supplier[];
  onSupplierClick: (supplierId: string) => void;
  selectedSupplierId?: string;
}

export default function SuppliersList({
  suppliers,
  onSupplierClick,
  selectedSupplierId,
}: SuppliersListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {suppliers.map((supplier) => {
        const isSelected = selectedSupplierId === supplier._id;
        return (
          <div
            key={supplier._id}
            onClick={() => onSupplierClick(supplier._id)}
            className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-xl ${
              isSelected ? 'ring-2 ring-[#ff6b35]' : ''
            }`}
          >
            {/* Логотип або ініціали */}
            <div className="flex items-start gap-4 mb-4">
              {supplier.logo ? (
                <img
                  src={supplier.logo}
                  alt={supplier.companyName}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-[#ff6b35] flex items-center justify-center text-white font-bold text-xl">
                  {supplier.companyName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {supplier.companyName}
                </h3>
                {supplier.isVerified && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Верифіковано
                  </span>
                )}
              </div>
            </div>

            {/* Опис */}
            {supplier.description && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {supplier.description}
              </p>
            )}

            {/* Контактна інформація */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>{supplier.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>{supplier.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>
                  {supplier.legalAddress.city}, {supplier.legalAddress.region}
                </span>
              </div>
            </div>

            {/* Рейтинг */}
            {supplier.rating !== undefined && supplier.rating > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(supplier.rating || 0)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600">
                  {supplier.rating.toFixed(1)} ({supplier.reviewsCount || 0} відгуків)
                </span>
              </div>
            )}

            {/* Індикатор вибору */}
            {isSelected && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-[#ff6b35] font-medium text-center">
                  Натисніть, щоб переглянути товари
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
