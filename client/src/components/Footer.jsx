import { Printer, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
      {/* Footer Banner with Image */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-gray-900">
        <img 
          src="/footer.png" 
          alt="Print Shop" 
          className="w-full h-full object-cover opacity-70"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Чанартай хэвлэлийн үйлчилгээ</h2>
            <p className="text-xl text-gray-200">Монголын тэргүүлэгч хэвлэлийн компани</p>
          </div>
        </div>
      </div>

     

      {/* Main Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                  <Printer className="text-white" size={24} />
                </div>
                <div>
                  <div className="text-xl font-bold">PRINT SHOP</div>
                  <div className="text-xs text-gray-400">Хэвлэлийн төв</div>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Монгол дахь хэвлэлийн салбарын тэргүүлэгч компани.
              </p>
              <div className="flex gap-3">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <Facebook size={20} />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Холбоо барих</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone size={18} />
                  <span>+976 7000-5060</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={18} />
                  <span>info@printshop.mn</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Үйлчилгээ</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Офсет хэвлэл
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Дижитал хэвлэл
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Дизайн үйлчилгээ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Address */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Төв оффис</h4>
              <div className="flex items-start gap-2 text-gray-400">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <p>
                  Улаанбаатар хот, Сонгинохайрхан дүүрэг 12-р хороо
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-gray-400 text-sm">
              © 2024 PRINT SHOP. Бүх эрх хуулиар хамгаалагдсан.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;