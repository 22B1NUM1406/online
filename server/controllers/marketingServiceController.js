import MarketingService from '../models/MarketingService.js';

// @desc    Бүх үйлчилгээ авах (public - зөвхөн active)
// @route   GET /api/marketing-services
// @access  Public
export const getMarketingServices = async (req, res) => {
  try {
    const { category, featured } = req.query;

    const query = { isActive: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    const services = await MarketingService.find(query)
      .sort('order name');

    res.json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Бүх үйлчилгээ авах (admin - бүгд)
// @route   GET /api/marketing-services/admin/all
// @access  Private/Admin
export const getAllMarketingServices = async (req, res) => {
  try {
    const services = await MarketingService.find()
      .sort('order name');

    res.json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Нэг үйлчилгээ авах (slug-аар)
// @route   GET /api/marketing-services/:slug
// @access  Public
export const getMarketingServiceBySlug = async (req, res) => {
  try {
    const service = await MarketingService.findOne({ 
      slug: req.params.slug,
      isActive: true 
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Үйлчилгээ олдсонгүй',
      });
    }

    res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Үйлчилгээ үүсгэх
// @route   POST /api/marketing-services
// @access  Private/Admin
export const createMarketingService = async (req, res) => {
  try {
    const { name, description, shortDescription, features, price, category, icon, order, featured } = req.body;

    // Check slug duplication
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9а-яөү]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const existingService = await MarketingService.findOne({ slug });
    if (existingService) {
      return res.status(400).json({
        success: false,
        message: 'Ийм нэртэй үйлчилгээ аль хэдийн байна',
      });
    }

    const serviceData = {
      name,
      description,
      shortDescription,
      features: features || [],
      price,
      category: category || 'other',
      icon: icon || 'TrendingUp',
      order: order || 0,
      featured: featured || false,
    };

    // Image upload
    if (req.file) {
      serviceData.image = `/uploads/${req.file.filename}`;
    }

    const service = await MarketingService.create(serviceData);

    res.status(201).json({
      success: true,
      message: 'Үйлчилгээ амжилттай үүсгэгдлээ',
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Үйлчилгээ шинэчлэх
// @route   PUT /api/marketing-services/:id
// @access  Private/Admin
export const updateMarketingService = async (req, res) => {
  try {
    let service = await MarketingService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Үйлчилгээ олдсонгүй',
      });
    }

    const { name, description, shortDescription, features, price, category, icon, order, isActive, featured } = req.body;

    const updateData = {
      name: name || service.name,
      description: description || service.description,
      shortDescription: shortDescription !== undefined ? shortDescription : service.shortDescription,
      features: features !== undefined ? features : service.features,
      price: price !== undefined ? price : service.price,
      category: category || service.category,
      icon: icon || service.icon,
      order: order !== undefined ? order : service.order,
      isActive: isActive !== undefined ? isActive : service.isActive,
      featured: featured !== undefined ? featured : service.featured,
    };

    // Image upload
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    service = await MarketingService.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Үйлчилгээ шинэчлэгдлээ',
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Үйлчилгээ устгах
// @route   DELETE /api/marketing-services/:id
// @access  Private/Admin
export const deleteMarketingService = async (req, res) => {
  try {
    const service = await MarketingService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Үйлчилгээ олдсонгүй',
      });
    }

    await service.deleteOne();

    res.json({
      success: true,
      message: 'Үйлчилгээ устгагдлаа',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};