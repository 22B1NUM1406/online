import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/helpers';

const SimpleCategoryCard = ({ category, previewImage }) => {
    return (
        <Link
            to={`/products?category=${category.slug}`}
            className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300"
        >
            {/* Image */}
            <div className="relative bg-gray-50 aspect-square flex items-center justify-center p-4">
                {previewImage ? (
                    <img
                        src={getImageUrl(previewImage)}
                        alt={category.name}
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/200x200?text=Category';
                        }}
                    />
                ) : (
                    <div className="text-5xl">📦</div>
                )}
            </div>

            {/* Category Name */}
            <div className="p-4 text-center border-t border-gray-100">
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm">
                    {category.name}
                </h3>
            </div>
        </Link>
    );
};

export default SimpleCategoryCard;