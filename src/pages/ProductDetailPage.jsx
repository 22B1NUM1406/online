import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, ShoppingCart, Heart, Truck, Shield, 
  ChevronLeft, Package, Printer, Clock
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products } from '../utils/mockData';
import { formatPrice } from '../utils/helpers';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('A4');
  const [selectedMaterial, setSelectedMaterial] = useState('standard');

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Бүтээгдэхүүн олдсонгүй</h2>
          <Link to="/products" className="text-blue-600 hover:text-blue-800">
            Бүтээгдэхүүнүүд рүү буцах
          </Link>
        </div>
      </div>
    );
  }

  const sizes = ['A4', 'A5', 'A3', 'A2', 'Custom'];
  const materials = [
    { id: 'standard', name: 'Стандарт цаас', price: 0 },
    { id: 'premium', name: 'Премиум цаас', price: 5000 },
    { id: 'matte', name: 'Матов цаас', price: 3000 },
    { id: 'glossy', name: 'Гялгар цаас', price: 4000 }
  ];

  const totalPrice = product.price * quantity;

  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      quantity,
      selectedSize,
      selectedMaterial
    };
    addToCart(cartItem);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link to="/products" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
          <ChevronLeft size={18} />
          Бүтээгдэхүүнүүд рүү буцах
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div>
          <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="bg-gray-100 rounded-lg p-2 cursor-pointer hover:ring-2 hover:ring-blue-500">
                <img 
                  src={product.image} 
                  alt={`${product.name} - ${num}`}
                  className="w-full h-20 object-cover rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4">
            {product.badge && (
              <span className={`inline-block ${product.badgeColor} text-white px-3 py-1 rounded-full text-sm font-bold mb-2`}>
                {product.badge}
              </span>
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={18} 
                      className={`${star <= Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="font-medium text-gray-700">{product.rating}</span>
                <span className="text-gray-400">({product.reviews} үнэлгээ)</span>
              </div>
              <span className={`px-2 py-1 rounded text-sm ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {product.inStock ? 'Бэлэн' : 'Дууссан'}
              </span>
            </div>

            <div className="text-4xl font-bold text-blue-600 mb-6">
              {formatPrice(totalPrice)}
              {product.oldPrice && (
                <span className="text-lg text-gray-400 line-through ml-2">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Тайлбар</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Printer size={18} className="text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Хэвлэлийн төрөл</div>
                <div className="font-medium">Дижитал хэвлэл</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Package size={18} className="text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Материал</div>
                <div className="font-medium">{product.material}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Хүргэлтийн хугацаа</div>
                <div className="font-medium">2-4 хоног</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div>
                <div className="text-sm text-gray-500">Хамгийн бага захиалга</div>
                <div className="font-medium">{product.minOrder} ширхэг</div>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-6">
            {/* Size Selection */}
            <div>
              <h4 className="font-semibold mb-3">Хэмжээ сонгох</h4>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      selectedSize === size
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Material Selection */}
            <div>
              <h4 className="font-semibold mb-3">Цаасны төрөл</h4>
              <div className="grid grid-cols-2 gap-3">
                {materials.map((material) => (
                  <button
                    key={material.id}
                    onClick={() => setSelectedMaterial(material.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedMaterial === material.id
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-medium">{material.name}</div>
                    {material.price > 0 && (
                      <div className="text-sm text-gray-600">+{formatPrice(material.price)}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h4 className="font-semibold mb-3">Тоо ширхэг</h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 w-16 text-center font-medium">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
                <div className="text-gray-600">
                  Нийт: <span className="font-bold text-blue-600">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
            >
              <ShoppingCart size={20} />
              Сагсанд нэмэх
            </button>
            <button className="px-6 py-3.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Heart size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mt-8 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Truck size={18} className="text-green-600" />
              </div>
              <div>
                <div className="font-medium text-sm">Үнэгүй хүргэлт</div>
                <div className="text-xs text-gray-500">200,000₮-с дээш</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield size={18} className="text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-sm">Баталгаат</div>
                <div className="text-xs text-gray-500">Чанарт итгэлтэй</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Холбоотой бүтээгдэхүүнүүд</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.slice(0, 3).map((relatedProduct) => (
            <div key={relatedProduct.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              <Link to={`/products/${relatedProduct.id}`}>
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={relatedProduct.image} 
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-800 mb-2">{relatedProduct.name}</h3>
                  <div className="text-blue-600 font-bold">{formatPrice(relatedProduct.price)}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;