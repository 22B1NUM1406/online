import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Гарчиг оруулна уу'],
      trim: true,
      maxlength: [200, 'Гарчиг 200 тэмдэгтээс ихгүй байх ёстой'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [500, 'Товч агуулга 500 тэмдэгтээс ихгүй байх ёстой'],
    },
    content: {
      type: String,
      required: [true, 'Агуулга оруулна уу'],
    },
    featuredImage: {
      type: String,
    },
    category: {
      type: String,
      enum: ['news', 'tutorial', 'tips', 'case-study', 'announcement', 'other'],
      default: 'other',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    publishedAt: {
      type: Date,
    },
    views: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false, // Онцлох блог эсэх
    },
  },
  {
    timestamps: true,
  }
);

// Slug автоматаар үүсгэх
blogSchema.pre('validate', function (next) {
  if (this.title && !this.slug) {
    // Mongolian to latin transliteration
    const translitMap = {
      а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'j',
      з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
      ө: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ү: 'u', ф: 'f',
      х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sh', ъ: '', ы: 'y', ь: '',
      э: 'e', ю: 'yu', я: 'ya'
    };
    
    let slug = this.title.toLowerCase();
    // Replace Mongolian characters
    slug = slug.split('').map(char => translitMap[char] || char).join('');
    // Replace spaces and special chars with dash
    slug = slug.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    
    this.slug = slug;
  }
  next();
});

// Published date автоматаар set хийх
blogSchema.pre('save', function (next) {
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Text search index
blogSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;