import type { Request, Response } from 'express';
import { orderService } from '../services/order.service.js';

// Extend Request type to include user property
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      email: string;
    };
  }
}

export class OrderController {
  /**
   * POST /orders
   * Створення нового замовлення
   */
  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.body.userId || req.user?.id; // Можна передати userId в body або з middleware
      if (!userId) {
        res.status(401).json({ error: 'Користувач не авторизований' });
        return;
      }

      const { goodId, quantity, deliveryAddress, contactPerson, notes } = req.body;

      if (!goodId || quantity === undefined || quantity === null) {
        res.status(400).json({ error: 'ID товару та кількість обов\'язкові' });
        return;
      }

      if (typeof quantity !== 'number' || quantity <= 0) {
        res.status(400).json({ error: 'Кількість повинна бути додатним числом' });
        return;
      }

      const order = await orderService.createOrder(userId, {
        goodId,
        quantity: Number(quantity),
        deliveryAddress,
        contactPerson,
        notes,
      });

      res.status(201).json({
        message: 'Замовлення успішно створено',
        order,
      });
    } catch (error) {
      console.error('Помилка при створенні замовлення:', error);
      const errorMessage = error instanceof Error ? error.message : 'Помилка при створенні замовлення';
      res.status(400).json({ error: errorMessage });
    }
  }

  /**
   * GET /orders/:id
   * Отримання замовлення за ID
   */
  async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.query.userId as string || req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Користувач не авторизований' });
        return;
      }

      const order = await orderService.getOrderById(id, userId);
      if (!order) {
        res.status(404).json({ error: 'Замовлення не знайдено' });
        return;
      }

      res.status(200).json({ order });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Помилка при отриманні замовлення';
      if (errorMessage.includes('Немає доступу')) {
        res.status(403).json({ error: errorMessage });
      } else {
        res.status(500).json({ error: errorMessage });
      }
    }
  }

  /**
   * GET /orders/buyer/:buyerId
   * Отримання замовлень покупця
   */
  async getBuyerOrders(req: Request, res: Response): Promise<void> {
    try {
      const { buyerId } = req.params;
      const status = req.query.status as string | undefined;

      const orders = await orderService.getBuyerOrders(buyerId, { status });
      res.status(200).json({ orders });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Помилка при отриманні замовлень';
      res.status(500).json({ error: errorMessage });
    }
  }

  /**
   * GET /orders/supplier/:supplierId
   * Отримання замовлень постачальника
   */
  async getSupplierOrders(req: Request, res: Response): Promise<void> {
    try {
      const { supplierId } = req.params;
      const status = req.query.status as string | undefined;

      const orders = await orderService.getSupplierOrders(supplierId, { status });
      res.status(200).json({ orders });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Помилка при отриманні замовлень';
      res.status(500).json({ error: errorMessage });
    }
  }

  /**
   * PATCH /orders/:id/status
   * Оновлення статусу замовлення
   */
  async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, supplierNotes } = req.body;
      const supplierId = req.body.supplierId || req.user?.id;

      if (!supplierId) {
        res.status(401).json({ error: 'Постачальник не авторизований' });
        return;
      }

      if (!status) {
        res.status(400).json({ error: 'Статус обов\'язковий' });
        return;
      }

      const order = await orderService.updateOrderStatus(id, supplierId, status, supplierNotes);
      if (!order) {
        res.status(404).json({ error: 'Замовлення не знайдено' });
        return;
      }

      res.status(200).json({
        message: 'Статус замовлення оновлено',
        order,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Помилка при оновленні статусу';
      if (errorMessage.includes('Немає доступу')) {
        res.status(403).json({ error: errorMessage });
      } else {
        res.status(500).json({ error: errorMessage });
      }
    }
  }
}

export const orderController = new OrderController();
