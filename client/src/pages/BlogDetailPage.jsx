import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Tag } from 'lucide-react';
import { getBlog } from '../services/api';
import { formatDate, getImageUrl } from '../utils/helpers';
import Loading from '../components/Loading';
import ShareButtons from '../components/ShareButtons';
import TextDisplay from '../components/TextDisplay';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlog();
  }, [slug]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      const data = await getBlog(slug);
      setBlog(data.data);
    } catch (error) {
      console.error('Error loading blog:', error);
      setTimeout(() => navigate('/blogs'), 2000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!blog) return null;

  return (
    <>
      {/* React 19 Meta Tags - Automatically hoisted to <head> */}
      <title>{blog.title} | BizCo Print Shop Blog</title>
      <meta name="description" content={blog.excerpt?.substring(0, 160) || blog.title} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="article" />
      <meta property="og:url" content={`https://www.bizco.mn/blogs/${blog.slug}`} />
      <meta property="og:title" content={blog.title} />
      <meta property="og:description" content={blog.excerpt?.substring(0, 300) || blog.title} />
      <meta property="og:image" content={getImageUrl(blog.featuredImage)} />
      <meta property="og:image:secure_url" content={getImageUrl(blog.featuredImage)} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={blog.title} />
      <meta property="og:site_name" content="BizCo Print Shop" />
      
      {/* Article Specific */}
      <meta property="article:published_time" content={blog.publishedAt || blog.createdAt} />
      <meta property="article:modified_time" content={blog.updatedAt} />
      <meta property="article:author" content={blog.author?.name || 'BizCo Print Shop'} />
      {blog.category && (
        <meta property="article:section" content={blog.category} />
      )}
      {blog.tags?.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={blog.title} />
      <meta name="twitter:description" content={blog.excerpt?.substring(0, 200) || blog.title} />
      <meta name="twitter:image" content={getImageUrl(blog.featuredImage)} />

      {/* Component Content */}
      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Буцах</span>
            </button>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 py-8">
          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
              <img
                src={getImageUrl(blog.featuredImage)}
                alt={blog.title}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/1200x630?text=Blog+Image';
                }}
              />
            </div>
          )}

          {/* Blog Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {blog.title}
            </h1>

            {/* Excerpt */}
            {blog.excerpt && (
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {blog.excerpt}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              {blog.author && (
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{blog.author.name}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
              </div>

              {blog.readTime && (
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{blog.readTime} минут</span>
                </div>
              )}

              {blog.category && (
                <Link 
                  to={`/blogs?category=${blog.category}`}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                >
                  <Tag size={16} />
                  <span>{blog.category}</span>
                </Link>
              )}
            </div>
          </header>

          {/* Blog Content */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <div className="prose prose-lg max-w-none">
              <TextDisplay content={blog.content} />
            </div>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Таагууд</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share Buttons */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Хуваалцах</h3>
            <ShareButtons 
              url={`https://www.bizco.mn/blogs/${blog.slug}`}
              title={blog.title}
              description={blog.excerpt}
              image={getImageUrl(blog.featuredImage)}
            />
          </div>

          {/* Author Info */}
          {blog.author && (
            <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Зохиогч</h3>
              <div className="flex items-start gap-4">
                {blog.author.avatar && (
                  <img
                    src={getImageUrl(blog.author.avatar)}
                    alt={blog.author.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {blog.author.name}
                  </h4>
                  {blog.author.bio && (
                    <p className="text-gray-600 text-sm">
                      {blog.author.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </article>
      </div>
    </>
  );
};

export default BlogDetailPage;