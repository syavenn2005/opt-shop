import type { Request, Response } from 'express';
import { User } from '../models/user.model.js';

export class UserController {
  /**
   * GET /users/suppliers
   * Отримання списку всіх постачальників
   */
  async getSuppliers(req: Request, res: Response): Promise<void> {
    try {
      const { search, page = '1', limit = '20' } = req.query;
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const skip = (pageNum - 1) * limitNum;

      // Побудова запиту
      const query: any = { isActive: true };

      // Пошук по назві компанії або email
      if (search) {
        query.$or = [
          { companyName: { $regex: search as string, $options: 'i' } },
          { email: { $regex: search as string, $options: 'i' } },
        ];
      }

      // Отримання загальної кількості
      const total = await User.countDocuments(query);

      // Отримання постачальників з пагінацією
      const suppliers = await User.find(query)
        .select('-password -refreshToken') // Виключаємо пароль та токени
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .exec();

      res.status(200).json({
        suppliers,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Помилка при отриманні постачальників';
      res.status(500).json({ error: errorMessage });
    }
  }

  /**
   * GET /users/suppliers/:id
   * Отримання інформації про конкретного постачальника
   */
  async getSupplierById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const supplier = await User.findById(id)
        .select('-password -refreshToken') // Виключаємо пароль та токени
        .exec();

      if (!supplier) {
        res.status(404).json({ error: 'Постачальник не знайдено' });
        return;
      }

      res.status(200).json({ supplier });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Помилка при отриманні постачальника';
      res.status(500).json({ error: errorMessage });
    }
  }
}

export const userController = new UserController();
