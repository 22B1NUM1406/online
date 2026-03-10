import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, Package, ShoppingCart, MessageSquare,
  Plus, Edit, Trash2, Upload, Mail, CheckCircle, XCircle, X,
  LayoutDashboard, Tag, BookOpen, Briefcase, ChevronRight,
  TrendingUp, Bell, Search, Settings
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const navItems = [
    { id: 'dashboard', label: 'Самбар', icon: LayoutDashboard },
    { id: 'products', label: 'Бүтээгдэхүүн', icon: Package, stat: products.length },
    { id: 'orders', label: 'Захиалга', icon: ShoppingCart, stat: orders.length },
    { id: 'quotations', label: 'Үнийн санал', icon: TrendingUp, badge: quotations.filter(q=>q.status==='pending').length },
    { id: 'messages', label: 'Мессеж', icon: Mail, badge: contactMessages.filter(m=>m.status==='new').length },
    { id: 'categories', label: 'Ангилал', icon: Tag },
    { id: 'blogs', label: 'Блог', icon: BookOpen, stat: blogs.length },
    { id: 'services', label: 'Үйлчилгээ', icon: Briefcase, stat: marketingServices.length },
  ];

  const activeNav = navItems.find(n => n.id === activeTab);
  const totalBadges = quotations.filter(q=>q.status==='pending').length + contactMessages.filter(m=>m.status==='new').length;

  // Shared input class
  const inp = "w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all";
  const label = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .adm * { font-family: 'Sora', sans-serif; }
        .adm code, .adm .mono { font-family: 'JetBrains Mono', monospace; }

        .nav-item { position: relative; transition: all 0.18s ease; }
        .nav-item::before {
          content: '';
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%);
          width: 3px; height: 0;
          background: #6366f1;
          border-radius: 0 2px 2px 0;
          transition: height 0.2s ease;
        }
        .nav-item.active::before { height: 60%; }
        .nav-item.active { background: rgba(99,102,241,0.1); color: #6366f1; }
        .nav-item:not(.active):hover { background: rgba(255,255,255,0.05); color: #e2e8f0; }

        .card { background: #fff; border: 1px solid #f1f3f9; border-radius: 12px; transition: box-shadow 0.2s; }
        .card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); }

        .stat-pill { background: linear-gradient(135deg, #f8faff 0%, #eef2ff 100%); border: 1px solid #e0e7ff; }

        .badge-dot { width:7px; height:7px; border-radius:50%; background:#ef4444; display:inline-block; animation: pulse-dot 1.5s infinite; }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.7;transform:scale(1.3)} }

        .btn-primary { background: #6366f1; color: white; border: none; border-radius: 8px; padding: 9px 18px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; display:inline-flex; align-items:center; gap:6px; }
        .btn-primary:hover { background: #4f46e5; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(99,102,241,0.3); }
        .btn-secondary { background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; border-radius: 8px; padding: 9px 18px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; }
        .btn-secondary:hover { background: #f1f5f9; }
        .btn-danger { background: #fff0f0; color: #ef4444; border: 1px solid #fecaca; border-radius: 8px; padding: 7px 12px; font-size: 13px; cursor: pointer; transition: all 0.15s; }
        .btn-danger:hover { background: #fef2f2; border-color: #fca5a5; }
        .btn-icon { background: none; border: none; border-radius: 7px; padding: 6px; cursor: pointer; transition: all 0.15s; display:inline-flex; align-items:center; justify-content:center; }
        .btn-icon.edit:hover { background: #eef2ff; color: #6366f1; }
        .btn-icon.del:hover { background: #fef2f2; color: #ef4444; }

        .form-panel { background: #fafbff; border: 1px solid #e8ecf8; border-radius: 14px; padding: 28px; margin-bottom: 24px; }
        .form-panel h3 { font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 20px; padding-bottom: 14px; border-bottom: 1px solid #e8ecf8; }

        .status-badge { display:inline-flex; align-items:center; gap:5px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.03em; }
        .status-pending { background:#fffbeb; color:#b45309; border:1px solid #fde68a; }
        .status-paid { background:#f0fdf4; color:#15803d; border:1px solid #bbf7d0; }
        .status-processing { background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; }
        .status-completed { background:#f0fdf4; color:#15803d; border:1px solid #bbf7d0; }
        .status-cancelled { background:#fff1f2; color:#be123c; border:1px solid #fecdd3; }
        .status-new { background:#eef2ff; color:#4338ca; border:1px solid #c7d2fe; }
        .status-read { background:#f8fafc; color:#64748b; border:1px solid #e2e8f0; }
        .status-replied { background:#f0fdf4; color:#15803d; border:1px solid #bbf7d0; }
        .status-draft { background:#fefce8; color:#a16207; border:1px solid #fef08a; }
        .status-published { background:#f0fdf4; color:#15803d; border:1px solid #bbf7d0; }
        .status-archived { background:#f8fafc; color:#94a3b8; border:1px solid #e2e8f0; }

        .section-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:22px; padding-bottom:16px; border-bottom:1px solid #f1f5f9; }
        .section-title { font-size:17px; font-weight:700; color:#0f172a; }

        .table-row { display:flex; align-items:center; gap:16px; padding:16px; border-radius:10px; border:1px solid #f1f5f9; transition:all 0.15s; background:#fff; }
        .table-row:hover { border-color:#e0e7ff; box-shadow: 0 2px 12px rgba(99,102,241,0.07); }

        .upload-zone { border: 2px dashed #d1d5db; border-radius: 10px; padding: 28px; text-align: center; cursor: pointer; transition: all 0.2s; }
        .upload-zone:hover { border-color: #6366f1; background: #fafbff; }

        .sidebar-logo-text { background: linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

        .topbar { background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border-bottom: 1px solid #f1f5f9; }

        select.inp-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px; }

        .empty-state { text-align:center; padding: 64px 32px; color: #94a3b8; }
        .empty-state .icon { width:52px; height:52px; background:#f8fafc; border-radius:14px; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; }
        .empty-state p { font-size:14px; }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>

      <div className="adm flex min-h-screen" style={{ background: '#f6f7fb' }}>
        {notification && <Notification type={notification.type} message={notification.message} onClose={() => setNotification(null)} />}

        {/* ── SIDEBAR ── */}
        <aside style={{
          width: sidebarOpen ? 240 : 64,
          minHeight: '100vh',
          background: '#111827',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          transition: 'width 0.25s cubic-bezier(.4,0,.2,1)',
          display: 'flex', flexDirection: 'column',
          flexShrink: 0, overflow: 'hidden'
        }}>
          {/* Logo area */}
          <div style={{ padding: '20px 16px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12, minHeight: 64 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9, flexShrink: 0,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 800, color: 'white', letterSpacing: '-0.5px'
            }}>A</div>
            {sidebarOpen && (
              <div style={{ overflow: 'hidden' }}>
                <div className="sidebar-logo-text" style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>Admin Panel</div>
                <div style={{ fontSize: 11, color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140 }}>{user?.name}</div>
              </div>
            )}
          </div>

          {/* Toggle btn */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ position: 'absolute', top: 22, right: sidebarOpen ? 14 : 18, background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 6, width: 26, height: 26, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#e2e8f0'}
            onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
          >
            <ChevronRight size={13} style={{ transform: sidebarOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s' }} />
          </button>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
            {sidebarOpen && (
              <div style={{ fontSize: 10, fontWeight: 700, color: '#374151', letterSpacing: '0.1em', padding: '6px 10px 10px', textTransform: 'uppercase' }}>Навигаци</div>
            )}
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={!sidebarOpen ? item.label : ''}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    gap: sidebarOpen ? 10 : 0,
                    justifyContent: sidebarOpen ? 'flex-start' : 'center',
                    padding: sidebarOpen ? '9px 12px' : '10px',
                    borderRadius: 9, marginBottom: 2, border: 'none', cursor: 'pointer',
                    color: isActive ? '#818cf8' : '#9ca3af',
                    fontWeight: isActive ? 600 : 400, fontSize: 13,
                  }}
                >
                  <Icon size={16} style={{ flexShrink: 0 }} />
                  {sidebarOpen && (
                    <>
                      <span style={{ flex: 1, textAlign: 'left', whiteSpace: 'nowrap' }}>{item.label}</span>
                      {item.badge > 0 && <span style={{ background: '#ef4444', color: 'white', fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 20 }}>{item.badge}</span>}
                      {!item.badge && item.stat > 0 && <span style={{ background: isActive ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)', color: isActive ? '#a5b4fc' : '#6b7280', fontSize: 11, padding: '1px 7px', borderRadius: 6, fontWeight: 600 }}>{item.stat}</span>}
                    </>
                  )}
                  {!sidebarOpen && item.badge > 0 && <span className="badge-dot" style={{ position: 'absolute', top: 6, right: 6 }} />}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div style={{ padding: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button
              onClick={() => { logout(); navigate('/'); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: sidebarOpen ? 10 : 0, justifyContent: sidebarOpen ? 'flex-start' : 'center',
                padding: sidebarOpen ? '9px 12px' : '10px',
                borderRadius: 9, border: 'none', cursor: 'pointer',
                background: 'none', color: '#6b7280', fontSize: 13, fontWeight: 500,
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.color = '#f87171'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#6b7280'; }}
              title={!sidebarOpen ? 'Гарах' : ''}
            >
              <LogOut size={16} />
              {sidebarOpen && <span>Гарах</span>}
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

          {/* Topbar */}
          <header className="topbar" style={{ padding: '0 28px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>Удирдлага</span>
              <ChevronRight size={12} color="#cbd5e1" />
              <span style={{ fontSize: 13, color: '#1e293b', fontWeight: 600 }}>{activeNav?.label}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {totalBadges > 0 && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 20, padding: '3px 10px', fontSize: 12, color: '#dc2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span className="badge-dot" />
                  {totalBadges} шинэ
                </div>
              )}
              <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 700 }}>
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
            </div>
          </header>

          {/* Content */}
          <main style={{ flex: 1, overflow: 'auto', padding: '24px 28px' }}>

            {activeTab === 'dashboard' && <DashboardTab onTabChange={setActiveTab} />}

            {/* ── PRODUCTS ── */}
            {activeTab === 'products' && (
              <div>
                <div className="section-header">
                  <h2 className="section-title">Бүтээгдэхүүн</h2>
                  <button className="btn-primary" onClick={() => setShowProductForm(!showProductForm)}>
                    <Plus size={15} /> {showProductForm ? 'Хаах' : 'Нэмэх'}
                  </button>
                </div>

                {showProductForm && (
                  <div className="form-panel">
                    <h3>{editingProduct ? '✏️ Бүтээгдэхүүн засах' : '+ Шинэ бүтээгдэхүүн'}</h3>
                    <form onSubmit={handleProductSubmit}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        {[['name','Нэр','text','Бүтээгдэхүүний нэр',true],['price','Үнэ (₮)','number','50000',true],['size','Хэмжээ','text','A4, 85x54mm',false],['material','Материал','text','300gsm цаас',false],['stock','Нөөц','number','1000',false]].map(([k,l,t,p,r]) => (
                          <div key={k}>
                            <label className={label}>{l}{r && <span style={{color:'#ef4444'}}> *</span>}</label>
                            <input type={t} placeholder={p} value={productForm[k]} required={r}
                              onChange={e => setProductForm({...productForm,[k]:e.target.value})}
                              className={inp} />
                          </div>
                        ))}
                        <div>
                          <label className={label}>Ангилал <span style={{color:'#ef4444'}}>*</span></label>
                          <select value={productForm.category} onChange={e => setProductForm({...productForm,category:e.target.value})} required className={`${inp} inp-select`}>
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

                      <div style={{ marginBottom: 16 }}>
                        <EnhancedTextarea value={productForm.description} onChange={e=>setProductForm({...productForm,description:e.target.value})}
                          label="Тайлбар" placeholder="Бүтээгдэхүүний дэлгэрэнгүй тайлбар..." rows={5} maxLength={2000} showInstructions={true} />
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <label className={label}>Зураг</label>
                        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="productImage" />
                            <label htmlFor="productImage" className="upload-zone" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                              <Upload size={22} color="#9ca3af" />
                              <span style={{ fontSize: 13, color: '#6b7280' }}>{selectedImage ? selectedImage.name : 'Зураг сонгох'}</span>
                            </label>
                          </div>
                          {imagePreview && <div style={{ width: 80, height: 80, borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e8f0' }}><img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                        <div style={{ flex: 1, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                          <input type="checkbox" id="featured" checked={productForm.featured} onChange={e=>setProductForm({...productForm,featured:e.target.checked})} style={{ width: 16, height: 16, accentColor: '#6366f1' }} />
                          <label htmlFor="featured" style={{ cursor: 'pointer' }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#92400e' }}>⭐ Онцлох бүтээгдэхүүн</div>
                            <div style={{ fontSize: 12, color: '#a16207' }}>Нүүр хуудсанд онцлох хэсэгт харагдана</div>
                          </label>
                        </div>
                      </div>

                      <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 10, padding: '16px', marginBottom: 20 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#dc2626', marginBottom: 12 }}>🏷️ Хямдрал</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                          <div>
                            <label className={label}>Хямдралын хувь (%)</label>
                            <input type="number" min="0" max="100" value={productForm.discount}
                              onChange={e => setProductForm(prev => { const d=e.target.value; const up={...prev,discount:d}; if(d&&prev.price) up.oldPrice=Math.round(parseFloat(prev.price)/(1-parseFloat(d)/100)).toString(); return up; })}
                              className={inp} />
                          </div>
                          <div>
                            <label className={label}>Хуучин үнэ (₮)</label>
                            <input type="number" value={productForm.oldPrice} onChange={e=>setProductForm({...productForm,oldPrice:e.target.value})} className={inp} />
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 10 }}>
                        <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '11px' }}>{editingProduct?'Шинэчлэх':'Нэмэх'}</button>
                        <button type="button" className="btn-secondary" onClick={()=>{setShowProductForm(false);setEditingProduct(null);setSelectedImage(null);setImagePreview(null);}}>Болих</button>
                      </div>
                    </form>
                  </div>
                )}

                {loading ? <Loading /> : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {products.map(p => (
                      <div key={p._id} className="table-row">
                        <img src={getImageUrl(p.image)} alt={p.name} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 9, border: '1px solid #f1f5f9', flexShrink: 0 }} onError={e=>{e.target.src='/placeholder.png';}} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', marginBottom: 2 }}>{p.name}</div>
                          <div style={{ fontSize: 13, color: '#6366f1', fontWeight: 700 }}>{formatPrice(p.price)}</div>
                          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{typeof p.category==='object'?p.category?.name:p.category}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn-icon edit" onClick={()=>handleEditProduct(p)}><Edit size={15} /></button>
                          <button className="btn-icon del" onClick={()=>handleDeleteProduct(p._id)}><Trash2 size={15} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── ORDERS ── */}
            {activeTab === 'orders' && (
              <div>
                <div className="section-header">
                  <h2 className="section-title">Захиалга</h2>
                </div>
                {loading ? <Loading /> : orders.length === 0 ? (
                  <div className="empty-state"><div className="icon"><ShoppingCart size={22} color="#cbd5e1" /></div><p>Захиалга байхгүй байна</p></div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {orders.map(o => (
                      <div key={o._id} className="card" style={{ padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                              <span className="mono" style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>#{o._id.slice(-6).toUpperCase()}</span>
                              <span className={`status-badge status-${o.status}`}>
                                {o.status==='pending'?'Хүлээгдэж буй':o.status==='paid'?'Төлөгдсөн':o.status==='processing'?'Үйлдвэрлэлд':o.status==='completed'?'Дууссан':'Цуцлагдсан'}
                              </span>
                            </div>
                            <div style={{ fontSize: 13, color: '#475569' }}>{o.shippingInfo.name} — {o.shippingInfo.phone}</div>
                            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{formatDate(o.createdAt)}</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 16, fontWeight: 800, color: '#6366f1' }}>{formatPrice(o.total)}</span>
                            <select value={o.status} onChange={e=>handleUpdateOrderStatus(o._id,e.target.value)}
                              className="inp-select"
                              style={{ padding: '7px 32px 7px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 500, color: '#374151', background: 'white', cursor: 'pointer', appearance: 'none', backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', outline: 'none' }}>
                              <option value="pending">Хүлээгдэж буй</option>
                              <option value="paid">Төлөгдсөн</option>
                              <option value="processing">Үйлдвэрлэлд</option>
                              <option value="completed">Дууссан</option>
                              <option value="cancelled">Цуцлагдсан</option>
                            </select>
                            <button className="btn-icon del" onClick={()=>handleDeleteOrder(o._id)}><Trash2 size={15} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── QUOTATIONS ── */}
            {activeTab === 'quotations' && (
              <div>
                <div className="section-header">
                  <h2 className="section-title">Үнийн санал</h2>
                </div>
                {loading ? <Loading /> : quotations.length === 0 ? (
                  <div className="empty-state"><div className="icon"><TrendingUp size={22} color="#cbd5e1" /></div><p>Үнийн санал байхгүй байна</p></div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {quotations.map(q => (
                      <div key={q._id} className="card" style={{ padding: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                              <span style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{q.name}</span>
                              <span className={`status-badge ${q.status==='pending'?'status-pending':'status-replied'}`}>
                                {q.status==='pending'?'Хүлээгдэж буй':'Хариулсан'}
                              </span>
                            </div>
                            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>{q.phone} · {q.email}</div>
                            <div style={{ fontSize: 13, color: '#475569', marginBottom: 4 }}><b>Төрөл:</b> {q.productType}</div>
                            <div style={{ fontSize: 13, color: '#64748b', background: '#f8fafc', padding: '10px 14px', borderRadius: 8, marginTop: 8 }}>{q.description}</div>
                            {q.designFile && (
                              <div style={{ marginTop: 10, padding: '10px 14px', background: '#eef2ff', borderRadius: 8 }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: '#4338ca', marginBottom: 4 }}>Дизайн файл</div>
                                <a href={getImageUrl(q.designFile.fileUrl)} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#6366f1' }}>📎 {q.designFile.fileName}</a>
                              </div>
                            )}
                          </div>
                          <button className="btn-icon del" style={{ alignSelf: 'flex-start', marginLeft: 12 }} onClick={()=>handleDeleteQuotation(q._id)}><Trash2 size={15} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── MESSAGES ── */}
            {activeTab === 'messages' && (
              <div>
                <div className="section-header">
                  <h2 className="section-title">Мессежүүд</h2>
                </div>
                {loading ? <Loading /> : contactMessages.length === 0 ? (
                  <div className="empty-state"><div className="icon"><Mail size={22} color="#cbd5e1" /></div><p>Мессеж байхгүй байна</p></div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {contactMessages.map(m => (
                      <div key={m._id} className="card" style={{ padding: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                              <span style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{m.name}</span>
                              <span className={`status-badge status-${m.status}`}>
                                {m.status==='new'?'Шинэ':m.status==='read'?'Уншсан':m.status==='replied'?'Хариулсан':'Архивласан'}
                              </span>
                            </div>
                            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>{m.email} · {formatDate(m.createdAt)}</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{m.subject}</div>
                            <div style={{ fontSize: 13, color: '#64748b', background: '#f8fafc', padding: '10px 14px', borderRadius: 8 }}>{m.message}</div>
                            {m.adminReply && (
                              <div style={{ marginTop: 10, padding: '12px 14px', background: '#f0fdf4', borderLeft: '3px solid #22c55e', borderRadius: '0 8px 8px 0' }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: '#15803d', marginBottom: 4 }}>Админ хариу</div>
                                <div style={{ fontSize: 13, color: '#374151' }}>{m.adminReply.message}</div>
                                <div style={{ fontSize: 11, color: '#86efac', marginTop: 4 }}>{formatDate(m.adminReply.repliedAt)}</div>
                              </div>
                            )}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginLeft: 12 }}>
                            {m.status==='new' && <button className="btn-icon edit" title="Уншсан" onClick={()=>handleMessageStatusUpdate(m._id,'read')}><CheckCircle size={15} /></button>}
                            {m.status!=='archived' && <button className="btn-icon" style={{ color: '#94a3b8' }} title="Архивлах" onClick={()=>handleMessageStatusUpdate(m._id,'archived')}><XCircle size={15} /></button>}
                            <button className="btn-icon del" title="Устгах" onClick={()=>handleDeleteMessage(m._id)}><Trash2 size={15} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── CATEGORIES ── */}
            {activeTab === 'categories' && (
              <div>
                <div className="section-header">
                  <h2 className="section-title">Ангилал</h2>
                  <button className="btn-primary" onClick={()=>{setShowCategoryForm(!showCategoryForm);if(!showCategoryForm){setEditingCategory(null);setCategoryForm({name:'',description:'',parent:'',icon:'Package',order:0});}}}>
                    <Plus size={15} /> {showCategoryForm?'Хаах':'Нэмэх'}
                  </button>
                </div>

                {showCategoryForm && (
                  <div className="form-panel">
                    <h3>{editingCategory ? '✏️ Ангилал засах' : '+ Шинэ ангилал'}</h3>
                    <form onSubmit={handleCategorySubmit}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                          <label className={label}>Нэр <span style={{color:'#ef4444'}}>*</span></label>
                          <input type="text" required value={categoryForm.name} onChange={e=>setCategoryForm({...categoryForm,name:e.target.value})} className={inp} placeholder="Ангиллын нэр" />
                        </div>
                        <div>
                          <label className={label}>Үндсэн ангилал</label>
                          <select value={categoryForm.parent} onChange={e=>setCategoryForm({...categoryForm,parent:e.target.value})} className={`${inp} inp-select`}>
                            <option value="">-- Үндсэн ангилал --</option>
                            {categories.filter(c=>!c.parent).map(c=><option key={c._id} value={c._id}>{c.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={label}>Icon</label>
                          <input type="text" value={categoryForm.icon} onChange={e=>setCategoryForm({...categoryForm,icon:e.target.value})} className={inp} placeholder="Package" />
                          <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>lucide-react icon нэр</p>
                        </div>
                        <div>
                          <label className={label}>Дараалал</label>
                          <input type="number" value={categoryForm.order} onChange={e=>setCategoryForm({...categoryForm,order:parseInt(e.target.value)})} className={inp} />
                        </div>
                      </div>
                      <div style={{ marginBottom: 20 }}>
                        <label className={label}>Тайлбар</label>
                        <textarea rows="3" value={categoryForm.description} onChange={e=>setCategoryForm({...categoryForm,description:e.target.value})} className={inp} style={{ resize: 'vertical' }} />
                      </div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '11px' }}>{editingCategory?'Шинэчлэх':'Нэмэх'}</button>
                        <button type="button" className="btn-secondary" onClick={()=>{setShowCategoryForm(false);setEditingCategory(null);}}>Болих</button>
                      </div>
                    </form>
                  </div>
                )}

                {loading ? <Loading /> : categories.length === 0 ? (
                  <div className="empty-state"><div className="icon"><Tag size={22} color="#cbd5e1" /></div><p>Ангилал байхгүй байна</p></div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {categories.filter(c=>!c.parent).map(cat=>(
                      <div key={cat._id}>
                        <div className="table-row" style={{ borderLeft: '3px solid #6366f1' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{cat.name}</div>
                            {cat.description && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{cat.description}</div>}
                            <div style={{ fontSize: 11, color: '#cbd5e1', marginTop: 3 }}>Icon: {cat.icon} · Order: {cat.order}</div>
                          </div>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button className="btn-icon edit" onClick={()=>handleEditCategory(cat)}><Edit size={14}/></button>
                            <button className="btn-icon del" onClick={()=>handleDeleteCategory(cat._id)}><Trash2 size={14}/></button>
                          </div>
                        </div>
                        {categories.filter(s=>s.parent?._id===cat._id).map(s=>(
                          <div key={s._id} className="table-row" style={{ marginLeft: 24, marginTop: 6, borderLeft: '3px solid #c7d2fe', background: '#fafbff' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>└ {s.name}</div>
                              {s.description && <div style={{ fontSize: 12, color: '#94a3b8' }}>{s.description}</div>}
                            </div>
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button className="btn-icon edit" onClick={()=>handleEditCategory(s)}><Edit size={14}/></button>
                              <button className="btn-icon del" onClick={()=>handleDeleteCategory(s._id)}><Trash2 size={14}/></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── BLOGS ── */}
            {activeTab === 'blogs' && (
              <div>
                <div className="section-header">
                  <h2 className="section-title">Блог</h2>
                  <button className="btn-primary" onClick={()=>{setShowBlogForm(!showBlogForm);if(!showBlogForm){setEditingBlog(null);setBlogForm({title:'',excerpt:'',content:'',category:'other',tags:'',status:'published',featured:false});}}}>
                    <Plus size={15} /> {showBlogForm?'Хаах':'Нэмэх'}
                  </button>
                </div>

                {showBlogForm && (
                  <div className="form-panel">
                    <h3>{editingBlog ? '✏️ Блог засах' : '+ Шинэ блог'}</h3>
                    <form onSubmit={handleBlogSubmit}>
                      <div style={{ marginBottom: 16 }}>
                        <label className={label}>Гарчиг <span style={{color:'#ef4444'}}>*</span></label>
                        <input type="text" required value={blogForm.title} onChange={e=>setBlogForm({...blogForm,title:e.target.value})} className={inp} placeholder="Блогийн гарчиг" />
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <label className={label}>Товч агуулга</label>
                        <textarea rows="2" value={blogForm.excerpt} onChange={e=>setBlogForm({...blogForm,excerpt:e.target.value})} maxLength="500" className={inp} style={{ resize: 'vertical' }} />
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <label className={label}>Агуулга <span style={{color:'#ef4444'}}>*</span></label>
                        <textarea rows="10" required value={blogForm.content} onChange={e=>setBlogForm({...blogForm,content:e.target.value})} className={inp} style={{ resize: 'vertical' }} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                          <label className={label}>Ангилал</label>
                          <select value={blogForm.category} onChange={e=>setBlogForm({...blogForm,category:e.target.value})} className={`${inp} inp-select`}>
                            <option value="other">Бусад</option><option value="news">Мэдээ</option><option value="tutorial">Заавар</option><option value="tips">Зөвлөмж</option><option value="case-study">Туршилт</option><option value="announcement">Мэдэгдэл</option>
                          </select>
                        </div>
                        <div>
                          <label className={label}>Статус</label>
                          <select value={blogForm.status} onChange={e=>setBlogForm({...blogForm,status:e.target.value})} className={`${inp} inp-select`}>
                            <option value="draft">Ноорог</option><option value="published">Нийтлэгдсэн</option><option value="archived">Архивласан</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <label className={label}>Tags</label>
                        <input type="text" value={blogForm.tags} onChange={e=>setBlogForm({...blogForm,tags:e.target.value})} className={inp} placeholder="хэвлэл, дизайн" />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <input type="checkbox" id="blogFeatured" checked={blogForm.featured} onChange={e=>setBlogForm({...blogForm,featured:e.target.checked})} style={{ width: 15, height: 15, accentColor: '#6366f1' }} />
                        <label htmlFor="blogFeatured" style={{ fontSize: 13, fontWeight: 500, color: '#374151', cursor: 'pointer' }}>Онцлох блог</label>
                      </div>
                      <div style={{ marginBottom: 20 }}>
                        <label className={label}>Зураг</label>
                        {blogImagePreview ? (
                          <div style={{ position: 'relative' }}>
                            <img src={blogImagePreview} alt="Preview" style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 10 }} />
                            <button type="button" onClick={()=>{setBlogImage(null);setBlogImagePreview('');}} style={{ position: 'absolute', top: 8, right: 8, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={14}/></button>
                          </div>
                        ) : (
                          <div className="upload-zone">
                            <input type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(f){setBlogImage(f);const r=new FileReader();r.onloadend=()=>setBlogImagePreview(r.result);r.readAsDataURL(f);}}} className="hidden" id="blog-img"/>
                            <label htmlFor="blog-img" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                              <Upload size={22} color="#9ca3af" /><span style={{ fontSize: 13, color: '#6b7280' }}>Зураг сонгох</span>
                            </label>
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '11px' }}>{editingBlog?'Шинэчлэх':'Нэмэх'}</button>
                        <button type="button" className="btn-secondary" onClick={()=>{setShowBlogForm(false);setEditingBlog(null);}}>Болих</button>
                      </div>
                    </form>
                  </div>
                )}

                {loading ? <Loading /> : blogs.length === 0 ? (
                  <div className="empty-state"><div className="icon"><BookOpen size={22} color="#cbd5e1" /></div><p>Блог байхгүй байна</p></div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {blogs.map(b=>(
                      <div key={b._id} className="table-row">
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{b.title}</span>
                            <span className={`status-badge status-${b.status}`}>
                              {b.status==='draft'?'Ноорог':b.status==='published'?'Нийтлэгдсэн':'Архивласан'}
                            </span>
                            {b.featured && <span className="status-badge" style={{ background: '#fef9c3', color: '#a16207', border: '1px solid #fde68a' }}>⭐ Онцлох</span>}
                          </div>
                          {b.excerpt && <div style={{ fontSize: 12, color: '#94a3b8' }}>{b.excerpt}</div>}
                          <div style={{ fontSize: 11, color: '#cbd5e1', marginTop: 4 }}>{formatDate(b.createdAt)}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn-icon edit" onClick={()=>handleEditBlog(b)}><Edit size={15}/></button>
                          <button className="btn-icon del" onClick={()=>handleDeleteBlog(b._id)}><Trash2 size={15}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── SERVICES ── */}
            {activeTab === 'services' && (
              <div>
                <div className="section-header">
                  <h2 className="section-title">Маркетингийн үйлчилгээ</h2>
                  <button className="btn-primary" style={{ background: '#7c3aed' }} onClick={()=>{setShowServiceForm(!showServiceForm);if(!showServiceForm){setEditingService(null);setServiceForm({name:'',description:'',shortDescription:'',features:'',price:'',category:'other',icon:'TrendingUp',featured:false});}}}>
                    <Plus size={15} /> {showServiceForm?'Хаах':'Нэмэх'}
                  </button>
                </div>

                {showServiceForm && (
                  <div className="form-panel">
                    <h3>{editingService ? '✏️ Үйлчилгээ засах' : '+ Шинэ үйлчилгээ'}</h3>
                    <form onSubmit={handleServiceSubmit}>
                      <div style={{ marginBottom: 16 }}>
                        <label className={label}>Нэр <span style={{color:'#ef4444'}}>*</span></label>
                        <input type="text" required value={serviceForm.name} onChange={e=>setServiceForm({...serviceForm,name:e.target.value})} className={inp} />
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <label className={label}>Товч тайлбар</label>
                        <textarea rows="2" value={serviceForm.shortDescription} onChange={e=>setServiceForm({...serviceForm,shortDescription:e.target.value})} maxLength="200" className={inp} style={{ resize: 'vertical' }} />
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <label className={label}>Дэлгэрэнгүй тайлбар <span style={{color:'#ef4444'}}>*</span></label>
                        <textarea rows="5" required value={serviceForm.description} onChange={e=>setServiceForm({...serviceForm,description:e.target.value})} className={inp} style={{ resize: 'vertical' }} />
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <label className={label}>Онцлогууд (мөр бүрд нэг)</label>
                        <textarea rows="4" value={serviceForm.features} onChange={e=>setServiceForm({...serviceForm,features:e.target.value})} className={inp} style={{ resize: 'vertical' }} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                          <label className={label}>Үнэ</label>
                          <input type="text" value={serviceForm.price} onChange={e=>setServiceForm({...serviceForm,price:e.target.value})} className={inp} placeholder="50,000₮/сар" />
                        </div>
                        <div>
                          <label className={label}>Ангилал</label>
                          <select value={serviceForm.category} onChange={e=>setServiceForm({...serviceForm,category:e.target.value})} className={`${inp} inp-select`}>
                            <option value="other">Бусад</option><option value="social-media">Сошиал медиа</option><option value="seo">SEO</option><option value="content">Контент</option><option value="advertising">Сурталчилгаа</option><option value="branding">Брэндинг</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <input type="checkbox" id="svcFeat" checked={serviceForm.featured} onChange={e=>setServiceForm({...serviceForm,featured:e.target.checked})} style={{ width: 15, height: 15, accentColor: '#7c3aed' }} />
                        <label htmlFor="svcFeat" style={{ fontSize: 13, fontWeight: 500, color: '#374151', cursor: 'pointer' }}>Онцлох үйлчилгээ</label>
                      </div>
                      <div style={{ marginBottom: 20 }}>
                        <label className={label}>Зураг</label>
                        {serviceImagePreview ? (
                          <div style={{ position: 'relative' }}>
                            <img src={serviceImagePreview} alt="Preview" style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 10 }} />
                            <button type="button" onClick={()=>{setServiceImage(null);setServiceImagePreview('');}} style={{ position: 'absolute', top: 8, right: 8, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={14}/></button>
                          </div>
                        ) : (
                          <div className="upload-zone">
                            <input type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(f){setServiceImage(f);const r=new FileReader();r.onloadend=()=>setServiceImagePreview(r.result);r.readAsDataURL(f);}}} className="hidden" id="svc-img"/>
                            <label htmlFor="svc-img" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                              <Upload size={22} color="#9ca3af" /><span style={{ fontSize: 13, color: '#6b7280' }}>Зураг сонгох</span>
                            </label>
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '11px', background: '#7c3aed' }}>{editingService?'Шинэчлэх':'Нэмэх'}</button>
                        <button type="button" className="btn-secondary" onClick={()=>{setShowServiceForm(false);setEditingService(null);}}>Болих</button>
                      </div>
                    </form>
                  </div>
                )}

                {loading ? <Loading /> : marketingServices.length === 0 ? (
                  <div className="empty-state"><div className="icon"><Briefcase size={22} color="#cbd5e1" /></div><p>Үйлчилгээ байхгүй байна</p></div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {marketingServices.map(s=>(
                      <div key={s._id} className="table-row">
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{s.name}</span>
                            <span className="status-badge" style={{ background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe' }}>
                              {s.category==='social-media'?'Сошиал':s.category==='seo'?'SEO':s.category==='content'?'Контент':s.category==='advertising'?'Реклам':s.category==='branding'?'Брэнд':'Бусад'}
                            </span>
                            {s.featured && <span className="status-badge" style={{ background: '#fef9c3', color: '#a16207', border: '1px solid #fde68a' }}>⭐ Онцлох</span>}
                          </div>
                          {s.shortDescription && <div style={{ fontSize: 12, color: '#94a3b8' }}>{s.shortDescription}</div>}
                          {s.price && <div style={{ fontSize: 13, fontWeight: 700, color: '#7c3aed', marginTop: 4 }}>{s.price}</div>}
                        </div>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn-icon edit" onClick={()=>handleEditService(s)}><Edit size={15}/></button>
                          <button className="btn-icon del" onClick={()=>handleDeleteService(s._id)}><Trash2 size={15}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </main>
        </div>
      </div>
    </>
  );
};

export default AdminPage;