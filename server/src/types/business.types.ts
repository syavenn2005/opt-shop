/**
 * Типи для бізнес-профілю оптового постачальника
 */

export interface Address {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface ContactPerson {
  fullName: string;
  position: string;
  phone: string;
  email?: string;
}

export interface BusinessTerms {
  minimumOrderAmount: number;
  paymentTerms: string[];
  deliveryTerms: string[];
  deliveryRegions: string[];
  workingHours?: string;
}

export interface ProductCategory {
  name: string;
  subcategories?: string[];
}

export interface BusinessProfile {
  // Основна інформація
  companyName: string;
  companyNameEn?: string;
  description?: string;
  website?: string;
  logo?: string;
  photos?: string[];
  
  // Контакти
  phone: string;
  additionalPhones?: string[];
  contactPerson: ContactPerson;
  
  // Адреси
  legalAddress: Address;
  actualAddress?: Address;
  
  // Реєстрація
  edrpou?: string;
  taxId?: string;
  registrationDate?: Date;
  legalForm?: 'ТОВ' | 'ПП' | 'ФОП' | 'АТ' | 'Інше';
  
  // Бізнес-умови
  businessTerms?: BusinessTerms;
  
  // Категорії
  productCategories?: ProductCategory[];
  specialization?: string[];
  
  // Статус
  isVerified: boolean;
  isActive: boolean;
  rating?: number;
  reviewsCount?: number;
}

export interface CreateBusinessProfileDto {
  companyName: string;
  companyNameEn?: string;
  description?: string;
  website?: string;
  phone: string;
  additionalPhones?: string[];
  contactPerson: ContactPerson;
  legalAddress: Address;
  actualAddress?: Address;
  edrpou?: string;
  taxId?: string;
  registrationDate?: string;
  legalForm?: 'ТОВ' | 'ПП' | 'ФОП' | 'АТ' | 'Інше';
  businessTerms?: BusinessTerms;
  productCategories?: ProductCategory[];
  specialization?: string[];
}

export interface UpdateBusinessProfileDto extends Partial<CreateBusinessProfileDto> {
  logo?: string;
  photos?: string[];
}
