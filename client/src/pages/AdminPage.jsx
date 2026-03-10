import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, Package, ShoppingCart, Plus, Edit, Trash2,
  Upload, Mail, CheckCircle, XCircle, X,
  LayoutDashboard, Tag, BookOpen, Briefcase, TrendingUp,
  ChevronLeft, ChevronRight, Menu, AlertCircle, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getAllOrders, updateOrderStatus, deleteOrder,
  getAllQuotations, deleteQuotation,
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

/* ─── Shared tokens matching HomePage ─── */
const FONT = "'DM Sans', 'Helvetica Neue', Arial, sans-serif";

const STATUS = {
  pending:    { label: 'Хүлээгдэж буй', cls: 'bg-amber-50 text-amber-700 border border-amber-200' },
  paid:       { label: 'Төлөгдсөн',     cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  processing: { label: 'Үйлдвэрлэлд',  cls: 'bg-blue-50 text-blue-700 border border-blue-200' },
  completed:  { label: 'Дууссан',       cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  cancelled:  { label: 'Цуцлагдсан',   cls: 'bg-red-50 text-red-600 border border-red-200' },
  new:        { label: 'Шинэ',          cls: 'bg-gray-900 text-white border border-gray-900' },
  read:       { label: 'Уншсан',        cls: 'bg-gray-100 text-gray-500 border border-gray-200' },
  replied:    { label: 'Хариулсан',     cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  archived:   { label: 'Архивласан',    cls: 'bg-gray-100 text-gray-400 border border-gray-200' },
  draft:      { label: 'Ноорог',        cls: 'bg-amber-50 text-amber-600 border border-amber-200' },
  published:  { label: 'Нийтлэгдсэн',  cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
};

/* ─── Primitives ─── */

// Matches HomePage's "Онцлох бүтээгдэхүүн" label style exactly
const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-2 mb-2">
    <span className="w-5 h-px bg-gray-300 inline-block" />
    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{children}</span>
  </div>
);

const Badge = ({ status }) => {
  const s = STATUS[status] || { label: status, cls: 'bg-gray-100 text-gray-500 border border-gray-200' };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-bold ${s.cls}`}>{s.label}</span>;
};

// Matches HomePage input style
const iCls = 'w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors';

const Field = ({ label, required, hint, children }) => (
  <div>
    {label && (
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}
    {children}
    {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
  </div>
);

// Matches HomePage "Холбоо барих" button
const Btn = ({ variant = 'primary', size = 'md', className = '', children, ...p }) => {
  const base = 'inline-flex items-center justify-center gap-1.5 font-bold rounded transition-all duration-150 focus:outline-none disabled:opacity-50 cursor-pointer';
  const sz = { sm: 'px-3 py-1.5 text-xs', md: 'px-5 py-2.5 text-sm', lg: 'px-6 py-3 text-sm' };
  const vr = {
    primary:   'bg-gray-900 text-white hover:bg-gray-700',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:border-gray-900',
    ghost:     'bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100',
  };
  return <button className={`${base} ${sz[size]} ${vr[variant] || vr.primary} ${className}`} {...p}>{children}</button>;
};

// Form panel with gray-50 bg — matches discount product section
const FormPanel = ({ title, children }) => (
  <div className="mb-6 p-5 bg-gray-50 border border-gray-200 rounded">
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-3 mb-4 border-b border-gray-200">{title}</p>
    {children}
  </div>
);

const EmptyState = ({ icon: Icon, message }) => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center mb-3">
      <Icon size={20} className="text-gray-300" />
    </div>
    <p className="text-sm text-gray-400">{message}</p>
  </div>
);

// Matches blog card hover exactly
const Row = ({ children, delay = 0, className = '' }) => (
  <div
    className={`bg-white border border-gray-200 rounded hover:border-gray-900 hover:shadow-lg transition-all duration-300 fade-up ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    {children}
  </div>
);

const UploadZone = ({ id, file, preview, onFile, onClear }) => (
  preview ? (
    <div className="relative">
      <img src={preview} alt="preview" className="w-full h-44 object-cover rounded border border-gray-200" />
      <button type="button" onClick={onClear} className="absolute top-2 right-2 w-7 h-7 bg-white border border-gray-200 rounded flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-300 transition-colors">
        <X size={13} />
      </button>
    </div>
  ) : (
    <div className="border-2 border-dashed border-gray-200 rounded p-6 text-center hover:border-gray-900 transition-colors cursor-pointer">
      <input type="file" accept="image/*" onChange={onFile} className="hidden" id={id} />
      <label htmlFor={id} className="cursor-pointer flex flex-col items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors">
        <Upload size={20} />
        <span className="text-sm font-medium">{file ? file.name : 'Зураг сонгох'}</span>
      </label>
    </div>
  )
);

/* ─── AdminPage ─── */
export default function AdminPage() {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const [tab, setTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Data
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [services, setServices] = useState([]);

  // Forms
  const EP = { name:'', price:'', category:'', description:'', material:'', size:'', format:'', stock:'', image:'', featured:false, discount:'', oldPrice:'' };
  const EC = { name:'', description:'', parent:'', icon:'Package', order:0 };
  const EB = { title:'', excerpt:'', content:'', category:'other', tags:'', status:'published', featured:false };
  const ES = { name:'', description:'', shortDescription:'', features:'', price:'', category:'other', icon:'TrendingUp', featured:false };

  const [showPF, setShowPF] = useState(false); const [editP, setEditP] = useState(null); const [pForm, setPForm] = useState(EP);
  const [selImg, setSelImg] = useState(null); const [imgPrev, setImgPrev] = useState(null);

  const [showCF, setShowCF] = useState(false); const [editC, setEditC] = useState(null); const [cForm, setCForm] = useState(EC);

  const [showBF, setShowBF] = useState(false); const [editB, setEditB] = useState(null); const [bForm, setBForm] = useState(EB);
  const [bImg, setBImg] = useState(null); const [bImgPrev, setBImgPrev] = useState('');

  const [showSF, setShowSF] = useState(false); const [editS, setEditS] = useState(null); const [sForm, setSForm] = useState(ES);
  const [sImg, setSImg] = useState(null); const [sImgPrev, setSImgPrev] = useState('');

  useEffect(() => { if (!isAdmin) { navigate('/'); return; } loadTab(tab); }, [tab, isAdmin]);
  useEffect(() => { setMobileOpen(false); }, [tab]);

  const notify = (message, type = 'success') => setNotif({ message, type });

  const loadTab = async (t) => {
    try {
      setLoading(true);
      if (t === 'dashboard') {
        const [o, q, m] = await Promise.all([getAllOrders().catch(()=>({data:[]})), getAllQuotations().catch(()=>({data:[]})), getAllContactMessages().catch(()=>({data:[]}))]);
        setOrders(o.data); setQuotations(q.data); setMessages(m.data);
      } else if (t === 'products') {
        const [p, c] = await Promise.all([getProducts(), getAllCategoriesFlat()]);
        setProducts(p.data); setCategories(c.data);
      } else if (t === 'orders') { const d = await getAllOrders(); setOrders(d.data);
      } else if (t === 'quotations') { const d = await getAllQuotations(); setQuotations(d.data);
      } else if (t === 'messages') { const d = await getAllContactMessages(); setMessages(d.data);
      } else if (t === 'categories') { const d = await getAllCategoriesFlat(); setCategories(d.data);
      } else if (t === 'blogs') { const d = await getAllBlogs(); setBlogs(d.data);
      } else if (t === 'services') { const d = await getAllMarketingServices(); setServices(d.data); }
    } catch(e) { console.error(e); } finally { setLoading(false); }
  };
  const reload = () => loadTab(tab);

  /* Product */
  const submitProduct = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      ['name','price','category','description','material','size','format','stock','featured'].forEach(k=>fd.append(k,pForm[k]));
      if (pForm.discount) fd.append('discount', pForm.discount);
      if (pForm.oldPrice) fd.append('oldPrice', pForm.oldPrice);
      if (selImg) fd.append('image', selImg); else if (pForm.image) fd.append('image', pForm.image);
      if (editP) { await updateProduct(editP._id, fd); notify('Бүтээгдэхүүн шинэчлэгдлээ'); }
      else { await createProduct(fd); notify('Бүтээгдэхүүн нэмэгдлээ'); }
      setShowPF(false); setEditP(null); setSelImg(null); setImgPrev(null); setPForm(EP); reload();
    } catch { notify('Алдаа гарлаа','error'); }
  };
  const deleteP = async (id) => { if(!window.confirm('Устгах уу?'))return; try{await deleteProduct(id);notify('Устгагдлаа');reload();}catch{notify('Алдаа','error');} };
  const editProduct = (p) => {
    setEditP(p); setSelImg(null);
    setPForm({name:p.name,price:p.price,category:typeof p.category==='object'?p.category._id:p.category,description:p.description||'',material:p.material||'',size:p.size||'',format:p.format||'',stock:p.stock||'',image:p.image||'',featured:p.featured||false,discount:p.discount||'',oldPrice:p.oldPrice||''});
    setImgPrev(p.image||null); setShowPF(true);
  };

  /* Order */
  const updateOrder = async (id, status) => { try{await updateOrderStatus(id,status);notify('Шинэчлэгдлээ');reload();}catch{notify('Алдаа','error');} };
  const deleteO = async (id) => { if(!window.confirm('Устгах уу?'))return; try{await deleteOrder(id);notify('Устгагдлаа');reload();}catch{notify('Алдаа','error');} };

  /* Quotation */
  const deleteQ = async (id) => { if(!window.confirm('Устгах уу?'))return; try{await deleteQuotation(id);notify('Устгагдлаа');reload();}catch{notify('Алдаа','error');} };

  /* Message */
  const updateMsg = async (id, status) => { try{await updateContactMessageStatus(id,status);notify('Шинэчлэгдлээ');reload();}catch{notify('Алдаа','error');} };
  const deleteMsg = async (id) => { if(!window.confirm('Устгах уу?'))return; try{await deleteContactMessage(id);notify('Устгагдлаа');reload();}catch{notify('Алдаа','error');} };

  /* Category */
  const submitCategory = async (e) => {
    e.preventDefault();
    try {
      if (editC) { await updateCategory(editC._id, cForm); notify('Шинэчлэгдлээ'); }
      else { await createCategory(cForm); notify('Нэмэгдлээ'); }
      setShowCF(false); setEditC(null); setCForm(EC); reload();
    } catch(e) { notify(e.response?.data?.message||'Алдаа','error'); }
  };
  const editCat = (c) => { setEditC(c); setCForm({name:c.name,description:c.description||'',parent:c.parent?._id||'',icon:c.icon||'Package',order:c.order||0}); setShowCF(true); };
  const deleteCat = async (id) => { if(!window.confirm('Устгах уу?'))return; try{await deleteCategory(id);notify('Устгагдлаа');reload();}catch(e){notify(e.response?.data?.message||'Алдаа','error');} };

  /* Blog */
  const submitBlog = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('title',bForm.title); fd.append('excerpt',bForm.excerpt); fd.append('content',bForm.content);
      fd.append('category',bForm.category); fd.append('tags',bForm.tags?bForm.tags.split(',').map(t=>t.trim()).join(','):'');
      fd.append('status',bForm.status); fd.append('featured',bForm.featured);
      if (bImg) fd.append('file',bImg);
      if (editB) { await updateBlog(editB._id,fd); notify('Шинэчлэгдлээ'); }
      else { await createBlog(fd); notify('Нэмэгдлээ'); }
      setShowBF(false); setEditB(null); setBForm(EB); setBImg(null); setBImgPrev(''); reload();
    } catch(e) { notify(e.response?.data?.message||'Алдаа','error'); }
  };
  const editBlog = (b) => {
    setEditB(b); setBForm({title:b.title,excerpt:b.excerpt||'',content:b.content,category:b.category,tags:b.tags?b.tags.join(', '):'',status:b.status,featured:b.featured||false});
    if(b.image)setBImgPrev(b.image); setShowBF(true);
  };
  const deleteBlog_ = async (id) => { if(!window.confirm('Устгах уу?'))return; try{await deleteBlog(id);notify('Устгагдлаа');reload();}catch(e){notify(e.response?.data?.message||'Алдаа','error');} };

  /* Service */
  const submitService = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('name',sForm.name); fd.append('description',sForm.description); fd.append('shortDescription',sForm.shortDescription);
      fd.append('features',sForm.features?sForm.features.split('\n').map(f=>f.trim()).filter(Boolean).join('\n'):'');
      fd.append('price',sForm.price); fd.append('category',sForm.category); fd.append('icon',sForm.icon); fd.append('featured',sForm.featured);
      if (sImg) fd.append('file',sImg);
      if (editS) { await updateMarketingService(editS._id,fd); notify('Шинэчлэгдлээ'); }
      else { await createMarketingService(fd); notify('Нэмэгдлээ'); }
      setShowSF(false); setEditS(null); setSForm(ES); setSImg(null); setSImgPrev(''); reload();
    } catch(e) { notify(e.response?.data?.message||'Алдаа','error'); }
  };
  const editSvc = (s) => {
    setEditS(s); setSForm({name:s.name,description:s.description,shortDescription:s.shortDescription||'',features:s.features?s.features.join('\n'):'',price:s.price||'',category:s.category,icon:s.icon||'TrendingUp',featured:s.featured||false});
    if(s.image)setSImgPrev(s.image); setShowSF(true);
  };
  const deleteSvc = async (id) => { if(!window.confirm('Устгах уу?'))return; try{await deleteMarketingService(id);notify('Устгагдлаа');reload();}catch(e){notify(e.response?.data?.message||'Алдаа','error');} };

  /* Nav */
  const navItems = [
    { id:'dashboard',  label:'Самбар',       Icon:LayoutDashboard },
    { id:'products',   label:'Бүтээгдэхүүн', Icon:Package,      stat:products.length },
    { id:'orders',     label:'Захиалга',      Icon:ShoppingCart, stat:orders.length },
    { id:'quotations', label:'Үнийн санал',   Icon:TrendingUp,   badge:quotations.filter(q=>q.status==='pending').length },
    { id:'messages',   label:'Мессеж',        Icon:Mail,         badge:messages.filter(m=>m.status==='new').length },
    { id:'categories', label:'Ангилал',       Icon:Tag },
    { id:'blogs',      label:'Блог',          Icon:BookOpen,     stat:blogs.length },
    { id:'services',   label:'Үйлчилгээ',     Icon:Briefcase,    stat:services.length },
  ];
  const activeNav = navItems.find(n=>n.id===tab);
  const totalAlerts = navItems.reduce((s,n)=>s+(n.badge||0),0);

  /* Nav item component */
  const NavBtn = ({ item, collapsed }) => {
    const { Icon } = item;
    const active = tab === item.id;
    return (
      <button
        onClick={()=>setTab(item.id)}
        title={collapsed ? item.label : undefined}
        className={`w-full flex items-center rounded transition-all duration-150
          ${collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'}
          ${active ? 'bg-white text-gray-900' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
      >
        <Icon size={15} className="flex-shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1 text-left text-sm font-bold tracking-tight">{item.label}</span>
            {item.badge > 0 && <span className="bg-white text-gray-900 text-xs font-black px-1.5 py-0.5 rounded-sm">{item.badge}</span>}
            {!item.badge && item.stat > 0 && <span className={`text-xs px-1.5 py-0.5 rounded-sm font-bold ${active?'bg-gray-200 text-gray-700':'bg-white/10 text-gray-500'}`}>{item.stat}</span>}
          </>
        )}
      </button>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: FONT, background: '#f3f4f6' }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp .35s ease forwards}
        @keyframes slideIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        .slide-in{animation:slideIn .25s ease forwards}
        .scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}
        .scrollbar-hide::-webkit-scrollbar{display:none}
      `}</style>

      {notif && <Notification type={notif.type} message={notif.message} onClose={()=>setNotif(null)} />}

      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={()=>setMobileOpen(false)} />}

      {/* Mobile sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-gray-950 flex flex-col transform transition-transform duration-300 lg:hidden ${mobileOpen?'translate-x-0':'-translate-x-full'}`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-white rounded flex items-center justify-center"><span className="text-gray-900 font-black text-xs">A</span></div>
            <div><p className="text-white font-bold text-sm leading-tight">Admin Panel</p><p className="text-gray-500 text-xs truncate max-w-[120px]">{user?.name}</p></div>
          </div>
          <button onClick={()=>setMobileOpen(false)} className="text-gray-500 hover:text-white p-1 transition-colors"><X size={16}/></button>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto scrollbar-hide">
          {navItems.map(item=><NavBtn key={item.id} item={item} collapsed={false}/>)}
        </nav>
        <div className="px-2 pb-4 pt-2 border-t border-white/10">
          <button onClick={()=>{logout();navigate('/');}} className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-gray-500 hover:text-red-400 hover:bg-red-500/10 text-sm font-bold transition-all">
            <LogOut size={15}/><span>Гарах</span>
          </button>
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col flex-shrink-0 bg-gray-950 transition-all duration-300 relative ${sidebarOpen?'w-56':'w-14'}`}>
        <div className={`flex items-center border-b border-white/10 ${sidebarOpen?'gap-2.5 px-4 py-5':'justify-center px-2 py-5'}`}>
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center flex-shrink-0">
            <span className="text-gray-900 font-black text-sm">A</span>
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-white font-bold text-sm leading-tight tracking-tight">Admin Panel</p>
              <p className="text-gray-500 text-xs truncate max-w-[130px]">{user?.name}</p>
            </div>
          )}
        </div>
        {/* Toggle */}
        <button onClick={()=>setSidebarOpen(!sidebarOpen)} className="absolute -right-3 top-[68px] w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 shadow-sm z-10 transition-colors">
          {sidebarOpen ? <ChevronLeft size={11}/> : <ChevronRight size={11}/>}
        </button>
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto scrollbar-hide">
          {sidebarOpen && <p className="px-3 py-2 text-xs font-bold text-gray-600 uppercase tracking-widest">Цэс</p>}
          {navItems.map(item=><NavBtn key={item.id} item={item} collapsed={!sidebarOpen}/>)}
        </nav>
        <div className="px-2 pb-4 pt-2 border-t border-white/10">
          <button onClick={()=>{logout();navigate('/');}} title={!sidebarOpen?'Гарах':undefined}
            className={`w-full flex items-center rounded text-gray-500 hover:text-red-400 hover:bg-red-500/10 text-sm font-bold transition-all ${sidebarOpen?'gap-3 px-3 py-2.5':'justify-center p-2.5'}`}>
            <LogOut size={15} className="flex-shrink-0"/>
            {sidebarOpen && <span>Гарах</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar — matches HomePage header */}
        <header className="flex-shrink-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button onClick={()=>setMobileOpen(true)} className="lg:hidden p-1.5 rounded text-gray-500 hover:bg-gray-100 transition-colors"><Menu size={17}/></button>
            <div className="flex items-center gap-2">
              <SectionLabel>Удирдлага</SectionLabel>
              <ChevronRight size={12} className="text-gray-300 -mb-2"/>
              <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">{activeNav?.label}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {totalAlerts > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded text-xs font-bold">
                <AlertCircle size={11}/><span>{totalAlerts} шинэ</span>
              </div>
            )}
            <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center text-white text-xs font-black">
              {user?.name?.[0]?.toUpperCase()||'A'}
            </div>
          </div>
        </header>

        {/* Page — matches HomePage max-w + white panel */}
        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="bg-white border-x border-b border-gray-200 min-h-full">

              {/* ── DASHBOARD ── */}
              {tab === 'dashboard' && (
                <div className="px-5 md:px-8 py-9 fade-up">
                  <SectionLabel>Удирдлагын самбар</SectionLabel>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">Самбар</h2>
                  <DashboardTab onTabChange={setTab} />
                </div>
              )}

              {/* ── PRODUCTS ── */}
              {tab === 'products' && (
                <div className="px-5 md:px-8 py-9 fade-up">
                  <div className="flex items-end justify-between mb-6">
                    <div><SectionLabel>Каталог</SectionLabel><h2 className="text-2xl font-bold text-gray-900 tracking-tight">Бүтээгдэхүүн</h2></div>
                    <Btn onClick={()=>{setShowPF(!showPF);if(showPF){setEditP(null);setPForm(EP);setSelImg(null);setImgPrev(null);}}}><Plus size={13}/>{showPF?'Хаах':'Нэмэх'}</Btn>
                  </div>

                  {showPF && (
                    <FormPanel title={editP?'Бүтээгдэхүүн засах':'Шинэ бүтээгдэхүүн'}>
                      <form onSubmit={submitProduct} className="space-y-4 slide-in">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field label="Нэр" required><input type="text" placeholder="Бүтээгдэхүүний нэр" value={pForm.name} required onChange={e=>setPForm({...pForm,name:e.target.value})} className={iCls}/></Field>
                          <Field label="Үнэ (₮)" required><input type="number" placeholder="50000" value={pForm.price} required onChange={e=>setPForm({...pForm,price:e.target.value})} className={iCls}/></Field>
                          <Field label="Ангилал" required>
                            <select value={pForm.category} onChange={e=>setPForm({...pForm,category:e.target.value})} required className={`${iCls} cursor-pointer`}>
                              <option value="">Сонгох...</option>
                              {categories.filter(c=>!c.parent).map(cat=>(
                                <optgroup key={cat._id} label={cat.name}>
                                  <option value={cat._id}>{cat.name}</option>
                                  {categories.filter(s=>s.parent?._id===cat._id).map(s=><option key={s._id} value={s._id}>  {s.name}</option>)}
                                </optgroup>
                              ))}
                            </select>
                          </Field>
                          <Field label="Нөөц"><input type="number" placeholder="1000" value={pForm.stock} onChange={e=>setPForm({...pForm,stock:e.target.value})} className={iCls}/></Field>
                          <Field label="Хэмжээ"><input type="text" placeholder="A4, 85x54mm" value={pForm.size} onChange={e=>setPForm({...pForm,size:e.target.value})} className={iCls}/></Field>
                          <Field label="Материал"><input type="text" placeholder="300gsm цаас" value={pForm.material} onChange={e=>setPForm({...pForm,material:e.target.value})} className={iCls}/></Field>
                        </div>
                        <Field label="Тайлбар">
                          <EnhancedTextarea value={pForm.description} onChange={e=>setPForm({...pForm,description:e.target.value})} placeholder="Тайлбар..." rows={4} maxLength={2000} showInstructions/>
                        </Field>
                        <Field label="Зураг">
                          <UploadZone id="pImg" file={selImg} preview={imgPrev}
                            onFile={e=>{const f=e.target.files[0];if(f){setSelImg(f);const r=new FileReader();r.onloadend=()=>setImgPrev(r.result);r.readAsDataURL(f);}}}
                            onClear={()=>{setSelImg(null);setImgPrev(null);}}/>
                        </Field>
                        <div className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded">
                          <input type="checkbox" id="feat" checked={pForm.featured} onChange={e=>setPForm({...pForm,featured:e.target.checked})} className="w-4 h-4 accent-gray-900"/>
                          <label htmlFor="feat" className="text-sm font-semibold text-gray-700 cursor-pointer">Онцлох бүтээгдэхүүн — нүүр хуудсанд харагдана</label>
                        </div>
                        <div className="p-4 bg-white border border-gray-200 rounded">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Хямдрал</p>
                          <div className="grid grid-cols-2 gap-4">
                            <Field label="Хувь (%)"><input type="number" min="0" max="100" value={pForm.discount} onChange={e=>{const d=e.target.value;setPForm(prev=>{const u={...prev,discount:d};if(d&&prev.price)u.oldPrice=Math.round(parseFloat(prev.price)/(1-parseFloat(d)/100)).toString();return u;})}} className={iCls}/></Field>
                            <Field label="Хуучин үнэ (₮)"><input type="number" value={pForm.oldPrice} onChange={e=>setPForm({...pForm,oldPrice:e.target.value})} className={iCls}/></Field>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Btn type="submit" className="flex-1 justify-center py-3">{editP?'Шинэчлэх':'Нэмэх'}</Btn>
                          <Btn type="button" variant="secondary" onClick={()=>{setShowPF(false);setEditP(null);setSelImg(null);setImgPrev(null);setPForm(EP);}}>Болих</Btn>
                        </div>
                      </form>
                    </FormPanel>
                  )}

                  {loading ? <Loading/> : products.length===0 ? <EmptyState icon={Package} message="Бүтээгдэхүүн байхгүй байна"/> : (
                    <div className="space-y-2">
                      {products.map((p,i)=>(
                        <Row key={p._id} delay={i*0.04} className="flex items-center gap-4 p-4">
                          <img src={getImageUrl(p.image)} alt={p.name} className="w-14 h-14 object-cover rounded border border-gray-100 flex-shrink-0" onError={e=>{e.target.src='/placeholder.png';}}/>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{p.name}</p>
                            <p className="text-sm font-bold text-gray-700">{formatPrice(p.price)}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{typeof p.category==='object'?p.category?.name:p.category}</p>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <Btn variant="ghost" size="sm" onClick={()=>editProduct(p)}><Edit size={13}/></Btn>
                            <Btn variant="ghost" size="sm" className="hover:text-red-600 hover:bg-red-50" onClick={()=>deleteP(p._id)}><Trash2 size={13}/></Btn>
                          </div>
                        </Row>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── ORDERS ── */}
              {tab === 'orders' && (
                <div className="px-5 md:px-8 py-9 fade-up">
                  <div className="mb-6"><SectionLabel>Борлуулалт</SectionLabel><h2 className="text-2xl font-bold text-gray-900 tracking-tight">Захиалга удирдах</h2></div>
                  {loading ? <Loading/> : orders.length===0 ? <EmptyState icon={ShoppingCart} message="Захиалга байхгүй байна"/> : (
                    <div className="space-y-2">
                      {orders.map((o,i)=>(
                        <Row key={o._id} delay={i*0.04} className="p-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest"># {o._id.slice(-6).toUpperCase()}</span>
                                <Badge status={o.status}/>
                              </div>
                              <p className="text-sm font-semibold text-gray-800">{o.shippingInfo.name} — {o.shippingInfo.phone}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{formatDate(o.createdAt)}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-base font-bold text-gray-900">{formatPrice(o.total)}</span>
                              <select value={o.status} onChange={e=>updateOrder(o._id,e.target.value)} className="text-xs border border-gray-200 rounded px-2.5 py-1.5 bg-white text-gray-700 font-semibold focus:outline-none focus:border-gray-900 cursor-pointer transition-colors">
                                <option value="pending">Хүлээгдэж буй</option>
                                <option value="paid">Төлөгдсөн</option>
                                <option value="processing">Үйлдвэрлэлд</option>
                                <option value="completed">Дууссан</option>
                                <option value="cancelled">Цуцлагдсан</option>
                              </select>
                              <Btn variant="ghost" size="sm" className="hover:text-red-600 hover:bg-red-50" onClick={()=>deleteO(o._id)}><Trash2 size={13}/></Btn>
                            </div>
                          </div>
                        </Row>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── QUOTATIONS ── */}
              {tab === 'quotations' && (
                <div className="px-5 md:px-8 py-9 fade-up">
                  <div className="mb-6"><SectionLabel>Хүсэлт</SectionLabel><h2 className="text-2xl font-bold text-gray-900 tracking-tight">Үнийн санал удирдах</h2></div>
                  {loading ? <Loading/> : quotations.length===0 ? <EmptyState icon={TrendingUp} message="Үнийн санал байхгүй байна"/> : (
                    <div className="space-y-2">
                      {quotations.map((q,i)=>(
                        <Row key={q._id} delay={i*0.04} className="p-4">
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-sm font-bold text-gray-900">{q.name}</span>
                                <Badge status={q.status==='pending'?'pending':'replied'}/>
                              </div>
                              <p className="text-xs text-gray-400 mb-2">{q.phone} · {q.email}</p>
                              <p className="text-sm text-gray-700 mb-1"><span className="font-bold">Төрөл:</span> {q.productType}</p>
                              <p className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded border border-gray-100">{q.description}</p>
                              {q.designFile && (
                                <div className="mt-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded">
                                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Дизайн файл</p>
                                  <a href={getImageUrl(q.designFile.fileUrl)} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-gray-900 hover:underline inline-flex items-center gap-1">{q.designFile.fileName}<ArrowRight size={10}/></a>
                                </div>
                              )}
                            </div>
                            <Btn variant="ghost" size="sm" className="hover:text-red-600 hover:bg-red-50 flex-shrink-0" onClick={()=>deleteQ(q._id)}><Trash2 size={13}/></Btn>
                          </div>
                        </Row>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── MESSAGES ── */}
              {tab === 'messages' && (
                <div className="px-5 md:px-8 py-9 fade-up">
                  <div className="mb-6"><SectionLabel>Харилцаа</SectionLabel><h2 className="text-2xl font-bold text-gray-900 tracking-tight">Холбоо барих мессежүүд</h2></div>
                  {loading ? <Loading/> : messages.length===0 ? <EmptyState icon={Mail} message="Мессеж байхгүй байна"/> : (
                    <div className="space-y-2">
                      {messages.map((m,i)=>(
                        <Row key={m._id} delay={i*0.04} className="p-4">
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-sm font-bold text-gray-900">{m.name}</span>
                                <Badge status={m.status}/>
                              </div>
                              <p className="text-xs text-gray-400 mb-2">{m.email} · {formatDate(m.createdAt)}</p>
                              <p className="text-sm font-bold text-gray-700 mb-1">{m.subject}</p>
                              <p className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded border border-gray-100">{m.message}</p>
                              {m.adminReply && (
                                <div className="mt-2 px-3 py-2 bg-gray-50 border-l-2 border-gray-900">
                                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">Админ хариу</p>
                                  <p className="text-sm text-gray-700">{m.adminReply.message}</p>
                                  <p className="text-xs text-gray-400 mt-1">{formatDate(m.adminReply.repliedAt)}</p>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-1 flex-shrink-0">
                              {m.status==='new' && <Btn variant="ghost" size="sm" onClick={()=>updateMsg(m._id,'read')} title="Уншсан"><CheckCircle size={13} className="text-gray-700"/></Btn>}
                              {m.status!=='archived' && <Btn variant="ghost" size="sm" onClick={()=>updateMsg(m._id,'archived')} title="Архивлах"><XCircle size={13}/></Btn>}
                              <Btn variant="ghost" size="sm" className="hover:text-red-600 hover:bg-red-50" onClick={()=>deleteMsg(m._id)} title="Устгах"><Trash2 size={13}/></Btn>
                            </div>
                          </div>
                        </Row>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── CATEGORIES ── */}
              {tab === 'categories' && (
                <div className="px-5 md:px-8 py-9 fade-up">
                  <div className="flex items-end justify-between mb-6">
                    <div><SectionLabel>Бүтэц</SectionLabel><h2 className="text-2xl font-bold text-gray-900 tracking-tight">Ангилал удирдах</h2></div>
                    <Btn onClick={()=>{setShowCF(!showCF);if(!showCF){setEditC(null);setCForm(EC);}}}><Plus size={13}/>{showCF?'Хаах':'Нэмэх'}</Btn>
                  </div>
                  {showCF && (
                    <FormPanel title={editC?'Ангилал засах':'Шинэ ангилал'}>
                      <form onSubmit={submitCategory} className="space-y-4 slide-in">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field label="Нэр" required><input type="text" required value={cForm.name} onChange={e=>setCForm({...cForm,name:e.target.value})} className={iCls} placeholder="Ангиллын нэр"/></Field>
                          <Field label="Үндсэн ангилал">
                            <select value={cForm.parent} onChange={e=>setCForm({...cForm,parent:e.target.value})} className={`${iCls} cursor-pointer`}>
                              <option value="">-- Үндсэн ангилал --</option>
                              {categories.filter(c=>!c.parent).map(c=><option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                          </Field>
                          <Field label="Icon" hint="lucide-react icon нэр"><input type="text" value={cForm.icon} onChange={e=>setCForm({...cForm,icon:e.target.value})} className={iCls} placeholder="Package"/></Field>
                          <Field label="Дараалал"><input type="number" value={cForm.order} onChange={e=>setCForm({...cForm,order:parseInt(e.target.value)||0})} className={iCls}/></Field>
                        </div>
                        <Field label="Тайлбар"><textarea rows="3" value={cForm.description} onChange={e=>setCForm({...cForm,description:e.target.value})} className={`${iCls} resize-y`}/></Field>
                        <div className="flex gap-2">
                          <Btn type="submit" className="flex-1 justify-center py-3">{editC?'Шинэчлэх':'Нэмэх'}</Btn>
                          <Btn type="button" variant="secondary" onClick={()=>{setShowCF(false);setEditC(null);}}>Болих</Btn>
                        </div>
                      </form>
                    </FormPanel>
                  )}
                  {loading ? <Loading/> : categories.length===0 ? <EmptyState icon={Tag} message="Ангилал байхгүй байна"/> : (
                    <div className="space-y-2">
                      {categories.filter(c=>!c.parent).map((cat,i)=>(
                        <div key={cat._id} className="fade-up" style={{animationDelay:`${i*0.04}s`}}>
                          <Row className="flex items-center gap-3 p-4">
                            <div className="w-1 h-9 bg-gray-900 rounded-full flex-shrink-0"/>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900">{cat.name}</p>
                              {cat.description && <p className="text-xs text-gray-400 mt-0.5">{cat.description}</p>}
                              <p className="text-xs text-gray-300 mt-0.5">Icon: {cat.icon} · Order: {cat.order}</p>
                            </div>
                            <div className="flex gap-1">
                              <Btn variant="ghost" size="sm" onClick={()=>editCat(cat)}><Edit size={13}/></Btn>
                              <Btn variant="ghost" size="sm" className="hover:text-red-600 hover:bg-red-50" onClick={()=>deleteCat(cat._id)}><Trash2 size={13}/></Btn>
                            </div>
                          </Row>
                          {categories.filter(s=>s.parent?._id===cat._id).map(s=>(
                            <div key={s._id} className="ml-6 mt-1.5 flex items-center gap-3 p-3.5 bg-gray-50 border border-gray-200 rounded hover:border-gray-400 transition-all duration-200">
                              <div className="w-1 h-6 bg-gray-300 rounded-full flex-shrink-0"/>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-700">{s.name}</p>
                                {s.description && <p className="text-xs text-gray-400">{s.description}</p>}
                              </div>
                              <div className="flex gap-1">
                                <Btn variant="ghost" size="sm" onClick={()=>editCat(s)}><Edit size={13}/></Btn>
                                <Btn variant="ghost" size="sm" className="hover:text-red-600 hover:bg-red-50" onClick={()=>deleteCat(s._id)}><Trash2 size={13}/></Btn>
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
              {tab === 'blogs' && (
                <div className="px-5 md:px-8 py-9 fade-up">
                  <div className="flex items-end justify-between mb-6">
                    <div><SectionLabel>Контент</SectionLabel><h2 className="text-2xl font-bold text-gray-900 tracking-tight">Блог удирдах</h2></div>
                    <Btn onClick={()=>{setShowBF(!showBF);if(!showBF){setEditB(null);setBForm(EB);setBImg(null);setBImgPrev('');}}}><Plus size={13}/>{showBF?'Хаах':'Нэмэх'}</Btn>
                  </div>
                  {showBF && (
                    <FormPanel title={editB?'Блог засах':'Шинэ блог'}>
                      <form onSubmit={submitBlog} className="space-y-4 slide-in">
                        <Field label="Гарчиг" required><input type="text" required value={bForm.title} onChange={e=>setBForm({...bForm,title:e.target.value})} className={iCls} placeholder="Блогийн гарчиг"/></Field>
                        <Field label="Товч агуулга"><textarea rows="2" value={bForm.excerpt} onChange={e=>setBForm({...bForm,excerpt:e.target.value})} maxLength="500" className={`${iCls} resize-y`}/></Field>
                        <Field label="Агуулга" required><textarea rows="10" required value={bForm.content} onChange={e=>setBForm({...bForm,content:e.target.value})} className={`${iCls} resize-y`}/></Field>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field label="Ангилал">
                            <select value={bForm.category} onChange={e=>setBForm({...bForm,category:e.target.value})} className={`${iCls} cursor-pointer`}>
                              <option value="other">Бусад</option><option value="news">Мэдээ</option>
                              <option value="tutorial">Заавар</option><option value="tips">Зөвлөмж</option>
                              <option value="case-study">Туршилт</option><option value="announcement">Мэдэгдэл</option>
                            </select>
                          </Field>
                          <Field label="Статус">
                            <select value={bForm.status} onChange={e=>setBForm({...bForm,status:e.target.value})} className={`${iCls} cursor-pointer`}>
                              <option value="draft">Ноорог</option><option value="published">Нийтлэгдсэн</option><option value="archived">Архивласан</option>
                            </select>
                          </Field>
                        </div>
                        <Field label="Tags" hint="Таслалаар тусгаарлана"><input type="text" value={bForm.tags} onChange={e=>setBForm({...bForm,tags:e.target.value})} className={iCls} placeholder="хэвлэл, дизайн"/></Field>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="bFeat" checked={bForm.featured} onChange={e=>setBForm({...bForm,featured:e.target.checked})} className="w-4 h-4 accent-gray-900"/>
                          <label htmlFor="bFeat" className="text-sm font-semibold text-gray-700 cursor-pointer">Онцлох блог</label>
                        </div>
                        <Field label="Зураг">
                          <UploadZone id="bImg" file={bImg} preview={bImgPrev}
                            onFile={e=>{const f=e.target.files[0];if(f){setBImg(f);const r=new FileReader();r.onloadend=()=>setBImgPrev(r.result);r.readAsDataURL(f);}}}
                            onClear={()=>{setBImg(null);setBImgPrev('');}}/>
                        </Field>
                        <div className="flex gap-2">
                          <Btn type="submit" className="flex-1 justify-center py-3">{editB?'Шинэчлэх':'Нэмэх'}</Btn>
                          <Btn type="button" variant="secondary" onClick={()=>{setShowBF(false);setEditB(null);}}>Болих</Btn>
                        </div>
                      </form>
                    </FormPanel>
                  )}
                  {/* Blog grid matching HomePage blog grid */}
                  {loading ? <Loading/> : blogs.length===0 ? <EmptyState icon={BookOpen} message="Блог байхгүй байна"/> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {blogs.map((b,i)=>(
                        <div key={b._id} className="group bg-white border border-gray-200 rounded overflow-hidden hover:border-gray-900 hover:shadow-lg transition-all duration-300 fade-up" style={{animationDelay:`${i*0.06}s`}}>
                          <div className="relative h-44 bg-gray-100 overflow-hidden">
                            {b.image
                              ? <img src={getImageUrl(b.image)} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e=>{e.target.parentElement.innerHTML='<div class="w-full h-full flex items-center justify-center"><span class="text-xs font-bold text-gray-300 uppercase tracking-widest">No Image</span></div>';}}/>
                              : <div className="w-full h-full flex items-center justify-center"><span className="text-xs font-bold text-gray-300 uppercase tracking-widest">No Image</span></div>
                            }
                            {b.featured && <div className="absolute top-2.5 left-2.5 bg-gray-900 text-white text-xs font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider">Онцлох</div>}
                          </div>
                          <div className="p-4">
                            <div className="mb-2"><Badge status={b.status}/></div>
                            <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1 line-clamp-2">{b.title}</h3>
                            {b.excerpt && <p className="text-xs text-gray-400 line-clamp-2 mb-3">{b.excerpt}</p>}
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <span className="text-xs text-gray-400">{formatDate(b.createdAt)}</span>
                              <div className="flex gap-1">
                                <Btn variant="ghost" size="sm" onClick={()=>editBlog(b)}><Edit size={13}/></Btn>
                                <Btn variant="ghost" size="sm" className="hover:text-red-600 hover:bg-red-50" onClick={()=>deleteBlog_(b._id)}><Trash2 size={13}/></Btn>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── SERVICES ── */}
              {tab === 'services' && (
                <div className="px-5 md:px-8 py-9 fade-up">
                  <div className="flex items-end justify-between mb-6">
                    <div><SectionLabel>Маркетинг</SectionLabel><h2 className="text-2xl font-bold text-gray-900 tracking-tight">Үйлчилгээ удирдах</h2></div>
                    <Btn onClick={()=>{setShowSF(!showSF);if(!showSF){setEditS(null);setSForm(ES);setSImg(null);setSImgPrev('');}}}><Plus size={13}/>{showSF?'Хаах':'Нэмэх'}</Btn>
                  </div>
                  {showSF && (
                    <FormPanel title={editS?'Үйлчилгээ засах':'Шинэ үйлчилгээ'}>
                      <form onSubmit={submitService} className="space-y-4 slide-in">
                        <Field label="Нэр" required><input type="text" required value={sForm.name} onChange={e=>setSForm({...sForm,name:e.target.value})} className={iCls}/></Field>
                        <Field label="Товч тайлбар"><textarea rows="2" value={sForm.shortDescription} onChange={e=>setSForm({...sForm,shortDescription:e.target.value})} maxLength="200" className={`${iCls} resize-y`}/></Field>
                        <Field label="Дэлгэрэнгүй тайлбар" required><textarea rows="5" required value={sForm.description} onChange={e=>setSForm({...sForm,description:e.target.value})} className={`${iCls} resize-y`}/></Field>
                        <Field label="Онцлогууд" hint="Мөр бүрд нэг"><textarea rows="4" value={sForm.features} onChange={e=>setSForm({...sForm,features:e.target.value})} className={`${iCls} resize-y`}/></Field>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field label="Үнэ"><input type="text" value={sForm.price} onChange={e=>setSForm({...sForm,price:e.target.value})} className={iCls} placeholder="50,000₮/сар"/></Field>
                          <Field label="Ангилал">
                            <select value={sForm.category} onChange={e=>setSForm({...sForm,category:e.target.value})} className={`${iCls} cursor-pointer`}>
                              <option value="other">Бусад</option><option value="social-media">Сошиал медиа</option>
                              <option value="seo">SEO</option><option value="content">Контент</option>
                              <option value="advertising">Сурталчилгаа</option><option value="branding">Брэндинг</option>
                            </select>
                          </Field>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="sFeat" checked={sForm.featured} onChange={e=>setSForm({...sForm,featured:e.target.checked})} className="w-4 h-4 accent-gray-900"/>
                          <label htmlFor="sFeat" className="text-sm font-semibold text-gray-700 cursor-pointer">Онцлох үйлчилгээ</label>
                        </div>
                        <Field label="Зураг">
                          <UploadZone id="sImg" file={sImg} preview={sImgPrev}
                            onFile={e=>{const f=e.target.files[0];if(f){setSImg(f);const r=new FileReader();r.onloadend=()=>setSImgPrev(r.result);r.readAsDataURL(f);}}}
                            onClear={()=>{setSImg(null);setSImgPrev('');}}/>
                        </Field>
                        <div className="flex gap-2">
                          <Btn type="submit" className="flex-1 justify-center py-3">{editS?'Шинэчлэх':'Нэмэх'}</Btn>
                          <Btn type="button" variant="secondary" onClick={()=>{setShowSF(false);setEditS(null);}}>Болих</Btn>
                        </div>
                      </form>
                    </FormPanel>
                  )}
                  {/* Service banners matching HomePage service banner grid */}
                  {loading ? <Loading/> : services.length===0 ? <EmptyState icon={Briefcase} message="Үйлчилгээ байхгүй байна"/> : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {services.map((s,i)=>(
                        <div key={s._id} className="group bg-white border border-gray-200 rounded overflow-hidden hover:border-gray-900 hover:shadow-lg transition-all duration-300 fade-up" style={{animationDelay:`${i*0.06}s`}}>
                          {s.image && (
                            <div className="h-28 overflow-hidden">
                              <img src={getImageUrl(s.image)} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                            </div>
                          )}
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <p className="text-sm font-bold text-gray-900">{s.name}</p>
                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest border border-gray-200 px-2 py-0.5 rounded-sm">
                                    {s.category==='social-media'?'Сошиал':s.category==='seo'?'SEO':s.category==='content'?'Контент':s.category==='advertising'?'Реклам':s.category==='branding'?'Брэнд':'Бусад'}
                                  </span>
                                  {s.featured && <span className="text-xs font-bold text-gray-900 uppercase tracking-widest border border-gray-900 px-2 py-0.5 rounded-sm">Онцлох</span>}
                                </div>
                              </div>
                              <div className="flex gap-1 flex-shrink-0">
                                <Btn variant="ghost" size="sm" onClick={()=>editSvc(s)}><Edit size={13}/></Btn>
                                <Btn variant="ghost" size="sm" className="hover:text-red-600 hover:bg-red-50" onClick={()=>deleteSvc(s._id)}><Trash2 size={13}/></Btn>
                              </div>
                            </div>
                            {s.shortDescription && <p className="text-xs text-gray-400 line-clamp-2">{s.shortDescription}</p>}
                            {s.price && <p className="text-xs font-bold text-gray-700 mt-2">{s.price}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}