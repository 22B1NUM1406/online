import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, Package, ShoppingCart, MessageSquare,
  Plus, Edit, Trash2, Upload, Mail, CheckCircle,
  XCircle, X, LayoutDashboard, Tag, BookOpen,
  Briefcase, TrendingUp, ChevronLeft, ChevronRight,
  Menu, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getAllOrders, updateOrderStatus, deleteOrder,
  getAllQuotations, updateQuotationStatus, deleteQuotation,
  createProduct, updateProduct, deleteProduct, getProducts,
  getAllContactMessages, updateContactMessageStatus, deleteContactMessage,
  getAllCategoriesFlat, createCategory, updateCategory, deleteCategory,
  getAllBlogs, createBlog, updateBlog, deleteBlog,
  getAllMarketingServices, createMarketingService, updateMarketingService,
  deleteMarketingService, getDashboardStats
} from '../services/api';
import { formatPrice, formatDate, getImageUrl } from '../utils/helpers';
import Loading from '../components/Loading';
import Notification from '../components/Notification';
import DashboardTab from '../components/DashboardTab';
import EnhancedTextarea from '../components/EnhancedTextarea';

/* ─────────────────────────────────────────────
   Reusable primitives
───────────────────────────────────────────── */
const Badge = ({ variant = 'default', children }) => {
  const variants = {
    default:    'bg-slate-100 text-slate-600',
    pending:    'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    paid:       'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    processing: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    completed:  'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    cancelled:  'bg-red-50 text-red-600 ring-1 ring-red-200',
    new:        'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    read:       'bg-slate-100 text-slate-500',
    replied:    'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    archived:   'bg-slate-100 text-slate-400',
    draft:      'bg-amber-50 text-amber-600 ring-1 ring-amber-200',
    published:  'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    featured:   'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200',
    purple:     'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variants[variant] || variants.default}`}>
      {children}
    </span>
  );
};

const Btn = ({ variant = 'primary', size = 'md', className = '', children, ...props }) => {
  const base = 'inline-flex items-center justify-center gap-1.5 font-medium rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-5 py-2.5 text-sm' };
  const variants = {
    primary:   'bg-slate-800 text-white hover:bg-slate-700 focus:ring-slate-500',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-300',
    danger:    'bg-white text-red-600 border border-red-200 hover:bg-red-50 focus:ring-red-300',
    ghost:     'text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:ring-slate-300',
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Field = ({ label, required, children, hint }) => (
  <div>
    {label && (
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}
    {children}
    {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
  </div>
);

const inputCls = 'w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-colors';
const selectCls = `${inputCls} pr-8 appearance-none cursor-pointer`;

const SectionHeader = ({ title, action }) => (
  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
    <h2 className="text-base font-semibold text-slate-800 tracking-tight">{title}</h2>
    {action}
  </div>
);

const FormPanel = ({ title, children }) => (
  <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-6">
    <h3 className="text-sm font-semibold text-slate-700 mb-4 pb-3 border-b border-slate-200">{title}</h3>
    {children}
  </div>
);

const EmptyState = ({ icon: Icon, message }) => (
  <div className="flex flex-col items-center justify-center py-16 text-slate-400">
    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
      <Icon size={20} className="text-slate-300" />
    </div>
    <p className="text-sm">{message}</p>
  </div>
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-300 hover:shadow-sm transition-all duration-150 ${className}`}>
    {children}
  </div>
);

const statusLabel = {
  pending: 'Хүлээгдэж буй', paid: 'Төлөгдсөн', processing: 'Үйлдвэрлэлд',
  completed: 'Дууссан', cancelled: 'Цуцлагдсан',
  new: 'Шинэ', read: 'Уншсан', replied: 'Хариулсан', archived: 'Архивласан',
  draft: 'Ноорог', published: 'Нийтлэгдсэн',
};

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const AdminPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [marketingServices, setMarketingServices] = useState([]);

  // Product form
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const emptyProduct = { name:'', price:'', category:'', description:'', material:'', size:'', format:'', stock:'', image:'', featured:false, discount:'', oldPrice:'' };
  const [productForm, setProductForm] = useState(emptyProduct);

  // Category form
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const emptyCategory = { name:'', description:'', parent:'', icon:'Package', order:0 };
  const [categoryForm, setCategoryForm] = useState(emptyCategory);

  // Blog form
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const emptyBlog = { title:'', excerpt:'', content:'', category:'other', tags:'', status:'published', featured:false };
  const [blogForm, setBlogForm] = useState(emptyBlog);
  const [blogImage, setBlogImage] = useState(null);
  const [blogImagePreview, setBlogImagePreview] = useState('');

  // Service form
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const emptyService = { name:'', description:'', shortDescription:'', features:'', price:'', category:'other', icon:'TrendingUp', featured:false };
  const [serviceForm, setServiceForm] = useState(emptyService);
  const [serviceImage, setServiceImage] = useState(null);
  const [serviceImagePreview, setServiceImagePreview] = useState('');

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return; }
    loadTabData(activeTab);
  }, [activeTab, isAdmin]);

  // Close mobile sidebar on tab change
  useEffect(() => { setMobileSidebarOpen(false); }, [activeTab]);

  const notify = (message, type = 'success') => setNotification({ message, type });

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

  /* ── Product handlers ── */
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      ['name','price','category','description','material','size','format','stock','featured'].forEach(k => fd.append(k, productForm[k]));
      if (productForm.discount) fd.append('discount', productForm.discount);
      if (productForm.oldPrice) fd.append('oldPrice', productForm.oldPrice);
      if (selectedImage) fd.append('image', selectedImage);
      else if (productForm.image) fd.append('image', productForm.image);
      if (editingProduct) { await updateProduct(editingProduct._id, fd); notify('Бүтээгдэхүүн шинэчлэгдлээ'); }
      else { await createProduct(fd); notify('Бүтээгдэхүүн нэмэгдлээ'); }
      setShowProductForm(false); setEditingProduct(null); setSelectedImage(null); setImagePreview(null);
      setProductForm(emptyProduct); loadData();
    } catch { notify('Алдаа гарлаа', 'error'); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Бүтээгдэхүүн устгах уу?')) return;
    try { await deleteProduct(id); notify('Устгагдлаа'); loadData(); }
    catch { notify('Алдаа гарлаа', 'error'); }
  };

  const handleEditProduct = (p) => {
    setEditingProduct(p);
    setProductForm({
      name:p.name, price:p.price,
      category: typeof p.category==='object' ? p.category._id : p.category,
      description:p.description||'', material:p.material||'', size:p.size||'',
      format:p.format||'', stock:p.stock||'', image:p.image||'',
      featured:p.featured||false, discount:p.discount||'', oldPrice:p.oldPrice||''
    });
    setImagePreview(p.image||null); setSelectedImage(null); setShowProductForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setSelectedImage(file); const r = new FileReader(); r.onloadend = () => setImagePreview(r.result); r.readAsDataURL(file); }
  };

  /* ── Order handlers ── */
  const handleUpdateOrderStatus = async (id, status) => {
    try { await updateOrderStatus(id, status); notify('Статус шинэчлэгдлээ'); loadData(); }
    catch { notify('Алдаа гарлаа', 'error'); }
  };
  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Захиалга устгах уу?')) return;
    try { await deleteOrder(id); notify('Устгагдлаа'); loadData(); }
    catch { notify('Алдаа гарлаа', 'error'); }
  };

  /* ── Quotation handlers ── */
  const handleDeleteQuotation = async (id) => {
    if (!window.confirm('Үнийн санал устгах уу?')) return;
    try { await deleteQuotation(id); notify('Устгагдлаа'); loadData(); }
    catch { notify('Алдаа гарлаа', 'error'); }
  };

  /* ── Message handlers ── */
  const handleMessageStatusUpdate = async (id, status) => {
    try { await updateContactMessageStatus(id, status); notify('Статус шинэчлэгдлээ'); loadData(); }
    catch { notify('Алдаа гарлаа', 'error'); }
  };
  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Мессеж устгах уу?')) return;
    try { await deleteContactMessage(id); notify('Устгагдлаа'); loadData(); }
    catch { notify('Алдаа гарлаа', 'error'); }
  };

  /* ── Category handlers ── */
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) { await updateCategory(editingCategory._id, categoryForm); notify('Ангилал шинэчлэгдлээ'); }
      else { await createCategory(categoryForm); notify('Ангилал нэмэгдлээ'); }
      setShowCategoryForm(false); setEditingCategory(null); setCategoryForm(emptyCategory); loadData();
    } catch (e) { notify(e.response?.data?.message || 'Алдаа гарлаа', 'error'); }
  };
  const handleEditCategory = (c) => {
    setEditingCategory(c);
    setCategoryForm({ name:c.name, description:c.description||'', parent:c.parent?._id||'', icon:c.icon||'Package', order:c.order||0 });
    setShowCategoryForm(true);
  };
  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Ангилал устгах уу?')) return;
    try { await deleteCategory(id); notify('Устгагдлаа'); loadData(); }
    catch (e) { notify(e.response?.data?.message || 'Алдаа гарлаа', 'error'); }
  };

  /* ── Blog handlers ── */
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('title', blogForm.title); fd.append('excerpt', blogForm.excerpt);
      fd.append('content', blogForm.content); fd.append('category', blogForm.category);
      fd.append('tags', blogForm.tags ? blogForm.tags.split(',').map(t=>t.trim()).join(',') : '');
      fd.append('status', blogForm.status); fd.append('featured', blogForm.featured);
      if (blogImage) fd.append('file', blogImage);
      if (editingBlog) { await updateBlog(editingBlog._id, fd); notify('Блог шинэчлэгдлээ'); }
      else { await createBlog(fd); notify('Блог нэмэгдлээ'); }
      setShowBlogForm(false); setEditingBlog(null); setBlogForm(emptyBlog);
      setBlogImage(null); setBlogImagePreview(''); loadData();
    } catch (e) { notify(e.response?.data?.message || 'Алдаа гарлаа', 'error'); }
  };
  const handleEditBlog = (b) => {
    setEditingBlog(b);
    setBlogForm({ title:b.title, excerpt:b.excerpt||'', content:b.content, category:b.category, tags:b.tags?b.tags.join(', '):'', status:b.status, featured:b.featured||false });
    if (b.image) setBlogImagePreview(b.image);
    setShowBlogForm(true);
  };
  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Блог устгах уу?')) return;
    try { await deleteBlog(id); notify('Устгагдлаа'); loadData(); }
    catch (e) { notify(e.response?.data?.message || 'Алдаа гарлаа', 'error'); }
  };

  /* ── Service handlers ── */
  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('name', serviceForm.name); fd.append('description', serviceForm.description);
      fd.append('shortDescription', serviceForm.shortDescription);
      fd.append('features', serviceForm.features ? serviceForm.features.split('\n').map(f=>f.trim()).filter(Boolean).join('\n') : '');
      fd.append('price', serviceForm.price); fd.append('category', serviceForm.category);
      fd.append('icon', serviceForm.icon); fd.append('featured', serviceForm.featured);
      if (serviceImage) fd.append('file', serviceImage);
      if (editingService) { await updateMarketingService(editingService._id, fd); notify('Үйлчилгээ шинэчлэгдлээ'); }
      else { await createMarketingService(fd); notify('Үйлчилгээ нэмэгдлээ'); }
      setShowServiceForm(false); setEditingService(null); setServiceForm(emptyService);
      setServiceImage(null); setServiceImagePreview(''); loadData();
    } catch (e) { notify(e.response?.data?.message || 'Алдаа гарлаа', 'error'); }
  };
  const handleEditService = (s) => {
    setEditingService(s);
    setServiceForm({ name:s.name, description:s.description, shortDescription:s.shortDescription||'', features:s.features?s.features.join('\n'):'', price:s.price||'', category:s.category, icon:s.icon||'TrendingUp', featured:s.featured||false });
    if (s.image) setServiceImagePreview(s.image);
    setShowServiceForm(true);
  };
  const handleDeleteService = async (id) => {
    if (!window.confirm('Үйлчилгээ устгах уу?')) return;
    try { await deleteMarketingService(id); notify('Устгагдлаа'); loadData(); }
    catch (e) { notify(e.response?.data?.message || 'Алдаа гарлаа', 'error'); }
  };

  /* ── Nav config ── */
  const navItems = [
    { id: 'dashboard',  label: 'Самбар',          icon: LayoutDashboard },
    { id: 'products',   label: 'Бүтээгдэхүүн',    icon: Package,         stat: products.length },
    { id: 'orders',     label: 'Захиалга',         icon: ShoppingCart,    stat: orders.length },
    { id: 'quotations', label: 'Үнийн санал',      icon: TrendingUp,      badge: quotations.filter(q=>q.status==='pending').length },
    { id: 'messages',   label: 'Мессеж',           icon: Mail,            badge: contactMessages.filter(m=>m.status==='new').length },
    { id: 'categories', label: 'Ангилал',          icon: Tag },
    { id: 'blogs',      label: 'Блог',             icon: BookOpen,        stat: blogs.length },
    { id: 'services',   label: 'Үйлчилгээ',        icon: Briefcase,       stat: marketingServices.length },
  ];

  const activeNav = navItems.find(n => n.id === activeTab);
  const totalAlerts = navItems.reduce((s, n) => s + (n.badge || 0), 0);

  /* ── Sidebar (shared between mobile & desktop) ── */
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-700">
        <div className="w-8 h-8 bg-slate-100 rounded-md flex items-center justify-center flex-shrink-0">
          <span className="text-slate-800 font-bold text-sm">A</span>
        </div>
        {sidebarOpen && (
          <div className="overflow-hidden">
            <div className="text-white font-semibold text-sm leading-tight tracking-tight">Admin Panel</div>
            <div className="text-slate-400 text-xs truncate max-w-[140px]">{user?.name}</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {sidebarOpen && (
          <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">Цэс</p>
        )}
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={!sidebarOpen ? item.label : undefined}
              className={`
                w-full flex items-center rounded-md transition-all duration-150
                ${sidebarOpen ? 'gap-3 px-3 py-2.5' : 'justify-center p-2.5'}
                ${isActive
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}
              `}
            >
              <Icon size={16} className="flex-shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {item.badge}
                    </span>
                  )}
                  {!item.badge && item.stat > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-500'}`}>
                      {item.stat}
                    </span>
                  )}
                </>
              )}
              {!sidebarOpen && item.badge > 0 && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 pb-4 pt-2 border-t border-slate-700">
        <button
          onClick={() => { logout(); navigate('/'); }}
          className={`
            w-full flex items-center rounded-md text-slate-400 hover:text-red-400 hover:bg-red-500/10
            transition-all duration-150
            ${sidebarOpen ? 'gap-3 px-3 py-2.5' : 'justify-center p-2.5'}
          `}
          title={!sidebarOpen ? 'Гарах' : undefined}
        >
          <LogOut size={16} className="flex-shrink-0" />
          {sidebarOpen && <span className="text-sm font-medium">Гарах</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      {notification && (
        <Notification type={notification.type} message={notification.message} onClose={() => setNotification(null)} />
      )}

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 flex flex-col
        transform transition-transform duration-250 ease-in-out lg:hidden
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-slate-100 rounded flex items-center justify-center">
              <span className="text-slate-800 font-bold text-xs">A</span>
            </div>
            <span className="text-white font-semibold text-sm">Admin Panel</span>
          </div>
          <button onClick={() => setMobileSidebarOpen(false)} className="text-slate-400 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                  ${isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
              >
                <Icon size={16} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge > 0 && <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>}
              </button>
            );
          })}
        </nav>
        <div className="px-2 pb-4 border-t border-slate-700 pt-2">
          <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-sm transition-colors">
            <LogOut size={16} /><span>Гарах</span>
          </button>
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className={`
        hidden lg:flex flex-col flex-shrink-0 bg-slate-800
        transition-all duration-250 ease-in-out relative
        ${sidebarOpen ? 'w-56' : 'w-14'}
      `}>
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-[72px] w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 shadow-sm z-10 transition-colors"
        >
          {sidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="flex-shrink-0 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-md text-slate-500 hover:bg-slate-100"
            >
              <Menu size={18} />
            </button>
            <div className="hidden sm:flex items-center gap-1.5 text-sm">
              <span className="text-slate-400">Удирдлага</span>
              <ChevronRight size={14} className="text-slate-300" />
              <span className="text-slate-700 font-medium">{activeNav?.label}</span>
            </div>
            <span className="sm:hidden text-slate-700 font-medium text-sm">{activeNav?.label}</span>
          </div>

          <div className="flex items-center gap-2">
            {totalAlerts > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold border border-red-100">
                <AlertCircle size={12} />
                <span>{totalAlerts} шинэ</span>
              </div>
            )}
            <div className="w-8 h-8 bg-slate-800 rounded-md flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-5xl mx-auto">

            {/* Dashboard */}
            {activeTab === 'dashboard' && <DashboardTab onTabChange={setActiveTab} />}

            {/* ── PRODUCTS ── */}
            {activeTab === 'products' && (
              <div>
                <SectionHeader
                  title="Бүтээгдэхүүн удирдах"
                  action={
                    <Btn onClick={() => { setShowProductForm(!showProductForm); if (showProductForm) { setEditingProduct(null); setProductForm(emptyProduct); setSelectedImage(null); setImagePreview(null); } }}>
                      <Plus size={14} /> {showProductForm ? 'Хаах' : 'Нэмэх'}
                    </Btn>
                  }
                />

                {showProductForm && (
                  <FormPanel title={editingProduct ? 'Бүтээгдэхүүн засах' : 'Шинэ бүтээгдэхүүн'}>
                    <form onSubmit={handleProductSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Нэр" required>
                          <input type="text" placeholder="Бүтээгдэхүүний нэр" value={productForm.name} required onChange={e=>setProductForm({...productForm,name:e.target.value})} className={inputCls} />
                        </Field>
                        <Field label="Үнэ (₮)" required>
                          <input type="number" placeholder="50000" value={productForm.price} required onChange={e=>setProductForm({...productForm,price:e.target.value})} className={inputCls} />
                        </Field>
                        <Field label="Ангилал" required>
                          <select value={productForm.category} onChange={e=>setProductForm({...productForm,category:e.target.value})} required className={selectCls}>
                            <option value="">Сонгох...</option>
                            {categories.filter(c=>!c.parent).map(cat=>(
                              <optgroup key={cat._id} label={cat.name}>
                                <option value={cat._id}>{cat.name}</option>
                                {categories.filter(s=>s.parent?._id===cat._id).map(s=><option key={s._id} value={s._id}>  {s.name}</option>)}
                              </optgroup>
                            ))}
                          </select>
                        </Field>
                        <Field label="Нөөц">
                          <input type="number" placeholder="1000" value={productForm.stock} onChange={e=>setProductForm({...productForm,stock:e.target.value})} className={inputCls} />
                        </Field>
                        <Field label="Хэмжээ">
                          <input type="text" placeholder="A4, 85x54mm" value={productForm.size} onChange={e=>setProductForm({...productForm,size:e.target.value})} className={inputCls} />
                        </Field>
                        <Field label="Материал">
                          <input type="text" placeholder="300gsm цаас" value={productForm.material} onChange={e=>setProductForm({...productForm,material:e.target.value})} className={inputCls} />
                        </Field>
                      </div>

                      <Field label="Тайлбар">
                        <EnhancedTextarea value={productForm.description} onChange={e=>setProductForm({...productForm,description:e.target.value})}
                          placeholder="Бүтээгдэхүүний дэлгэрэнгүй тайлбар..." rows={4} maxLength={2000} showInstructions />
                      </Field>

                      <Field label="Зураг">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="productImage" />
                            <label htmlFor="productImage" className="flex items-center gap-2 w-full px-3 py-2.5 border-2 border-dashed border-slate-200 rounded-md hover:border-slate-400 cursor-pointer transition-colors text-sm text-slate-500 hover:text-slate-700">
                              <Upload size={16} />
                              <span>{selectedImage ? selectedImage.name : 'Зураг сонгох'}</span>
                            </label>
                          </div>
                          {imagePreview && (
                            <div className="w-16 h-16 rounded-md overflow-hidden border border-slate-200 flex-shrink-0">
                              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </Field>

                      <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
                        <input type="checkbox" id="featured" checked={productForm.featured} onChange={e=>setProductForm({...productForm,featured:e.target.checked})} className="w-4 h-4 accent-slate-700 rounded" />
                        <label htmlFor="featured" className="text-sm font-medium text-amber-800 cursor-pointer">Онцлох бүтээгдэхүүн — нүүр хуудсанд харагдана</label>
                      </div>

                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-md">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Хямдрал</p>
                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Хямдралын хувь (%)">
                            <input type="number" min="0" max="100" value={productForm.discount}
                              onChange={e=>{const d=e.target.value; setProductForm(prev=>{const up={...prev,discount:d}; if(d&&prev.price) up.oldPrice=Math.round(parseFloat(prev.price)/(1-parseFloat(d)/100)).toString(); return up;})}}
                              className={inputCls} />
                          </Field>
                          <Field label="Хуучин үнэ (₮)">
                            <input type="number" value={productForm.oldPrice} onChange={e=>setProductForm({...productForm,oldPrice:e.target.value})} className={inputCls} />
                          </Field>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <Btn type="submit" className="flex-1 justify-center py-2">{editingProduct ? 'Шинэчлэх' : 'Нэмэх'}</Btn>
                        <Btn type="button" variant="secondary" onClick={()=>{setShowProductForm(false);setEditingProduct(null);setSelectedImage(null);setImagePreview(null);setProductForm(emptyProduct);}}>Болих</Btn>
                      </div>
                    </form>
                  </FormPanel>
                )}

                {loading ? <Loading /> : products.length === 0 ? <EmptyState icon={Package} message="Бүтээгдэхүүн байхгүй байна" /> : (
                  <div className="space-y-2">
                    {products.map(p => (
                      <Card key={p._id} className="flex items-center gap-4">
                        <img src={getImageUrl(p.image)} alt={p.name} className="w-12 h-12 object-cover rounded-md border border-slate-100 flex-shrink-0" onError={e=>{e.target.src='/placeholder.png';}} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{p.name}</p>
                          <p className="text-sm font-bold text-slate-700">{formatPrice(p.price)}</p>
                          <p className="text-xs text-slate-400">{typeof p.category==='object'?p.category?.name:p.category}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Btn variant="ghost" size="sm" onClick={()=>handleEditProduct(p)}><Edit size={14}/></Btn>
                          <Btn variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={()=>handleDeleteProduct(p._id)}><Trash2 size={14}/></Btn>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── ORDERS ── */}
            {activeTab === 'orders' && (
              <div>
                <SectionHeader title="Захиалга удирдах" />
                {loading ? <Loading /> : orders.length === 0 ? <EmptyState icon={ShoppingCart} message="Захиалга байхгүй байна" /> : (
                  <div className="space-y-2">
                    {orders.map(o => (
                      <Card key={o._id}>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-mono font-semibold text-slate-700">#{o._id.slice(-6).toUpperCase()}</span>
                              <Badge variant={o.status}>{statusLabel[o.status] || o.status}</Badge>
                            </div>
                            <p className="text-sm text-slate-600">{o.shippingInfo.name} — {o.shippingInfo.phone}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{formatDate(o.createdAt)}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-base font-bold text-slate-800">{formatPrice(o.total)}</span>
                            <select value={o.status} onChange={e=>handleUpdateOrderStatus(o._id,e.target.value)} className="text-xs border border-slate-200 rounded-md px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300">
                              <option value="pending">Хүлээгдэж буй</option>
                              <option value="paid">Төлөгдсөн</option>
                              <option value="processing">Үйлдвэрлэлд</option>
                              <option value="completed">Дууссан</option>
                              <option value="cancelled">Цуцлагдсан</option>
                            </select>
                            <Btn variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={()=>handleDeleteOrder(o._id)}><Trash2 size={14}/></Btn>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── QUOTATIONS ── */}
            {activeTab === 'quotations' && (
              <div>
                <SectionHeader title="Үнийн санал удирдах" />
                {loading ? <Loading /> : quotations.length === 0 ? <EmptyState icon={TrendingUp} message="Үнийн санал байхгүй байна" /> : (
                  <div className="space-y-2">
                    {quotations.map(q => (
                      <Card key={q._id}>
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-sm font-semibold text-slate-800">{q.name}</span>
                              <Badge variant={q.status === 'pending' ? 'pending' : 'replied'}>{q.status==='pending'?'Хүлээгдэж буй':'Хариулсан'}</Badge>
                            </div>
                            <p className="text-xs text-slate-400 mb-2">{q.phone} · {q.email}</p>
                            <p className="text-sm text-slate-600 mb-1"><span className="font-medium text-slate-700">Төрөл:</span> {q.productType}</p>
                            <p className="text-sm text-slate-500 bg-slate-50 px-3 py-2 rounded-md">{q.description}</p>
                            {q.designFile && (
                              <div className="mt-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md">
                                <p className="text-xs font-medium text-slate-500 mb-1">Дизайн файл</p>
                                <a href={getImageUrl(q.designFile.fileUrl)} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline font-medium">
                                  {q.designFile.fileName}
                                </a>
                              </div>
                            )}
                          </div>
                          <Btn variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600 flex-shrink-0" onClick={()=>handleDeleteQuotation(q._id)}><Trash2 size={14}/></Btn>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── MESSAGES ── */}
            {activeTab === 'messages' && (
              <div>
                <SectionHeader title="Холбоо барих мессежүүд" />
                {loading ? <Loading /> : contactMessages.length === 0 ? <EmptyState icon={Mail} message="Мессеж байхгүй байна" /> : (
                  <div className="space-y-2">
                    {contactMessages.map(m => (
                      <Card key={m._id}>
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-sm font-semibold text-slate-800">{m.name}</span>
                              <Badge variant={m.status}>{statusLabel[m.status] || m.status}</Badge>
                            </div>
                            <p className="text-xs text-slate-400 mb-2">{m.email} · {formatDate(m.createdAt)}</p>
                            <p className="text-sm font-medium text-slate-700 mb-1">{m.subject}</p>
                            <p className="text-sm text-slate-500 bg-slate-50 px-3 py-2 rounded-md">{m.message}</p>
                            {m.adminReply && (
                              <div className="mt-2 px-3 py-2 bg-emerald-50 border-l-2 border-emerald-400 rounded-r-md">
                                <p className="text-xs font-semibold text-emerald-700 mb-0.5">Админ хариу</p>
                                <p className="text-sm text-slate-600">{m.adminReply.message}</p>
                                <p className="text-xs text-emerald-400 mt-1">{formatDate(m.adminReply.repliedAt)}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-1 flex-shrink-0">
                            {m.status === 'new' && (
                              <Btn variant="ghost" size="sm" className="text-blue-500 hover:bg-blue-50" onClick={()=>handleMessageStatusUpdate(m._id,'read')} title="Уншсан">
                                <CheckCircle size={14}/>
                              </Btn>
                            )}
                            {m.status !== 'archived' && (
                              <Btn variant="ghost" size="sm" onClick={()=>handleMessageStatusUpdate(m._id,'archived')} title="Архивлах">
                                <XCircle size={14}/>
                              </Btn>
                            )}
                            <Btn variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={()=>handleDeleteMessage(m._id)} title="Устгах">
                              <Trash2 size={14}/>
                            </Btn>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── CATEGORIES ── */}
            {activeTab === 'categories' && (
              <div>
                <SectionHeader
                  title="Ангилал удирдах"
                  action={
                    <Btn onClick={()=>{setShowCategoryForm(!showCategoryForm); if(!showCategoryForm){setEditingCategory(null);setCategoryForm(emptyCategory);}}}>
                      <Plus size={14}/> {showCategoryForm?'Хаах':'Нэмэх'}
                    </Btn>
                  }
                />

                {showCategoryForm && (
                  <FormPanel title={editingCategory ? 'Ангилал засах' : 'Шинэ ангилал'}>
                    <form onSubmit={handleCategorySubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Нэр" required>
                          <input type="text" required value={categoryForm.name} onChange={e=>setCategoryForm({...categoryForm,name:e.target.value})} className={inputCls} placeholder="Ангиллын нэр" />
                        </Field>
                        <Field label="Үндсэн ангилал">
                          <select value={categoryForm.parent} onChange={e=>setCategoryForm({...categoryForm,parent:e.target.value})} className={selectCls}>
                            <option value="">-- Үндсэн ангилал --</option>
                            {categories.filter(c=>!c.parent).map(c=><option key={c._id} value={c._id}>{c.name}</option>)}
                          </select>
                        </Field>
                        <Field label="Icon" hint="lucide-react icon нэр">
                          <input type="text" value={categoryForm.icon} onChange={e=>setCategoryForm({...categoryForm,icon:e.target.value})} className={inputCls} placeholder="Package" />
                        </Field>
                        <Field label="Дараалал">
                          <input type="number" value={categoryForm.order} onChange={e=>setCategoryForm({...categoryForm,order:parseInt(e.target.value)||0})} className={inputCls} />
                        </Field>
                      </div>
                      <Field label="Тайлбар">
                        <textarea rows="3" value={categoryForm.description} onChange={e=>setCategoryForm({...categoryForm,description:e.target.value})} className={`${inputCls} resize-y`} />
                      </Field>
                      <div className="flex gap-2 pt-1">
                        <Btn type="submit" className="flex-1 justify-center py-2">{editingCategory?'Шинэчлэх':'Нэмэх'}</Btn>
                        <Btn type="button" variant="secondary" onClick={()=>{setShowCategoryForm(false);setEditingCategory(null);}}>Болих</Btn>
                      </div>
                    </form>
                  </FormPanel>
                )}

                {loading ? <Loading /> : categories.length === 0 ? <EmptyState icon={Tag} message="Ангилал байхгүй байна" /> : (
                  <div className="space-y-2">
                    {categories.filter(c=>!c.parent).map(cat=>(
                      <div key={cat._id}>
                        <Card className="border-l-2 border-l-slate-700">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-800">{cat.name}</p>
                              {cat.description && <p className="text-xs text-slate-400 mt-0.5">{cat.description}</p>}
                              <p className="text-xs text-slate-300 mt-0.5">Icon: {cat.icon} · Order: {cat.order}</p>
                            </div>
                            <div className="flex gap-1">
                              <Btn variant="ghost" size="sm" onClick={()=>handleEditCategory(cat)}><Edit size={14}/></Btn>
                              <Btn variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={()=>handleDeleteCategory(cat._id)}><Trash2 size={14}/></Btn>
                            </div>
                          </div>
                        </Card>
                        {categories.filter(s=>s.parent?._id===cat._id).map(s=>(
                          <Card key={s._id} className="ml-6 mt-1.5 border-l-2 border-l-slate-200 bg-slate-50/50">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-700">{s.name}</p>
                                {s.description && <p className="text-xs text-slate-400">{s.description}</p>}
                              </div>
                              <div className="flex gap-1">
                                <Btn variant="ghost" size="sm" onClick={()=>handleEditCategory(s)}><Edit size={14}/></Btn>
                                <Btn variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={()=>handleDeleteCategory(s._id)}><Trash2 size={14}/></Btn>
                              </div>
                            </div>
                          </Card>
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
                <SectionHeader
                  title="Блог удирдах"
                  action={
                    <Btn onClick={()=>{setShowBlogForm(!showBlogForm);if(!showBlogForm){setEditingBlog(null);setBlogForm(emptyBlog);}}}>
                      <Plus size={14}/> {showBlogForm?'Хаах':'Нэмэх'}
                    </Btn>
                  }
                />

                {showBlogForm && (
                  <FormPanel title={editingBlog ? 'Блог засах' : 'Шинэ блог'}>
                    <form onSubmit={handleBlogSubmit} className="space-y-4">
                      <Field label="Гарчиг" required>
                        <input type="text" required value={blogForm.title} onChange={e=>setBlogForm({...blogForm,title:e.target.value})} className={inputCls} placeholder="Блогийн гарчиг" />
                      </Field>
                      <Field label="Товч агуулга">
                        <textarea rows="2" value={blogForm.excerpt} onChange={e=>setBlogForm({...blogForm,excerpt:e.target.value})} maxLength="500" className={`${inputCls} resize-y`} />
                      </Field>
                      <Field label="Агуулга" required>
                        <textarea rows="10" required value={blogForm.content} onChange={e=>setBlogForm({...blogForm,content:e.target.value})} className={`${inputCls} resize-y`} />
                      </Field>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Ангилал">
                          <select value={blogForm.category} onChange={e=>setBlogForm({...blogForm,category:e.target.value})} className={selectCls}>
                            <option value="other">Бусад</option>
                            <option value="news">Мэдээ</option>
                            <option value="tutorial">Заавар</option>
                            <option value="tips">Зөвлөмж</option>
                            <option value="case-study">Туршилт</option>
                            <option value="announcement">Мэдэгдэл</option>
                          </select>
                        </Field>
                        <Field label="Статус">
                          <select value={blogForm.status} onChange={e=>setBlogForm({...blogForm,status:e.target.value})} className={selectCls}>
                            <option value="draft">Ноорог</option>
                            <option value="published">Нийтлэгдсэн</option>
                            <option value="archived">Архивласан</option>
                          </select>
                        </Field>
                      </div>
                      <Field label="Tags" hint="Таслалаар тусгаарлана: хэвлэл, дизайн">
                        <input type="text" value={blogForm.tags} onChange={e=>setBlogForm({...blogForm,tags:e.target.value})} className={inputCls} placeholder="хэвлэл, дизайн" />
                      </Field>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="blogFeatured" checked={blogForm.featured} onChange={e=>setBlogForm({...blogForm,featured:e.target.checked})} className="w-4 h-4 accent-slate-700 rounded" />
                        <label htmlFor="blogFeatured" className="text-sm font-medium text-slate-700 cursor-pointer">Онцлох блог</label>
                      </div>
                      <Field label="Зураг">
                        {blogImagePreview ? (
                          <div className="relative">
                            <img src={blogImagePreview} alt="Preview" className="w-full h-44 object-cover rounded-md" />
                            <button type="button" onClick={()=>{setBlogImage(null);setBlogImagePreview('');}} className="absolute top-2 right-2 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-red-500 shadow-sm">
                              <X size={14}/>
                            </button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-slate-200 rounded-md p-6 text-center hover:border-slate-400 transition-colors cursor-pointer">
                            <input type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(f){setBlogImage(f);const r=new FileReader();r.onloadend=()=>setBlogImagePreview(r.result);r.readAsDataURL(f);}}} className="hidden" id="blog-img"/>
                            <label htmlFor="blog-img" className="cursor-pointer flex flex-col items-center gap-2 text-slate-400">
                              <Upload size={20}/><span className="text-sm">Зураг сонгох</span>
                            </label>
                          </div>
                        )}
                      </Field>
                      <div className="flex gap-2 pt-1">
                        <Btn type="submit" className="flex-1 justify-center py-2">{editingBlog?'Шинэчлэх':'Нэмэх'}</Btn>
                        <Btn type="button" variant="secondary" onClick={()=>{setShowBlogForm(false);setEditingBlog(null);}}>Болих</Btn>
                      </div>
                    </form>
                  </FormPanel>
                )}

                {loading ? <Loading /> : blogs.length === 0 ? <EmptyState icon={BookOpen} message="Блог байхгүй байна" /> : (
                  <div className="space-y-2">
                    {blogs.map(b=>(
                      <Card key={b._id} className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-sm font-semibold text-slate-800">{b.title}</span>
                            <Badge variant={b.status}>{statusLabel[b.status] || b.status}</Badge>
                            {b.featured && <Badge variant="featured">Онцлох</Badge>}
                          </div>
                          {b.excerpt && <p className="text-xs text-slate-400 truncate">{b.excerpt}</p>}
                          <p className="text-xs text-slate-300 mt-1">{formatDate(b.createdAt)}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Btn variant="ghost" size="sm" onClick={()=>handleEditBlog(b)}><Edit size={14}/></Btn>
                          <Btn variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={()=>handleDeleteBlog(b._id)}><Trash2 size={14}/></Btn>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── SERVICES ── */}
            {activeTab === 'services' && (
              <div>
                <SectionHeader
                  title="Маркетингийн үйлчилгээ"
                  action={
                    <Btn onClick={()=>{setShowServiceForm(!showServiceForm);if(!showServiceForm){setEditingService(null);setServiceForm(emptyService);}}}>
                      <Plus size={14}/> {showServiceForm?'Хаах':'Нэмэх'}
                    </Btn>
                  }
                />

                {showServiceForm && (
                  <FormPanel title={editingService ? 'Үйлчилгээ засах' : 'Шинэ үйлчилгээ'}>
                    <form onSubmit={handleServiceSubmit} className="space-y-4">
                      <Field label="Нэр" required>
                        <input type="text" required value={serviceForm.name} onChange={e=>setServiceForm({...serviceForm,name:e.target.value})} className={inputCls} />
                      </Field>
                      <Field label="Товч тайлбар">
                        <textarea rows="2" value={serviceForm.shortDescription} onChange={e=>setServiceForm({...serviceForm,shortDescription:e.target.value})} maxLength="200" className={`${inputCls} resize-y`} />
                      </Field>
                      <Field label="Дэлгэрэнгүй тайлбар" required>
                        <textarea rows="5" required value={serviceForm.description} onChange={e=>setServiceForm({...serviceForm,description:e.target.value})} className={`${inputCls} resize-y`} />
                      </Field>
                      <Field label="Онцлогууд" hint="Мөр бүрд нэг онцлог">
                        <textarea rows="4" value={serviceForm.features} onChange={e=>setServiceForm({...serviceForm,features:e.target.value})} className={`${inputCls} resize-y`} />
                      </Field>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Үнэ">
                          <input type="text" value={serviceForm.price} onChange={e=>setServiceForm({...serviceForm,price:e.target.value})} className={inputCls} placeholder="50,000₮/сар" />
                        </Field>
                        <Field label="Ангилал">
                          <select value={serviceForm.category} onChange={e=>setServiceForm({...serviceForm,category:e.target.value})} className={selectCls}>
                            <option value="other">Бусад</option>
                            <option value="social-media">Сошиал медиа</option>
                            <option value="seo">SEO</option>
                            <option value="content">Контент</option>
                            <option value="advertising">Сурталчилгаа</option>
                            <option value="branding">Брэндинг</option>
                          </select>
                        </Field>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="svcFeat" checked={serviceForm.featured} onChange={e=>setServiceForm({...serviceForm,featured:e.target.checked})} className="w-4 h-4 accent-slate-700 rounded" />
                        <label htmlFor="svcFeat" className="text-sm font-medium text-slate-700 cursor-pointer">Онцлох үйлчилгээ</label>
                      </div>
                      <Field label="Зураг">
                        {serviceImagePreview ? (
                          <div className="relative">
                            <img src={serviceImagePreview} alt="Preview" className="w-full h-44 object-cover rounded-md" />
                            <button type="button" onClick={()=>{setServiceImage(null);setServiceImagePreview('');}} className="absolute top-2 right-2 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-red-500 shadow-sm">
                              <X size={14}/>
                            </button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-slate-200 rounded-md p-6 text-center hover:border-slate-400 transition-colors">
                            <input type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(f){setServiceImage(f);const r=new FileReader();r.onloadend=()=>setServiceImagePreview(r.result);r.readAsDataURL(f);}}} className="hidden" id="svc-img"/>
                            <label htmlFor="svc-img" className="cursor-pointer flex flex-col items-center gap-2 text-slate-400">
                              <Upload size={20}/><span className="text-sm">Зураг сонгох</span>
                            </label>
                          </div>
                        )}
                      </Field>
                      <div className="flex gap-2 pt-1">
                        <Btn type="submit" className="flex-1 justify-center py-2">{editingService?'Шинэчлэх':'Нэмэх'}</Btn>
                        <Btn type="button" variant="secondary" onClick={()=>{setShowServiceForm(false);setEditingService(null);}}>Болих</Btn>
                      </div>
                    </form>
                  </FormPanel>
                )}

                {loading ? <Loading /> : marketingServices.length === 0 ? <EmptyState icon={Briefcase} message="Үйлчилгээ байхгүй байна" /> : (
                  <div className="space-y-2">
                    {marketingServices.map(s=>(
                      <Card key={s._id} className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-sm font-semibold text-slate-800">{s.name}</span>
                            <Badge variant="purple">
                              {s.category==='social-media'?'Сошиал':s.category==='seo'?'SEO':s.category==='content'?'Контент':s.category==='advertising'?'Реклам':s.category==='branding'?'Брэнд':'Бусад'}
                            </Badge>
                            {s.featured && <Badge variant="featured">Онцлох</Badge>}
                          </div>
                          {s.shortDescription && <p className="text-xs text-slate-400 truncate">{s.shortDescription}</p>}
                          {s.price && <p className="text-xs font-semibold text-slate-600 mt-1">{s.price}</p>}
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Btn variant="ghost" size="sm" onClick={()=>handleEditService(s)}><Edit size={14}/></Btn>
                          <Btn variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={()=>handleDeleteService(s._id)}><Trash2 size={14}/></Btn>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;