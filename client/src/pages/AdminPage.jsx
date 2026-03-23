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

/* ─── Global styles ─── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

  .adm-root {
    font-family: 'Outfit', system-ui, sans-serif;
    background: #f1f5f9;
    min-height: 100vh;
  }

  /* ── Sidebar ── */
  .adm-sidebar {
    background: #ffffff;
    border-right: 1px solid #e2e8f0;
    flex-shrink: 0;
    transition: width 0.25s cubic-bezier(.4,0,.2,1);
    box-shadow: 2px 0 8px rgba(0,0,0,0.04);
  }
  .adm-sidebar-open  { width: 220px; }
  .adm-sidebar-close { width: 60px; }

  .adm-nav-item {
    display: flex; align-items: center; border-radius: 10px;
    transition: background 0.15s, color 0.15s;
    cursor: pointer; border: none; background: transparent;
    color: #64748b; width: 100%;
  }
  .adm-nav-item:hover { background: #f1f5f9; color: #1e293b; }
  .adm-nav-item.active {
    background: #eff6ff;
    color: #1d4ed8;
    box-shadow: inset 0 0 0 1px #dbeafe;
  }

  /* ── Topbar ── */
  .adm-topbar {
    background: #ffffff;
    border-bottom: 1px solid #e2e8f0;
    height: 56px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }

  /* ── Cards ── */
  .adm-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    transition: border-color 0.2s, box-shadow 0.18s, transform 0.18s;
  }
  .adm-card:hover {
    border-color: #cbd5e1;
    box-shadow: 0 4px 16px rgba(0,0,0,0.07);
    transform: translateY(-1px);
  }

  /* ── Form panel ── */
  .adm-formpanel {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    animation: adm-fadein 0.25s ease both;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  @keyframes adm-fadein {
    from { opacity:0; transform:translateY(-8px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* ── Inputs ── */
  .adm-input {
    width: 100%; padding: 9px 13px; font-size: 13.5px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 9px; color: #1e293b;
    font-family: 'Outfit', sans-serif;
    transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
    outline: none;
  }
  .adm-input::placeholder { color: #94a3b8; }
  .adm-input:focus {
    border-color: #3b82f6;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.10);
  }
  .adm-select { appearance: none; cursor: pointer; }
  .adm-select option { background: #ffffff; color: #1e293b; }

  /* ── Buttons ── */
  .adm-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    font-family: 'Outfit', sans-serif; font-weight: 500; font-size: 13px;
    border-radius: 9px; border: none; cursor: pointer;
    transition: all 0.15s; outline: none;
  }
  .adm-btn:disabled { opacity: 0.45; cursor: not-allowed; }

  .adm-btn-primary {
    background: #2563eb;
    border: 1px solid #2563eb;
    color: #ffffff;
    padding: 8px 16px;
  }
  .adm-btn-primary:hover {
    background: #1d4ed8;
    border-color: #1d4ed8;
    box-shadow: 0 2px 8px rgba(37,99,235,0.25);
  }

  .adm-btn-secondary {
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    color: #475569;
    padding: 8px 16px;
  }
  .adm-btn-secondary:hover { background: #e2e8f0; color: #1e293b; }

  .adm-btn-danger {
    background: #fff5f5;
    border: 1px solid #fed7d7;
    color: #e53e3e;
    padding: 7px 10px;
  }
  .adm-btn-danger:hover { background: #fed7d7; border-color: #fc8181; }

  .adm-btn-ghost {
    background: transparent; border: 1px solid transparent;
    color: #64748b; padding: 6px 9px;
  }
  .adm-btn-ghost:hover { background: #f1f5f9; color: #1e293b; border-color: #e2e8f0; }

  .adm-btn-icon-danger { color: #e53e3e; }
  .adm-btn-icon-danger:hover { background: #fff5f5; color: #c53030; border-color: #fed7d7; }

  /* ── Badges ── */
  .adm-badge {
    display: inline-flex; align-items: center;
    padding: 2px 9px; border-radius: 20px; font-size: 11px; font-weight: 600;
  }
  .adm-badge-pending   { background:#fffbeb; color:#92400e; border:1px solid #fde68a; }
  .adm-badge-paid      { background:#f0fdf4; color:#166534; border:1px solid #bbf7d0; }
  .adm-badge-processing{ background:#eff6ff; color:#1e40af; border:1px solid #bfdbfe; }
  .adm-badge-completed { background:#f0fdf4; color:#166534; border:1px solid #bbf7d0; }
  .adm-badge-cancelled { background:#fff5f5; color:#c53030; border:1px solid #fed7d7; }
  .adm-badge-new       { background:#eff6ff; color:#1e40af; border:1px solid #bfdbfe; }
  .adm-badge-read      { background:#f8fafc; color:#64748b; border:1px solid #e2e8f0; }
  .adm-badge-replied   { background:#f0fdf4; color:#166534; border:1px solid #bbf7d0; }
  .adm-badge-archived  { background:#f8fafc; color:#94a3b8; border:1px solid #e2e8f0; }
  .adm-badge-draft     { background:#fffbeb; color:#92400e; border:1px solid #fde68a; }
  .adm-badge-published { background:#f0fdf4; color:#166534; border:1px solid #bbf7d0; }
  .adm-badge-featured  { background:#faf5ff; color:#6b21a8; border:1px solid #e9d5ff; }
  .adm-badge-purple    { background:#faf5ff; color:#6b21a8; border:1px solid #e9d5ff; }
  .adm-badge-default   { background:#f8fafc; color:#64748b; border:1px solid #e2e8f0; }

  /* ── Text colors ── */
  .adm-text-primary   { color: #1e293b; }
  .adm-text-secondary { color: #475569; }
  .adm-text-muted     { color: #94a3b8; }
  .adm-text-accent    { color: #2563eb; }
  .adm-text-price     { color: #16a34a; }

  /* ── Label ── */
  .adm-label {
    display: block; font-size: 11px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.07em;
    color: #64748b; margin-bottom: 6px;
  }

  /* ── Divider ── */
  .adm-divider { border-color: #e2e8f0; }

  /* ── Section header ── */
  .adm-section-title {
    font-size: 15px; font-weight: 700; color: #1e293b;
    letter-spacing: -0.02em;
  }

  /* ── Toggle collapse button ── */
  .adm-collapse-btn {
    position: absolute; right: -12px; top: 68px;
    width: 24px; height: 24px; border-radius: 50%;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    color: #64748b;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.15s; z-index: 10;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }
  .adm-collapse-btn:hover { background: #f1f5f9; color: #1e293b; }

  /* ── Alert badge ── */
  .adm-alert-chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 600;
    background: #fff5f5;
    border: 1px solid #fed7d7;
    color: #e53e3e;
  }

  /* ── Image upload area ── */
  .adm-upload {
    border: 1.5px dashed #cbd5e1; border-radius: 10px;
    padding: 24px; text-align: center; cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    background: #f8fafc;
  }
  .adm-upload:hover { border-color: #3b82f6; background: #eff6ff; }

  /* ── Scrollbar ── */
  .adm-scroll::-webkit-scrollbar { width: 4px; }
  .adm-scroll::-webkit-scrollbar-track { background: transparent; }
  .adm-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }

  /* ── Page enter animation ── */
  .adm-page-enter { animation: adm-fadein 0.3s ease both; }

  /* ── Status select ── */
  .adm-status-select {
    font-size: 12px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px; padding: 5px 10px;
    color: #475569;
    font-family: 'Outfit', sans-serif;
    cursor: pointer; outline: none;
    transition: border-color 0.15s;
  }
  .adm-status-select:focus { border-color: #3b82f6; }
  .adm-status-select option { background: #ffffff; color: #1e293b; }

  /* ── Mobile sidebar ── */
  .adm-mobile-sidebar {
    position: fixed; inset-y: 0; left: 0; z-index: 50; width: 240px;
    background: #ffffff;
    border-right: 1px solid #e2e8f0;
    box-shadow: 4px 0 16px rgba(0,0,0,0.08);
    transform: translateX(-100%);
    transition: transform 0.25s cubic-bezier(.4,0,.2,1);
  }
  .adm-mobile-sidebar.open { transform: translateX(0); }

  .adm-overlay {
    position: fixed; inset: 0; z-index: 40;
    background: rgba(0,0,0,0.3);
    backdrop-filter: blur(2px);
  }

  /* ── Checkbox ── */
  .adm-checkbox { accent-color: #2563eb; width: 15px; height: 15px; }

  /* ── Featured row ── */
  .adm-featured-row {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: 10px;
    background: #fffbeb;
    border: 1px solid #fde68a;
  }

  /* ── Reply box ── */
  .adm-reply-box {
    margin-top: 10px; padding: 10px 14px;
    background: #f0fdf4;
    border-left: 2px solid #4ade80;
    border-radius: 0 8px 8px 0;
  }

  /* ── Sub-category indent ── */
  .adm-subcategory { margin-left: 24px; margin-top: 6px; }
  .adm-cat-primary  { border-left: 2px solid #3b82f6 !important; }
  .adm-cat-secondary{ border-left: 2px solid #cbd5e1 !important; }

  /* ── Glass (unused but kept for compat) ── */
  .glass       { background: rgba(255,255,255,0.8); border: 1px solid #e2e8f0; }
  .glass-strong{ background: rgba(255,255,255,0.95); border: 1px solid #e2e8f0; }
  .glass-hover { transition: background 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.2s; }
  .glass-hover:hover { background: #f8fafc; border-color: #cbd5e1; box-shadow: 0 4px 16px rgba(0,0,0,0.06); transform: translateY(-1px); }
`;

/* ─── Inject CSS once ─── */
let cssInjected = false;
const injectCSS = () => {
  if (cssInjected) return;
  const el = document.createElement('style');
  el.textContent = GLOBAL_CSS;
  document.head.appendChild(el);
  cssInjected = true;
};

/* ─────────────────────────────────────────────
   Reusable primitives
───────────────────────────────────────────── */
const Badge = ({ variant = 'default', children }) => (
  <span className={`adm-badge adm-badge-${variant}`}>{children}</span>
);

const Btn = ({ variant = 'primary', size = 'md', className = '', children, ...props }) => {
  const v = {
    primary: 'adm-btn adm-btn-primary',
    secondary: 'adm-btn adm-btn-secondary',
    danger: 'adm-btn adm-btn-danger',
    ghost: 'adm-btn adm-btn-ghost',
  };
  return (
    <button className={`${v[variant] || v.primary} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Field = ({ label, required, children, hint }) => (
  <div>
    {label && (
      <label className="adm-label">
        {label}{required && <span style={{ color: '#e53e3e', marginLeft: 2 }}>*</span>}
      </label>
    )}
    {children}
    {hint && <p style={{ marginTop: 4, fontSize: 11, color: '#94a3b8' }}>{hint}</p>}
  </div>
);

const SectionHeader = ({ title, action }) => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid #e2e8f0' }}>
    <h2 className="adm-section-title">{title}</h2>
    {action}
  </div>
);

const FormPanel = ({ title, children }) => (
  <div className="adm-formpanel" style={{ padding: 20, marginBottom: 20 }}>
    <h3 style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #e2e8f0' }}>
      {title}
    </h3>
    {children}
  </div>
);

const EmptyState = ({ icon: Icon, message }) => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding: '64px 0', color: '#94a3b8' }}>
    <div style={{ width:48, height:48, background:'#f1f5f9', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12, border:'1px solid #e2e8f0' }}>
      <Icon size={20} />
    </div>
    <p style={{ fontSize: 13 }}>{message}</p>
  </div>
);

const Card = ({ children, className = '', style = {} }) => (
  <div className={`adm-card ${className}`} style={{ padding: '14px 16px', ...style }}>
    {children}
  </div>
);

const inputCls = 'adm-input';
const selectCls = 'adm-input adm-select';

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
  injectCSS();
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

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const emptyProduct = { name:'', price:'', category:'', description:'', material:'', size:'', format:'', stock:'', image:'', featured:false, discount:'', oldPrice:'' };
  const [productForm, setProductForm] = useState(emptyProduct);

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const emptyCategory = { name:'', description:'', parent:'', icon:'Package', order:0 };
  const [categoryForm, setCategoryForm] = useState(emptyCategory);

  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const emptyBlog = { title:'', excerpt:'', content:'', category:'other', tags:'', status:'published', featured:false };
  const [blogForm, setBlogForm] = useState(emptyBlog);
  const [blogImage, setBlogImage] = useState(null);
  const [blogImagePreview, setBlogImagePreview] = useState('');

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

  useEffect(() => { setMobileSidebarOpen(false); }, [activeTab]);

  const notify = (message, type = 'success') => setNotification({ message, type });

  const loadTabData = async (tab) => {
    try {
      setLoading(true);
      if (tab === 'dashboard') {
        if (!dashboardStats) { const s = await getDashboardStats().catch(()=>null); if(s) setDashboardStats(s.data); }
        const [o,q,m] = await Promise.all([getAllOrders().catch(()=>({data:[]})), getAllQuotations().catch(()=>({data:[]})), getAllContactMessages().catch(()=>({data:[]}))]);
        setOrders(o.data); setQuotations(q.data); setContactMessages(m.data);
      } else if (tab==='products') { const [p,c]=await Promise.all([getProducts(),getAllCategoriesFlat()]); setProducts(p.data); setCategories(c.data); }
      else if (tab==='orders')     { const d=await getAllOrders(); setOrders(d.data); }
      else if (tab==='quotations') { const d=await getAllQuotations(); setQuotations(d.data); }
      else if (tab==='messages')   { const d=await getAllContactMessages(); setContactMessages(d.data); }
      else if (tab==='categories') { const d=await getAllCategoriesFlat(); setCategories(d.data); }
      else if (tab==='blogs')      { const d=await getAllBlogs(); setBlogs(d.data); }
      else if (tab==='services')   { const d=await getAllMarketingServices(); setMarketingServices(d.data); }
    } catch(e) { console.error(e); } finally { setLoading(false); }
  };
  const loadData = () => loadTabData(activeTab);

  /* ── Handlers ── */
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      ['name','price','category','description','material','size','format','stock','featured'].forEach(k=>fd.append(k,productForm[k]));
      if(productForm.discount) fd.append('discount',productForm.discount);
      if(productForm.oldPrice) fd.append('oldPrice',productForm.oldPrice);
      if(selectedImage) fd.append('image',selectedImage); else if(productForm.image) fd.append('image',productForm.image);
      if(editingProduct){await updateProduct(editingProduct._id,fd);notify('Бүтээгдэхүүн шинэчлэгдлээ');}
      else{await createProduct(fd);notify('Бүтээгдэхүүн нэмэгдлээ');}
      setShowProductForm(false); setEditingProduct(null); setSelectedImage(null); setImagePreview(null); setProductForm(emptyProduct); loadData();
    } catch { notify('Алдаа гарлаа','error'); }
  };
  const handleDeleteProduct = async (id) => { if(!window.confirm('Устгах уу?'))return; try{await deleteProduct(id);notify('Устгагдлаа');loadData();}catch{notify('Алдаа','error');} };
  const handleEditProduct = (p) => { setEditingProduct(p); setProductForm({name:p.name,price:p.price,category:typeof p.category==='object'?p.category._id:p.category,description:p.description||'',material:p.material||'',size:p.size||'',format:p.format||'',stock:p.stock||'',image:p.image||'',featured:p.featured||false,discount:p.discount||'',oldPrice:p.oldPrice||''}); setImagePreview(p.image||null); setSelectedImage(null); setShowProductForm(true); };
  const handleImageChange = (e) => { const f=e.target.files[0]; if(f){setSelectedImage(f);const r=new FileReader();r.onloadend=()=>setImagePreview(r.result);r.readAsDataURL(f);} };
  const handleUpdateOrderStatus = async (id,status) => { try{await updateOrderStatus(id,status);notify('Статус шинэчлэгдлээ');loadData();}catch{notify('Алдаа','error');} };
  const handleDeleteOrder = async (id) => { if(!window.confirm('Устгах уу?'))return; try{await deleteOrder(id);notify('Устгагдлаа');loadData();}catch{notify('Алдаа','error');} };
  const handleDeleteQuotation = async (id) => { if(!window.confirm('Устгах уу?'))return; try{await deleteQuotation(id);notify('Устгагдлаа');loadData();}catch{notify('Алдаа','error');} };
  const handleMessageStatusUpdate = async (id,status) => { try{await updateContactMessageStatus(id,status);notify('Статус шинэчлэгдлээ');loadData();}catch{notify('Алдаа','error');} };
  const handleDeleteMessage = async (id) => { if(!window.confirm('Устгах уу?'))return; try{await deleteContactMessage(id);notify('Устгагдлаа');loadData();}catch{notify('Алдаа','error');} };
  const handleCategorySubmit = async (e) => { e.preventDefault(); try{if(editingCategory){await updateCategory(editingCategory._id,categoryForm);notify('Ангилал шинэчлэгдлээ');}else{await createCategory(categoryForm);notify('Ангилал нэмэгдлээ');}setShowCategoryForm(false);setEditingCategory(null);setCategoryForm(emptyCategory);loadData();}catch(e){notify(e.response?.data?.message||'Алдаа','error');} };
  const handleEditCategory = (c) => { setEditingCategory(c); setCategoryForm({name:c.name,description:c.description||'',parent:c.parent?._id||'',icon:c.icon||'Package',order:c.order||0}); setShowCategoryForm(true); };
  const handleDeleteCategory = async (id) => { if(!window.confirm('Устгах уу?'))return; try{await deleteCategory(id);notify('Устгагдлаа');loadData();}catch(e){notify(e.response?.data?.message||'Алдаа','error');} };
  const handleBlogSubmit = async (e) => { e.preventDefault(); try{const fd=new FormData();fd.append('title',blogForm.title);fd.append('excerpt',blogForm.excerpt);fd.append('content',blogForm.content);fd.append('category',blogForm.category);fd.append('tags',blogForm.tags?blogForm.tags.split(',').map(t=>t.trim()).join(','):'');fd.append('status',blogForm.status);fd.append('featured',blogForm.featured);if(blogImage)fd.append('file',blogImage);if(editingBlog){await updateBlog(editingBlog._id,fd);notify('Блог шинэчлэгдлээ');}else{await createBlog(fd);notify('Блог нэмэгдлээ');}setShowBlogForm(false);setEditingBlog(null);setBlogForm(emptyBlog);setBlogImage(null);setBlogImagePreview('');loadData();}catch(e){notify(e.response?.data?.message||'Алдаа','error');} };
  const handleEditBlog = (b) => { setEditingBlog(b); setBlogForm({title:b.title,excerpt:b.excerpt||'',content:b.content,category:b.category,tags:b.tags?b.tags.join(', '):'',status:b.status,featured:b.featured||false}); if(b.image)setBlogImagePreview(b.image); setShowBlogForm(true); };
  const handleDeleteBlog = async (id) => { if(!window.confirm('Устгах уу?'))return; try{await deleteBlog(id);notify('Устгагдлаа');loadData();}catch(e){notify(e.response?.data?.message||'Алдаа','error');} };
  const handleServiceSubmit = async (e) => { e.preventDefault(); try{const fd=new FormData();fd.append('name',serviceForm.name);fd.append('description',serviceForm.description);fd.append('shortDescription',serviceForm.shortDescription);fd.append('features',serviceForm.features?serviceForm.features.split('\n').map(f=>f.trim()).filter(Boolean).join('\n'):'');fd.append('price',serviceForm.price);fd.append('category',serviceForm.category);fd.append('icon',serviceForm.icon);fd.append('featured',serviceForm.featured);if(serviceImage)fd.append('file',serviceImage);if(editingService){await updateMarketingService(editingService._id,fd);notify('Үйлчилгээ шинэчлэгдлээ');}else{await createMarketingService(fd);notify('Үйлчилгээ нэмэгдлээ');}setShowServiceForm(false);setEditingService(null);setServiceForm(emptyService);setServiceImage(null);setServiceImagePreview('');loadData();}catch(e){notify(e.response?.data?.message||'Алдаа','error');} };
  const handleEditService = (s) => { setEditingService(s); setServiceForm({name:s.name,description:s.description,shortDescription:s.shortDescription||'',features:s.features?s.features.join('\n'):'',price:s.price||'',category:s.category,icon:s.icon||'TrendingUp',featured:s.featured||false}); if(s.image)setServiceImagePreview(s.image); setShowServiceForm(true); };
  const handleDeleteService = async (id) => { if(!window.confirm('Устгах уу?'))return; try{await deleteMarketingService(id);notify('Устгагдлаа');loadData();}catch(e){notify(e.response?.data?.message||'Алдаа','error');} };

  const navItems = [
    { id:'dashboard',  label:'Самбар',        icon:LayoutDashboard },
    { id:'products',   label:'Бүтээгдэхүүн',  icon:Package,        stat:products.length },
    { id:'orders',     label:'Захиалга',       icon:ShoppingCart,   stat:orders.length },
    { id:'quotations', label:'Үнийн санал',    icon:TrendingUp,     badge:quotations.filter(q=>q.status==='pending').length },
    { id:'messages',   label:'Мессеж',         icon:Mail,           badge:contactMessages.filter(m=>m.status==='new').length },
    { id:'categories', label:'Ангилал',        icon:Tag },
    { id:'blogs',      label:'Блог',           icon:BookOpen,       stat:blogs.length },
    { id:'services',   label:'Үйлчилгээ',      icon:Briefcase,      stat:marketingServices.length },
  ];
  const activeNav = navItems.find(n=>n.id===activeTab);
  const totalAlerts = navItems.reduce((s,n)=>s+(n.badge||0),0);

  const NavItems = ({ collapsed }) => (
    <>
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            title={collapsed ? item.label : undefined}
            className={`adm-nav-item ${isActive ? 'active' : ''}`}
            style={{ padding: collapsed ? '10px' : '9px 12px', justifyContent: collapsed ? 'center' : 'flex-start', position: 'relative' }}
          >
            <Icon size={16} style={{ flexShrink: 0 }} />
            {!collapsed && (
              <>
                <span style={{ flex: 1, textAlign: 'left', marginLeft: 10, fontSize: 13.5, fontWeight: 500 }}>{item.label}</span>
                {item.badge > 0 && (
                  <span style={{ background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10, minWidth: 18, textAlign: 'center' }}>
                    {item.badge}
                  </span>
                )}
                {!item.badge && item.stat > 0 && (
                  <span style={{ fontSize: 11, padding: '1px 7px', borderRadius: 6, background: isActive ? '#dbeafe' : '#f1f5f9', color: isActive ? '#1d4ed8' : '#94a3b8' }}>
                    {item.stat}
                  </span>
                )}
              </>
            )}
            {collapsed && item.badge > 0 && (
              <span style={{ position:'absolute', top:6, right:6, width:6, height:6, background:'#ef4444', borderRadius:'50%' }} />
            )}
          </button>
        );
      })}
    </>
  );

  return (
    <div className="adm-root" style={{ display:'flex', height:'100vh', overflow:'hidden' }}>
      {notification && <Notification type={notification.type} message={notification.message} onClose={()=>setNotification(null)} />}

      {/* Mobile overlay */}
      {mobileSidebarOpen && <div className="adm-overlay" onClick={()=>setMobileSidebarOpen(false)} />}

      {/* Mobile sidebar */}
      <div className={`adm-mobile-sidebar ${mobileSidebarOpen?'open':''}`} style={{ display:'flex', flexDirection:'column' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 16px', borderBottom:'1px solid #e2e8f0' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:30, height:30, borderRadius:8, background:'#eff6ff', border:'1px solid #bfdbfe', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:'#2563eb', fontWeight:700, fontSize:13 }}>A</span>
            </div>
            <span style={{ color:'#1e293b', fontWeight:600, fontSize:14 }}>Admin Panel</span>
          </div>
          <button onClick={()=>setMobileSidebarOpen(false)} className="adm-btn adm-btn-ghost" style={{ padding:'5px' }}><X size={16}/></button>
        </div>
        <nav className="adm-scroll" style={{ flex:1, padding:'10px 8px', display:'flex', flexDirection:'column', gap:3, overflowY:'auto' }}>
          <NavItems collapsed={false} />
        </nav>
        <div style={{ padding:'10px 8px', borderTop:'1px solid #e2e8f0' }}>
          <button onClick={()=>{logout();navigate('/');}} className="adm-nav-item" style={{ padding:'9px 12px', gap:10 }}>
            <LogOut size={15} style={{ color:'#e53e3e' }}/><span style={{ fontSize:13 }}>Гарах</span>
          </button>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside
        className={`adm-sidebar ${sidebarOpen?'adm-sidebar-open':'adm-sidebar-close'}`}
        style={{ display:'none', flexDirection:'column', position:'relative', zIndex:10 }}
        ref={el => { if(el) el.style.display = 'flex'; }}
      >
        <div style={{ display:'flex', alignItems:'center', gap:10, padding: sidebarOpen?'18px 16px':'16px', borderBottom:'1px solid #e2e8f0', overflow:'hidden' }}>
          <div style={{ width:32, height:32, borderRadius:9, background:'#eff6ff', border:'1px solid #bfdbfe', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ color:'#2563eb', fontWeight:700, fontSize:14 }}>A</span>
          </div>
          {sidebarOpen && (
            <div style={{ overflow:'hidden' }}>
              <div style={{ color:'#1e293b', fontWeight:600, fontSize:14, lineHeight:1.3 }}>Admin Panel</div>
              <div style={{ color:'#94a3b8', fontSize:11, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:140 }}>{user?.name}</div>
            </div>
          )}
        </div>

        <nav className="adm-scroll" style={{ flex:1, padding:'10px 8px', display:'flex', flexDirection:'column', gap:3, overflowY:'auto' }}>
          {sidebarOpen && <p style={{ padding:'6px 10px 4px', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#cbd5e1' }}>Цэс</p>}
          <NavItems collapsed={!sidebarOpen} />
        </nav>

        <div style={{ padding:'10px 8px', borderTop:'1px solid #e2e8f0' }}>
          <button onClick={()=>{logout();navigate('/');}} className="adm-nav-item" style={{ padding: sidebarOpen?'9px 12px':'10px', justifyContent: sidebarOpen?'flex-start':'center', gap: sidebarOpen?10:0 }} title={!sidebarOpen?'Гарах':undefined}>
            <LogOut size={15} style={{ color:'#e53e3e' }}/>
            {sidebarOpen && <span style={{ fontSize:13 }}>Гарах</span>}
          </button>
        </div>

        <button className="adm-collapse-btn" onClick={()=>setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <ChevronLeft size={11}/> : <ChevronRight size={11}/>}
        </button>
      </aside>

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden', position:'relative', zIndex:1 }}>

        {/* Topbar */}
        <header className="adm-topbar" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <button onClick={()=>setMobileSidebarOpen(true)} className="adm-btn adm-btn-ghost" style={{ padding:7 }}>
              <Menu size={17}/>
            </button>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:13 }}>
              <span style={{ color:'#94a3b8' }}>Удирдлага</span>
              <ChevronRight size={12} style={{ color:'#cbd5e1' }}/>
              <span style={{ color:'#1e293b', fontWeight:500 }}>{activeNav?.label}</span>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            {totalAlerts > 0 && (
              <div className="adm-alert-chip">
                <AlertCircle size={11}/><span>{totalAlerts} шинэ</span>
              </div>
            )}
            <div style={{ width:32, height:32, borderRadius:9, background:'#eff6ff', border:'1px solid #bfdbfe', display:'flex', alignItems:'center', justifyContent:'center', color:'#2563eb', fontWeight:700, fontSize:13 }}>
              {user?.name?.[0]?.toUpperCase()||'A'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="adm-scroll" style={{ flex:1, overflowY:'auto', padding:24 }}>
          <div style={{ maxWidth:880, margin:'0 auto' }} className="adm-page-enter">

            {activeTab==='dashboard' && <DashboardTab onTabChange={setActiveTab} />}

            {/* ── PRODUCTS ── */}
            {activeTab==='products' && (
              <div>
                <SectionHeader
                  title="Бүтээгдэхүүн"
                  action={
                    <Btn onClick={()=>{setShowProductForm(!showProductForm);if(showProductForm){setEditingProduct(null);setProductForm(emptyProduct);setSelectedImage(null);setImagePreview(null);}}}>
                      <Plus size={13}/>{showProductForm?'Хаах':'Нэмэх'}
                    </Btn>
                  }
                />
                {showProductForm && (
                  <FormPanel title={editingProduct?'Бүтээгдэхүүн засах':'Шинэ бүтээгдэхүүн'}>
                    <form onSubmit={handleProductSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                        <Field label="Нэр" required><input type="text" value={productForm.name} required onChange={e=>setProductForm({...productForm,name:e.target.value})} className={inputCls} placeholder="Бүтээгдэхүүний нэр"/></Field>
                        <Field label="Үнэ (₮)" required><input type="number" value={productForm.price} required onChange={e=>setProductForm({...productForm,price:e.target.value})} className={inputCls} placeholder="50000"/></Field>
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
                        <Field label="Нөөц"><input type="number" value={productForm.stock} onChange={e=>setProductForm({...productForm,stock:e.target.value})} className={inputCls} placeholder="1000"/></Field>
                        <Field label="Хэмжээ"><input type="text" value={productForm.size} onChange={e=>setProductForm({...productForm,size:e.target.value})} className={inputCls} placeholder="A4, 85x54mm"/></Field>
                        <Field label="Материал"><input type="text" value={productForm.material} onChange={e=>setProductForm({...productForm,material:e.target.value})} className={inputCls} placeholder="300gsm цаас"/></Field>
                      </div>
                      <Field label="Тайлбар">
                        <EnhancedTextarea value={productForm.description} onChange={e=>setProductForm({...productForm,description:e.target.value})} placeholder="Бүтээгдэхүүний тайлбар..." rows={4} maxLength={2000} showInstructions/>
                      </Field>
                      <Field label="Зураг">
                        <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                          <div style={{ flex:1 }}>
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="productImage"/>
                            <label htmlFor="productImage" className="adm-upload" style={{ display:'flex', alignItems:'center', gap:8 }}>
                              <Upload size={15} style={{ color:'#94a3b8' }}/>
                              <span style={{ fontSize:13, color:'#94a3b8' }}>{selectedImage?selectedImage.name:'Зураг сонгох'}</span>
                            </label>
                          </div>
                          {imagePreview && (
                            <div style={{ width:56, height:56, borderRadius:10, overflow:'hidden', border:'1px solid #e2e8f0', flexShrink:0 }}>
                              <img src={imagePreview} alt="Preview" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                            </div>
                          )}
                        </div>
                      </Field>
                      <div className="adm-featured-row">
                        <input type="checkbox" id="featured" checked={productForm.featured} onChange={e=>setProductForm({...productForm,featured:e.target.checked})} className="adm-checkbox"/>
                        <label htmlFor="featured" style={{ fontSize:13, fontWeight:500, color:'#92400e', cursor:'pointer' }}>Онцлох бүтээгдэхүүн — нүүр хуудсанд харагдана</label>
                      </div>
                      <div style={{ padding:'14px 16px', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:10 }}>
                        <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'#94a3b8', marginBottom:10 }}>Хямдрал</p>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                          <Field label="Хувь (%)"><input type="number" min="0" max="100" value={productForm.discount} onChange={e=>{const d=e.target.value;setProductForm(prev=>{const up={...prev,discount:d};if(d&&prev.price)up.oldPrice=Math.round(parseFloat(prev.price)/(1-parseFloat(d)/100)).toString();return up;})}} className={inputCls}/></Field>
                          <Field label="Хуучин үнэ (₮)"><input type="number" value={productForm.oldPrice} onChange={e=>setProductForm({...productForm,oldPrice:e.target.value})} className={inputCls}/></Field>
                        </div>
                      </div>
                      <div style={{ display:'flex', gap:8 }}>
                        <Btn type="submit" style={{ flex:1, justifyContent:'center' }}>{editingProduct?'Шинэчлэх':'Нэмэх'}</Btn>
                        <Btn type="button" variant="secondary" onClick={()=>{setShowProductForm(false);setEditingProduct(null);setSelectedImage(null);setImagePreview(null);setProductForm(emptyProduct);}}>Болих</Btn>
                      </div>
                    </form>
                  </FormPanel>
                )}
                {loading?<Loading/>:products.length===0?<EmptyState icon={Package} message="Бүтээгдэхүүн байхгүй байна"/>:(
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {products.map(p=>(
                      <Card key={p._id} style={{ display:'flex', alignItems:'center', gap:14 }}>
                        <img src={getImageUrl(p.image)} alt={p.name} style={{ width:48, height:48, objectFit:'cover', borderRadius:10, border:'1px solid #e2e8f0', flexShrink:0 }} onError={e=>{e.target.src='/placeholder.png';}}/>
                        <div style={{ flex:1, minWidth:0 }}>
                          <p style={{ fontSize:14, fontWeight:600, color:'#1e293b', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</p>
                          <p style={{ fontSize:13, fontWeight:700, color:'#16a34a' }}>{formatPrice(p.price)}</p>
                          <p style={{ fontSize:12, color:'#94a3b8' }}>{typeof p.category==='object'?p.category?.name:p.category}</p>
                        </div>
                        <div style={{ display:'flex', gap:4 }}>
                          <Btn variant="ghost" onClick={()=>handleEditProduct(p)}><Edit size={14}/></Btn>
                          <Btn variant="ghost" className="adm-btn-icon-danger" onClick={()=>handleDeleteProduct(p._id)}><Trash2 size={14}/></Btn>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── ORDERS ── */}
            {activeTab==='orders' && (
              <div>
                <SectionHeader title="Захиалга"/>
                {loading?<Loading/>:orders.length===0?<EmptyState icon={ShoppingCart} message="Захиалга байхгүй байна"/>:(
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {orders.map(o=>(
                      <Card key={o._id}>
                        <div style={{ display:'flex', flexWrap:'wrap', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
                          <div>
                            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                              <span style={{ fontSize:13, fontFamily:'monospace', fontWeight:600, color:'#2563eb' }}>#{o._id.slice(-6).toUpperCase()}</span>
                              <Badge variant={o.status}>{statusLabel[o.status]||o.status}</Badge>
                            </div>
                            <p style={{ fontSize:13, color:'#475569' }}>{o.shippingInfo.name} — {o.shippingInfo.phone}</p>
                            <p style={{ fontSize:12, color:'#94a3b8', marginTop:2 }}>{formatDate(o.createdAt)}</p>
                          </div>
                          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                            <span style={{ fontSize:15, fontWeight:700, color:'#16a34a' }}>{formatPrice(o.total)}</span>
                            <select value={o.status} onChange={e=>handleUpdateOrderStatus(o._id,e.target.value)} className="adm-status-select">
                              <option value="pending">Хүлээгдэж буй</option>
                              <option value="paid">Төлөгдсөн</option>
                              <option value="processing">Үйлдвэрлэлд</option>
                              <option value="completed">Дууссан</option>
                              <option value="cancelled">Цуцлагдсан</option>
                            </select>
                            <Btn variant="ghost" className="adm-btn-icon-danger" onClick={()=>handleDeleteOrder(o._id)}><Trash2 size={14}/></Btn>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── QUOTATIONS ── */}
            {activeTab==='quotations' && (
              <div>
                <SectionHeader title="Үнийн санал"/>
                {loading?<Loading/>:quotations.length===0?<EmptyState icon={TrendingUp} message="Үнийн санал байхгүй байна"/>:(
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {quotations.map(q=>(
                      <Card key={q._id}>
                        <div style={{ display:'flex', justifyContent:'space-between', gap:12 }}>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:4 }}>
                              <span style={{ fontSize:14, fontWeight:600, color:'#1e293b' }}>{q.name}</span>
                              <Badge variant={q.status==='pending'?'pending':'replied'}>{q.status==='pending'?'Хүлээгдэж буй':'Хариулсан'}</Badge>
                            </div>
                            <p style={{ fontSize:12, color:'#94a3b8', marginBottom:8 }}>{q.phone} · {q.email}</p>
                            <p style={{ fontSize:13, color:'#475569', marginBottom:6 }}><span style={{ color:'#64748b', fontWeight:500 }}>Төрөл:</span> {q.productType}</p>
                            <p style={{ fontSize:13, color:'#475569', padding:'8px 12px', background:'#f8fafc', borderRadius:8, border:'1px solid #e2e8f0' }}>{q.description}</p>
                            {q.designFile && (
                              <div style={{ marginTop:8, padding:'8px 12px', background:'#eff6ff', borderRadius:8, border:'1px solid #bfdbfe' }}>
                                <p style={{ fontSize:11, fontWeight:700, color:'#3b82f6', marginBottom:2 }}>Дизайн файл</p>
                                <a href={getImageUrl(q.designFile.fileUrl)} target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:'#2563eb' }}>{q.designFile.fileName}</a>
                              </div>
                            )}
                          </div>
                          <Btn variant="ghost" className="adm-btn-icon-danger" style={{ flexShrink:0 }} onClick={()=>handleDeleteQuotation(q._id)}><Trash2 size={14}/></Btn>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── MESSAGES ── */}
            {activeTab==='messages' && (
              <div>
                <SectionHeader title="Мессежүүд"/>
                {loading?<Loading/>:contactMessages.length===0?<EmptyState icon={Mail} message="Мессеж байхгүй байна"/>:(
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {contactMessages.map(m=>(
                      <Card key={m._id}>
                        <div style={{ display:'flex', justifyContent:'space-between', gap:12 }}>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:4 }}>
                              <span style={{ fontSize:14, fontWeight:600, color:'#1e293b' }}>{m.name}</span>
                              <Badge variant={m.status}>{statusLabel[m.status]||m.status}</Badge>
                            </div>
                            <p style={{ fontSize:12, color:'#94a3b8', marginBottom:6 }}>{m.email} · {formatDate(m.createdAt)}</p>
                            <p style={{ fontSize:13, fontWeight:500, color:'#475569', marginBottom:4 }}>{m.subject}</p>
                            <p style={{ fontSize:13, color:'#475569', padding:'8px 12px', background:'#f8fafc', borderRadius:8, border:'1px solid #e2e8f0' }}>{m.message}</p>
                            {m.adminReply && (
                              <div className="adm-reply-box">
                                <p style={{ fontSize:11, fontWeight:700, color:'#16a34a', marginBottom:3 }}>Админ хариу</p>
                                <p style={{ fontSize:13, color:'#475569' }}>{m.adminReply.message}</p>
                                <p style={{ fontSize:11, color:'#86efac', marginTop:4 }}>{formatDate(m.adminReply.repliedAt)}</p>
                              </div>
                            )}
                          </div>
                          <div style={{ display:'flex', flexDirection:'column', gap:4, flexShrink:0 }}>
                            {m.status==='new' && <Btn variant="ghost" onClick={()=>handleMessageStatusUpdate(m._id,'read')} title="Уншсан" style={{ color:'#2563eb' }}><CheckCircle size={14}/></Btn>}
                            {m.status!=='archived' && <Btn variant="ghost" onClick={()=>handleMessageStatusUpdate(m._id,'archived')} title="Архивлах"><XCircle size={14}/></Btn>}
                            <Btn variant="ghost" className="adm-btn-icon-danger" onClick={()=>handleDeleteMessage(m._id)}><Trash2 size={14}/></Btn>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── CATEGORIES ── */}
            {activeTab==='categories' && (
              <div>
                <SectionHeader title="Ангилал" action={<Btn onClick={()=>{setShowCategoryForm(!showCategoryForm);if(!showCategoryForm){setEditingCategory(null);setCategoryForm(emptyCategory);}}}><Plus size={13}/>{showCategoryForm?'Хаах':'Нэмэх'}</Btn>}/>
                {showCategoryForm && (
                  <FormPanel title={editingCategory?'Ангилал засах':'Шинэ ангилал'}>
                    <form onSubmit={handleCategorySubmit} style={{ display:'flex', flexDirection:'column', gap:12 }}>
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                        <Field label="Нэр" required><input type="text" required value={categoryForm.name} onChange={e=>setCategoryForm({...categoryForm,name:e.target.value})} className={inputCls} placeholder="Ангиллын нэр"/></Field>
                        <Field label="Үндсэн ангилал"><select value={categoryForm.parent} onChange={e=>setCategoryForm({...categoryForm,parent:e.target.value})} className={selectCls}><option value="">-- Үндсэн --</option>{categories.filter(c=>!c.parent).map(c=><option key={c._id} value={c._id}>{c.name}</option>)}</select></Field>
                        <Field label="Icon" hint="lucide-react icon нэр"><input type="text" value={categoryForm.icon} onChange={e=>setCategoryForm({...categoryForm,icon:e.target.value})} className={inputCls} placeholder="Package"/></Field>
                        <Field label="Дараалал"><input type="number" value={categoryForm.order} onChange={e=>setCategoryForm({...categoryForm,order:parseInt(e.target.value)||0})} className={inputCls}/></Field>
                      </div>
                      <Field label="Тайлбар"><textarea rows="2" value={categoryForm.description} onChange={e=>setCategoryForm({...categoryForm,description:e.target.value})} className={inputCls} style={{ resize:'vertical' }}/></Field>
                      <div style={{ display:'flex', gap:8 }}><Btn type="submit" style={{ flex:1, justifyContent:'center' }}>{editingCategory?'Шинэчлэх':'Нэмэх'}</Btn><Btn type="button" variant="secondary" onClick={()=>{setShowCategoryForm(false);setEditingCategory(null);}}>Болих</Btn></div>
                    </form>
                  </FormPanel>
                )}
                {loading?<Loading/>:categories.length===0?<EmptyState icon={Tag} message="Ангилал байхгүй байна"/>:(
                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    {categories.filter(c=>!c.parent).map(cat=>(
                      <div key={cat._id}>
                        <Card className="adm-cat-primary" style={{ borderLeftWidth:2 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                            <div style={{ flex:1, minWidth:0 }}>
                              <p style={{ fontSize:14, fontWeight:600, color:'#1e293b' }}>{cat.name}</p>
                              {cat.description && <p style={{ fontSize:12, color:'#94a3b8', marginTop:2 }}>{cat.description}</p>}
                              <p style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>Icon: {cat.icon} · Order: {cat.order}</p>
                            </div>
                            <div style={{ display:'flex', gap:4 }}>
                              <Btn variant="ghost" onClick={()=>handleEditCategory(cat)}><Edit size={14}/></Btn>
                              <Btn variant="ghost" className="adm-btn-icon-danger" onClick={()=>handleDeleteCategory(cat._id)}><Trash2 size={14}/></Btn>
                            </div>
                          </div>
                        </Card>
                        {categories.filter(s=>s.parent?._id===cat._id).map(s=>(
                          <div key={s._id} className="adm-subcategory">
                            <Card className="adm-cat-secondary" style={{ borderLeftWidth:2 }}>
                              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                                <div style={{ flex:1 }}>
                                  <p style={{ fontSize:13, fontWeight:500, color:'#475569' }}>{s.name}</p>
                                  {s.description && <p style={{ fontSize:12, color:'#94a3b8' }}>{s.description}</p>}
                                </div>
                                <div style={{ display:'flex', gap:4 }}>
                                  <Btn variant="ghost" onClick={()=>handleEditCategory(s)}><Edit size={14}/></Btn>
                                  <Btn variant="ghost" className="adm-btn-icon-danger" onClick={()=>handleDeleteCategory(s._id)}><Trash2 size={14}/></Btn>
                                </div>
                              </div>
                            </Card>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── BLOGS ── */}
            {activeTab==='blogs' && (
              <div>
                <SectionHeader title="Блог" action={<Btn onClick={()=>{setShowBlogForm(!showBlogForm);if(!showBlogForm){setEditingBlog(null);setBlogForm(emptyBlog);}}}><Plus size={13}/>{showBlogForm?'Хаах':'Нэмэх'}</Btn>}/>
                {showBlogForm && (
                  <FormPanel title={editingBlog?'Блог засах':'Шинэ блог'}>
                    <form onSubmit={handleBlogSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
                      <Field label="Гарчиг" required><input type="text" required value={blogForm.title} onChange={e=>setBlogForm({...blogForm,title:e.target.value})} className={inputCls} placeholder="Блогийн гарчиг"/></Field>
                      <Field label="Товч агуулга"><textarea rows="2" value={blogForm.excerpt} onChange={e=>setBlogForm({...blogForm,excerpt:e.target.value})} maxLength="500" className={inputCls} style={{ resize:'vertical' }}/></Field>
                      <Field label="Агуулга" required><textarea rows="10" required value={blogForm.content} onChange={e=>setBlogForm({...blogForm,content:e.target.value})} className={inputCls} style={{ resize:'vertical' }}/></Field>
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                        <Field label="Ангилал"><select value={blogForm.category} onChange={e=>setBlogForm({...blogForm,category:e.target.value})} className={selectCls}><option value="other">Бусад</option><option value="news">Мэдээ</option><option value="tutorial">Заавар</option><option value="tips">Зөвлөмж</option><option value="case-study">Туршилт</option><option value="announcement">Мэдэгдэл</option></select></Field>
                        <Field label="Статус"><select value={blogForm.status} onChange={e=>setBlogForm({...blogForm,status:e.target.value})} className={selectCls}><option value="draft">Ноорог</option><option value="published">Нийтлэгдсэн</option><option value="archived">Архивласан</option></select></Field>
                      </div>
                      <Field label="Tags" hint="Таслалаар: хэвлэл, дизайн"><input type="text" value={blogForm.tags} onChange={e=>setBlogForm({...blogForm,tags:e.target.value})} className={inputCls} placeholder="хэвлэл, дизайн"/></Field>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <input type="checkbox" id="blogFeatured" checked={blogForm.featured} onChange={e=>setBlogForm({...blogForm,featured:e.target.checked})} className="adm-checkbox"/>
                        <label htmlFor="blogFeatured" style={{ fontSize:13, color:'#475569', cursor:'pointer' }}>Онцлох блог</label>
                      </div>
                      <Field label="Зураг">
                        {blogImagePreview?(
                          <div style={{ position:'relative' }}>
                            <img src={blogImagePreview} alt="Preview" style={{ width:'100%', height:160, objectFit:'cover', borderRadius:10 }}/>
                            <button type="button" onClick={()=>{setBlogImage(null);setBlogImagePreview('');}} style={{ position:'absolute', top:8, right:8, width:28, height:28, borderRadius:'50%', background:'rgba(0,0,0,0.4)', border:'1px solid rgba(255,255,255,0.3)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}><X size={13}/></button>
                          </div>
                        ):(
                          <div className="adm-upload">
                            <input type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(f){setBlogImage(f);const r=new FileReader();r.onloadend=()=>setBlogImagePreview(r.result);r.readAsDataURL(f);}}} className="hidden" id="blog-img"/>
                            <label htmlFor="blog-img" style={{ cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:6, color:'#94a3b8' }}>
                              <Upload size={18}/><span style={{ fontSize:13 }}>Зураг сонгох</span>
                            </label>
                          </div>
                        )}
                      </Field>
                      <div style={{ display:'flex', gap:8 }}><Btn type="submit" style={{ flex:1, justifyContent:'center' }}>{editingBlog?'Шинэчлэх':'Нэмэх'}</Btn><Btn type="button" variant="secondary" onClick={()=>{setShowBlogForm(false);setEditingBlog(null);}}>Болих</Btn></div>
                    </form>
                  </FormPanel>
                )}
                {loading?<Loading/>:blogs.length===0?<EmptyState icon={BookOpen} message="Блог байхгүй байна"/>:(
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {blogs.map(b=>(
                      <Card key={b._id} style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:4 }}>
                            <span style={{ fontSize:14, fontWeight:600, color:'#1e293b' }}>{b.title}</span>
                            <Badge variant={b.status}>{statusLabel[b.status]||b.status}</Badge>
                            {b.featured && <Badge variant="featured">Онцлох</Badge>}
                          </div>
                          {b.excerpt && <p style={{ fontSize:12, color:'#94a3b8', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{b.excerpt}</p>}
                          <p style={{ fontSize:11, color:'#94a3b8', marginTop:4 }}>{formatDate(b.createdAt)}</p>
                        </div>
                        <div style={{ display:'flex', gap:4, flexShrink:0 }}>
                          <Btn variant="ghost" onClick={()=>handleEditBlog(b)}><Edit size={14}/></Btn>
                          <Btn variant="ghost" className="adm-btn-icon-danger" onClick={()=>handleDeleteBlog(b._id)}><Trash2 size={14}/></Btn>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── SERVICES ── */}
            {activeTab==='services' && (
              <div>
                <SectionHeader title="Маркетингийн үйлчилгээ" action={<Btn onClick={()=>{setShowServiceForm(!showServiceForm);if(!showServiceForm){setEditingService(null);setServiceForm(emptyService);}}}><Plus size={13}/>{showServiceForm?'Хаах':'Нэмэх'}</Btn>}/>
                {showServiceForm && (
                  <FormPanel title={editingService?'Үйлчилгээ засах':'Шинэ үйлчилгээ'}>
                    <form onSubmit={handleServiceSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
                      <Field label="Нэр" required><input type="text" required value={serviceForm.name} onChange={e=>setServiceForm({...serviceForm,name:e.target.value})} className={inputCls}/></Field>
                      <Field label="Товч тайлбар"><textarea rows="2" value={serviceForm.shortDescription} onChange={e=>setServiceForm({...serviceForm,shortDescription:e.target.value})} maxLength="200" className={inputCls} style={{ resize:'vertical' }}/></Field>
                      <Field label="Дэлгэрэнгүй тайлбар" required><textarea rows="5" required value={serviceForm.description} onChange={e=>setServiceForm({...serviceForm,description:e.target.value})} className={inputCls} style={{ resize:'vertical' }}/></Field>
                      <Field label="Онцлогууд" hint="Мөр бүрд нэг онцлог"><textarea rows="4" value={serviceForm.features} onChange={e=>setServiceForm({...serviceForm,features:e.target.value})} className={inputCls} style={{ resize:'vertical' }}/></Field>
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                        <Field label="Үнэ"><input type="text" value={serviceForm.price} onChange={e=>setServiceForm({...serviceForm,price:e.target.value})} className={inputCls} placeholder="50,000₮/сар"/></Field>
                        <Field label="Ангилал"><select value={serviceForm.category} onChange={e=>setServiceForm({...serviceForm,category:e.target.value})} className={selectCls}><option value="other">Бусад</option><option value="social-media">Сошиал медиа</option><option value="seo">SEO</option><option value="content">Контент</option><option value="advertising">Сурталчилгаа</option><option value="branding">Брэндинг</option></select></Field>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <input type="checkbox" id="svcFeat" checked={serviceForm.featured} onChange={e=>setServiceForm({...serviceForm,featured:e.target.checked})} className="adm-checkbox"/>
                        <label htmlFor="svcFeat" style={{ fontSize:13, color:'#475569', cursor:'pointer' }}>Онцлох үйлчилгээ</label>
                      </div>
                      <Field label="Зураг">
                        {serviceImagePreview?(
                          <div style={{ position:'relative' }}>
                            <img src={serviceImagePreview} alt="Preview" style={{ width:'100%', height:160, objectFit:'cover', borderRadius:10 }}/>
                            <button type="button" onClick={()=>{setServiceImage(null);setServiceImagePreview('');}} style={{ position:'absolute', top:8, right:8, width:28, height:28, borderRadius:'50%', background:'rgba(0,0,0,0.4)', border:'1px solid rgba(255,255,255,0.3)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}><X size={13}/></button>
                          </div>
                        ):(
                          <div className="adm-upload">
                            <input type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(f){setServiceImage(f);const r=new FileReader();r.onloadend=()=>setServiceImagePreview(r.result);r.readAsDataURL(f);}}} className="hidden" id="svc-img"/>
                            <label htmlFor="svc-img" style={{ cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:6, color:'#94a3b8' }}>
                              <Upload size={18}/><span style={{ fontSize:13 }}>Зураг сонгох</span>
                            </label>
                          </div>
                        )}
                      </Field>
                      <div style={{ display:'flex', gap:8 }}><Btn type="submit" style={{ flex:1, justifyContent:'center' }}>{editingService?'Шинэчлэх':'Нэмэх'}</Btn><Btn type="button" variant="secondary" onClick={()=>{setShowServiceForm(false);setEditingService(null);}}>Болих</Btn></div>
                    </form>
                  </FormPanel>
                )}
                {loading?<Loading/>:marketingServices.length===0?<EmptyState icon={Briefcase} message="Үйлчилгээ байхгүй байна"/>:(
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {marketingServices.map(s=>(
                      <Card key={s._id} style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:4 }}>
                            <span style={{ fontSize:14, fontWeight:600, color:'#1e293b' }}>{s.name}</span>
                            <Badge variant="purple">{s.category==='social-media'?'Сошиал':s.category==='seo'?'SEO':s.category==='content'?'Контент':s.category==='advertising'?'Реклам':s.category==='branding'?'Брэнд':'Бусад'}</Badge>
                            {s.featured && <Badge variant="featured">Онцлох</Badge>}
                          </div>
                          {s.shortDescription && <p style={{ fontSize:12, color:'#94a3b8', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.shortDescription}</p>}
                          {s.price && <p style={{ fontSize:12, fontWeight:600, color:'#2563eb', marginTop:4 }}>{s.price}</p>}
                        </div>
                        <div style={{ display:'flex', gap:4, flexShrink:0 }}>
                          <Btn variant="ghost" onClick={()=>handleEditService(s)}><Edit size={14}/></Btn>
                          <Btn variant="ghost" className="adm-btn-icon-danger" onClick={()=>handleDeleteService(s._id)}><Trash2 size={14}/></Btn>
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