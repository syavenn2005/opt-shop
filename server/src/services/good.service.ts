import type { IGood } from '../models/good.model.js';
import { Good } from '../models/good.model.js';

export interface CreateGoodDto {
  name: string;
  nameEn?: string;
  description?: string;
  category: string;
  subcategory?: string;
  price: number;
  currency?: string;
  unit?: string;
  minimumOrderQuantity?: number;
  inStock?: boolean;
  stockQuantity?: number;
  photos?: string[];
  specifications?: Record<string, string | number>;
  licenses?: {
    type: string;
    description?: string;
    validUntil?: Date;
    certificateNumber?: string;
    issuer?: string;
  }[];
  supplier: string;
}

export interface UpdateGoodDto extends Partial<CreateGoodDto> {
  isActive?: boolean;
}

export interface FilterGoodsDto {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  supplier?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'createdAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export class GoodService {
  /**
   * Створення нового товару
   */
  async createGood(data: CreateGoodDto): Promise<IGood> {
    const good = new Good({
      ...data,
      currency: data.currency || 'UAH',
      unit: data.unit || 'шт',
      minimumOrderQuantity: data.minimumOrderQuantity || 1,
      inStock: data.inStock !== undefined ? data.inStock : true,
    });

    await good.save();
    return good.populate('supplier', 'companyName email phone');
  }

  /**
   * Отримання товару за ID
   */
  async getGoodById(id: string): Promise<IGood | null> {
    return Good.findById(id)
      .populate('supplier', 'companyName email phone logo')
      .exec();
  }

  /**
   * Отримання всіх товарів з фільтрацією
   */
  async getGoods(filters: FilterGoodsDto = {}): Promise<{
    goods: IGood[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      category,
      subcategory,
      minPrice,
      maxPrice,
      inStock,
      supplier,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    // Побудова запиту
    const query: any = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (subcategory) {
      query.subcategory = subcategory;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) {
        query.price.$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        query.price.$lte = maxPrice;
      }
    }

    if (inStock !== undefined) {
      query.inStock = inStock;
    }

    if (supplier) {
      query.supplier = supplier;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Сортування
    const sortOptions: any = {};
    if (sortBy === 'price') {
      sortOptions.price = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'name') {
      sortOptions.name = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortOptions.createdAt = sortOrder === 'asc' ? 1 : -1;
    }

    // Підрахунок загальної кількості
    const total = await Good.countDocuments(query);

    // Отримання товарів з пагінацією
    const skip = (page - 1) * limit;
    const goods = await Good.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate('supplier', 'companyName email phone logo')
      .exec();

    return {
      goods,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Оновлення товару
   */
  async updateGood(id: string, data: UpdateGoodDto): Promise<IGood | null> {
    const good = await Good.findByIdAndUpdate(
      id,
      { ...data },
      { new: true, runValidators: true }
    )
      .populate('supplier', 'companyName email phone logo')
      .exec();

    return good;
  }

  /**
   * Видалення товару (м'яке видалення)
   */
  async deleteGood(id: string): Promise<boolean> {
    const result = await Good.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).exec();

    return !!result;
  }

  /**
   * Отримання категорій товарів
   */
  async getCategories(): Promise<string[]> {
    const categories = await Good.distinct('category', { isActive: true }).exec();
    return categories;
  }

  /**
   * Отримання підкатегорій для категорії
   */
  async getSubcategories(category: string): Promise<string[]> {
    const subcategories = await Good.distinct('subcategory', {
      category,
      isActive: true,
      subcategory: { $exists: true, $ne: null },
    }).exec();
    return subcategories;
  }
}

export const goodService = new GoodService();
