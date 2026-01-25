import axios from 'axios';

// Base URL-ээс /api нэмэх
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;

// Axios interceptor - Request (Add auth token)
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios interceptor - Response error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request was made but no response
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Products
export const getProducts = async (params = {}) => {
  const { data } = await axios.get(`${API_URL}/products`, { params });
  return data;
};

export const getProduct = async (id) => {
  const { data } = await axios.get(`${API_URL}/products/${id}`);
  return data;
};

export const createProduct = async (productData) => {
  const { data } = await axios.post(`${API_URL}/products`, productData);
  return data;
};

export const updateProduct = async (id, productData) => {
  const { data } = await axios.put(`${API_URL}/products/${id}`, productData);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await axios.delete(`${API_URL}/products/${id}`);
  return data;
};

export const getCategoryStats = async () => {
  const { data } = await axios.get(`${API_URL}/products/stats/categories`);
  return data;
};

// Orders
export const createOrder = async (orderData) => {
  const { data } = await axios.post(`${API_URL}/orders`, orderData);
  return data;
};

export const getMyOrders = async () => {
  const { data } = await axios.get(`${API_URL}/orders/my-orders`);
  return data;
};

export const getOrder = async (id) => {
  const { data } = await axios.get(`${API_URL}/orders/${id}`);
  return data;
};

export const getAllOrders = async (params = {}) => {
  const { data } = await axios.get(`${API_URL}/orders`, { params });
  return data;
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await axios.put(`${API_URL}/orders/${id}/status`, { status });
  return data;
};

export const getOrderStats = async () => {
  const { data } = await axios.get(`${API_URL}/orders/stats/dashboard`);
  return data;
};

// Quotations
export const createQuotation = async (quotationData) => {
  const { data } = await axios.post(`${API_URL}/quotations`, quotationData);
  return data;
};

export const getMyQuotations = async () => {
  const { data } = await axios.get(`${API_URL}/quotations/my-quotations`);
  return data;
};

export const getAllQuotations = async (params = {}) => {
  const { data } = await axios.get(`${API_URL}/quotations`, { params });
  return data;
};

export const replyToQuotation = async (id, replyData) => {
  const { data } = await axios.put(`${API_URL}/quotations/${id}/reply`, replyData);
  return data;
};

export const updateQuotationStatus = async (id, status) => {
  const { data } = await axios.put(`${API_URL}/quotations/${id}/status`, { status });
  return data;
};

export const deleteQuotation = async (id) => {
  const { data } = await axios.delete(`${API_URL}/quotations/${id}`);
  return data;
};

export const deleteOrder = async (id) => {
  const { data } = await axios.delete(`${API_URL}/orders/${id}`);
  return data;
};

// Contact Messages
export const getAllContactMessages = async (params = {}) => {
  const { data } = await axios.get(`${API_URL}/contact`, { params });
  return data;
};

export const updateContactMessageStatus = async (id, status) => {
  const { data } = await axios.put(`${API_URL}/contact/${id}/status`, { status });
  return data;
};

export const replyToContactMessage = async (id, replyMessage) => {
  const { data } = await axios.put(`${API_URL}/contact/${id}/reply`, { replyMessage });
  return data;
};

export const deleteContactMessage = async (id) => {
  const { data } = await axios.delete(`${API_URL}/contact/${id}`);
  return data;
};

// Categories
export const getCategories = async () => {
  const { data } = await axios.get(`${API_URL}/categories`);
  return data;
};

export const getAllCategoriesFlat = async () => {
  const { data } = await axios.get(`${API_URL}/categories/admin/all`);
  return data;
};

export const getCategory = async (id) => {
  const { data } = await axios.get(`${API_URL}/categories/${id}`);
  return data;
};

export const createCategory = async (categoryData) => {
  const { data } = await axios.post(`${API_URL}/categories`, categoryData);
  return data;
};

export const updateCategory = async (id, categoryData) => {
  const { data } = await axios.put(`${API_URL}/categories/${id}`, categoryData);
  return data;
};

export const deleteCategory = async (id) => {
  const { data } = await axios.delete(`${API_URL}/categories/${id}`);
  return data;
};

export const reorderCategories = async (categories) => {
  const { data } = await axios.put(`${API_URL}/categories/reorder`, { categories });
  return data;
};

// Blogs
export const getBlogs = async (params = {}) => {
  const { data } = await axios.get(`${API_URL}/blogs`, { params });
  return data;
};

export const getAllBlogs = async (params = {}) => {
  const { data } = await axios.get(`${API_URL}/blogs/admin/all`, { params });
  return data;
};

export const getBlogBySlug = async (slug) => {
  const { data } = await axios.get(`${API_URL}/blogs/${slug}`);
  return data;
};

export const getBlogById = async (id) => {
  const { data } = await axios.get(`${API_URL}/blogs/admin/${id}`);
  return data;
};

export const getFeaturedBlogs = async () => {
  const { data } = await axios.get(`${API_URL}/blogs/featured`);
  return data;
};

export const createBlog = async (blogData) => {
  const { data } = await axios.post(`${API_URL}/blogs`, blogData);
  return data;
};

export const updateBlog = async (id, blogData) => {
  const { data } = await axios.put(`${API_URL}/blogs/${id}`, blogData);
  return data;
};

export const deleteBlog = async (id) => {
  const { data } = await axios.delete(`${API_URL}/blogs/${id}`);
  return data;
};

// Marketing Services
export const getMarketingServices = async (params = {}) => {
  const { data } = await axios.get(`${API_URL}/marketing-services`, { params });
  return data;
};

export const getAllMarketingServices = async () => {
  const { data } = await axios.get(`${API_URL}/marketing-services/admin/all`);
  return data;
};

export const getMarketingServiceBySlug = async (slug) => {
  const { data } = await axios.get(`${API_URL}/marketing-services/${slug}`);
  return data;
};

export const createMarketingService = async (serviceData) => {
  const { data } = await axios.post(`${API_URL}/marketing-services`, serviceData);
  return data;
};

export const updateMarketingService = async (id, serviceData) => {
  const { data } = await axios.put(`${API_URL}/marketing-services/${id}`, serviceData);
  return data;
};

export const deleteMarketingService = async (id) => {
  const { data } = await axios.delete(`${API_URL}/marketing-services/${id}`);
  return data;
};

// Wallet
export const getWalletBalance = async () => {
  const { data } = await axios.get(`${API_URL}/wallet`);
  return data;
};

export const topUpWallet = async (amount) => {
  const { data } = await axios.post(`${API_URL}/wallet/topup`, { amount });
  return data;
};

export const createQPayInvoice = async (amount) => {
  const { data } = await axios.post(`${API_URL}/wallet/qpay-invoice`, { amount });
  return data;
};