import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();

// Demo бүтээгдэхүүнүүд
const products = [
  {
    name: 'Нэрийн хуудас хэвлэл (500ш)',
    price: 45000,
    category: 'cards',
    rating: 4.9,
    reviews: 234,
    badge: 'Хит',
    badgeColor: 'bg-orange-500',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=400&fit=crop',
    description: 'Мэргэжлийн нэрийн хуудас 350г цаасан дээр.',
    material: '350г Art Paper',
    size: '90x50mm',
    format: 'Стандарт',
    stock: 1000,
  },
  {
    name: 'А4 Каталог 16 хуудас',
    price: 125000,
    category: 'catalog',
    rating: 4.8,
    reviews: 156,
    badge: 'Шинэ',
    badgeColor: 'bg-green-500',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
    description: '16 хуудас, өнгөт хэвлэл, өнгөлгөөтэй.',
    material: '150г Art Paper',
    size: 'A4',
    format: 'Өнгөлгөөтэй',
    stock: 500,
  },
  {
    name: 'Флаер А5 (1000ш)',
    price: 85000,
    oldPrice: 110000,
    discount: 23,
    category: 'flyer',
    rating: 4.7,
    reviews: 189,
    badge: '-23%',
    badgeColor: 'bg-red-500',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop',
    description: 'Сурталчилгааны флаер, хоёр талт хэвлэл.',
    material: '130г Glossy',
    size: 'A5',
    format: 'Хоёр талт',
    stock: 800,
  },
  {
    name: 'Лого дизайн үйлчилгээ',
    price: 250000,
    category: 'logo',
    rating: 5.0,
    reviews: 98,
    badge: 'Онцлох',
    badgeColor: 'bg-purple-500',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=400&fit=crop',
    description: 'Мэргэжлийн график дизайнераас лого бүтээх үйлчилгээ.',
    material: 'Digital',
    size: 'Vector',
    format: 'AI, PNG, SVG',
    stock: 0,
  },
  {
    name: 'Баннер 3×2м',
    price: 180000,
    category: 'banner',
    rating: 4.6,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: 'Гадна сурталчилгааны баннер, усанд тэсвэртэй.',
    material: 'Vinyl Banner',
    size: '3x2m',
    format: 'Дижитал хэвлэл',
    stock: 100,
  },
  {
    name: 'Брошюр А4 12 хуудас',
    price: 95000,
    category: 'brochure',
    rating: 4.7,
    reviews: 167,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
    description: '12 хуудас танилцуулга брошюр, өнгөт хэвлэл.',
    material: '150г Art Paper',
    size: 'A4',
    format: 'Хагас эвхсэн',
    stock: 600,
  },
  {
    name: 'Стикер наалт (500ш)',
    price: 55000,
    oldPrice: 70000,
    discount: 21,
    category: 'sticker',
    rating: 4.5,
    reviews: 203,
    badge: '-21%',
    badgeColor: 'bg-red-500',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop',
    description: 'Тусгай наалт, ямар ч хэлбэрээр огтлох боломжтой.',
    material: 'Vinyl Sticker',
    size: 'Custom',
    format: 'Die-cut',
    stock: 1200,
  },
  {
    name: 'Брэндинг багц',
    price: 850000,
    category: 'branding',
    rating: 4.9,
    reviews: 76,
    badge: 'Онцлох',
    badgeColor: 'bg-purple-500',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=400&fit=crop',
    description: 'Бүрэн брэндинг багц: лого, нэрийн хуудас, хуудас толгой.',
    material: 'Digital + Print',
    size: 'Package',
    format: 'Багц үйлчилгээ',
    stock: 0,
  },
];

// Demo хэрэглэгчүүд
const users = [
  {
    name: 'Админ',
    email: 'admin@printshop.mn',
    password: 'admin123',
    role: 'admin',
    wallet: 1000000,
  },
  {
    name: 'Алтансарнай',
    email: 'user@printshop.mn',
    password: 'user123',
    role: 'user',
    wallet: 500000,
  },
];

const importData = async () => {
  try {
    await connectDB();

    // Өмнөх өгөгдлийг устгах
    await Product.deleteMany();
    await User.deleteMany();

    // Шинэ өгөгдөл оруулах
    await User.insertMany(users);
    await Product.insertMany(products);

    console.log('✅ Өгөгдөл амжилттай оруулагдлаа');
    process.exit();
  } catch (error) {
    console.error(`❌ Алдаа: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    await User.deleteMany();

    console.log('✅ Өгөгдөл амжилттай устгагдлаа');
    process.exit();
  } catch (error) {
    console.error(`❌ Алдаа: ${error.message}`);
    process.exit(1);
  }
};

// Command line аргументаас хамааран ажиллуулах
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}