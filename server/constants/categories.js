// Системийн нийтлэг ангиллын жагсаалт
// Product болон Quotation-д ашиглагдана

export const CATEGORIES = [
  { id: 'cards', name: 'Нэрийн хуудас', nameEn: 'Business Cards' },
  { id: 'catalog', name: 'Каталог', nameEn: 'Catalog' },
  { id: 'flyer', name: 'Флаер', nameEn: 'Flyer' },
  { id: 'brochure', name: 'Брошюр', nameEn: 'Brochure' },
  { id: 'banner', name: 'Баннер', nameEn: 'Banner' },
  { id: 'poster', name: 'Постер', nameEn: 'Poster' },
  { id: 'envelope', name: 'Дугтуй', nameEn: 'Envelope' },
  { id: 'letterhead', name: 'Толгой хуудас', nameEn: 'Letterhead' },
  { id: 'sticker', name: 'Наалт', nameEn: 'Sticker' },
  { id: 'packaging', name: 'Савлагаа', nameEn: 'Packaging' },
  { id: 'logo', name: 'Лого дизайн', nameEn: 'Logo Design' },
  { id: 'custom', name: 'Тусгай захиалга', nameEn: 'Custom Order' }
];

// Хэмжээний жагсаалт
export const SIZES = [
  { id: 'a4', name: 'A4 (210×297mm)', nameEn: 'A4' },
  { id: 'a3', name: 'A3 (297×420mm)', nameEn: 'A3' },
  { id: 'a5', name: 'A5 (148×210mm)', nameEn: 'A5' },
  { id: 'a6', name: 'A6 (105×148mm)', nameEn: 'A6' },
  { id: 'business_card', name: 'Нэрийн хуудас (90×50mm)', nameEn: 'Business Card' },
  { id: 'dl', name: 'DL (210×99mm)', nameEn: 'DL' },
  { id: 'custom', name: 'Тусгай хэмжээ', nameEn: 'Custom Size' }
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

// Category ID-аар нэр олох
export const getCategoryName = (categoryId) => {
  const category = CATEGORIES.find(cat => cat.id === categoryId);
  return category ? category.name : categoryId;
};

// Validate category
export const isValidCategory = (categoryId) => {
  return CATEGORIES.some(cat => cat.id === categoryId);
};

export default { CATEGORIES, SIZES, MATERIALS, getCategoryName, isValidCategory };