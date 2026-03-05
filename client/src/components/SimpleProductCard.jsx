import { Link } from 'react-router-dom';
import { formatPrice, getImageUrl } from '../utils/helpers';

const SimpleProductCard = ({ product }) => {
    const discountedPrice = product.discount
        ? product.price * (1 - product.discount / 100)
        : null;

    return (
        <Link
            to={`/products/${product._id}`}
            className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
            {/* Image Container */}
            <div className="relative bg-gray-50 aspect-square flex items-center justify-center p-4">
                <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=Product';
                    }}
                />

                {/* Discount Badge */}
                {product.discount && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                        -{product.discount}%
                    </div>
                )}

                {/* "Best Seller" Badge */}
                {product.featured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                        Best Seller
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-4">
                {/* Product Name */}
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-3 min-h-[40px] group-hover:text-blue-600 transition-colors">
                    {product.name}
                </h3>

                {/* Category/Brand */}
                {product.category && (
                    <p className="text-xs text-gray-500 mb-2">
                        {product.category.name || product.category}
                    </p>
                )}

                {/* Pricing */}
                <div className="flex items-baseline gap-2">
                    {discountedPrice ? (
                        <>
                            <span className="text-lg font-bold text-red-600">
                                {formatPrice(discountedPrice)}₮
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                                {formatPrice(product.price)}₮
                            </span>
                        </>
                    ) : (
                        <span className="text-lg font-bold text-gray-900">
                            {formatPrice(product.price)}₮
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default SimpleProductCard;