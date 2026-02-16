import mongoose, { Schema, Document } from 'mongoose';

// Інтерфейс для адреси
export interface IAddress {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

// Інтерфейс для контактної особи
export interface IContactPerson {
  fullName: string;
  position: string;
  phone: string;
  email?: string;
}

// Інтерфейс для бізнес-умов
export interface IBusinessTerms {
  minimumOrderAmount: number;
  paymentTerms: string[]; // ['готівка', 'безготівковий розрахунок', 'термін оплати 30 днів']
  deliveryTerms: string[]; // ['самовивіз', 'доставка власним транспортом', 'транспортна компанія']
  deliveryRegions: string[]; // ['Київ', 'Львів', 'Одеса']
  workingHours: string;
}

// Інтерфейс для категорій товарів
export interface IProductCategory {
  name: string;
  subcategories?: string[];
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  refreshToken?: string | null;
  
  // Основна інформація про компанію
  companyName: string;
  companyNameEn?: string;
  description?: string;
  website?: string;
  logo?: string;
  photos?: string[];
  
  // Контактна інформація
  phone: string;
  additionalPhones?: string[];
  contactPerson: IContactPerson;
  
  // Адреси
  legalAddress: IAddress;
  actualAddress?: IAddress;
  
  // Реєстраційні дані
  edrpou?: string; // ЄДРПОУ
  taxId?: string; // Податковий номер
  registrationDate?: Date;
  legalForm?: string; // 'ТОВ', 'ПП', 'ФОП' тощо
  
  // Бізнес-умови
  businessTerms?: IBusinessTerms;
  
  // Категорії та спеціалізація
  productCategories?: IProductCategory[];
  specialization?: string[];
  
  // Статус та верифікація
  isVerified: boolean;
  isActive: boolean;
  rating?: number;
  reviewsCount?: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    region: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: 'Україна' },
  },
  { _id: false }
);

const contactPersonSchema = new Schema<IContactPerson>(
  {
    fullName: { type: String, required: true },
    position: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
  },
  { _id: false }
);

const businessTermsSchema = new Schema<IBusinessTerms>(
  {
    minimumOrderAmount: { type: Number, default: 0 },
    paymentTerms: [{ type: String }],
    deliveryTerms: [{ type: String }],
    deliveryRegions: [{ type: String }],
    workingHours: { type: String },
  },
  { _id: false }
);

const productCategorySchema = new Schema<IProductCategory>(
  {
    name: { type: String, required: true },
    subcategories: [{ type: String }],
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    
    // Основна інформація про компанію
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    companyNameEn: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 2000,
    },
    website: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
    },
    photos: [{
      type: String,
    }],
    
    // Контактна інформація
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    additionalPhones: [{
      type: String,
      trim: true,
    }],
    contactPerson: {
      type: contactPersonSchema,
      required: true,
    },
    
    // Адреси
    legalAddress: {
      type: addressSchema,
      required: true,
    },
    actualAddress: {
      type: addressSchema,
    },
    
    // Реєстраційні дані
    edrpou: {
      type: String,
      trim: true,
    },
    taxId: {
      type: String,
      trim: true,
    },
    registrationDate: {
      type: Date,
    },
    legalForm: {
      type: String,
      enum: ['ТОВ', 'ПП', 'ФОП', 'АТ', 'Інше'],
      trim: true,
    },
    
    // Бізнес-умови
    businessTerms: {
      type: businessTermsSchema,
    },
    
    // Категорії та спеціалізація
    productCategories: [{
      type: productCategorySchema,
    }],
    specialization: [{
      type: String,
      trim: true,
    }],
    
    // Статус та верифікація
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Індекси для пошуку
userSchema.index({ companyName: 'text', description: 'text' });
userSchema.index({ email: 1 });
userSchema.index({ edrpou: 1 });
userSchema.index({ isVerified: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ 'productCategories.name': 1 });

export const User = mongoose.model<IUser>('User', userSchema);
