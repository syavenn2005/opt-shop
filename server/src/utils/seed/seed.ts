import mongoose from 'mongoose';
import { readdir, copyFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { Good } from '../../models/good.model.js';
import { User } from '../../models/user.model.js';
import config from '../../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Шлях до папки з зображеннями (джерело)
const imagesDir = join(__dirname, '../images');
// Шлях до папки public/images (призначення для статичних файлів)
const publicImagesDir = join(process.cwd(), 'public', 'images');

// Категорії та товари для seed
const seedData = [
  {
    name: 'Офісний стілець',
    nameEn: 'Office Chair',
    description: 'Ергономічний офісний стілець з регульованою висотою та підлокітниками. Ідеальний для тривалої роботи за комп\'ютером.',
    category: 'Меблі',
    subcategory: 'Офісні меблі',
    price: 2500,
    currency: 'UAH',
    unit: 'шт',
    minimumOrderQuantity: 5,
    inStock: true,
    stockQuantity: 50,
    specifications: {
      'Матеріал': 'Метал, Тканина',
      'Вага': '12 кг',
      'Розміри': '60x60x120 см',
    },
    imageFile: 'images (1).jpeg',
  },
  {
    name: 'Офісний стіл',
    nameEn: 'Office Desk',
    description: 'Сучасний офісний стіл з ящиками та підставкою для монітора. Велика робоча поверхня для комфортної роботи.',
    category: 'Меблі',
    subcategory: 'Офісні меблі',
    price: 4500,
    currency: 'UAH',
    unit: 'шт',
    minimumOrderQuantity: 3,
    inStock: true,
    stockQuantity: 30,
    specifications: {
      'Матеріал': 'ДСП, Металеві ніжки',
      'Розміри': '120x60x75 см',
      'Кількість ящиків': '3',
    },
    imageFile: 'images (2).jpeg',
  },
  {
    name: 'Підставка для ручок з горіха',
    nameEn: 'Pen Holder Walnut',
    description: 'Елегантна підставка для ручок з натурального горіха. Ручна робота, високоякісне виконання.',
    category: 'Канцелярія',
    subcategory: 'Органайзери',
    price: 850,
    currency: 'UAH',
    unit: 'шт',
    minimumOrderQuantity: 10,
    inStock: true,
    stockQuantity: 100,
    specifications: {
      'Матеріал': 'Горіх',
      'Розміри': '15x8x5 см',
      'Вага': '0.3 кг',
    },
    imageFile: 'balolo-pen-holder-walnut-5-1752x1314-min_9a46cfde-af68-4a81-ad9e-f218285023ae.webp',
  },
  {
    name: 'Еко-сумка',
    nameEn: 'Eco Bag',
    description: 'Екологічна бавовняна сумка для покупок. Міцна та зручна, можна використовувати багаторазово.',
    category: 'Текстиль',
    subcategory: 'Сумки',
    price: 120,
    currency: 'UAH',
    unit: 'шт',
    minimumOrderQuantity: 50,
    inStock: true,
    stockQuantity: 500,
    specifications: {
      'Матеріал': '100% Бавовна',
      'Розміри': '40x40 см',
      'Вантажопідйомність': '15 кг',
    },
    imageFile: '591257240.webp',
  },
  {
    name: 'Зелений чай преміум',
    nameEn: 'Premium Green Tea',
    description: 'Високоякісний зелений чай преміум класу. Зібрано вручну, натуральний продукт без добавок.',
    category: 'Продукти харчування',
    subcategory: 'Напої',
    price: 350,
    currency: 'UAH',
    unit: 'кг',
    minimumOrderQuantity: 10,
    inStock: true,
    stockQuantity: 200,
    specifications: {
      'Вага': '1 кг',
      'Країна походження': 'Китай',
      'Тип': 'Зелений чай',
    },
    imageFile: '6195c8e178a99295d45307cb_allgreen1000-550.jpg',
  },
  {
    name: 'Джинси класичні',
    nameEn: 'Classic Jeans',
    description: 'Класичні джинси з якісної деніму. Універсальний фасон, підходить для будь-якого стилю.',
    category: 'Одяг',
    subcategory: 'Джинси',
    price: 1200,
    currency: 'UAH',
    unit: 'шт',
    minimumOrderQuantity: 20,
    inStock: true,
    stockQuantity: 150,
    specifications: {
      'Матеріал': '100% Бавовна',
      'Розміри': '28-38',
      'Колір': 'Синій',
    },
    imageFile: '51QCxj6v_2BJL._UL1500_1500x.jpg',
  },
  {
    name: 'Смартфон преміум',
    nameEn: 'Premium Smartphone',
    description: 'Сучасний смартфон з потужним процесором та якісною камерою. Ідеальний для роботи та розваг.',
    category: 'Електроніка',
    subcategory: 'Мобільні телефони',
    price: 15000,
    currency: 'UAH',
    unit: 'шт',
    minimumOrderQuantity: 5,
    inStock: true,
    stockQuantity: 25,
    specifications: {
      'Діагональ екрану': '6.7 дюймів',
      'Оперативна пам\'ять': '8 ГБ',
      'Внутрішня пам\'ять': '256 ГБ',
      'Процесор': 'Snapdragon 8 Gen 2',
    },
    imageFile: '3b360279-8b43-40f3-9b11-604749128187.jpg',
  },
];

async function copyImageToPublic(sourceFile: string, destinationFile: string): Promise<string> {
  try {
    // Створюємо папку public/images якщо її немає
    await mkdir(publicImagesDir, { recursive: true });

    const sourcePath = join(imagesDir, sourceFile);
    const destPath = join(publicImagesDir, destinationFile);

    await copyFile(sourcePath, destPath);
    return `/images/${destinationFile}`;
  } catch (error) {
    console.error(`Помилка копіювання файлу ${sourceFile}:`, error);
    return '';
  }
}

export async function seedGoods() {
  try {
    console.log('Підключення до MongoDB...');
    console.log(`Використовується URI: ${config.mongoUri}`);
    await mongoose.connect(config.mongoUri);
    console.log('Підключено до MongoDB');

    // Очищення колекції товарів
    await Good.deleteMany({});
    console.log('Очищено колекцію товарів');

    // Отримання або створення користувача як постачальника
    let supplier = await User.findOne({});
    if (!supplier) {
      console.log('Створення тестового користувача-постачальника...');
      
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      supplier = new User({
        email: 'supplier@example.com',
        password: hashedPassword,
        companyName: 'Тестова компанія постачальник',
        companyNameEn: 'Test Supplier Company',
        description: 'Тестова компанія для seed даних',
        phone: '+380501234567',
        contactPerson: {
          fullName: 'Іван Іванович Іванов',
          position: 'Директор',
          phone: '+380501234567',
          email: 'director@example.com',
        },
        legalAddress: {
          street: 'вул. Тестова, 1',
          city: 'Київ',
          region: 'Київська',
          postalCode: '01001',
          country: 'Україна',
        },
        isVerified: true,
        isActive: true,
      });

      await supplier.save();
      console.log(`✅ Створено користувача: ${supplier.companyName} (${supplier.email})`);
    } else {
      console.log(`Використовується існуючий постачальник: ${supplier.companyName}`);
    }

    // Створення товарів
    const createdGoods = [];
    for (const item of seedData) {
      // Копіюємо зображення в public/images
      const imagePath = await copyImageToPublic(item.imageFile, item.imageFile);

      const good = new Good({
        name: item.name,
        nameEn: item.nameEn,
        description: item.description,
        category: item.category,
        subcategory: item.subcategory,
        price: item.price,
        currency: item.currency,
        unit: item.unit,
        minimumOrderQuantity: item.minimumOrderQuantity,
        inStock: item.inStock,
        stockQuantity: item.stockQuantity,
        photos: imagePath ? [imagePath] : [],
        specifications: item.specifications,
        supplier: supplier._id,
        isActive: true,
      });

      await good.save();
      createdGoods.push(good);
      console.log(`Створено товар: ${item.name}`);
    }

    console.log(`\nУспішно створено ${createdGoods.length} товарів`);
    console.log('Seed завершено!');

    await mongoose.disconnect();
    console.log('Відключено від MongoDB');
  } catch (error) {
    console.error('\n❌ Помилка при виконанні seed:');
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED') || error.message.includes('connect')) {
        console.error('\n⚠️  MongoDB не запущено або недоступний!');
        console.error(`Перевірте, чи MongoDB запущено на адресі: ${config.mongoUri}`);
        console.error('\nДля запуску MongoDB:');
        console.error('  - macOS: brew services start mongodb-community');
        console.error('  - Linux: sudo systemctl start mongod');
        console.error('  - Windows: net start MongoDB');
        console.error('\nАбо перевірте налаштування MONGO_URI в файлі .env');
      } else {
        console.error(error.message);
      }
    } else {
      console.error(error);
    }
    
    try {
      await mongoose.disconnect();
    } catch {
      // Ігноруємо помилки при відключенні
    }
    process.exit(1);
  }
}

// Запуск seed
seedGoods();
