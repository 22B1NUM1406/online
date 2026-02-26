import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Truck, Shield, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { getProduct } from '../services/api';
import { formatPrice, getImageUrl } from '../utils/helpers';
import Loading from '../components/Loading';
import Notification from '../components/Notification';
import ShareButtons from '../components/ShareButtons';
import TextDisplay from '../components/TextDisplay';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState(null);
  const [heartAnimating, setHeartAnimating] = useState(false);

  const inWishlist = product ? isInWishlist(product._id) : false;

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await getProduct(id);
      setProduct(data.data);
    } catch (error) {
      console.error('Error loading product:', error);
      setNotification({ message: 'Бүтээгдэхүүн олдсонгүй', type: 'error' });
      setTimeout(() => navigate('/'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setNotification({ message: 'Нэвтэрсний дараа сагсанд нэмнэ үү', type: 'info' });
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      discount: product.discount,
      image: product.image,
      quantity: quantity,
    });
    setNotification({ message: 'Сагсанд нэмэгдлээ!', type: 'success' });
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      setNotification({ message: 'Нэвтэрсний дараа хадгална уу', type: 'info' });
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    toggleWishlist(product);
    setHeartAnimating(true);
    setTimeout(() => setHeartAnimating(false), 600);
    
    const message = inWishlist ? 'Хадгалсан жагсаалтаас хасагдлаа' : 'Хадгалсан жагсаалтад нэмэгдлээ';
    setNotification({ message, type: 'success' });
  };

  if (loading) return <Loading />;
  if (!product) return null;

  const discountedPrice = product.discount 
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  return (
    <>
      {/* React 19 Meta Tags - Automatically hoisted to <head> */}
      <title>{product.name} | BizCo Print Shop</title>
      <meta name="description" content={product.description?.substring(0, 160) || product.name} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="product" />
      <meta property="og:url" content={`https://www.bizco.mn/products/${product._id}`} />
      <meta property="og:title" content={product.name} />
      <meta property="og:description" content={product.description?.substring(0, 300) || product.name} />
      <meta property="og:image" content={getImageUrl(product.image)} />
      <meta property="og:image:secure_url" content={getImageUrl(product.image)} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={product.name} />
      <meta property="og:site_name" content="BizCo Print Shop" />
      
      {/* Product Specific */}
      <meta property="product:price:amount" content={product.price} />
      <meta property="product:price:currency" content="MNT" />
      {product.discount && (
        <meta property="product:sale_price:amount" content={discountedPrice} />
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={product.name} />
      <meta name="twitter:description" content={product.description?.substring(0, 200) || product.name} />
      <meta name="twitter:image" content={getImageUrl(product.image)} />

      {/* Component Content */}
      <div className="min-h-screen bg-gray-50">
        {notification && (
          <Notification 
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}

        {/* Back Button */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Буцах</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="relative aspect-square">
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x600?text=Product';
                  }}
                />
                {product.discount && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
                    -{product.discount}%
                  </div>
                )}
                {product.featured && (
                  <div className="absolute top-4 left-4 bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                    <Star size={16} fill="white" />
                    Онцлох
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                
                {/* Category */}
                {product.category && (
                  <div className="mb-4">
                    <Link 
                      to={`/products?category=${product.category.slug}`}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {product.category.name}
                    </Link>
                  </div>
                )}

                {/* Price */}
                <div className="mb-6">
                  {product.discount ? (
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-red-600">
                        {formatPrice(discountedPrice)}₮
                      </span>
                      <span className="text-xl text-gray-400 line-through">
                        {formatPrice(product.price)}₮
                      </span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(product.price)}₮
                    </span>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Тайлбар</h3>
                    <TextDisplay content={product.description} />
                  </div>
                )}

                {/* Product Details */}
                <div className="mb-6 space-y-2">
                  {product.size && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Хэмжээ:</span>
                      <span className="font-medium">{product.size}</span>
                    </div>
                  )}
                  {product.format && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Формат:</span>
                      <span className="font-medium">{product.format}</span>
                    </div>
                  )}
                  {product.material && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Материал:</span>
                      <span className="font-medium">{product.material}</span>
                    </div>
                  )}
                </div>

                {/* Quantity */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тоо ширхэг
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="text-xl font-medium w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={20} />
                    Сагсанд нэмэх
                  </button>
                  <button
                    onClick={handleToggleWishlist}
                    className={`px-4 py-3 border-2 rounded-lg transition-all ${
                      inWishlist 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-300 hover:border-red-500'
                    } ${heartAnimating ? 'scale-125' : ''}`}
                  >
                    <Heart 
                      size={24} 
                      className={inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                    />
                  </button>
                </div>

                {/* Share Buttons */}
                <div className="mb-6">
                  <ShareButtons 
                    url={`https://www.bizco.mn/products/${product._id}`}
                    title={product.name}
                    description={product.description}
                    image={getImageUrl(product.image)}
                  />
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Truck className="text-green-600" size={24} />
                    <span className="text-sm text-gray-700">Хүргэлттэй</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Shield className="text-blue-600" size={24} />
                    <span className="text-sm text-gray-700">Баталгаатай</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;