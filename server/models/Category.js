import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ангиллын нэр оруулна уу'],
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
      trim: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null, // null = үндсэн ангилал
    },
    image: {
      type: String,
    },
    icon: {
      type: String, // lucide-react icon name
      default: 'Package',
    },
    order: {
      type: Number,
      default: 0, // Дарааллын дугаар
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

// Slug автоматаар үүсгэх
categorySchema.pre('validate', function (next) {
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

// Virtual field - дэд ангилалууд авах
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
});

// Populate subcategories by default
categorySchema.set('toJSON', { virtuals: true });
categorySchema.set('toObject', { virtuals: true });

const Category = mongoose.model('Category', categorySchema);

export default Category;