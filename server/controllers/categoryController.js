import Category from '../models/Category.js';

// @desc    Бүх ангилалууд авах (hierarchical structure)
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const { includeInactive } = req.query;

    // Query үүсгэх
    const query = {};
    if (!includeInactive) {
      query.isActive = true;
    }

    // Үндсэн ангилалууд авах (parent = null)
    const mainCategories = await Category.find({ ...query, parent: null })
      .sort('order name')
      .lean();

    // Дэд ангилалууд авах
    const subcategories = await Category.find({ 
      ...query, 
      parent: { $ne: null } 
    })
      .sort('order name')
      .lean();

    // Hierarchical structure үүсгэх
    const categoriesWithSubs = mainCategories.map(category => ({
      ...category,
      subcategories: subcategories.filter(
        sub => sub.parent?.toString() === category._id.toString()
      ),
    }));

    res.json({
      success: true,
      count: categoriesWithSubs.length,
      data: categoriesWithSubs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Бүх ангилалууд авах (flat list - admin)
// @route   GET /api/categories/all
// @access  Private/Admin
export const getAllCategoriesFlat = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('parent', 'name')
      .sort('order name');

    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Нэг ангилал авах
// @route   GET /api/categories/:id
// @access  Public
export const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parent', 'name slug');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Ангилал олдсонгүй',
      });
    }

    // Дэд ангилалууд авах
    const subcategories = await Category.find({ parent: category._id })
      .sort('order name');

    res.json({
      success: true,
      data: {
        ...category.toObject(),
        subcategories,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Ангилал үүсгэх
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
  try {
    const { name, description, parent, icon, order } = req.body;

    // Check if slug already exists
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9а-яөү]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Ийм нэртэй ангилал аль хэдийн байна',
      });
    }

    const categoryData = {
      name,
      description,
      icon,
      order: order || 0,
    };

    // Parent category шалгах
    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        return res.status(404).json({
          success: false,
          message: 'Үндсэн ангилал олдсонгүй',
        });
      }
      categoryData.parent = parent;
    }

    // Image upload
    if (req.file) {
      categoryData.image = `/uploads/${req.file.filename}`;
    }

    const category = await Category.create(categoryData);

    res.status(201).json({
      success: true,
      message: 'Ангилал амжилттай үүсгэгдлээ',
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Ангилал шинэчлэх
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Ангилал олдсонгүй',
      });
    }

    const { name, description, parent, icon, order, isActive } = req.body;

    const updateData = {
      name: name || category.name,
      description: description !== undefined ? description : category.description,
      icon: icon || category.icon,
      order: order !== undefined ? order : category.order,
      isActive: isActive !== undefined ? isActive : category.isActive,
    };

    // Parent шинэчлэх (өөрийгөө parent болгож болохгүй)
    if (parent !== undefined) {
      if (parent && parent === req.params.id) {
        return res.status(400).json({
          success: false,
          message: 'Ангилал өөрөө өөрийнхөө дэд ангилал байж болохгүй',
        });
      }
      updateData.parent = parent || null;
    }

    // Image upload
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    category = await Category.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Ангилал шинэчлэгдлээ',
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Ангилал устгах
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Ангилал олдсонгүй',
      });
    }

    // Дэд ангилалууд байгаа эсэхийг шалгах
    const hasSubcategories = await Category.countDocuments({ parent: req.params.id });
    if (hasSubcategories > 0) {
      return res.status(400).json({
        success: false,
        message: 'Энэ ангиллын дэд ангилалууд байна. Эхлээд дэд ангилалуудыг устгана уу.',
      });
    }

    // Энэ ангилалд бүтээгдэхүүн байгаа эсэхийг шалгах (optional)
    // const hasProducts = await Product.countDocuments({ category: req.params.id });
    // if (hasProducts > 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Энэ ангиллын бүтээгдэхүүнүүд байна',
    //   });
    // }

    await category.deleteOne();

    res.json({
      success: true,
      message: 'Ангилал устгагдлаа',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Ангиллын дараалал өөрчлөх
// @route   PUT /api/categories/reorder
// @access  Private/Admin
export const reorderCategories = async (req, res) => {
  try {
    const { categories } = req.body; // [{ id, order }, ...]

    if (!Array.isArray(categories)) {
      return res.status(400).json({
        success: false,
        message: 'Буруу формат',
      });
    }

    // Bulk update
    const bulkOps = categories.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: id },
        update: { order },
      },
    }));

    await Category.bulkWrite(bulkOps);

    res.json({
      success: true,
      message: 'Дараалал шинэчлэгдлээ',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};