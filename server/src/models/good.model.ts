import mongoose, { Schema, Document } from 'mongoose';

export interface IGood extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  nameEn?: string;
  description?: string;
  category: string;
  subcategory?: string;
  price: number;
  currency: string;
  unit: string; // 'шт', 'кг', 'м', 'м²', 'м³', 'л' тощо
  minimumOrderQuantity: number;
  inStock: boolean;
  stockQuantity?: number;
  photos: string[];
  specifications?: Record<string, string | number>;
  licenses?: {
    type: string; // 'стандартна', 'преміум', 'enterprise' тощо
    description?: string;
    validUntil?: Date;
    certificateNumber?: string;
    issuer?: string;
  }[];
  supplier: mongoose.Types.ObjectId; // Посилання на User
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const goodSchema = new Schema<IGood>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    nameEn: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 5000,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    subcategory: {
      type: String,
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: 'UAH',
      enum: ['UAH', 'USD', 'EUR'],
    },
    unit: {
      type: String,
      required: true,
      default: 'шт',
    },
    minimumOrderQuantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    inStock: {
      type: Boolean,
      default: true,
      index: true,
    },
    stockQuantity: {
      type: Number,
      min: 0,
    },
    photos: [{
      type: String,
    }],
    specifications: {
      type: Map,
      of: Schema.Types.Mixed,
    },
    licenses: [{
      type: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      validUntil: {
        type: Date,
      },
      certificateNumber: {
        type: String,
      },
      issuer: {
        type: String,
      },
    }],
    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Індекси для пошуку
goodSchema.index({ name: 'text', description: 'text' });
goodSchema.index({ category: 1, subcategory: 1 });
goodSchema.index({ price: 1 });
goodSchema.index({ supplier: 1, isActive: 1 });
goodSchema.index({ createdAt: -1 });

export const Good = mongoose.model<IGood>('Good', goodSchema);
