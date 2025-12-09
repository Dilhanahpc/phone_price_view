import axios from 'axios';

// Production API URL - MUST use HTTPS for GitHub Pages deployment
// Allow overriding the backend base URL via Vite env var VITE_API_BASE_URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

console.log('🔗 API Base URL:', API_BASE_URL); // Debug log

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.detail || error.message || 'An error occurred';
    console.error('API Error:', errorMessage);
    return Promise.reject(error);
  }
);

// Phones API
export const phonesAPI = {
  getAll: (skip = 0, limit = 100) => api.get(`/phones?skip=${skip}&limit=${limit}`),
  getById: (id) => api.get(`/phones/${id}`),
  getSpecs: (id) => api.get(`/phones/${id}/specs`),
  addSpec: (id, specData) => api.post(`/phones/${id}/specs`, specData),
  updateSpecsBulk: (id, specsArray) => api.put(`/phones/${id}/specs/bulk`, specsArray),
  create: (data) => api.post('/phones', data),
  update: (id, data) => api.put(`/phones/${id}`, data),
  delete: (id) => api.delete(`/phones/${id}`),
  search: (query, skip = 0, limit = 50) => api.get(`/search/phones?q=${encodeURIComponent(query)}&skip=${skip}&limit=${limit}`),
  searchByBrand: (brand, skip = 0, limit = 50) => api.get(`/search/by-brand?brand=${encodeURIComponent(brand)}&skip=${skip}&limit=${limit}`),
  // Get phones by category
  getByCategory: (category, skip = 0, limit = 50) => api.get(`/phones?skip=${skip}&limit=${limit}`).then(res => {
    // Filter on client side since backend doesn't have category filter endpoint
    const filtered = res.data.filter(p => p.category === category);
    return { ...res, data: filtered };
  }),
};

// Shops API
export const shopsAPI = {
  getAll: (skip = 0, limit = 100) => api.get(`/shops?skip=${skip}&limit=${limit}`),
  getById: (id) => api.get(`/shops/${id}`),
  create: (data) => api.post('/shops', data),
  update: (id, data) => api.put(`/shops/${id}`, data),
  delete: (id) => api.delete(`/shops/${id}`),
  search: (query, skip = 0, limit = 50) => api.get(`/search/shops?q=${encodeURIComponent(query)}&skip=${skip}&limit=${limit}`),
};

// Prices API
export const pricesAPI = {
  getAll: (phoneId = null, shopId = null, skip = 0, limit = 100) => {
    let url = `/prices?skip=${skip}&limit=${limit}`;
    if (phoneId) url += `&phone_id=${phoneId}`;
    if (shopId) url += `&shop_id=${shopId}`;
    return api.get(url);
  },
  getByRange: (minPrice, maxPrice, skip = 0, limit = 100) => 
    api.get(`/prices/range?min_price=${minPrice}&max_price=${maxPrice}&skip=${skip}&limit=${limit}`),
  create: (data) => api.post('/prices', data),
  update: (id, data) => api.put(`/prices/${id}`, data),
  delete: (id) => api.delete(`/prices/${id}`),
  compareByPhone: (phoneId) => api.get(`/prices/phone/${phoneId}/compare`),
};

// Utility functions
export const getPhoneWithPrices = async (phoneId) => {
  try {
    const [phoneRes, pricesRes] = await Promise.all([
      phonesAPI.getById(phoneId),
      pricesAPI.getAll(phoneId)
    ]);
    return {
      phone: phoneRes.data,
      prices: pricesRes.data
    };
  } catch (error) {
    console.error(`Error fetching phone ${phoneId} with prices:`, error);
    throw error;
  }
};

export const getTrendingPhones = async (limit = 6) => {
  try {
    // Get recent phones (ordered by ID desc would need backend support)
    // For now, get all and take first N
    const response = await phonesAPI.getAll(0, limit);
    return response.data;
  } catch (error) {
    console.error('Error fetching trending phones:', error);
    return [];
  }
};

export const getCategories = () => {
  // Return available categories from schema
  return ['budget', 'midrange', 'flagship', 'gaming', 'foldable'];
};

// AI Predictions API
export const aiAPI = {
  predict: (phoneId) => api.get(`/ai/predict/${phoneId}`),
  priceRange: (phoneId) => api.get(`/ai/price-range/${phoneId}`),
  comparison: (phoneId) => api.get(`/ai/comparison/${phoneId}`),
};

export default api;
