import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Бүтээгдэхүүний нэр оруулна уу'],
      trim: true,
      maxlength: [200, 'Нэр 200 тэмдэгтээс ихгүй байх ёстой'],
    },
    category: {
      type: String,
      required: [true, 'Ангилал сонгоно уу'],
      enum: [
        'cards',        // Нэрийн хуудас
        'catalog',      // Каталог
        'flyer',        // Флаер
        'brochure',     // Брошюр
        'banner',       // Баннер
        'poster',       // Постер
        'envelope',     // Дугтуй
        'letterhead',   // Толгой хуудас
        'sticker',      // Наалт
        'packaging',    // Савлагаа
        'logo',         // Лого дизайн
        'custom'        // Тусгай захиалга
      ],
    },
    price: {
      type: Number,
      required: [true, 'Үнэ оруулна уу'],
      min: [0, 'Үнэ сөрөг тоо байж болохгүй'],
    },
    oldPrice: {
      type: Number,
      min: [0, 'Үнэ сөрөг тоо байж болохгүй'],
    },
    discount: {
      type: Number,
      min: [0, 'Хөнгөлөлт сөрөг байж болохгүй'],
      max: [100, 'Хөнгөлөлт 100%-иас ихгүй байх ёстой'],
    },
    size: {
      type: String,
      trim: true,
    },
    format: {
      type: String,
      trim: true,
    },
    material: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=400&fit=crop',
    },
    images: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
      maxlength: [2000, 'Тайлбар 2000 тэмдэгтээс ихгүй байх ёстой'],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Үнэлгээ 0-оос бага байж болохгүй'],
      max: [5, 'Үнэлгээ 5-аас их байж болохгүй'],
    },
    reviews: {
      type: Number,
      default: 0,
      min: [0, 'Үнэлгээний тоо сөрөг байж болохгүй'],
    },
    badge: {
      type: String,
      trim: true,
    },
    badgeColor: {
      type: String,
      default: 'bg-blue-500',
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Нөөц сөрөг байж болохгүй'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Text хайлт хийх index
productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;