import mongoose from 'mongoose';

const marketingServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Үйлчилгээний нэр оруулна уу'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Тайлбар оруулна уу'],
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [200, 'Товч тайлбар 200 тэмдэгтээс ихгүй байх ёстой'],
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    price: {
      type: String, // Flexible pricing (e.g., "50,000₮/сар", "Хэлэлцэнэ")
      trim: true,
    },
    image: {
      type: String,
    },
    icon: {
      type: String, // lucide-react icon name
      default: 'TrendingUp',
    },
    category: {
      type: String,
      enum: ['social-media', 'seo', 'content', 'advertising', 'branding', 'other'],
      default: 'other',
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Slug автоматаар үүсгэх
marketingServiceSchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    // Mongolian to latin transliteration
    const translitMap = {
      а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'j',
      з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
      ө: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ү: 'u', ф: 'f',
      х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sh', ъ: '', ы: 'y', ь: '',
      э: 'e', ю: 'yu', я: 'ya'
    };
    
    let slug = this.name.toLowerCase();
    // Replace Mongolian characters
    slug = slug.split('').map(char => translitMap[char] || char).join('');
    // Replace spaces and special chars with dash
    slug = slug.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    
    this.slug = slug;
  }
  next();
});

const MarketingService = mongoose.model('MarketingService', marketingServiceSchema);

export default MarketingService;