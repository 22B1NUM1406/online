import axios from 'axios';

class QPayService {
  constructor() {
    // Environment: production эсвэл sandbox
    this.baseURL = process.env.QPAY_ENV === 'production' 
      ? 'https://merchant.qpay.mn/v2'
      : 'https://sandbox-merchant.qpay.mn/v2';
    
    this.username = process.env.QPAY_USERNAME;
    this.password = process.env.QPAY_PASSWORD;
    this.invoiceCode = process.env.QPAY_INVOICE_CODE;
    
    this.token = null;
    this.tokenExpiry = null;
  }

  // Get authentication token
  async getToken() {
    try {
      // Check if token is still valid
      if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.token;
      }

      const response = await axios.post(`${this.baseURL}/auth/token`, {}, {
        auth: {
          username: this.username,
          password: this.password
        }
      });

      this.token = response.data.access_token;
      // Token expires in 1 hour, set expiry to 50 minutes
      this.tokenExpiry = Date.now() + (50 * 60 * 1000);
      
      return this.token;
    } catch (error) {
      console.error('QPay authentication error:', error.response?.data || error.message);
      throw new Error('QPay холболт амжилтгүй');
    }
  }

  // Create invoice
  async createInvoice(orderData) {
    try {
      const token = await this.getToken();

      const invoiceData = {
        invoice_code: this.invoiceCode,
        sender_invoice_no: orderData.orderNumber || `ORDER-${Date.now()}`,
        invoice_receiver_code: orderData.customerPhone || 'guest',
        invoice_description: orderData.description || 'Хэвлэлийн бараа',
        amount: orderData.amount,
        callback_url: `${process.env.CLIENT_URL}/payment/callback`,
      };

      const response = await axios.post(
        `${this.baseURL}/invoice`,
        invoiceData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        invoice_id: response.data.invoice_id,
        qr_text: response.data.qr_text,
        qr_image: response.data.qr_image,
        urls: response.data.urls,
        qpay_invoice_id: response.data.qpay_invoice_id
      };
    } catch (error) {
      console.error('QPay invoice creation error:', error.response?.data || error.message);
      throw new Error('Invoice үүсгэх амжилтгүй');
    }
  }

  // Check payment status
  async checkPayment(invoiceId) {
    try {
      const token = await this.getToken();

      const response = await axios.post(
        `${this.baseURL}/payment/check`,
        { object_type: 'INVOICE', object_id: invoiceId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        paid: response.data.rows && response.data.rows.length > 0,
        count: response.data.count || 0,
        payments: response.data.rows || []
      };
    } catch (error) {
      console.error('QPay payment check error:', error.response?.data || error.message);
      throw new Error('Төлбөрийн мэдээлэл авах амжилтгүй');
    }
  }

  // Cancel invoice
  async cancelInvoice(invoiceId) {
    try {
      const token = await this.getToken();

      await axios.delete(
        `${this.baseURL}/invoice/${invoiceId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      return { success: true, message: 'Invoice цуцлагдлаа' };
    } catch (error) {
      console.error('QPay invoice cancel error:', error.response?.data || error.message);
      throw new Error('Invoice цуцлах амжилтгүй');
    }
  }
}

// Export singleton instance
export default new QPayService();