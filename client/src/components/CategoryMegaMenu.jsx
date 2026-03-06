import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Grid, ArrowRight } from 'lucide-react';
import { getProducts } from '../services/api';
import { getImageUrl, formatPrice } from '../utils/helpers';

const CategoryMegaMenu = ({ categories }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [categoryPreviewImages, setCategoryPreviewImages] = useState({});
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (categories && categories.length > 0) loadCategoryPreviews();
  }, [categories]);

  const loadCategoryPreviews = async () => {
    try {
      const previews = {};
      for (const category of categories) {
        try {
          const data = await getProducts({ category: category.slug, limit: 1 });
          if (data.data && data.data.length > 0) previews[category._id] = data.data[0].image;
        } catch (err) {
          console.error(`Error loading preview for ${category.name}:`, err);
        }
      }
      setCategoryPreviewImages(previews);
    } catch (err) {
      console.error('Error loading category previews:', err);
    }
  };

  useEffect(() => {
    if (hoveredCategory) {
      const key = selectedSubCategory
        ? `${hoveredCategory._id}-${selectedSubCategory._id}`
        : hoveredCategory._id;
      if (!categoryProducts[key]) loadCategoryProducts(hoveredCategory, selectedSubCategory);
    }
  }, [hoveredCategory, selectedSubCategory]);

  const loadCategoryProducts = async (category, subCategory = null) => {
    try {
      setLoading(true);
      const params = { category: subCategory ? subCategory.slug : category.slug, limit: 8 };
      const data = await getProducts(params);
      const key = subCategory ? `${category._id}-${subCategory._id}` : category._id;
      setCategoryProducts(prev => ({ ...prev, [key]: data.data || [] }));
    } catch (err) {
      console.error('Error loading category products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseEnter = (category) => {
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
    setHoveredCategory(category);
    setSelectedSubCategory(null);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
      setSelectedSubCategory(null);
    }, 200);
  };

  const getCurrentProducts = () => {
    if (!hoveredCategory) return [];
    const key = selectedSubCategory
      ? `${hoveredCategory._id}-${selectedSubCategory._id}`
      : hoveredCategory._id;
    return categoryProducts[key] || [];
  };

  return (
    <div className="relative w-full" style={{ fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif" }}>

      {/* ── Category Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 pb-4">
        {categories.map((category, idx) => {
          const isActive = hoveredCategory?._id === category._id;
          return (
            <div
              key={category._id}
              onMouseEnter={() => handleMouseEnter(category)}
              onMouseLeave={handleMouseLeave}
              className="relative group cursor-pointer h-full"
            >
              <Link to={`/products?category=${category.slug}`} className="block h-full">
                <div
                  style={{
                    background: isActive ? '#1a1a2e' : '#ffffff',
                    border: `1.5px solid ${isActive ? '#1a1a2e' : '#e2e2e2'}`,
                    borderRadius: '6px',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive
                      ? '0 8px 24px rgba(26,26,46,0.18)'
                      : '0 1px 4px rgba(0,0,0,0.06)',
                    transform: isActive ? 'translateY(-2px)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      height: '155px',
                      background: isActive ? '#16213e' : 'linear-gradient(135deg, #fdf4ff 0%, #f8f0fe 50%, #fce8f8 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '16px',
                      borderRadius: '5px 5px 0 0',
                      overflow: 'hidden',
                      transition: 'background 0.2s ease',
                    }}
                  >
                    {categoryPreviewImages[category._id] ? (
                      <img
                        src={getImageUrl(categoryPreviewImages[category._id])}
                        alt={category.name}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          transition: 'transform 0.3s ease',
                          transform: isActive ? 'scale(1.06)' : 'scale(1)',
                          filter: isActive ? 'brightness(1.15)' : 'none',
                        }}
                        onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                      />
                    ) : (
                      <img src="/placeholder.jpg" alt="Бүтээгдэхүүн"
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', opacity: 0.4 }}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <div
                    style={{
                      padding: '10px 12px 12px',
                      borderTop: `1px solid ${isActive ? '#2a2a4a' : '#ebebeb'}`,
                      background: isActive ? '#1a1a2e' : '#ffffff',
                      borderRadius: '0 0 5px 5px',
                      transition: 'all 0.2s ease',
                      flex: 1,
                      minHeight: '72px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: isActive ? '#ffffff' : '#1a1a2e',
                        lineHeight: '1.3',
                        margin: 0,
                        letterSpacing: '0.01em',
                        transition: 'color 0.2s ease',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {category.name}
                    </p>
                    {category.subcategories?.length > 0 && (
                      <p
                        style={{
                          fontSize: '10px',
                          color: isActive ? '#8899bb' : '#999999',
                          marginTop: '4px',
                          fontWeight: '400',
                          letterSpacing: '0.03em',
                          textTransform: 'uppercase',
                          transition: 'color 0.2s ease',
                        }}
                      >
                        {category.subcategories.length} дэд ангилал
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* ── Mega Menu Dropdown ── */}
      {hoveredCategory && (
        <div
          onMouseEnter={() => { if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; } }}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '100%',
            marginTop: '8px',
            zIndex: 50,
            animation: 'fadeSlideDown 0.18s ease forwards',
          }}
        >
          <style>{`
            @keyframes fadeSlideDown {
              from { opacity: 0; transform: translateY(-6px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            .corp-sub-btn:hover { background: #f0f2f5 !important; }
            .corp-prod-card:hover { border-color: #1a1a2e !important; box-shadow: 0 6px 20px rgba(26,26,46,0.12) !important; }
            .corp-prod-card:hover .corp-prod-name { color: #1a1a2e !important; }
            .corp-prod-card:hover img { transform: scale(1.05) !important; }
          `}</style>

          <div
            style={{
              background: '#ffffff',
              border: '1.5px solid #dedede',
              borderRadius: '8px',
              boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
              overflow: 'hidden',
            }}
          >
            {/* Top accent bar */}
            <div style={{ height: '3px', background: '#1a1a2e' }} />

            <div style={{ display: 'flex' }}>

              {/* ── Left: Subcategory Sidebar ── */}
              {hoveredCategory.subcategories?.length > 0 && (
                <div
                  style={{
                    width: '220px',
                    flexShrink: 0,
                    borderRight: '1px solid #ebebeb',
                    background: '#fafafa',
                    padding: '20px 16px',
                  }}
                >
                  <p
                    style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      color: '#999',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '12px',
                    }}
                  >
                    Дэд ангилал
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {/* All */}
                    <button
                      onClick={() => setSelectedSubCategory(null)}
                      className="corp-sub-btn"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: 'none',
                        fontSize: '13px',
                        fontWeight: !selectedSubCategory ? '600' : '400',
                        color: !selectedSubCategory ? '#ffffff' : '#333',
                        background: !selectedSubCategory ? '#1a1a2e' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        letterSpacing: '0.01em',
                      }}
                    >
                      <span>Бүгд</span>
                      {!selectedSubCategory && <ChevronRight size={14} />}
                    </button>

                    {hoveredCategory.subcategories.map((sub) => {
                      const isSel = selectedSubCategory?._id === sub._id;
                      return (
                        <button
                          key={sub._id}
                          onClick={() => setSelectedSubCategory(sub)}
                          className="corp-sub-btn"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            textAlign: 'left',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            border: 'none',
                            fontSize: '13px',
                            fontWeight: isSel ? '600' : '400',
                            color: isSel ? '#ffffff' : '#444',
                            background: isSel ? '#1a1a2e' : 'transparent',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '150px',
                          }}>
                            {sub.name}
                          </span>
                          {isSel && <ChevronRight size={14} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Center: Products ── */}
              <div style={{ flex: 1, padding: '24px 28px', background: '#ffffff' }}>

                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div>
                    <h3
                      style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#1a1a2e',
                        margin: '0 0 2px',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {selectedSubCategory
                        ? `${hoveredCategory.name} — ${selectedSubCategory.name}`
                        : hoveredCategory.name}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
                      Манай шилдэг бүтээгдэхүүнүүд
                    </p>
                  </div>

                  <Link
                    to="/biz-print"
                    onClick={handleMouseLeave}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      background: '#1a1a2e',
                      color: '#ffffff',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      letterSpacing: '0.02em',
                      transition: 'background 0.15s ease',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#2d2d50'}
                    onMouseLeave={e => e.currentTarget.style.background = '#1a1a2e'}
                  >
                    Бүгдийг үзэх
                    <ArrowRight size={13} />
                  </Link>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: '#ebebeb', marginBottom: '20px' }} />

                {/* Product grid */}
                {loading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
                    <div style={{ position: 'relative', width: '36px', height: '36px' }}>
                      <div style={{
                        position: 'absolute', inset: 0,
                        border: '3px solid #e0e0e0',
                        borderTopColor: '#1a1a2e',
                        borderRadius: '50%',
                        animation: 'spin 0.7s linear infinite',
                      }} />
                      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                  </div>
                ) : getCurrentProducts().length > 0 ? (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '12px',
                    }}
                  >
                    {getCurrentProducts().slice(0, 8).map((product) => (
                      <Link
                        key={product._id}
                        to={`/products/${product._id}`}
                        onClick={handleMouseLeave}
                        style={{ textDecoration: 'none' }}
                      >
                        <div
                          className="corp-prod-card"
                          style={{
                            border: '1.5px solid #e8e8e8',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            background: '#ffffff',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer',
                          }}
                        >
                          {/* Image */}
                          <div
                            style={{
                              height: '120px',
                              background: '#f8f8f8',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '12px',
                              overflow: 'hidden',
                              position: 'relative',
                            }}
                          >
                            <img
                              src={getImageUrl(product.image)}
                              alt={product.name}
                              style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain',
                                transition: 'transform 0.3s ease',
                              }}
                              onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                            />
                            {product.discount && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '8px',
                                  left: '8px',
                                  background: '#c0392b',
                                  color: '#fff',
                                  fontSize: '10px',
                                  fontWeight: '700',
                                  padding: '2px 7px',
                                  borderRadius: '3px',
                                  letterSpacing: '0.02em',
                                }}
                              >
                                -{product.discount}%
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div style={{ padding: '10px 12px 12px', borderTop: '1px solid #f0f0f0' }}>
                            <p
                              className="corp-prod-name"
                              style={{
                                fontSize: '11px',
                                fontWeight: '500',
                                color: '#333',
                                lineHeight: '1.4',
                                marginBottom: '6px',
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                minHeight: '31px',
                                transition: 'color 0.15s ease',
                              }}
                            >
                              {product.name}
                            </p>

                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                              {product.discount ? (
                                <>
                                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#c0392b' }}>
                                    {formatPrice(product.price * (1 - product.discount / 100))}₮
                                  </span>
                                  <span style={{ fontSize: '10px', color: '#aaa', textDecoration: 'line-through' }}>
                                    {formatPrice(product.price)}₮
                                  </span>
                                </>
                              ) : (
                                <span style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a2e' }}>
                                  {formatPrice(product.price)}₮
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '48px 0' }}>
                    <Grid size={32} style={{ color: '#ccc', margin: '0 auto 12px' }} />
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#555', marginBottom: '4px' }}>
                      Бүтээгдэхүүн олдсонгүй
                    </p>
                    <p style={{ fontSize: '12px', color: '#aaa' }}>Удахгүй нэмэгдэнэ...</p>
                  </div>
                )}
              </div>

              {/* ── Right: Featured Product ── */}
              {getCurrentProducts().length > 0 && (
                <div
                  style={{
                    width: '240px',
                    flexShrink: 0,
                    borderLeft: '1px solid #ebebeb',
                    background: '#fafafa',
                    padding: '24px 20px',
                  }}
                >
                  <p
                    style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      color: '#999',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '14px',
                    }}
                  >
                    Онцлох бүтээгдэхүүн
                  </p>

                  <Link
                    to={`/products/${getCurrentProducts()[0]._id}`}
                    onClick={handleMouseLeave}
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <div
                      style={{
                        background: '#ffffff',
                        border: '1.5px solid #e0e0e0',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#1a1a2e';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(26,26,46,0.12)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#e0e0e0';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Featured image */}
                      <div
                        style={{
                          height: '180px',
                          background: '#f4f4f4',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '20px',
                          overflow: 'hidden',
                          position: 'relative',
                        }}
                      >
                        <img
                          src={getImageUrl(getCurrentProducts()[0].image)}
                          alt={getCurrentProducts()[0].name}
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                          onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                        />
                        {getCurrentProducts()[0].discount && (
                          <div style={{
                            position: 'absolute', top: '10px', left: '10px',
                            background: '#c0392b', color: '#fff',
                            fontSize: '11px', fontWeight: '700',
                            padding: '3px 8px', borderRadius: '3px',
                          }}>
                            -{getCurrentProducts()[0].discount}%
                          </div>
                        )}
                      </div>

                      {/* Featured info */}
                      <div style={{ padding: '14px 16px 16px', borderTop: '1px solid #f0f0f0' }}>
                        <p style={{
                          fontSize: '12px', fontWeight: '600', color: '#1a1a2e',
                          lineHeight: '1.4', marginBottom: '8px',
                          overflow: 'hidden', display: '-webkit-box',
                          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        }}>
                          {getCurrentProducts()[0].name}
                        </p>

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '12px' }}>
                          {getCurrentProducts()[0].discount ? (
                            <>
                              <span style={{ fontSize: '16px', fontWeight: '700', color: '#c0392b' }}>
                                {formatPrice(getCurrentProducts()[0].price * (1 - getCurrentProducts()[0].discount / 100))}₮
                              </span>
                              <span style={{ fontSize: '11px', color: '#aaa', textDecoration: 'line-through' }}>
                                {formatPrice(getCurrentProducts()[0].price)}₮
                              </span>
                            </>
                          ) : (
                            <span style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e' }}>
                              {formatPrice(getCurrentProducts()[0].price)}₮
                            </span>
                          )}
                        </div>

                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          fontSize: '11px', fontWeight: '600', color: '#1a1a2e',
                          letterSpacing: '0.02em',
                        }}>
                          Дэлгэрэнгүй <ArrowRight size={12} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryMegaMenu;