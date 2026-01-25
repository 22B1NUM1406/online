import { 
  CreditCard, FileText, File, Award, Image, Package, Palette, Mail, PenTool, Sticker, Star
} from 'lucide-react';

// Бүтээгдэхүүний ангилал (Backend-тэй ижил)
export const CATEGORIES = [
  { id: 'cards', name: 'Нэрийн хуудас', icon: CreditCard },
  { id: 'catalog', name: 'Каталог', icon: FileText },
  { id: 'flyer', name: 'Флаер', icon: File },
  { id: 'brochure', name: 'Брошюр', icon: Award },
  { id: 'banner', name: 'Баннер', icon: Image },
  { id: 'poster', name: 'Постер', icon: Image },
  { id: 'envelope', name: 'Дугтуй', icon: Mail },
  { id: 'letterhead', name: 'Толгой хуудас', icon: FileText },
  { id: 'sticker', name: 'Наалт', icon: Sticker },
  { id: 'packaging', name: 'Савлагаа', icon: Package },
  { id: 'logo', name: 'Лого дизайн', icon: Palette },
  { id: 'custom', name: 'Тусгай захиалга', icon: Star }
];

// Хэмжээний жагсаалт
export const SIZES = [
  { id: 'a4', name: 'A4 (210×297mm)' },
  { id: 'a3', name: 'A3 (297×420mm)' },
  { id: 'a5', name: 'A5 (148×210mm)' },
  { id: 'a6', name: 'A6 (105×148mm)' },
  { id: 'business_card', name: 'Нэрийн хуудас (90×50mm)' },
  { id: 'dl', name: 'DL (210×99mm)' },
  { id: 'custom', name: 'Тусгай хэмжээ' }
];

// Материалын жагсаалт
export const MATERIALS = [
  '80г цагаан цаас',
  '100г цагаан цаас',
  '150г Art Paper',
  '250г Art Paper',
  '350г Art Paper',
  'Vinyl баннер',
  'PVC баннер',
  'Хуванцар',
  'Бусад'
];

// Helper functions
export const getCategoryName = (categoryId) => {
  const category = CATEGORIES.find(cat => cat.id === categoryId);
  return category ? category.name : categoryId;
};

export const getCategoryIcon = (categoryId) => {
  const category = CATEGORIES.find(cat => cat.id === categoryId);
  return category ? category.icon : FileText;
};

// Backward compatibility
export const categories = CATEGORIES.map(cat => ({
  ...cat,
  subcategories: [] // Empty for now
}));