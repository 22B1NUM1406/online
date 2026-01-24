export const categories = [
  { 
    id: 'printing',
    name: 'Хэвлэлийн үйлчилгээ', 
    icon: 'Printer',
    subcategories: [
      { id: 'offset', name: 'Офсет хэвлэл', count: 25 },
      { id: 'digital', name: 'Дижитал хэвлэл', count: 18 },
      { id: 'large', name: 'Том хэмжээ', count: 12 },
      { id: 'poster', name: 'Постер/Баннер', count: 30 }
    ]
  },
  { 
    id: 'paper',
    name: 'Цаас материал', 
    icon: 'FileText',
    subcategories: [
      { id: 'office', name: 'Оффисын цаас', count: 45 },
      { id: 'specialty', name: 'Тусгай цаас', count: 32 },
      { id: 'cardboard', name: 'Картон', count: 15 }
    ]
  },
  { 
    id: 'design',
    name: 'Дизайн ажил', 
    icon: 'Layers',
    subcategories: [
      { id: 'logo', name: 'Лого дизайн', count: 8 },
      { id: 'branding', name: 'Брэндинг', count: 12 },
      { id: 'layout', name: 'График дизайн', count: 20 }
    ]
  },
  { 
    id: 'business',
    name: 'Бизнес материал', 
    icon: 'Award',
    subcategories: [
      { id: 'cards', name: 'Нэрийн хуудас', count: 50 },
      { id: 'brochure', name: 'Брошюр', count: 35 },
      { id: 'catalog', name: 'Каталог', count: 22 }
    ]
  },
  { 
    id: 'packaging',
    name: 'Савлагаа', 
    icon: 'Package',
    subcategories: [
      { id: 'box', name: 'Хайрцаг', count: 28 },
      { id: 'bag', name: 'Уут', count: 40 },
      { id: 'label', name: 'Шошго', count: 55 }
    ]
  },
  { 
    id: 'promo',
    name: 'Сурталчилгаа', 
    icon: 'Tag',
    subcategories: [
      { id: 'flyer', name: 'Флаер', count: 45 },
      { id: 'sticker', name: 'Наалт', count: 60 },
      { id: 'banner', name: 'Баннер', count: 25 }
    ]
  }
];

export const products = [
  { 
    id: 1, 
    name: 'Нэрийн хуудас хэвлэл (500ш)', 
    price: 45000,
    oldPrice: null,
    discount: null,
    category: 'cards',
    size: '90x50mm',
    material: 'Матов цаас 300гр',
    rating: 4.9,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=400&fit=crop',
    description: 'Өндөр чанарын нэрийн хуудас хэвлэл. 2 талдаа хэвлэгдэнэ.',
    badge: 'Хит',
    badgeColor: 'bg-orange-500',
    inStock: true,
    minOrder: 100
  },
  { 
    id: 2, 
    name: 'А4 Каталог 16 хуудас', 
    price: 125000,
    oldPrice: null,
    discount: null,
    category: 'catalog',
    size: 'A4',
    material: 'Гялгар цаас 150гр',
    rating: 4.8,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
    description: '16 хуудас бүхий каталог хэвлэл. Өнгөт хэвлэл.',
    badge: 'Шинэ',
    badgeColor: 'bg-green-500',
    inStock: true,
    minOrder: 50
  },
  // ... бусад бүтээгдэхүүнүүд
];

export const cartItems = [
  {
    id: 1,
    productId: 1,
    name: 'Нэрийн хуудас хэвлэл (500ш)',
    price: 45000,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w-200&h=200&fit=crop'
  },
  // ... бусад сагсны зүйлс
];

export const orders = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    status: 'completed',
    total: 145000,
    items: 3,
    customer: 'Б. Баярмагнай',
    paymentMethod: 'wallet'
  },
  // ... бусад захиалгууд
];

export const quotations = [
  {
    id: 1,
    name: 'Ц. Энхтуяа',
    phone: '99112233',
    email: 'tuyaa@example.com',
    productType: 'ном хэвлэл',
    description: '200 хуудас бүхий сурах бичиг хэвлэх',
    status: 'pending',
    date: '2024-01-20'
  },
  // ... бусад үнийн саналууд
];