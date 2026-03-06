import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, Package, ShoppingCart, MessageSquare,
  Plus, Edit, Trash2, Upload, Mail, CheckCircle, XCircle, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getAllOrders, updateOrderStatus, deleteOrder, getAllQuotations,
  updateQuotationStatus, deleteQuotation, createProduct, updateProduct, deleteProduct, getProducts,
  getAllContactMessages, updateContactMessageStatus, deleteContactMessage,
  getAllCategoriesFlat, createCategory, updateCategory, deleteCategory,
  getAllBlogs, createBlog, updateBlog, deleteBlog,
  getAllMarketingServices, createMarketingService, updateMarketingService, deleteMarketingService,
  getDashboardStats
} from '../services/api';
import { formatPrice, formatDate, getImageUrl } from '../utils/helpers';
import Loading from '../components/Loading';
import Notification from '../components/Notification';
import DashboardTab from '../components/DashboardTab';
import EnhancedTextarea from '../components/EnhancedTextarea';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [marketingServices, setMarketingServices] = useState([]);

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', price: '', category: '', description: '',
    material: '', size: '', format: '', stock: '', image: '',
    featured: false, discount: '', oldPrice: ''
  });

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', parent: '', icon: 'Package', order: 0 });

  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({ title: '', excerpt: '', content: '', category: 'other', tags: '', status: 'published', featured: false });
  const [blogImage, setBlogImage] = useState(null);
  const [blogImagePreview, setBlogImagePreview] = useState('');

  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({ name: '', description: '', shortDescription: '', features: '', price: '', category: 'other', icon: 'TrendingUp', featured: false });
  const [serviceImage, setServiceImage] = useState(null);
  const [serviceImagePreview, setServiceImagePreview] = useState('');

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return; }
    loadTabData(activeTab);
  }, [activeTab, isAdmin]);

  const loadTabData = async (tab) => {
    try {
      setLoading(true);
      if (tab === 'dashboard') {
        if (!dashboardStats) {
          const s = await getDashboardStats().catch(() => null);
          if (s) setDashboardStats(s.data);
        }
        const [o, q, m] = await Promise.all([
          getAllOrders().catch(() => ({ data: [] })),
          getAllQuotations().catch(() => ({ data: [] })),
          getAllContactMessages().catch(() => ({ data: [] })),
        ]);
        setOrders(o.data); setQuotations(q.data); setContactMessages(m.data);
      } else if (tab === 'products') {
        const [p, c] = await Promise.all([getProducts(), getAllCategoriesFlat()]);
        setProducts(p.data); setCategories(c.data);
      } else if (tab === 'orders') {
        const d = await getAllOrders(); setOrders(d.data);
      } else if (tab === 'quotations') {
        const d = await getAllQuotations(); setQuotations(d.data);
      } else if (tab === 'messages') {
        const d = await getAllContactMessages(); setContactMessages(d.data);
      } else if (tab === 'categories') {
        const d = await getAllCategoriesFlat(); setCategories(d.data);
      } else if (tab === 'blogs') {
        const d = await getAllBlogs(); setBlogs(d.data);
      } else if (tab === 'services') {
        const d = await getAllMarketingServices(); setMarketingServices(d.data);
      }
    } catch (e) { console.error('Load error:', e); }
    finally { setLoading(false); }
  };

  const loadData = () => loadTabData(activeTab);

  const stats = [
    { label: 'Захиалга', value: orders.length, icon: ShoppingCart, color: 'bg-blue-500' },
    { label: 'Бүтээгдэхүүн', value: products.length, icon: Package, color: 'bg-purple-500' },
    { label: 'Үнийн санал', value: quotations.length, icon: MessageSquare, color: 'bg-orange-500',
      badge: quotations.filter(q => q.status === 'pending').length > 0,
      badgeText: `${quotations.filter(q => q.status === 'pending').length} шинэ` },
    { label: 'Мессеж', value: contactMessages.length, icon: Mail, color: 'bg-pink-500',
      badge: contactMessages.filter(m => m.status === 'new').length > 0,
      badgeText: `${contactMessages.filter(m => m.status === 'new').length} шинэ` },
  ];

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      ['name','price','category','description','material','size','format','stock','featured'].forEach(k => fd.append(k, productForm[k]));
      if (productForm.discount) fd.append('discount', productForm.discount);
      if (productForm.oldPrice) fd.append('oldPrice', productForm.oldPrice);
      if (selectedImage) fd.append('image', selectedImage);
      else if (productForm.image) fd.append('image', productForm.image);
      if (editingProduct) { await updateProduct(editingProduct._id, fd); setNotification({ message: 'Бүтээгдэхүүн шинэчлэгдлээ', type: 'success' }); }
      else { await createProduct(fd); setNotification({ message: 'Бүтээгдэхүүн нэмэгдлээ', type: 'success' }); }
      setShowProductForm(false); setEditingProduct(null); setSelectedImage(null); setImagePreview(null);
      setProductForm({ name:'',price:'',category:'',description:'',material:'',size:'',format:'',stock:'',image:'',featured:false,discount:'',oldPrice:'' });
      loadData();
    } catch { setNotification({ message: 'Алдаа гарлаа', type: 'error' }); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Бүтээгдэхүүн устгах уу?')) return;
    try { await deleteProduct(id); setNotification({ message: 'Устгагдлаа', type: 'success' }); loadData(); }
    catch { setNotification({ message: 'Алдаа гарлаа', type: 'error' }); }
  };

  const handleEditProduct = (p) => {
    setEditingProduct(p);
    setProductForm({ name:p.name, price:p.price, category: typeof p.category==='object'?p.category._id:p.category,
      description:p.description||'', material:p.material||'', size:p.size||'', format:p.format||'',
      stock:p.stock||'', image:p.image||'', featured:p.featured||false, discount:p.discount||'', oldPrice:p.oldPrice||'' });
    setImagePreview(p.image||null); setSelectedImage(null); setShowProductForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setSelectedImage(file); const r = new FileReader(); r.onloadend = () => setImagePreview(r.result); r.readAsDataURL(file); }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try { await updateOrderStatus(id, status); setNotification({ message: 'Статус шинэчлэгдлээ', type: 'success' }); loadData(); }
    catch { setNotification({ message: 'Алдаа гарлаа', type: 'error' }); }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Захиалга устгах уу?')) return;
    try { await deleteOrder(id); setNotification({ message: 'Устгагдлаа', type: 'success' }); loadData(); }
    catch { setNotification({ message: 'Алдаа гарлаа', type: 'error' }); }
  };

  const handleDeleteQuotation = async (id) => {
    if (!window.confirm('Үнийн санал устгах уу?')) return;
    try { await deleteQuotation(id); setNotification({ message: 'Устгагдлаа', type: 'success' }); loadData(); }
    catch { setNotification({ message: 'Алдаа гарлаа', type: 'error' }); }
  };

  const handleMessageStatusUpdate = async (id, status) => {
    try { await updateContactMessageStatus(id, status); setNotification({ message: 'Статус шинэчлэгдлээ', type: 'success' }); loadData(); }
    catch { setNotification({ message: 'Алдаа гарлаа', type: 'error' }); }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Мессеж устгах уу?')) return;
    try { await deleteContactMessage(id); setNotification({ message: 'Устгагдлаа', type: 'success' }); loadData(); }
    catch { setNotification({ message: 'Алдаа гарлаа', type: 'error' }); }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) { await updateCategory(editingCategory._id, categoryForm); setNotification({ message: 'Ангилал шинэчлэгдлээ', type: 'success' }); }
      else { await createCategory(categoryForm); setNotification({ message: 'Ангилал нэмэгдлээ', type: 'success' }); }
      setShowCategoryForm(false); setEditingCategory(null); setCategoryForm({ name:'',description:'',parent:'',icon:'Package',order:0 }); loadData();
    } catch (e) { setNotification({ message: e.response?.data?.message || 'Алдаа гарлаа', type: 'error' }); }
  };

  const handleEditCategory = (c) => {
    setEditingCategory(c);
    setCategoryForm({ name:c.name, description:c.description||'', parent:c.parent?._id||'', icon:c.icon||'Package', order:c.order||0 });
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Ангилал устгах уу?')) return;
    try { await deleteCategory(id); setNotification({ message: 'Устгагдлаа', type: 'success' }); loadData(); }
    catch (e) { setNotification({ message: e.response?.data?.message || 'Алдаа гарлаа', type: 'error' }); }
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('title', blogForm.title); fd.append('excerpt', blogForm.excerpt); fd.append('content', blogForm.content);
      fd.append('category', blogForm.category); fd.append('tags', blogForm.tags ? blogForm.tags.split(',').map(t=>t.trim()).join(',') : '');
      fd.append('status', blogForm.status); fd.append('featured', blogForm.featured);
      if (blogImage) fd.append('file', blogImage);
      if (editingBlog) { await updateBlog(editingBlog._id, fd); setNotification({ message: 'Блог шинэчлэгдлээ', type: 'success' }); }
      else { await createBlog(fd); setNotification({ message: 'Блог нэмэгдлээ', type: 'success' }); }
      setShowBlogForm(false); setEditingBlog(null);
      setBlogForm({ title:'',excerpt:'',content:'',category:'other',tags:'',status:'published',featured:false });
      setBlogImage(null); setBlogImagePreview(''); loadData();
    } catch (e) { setNotification({ message: e.response?.data?.message || 'Алдаа гарлаа', type: 'error' }); }
  };

  const handleEditBlog = (b) => {
    setEditingBlog(b);
    setBlogForm({ title:b.title, excerpt:b.excerpt||'', content:b.content, category:b.category, tags:b.tags?b.tags.join(', '):'', status:b.status, featured:b.featured||false });
    if (b.image) setBlogImagePreview(b.image);
    setShowBlogForm(true);
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Блог устгах уу?')) return;
    try { await deleteBlog(id); setNotification({ message: 'Устгагдлаа', type: 'success' }); loadData(); }
    catch (e) { setNotification({ message: e.response?.data?.message || 'Алдаа гарлаа', type: 'error' }); }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('name', serviceForm.name); fd.append('description', serviceForm.description);
      fd.append('shortDescription', serviceForm.shortDescription);
      fd.append('features', serviceForm.features ? serviceForm.features.split('\n').map(f=>f.trim()).filter(f=>f).join('\n') : '');
      fd.append('price', serviceForm.price); fd.append('category', serviceForm.category);
      fd.append('icon', serviceForm.icon); fd.append('featured', serviceForm.featured);
      if (serviceImage) fd.append('file', serviceImage);
      if (editingService) { await updateMarketingService(editingService._id, fd); setNotification({ message: 'Үйлчилгээ шинэчлэгдлээ', type: 'success' }); }
      else { await createMarketingService(fd); setNotification({ message: 'Үйлчилгээ нэмэгдлээ', type: 'success' }); }
      setShowServiceForm(false); setEditingService(null);
      setServiceForm({ name:'',description:'',shortDescription:'',features:'',price:'',category:'other',icon:'TrendingUp',featured:false });
      setServiceImage(null); setServiceImagePreview(''); loadData();
    } catch (e) { setNotification({ message: e.response?.data?.message || 'Алдаа гарлаа', type: 'error' }); }
  };

  const handleEditService = (s) => {
    setEditingService(s);
    setServiceForm({ name:s.name, description:s.description, shortDescription:s.shortDescription||'',
      features:s.features?s.features.join('\n'):'', price:s.price||'', category:s.category, icon:s.icon||'TrendingUp', featured:s.featured||false });
    if (s.image) setServiceImagePreview(s.image);
    setShowServiceForm(true);
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Үйлчилгээ устгах уу?')) return;
    try { await deleteMarketingService(id); setNotification({ message: 'Устгагдлаа', type: 'success' }); loadData(); }
    catch (e) { setNotification({ message: e.response?.data?.message || 'Алдаа гарлаа', type: 'error' }); }
  };

  const T = ({ id, label }) => (
    <button onClick={() => setActiveTab(id)}
      className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab===id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {notification && <Notification type={notification.type} message={notification.message} onClose={() => setNotification(null)} />}

      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-gray-800">Админ Самбар</h1><p className="text-sm text-gray-600">Тавтай морил, {user?.name}</p></div>
          <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            <LogOut size={18} /> Гарах
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{s.label}</p>
                  <p className="text-2xl font-bold">{s.value}</p>
                  {s.badge && <span className="inline-block mt-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full animate-pulse">{s.badgeText}</span>}
                </div>
                <div className={`${s.color} w-12 h-12 rounded-lg flex items-center justify-center`}><s.icon className="text-white" size={24} /></div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg">
          <div className="border-b">
            <div className="flex gap-1 px-6 py-3 overflow-x-auto">
              <T id="dashboard" label="📊 Самбар" />
              <T id="products" label="Бүтээгдэхүүн" />
              <T id="orders" label="Захиалга" />
              <T id="quotations" label="Үнийн санал" />
              <T id="messages" label="Мессеж" />
              <T id="categories" label="Ангилал" />
              <T id="blogs" label="Блог" />
              <T id="services" label="Үйлчилгээ" />
            </div>
          </div>

          <div className="p-6">

            {activeTab === 'dashboard' && <DashboardTab onTabChange={setActiveTab} />}

            {/* ── Products ── */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Бүтээгдэхүүн удирдах</h2>
                  <button onClick={() => setShowProductForm(!showProductForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    <Plus size={20} /> Бүтээгдэхүүн нэмэх
                  </button>
                </div>
                {showProductForm && (
                  <div className="mb-6 p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-bold mb-4">{editingProduct ? 'Бүтээгдэхүүн засах' : 'Шинэ бүтээгдэхүүн'}</h3>
                    <form onSubmit={handleProductSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {[['name','Нэр','text','Бүтээгдэхүүний нэр',true],['price','Үнэ (₮)','number','50000',true],['size','Хэмжээ','text','A4, 85x54mm',false],['material','Материал','text','300gsm цаас',false],['stock','Нөөц','number','1000',false]].map(([k,l,t,p,r]) => (
                          <div key={k}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{l}{r && <span className="text-red-500"> *</span>}</label>
                            <input type={t} placeholder={p} value={productForm[k]} required={r}
                              onChange={e => setProductForm({...productForm,[k]:e.target.value})}
                              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>
                        ))}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Ангилал <span className="text-red-500">*</span></label>
                          <select value={productForm.category} onChange={e => setProductForm({...productForm,category:e.target.value})} required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Ангилал сонгох...</option>
                            {categories.filter(c=>!c.parent).map(cat=>(
                              <optgroup key={cat._id} label={cat.name}>
                                <option value={cat._id}>{cat.name}</option>
                                {categories.filter(s=>s.parent?._id===cat._id).map(s=><option key={s._id} value={s._id}>└─ {s.name}</option>)}
                              </optgroup>
                            ))}
                          </select>
                        </div>
                      </div>
                      <EnhancedTextarea value={productForm.description} onChange={e=>setProductForm({...productForm,description:e.target.value})}
                        label="Тайлбар" placeholder="Бүтээгдэхүүний дэлгэрэнгүй тайлбар..." rows={6} maxLength={2000} showInstructions={true} />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Зураг</label>
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="productImage" />
                            <label htmlFor="productImage" className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer">
                              <Upload size={20} className="text-gray-400" /><span className="text-gray-600">{selectedImage ? selectedImage.name : 'Зураг сонгох'}</span>
                            </label>
                          </div>
                          {imagePreview && <div className="w-24 h-24 border rounded-lg overflow-hidden"><img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /></div>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <input type="checkbox" id="featured" checked={productForm.featured} onChange={e=>setProductForm({...productForm,featured:e.target.checked})} className="w-5 h-5 text-blue-600 rounded" />
                        <label htmlFor="featured" className="flex-1 cursor-pointer">
                          <div className="font-semibold text-gray-900">⭐ Онцлох бүтээгдэхүүн</div>
                          <div className="text-sm text-gray-600">Нүүр хуудсанд онцлох хэсэгт харагдана</div>
                        </label>
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-2"><span>🏷️</span><h4 className="font-semibold">Хямдрал</h4></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Хямдралын хувь (%)</label>
                            <input type="number" min="0" max="100" value={productForm.discount}
                              onChange={e => setProductForm(prev => { const d=e.target.value; const up={...prev,discount:d}; if(d&&prev.price) up.oldPrice=Math.round(parseFloat(prev.price)/(1-parseFloat(d)/100)).toString(); return up; })}
                              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Хуучин үнэ (₮)</label>
                            <input type="number" value={productForm.oldPrice} onChange={e=>setProductForm({...productForm,oldPrice:e.target.value})}
                              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium">{editingProduct?'Шинэчлэх':'Нэмэх'}</button>
                        <button type="button" onClick={()=>{setShowProductForm(false);setEditingProduct(null);setSelectedImage(null);setImagePreview(null);}} className="px-8 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400">Болих</button>
                      </div>
                    </form>
                  </div>
                )}
                {loading ? <Loading /> : (
                  <div className="space-y-3">
                    {products.map(p => (
                      <div key={p._id} className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <img src={getImageUrl(p.image)} alt={p.name} className="w-20 h-20 object-cover rounded-lg" onError={e=>{e.target.src='/placeholder.png';}} />
                        <div className="flex-1">
                          <h4 className="font-semibold">{p.name}</h4>
                          <p className="text-lg font-bold text-blue-600">{formatPrice(p.price)}</p>
                          <p className="text-sm text-gray-600">{typeof p.category==='object'?p.category?.name:p.category}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={()=>handleEditProduct(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                          <button onClick={()=>handleDeleteProduct(p._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Orders ── */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Захиалга удирдах</h2>
                {loading ? <Loading /> : orders.length === 0 ? <div className="text-center py-12 text-gray-500">Захиалга байхгүй байна</div> : (
                  <div className="space-y-4">
                    {orders.map(o => (
                      <div key={o._id} className="border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex-1">
                            <div className="font-bold">Захиалга #{o._id.slice(-6)}</div>
                            <div className="text-sm text-gray-600">{o.shippingInfo.name} - {o.shippingInfo.phone}</div>
                            <div className="text-xs text-gray-500">{formatDate(o.createdAt)}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <select value={o.status} onChange={e=>handleUpdateOrderStatus(o._id,e.target.value)} className="px-4 py-2 border rounded-lg font-medium">
                              <option value="pending">Хүлээгдэж буй</option>
                              <option value="paid">Төлөгдсөн</option>
                              <option value="processing">Үйлдвэрлэлд</option>
                              <option value="completed">Дууссан</option>
                              <option value="cancelled">Цуцлагдсан</option>
                            </select>
                            <button onClick={()=>handleDeleteOrder(o._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={20} /></button>
                          </div>
                        </div>
                        <div className="text-right"><span className="text-xl font-bold text-blue-600">{formatPrice(o.total)}</span></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Quotations ── */}
            {activeTab === 'quotations' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Үнийн санал удирдах</h2>
                {loading ? <Loading /> : quotations.length === 0 ? <div className="text-center py-12 text-gray-500">Үнийн санал байхгүй байна</div> : (
                  <div className="space-y-4">
                    {quotations.map(q => (
                      <div key={q._id} className="border rounded-lg p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="font-bold mb-1">{q.name}</div>
                            <div className="text-sm text-gray-600 mb-2">{q.phone} - {q.email}</div>
                            <div className="text-sm text-gray-700 mb-2"><span className="font-medium">Төрөл:</span> {q.productType}</div>
                            <div className="text-sm text-gray-600 mb-3">{q.description}</div>
                            {q.designFile && (
                              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                <div className="text-sm font-medium text-blue-800 mb-1">Дизайн файл:</div>
                                <a href={getImageUrl(q.designFile.fileUrl)} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">📎 {q.designFile.fileName}</a>
                              </div>
                            )}
                            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-3 ${q.status==='pending'?'bg-yellow-100 text-yellow-700':'bg-green-100 text-green-700'}`}>
                              {q.status==='pending'?'Хүлээгдэж буй':'Хариулсан'}
                            </div>
                          </div>
                          <button onClick={()=>handleDeleteQuotation(q._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={20} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Messages ── */}
            {activeTab === 'messages' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Холбоо барих мессежүүд</h2>
                {loading ? <Loading /> : contactMessages.length === 0 ? (
                  <div className="text-center py-12"><Mail size={48} className="mx-auto text-gray-400 mb-4" /><p className="text-gray-600">Мессеж байхгүй байна</p></div>
                ) : (
                  <div className="space-y-4">
                    {contactMessages.map(m => (
                      <div key={m._id} className="border rounded-lg p-6 bg-white">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-bold text-lg">{m.name}</span>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${m.status==='new'?'bg-blue-100 text-blue-700':m.status==='read'?'bg-gray-100 text-gray-700':m.status==='replied'?'bg-green-100 text-green-700':'bg-gray-100 text-gray-700'}`}>
                                {m.status==='new'?'Шинэ':m.status==='read'?'Уншсан':m.status==='replied'?'Хариулсан':'Архивласан'}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">{m.email}</div>
                            <div className="text-sm font-medium text-gray-800 mb-2">Гарчиг: {m.subject}</div>
                            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg mb-3">{m.message}</div>
                            {m.adminReply && (
                              <div className="mt-3 p-3 bg-green-50 border-l-4 border-green-500 rounded">
                                <div className="text-sm font-medium text-green-800 mb-1">Админ хариу:</div>
                                <div className="text-sm text-gray-700">{m.adminReply.message}</div>
                                <div className="text-xs text-gray-500 mt-1">{formatDate(m.adminReply.repliedAt)}</div>
                              </div>
                            )}
                            <div className="text-xs text-gray-500 mt-3">{formatDate(m.createdAt)}</div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            {m.status==='new' && <button onClick={()=>handleMessageStatusUpdate(m._id,'read')} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Уншсан болгох"><CheckCircle size={20} /></button>}
                            {m.status!=='archived' && <button onClick={()=>handleMessageStatusUpdate(m._id,'archived')} className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg" title="Архивлах"><XCircle size={20} /></button>}
                            <button onClick={()=>handleDeleteMessage(m._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Устгах"><Trash2 size={20} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Categories ── */}
            {activeTab === 'categories' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Ангилал удирдах</h2>
                  <button onClick={()=>{setShowCategoryForm(!showCategoryForm);if(!showCategoryForm){setEditingCategory(null);setCategoryForm({name:'',description:'',parent:'',icon:'Package',order:0});}}} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    <Plus size={20} /> {showCategoryForm?'Хаах':'Ангилал нэмэх'}
                  </button>
                </div>
                {showCategoryForm && (
                  <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h3 className="text-lg font-bold mb-4">{editingCategory?'Ангилал засах':'Шинэ ангилал'}</h3>
                    <form onSubmit={handleCategorySubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-2">Нэр <span className="text-red-500">*</span></label>
                          <input type="text" required value={categoryForm.name} onChange={e=>setCategoryForm({...categoryForm,name:e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ангиллын нэр" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-2">Үндсэн ангилал</label>
                          <select value={categoryForm.parent} onChange={e=>setCategoryForm({...categoryForm,parent:e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">-- Үндсэн ангилал --</option>
                            {categories.filter(c=>!c.parent).map(c=><option key={c._id} value={c._id}>{c.name}</option>)}
                          </select></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                          <input type="text" value={categoryForm.icon} onChange={e=>setCategoryForm({...categoryForm,icon:e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Package" />
                          <p className="text-xs text-gray-500 mt-1">lucide-react icon name</p></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-2">Дараалал</label>
                          <input type="number" value={categoryForm.order} onChange={e=>setCategoryForm({...categoryForm,order:parseInt(e.target.value)})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                      </div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-2">Тайлбар</label>
                        <textarea rows="3" value={categoryForm.description} onChange={e=>setCategoryForm({...categoryForm,description:e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                      <div className="flex gap-3">
                        <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium">{editingCategory?'Шинэчлэх':'Нэмэх'}</button>
                        <button type="button" onClick={()=>{setShowCategoryForm(false);setEditingCategory(null);}} className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300">Цуцлах</button>
                      </div>
                    </form>
                  </div>
                )}
                {loading ? <Loading /> : categories.length===0 ? <div className="text-center py-12"><Package size={48} className="mx-auto text-gray-400 mb-4"/><p className="text-gray-600">Ангилал байхгүй байна</p></div> : (
                  <div className="space-y-4">
                    {categories.filter(c=>!c.parent).map(cat=>(
                      <div key={cat._id}>
                        <div className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md bg-white">
                          <div className="flex-1"><h4 className="font-bold text-lg">{cat.name}</h4>{cat.description&&<p className="text-sm text-gray-600">{cat.description}</p>}<p className="text-xs text-gray-500 mt-1">Icon: {cat.icon} | Order: {cat.order}</p></div>
                          <div className="flex gap-2">
                            <button onClick={()=>handleEditCategory(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18}/></button>
                            <button onClick={()=>handleDeleteCategory(cat._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                          </div>
                        </div>
                        {categories.filter(s=>s.parent?._id===cat._id).length>0 && (
                          <div className="ml-8 mt-2 space-y-2">
                            {categories.filter(s=>s.parent?._id===cat._id).map(s=>(
                              <div key={s._id} className="flex items-center gap-4 p-3 border border-l-4 border-l-blue-500 rounded-lg bg-blue-50">
                                <div className="flex-1"><h5 className="font-semibold">{s.name}</h5>{s.description&&<p className="text-xs text-gray-600">{s.description}</p>}</div>
                                <div className="flex gap-2">
                                  <button onClick={()=>handleEditCategory(s)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"><Edit size={16}/></button>
                                  <button onClick={()=>handleDeleteCategory(s._id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 size={16}/></button>
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

            {/* ── Blogs ── */}
            {activeTab === 'blogs' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Блог удирдах</h2>
                  <button onClick={()=>{setShowBlogForm(!showBlogForm);if(!showBlogForm){setEditingBlog(null);setBlogForm({title:'',excerpt:'',content:'',category:'other',tags:'',status:'published',featured:false});}}} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    <Plus size={20}/> {showBlogForm?'Хаах':'Блог нэмэх'}
                  </button>
                </div>
                {showBlogForm && (
                  <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h3 className="text-lg font-bold mb-4">{editingBlog?'Блог засах':'Шинэ блог'}</h3>
                    <form onSubmit={handleBlogSubmit} className="space-y-4">
                      <div><label className="block text-sm font-medium text-gray-700 mb-2">Гарчиг <span className="text-red-500">*</span></label>
                        <input type="text" required value={blogForm.title} onChange={e=>setBlogForm({...blogForm,title:e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Блогийн гарчиг"/></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-2">Товч агуулга</label>
                        <textarea rows="2" value={blogForm.excerpt} onChange={e=>setBlogForm({...blogForm,excerpt:e.target.value})} maxLength="500" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-2">Агуулга <span className="text-red-500">*</span></label>
                        <textarea rows="10" required value={blogForm.content} onChange={e=>setBlogForm({...blogForm,content:e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-2">Ангилал</label>
                          <select value={blogForm.category} onChange={e=>setBlogForm({...blogForm,category:e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="other">Бусад</option><option value="news">Мэдээ</option><option value="tutorial">Заавар</option><option value="tips">Зөвлөмж</option><option value="case-study">Туршилт</option><option value="announcement">Мэдэгдэл</option>
                          </select></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-2">Статус</label>
                          <select value={blogForm.status} onChange={e=>setBlogForm({...blogForm,status:e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="draft">Ноорог</option><option value="published">Нийтлэгдсэн</option><option value="archived">Архивласан</option>
                          </select></div>
                      </div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                        <input type="text" value={blogForm.tags} onChange={e=>setBlogForm({...blogForm,tags:e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="хэвлэл, дизайн"/></div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="blogFeatured" checked={blogForm.featured} onChange={e=>setBlogForm({...blogForm,featured:e.target.checked})} className="w-4 h-4 text-blue-600 rounded"/>
                        <label htmlFor="blogFeatured" className="text-sm font-medium text-gray-700">Онцлох блог</label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Зураг</label>
                        {blogImagePreview ? (
                          <div className="relative"><img src={blogImagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg"/>
                            <button type="button" onClick={()=>{setBlogImage(null);setBlogImagePreview('');}} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg"><X size={16}/></button></div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500">
                            <input type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(f){setBlogImage(f);const r=new FileReader();r.onloadend=()=>setBlogImagePreview(r.result);r.readAsDataURL(f);}}} className="hidden" id="blog-img"/>
                            <label htmlFor="blog-img" className="cursor-pointer flex flex-col items-center gap-2"><Upload className="w-10 h-10 text-gray-400"/><span className="text-sm text-gray-600">Зураг сонгох</span></label>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium">{editingBlog?'Шинэчлэх':'Нэмэх'}</button>
                        <button type="button" onClick={()=>{setShowBlogForm(false);setEditingBlog(null);}} className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300">Цуцлах</button>
                      </div>
                    </form>
                  </div>
                )}
                {loading ? <Loading/> : blogs.length===0 ? <div className="text-center py-12"><div className="text-6xl mb-4">📝</div><p className="text-gray-600">Блог байхгүй байна</p></div> : (
                  <div className="space-y-4">
                    {blogs.map(b=>(
                      <div key={b._id} className="border rounded-lg p-6 bg-white">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-bold text-lg">{b.title}</h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${b.status==='draft'?'bg-gray-100 text-gray-700':b.status==='published'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}`}>
                                {b.status==='draft'?'Ноорог':b.status==='published'?'Нийтлэгдсэн':'Архивласан'}
                              </span>
                              {b.featured&&<span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">Онцлох</span>}
                            </div>
                            {b.excerpt&&<p className="text-sm text-gray-600 mb-2">{b.excerpt}</p>}
                            <div className="text-xs text-gray-500">{formatDate(b.createdAt)}</div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button onClick={()=>handleEditBlog(b)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18}/></button>
                            <button onClick={()=>handleDeleteBlog(b._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Services ── */}
            {activeTab === 'services' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Маркетингийн үйлчилгээ удирдах</h2>
                  <button onClick={()=>{setShowServiceForm(!showServiceForm);if(!showServiceForm){setEditingService(null);setServiceForm({name:'',description:'',shortDescription:'',features:'',price:'',category:'other',icon:'TrendingUp',featured:false});}}} className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                    <Plus size={20}/> {showServiceForm?'Хаах':'Үйлчилгээ нэмэх'}
                  </button>
                </div>
                {showServiceForm && (
                  <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h3 className="text-lg font-bold mb-4">{editingService?'Үйлчилгээ засах':'Шинэ үйлчилгээ'}</h3>
                    <form onSubmit={handleServiceSubmit} className="space-y-4">
                      <div><label className="block text-sm font-medium text-gray-700 mb-2">Нэр <span className="text-red-500">*</span></label>
                        <input type="text" required value={serviceForm.name} onChange={e=>setServiceForm({...serviceForm,name:e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-2">Товч тайлбар</label>
                        <textarea rows="2" value={serviceForm.shortDescription} onChange={e=>setServiceForm({...serviceForm,shortDescription:e.target.value})} maxLength="200" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-2">Дэлгэрэнгүй тайлбар <span className="text-red-500">*</span></label>
                        <textarea rows="5" required value={serviceForm.description} onChange={e=>setServiceForm({...serviceForm,description:e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-2">Онцлогууд (мөр бүрд нэг)</label>
                        <textarea rows="4" value={serviceForm.features} onChange={e=>setServiceForm({...serviceForm,features:e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-2">Үнэ</label>
                          <input type="text" value={serviceForm.price} onChange={e=>setServiceForm({...serviceForm,price:e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="50,000₮/сар"/></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-2">Ангилал</label>
                          <select value={serviceForm.category} onChange={e=>setServiceForm({...serviceForm,category:e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option value="other">Бусад</option><option value="social-media">Сошиал медиа</option><option value="seo">SEO</option><option value="content">Контент</option><option value="advertising">Сурталчилгаа</option><option value="branding">Брэндинг</option>
                          </select></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="svcFeat" checked={serviceForm.featured} onChange={e=>setServiceForm({...serviceForm,featured:e.target.checked})} className="w-4 h-4 text-purple-600 rounded"/>
                        <label htmlFor="svcFeat" className="text-sm font-medium text-gray-700">Онцлох үйлчилгээ</label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Зураг</label>
                        {serviceImagePreview ? (
                          <div className="relative"><img src={serviceImagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg"/>
                            <button type="button" onClick={()=>{setServiceImage(null);setServiceImagePreview('');}} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg"><X size={16}/></button></div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500">
                            <input type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(f){setServiceImage(f);const r=new FileReader();r.onloadend=()=>setServiceImagePreview(r.result);r.readAsDataURL(f);}}} className="hidden" id="svc-img"/>
                            <label htmlFor="svc-img" className="cursor-pointer flex flex-col items-center gap-2"><Upload className="w-10 h-10 text-gray-400"/><span className="text-sm text-gray-600">Зураг сонгох</span></label>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <button type="submit" className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-medium">{editingService?'Шинэчлэх':'Нэмэх'}</button>
                        <button type="button" onClick={()=>{setShowServiceForm(false);setEditingService(null);}} className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300">Цуцлах</button>
                      </div>
                    </form>
                  </div>
                )}
                {loading ? <Loading/> : marketingServices.length===0 ? <div className="text-center py-12"><div className="text-6xl mb-4">📊</div><p className="text-gray-600">Үйлчилгээ байхгүй байна</p></div> : (
                  <div className="space-y-4">
                    {marketingServices.map(s=>(
                      <div key={s._id} className="border rounded-lg p-6 bg-white">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-bold text-lg">{s.name}</h4>
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">{s.category==='social-media'?'Сошиал медиа':s.category==='seo'?'SEO':s.category==='content'?'Контент':s.category==='advertising'?'Сурталчилгаа':s.category==='branding'?'Брэндинг':'Бусад'}</span>
                              {s.featured&&<span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">Онцлох</span>}
                            </div>
                            {s.shortDescription&&<p className="text-sm text-gray-600 mb-2">{s.shortDescription}</p>}
                            {s.price&&<div className="text-sm font-semibold text-purple-600 mb-2">Үнэ: {s.price}</div>}
                            <div className="text-xs text-gray-500">{formatDate(s.createdAt)}</div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button onClick={()=>handleEditService(s)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18}/></button>
                            <button onClick={()=>handleDeleteService(s._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
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