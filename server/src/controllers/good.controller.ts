import type { Request, Response } from 'express';
import { goodService } from '../services/good.service.js';

export class GoodController {
  /**
   * POST /goods
   * Створення нового товару
   */
  async createGood(req: Request, res: Response): Promise<void> {
    try {
      const goodData = {
        ...req.body,
        supplier: req.body.supplier || req.user?.id, // Якщо є middleware для авторизації
      };

      const good = await goodService.createGood(goodData);

      res.status(201).json({
        message: 'Товар успішно створено',
        good,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Помилка при створенні товару';
      res.status(400).json({ error: errorMessage });
    }
  }

  /**
   * GET /goods/:id
   * Отримання товару за ID
   */
  async getGoodById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const good = await goodService.getGoodById(id);

      if (!good) {
        res.status(404).json({ error: 'Товар не знайдено' });
        return;
      }

      res.status(200).json({ good });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Помилка при отриманні товару';
      res.status(500).json({ error: errorMessage });
    }
  }

  /**
   * GET /goods
   * Отримання товарів з фільтрацією
   */
  async getGoods(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        category: req.query.category as string | undefined,
        subcategory: req.query.subcategory as string | undefined,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        inStock: req.query.inStock === 'true' ? true : req.query.inStock === 'false' ? false : undefined,
        supplier: req.query.supplier as string | undefined,
        search: req.query.search as string | undefined,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 20,
        sortBy: (req.query.sortBy as 'price' | 'createdAt' | 'name') || 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
      };

      const result = await goodService.getGoods(filters);

      res.status(200).json(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Помилка при отриманні товарів';
      res.status(500).json({ error: errorMessage });
    }
  }

  /**
   * PUT /goods/:id
   * Оновлення товару
   */
  async updateGood(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const good = await goodService.updateGood(id, req.body);

      if (!good) {
        res.status(404).json({ error: 'Товар не знайдено' });
        return;
      }

      res.status(200).json({
        message: 'Товар успішно оновлено',
        good,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Помилка при оновленні товару';
      res.status(400).json({ error: errorMessage });
    }
  }

  /**
   * DELETE /goods/:id
   * Видалення товару
   */
  async deleteGood(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await goodService.deleteGood(id);

      if (!deleted) {
        res.status(404).json({ error: 'Товар не знайдено' });
        return;
      }

      res.status(200).json({ message: 'Товар успішно видалено' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Помилка при видаленні товару';
      res.status(500).json({ error: errorMessage });
    }
  }

  /**
   * GET /goods/categories/list
   * Отримання списку категорій
   */
  async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await goodService.getCategories();
      res.status(200).json({ categories });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Помилка при отриманні категорій';
      res.status(500).json({ error: errorMessage });
    }
  }

  /**
   * GET /goods/categories/:category/subcategories
   * Отримання підкатегорій для категорії
   */
  async getSubcategories(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      const subcategories = await goodService.getSubcategories(category);
      res.status(200).json({ subcategories });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Помилка при отриманні підкатегорій';
      res.status(500).json({ error: errorMessage });
    }
  }
}

export const goodController = new GoodController();
