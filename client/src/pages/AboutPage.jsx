import { Link } from 'react-router-dom';
import { ArrowLeft, Award, Users, Target, TrendingUp } from 'lucide-react';

const AboutPage = () => {
  const features = [
    {
      icon: Award,
      title: 'Чанартай үйлчилгээ',
      description: '15 жилийн туршлагатай мэргэжлийн баг'
    },
    {
      icon: Users,
      title: '10,000+ үйлчлүүлэгч',
      description: 'Олон мянган үйлчлүүлэгчийн итгэлийг хүлээсэн'
    },
    {
      icon: Target,
      title: 'Үр дүнтэй шийдэл',
      description: 'Таны бизнест тохирсон хэвлэлийн шийдэл'
    },
    {
      icon: TrendingUp,
      title: 'Орчин үеийн технологи',
      description: 'Дэлхийн стандартад нийцсэн тоног төхөөрөмж'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6">
          <ArrowLeft size={20} />
          <span>Буцах</span>
        </Link>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-16 relative overflow-hidden rounded-2xl shadow-xl p-12 text-white mb-12">
          <h1 className="text-5xl font-bold mb-4">Бидний тухай</h1>
          <p className="text-xl text-blue-100">
            Монголын хэвлэлийн салбарын тэргүүлэгч компани
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Манай түүх</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              2009 онд үүсгэн байгуулагдсан Print Shop нь Монголын хэвлэлийн салбарт 15 гаруй жилийн турш үйл ажиллагаа явуулж байна. 
              Бид дотоод, гадаадын орчин үеийн технологийг ашиглан өндөр чанартай хэвлэлийн үйлчилгээ үзүүлж байна.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Манай зорилго бол Монголын бизнес эрхлэгчдэд дэлхийн стандартад нийцсэн, 
              найдвартай хэвлэлийн үйлчилгээгээр хангах явдал юм. Бид үйлчлүүлэгчдийнхээ амжилтын түнш байхыг эрмэлздэг.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Өнөөдрийн байдлаар 10,000 гаруй үйлчлүүлэгчтэй ажиллаж, 
              жил бүр олон мянган төрлийн хэвлэлийн бүтээгдэхүүн үйлдвэрлэж байна.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Services Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Бидний үйлчилгээ</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Хэвлэлийн үйлчилгээ</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Нэрийн хуудас</li>
                <li>• Каталог, брошюр</li>
                <li>• Флаер, постер</li>
                <li>• Баннер</li>
              </ul>
            </div>
            <div className="border-l-4 border-purple-600 pl-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Дизайн ажил</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Лого дизайн</li>
                <li>• Brand identity</li>
                <li>• Савлагааны дизайн</li>
                <li>• Зар сурталчилгаа</li>
              </ul>
            </div>
            <div className="border-l-4 border-orange-600 pl-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Тусгай захиалга</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Өвөрмөц дизайн</li>
                <li>• Том хэмжээтэй хэвлэл</li>
                <li>• Зөвлөх үйлчилгээ</li>
                <li>• Техникийн дэмжлэг</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Бидэнтэй хамтран ажиллах уу?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Та бүхэнд чанартай, найдвартай хэвлэлийн үйлчилгээ үзүүлэхэд бэлэн байна
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              to="/quotation"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Үнийн санал авах
            </Link>
            <Link 
              to="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Холбоо барих
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;