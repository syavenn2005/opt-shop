import type { Request, Response } from 'express';
import { uploadSingle, uploadMultiple } from '../middleware/upload.middleware.js';

export class UploadController {
  /**
   * POST /upload/single
   * Завантаження одного зображення
   */
  async uploadSingle(req: Request, res: Response): Promise<void> {
    uploadSingle(req, res, (err) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      if (!req.file) {
        res.status(400).json({ error: 'Файл не завантажено' });
        return;
      }

      // Повертаємо шлях до файлу відносно папки images
      const fileName = req.file.filename;
      res.status(200).json({
        message: 'Файл успішно завантажено',
        filename: fileName,
        path: `/images/${fileName}`,
      });
    });
  }

  /**
   * POST /upload/multiple
   * Завантаження кількох зображень
   */
  async uploadMultiple(req: Request, res: Response): Promise<void> {
    uploadMultiple(req, res, (err) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
        res.status(400).json({ error: 'Файли не завантажено' });
        return;
      }

      const files = Array.isArray(req.files) ? req.files : [req.files];
      const uploadedFiles = files.map((file) => ({
        filename: file.filename,
        path: `/images/${file.filename}`,
      }));

      res.status(200).json({
        message: 'Файли успішно завантажено',
        files: uploadedFiles,
      });
    });
  }
}

export const uploadController = new UploadController();
