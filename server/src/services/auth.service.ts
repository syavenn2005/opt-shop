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
  async register(email: string, password: string, businessProfile?: any): Promise<IUser> {
    // Перевірка чи користувач вже існує
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Користувач з таким email вже існує');
    }

    // Хешування пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Підготовка даних користувача
    const userData: any = {
      email,
      password: hashedPassword,
    };

    // Розгортання businessProfile на верхній рівень, якщо він наданий
    if (businessProfile) {
      // Основна інформація про компанію
      if (businessProfile.companyName) {
        userData.companyName = businessProfile.companyName;
      }
      if (businessProfile.companyNameEn) {
        userData.companyNameEn = businessProfile.companyNameEn;
      }
      if (businessProfile.description) {
        userData.description = businessProfile.description;
      }
      if (businessProfile.website) {
        userData.website = businessProfile.website;
      }
      if (businessProfile.logo) {
        userData.logo = businessProfile.logo;
      }
      if (businessProfile.photos) {
        userData.photos = businessProfile.photos;
      }

      // Контактна інформація
      if (businessProfile.phone) {
        userData.phone = businessProfile.phone;
      }
      if (businessProfile.additionalPhones) {
        userData.additionalPhones = businessProfile.additionalPhones;
      }
      if (businessProfile.contactPerson) {
        userData.contactPerson = businessProfile.contactPerson;
      }

      // Адреси
      if (businessProfile.legalAddress) {
        userData.legalAddress = businessProfile.legalAddress;
      }
      if (businessProfile.actualAddress) {
        userData.actualAddress = businessProfile.actualAddress;
      }

      // Реєстраційні дані
      if (businessProfile.edrpou) {
        userData.edrpou = businessProfile.edrpou;
      }
      if (businessProfile.taxId) {
        userData.taxId = businessProfile.taxId;
      }
      if (businessProfile.registrationDate) {
        userData.registrationDate = businessProfile.registrationDate;
      }
      if (businessProfile.legalForm) {
        userData.legalForm = businessProfile.legalForm;
      }

      // Бізнес-умови
      if (businessProfile.businessTerms) {
        userData.businessTerms = businessProfile.businessTerms;
      }

      // Категорії та спеціалізація
      if (businessProfile.productCategories) {
        userData.productCategories = businessProfile.productCategories;
      }
      if (businessProfile.specialization) {
        userData.specialization = businessProfile.specialization;
      }

      // Статус та верифікація
      if (businessProfile.isVerified !== undefined) {
        userData.isVerified = businessProfile.isVerified;
      }
      if (businessProfile.isActive !== undefined) {
        userData.isActive = businessProfile.isActive;
      }
      if (businessProfile.rating !== undefined) {
        userData.rating = businessProfile.rating;
      }
      if (businessProfile.reviewsCount !== undefined) {
        userData.reviewsCount = businessProfile.reviewsCount;
      }
    }

    // Створення нового користувача
    const user = new User(userData);

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
