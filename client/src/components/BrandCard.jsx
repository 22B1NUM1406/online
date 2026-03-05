import { Link } from 'react-router-dom';

const BrandCard = ({ brand }) => {
    return (
        <Link
            to={`/products?brand=${brand.slug || brand._id}`}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 flex items-center justify-center aspect-square"
        >
            {brand.logo ? (
                <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all"
                />
            ) : (
                <span className="text-2xl font-bold text-gray-400">{brand.name}</span>
            )}
        </Link>
    );
};

export default BrandCard;