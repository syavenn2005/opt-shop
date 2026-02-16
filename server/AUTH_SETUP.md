# Інструкція з налаштування авторизації

## Встановлення залежностей

Спочатку встановіть необхідні пакети:

```bash
npm install express mongoose bcryptjs jsonwebtoken cookie-parser
npm install --save-dev @types/bcryptjs @types/jsonwebtoken @types/cookie-parser
```

## Налаштування змінних оточення

Створіть файл `.env` в корені папки `server` з наступним вмістом:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/opt-shop
JWT_ACCESS_SECRET=your-super-secret-access-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
COOKIE_SECRET=your-cookie-secret-key-change-in-production
```

**Важливо:** Змініть секретні ключі на випадкові безпечні значення для production!

## Інтеграція в server.ts

Додайте наступний код до вашого `server.ts`:

```typescript
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

// Запуск сервера
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});
```

## API Endpoints

### POST /auth/register
Реєстрація нового користувача

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Користувач успішно зареєстрований",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  },
  "accessToken": "jwt_access_token"
}
```

### POST /auth/login
Авторизація користувача

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Успішна авторизація",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  },
  "accessToken": "jwt_access_token"
}
```

**Примітка:** Refresh токен автоматично встановлюється в HTTP-only cookie.

### POST /auth/refresh
Оновлення access токена

**Request:** Автоматично використовує refresh токен з cookie

**Response:**
```json
{
  "message": "Токени успішно оновлені",
  "accessToken": "new_jwt_access_token"
}
```

### POST /auth/logout
Вихід користувача

**Request:** Автоматично використовує refresh токен з cookie

**Response:**
```json
{
  "message": "Успішний вихід"
}
```

## Особливості реалізації

1. **HTTP-only Cookies:** Refresh токени зберігаються в HTTP-only cookies для безпеки
2. **JWT Tokens:** Використовуються два типи токенів:
   - Access токен (короткоживучий, 15 хвилин) - передається в JSON відповіді
   - Refresh токен (довгоживучий, 7 днів) - зберігається в HTTP-only cookie
3. **Password Hashing:** Паролі хешуються за допомогою bcryptjs
4. **Session Management:** Refresh токени зберігаються в базі даних для можливості відкликання

## Безпека

- Паролі хешуються перед збереженням
- Refresh токени зберігаються в HTTP-only cookies (недоступні через JavaScript)
- В production використовується `secure: true` для cookies (тільки HTTPS)
- SameSite політика встановлена для захисту від CSRF атак
