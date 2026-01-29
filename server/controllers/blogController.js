import Blog from '../models/Blog.js';

// @desc    Бүх блогууд авах (public - зөвхөн published)
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res) => {
  try {
    const { category, tag, search, page = 1, limit = 12 } = req.query;

    // Query үүсгэх
    let query = { status: 'published' };

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Tag filter
    if (tag) {
      query.tags = tag;
    }

    // Search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Pagination
    const skip = (page - 1) * limit;

    const blogs = await Blog.find(query)
      .populate('author', 'name')
      .sort('-publishedAt -createdAt')
      .limit(Number(limit))
      .skip(skip)
      .select('-content'); // Content хасах (list view-д шаардлагагүй)

    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      count: blogs.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Бүх блогууд авах (admin - бүх status)
// @route   GET /api/blogs/admin/all
// @access  Private/Admin
export const getAllBlogs = async (req, res) => {
  try {
    const { status } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name email')
      .sort('-createdAt');

    res.json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Нэг блог авах (slug-аар)
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate('author', 'name');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Блог олдсонгүй',
      });
    }

    // Only published or admin
    if (blog.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Блог олдсонгүй',
      });
    }

    // Views increment
    blog.views += 1;
    await blog.save();

    res.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Нэг блог авах (ID-аар, admin)
// @route   GET /api/blogs/admin/:id
// @access  Private/Admin
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name email');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Блог олдсонгүй',
      });
    }

    res.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Блог үүсгэх
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, category, tags, status, featured } = req.body;

    // Check slug duplication
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9а-яөү]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return res.status(400).json({
        success: false,
        message: 'Ийм гарчигтай блог аль хэдийн байна',
      });
    }

    const blogData = {
      title,
      excerpt,
      content,
      category: category || 'other',
      tags: tags || [],
      status: status || 'draft',
      featured: featured || false,
      author: req.user._id,
    };

    // Featured image upload
    if (req.file) {
      blogData.featuredImage = req.file.path;
    }

    const blog = await Blog.create(blogData);

    res.status(201).json({
      success: true,
      message: 'Блог амжилттай үүсгэгдлээ',
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Блог шинэчлэх
// @route   PUT /api/blogs/:id
// @access  Private/Admin
export const updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Блог олдсонгүй',
      });
    }

    const { title, excerpt, content, category, tags, status, featured } = req.body;

    const updateData = {
      title: title || blog.title,
      excerpt: excerpt !== undefined ? excerpt : blog.excerpt,
      content: content || blog.content,
      category: category || blog.category,
      tags: tags !== undefined ? tags : blog.tags,
      status: status || blog.status,
      featured: featured !== undefined ? featured : blog.featured,
    };

    // Featured image upload
    if (req.file) {
      updateData.featuredImage = req.file.path;
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Блог шинэчлэгдлээ',
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Блог устгах
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Блог олдсонгүй',
      });
    }

    await blog.deleteOne();

    res.json({
      success: true,
      message: 'Блог устгагдлаа',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Онцлох блогууд авах
// @route   GET /api/blogs/featured
// @access  Public
export const getFeaturedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ 
      status: 'published',
      featured: true 
    })
      .populate('author', 'name')
      .sort('-publishedAt')
      .limit(3)
      .select('-content');

    res.json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};