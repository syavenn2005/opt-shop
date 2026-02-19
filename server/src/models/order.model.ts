import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId; // Хто робить замовлення
  supplier: mongoose.Types.ObjectId; // Постачальник
  good: mongoose.Types.ObjectId; // Товар
  quantity: number; // Кількість товару
  unitPrice: number; // Ціна за одиницю на момент замовлення
  totalPrice: number; // Загальна сума
  currency: string; // Валюта
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  deliveryAddress?: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  contactPerson?: {
    fullName: string;
    phone: string;
    email?: string;
  };
  notes?: string; // Додаткові примітки від покупця
  supplierNotes?: string; // Примітки від постачальника
  createdAt: Date;
  updatedAt: Date;
}

const deliveryAddressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  region: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true, default: 'Україна' },
}, { _id: false });

const contactPersonSchema = new Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
}, { _id: false });

const orderSchema = new Schema<IOrder>(
  {
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    good: {
      type: Schema.Types.ObjectId,
      ref: 'Good',
      required: true,
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      enum: ['UAH', 'USD', 'EUR'],
      default: 'UAH',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },
    deliveryAddress: {
      type: deliveryAddressSchema,
    },
    contactPerson: {
      type: contactPersonSchema,
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
    supplierNotes: {
      type: String,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

// Індекси
orderSchema.index({ buyer: 1, status: 1 });
orderSchema.index({ supplier: 1, status: 1 });
orderSchema.index({ good: 1 });
orderSchema.index({ createdAt: -1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);
