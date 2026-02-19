'use client';

import { useState, useEffect } from 'react';

interface CreateGoodModalProps {
  categories: string[];
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export default function CreateGoodModal({
  categories,
  onClose,
  onSubmit,
}: CreateGoodModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    description: '',
    category: '',
    subcategory: '',
    price: '',
    currency: 'UAH',
    unit: 'шт',
    minimumOrderQuantity: '1',
    inStock: true,
    stockQuantity: '',
    photos: [] as string[],
    specifications: {} as Record<string, string>,
    licenses: [] as Array<{
      type: string;
      description: string;
      validUntil: string;
      certificateNumber: string;
      issuer: string;
    }>,
  });

  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLicenseForm, setShowLicenseForm] = useState(false);
  const [newLicense, setNewLicense] = useState({
    type: '',
    description: '',
    validUntil: '',
    certificateNumber: '',
    issuer: '',
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Завантаження підкатегорій
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!formData.category) {
        setSubcategories([]);
        return;
      }
      try {
        const response = await fetch(
          `${API_URL}/goods/categories/${encodeURIComponent(formData.category)}/subcategories`
        );
        if (response.ok) {
          const data = await response.json();
          setSubcategories(data.subcategories || []);
        }
      } catch (err) {
        console.error('Помилка завантаження підкатегорій:', err);
      }
    };
    fetchSubcategories();
  }, [formData.category, API_URL]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPhotos(true);
    setError(null);

    try {
      const formDataToUpload = new FormData();
      
      // Додаємо всі файли
      Array.from(files).forEach((file) => {
        formDataToUpload.append('photos', file);
      });

      const response = await fetch(`${API_URL}/upload/multiple`, {
        method: 'POST',
        credentials: 'include',
        body: formDataToUpload,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Помилка завантаження зображень');
      }

      const data = await response.json();
      
      // Додаємо завантажені зображення до списку
      const newPhotos = data.files.map((file: { path: string }) => file.path);
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos],
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка завантаження зображень');
    } finally {
      setUploadingPhotos(false);
      // Очищаємо input, щоб можна було завантажити той самий файл знову
      e.target.value = '';
    }
  };

  const handleRemovePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleAddLicense = () => {
    if (!newLicense.type.trim()) {
      setError('Тип ліцензії обов\'язковий');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      licenses: [...prev.licenses, { ...newLicense }],
    }));
    setNewLicense({
      type: '',
      description: '',
      validUntil: '',
      certificateNumber: '',
      issuer: '',
    });
    setShowLicenseForm(false);
    setError(null);
  };

  const handleRemoveLicense = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      licenses: prev.licenses.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Валідація
      if (!formData.name.trim()) {
        throw new Error('Назва товару обов\'язкова');
      }
      if (!formData.category) {
        throw new Error('Категорія обов\'язкова');
      }
      if (!formData.price || parseFloat(formData.price) <= 0) {
        throw new Error('Валідна ціна обов\'язкова');
      }

      const submitData = {
        name: formData.name,
        nameEn: formData.nameEn || undefined,
        description: formData.description || undefined,
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        price: parseFloat(formData.price),
        currency: formData.currency,
        unit: formData.unit,
        minimumOrderQuantity: parseInt(formData.minimumOrderQuantity) || 1,
        inStock: formData.inStock,
        stockQuantity: formData.stockQuantity ? parseInt(formData.stockQuantity) : undefined,
        photos: formData.photos,
        specifications: Object.keys(formData.specifications).length > 0 ? formData.specifications : undefined,
        licenses: formData.licenses.length > 0 ? formData.licenses.map(license => ({
          ...license,
          validUntil: license.validUntil ? new Date(license.validUntil).toISOString() : undefined,
        })) : undefined,
      };

      await onSubmit(submitData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка створення товару');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-900">Створити товар</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Основна інформація */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Назва товару *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Назва англійською
              </label>
              <input
                type="text"
                value={formData.nameEn}
                onChange={(e) => handleChange('nameEn', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категорія *
              </label>
              <select
                value={formData.category}
                onChange={(e) => {
                  handleChange('category', e.target.value);
                  handleChange('subcategory', '');
                }}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900"
              >
                <option value="">Оберіть категорію</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Підкатегорія
              </label>
              <select
                value={formData.subcategory}
                onChange={(e) => handleChange('subcategory', e.target.value)}
                disabled={!formData.category}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900 disabled:bg-gray-100"
              >
                <option value="">Оберіть підкатегорію</option>
                {subcategories.map((subcat) => (
                  <option key={subcat} value={subcat}>
                    {subcat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ціна *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Валюта
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900"
              >
                <option value="UAH">UAH</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Одиниця виміру
              </label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
                placeholder="шт, кг, м, л..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Мінімальна кількість замовлення
              </label>
              <input
                type="number"
                value={formData.minimumOrderQuantity}
                onChange={(e) => handleChange('minimumOrderQuantity', e.target.value)}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Наявність на складі
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) => handleChange('inStock', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-gray-700">Є в наявності</span>
              </label>
            </div>

            {formData.inStock && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Кількість на складі
                </label>
                <input
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => handleChange('stockQuantity', e.target.value)}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900"
                />
              </div>
            )}
          </div>

          {/* Опис */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Опис
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900"
            />
          </div>

          {/* Завантаження зображень */}
          <div className="border-t border-gray-200 pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Фото товару
            </label>
            <div className="space-y-4">
              {/* Input для завантаження */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhotos}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {uploadingPhotos && (
                  <p className="mt-2 text-sm text-gray-600">Завантаження...</p>
                )}
              </div>

              {/* Прев'ю завантажених зображень */}
              {formData.photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={`${API_URL}${photo}`}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Видалити фото"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Ліцензії */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Ліцензії та сертифікати</h3>
              <button
                type="button"
                onClick={() => setShowLicenseForm(!showLicenseForm)}
                className="text-[#ff6b35] hover:text-[#ff8555] font-medium text-sm"
              >
                + Додати ліцензію
              </button>
            </div>

            {/* Список доданих ліцензій */}
            {formData.licenses.length > 0 && (
              <div className="space-y-2 mb-4">
                {formData.licenses.map((license, index) => (
                  <div key={index} className="bg-green-50 p-4 rounded-lg flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-green-800">{license.type}</p>
                      {license.issuer && <p className="text-sm text-green-700">Видано: {license.issuer}</p>}
                      {license.certificateNumber && (
                        <p className="text-sm text-green-700">Сертифікат: {license.certificateNumber}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveLicense(index)}
                      className="text-red-500 hover:text-red-700 ml-4"
                    >
                      Видалити
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Форма додавання ліцензії */}
            {showLicenseForm && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тип ліцензії *
                  </label>
                  <input
                    type="text"
                    value={newLicense.type}
                    onChange={(e) => setNewLicense({ ...newLicense, type: e.target.value })}
                    placeholder="Наприклад: Стандартна, Преміум, Enterprise"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Видано
                    </label>
                    <input
                      type="text"
                      value={newLicense.issuer}
                      onChange={(e) => setNewLicense({ ...newLicense, issuer: e.target.value })}
                      placeholder="Організація, що видала"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Номер сертифікату
                    </label>
                    <input
                      type="text"
                      value={newLicense.certificateNumber}
                      onChange={(e) => setNewLicense({ ...newLicense, certificateNumber: e.target.value })}
                      placeholder="Номер сертифікату"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Дійсна до
                    </label>
                    <input
                      type="date"
                      value={newLicense.validUntil}
                      onChange={(e) => setNewLicense({ ...newLicense, validUntil: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Опис
                  </label>
                  <textarea
                    value={newLicense.description}
                    onChange={(e) => setNewLicense({ ...newLicense, description: e.target.value })}
                    rows={2}
                    placeholder="Додаткова інформація про ліцензію"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAddLicense}
                    className="px-4 py-2 bg-[#ff6b35] hover:bg-[#ff8555] text-white rounded-lg transition-colors"
                  >
                    Додати
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLicenseForm(false);
                      setNewLicense({
                        type: '',
                        description: '',
                        validUntil: '',
                        certificateNumber: '',
                        issuer: '',
                      });
                    }}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                  >
                    Скасувати
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Кнопки */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#ff6b35] hover:bg-[#ff8555] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Створення...' : 'Створити товар'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
