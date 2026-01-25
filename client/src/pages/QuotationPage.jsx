import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Send, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createQuotation } from '../services/api';
import { CATEGORIES } from '../utils/constants';
import Notification from '../components/Notification';

const QuotationPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    productType: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Frontend validation
    if (!formData.name.trim()) {
      setNotification({ message: 'Нэрээ оруулна уу', type: 'error' });
      return;
    }
    if (!formData.phone.trim()) {
      setNotification({ message: 'Утасны дугаараа оруулна уу', type: 'error' });
      return;
    }
    if (!formData.email.trim()) {
      setNotification({ message: 'И-мэйл хаягаа оруулна уу', type: 'error' });
      return;
    }
    if (!formData.productType) {
      setNotification({ message: 'Бүтээгдэхүүний төрөл сонгоно уу', type: 'error' });
      return;
    }
    if (!formData.description.trim()) {
      setNotification({ message: 'Дэлгэрэнгүй тайлбар оруулна уу', type: 'error' });
      return;
    }
    
    try {
      setLoading(true);
      
      // FormData for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('phone', formData.phone.trim());
      submitData.append('email', formData.email.trim());
      submitData.append('productType', formData.productType);
      submitData.append('description', formData.description.trim());
      
      if (selectedFile) {
        submitData.append('designFile', selectedFile);
      }
      
      await createQuotation(submitData);
      
      setNotification({ 
        message: 'Үнийн санал амжилттай илгээгдлээ! Удахгүй холбогдох болно.', 
        type: 'success' 
      });
      
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      console.error('Quotation error:', error);
      setNotification({ 
        message: error.response?.data?.message || 'Алдаа гарлаа', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {notification && (
        <Notification 
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="max-w-2xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6">
          <ArrowLeft size={20} />
          <span>Буцах</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <MessageSquare className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Үнийн санал авах</h1>
            <p className="text-gray-600">
              Таны захиалгын дэлгэрэнгүй мэдээллийг бидэнд илгээнэ үү
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Нэр <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Овог нэр"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Утасны дугаар <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="99112233"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                И-мэйл <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Бүтээгдэхүүний төрөл <span className="text-red-500">*</span>
              </label>
              <select
                name="productType"
                value={formData.productType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Сонгох...</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дизайн файл <span className="text-gray-500">(заавал биш)</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.pdf,.doc,.docx,.ppt,.pptx,.psd,.ai,.eps"
                  className="hidden"
                  id="designFile"
                />
                <label 
                  htmlFor="designFile"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer"
                >
                  <Upload size={20} className="text-gray-400" />
                  <span className="text-gray-600">
                    {selectedFile ? selectedFile.name : 'Файл сонгох (Зураг, PDF, Word, PPT, PSD, AI)'}
                  </span>
                </label>
                {selectedFile && (
                  <div className="mt-2 text-sm text-gray-600">
                    Хэмжээ: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дэлгэрэнгүй тайлбар <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Хэмжээ, тоо ширхэг, материал, өнгө болон бусад шаардлагуудаа дэлгэрэнгүй бичнэ үү...

Жишээ:
- А4 хэмжээтэй каталог
- 50 хуудас
- Өнгөт хэвлэл
- 100 ширхэг
- Өнгөлгөөтэй"
              />
              <p className="mt-2 text-sm text-gray-500">
                Дэлгэрэнгүй бичих тусам илүү үнэн зөв үнийн санал авах боломжтой
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                'Илгээж байна...'
              ) : (
                <>
                  <Send size={24} />
                  Үнийн санал илгээх
                </>
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <h4 className="font-bold text-gray-800 mb-3">📋 Анхаарах зүйлс:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Үнийн санал 24 цагийн дотор и-мэйл эсвэл утсаар хүлээн авна</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Тусгай захиалга, том хэмжээтэй ажилд дизайны файл шаардлагатай</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Үнэ тооцоо хийхэд дээж файл байвал илүү тохиромжтой</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Асуулт байвал 7000-5060 дугаарт холбогдоно уу</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationPage;