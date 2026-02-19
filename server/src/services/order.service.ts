import type { IOrder } from '../models/order.model.js';
import { Order } from '../models/order.model.js';
import { Good } from '../models/good.model.js';
import { User } from '../models/user.model.js';

export interface CreateOrderDto {
  goodId: string;
  quantity: number;
  deliveryAddress?: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  contactPerson?: {
    fullName: string;
    phone: string;
    email?: string;
  };
  notes?: string;
}

export class OrderService {
  /**
   * Створення нового замовлення
   */
  async createOrder(buyerId: string, orderData: CreateOrderDto): Promise<IOrder> {
    try {
      // Отримуємо товар
      const good = await Good.findById(orderData.goodId);
      if (!good) {
        throw new Error('Товар не знайдено');
      }

      // Отримуємо постачальника окремо
      const supplier = await User.findById(good.supplier);
      if (!supplier) {
        throw new Error('Постачальник не знайдено');
      }

      if (!good.inStock) {
        throw new Error('Товар не в наявності');
      }

      if (orderData.quantity < good.minimumOrderQuantity) {
        throw new Error(`Мінімальна кількість замовлення: ${good.minimumOrderQuantity} ${good.unit}`);
      }

      if (good.stockQuantity !== undefined && orderData.quantity > good.stockQuantity) {
        throw new Error(`Доступна кількість: ${good.stockQuantity} ${good.unit}`);
      }

      // Перевіряємо, чи товар не належить покупцю
      const supplierId = supplier._id.toString();

      if (supplierId === buyerId) {
        throw new Error('Ви не можете замовити власний товар');
      }

      // Розраховуємо загальну суму
      const totalPrice = good.price * orderData.quantity;

      // Створюємо замовлення
      const order = new Order({
        buyer: buyerId,
        supplier: supplierId,
        good: good._id,
        quantity: orderData.quantity,
        unitPrice: good.price,
        totalPrice,
        currency: good.currency,
        status: 'pending',
        deliveryAddress: orderData.deliveryAddress,
        contactPerson: orderData.contactPerson,
        notes: orderData.notes,
      });

      await order.save();

      // Популюємо дані для повернення
      await order.populate('buyer', 'companyName email phone');
      await order.populate('supplier', 'companyName email phone');
      await order.populate('good');

      return order;
    } catch (error) {
      console.error('Помилка в orderService.createOrder:', error);
      throw error;
    }
  }

  /**
   * Отримання замовлення за ID
   */
  async getOrderById(orderId: string, userId: string): Promise<IOrder | null> {
    const order = await Order.findById(orderId)
      .populate('buyer', 'companyName email phone')
      .populate('supplier', 'companyName email phone')
      .populate('good')
      .exec();

    if (!order) {
      return null;
    }

    // Перевіряємо, чи користувач має доступ до цього замовлення
    const buyerId = typeof order.buyer === 'object' && order.buyer !== null
      ? (order.buyer as any)._id.toString()
      : order.buyer.toString();
    const supplierId = typeof order.supplier === 'object' && order.supplier !== null
      ? (order.supplier as any)._id.toString()
      : order.supplier.toString();

    if (buyerId !== userId && supplierId !== userId) {
      throw new Error('Немає доступу до цього замовлення');
    }

    return order;
  }

  /**
   * Отримання замовлень покупця
   */
  async getBuyerOrders(buyerId: string, filters?: { status?: string }): Promise<IOrder[]> {
    const query: any = { buyer: buyerId };
    if (filters?.status) {
      query.status = filters.status;
    }

    return Order.find(query)
      .populate('supplier', 'companyName email phone logo')
      .populate('good', 'name photos price currency unit')
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Отримання замовлень постачальника
   */
  async getSupplierOrders(supplierId: string, filters?: { status?: string }): Promise<IOrder[]> {
    const query: any = { supplier: supplierId };
    if (filters?.status) {
      query.status = filters.status;
    }

    return Order.find(query)
      .populate('buyer', 'companyName email phone')
      .populate('good', 'name photos price currency unit')
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Оновлення статусу замовлення
   */
  async updateOrderStatus(
    orderId: string,
    supplierId: string,
    status: IOrder['status'],
    supplierNotes?: string
  ): Promise<IOrder | null> {
    const order = await Order.findById(orderId);
    if (!order) {
      return null;
    }

    // Перевіряємо, чи замовлення належить постачальнику
    const orderSupplierId = typeof order.supplier === 'object' && order.supplier !== null
      ? (order.supplier as any)._id.toString()
      : order.supplier.toString();

    if (orderSupplierId !== supplierId) {
      throw new Error('Немає доступу до цього замовлення');
    }

    order.status = status;
    if (supplierNotes) {
      order.supplierNotes = supplierNotes;
    }

    await order.save();
    await order.populate('buyer', 'companyName email phone');
    await order.populate('supplier', 'companyName email phone');
    await order.populate('good');

    return order;
  }
}

export const orderService = new OrderService();
