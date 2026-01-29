import Quotation from '../models/Quotation.js';

// @desc    Үнийн санал илгээх
// @route   POST /api/quotations
// @access  Public/Optional Auth
export const createQuotation = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    console.log('Request user:', req.user);
    
    const { name, phone, email, productType, description } = req.body;

    // Validation check
    if (!name || !phone || !email || !productType || !description) {
      return res.status(400).json({
        success: false,
        message: 'Бүх шаардлагатай талбаруудыг бөглөнө үү',
        missing: {
          name: !name,
          phone: !phone,
          email: !email,
          productType: !productType,
          description: !description
        }
      });
    }

    const quotationData = {
      user: req.user?._id,
      name,
      phone,
      email,
      productType,
      description,
    };

    // Дизайн файл upload хийсэн бол
    if (req.file) {
      quotationData.designFile = {
        fileName: req.file.originalname,
        fileUrl: req.file.path,
        fileSize: req.file.size,
      };
    }

    const quotation = await Quotation.create(quotationData);

    res.status(201).json({
      success: true,
      message: 'Үнийн санал амжилттай илгээгдлээ',
      data: quotation,
    });
  } catch (error) {
    console.error('Quotation creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Хэрэглэгчийн үнийн саналууд
// @route   GET /api/quotations/my-quotations
// @access  Private
export const getMyQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find({ user: req.user._id })
      .sort('-createdAt')
      .populate('adminReply.repliedBy', 'name');

    res.json({
      success: true,
      count: quotations.length,
      data: quotations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Нэг үнийн санал авах
// @route   GET /api/quotations/:id
// @access  Private
export const getQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id)
      .populate('user', 'name email')
      .populate('adminReply.repliedBy', 'name');

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Үнийн санал олдсонгүй',
      });
    }

    // Зөвхөн өөрийн үнийн санал эсвэл админ үзэх боломжтой
    if (quotation.user?._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Энэ үнийн саналыг үзэх эрхгүй байна',
      });
    }

    res.json({
      success: true,
      data: quotation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Бүх үнийн санал авах (Admin)
// @route   GET /api/quotations
// @access  Private/Admin
export const getAllQuotations = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const quotations = await Quotation.find(query)
      .sort('-createdAt')
      .limit(Number(limit))
      .skip(skip)
      .populate('user', 'name email phone')
      .populate('adminReply.repliedBy', 'name');

    const total = await Quotation.countDocuments(query);

    res.json({
      success: true,
      count: quotations.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: quotations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Үнийн саналд хариу өгөх (Admin)
// @route   PUT /api/quotations/:id/reply
// @access  Private/Admin
export const replyToQuotation = async (req, res) => {
  try {
    const { message, price } = req.body;

    const quotation = await Quotation.findById(req.params.id);

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Үнийн санал олдсонгүй',
      });
    }

    quotation.adminReply = {
      message,
      price,
      repliedBy: req.user._id,
      repliedAt: Date.now(),
    };
    quotation.status = 'replied';

    await quotation.save();

    res.json({
      success: true,
      message: 'Хариу амжилттай илгээгдлээ',
      data: quotation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Үнийн саналын статус солих (Admin)
// @route   PUT /api/quotations/:id/status
// @access  Private/Admin
export const updateQuotationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const quotation = await Quotation.findById(req.params.id);

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Үнийн санал олдсонгүй',
      });
    }

    quotation.status = status;
    await quotation.save();

    res.json({
      success: true,
      message: 'Статус шинэчлэгдлээ',
      data: quotation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Үнийн санал устгах (Admin)
// @route   DELETE /api/quotations/:id
// @access  Private/Admin
export const deleteQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Үнийн санал олдсонгүй',
      });
    }

    await quotation.deleteOne();

    res.json({
      success: true,
      message: 'Үнийн санал устгагдлаа',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};