import React, { useState } from 'react';
import { 
  FileText, Upload, Calendar, Package, MessageSquare,
  CheckCircle, Clock, DollarSign, Users, Award
} from 'lucide-react';

const QuotationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    productType: '',
    quantity: '',
    deadline: '',
    description: '',
    files: []
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const productTypes = [
    'Нэрийн хуудас',
    'Брошюр',
    'Каталог',
    'Плакат/Баннер',
    'Ном хэвлэл',
    'Шошго/Наалт',
    'Савлагаа/Хайрцаг',
    'Дизайн ажил',
    'Бусад'
  ];
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
  };
  
  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 2000);
  };
  
  if (isSubmitted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Үнийн санал амжилттай илгээгдлээ!</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Таны үнийн санал бидэн рүү амжилттай хүрсэн. Бид 24 цагийн дотор тантай холбогдох болно.
          </p>
          
          <div className="bg-white rounded-xl shadow-sm p-8 max-w-lg mx-auto mb-8">
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3">
                <Clock className="text-blue-600" size={20} />
                <div>
                  <div className="font-medium">Хариу өгөх хугацаа</div>
                  <div className="text-gray-600">24 цагийн дотор</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MessageSquare className="text-blue-600" size={20} />
                <div>
                  <div className="font-medium">Холбоо барих</div>
                  <div className="text-gray-600">Утас: 7000-5060 | И-мэйл: info@printshop.mn</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="text-blue-600" size={20} />
                <div>
                  <div className="font-medium">Мэргэжлийн зөвлөгөө</div>
                  <div className="text-gray-600">Бид таны төсөлд тохирох шийдэл санал болгоно</div>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                name: '',
                company: '',
                email: '',
                phone: '',
                productType: '',
                quantity: '',
                deadline: '',
                description: '',
                files: []
              });
            }}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Шинэ үнийн санал илгээх
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-white mb-12">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Үнийн санал авах</h1>
          <p className="text-blue-100 text-lg mb-6">
            Таны хэвлэлийн төсөлд тохирох үнийн саналыг бид үнэгүй гаргаж өгнө.
            Мэргэжлийн зөвлөгөөгөө авна уу.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign size={24} />
              </div>
              <div>
                <div className="font-bold">Үнэгүй үнэлгээ</div>
                <div className="text-blue-200 text-sm">Ямар ч төлбөргүй</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Clock size={24} />
              </div>
              <div>
                <div className="font-bold">24 цаг</div>
                <div className="text-blue-200 text-sm">Хариу өгөх хугацаа</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Award size={24} />
              </div>
              <div>
                <div className="font-bold">Мэргэжлийн зөвлөгөө</div>
                <div className="text-blue-200 text-sm">Чанарын баталгаа</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Үнийн саналын хүсэлт</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Таны нэр *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="Б. Баярмагнай"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Байгууллагын нэр
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="XYZ ХХК"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    И-мэйл хаяг *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="name@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Утасны дугаар *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="9999-9999"
                  />
                </div>
              </div>
              
              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Бүтээгдэхүүний төрөл *
                  </label>
                  <select
                    name="productType"
                    value={formData.productType}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  >
                    <option value="">Сонгох</option>
                    {productTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тоо ширхэг
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Жишээ: 1000ш, 500хуудас"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Хүлээгдэж буй дуусах хугацаа
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                  />
                  <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
                </div>
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Төслийн дэлгэрэнгүй *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="5"
                  className="input-field"
                  placeholder="Төслийн талаар дэлгэрэнгүй бичнэ үү. Хэмжээ, материал, онцлог шинж чанарууд, нэмэлт шаардлагууд гэх мэт..."
                />
              </div>
              
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Файл хавсаргах
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto text-gray-400 mb-3" size={24} />
                  <p className="text-sm text-gray-600 mb-2">
                    Файл чирж энд хулганаар дарна уу эсвэл сонгох товчийг дарна уу
                  </p>
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Файл сонгох
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Дэмжих формат: PDF, JPG, PNG, AI, PSD (хамгийн ихдээ 10MB)
                  </p>
                </div>
                
                {/* Uploaded Files */}
                {formData.files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText size={18} className="text-gray-400" />
                          <div>
                            <div className="text-sm font-medium">{file.name}</div>
                            <div className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Устгах
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 rounded-lg font-semibold text-lg transition-colors ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                }`}
              >
                {isLoading ? 'Илгээж байна...' : 'Үнийн санал илгээх'}
              </button>
              
              <p className="text-sm text-gray-500 text-center">
                Таны мэдээллийг зөвхөн үнийн санал гаргах зорилгоор ашиглана
              </p>
            </form>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Холбоо барих</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">P</span>
                </div>
                <div>
                  <div className="font-medium">PRINT SHOP</div>
                  <div className="text-sm text-gray-600">Хэвлэлийн төв</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone size={18} className="text-gray-400" />
                  <div>
                    <div className="font-medium">+976 7000-5060</div>
                    <div className="text-sm text-gray-500">Үндсэн утас</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail size={18} className="text-gray-400" />
                  <div>
                    <div className="font-medium">info@printshop.mn</div>
                    <div className="text-sm text-gray-500">И-мэйл</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock size={18} className="text-gray-400" />
                  <div>
                    <div className="font-medium">Даваа-Баасан 9:00-18:00</div>
                    <div className="text-sm text-gray-500">Ажлын цаг</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Process */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Үнийн санал авах процесс</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                  1
                </div>
                <div>
                  <div className="font-medium">Хүсэлт илгээх</div>
                  <div className="text-sm text-gray-600">Энэ маягтаар хүсэлтээ илгээнэ</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                  2
                </div>
                <div>
                  <div className="font-medium">Мэргэжлийн зөвлөгөө</div>
                  <div className="text-sm text-gray-600">Бид таны төсөлд дэмжлэг үзүүлнэ</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                  3
                </div>
                <div>
                  <div className="font-medium">Үнийн санал</div>
                  <div className="text-sm text-gray-600">Найдвартай үнийн санал гаргана</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                  4
                </div>
                <div>
                  <div className="font-medium">Хэвлэл эхлэх</div>
                  <div className="text-sm text-gray-600">Баталгаажуулалт хийгдсэнээр ажил эхлэнэ</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Popular Services */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-sm p-6 mt-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Түгээмэл үйлчилгээ</h3>
            <div className="space-y-3">
              {['Нэрийн хуудас', 'Бизнес карт', 'Флаер', 'Баннер', 'Шошго'].map((service, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-white/20">
                  <span>{service}</span>
                  <span className="text-blue-200">Эхлэх үнэ 45,000₮</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationPage;