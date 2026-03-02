import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Check if user is admin
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          setError('Та админ эрхтэй хэрэглэгч биш байна');
          setLoading(false);
        }
      } else {
        setError(result.message || 'Нэвтрэх нэр эсвэл нууц үг буруу байна');
        setLoading(false);
      }
    } catch (err) {
      setError('Алдаа гарлаа. Дахин оролдоно уу.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 opacity-20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-md w-full">
        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 md:p-10">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 opacity-30 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-blue-500 to-cyan-500 w-20 h-20 rounded-full flex items-center justify-center shadow-2xl">
                <ShieldCheck className="text-white" size={40} />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
              Admin Panel
            </h1>
            <p className="text-blue-200 text-sm">
              Зөвхөн админ эрхтэй хэрэглэгчид нэвтрэнэ
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-start gap-3">
              <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-blue-100 mb-2">
                Имэйл хаяг
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="text-blue-300" size={20} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-blue-100 mb-2">
                Нууц үг
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="text-blue-300" size={20} />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Нэвтэрч байна...
                </span>
              ) : (
                'Нэвтрэх'
              )}
            </button>
          </form>

          {/* Back to Main Site */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <a
              href="/"
              className="block text-center text-blue-200 hover:text-white transition-colors text-sm"
            >
              ← Үндсэн сайт руу буцах
            </a>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-blue-300 text-sm flex items-center justify-center gap-2">
            <Lock size={16} />
            Аюулгүй холболт
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;