import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';

const router = Router();

// Отримання списку постачальників
router.get('/suppliers', (req, res) => userController.getSuppliers(req, res));

// Отримання інформації про конкретного постачальника
router.get('/suppliers/:id', (req, res) => userController.getSupplierById(req, res));

export default router;
