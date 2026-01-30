import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, Package, ShoppingCart, MessageSquare, DollarSign, 
  Plus, Edit, Trash2, Search, Upload, Mail, CheckCircle, XCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {getAllOrders, updateOrderStatus, deleteOrder, getAllQuotations, replyToQuotation,
  updateQuotationStatus, deleteQuotation, createProduct, updateProduct, deleteProduct, getProducts,
  getAllContactMessages, updateContactMessageStatus, replyToContactMessage, deleteContactMessage,
  getAllCategoriesFlat, createCategory, updateCategory, deleteCategory,
  getAllBlogs, createBlog, updateBlog, deleteBlog,
  getAllMarketingServices, createMarketingService, updateMarketingService, deleteMarketingService,
  getDashboardStats
} from '../services/api';
import { formatPrice, formatDate, getOrderStatusLabel, getOrderStatusColor, getImageUrl } from '../utils/helpers';
import Loading from '../components/Loading';
import Notification from '../components/Notification';
import DashboardTab from '../components/DashboardTab';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Dashboard stats
  const [dashboardStats, setDashboardStats] = useState(null);
  
  // Data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [marketingServices, setMarketingServices] = useState([]);
  
  // Form states
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    material: '',
    size: '',
    format: '',
    stock: '',
    image: ''
  });
  
  // Category form states
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    parent: '',
    icon: 'Package',
    order: 0
  });
  
  // Blog form states
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'other',
    tags: '',
    status: 'published',
    featured: false
  });
  
  // Marketing Service form states
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    shortDescription: '',
    features: '',
    price: '',
    category: 'other',
    icon: 'TrendingUp',
    featured: false
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadData();
  }, [activeTab, isAdmin]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load dashboard stats
      if (!dashboardStats) {
        const statsData = await getDashboardStats().catch(() => null);
        if (statsData) {
          setDashboardStats(statsData.data);
        }
      }
      
      // Always load data for stats
      const [ordersData, quotationsData, messagesData] = await Promise.all([
        getAllOrders().catch(() => ({ data: [] })),
        getAllQuotations().catch(() => ({ data: [] })),
        getAllContactMessages().catch(() => ({ data: [] }))
      ]);
      
      setOrders(ordersData.data);
      setQuotations(quotationsData.data);
      setContactMessages(messagesData.data);
      
      // Load tab-specific data
      if (activeTab === 'products') {
        const data = await getProducts();
        setProducts(data.data);
        // Load categories for product form
        const catData = await getAllCategoriesFlat();
        setCategories(catData.data);
      } else if (activeTab === 'categories') {
        const data = await getAllCategoriesFlat();
        setCategories(data.data);
      } else if (activeTab === 'blogs') {
        const data = await getAllBlogs();
        setBlogs(data.data);
      } else if (activeTab === 'services') {
        const data = await getAllMarketingServices();
        setMarketingServices(data.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      submitData.append('name', productForm.name);
      submitData.append('price', productForm.price);
      submitData.append('category', productForm.category);
      submitData.append('description', productForm.description);
      submitData.append('material', productForm.material);
      submitData.append('size', productForm.size);
      submitData.append('format', productForm.format);
      submitData.append('stock', productForm.stock);
      
      if (selectedImage) {
        submitData.append('image', selectedImage);
      } else if (productForm.image) {
        submitData.append('image', productForm.image);
      }

      if (editingProduct) {
        await updateProduct(editingProduct._id, submitData);
        setNotification({ message: 'Бүтээгдэхүүн шинэчлэгдлээ', type: 'success' });
      } else {
        await createProduct(submitData);
        setNotification({ message: 'Бүтээгдэхүүн нэмэгдлээ', type: 'success' });
      }
      
      setShowProductForm(false);
      setEditingProduct(null);
      setSelectedImage(null);
      setImagePreview(null);
      setProductForm({ 
        name: '', price: '', category: 'cards', description: '', 
        material: '', size: '', format: '', stock: '', image: '' 
      });
      loadData();
    } catch (error) {
      setNotification({ message: 'Алдаа гарлаа', type: 'error' });
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Бүтээгдэхүүн устгах уу?')) {
      try {
        await deleteProduct(id);
        setNotification({ message: 'Бүтээгдэхүүн устгагдлаа', type: 'success' });
        loadData();
      } catch (error) {
        setNotification({ message: 'Алдаа гарлаа', type: 'error' });
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      category: typeof product.category === 'object' ? product.category._id : product.category,
      description: product.description || '',
      material: product.material || '',
      size: product.size || '',
      format: product.format || '',
      stock: product.stock || '',
      image: product.image || ''
    });
    setImagePreview(product.image || null);
    setSelectedImage(null);
    setShowProductForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setNotification({ message: 'Статус шинэчлэгдлээ', type: 'success' });
      loadData();
    } catch (error) {
      setNotification({ message: 'Алдаа гарлаа', type: 'error' });
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Захиалга устгах уу?')) {
      try {
        await deleteOrder(orderId);
        setNotification({ message: 'Захиалга устгагдлаа', type: 'success' });
        loadData();
      } catch (error) {
        setNotification({ message: 'Алдаа гарлаа', type: 'error' });
      }
    }
  };

  const handleDeleteQuotation = async (quotationId) => {
    if (window.confirm('Үнийн санал устгах уу?')) {
      try {
        await deleteQuotation(quotationId);
        setNotification({ message: 'Үнийн санал устгагдлаа', type: 'success' });
        loadData();
      } catch (error) {
        setNotification({ message: 'Алдаа гарлаа', type: 'error' });
      }
    }
  };

  const handleMessageStatusUpdate = async (messageId, status) => {
    try {
      await updateContactMessageStatus(messageId, status);
      setNotification({ message: 'Статус шинэчлэгдлээ', type: 'success' });
      loadData();
    } catch (error) {
      setNotification({ message: 'Алдаа гарлаа', type: 'error' });
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm('Мессеж устгах уу?')) {
      try {
        await deleteContactMessage(messageId);
        setNotification({ message: 'Мессеж устгагдлаа', type: 'success' });
        loadData();
      } catch (error) {
        setNotification({ message: 'Алдаа гарлаа', type: 'error' });
      }
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, categoryForm);
        setNotification({ message: 'Ангилал шинэчлэгдлээ', type: 'success' });
      } else {
        await createCategory(categoryForm);
        setNotification({ message: 'Ангилал нэмэгдлээ', type: 'success' });
      }
      setShowCategoryForm(false);
      setEditingCategory(null);
      setCategoryForm({ name: '', description: '', parent: '', icon: 'Package', order: 0 });
      loadData();
    } catch (error) {
      setNotification({ message: error.response?.data?.message || 'Алдаа гарлаа', type: 'error' });
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      parent: category.parent?._id || '',
      icon: category.icon || 'Package',
      order: category.order || 0
    });
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Ангилал устгах уу?')) {
      try {
        await deleteCategory(categoryId);
        setNotification({ message: 'Ангилал устгагдлаа', type: 'success' });
        loadData();
      } catch (error) {
        setNotification({ message: error.response?.data?.message || 'Алдаа гарлаа', type: 'error' });
      }
    }
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    try {
      // Tags string to array
      const blogData = {
        ...blogForm,
        tags: blogForm.tags ? blogForm.tags.split(',').map(t => t.trim()) : []
      };

      if (editingBlog) {
        await updateBlog(editingBlog._id, blogData);
        setNotification({ message: 'Блог шинэчлэгдлээ', type: 'success' });
      } else {
        await createBlog(blogData);
        setNotification({ message: 'Блог нэмэгдлээ', type: 'success' });
      }
      setShowBlogForm(false);
      setEditingBlog(null);
      setBlogForm({ title: '', excerpt: '', content: '', category: 'other', tags: '', status: 'published', featured: false });
      loadData();
    } catch (error) {
      setNotification({ message: error.response?.data?.message || 'Алдаа гарлаа', type: 'error' });
    }
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title,
      excerpt: blog.excerpt || '',
      content: blog.content,
      category: blog.category,
      tags: blog.tags ? blog.tags.join(', ') : '',
      status: blog.status,
      featured: blog.featured || false
    });
    setShowBlogForm(true);
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm('Блог устгах уу?')) {
      try {
        await deleteBlog(blogId);
        setNotification({ message: 'Блог устгагдлаа', type: 'success' });
        loadData();
      } catch (error) {
        setNotification({ message: error.response?.data?.message || 'Алдаа гарлаа', type: 'error' });
      }
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      // Features string to array
      const serviceData = {
        ...serviceForm,
        features: serviceForm.features ? serviceForm.features.split('\n').map(f => f.trim()).filter(f => f) : []
      };

      if (editingService) {
        await updateMarketingService(editingService._id, serviceData);
        setNotification({ message: 'Үйлчилгээ шинэчлэгдлээ', type: 'success' });
      } else {
        await createMarketingService(serviceData);
        setNotification({ message: 'Үйлчилгээ нэмэгдлээ', type: 'success' });
      }
      setShowServiceForm(false);
      setEditingService(null);
      setServiceForm({ name: '', description: '', shortDescription: '', features: '', price: '', category: 'other', icon: 'TrendingUp', featured: false });
      loadData();
    } catch (error) {
      setNotification({ message: error.response?.data?.message || 'Алдаа гарлаа', type: 'error' });
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      description: service.description,
      shortDescription: service.shortDescription || '',
      features: service.features ? service.features.join('\n') : '',
      price: service.price || '',
      category: service.category,
      icon: service.icon || 'TrendingUp',
      featured: service.featured || false
    });
    setShowServiceForm(true);
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Үйлчилгээ устгах уу?')) {
      try {
        await deleteMarketingService(serviceId);
        setNotification({ message: 'Үйлчилгээ устгагдлаа', type: 'success' });
        loadData();
      } catch (error) {
        setNotification({ message: error.response?.data?.message || 'Алдаа гарлаа', type: 'error' });
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const stats = [
  
    { label: 'Захиалга', value: orders.length, icon: ShoppingCart, color: 'bg-blue-500' },
    { label: 'Бүтээгдэхүүн', value: products.length, icon: Package, color: 'bg-purple-500' },
    { 
      label: 'Үнийн санал', 
      value: quotations.length, 
      icon: MessageSquare, 
      color: 'bg-orange-500',
      badge: quotations.filter(q => q.status === 'pending').length > 0,
      badgeText: `${quotations.filter(q => q.status === 'pending').length} шинэ`
    },
    { 
      label: 'Мессеж', 
      value: contactMessages.length, 
      icon: Mail, 
      color: 'bg-pink-500',
      badge: contactMessages.filter(m => m.status === 'new').length > 0,
      badgeText: `${contactMessages.filter(m => m.status === 'new').length} шинэ`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {notification && (
        <Notification 
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Админ Самбар</h1>
              <p className="text-sm text-gray-600">Тавтай морил, {user?.name}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              <LogOut size={18} />
              Гарах
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  {stat.badge && (
                    <span className="inline-block mt-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                      {stat.badgeText || `Шинэ ${stat.value}`}
                    </span>
                  )}
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <stat.icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="border-b">
            <div className="flex gap-4 px-6 py-3 overflow-x-auto">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                📊 Самбар
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'products'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                Бүтээгдэхүүн
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'orders'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                Захиалга
              </button>
              <button
                onClick={() => setActiveTab('quotations')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'quotations'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                Үнийн санал
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'messages'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                Мессеж
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'categories'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                Ангилал
              </button>
              <button
                onClick={() => setActiveTab('blogs')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'blogs'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                Блог
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'services'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                Үйлчилгээ
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <DashboardTab onTabChange={setActiveTab} />
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Бүтээгдэхүүн удирдах</h2>
                  <button
                    onClick={() => setShowProductForm(!showProductForm)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Plus size={20} />
                    Бүтээгдэхүүн нэмэх
                  </button>
                </div>

                {showProductForm && (
                  <div className="mb-6 p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-bold mb-4">
                      {editingProduct ? 'Бүтээгдэхүүн засах' : 'Шинэ бүтээгдэхүүн'}
                    </h3>
                    <form onSubmit={handleProductSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Нэр <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Бүтээгдэхүүний нэр"
                            value={productForm.name}
                            onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        {/* Price */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Үнэ (₮) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            placeholder="50000"
                            value={productForm.price}
                            onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        {/* Category */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ангилал <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={productForm.category}
                            onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Ангилал сонгох...</option>
                            {categories.filter(c => !c.parent).map(cat => (
                              <optgroup key={cat._id} label={cat.name}>
                                <option value={cat._id}>{cat.name}</option>
                                {categories.filter(sub => sub.parent?._id === cat._id).map(sub => (
                                  <option key={sub._id} value={sub._id}>
                                    └─ {sub.name}
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                        </div>

                        {/* Size */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Хэмжээ
                          </label>
                          <input
                            type="text"
                            value={productForm.size}
                            onChange={(e) => setProductForm({...productForm, size: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Жишээ: A4, 85x54mm, 210x297mm"
                          />
                        </div>

                        {/* Material */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Материал
                          </label>
                          <input
                            type="text"
                            value={productForm.material}
                            onChange={(e) => setProductForm({...productForm, material: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Жишээ: 300gsm цаас, vinyl, PVC"
                          />
                        </div>

                        {/* Stock */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Нөөц
                          </label>
                          <input
                            type="number"
                            placeholder="1000"
                            value={productForm.stock}
                            onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Тайлбар
                        </label>
                        <textarea
                          placeholder="Бүтээгдэхүүний дэлгэрэнгүй тайлбар..."
                          value={productForm.description}
                          onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="3"
                        />
                      </div>

                      {/* Image Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Зураг
                        </label>
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
                              onChange={handleImageChange}
                              className="hidden"
                              id="productImage"
                            />
                            <label 
                              htmlFor="productImage"
                              className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer"
                            >
                              <Upload size={20} className="text-gray-400" />
                              <span className="text-gray-600">
                                {selectedImage ? selectedImage.name : 'Зураг сонгох'}
                              </span>
                            </label>
                          </div>
                          {imagePreview && (
                            <div className="w-24 h-24 border rounded-lg overflow-hidden">
                              <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
                        >
                          {editingProduct ? 'Шинэчлэх' : 'Нэмэх'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowProductForm(false);
                            setEditingProduct(null);
                            setSelectedImage(null);
                            setImagePreview(null);
                          }}
                          className="px-8 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 font-medium"
                        >
                          Болих
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {loading ? (
                  <Loading />
                ) : (
                  <div className="space-y-3">
                    {products.map(product => (
                      <div key={product._id} className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <img 
                          src={getImageUrl(product.image)} 
                          alt={product.name} 
                          className="w-20 h-20 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = '/placeholder.png';
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{product.name}</h4>
                          <p className="text-lg font-bold text-blue-600">{formatPrice(product.price)}</p>
                          <p className="text-sm text-gray-600">
                            {typeof product.category === 'object' ? product.category?.name : product.category}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Захиалга удирдах</h2>
                {loading ? (
                  <Loading />
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">Захиалга байхгүй байна</div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order._id} className="border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex-1">
                            <div className="font-bold">Захиалга #{order._id.slice(-6)}</div>
                            <div className="text-sm text-gray-600">{order.shippingInfo.name} - {order.shippingInfo.phone}</div>
                            <div className="text-xs text-gray-500">{formatDate(order.createdAt)}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              className="px-4 py-2 border rounded-lg font-medium"
                            >
                              <option value="pending">Хүлээгдэж буй</option>
                              <option value="paid">Төлөгдсөн</option>
                              <option value="processing">Үйлдвэрлэлд</option>
                              <option value="completed">Дууссан</option>
                              <option value="cancelled">Цуцлагдсан</option>
                            </select>
                            <button
                              onClick={() => handleDeleteOrder(order._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Устгах"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-bold text-blue-600">{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Quotations Tab */}
            {activeTab === 'quotations' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Үнийн санал удирдах</h2>
                {loading ? (
                  <Loading />
                ) : quotations.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">Үнийн санал байхгүй байна</div>
                ) : (
                  <div className="space-y-4">
                    {quotations.map(quotation => (
                      <div key={quotation._id} className="border rounded-lg p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="font-bold mb-1">{quotation.name}</div>
                            <div className="text-sm text-gray-600 mb-2">{quotation.phone} - {quotation.email}</div>
                            <div className="text-sm text-gray-700 mb-2">
                              <span className="font-medium">Төрөл:</span> {quotation.productType}
                            </div>
                            <div className="text-sm text-gray-600 mb-3">{quotation.description}</div>
                            
                            {quotation.designFile && (
                              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                <div className="text-sm font-medium text-blue-800 mb-1">Дизайн файл:</div>
                                <a 
                                  href={`http://localhost:5000${quotation.designFile.fileUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline"
                                >
                                  📎 {quotation.designFile.fileName}
                                </a>
                              </div>
                            )}
                            
                            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-3 ${
                              quotation.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {quotation.status === 'pending' ? 'Хүлээгдэж буй' : 'Хариулсан'}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteQuotation(quotation._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Устгах"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Холбоо барих мессежүүд</h2>
                
                {loading ? (
                  <Loading />
                ) : contactMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <Mail size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Мессеж байхгүй байна</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contactMessages.map((message) => (
                      <div key={message._id} className="border rounded-lg p-6 bg-white">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-bold text-lg">{message.name}</span>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                message.status === 'new' ? 'bg-blue-100 text-blue-700' :
                                message.status === 'read' ? 'bg-gray-100 text-gray-700' :
                                message.status === 'replied' ? 'bg-green-100 text-green-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {message.status === 'new' ? 'Шинэ' :
                                 message.status === 'read' ? 'Уншсан' :
                                 message.status === 'replied' ? 'Хариулсан' : 'Архивласан'}
                              </span>
                            </div>
                            
                            <div className="text-sm text-gray-600 mb-2">{message.email}</div>
                            <div className="text-sm font-medium text-gray-800 mb-2">
                              Гарчиг: {message.subject}
                            </div>
                            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg mb-3">
                              {message.message}
                            </div>
                            
                            {message.adminReply && (
                              <div className="mt-3 p-3 bg-green-50 border-l-4 border-green-500 rounded">
                                <div className="text-sm font-medium text-green-800 mb-1">Админ хариу:</div>
                                <div className="text-sm text-gray-700">{message.adminReply.message}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {formatDate(message.adminReply.repliedAt)}
                                </div>
                              </div>
                            )}
                            
                            <div className="text-xs text-gray-500 mt-3">
                              {formatDate(message.createdAt)}
                            </div>
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            {message.status === 'new' && (
                              <button
                                onClick={() => handleMessageStatusUpdate(message._id, 'read')}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                title="Уншсан болгох"
                              >
                                <CheckCircle size={20} />
                              </button>
                            )}
                            {message.status !== 'archived' && (
                              <button
                                onClick={() => handleMessageStatusUpdate(message._id, 'archived')}
                                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                                title="Архивлах"
                              >
                                <XCircle size={20} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteMessage(message._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Устгах"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Ангилал удирдах</h2>
                  <button
                    onClick={() => {
                      setShowCategoryForm(!showCategoryForm);
                      if (!showCategoryForm) {
                        setEditingCategory(null);
                        setCategoryForm({ name: '', description: '', parent: '', icon: 'Package', order: 0 });
                      }
                    }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Plus size={20} />
                    {showCategoryForm ? 'Хаах' : 'Ангилал нэмэх'}
                  </button>
                </div>

                {/* Category Form */}
                {showCategoryForm && (
                  <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h3 className="text-lg font-bold mb-4">
                      {editingCategory ? 'Ангилал засах' : 'Шинэ ангилал'}
                    </h3>
                    <form onSubmit={handleCategorySubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Нэр <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={categoryForm.name}
                            onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ангиллын нэр"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Үндсэн ангилал
                          </label>
                          <select
                            value={categoryForm.parent}
                            onChange={(e) => setCategoryForm({...categoryForm, parent: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">-- Үндсэн ангилал --</option>
                            {categories.filter(c => !c.parent).map(cat => (
                              <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Icon
                          </label>
                          <input
                            type="text"
                            value={categoryForm.icon}
                            onChange={(e) => setCategoryForm({...categoryForm, icon: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Package"
                          />
                          <p className="text-xs text-gray-500 mt-1">lucide-react icon name</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Дараалал
                          </label>
                          <input
                            type="number"
                            value={categoryForm.order}
                            onChange={(e) => setCategoryForm({...categoryForm, order: parseInt(e.target.value)})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Тайлбар
                        </label>
                        <textarea
                          rows="3"
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ангиллын тайлбар"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
                        >
                          {editingCategory ? 'Шинэчлэх' : 'Нэмэх'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCategoryForm(false);
                            setEditingCategory(null);
                            setCategoryForm({ name: '', description: '', parent: '', icon: 'Package', order: 0 });
                          }}
                          className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-medium"
                        >
                          Цуцлах
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Categories List */}
                {loading ? (
                  <Loading />
                ) : categories.length === 0 ? (
                  <div className="text-center py-12">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Ангилал байхгүй байна</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Үндсэн ангилалууд */}
                    {categories.filter(c => !c.parent).map((category) => (
                      <div key={category._id}>
                        {/* Main Category */}
                        <div className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
                          <div className="flex-1">
                            <h4 className="font-bold text-lg">{category.name}</h4>
                            {category.description && (
                              <p className="text-sm text-gray-600">{category.description}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              Icon: {category.icon} | Order: {category.order}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        {/* Дэд ангилалууд */}
                        {categories.filter(sub => sub.parent?._id === category._id).length > 0 && (
                          <div className="ml-8 mt-2 space-y-2">
                            {categories.filter(sub => sub.parent?._id === category._id).map(subcategory => (
                              <div key={subcategory._id} className="flex items-center gap-4 p-3 border border-l-4 border-l-blue-500 rounded-lg bg-blue-50">
                                <div className="flex-1">
                                  <h5 className="font-semibold">{subcategory.name}</h5>
                                  {subcategory.description && (
                                    <p className="text-xs text-gray-600">{subcategory.description}</p>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditCategory(subcategory)}
                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCategory(subcategory._id)}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Blogs Tab */}
            {activeTab === 'blogs' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Блог удирдах</h2>
                  <button
                    onClick={() => {
                      setShowBlogForm(!showBlogForm);
                      if (!showBlogForm) {
                        setEditingBlog(null);
                        setBlogForm({ title: '', excerpt: '', content: '', category: 'other', tags: '', status: 'published', featured: false });
                      }
                    }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Plus size={20} />
                    {showBlogForm ? 'Хаах' : 'Блог нэмэх'}
                  </button>
                </div>

                {/* Blog Form */}
                {showBlogForm && (
                  <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h3 className="text-lg font-bold mb-4">
                      {editingBlog ? 'Блог засах' : 'Шинэ блог'}
                    </h3>
                    <form onSubmit={handleBlogSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Гарчиг <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={blogForm.title}
                          onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Блогийн гарчиг"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Товч агуулга
                        </label>
                        <textarea
                          rows="2"
                          value={blogForm.excerpt}
                          onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Блогийн товч агуулга (max 500 тэмдэгт)"
                          maxLength="500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Агуулга <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows="10"
                          required
                          value={blogForm.content}
                          onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Блогийн үндсэн агуулга"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ангилал
                          </label>
                          <select
                            value={blogForm.category}
                            onChange={(e) => setBlogForm({...blogForm, category: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="other">Бусад</option>
                            <option value="news">Мэдээ</option>
                            <option value="tutorial">Заавар</option>
                            <option value="tips">Зөвлөмж</option>
                            <option value="case-study">Туршилт</option>
                            <option value="announcement">Мэдэгдэл</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Статус
                          </label>
                          <select
                            value={blogForm.status}
                            onChange={(e) => setBlogForm({...blogForm, status: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="draft">Ноорог</option>
                            <option value="published">Нийтлэгдсэн</option>
                            <option value="archived">Архивласан</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tags (таслалаар тусгаарлах)
                        </label>
                        <input
                          type="text"
                          value={blogForm.tags}
                          onChange={(e) => setBlogForm({...blogForm, tags: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="хэвлэл, дизайн, маркетинг"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={blogForm.featured}
                          onChange={(e) => setBlogForm({...blogForm, featured: e.target.checked})}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                          Онцлох блог
                        </label>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
                        >
                          {editingBlog ? 'Шинэчлэх' : 'Нэмэх'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowBlogForm(false);
                            setEditingBlog(null);
                            setBlogForm({ title: '', excerpt: '', content: '', category: 'other', tags: '', status: 'published', featured: false });
                          }}
                          className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-medium"
                        >
                          Цуцлах
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Blogs List */}
                {loading ? (
                  <Loading />
                ) : blogs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <p className="text-gray-600">Блог байхгүй байна</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {blogs.map((blog) => (
                      <div key={blog._id} className="border rounded-lg p-6 bg-white">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-bold text-lg">{blog.title}</h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                blog.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                                blog.status === 'published' ? 'bg-green-100 text-green-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {blog.status === 'draft' ? 'Ноорог' :
                                 blog.status === 'published' ? 'Нийтлэгдсэн' : 'Архивласан'}
                              </span>
                              {blog.featured && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
                                  Онцлох
                                </span>
                              )}
                            </div>
                            
                            {blog.excerpt && (
                              <p className="text-sm text-gray-600 mb-2">{blog.excerpt}</p>
                            )}
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Ангилал: {
                                blog.category === 'news' ? 'Мэдээ' :
                                blog.category === 'tutorial' ? 'Заавар' :
                                blog.category === 'tips' ? 'Зөвлөмж' :
                                blog.category === 'case-study' ? 'Туршилт' :
                                blog.category === 'announcement' ? 'Мэдэгдэл' : 'Бусад'
                              }</span>
                              <span>Үзсэн: {blog.views}</span>
                              {blog.tags && blog.tags.length > 0 && (
                                <span>Tags: {blog.tags.join(', ')}</span>
                              )}
                            </div>
                            
                            <div className="text-xs text-gray-500 mt-2">
                              {formatDate(blog.createdAt)}
                            </div>
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleEditBlog(blog)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteBlog(blog._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Marketing Services Tab */}
            {activeTab === 'services' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Маркетингийн үйлчилгээ удирдах</h2>
                  <button
                    onClick={() => {
                      setShowServiceForm(!showServiceForm);
                      if (!showServiceForm) {
                        setEditingService(null);
                        setServiceForm({ name: '', description: '', shortDescription: '', features: '', price: '', category: 'other', icon: 'TrendingUp', featured: false });
                      }
                    }}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                  >
                    <Plus size={20} />
                    {showServiceForm ? 'Хаах' : 'Үйлчилгээ нэмэх'}
                  </button>
                </div>

                {/* Service Form */}
                {showServiceForm && (
                  <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h3 className="text-lg font-bold mb-4">
                      {editingService ? 'Үйлчилгээ засах' : 'Шинэ үйлчилгээ'}
                    </h3>
                    <form onSubmit={handleServiceSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Нэр <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={serviceForm.name}
                          onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Үйлчилгээний нэр"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Товч тайлбар
                        </label>
                        <textarea
                          rows="2"
                          value={serviceForm.shortDescription}
                          onChange={(e) => setServiceForm({...serviceForm, shortDescription: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Товч тайлбар (max 200 тэмдэгт)"
                          maxLength="200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Дэлгэрэнгүй тайлбар <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows="5"
                          required
                          value={serviceForm.description}
                          onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Үйлчилгээний дэлгэрэнгүй тайлбар"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Онцлогууд (мөр бүрд нэг онцлог)
                        </label>
                        <textarea
                          rows="5"
                          value={serviceForm.features}
                          onChange={(e) => setServiceForm({...serviceForm, features: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Facebook/Instagram удирдлага
Контент үүсгэлт (10 пост/сар)
Сарын тайлан
24/7 дэмжлэг"
                        />
                        <p className="text-xs text-gray-500 mt-1">Мөр бүр нэг онцлог болно</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Үнэ
                          </label>
                          <input
                            type="text"
                            value={serviceForm.price}
                            onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="50,000₮/сар эсвэл Хэлэлцэнэ"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ангилал
                          </label>
                          <select
                            value={serviceForm.category}
                            onChange={(e) => setServiceForm({...serviceForm, category: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="other">Бусад</option>
                            <option value="social-media">Сошиал медиа</option>
                            <option value="seo">SEO</option>
                            <option value="content">Контент</option>
                            <option value="advertising">Сурталчилгаа</option>
                            <option value="branding">Брэндинг</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Icon
                        </label>
                        <input
                          type="text"
                          value={serviceForm.icon}
                          onChange={(e) => setServiceForm({...serviceForm, icon: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="TrendingUp"
                        />
                        <p className="text-xs text-gray-500 mt-1">lucide-react icon name</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="serviceFeatured"
                          checked={serviceForm.featured}
                          onChange={(e) => setServiceForm({...serviceForm, featured: e.target.checked})}
                          className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                        />
                        <label htmlFor="serviceFeatured" className="text-sm font-medium text-gray-700">
                          Онцлох үйлчилгээ
                        </label>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-medium"
                        >
                          {editingService ? 'Шинэчлэх' : 'Нэмэх'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowServiceForm(false);
                            setEditingService(null);
                            setServiceForm({ name: '', description: '', shortDescription: '', features: '', price: '', category: 'other', icon: 'TrendingUp', featured: false });
                          }}
                          className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-medium"
                        >
                          Цуцлах
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Services List */}
                {loading ? (
                  <Loading />
                ) : marketingServices.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-gray-600">Үйлчилгээ байхгүй байна</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {marketingServices.map((service) => (
                      <div key={service._id} className="border rounded-lg p-6 bg-white">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-bold text-lg">{service.name}</h4>
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                {service.category === 'social-media' ? 'Сошиал медиа' :
                                 service.category === 'seo' ? 'SEO' :
                                 service.category === 'content' ? 'Контент' :
                                 service.category === 'advertising' ? 'Сурталчилгаа' :
                                 service.category === 'branding' ? 'Брэндинг' : 'Бусад'}
                              </span>
                              {service.featured && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
                                  Онцлох
                                </span>
                              )}
                            </div>
                            
                            {service.shortDescription && (
                              <p className="text-sm text-gray-600 mb-2">{service.shortDescription}</p>
                            )}
                            
                            {service.features && service.features.length > 0 && (
                              <div className="text-xs text-gray-500 mb-2">
                                Онцлог: {service.features.length} ширхэг
                              </div>
                            )}
                            
                            {service.price && (
                              <div className="text-sm font-semibold text-purple-600 mb-2">
                                Үнэ: {service.price}
                              </div>
                            )}
                            
                            <div className="text-xs text-gray-500">
                              {formatDate(service.createdAt)}
                            </div>
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleEditService(service)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteService(service._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;