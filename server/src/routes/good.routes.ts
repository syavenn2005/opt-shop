import { Router } from 'express';
import { goodController } from '../controllers/good.controller.js';

const router = Router();

// Отримання товарів з фільтрацією
router.get('/', (req, res) => goodController.getGoods(req, res));

// Отримання товару за ID
router.get('/:id', (req, res) => goodController.getGoodById(req, res));

// Створення нового товару
router.post('/', (req, res) => goodController.createGood(req, res));

// Оновлення товару
router.put('/:id', (req, res) => goodController.updateGood(req, res));

// Видалення товару
router.delete('/:id', (req, res) => goodController.deleteGood(req, res));

// Отримання категорій
router.get('/categories/list', (req, res) => goodController.getCategories(req, res));

// Отримання підкатегорій
router.get('/categories/:category/subcategories', (req, res) => goodController.getSubcategories(req, res));

export default router;
