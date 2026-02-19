import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import config from './config/config.js';
import authRoutes from './routes/auth.routes.js';
import goodRoutes from './routes/good.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import userRoutes from './routes/user.routes.js';
import orderRoutes from './routes/order.routes.js';

// Перевірка імпорту роутів
console.log('orderRoutes imported:', typeof orderRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// CORS middleware
const allowedOrigins = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.split(',')
  : ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
  origin: (origin, callback) => {
    // Дозволяємо запити без origin (наприклад, з Postman або мобільних додатків)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Дозволяємо cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Content-Length'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200, // Для старих браузерів
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Статичні файли для зображень (з папки utils/images)
const imagesPath = join(process.cwd(), 'src', 'utils', 'images');
app.use('/images', express.static(imagesPath));

// Підключення до MongoDB
mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log('Підключено до MongoDB');
  })
  .catch((error) => {
    console.error('Помилка підключення до MongoDB:', error);
    process.exit(1);
  });

// Routes
app.use('/auth', authRoutes);
app.use('/goods', goodRoutes);
app.use('/upload', uploadRoutes);
app.use('/users', userRoutes);

// Перевірка перед реєстрацією роутів замовлень
if (!orderRoutes) {
  console.error('ПОМИЛКА: orderRoutes не імпортовано!');
} else {
  console.log('Реєстрація роутів замовлень...');
  app.use('/orders', orderRoutes);
  console.log('Роути замовлень зареєстровані успішно');
}

// Логування для діагностики
console.log('Всі роути зареєстровані:');
console.log('  POST /orders - створення замовлення');
console.log('  GET /orders/buyer/:buyerId - замовлення покупця');
console.log('  GET /orders/supplier/:supplierId - замовлення постачальника');
console.log('  GET /orders/:id - отримання замовлення');
console.log('  PATCH /orders/:id/status - оновлення статусу');

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Запуск сервера
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});

export default app;
