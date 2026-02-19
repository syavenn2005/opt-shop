import { Router } from 'express';
import { orderController } from '../controllers/order.controller.js';

const router = Router();

// Логування для діагностики
console.log('Ініціалізація роутів замовлень...');
console.log('orderController:', typeof orderController);

// Створення нового замовлення
router.post('/', (req, res) => {
  console.log('POST /orders запит отримано');
  console.log('Request body:', req.body);
  if (!orderController || !orderController.createOrder) {
    console.error('ПОМИЛКА: orderController або createOrder не знайдено!');
    res.status(500).json({ error: 'Помилка сервера: контролер не ініціалізовано' });
    return;
  }
  orderController.createOrder(req, res);
});

// Отримання замовлень покупця (має бути перед /:id)
router.get('/buyer/:buyerId', (req, res) => orderController.getBuyerOrders(req, res));

// Отримання замовлень постачальника (має бути перед /:id)
router.get('/supplier/:supplierId', (req, res) => orderController.getSupplierOrders(req, res));

// Отримання замовлення за ID (має бути після специфічних роутів)
router.get('/:id', (req, res) => orderController.getOrderById(req, res));

// Оновлення статусу замовлення
router.patch('/:id/status', (req, res) => orderController.updateOrderStatus(req, res));

export default router;
