import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const SectionHeader = ({
    title,
    description,
    icon: Icon,
    viewAllLink,
    accentColor = 'blue' // blue, red, yellow, green, purple
}) => {
    const colorClasses = {
        blue: 'border-blue-600 text-blue-600',
        red: 'border-red-600 text-red-600',
        yellow: 'border-yellow-600 text-yellow-600',
        green: 'border-green-600 text-green-600',
        purple: 'border-purple-600 text-purple-600',
    };

    return (
        <div className="flex items-start justify-between mb-6">
            <div className={`border-l-4 ${colorClasses[accentColor].split(' ')[0]} pl-4`}>
                <div className="flex items-center gap-2 mb-1">
                    {Icon && <Icon className={colorClasses[accentColor].split(' ')[1]} size={24} />}
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {title}
                    </h2>
                </div>
                {description && (
                    <p className="text-gray-600 text-sm md:text-base">
                        {description}
                    </p>
                )}
            </div>

            {viewAllLink && (
                <Link
                    to={viewAllLink}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-sm md:text-base whitespace-nowrap mt-2"
                >
                    <span>Бүгдийг үзэх</span>
                    <ChevronRight size={18} />
                </Link>
            )}
        </div>
    );
};

export default SectionHeader;