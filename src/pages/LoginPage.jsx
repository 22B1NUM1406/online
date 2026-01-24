import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, Lock, Eye, EyeOff, User, Smartphone,
  Facebook, Github, Chrome
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError('И-мэйл эсвэл нууц үг буруу байна');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError('Google нэвтрэлт амжилтгүй боллоо');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl font-bold">P</span>
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-gray-900">PRINT SHOP</div>
              <div className="text-sm text-gray-500">Хэвлэлийн төв</div>
            </div>
          </Link>
        </div>
        
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Нэвтрэх</h2>
          <p className="text-gray-600 mb-8">
            Та өөрийн бүртгэлтэй хэрэглэгчийн мэдээллээр нэвтэрнэ үү
          </p>
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-red-700 text-sm">{error}</div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                И-мэйл хаяг
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="name@example.com"
                />
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Нууц үг
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                  Нууц үгээ мартсан уу?
                </Link>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-lg font-semibold transition-colors ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
            </button>
          </form>
          
          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <div className="px-4 text-sm text-gray-500">Эсвэл</div>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          
          {/* Social Login */}
          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Chrome size={20} className="text-red-500" />
              <span className="font-medium">Google-ээр нэвтрэх</span>
            </button>
            
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Facebook size={20} />
                <span className="font-medium">Facebook</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors">
                <Github size={20} />
                <span className="font-medium">GitHub</span>
              </button>
            </div>
          </div>
          
          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Бүртгэлгүй юу?{' '}
              <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-800">
                Шинээр бүртгүүлэх
              </Link>
            </p>
          </div>
        </div>
        
        {/* Footer Links */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Нэвтрэхдээ та{' '}
            <Link to="/terms" className="text-blue-600 hover:text-blue-800">
              Үйлчилгээний нөхцөл
            </Link>{' '}
            болон{' '}
            <Link to="/privacy" className="text-blue-600 hover:text-blue-800">
              Нууцлалын бодлого
            </Link>
            -ыг зөвшөөрч байна
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;