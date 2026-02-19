'use client';

interface GoodsFiltersProps {
  filters: {
    search: string;
    category: string;
    subcategory: string;
    minPrice: string;
    maxPrice: string;
    inStock: string;
    sortBy: 'price' | 'createdAt' | 'name';
    sortOrder: 'asc' | 'desc';
  };
  categories: string[];
  subcategories: string[];
  onFilterChange: (key: string, value: string) => void;
}

export default function GoodsFilters({
  filters,
  categories,
  subcategories,
  onFilterChange,
}: GoodsFiltersProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {/* Пошук */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Пошук
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            placeholder="Назва товару, опис..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900"
          />
        </div>

        {/* Категорія */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Категорія
          </label>
          <select
            value={filters.category}
            onChange={(e) => {
              onFilterChange('category', e.target.value);
              onFilterChange('subcategory', ''); // Скидаємо підкатегорію
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900 relative z-20 cursor-pointer"
          >
            <option value="">Всі категорії</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Підкатегорія */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Підкатегорія
          </label>
          <select
            value={filters.subcategory}
            onChange={(e) => onFilterChange('subcategory', e.target.value)}
            disabled={!filters.category}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed relative z-20 cursor-pointer"
          >
            <option value="">Всі підкатегорії</option>
            {subcategories.map((subcat) => (
              <option key={subcat} value={subcat}>
                {subcat}
              </option>
            ))}
          </select>
        </div>

        {/* Мінімальна ціна */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Мін. ціна (UAH)
          </label>
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => onFilterChange('minPrice', e.target.value)}
            placeholder="0"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900"
          />
        </div>

        {/* Максимальна ціна */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Макс. ціна (UAH)
          </label>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            placeholder="Без обмежень"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900"
          />
        </div>

        {/* Наявність на складі */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Наявність
          </label>
          <select
            value={filters.inStock}
            onChange={(e) => onFilterChange('inStock', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900 relative z-20 cursor-pointer"
          >
            <option value="">Всі</option>
            <option value="true">Є в наявності</option>
            <option value="false">Немає в наявності</option>
          </select>
        </div>

        {/* Сортування */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Сортувати за
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900 relative z-20 cursor-pointer"
          >
            <option value="createdAt">Датою створення</option>
            <option value="price">Ціною</option>
            <option value="name">Назвою</option>
          </select>
        </div>

        {/* Порядок сортування */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Порядок
          </label>
          <select
            value={filters.sortOrder}
            onChange={(e) => onFilterChange('sortOrder', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] bg-white text-gray-900 relative z-20 cursor-pointer"
          >
            <option value="desc">Спочатку нові</option>
            <option value="asc">Спочатку старі</option>
          </select>
        </div>
      </div>

      {/* Кнопка скидання фільтрів */}
      {(filters.search || filters.category || filters.subcategory || filters.minPrice || filters.maxPrice || filters.inStock) && (
        <div className="mt-4">
          <button
            onClick={() => {
              onFilterChange('search', '');
              onFilterChange('category', '');
              onFilterChange('subcategory', '');
              onFilterChange('minPrice', '');
              onFilterChange('maxPrice', '');
              onFilterChange('inStock', '');
            }}
            className="text-[#ff6b35] hover:text-[#ff8555] font-medium text-sm"
          >
            Скинути фільтри
          </button>
        </div>
      )}
    </div>
  );
}
