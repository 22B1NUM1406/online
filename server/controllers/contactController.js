import ContactMessage from '../models/ContactMessage.js';

// @desc    Холбоо барих мессеж илгээх
// @route   POST /api/contact
// @access  Public
export const createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Таны мессеж амжилттай илгээгдлээ. Удахгүй хариу өгөх болно.',
      data: contactMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Бүх холбоо барих мессежүүд авах
// @route   GET /api/contact
// @access  Private/Admin
export const getAllContactMessages = async (req, res) => {
  try {
    const { status } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    const messages = await ContactMessage.find(query)
      .sort('-createdAt')
      .populate('adminReply.repliedBy', 'name email');

    res.json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Мессеж статус өөрчлөх
// @route   PUT /api/contact/:id/status
// @access  Private/Admin
export const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Мессеж олдсонгүй',
      });
    }

    res.json({
      success: true,
      message: 'Статус шинэчлэгдлээ',
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Мессежт хариулах
// @route   PUT /api/contact/:id/reply
// @access  Private/Admin
export const replyToMessage = async (req, res) => {
  try {
    const { replyMessage } = req.body;

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      {
        status: 'replied',
        adminReply: {
          message: replyMessage,
          repliedBy: req.user._id,
          repliedAt: Date.now(),
        },
      },
      { new: true }
    ).populate('adminReply.repliedBy', 'name email');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Мессеж олдсонгүй',
      });
    }

    res.json({
      success: true,
      message: 'Хариу амжилттай илгээгдлээ',
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Мессеж устгах
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContactMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Мессеж олдсонгүй',
      });
    }

    res.json({
      success: true,
      message: 'Мессеж устгагдлаа',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};