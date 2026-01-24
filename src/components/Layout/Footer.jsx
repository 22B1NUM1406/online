import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, Mail, MapPin, Facebook, Instagram, 
  Twitter, Youtube, Printer
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
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
              Чанар, хурд, найдвартай үйлчилгээ.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Холбоо барих</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center gap-2">
                <Phone size={18} />
                <a href="tel:70005060" className="hover:text-blue-400 transition-colors">+976 7000-5060</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={18} />
                <a href="tel:93000022" className="hover:text-blue-400 transition-colors">+976 9300-0022</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={18} />
                <a href="mailto:info@printshop.mn" className="hover:text-blue-400 transition-colors">info@printshop.mn</a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span>
                  Улаанбаатар хот, Сонгинохайрхан дүүрэг<br />
                  12-р хороо, Peace Avenue 17
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Үйлчилгээ</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/products" className="hover:text-blue-400 transition-colors">Офсет хэвлэл</Link></li>
              <li><Link to="/products" className="hover:text-blue-400 transition-colors">Дижитал хэвлэл</Link></li>
              <li><Link to="/products" className="hover:text-blue-400 transition-colors">Дизайн үйлчилгээ</Link></li>
              <li><Link to="/products" className="hover:text-blue-400 transition-colors">Савлагаа үйлдвэрлэл</Link></li>
              <li><Link to="/products" className="hover:text-blue-400 transition-colors">Бизнес материал</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Холбоос</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">Бидний тухай</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Холбоо барих</Link></li>
              <li><Link to="/faq" className="hover:text-blue-400 transition-colors">Түгээмэл асуулт</Link></li>
              <li><Link to="/blog" className="hover:text-blue-400 transition-colors">Блог</Link></li>
              <li><Link to="/careers" className="hover:text-blue-400 transition-colors">Карьер</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-2">Мэдээлэл авах</h4>
              <p className="text-gray-400 text-sm">Шинэ бүтээгдэхүүн, хямдралын мэдээллийг цаг алдалгүй хүлээн авна уу</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input 
                type="email"
                placeholder="И-мэйл хаягаа оруулна уу"
                className="flex-1 md:w-80 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              />
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Бүртгүүлэх
              </button>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} PRINT SHOP. Бүх эрх хуулиар хамгаалагдсан.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link to="/terms" className="hover:text-blue-400 transition-colors">Үйлчилгээний нөхцөл</Link>
              <Link to="/privacy" className="hover:text-blue-400 transition-colors">Нууцлалын бодлого</Link>
              <Link to="/cookies" className="hover:text-blue-400 transition-colors">Cookie бодлого</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;