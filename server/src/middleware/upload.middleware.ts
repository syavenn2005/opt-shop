import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Шлях до папки з зображеннями
const imagesDir = join(__dirname, '../utils/images');

// Налаштування зберігання файлів
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      // Переконаємося, що папка існує
      await mkdir(imagesDir, { recursive: true });
      cb(null, imagesDir);
    } catch (error) {
      cb(error instanceof Error ? error : new Error('Помилка створення папки'), '');
    }
  },
  filename: (req, file, cb) => {
    // Генеруємо унікальне ім'я файлу
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const extension = file.originalname.split('.').pop();
    cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
  },
});

// Фільтр для перевірки типу файлу
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Дозволяємо тільки зображення
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Тільки зображення дозволені!'));
  }
};

// Налаштування multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB максимум
  },
});

// Middleware для завантаження одного файлу
export const uploadSingle = upload.single('photo');

// Middleware для завантаження кількох файлів
export const uploadMultiple = upload.array('photos', 10); // Максимум 10 файлів
