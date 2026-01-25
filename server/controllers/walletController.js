import User from '../models/User.js';

// @desc    Wallet balance авах
// @route   GET /api/wallet
// @access  Private
export const getWalletBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: {
        balance: user.wallet,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Wallet цэнэглэх
// @route   POST /api/wallet/topup
// @access  Private
export const topUpWallet = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Дүн буруу байна',
      });
    }

    const user = await User.findById(req.user._id);

    // Wallet нэмэх
    user.wallet += amount;
    await user.save();

    // Энд QPay эсвэл бусад төлбөрийн систем холбох боломжтой
    // Одоогоор зөвхөн balance нэмж байна (demo mode)

    res.json({
      success: true,
      message: 'Wallet амжилттай цэнэглэгдлээ',
      data: {
        balance: user.wallet,
        added: amount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    QPay invoice үүсгэх
// @route   POST /api/wallet/qpay-invoice
// @access  Private
export const createQPayInvoice = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Дүн буруу байна',
      });
    }

    // QPay API дуудах (demo response)
    // Бодит байдалд QPay API-тай холбогдож invoice үүсгэнэ
    const qpayResponse = {
      invoice_id: `INV-${Date.now()}`,
      qr_text: `https://qpay.mn/payment/${Date.now()}`,
      qr_image: 'base64_encoded_qr_code_here',
      urls: [
        {
          name: 'QPay',
          description: 'QPay апп-аар төлөх',
          link: `qpay://payment?invoice=${Date.now()}`,
          logo: 'https://qpay.mn/logo.png',
        },
      ],
    };

    res.json({
      success: true,
      message: 'QPay invoice үүсгэгдлээ',
      data: qpayResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    QPay callback (төлбөр амжилттай бол)
// @route   POST /api/wallet/qpay-callback
// @access  Public
export const qpayCallback = async (req, res) => {
  try {
    const { invoice_id, amount, user_id } = req.body;

    // QPay-ээс ирсэн мэдээллийг verify хийнэ
    // Signature шалгах гэх мэт

    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Хэрэглэгч олдсонгүй',
      });
    }

    // Wallet цэнэглэх
    user.wallet += amount;
    await user.save();

    res.json({
      success: true,
      message: 'Төлбөр амжилттай',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Wallet transaction түүх (Future feature)
// @route   GET /api/wallet/transactions
// @access  Private
export const getWalletTransactions = async (req, res) => {
  try {
    // Энд transaction model үүсгэж түүхийг хадгалах боломжтой
    // Одоогоор demo response
    res.json({
      success: true,
      data: [],
      message: 'Transaction түүх одоогоор байхгүй',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};