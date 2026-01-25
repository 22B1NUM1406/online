import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Eye, Tag } from 'lucide-react';
import { getBlogBySlug } from '../services/api';
import { getImageUrl } from '../utils/helpers';
import Loading from '../components/Loading';
import Notification from '../components/Notification';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadBlog();
  }, [slug]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      const data = await getBlogBySlug(slug);
      setBlog(data.data);
    } catch (error) {
      console.error('Error loading blog:', error);
      setNotification({ 
        message: error.response?.data?.message || 'Блог олдсонгүй', 
        type: 'error' 
      });
      setTimeout(() => navigate('/'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('mn-MN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Блог олдсонгүй</h2>
          <Link to="/" className="text-blue-600 hover:underline">
            Нүүр хуудас руу буцах
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {notification && (
        <Notification 
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Буцах</span>
        </Link>

        {/* Article */}
        <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="relative h-96 bg-gray-200">
              <img
                src={getImageUrl(blog.featuredImage)}
                alt={blog.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/1200x600?text=Blog+Image';
                }}
              />
              {blog.featured && (
                <div className="absolute top-6 left-6 bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  Онцлох блог
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b">
              <div className="flex items-center gap-2">
                <User size={18} />
                <span className="font-medium">{blog.author?.name || 'Admin'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Eye size={18} />
                <span>{blog.views} үзсэн</span>
              </div>

              <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {blog.category === 'news' ? 'Мэдээ' :
                 blog.category === 'tutorial' ? 'Заавар' :
                 blog.category === 'tips' ? 'Зөвлөмж' :
                 blog.category === 'case-study' ? 'Туршилт' :
                 blog.category === 'announcement' ? 'Мэдэгдэл' : 'Бусад'}
              </div>
            </div>

            {/* Excerpt */}
            {blog.excerpt && (
              <div className="text-xl text-gray-700 mb-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg italic">
                {blog.excerpt}
              </div>
            )}

            {/* Main Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {blog.content}
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag size={18} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Tags:</span>
                  {blog.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Back to Blog List */}
        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={20} />
            Блог жагсаалт руу буцах
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;