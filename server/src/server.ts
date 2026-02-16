import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import config from './config/config.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
