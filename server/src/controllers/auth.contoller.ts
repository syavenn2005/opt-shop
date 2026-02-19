import type { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import config from '../config/config.js';

export class AuthController {
  /**
   * POST /auth/register
   * Реєстрація нового користувача
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, businessProfile } = req.body;

      // Валідація вхідних даних
      if (!email || !password) {
        res.status(400).json({ error: 'Email та пароль обов\'язкові' });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ error: 'Пароль повинен містити мінімум 6 символів' });
        return;
      }

      // Створення користувача
      const user = await authService.register(email, password, businessProfile);

      // Генерація токенів
      const tokens = authService.generateTokens(user._id.toString(), user.email);

      // Збереження refresh токена в базі даних
      user.refreshToken = tokens.refreshToken;
      await user.save();

      // Встановлення cookies
      this.setRefreshTokenCookie(res, tokens.refreshToken);

      res.status(201).json({
        message: 'Користувач успішно зареєстрований',
        user: {
          id: user._id.toString(),
          email: user.email,
        },
        accessToken: tokens.accessToken,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Помилка при реєстрації';
      res.status(400).json({ error: errorMessage });
    }
  }

  /**
   * POST /auth/login
   * Авторизація користувача
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Валідація вхідних даних
      if (!email || !password) {
        res.status(400).json({ error: 'Email та пароль обов\'язкові' });
        return;
      }

      // Авторизація
      const { user, tokens } = await authService.login(email, password);

      // Встановлення refresh токена в cookie
      this.setRefreshTokenCookie(res, tokens.refreshToken);

      res.status(200).json({
        message: 'Успішна авторизація',
        user: {
          id: user._id.toString(),
          email: user.email,
        },
        accessToken: tokens.accessToken,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Помилка при авторизації';
      res.status(401).json({ error: errorMessage });
    }
  }

  /**
   * POST /auth/refresh
   * Оновлення токенів
   */
  async refresh(req: Request, res: Response): Promise<void> {
    try {
      // Отримання refresh токена з cookie
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        res.status(401).json({ error: 'Refresh токен відсутній' });
        return;
      }

      // Оновлення токенів
      const tokens = await authService.refresh(refreshToken);

      // Встановлення нового refresh токена в cookie
      this.setRefreshTokenCookie(res, tokens.refreshToken);

      res.status(200).json({
        message: 'Токени успішно оновлені',
        accessToken: tokens.accessToken,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Помилка при оновленні токенів';
      res.status(401).json({ error: errorMessage });
    }
  }

  /**
   * POST /auth/logout
   * Вихід користувача
   */
  async logout(req: Request, res: Response): Promise<void> {
    try {
      // Отримання refresh токена з cookie
      const refreshToken = req.cookies?.refreshToken;

      if (refreshToken) {
        try {
          // Верифікація refresh токена для отримання userId
          const jwt = await import('jsonwebtoken');
          const decoded = jwt.default.verify(refreshToken, config.jwtRefreshSecret) as { userId: string; email: string };
          await authService.logout(decoded.userId);
        } catch (error) {
          // Якщо токен невалідний, просто очищаємо cookie
        }
      }

      // Очищення refresh токена з cookie
      this.clearRefreshTokenCookie(res);

      res.status(200).json({ message: 'Успішний вихід' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Помилка при виході';
      res.status(500).json({ error: errorMessage });
    }
  }

  /**
   * Встановлення refresh токена в HTTP-only cookie
   */
  private setRefreshTokenCookie(res: Response, refreshToken: string): void {
    const isProduction = config.nodeEnv === 'production';

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction, // Тільки HTTPS в production
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 днів
      path: '/',
    });
  }

  /**
   * Очищення refresh токена з cookie
   */
  private clearRefreshTokenCookie(res: Response): void {
    res.cookie('refreshToken', '', {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: config.nodeEnv === 'production' ? 'strict' : 'lax',
      maxAge: 0,
      path: '/',
    });
  }
}

export const authController = new AuthController();
