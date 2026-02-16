import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import type { IUser } from '../models/user.model.js';
import { User } from '../models/user.model.js';
import config from '../config/config.js';

export interface TokenPayload {
  userId: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  /**
   * Реєстрація нового користувача
   */
  async register(email: string, password: string): Promise<IUser> {
    // Перевірка чи користувач вже існує
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Користувач з таким email вже існує');
    }

    // Хешування пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Створення нового користувача
    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();
    return user;
  }

  /**
   * Авторизація користувача
   */
  async login(email: string, password: string): Promise<{ user: IUser; tokens: AuthTokens }> {
    // Знаходження користувача
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Невірний email або пароль');
    }

    // Перевірка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Невірний email або пароль');
    }

    // Генерація токенів
    const tokens = this.generateTokens(user._id.toString(), user.email);

    // Збереження refresh токена в базі даних
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return { user, tokens };
  }

  /**
   * Оновлення токенів
   */
  async refresh(refreshToken: string): Promise<AuthTokens> {
    try {
      // Верифікація refresh токена
      const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as TokenPayload;

      // Знаходження користувача
      const user = await User.findById(decoded.userId);
      if (!user || user.refreshToken !== refreshToken) {
        throw new Error('Невірний refresh токен');
      }

      // Генерація нових токенів
      const tokens = this.generateTokens(user._id.toString(), user.email);

      // Оновлення refresh токена в базі даних
      user.refreshToken = tokens.refreshToken;
      await user.save();

      return tokens;
    } catch (error) {
      throw new Error('Невірний або прострочений refresh токен');
    }
  }

  /**
   * Вихід користувача
   */
  async logout(userId: string): Promise<void> {
    const user = await User.findById(userId);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
  }

  /**
   * Генерація access та refresh токенів
   */
  generateTokens(userId: string, email: string): AuthTokens {
    const payload: TokenPayload = { userId, email };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const accessTokenOptions: any = {
      expiresIn: config.jwtAccessExpiresIn,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const refreshTokenOptions: any = {
      expiresIn: config.jwtRefreshExpiresIn,
    };

    const accessToken = jwt.sign(payload, config.jwtAccessSecret, accessTokenOptions);
    const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, refreshTokenOptions);

    return { accessToken, refreshToken };
  }

  /**
   * Верифікація access токена
   */
  verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, config.jwtAccessSecret) as TokenPayload;
    } catch (error) {
      throw new Error('Невірний або прострочений access токен');
    }
  }
}

export const authService = new AuthService();
