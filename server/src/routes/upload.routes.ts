import { Router } from 'express';
import { uploadController } from '../controllers/upload.controller.js';

const router = Router();

// Завантаження одного зображення
router.post('/single', (req, res) => uploadController.uploadSingle(req, res));

// Завантаження кількох зображень
router.post('/multiple', (req, res) => uploadController.uploadMultiple(req, res));

export default router;
