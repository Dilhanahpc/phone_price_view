import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const reviewsAPI = {
  // Get all reviews with optional filters
  getAll: (phoneId = null, rating = null, skip = 0, limit = 100) => {
    let url = `${API_BASE_URL}/reviews/?skip=${skip}&limit=${limit}`;
    if (phoneId) url += `&phone_id=${phoneId}`;
    if (rating) url += `&rating=${rating}`;
    return axios.get(url);
  },

  // Create a new review
  create: (reviewData) => {
    return axios.post(`${API_BASE_URL}/reviews/`, reviewData);
  },

  // Update a review (only by original author)
  update: (reviewId, userName, rating, comment) => {
    return axios.put(
      `${API_BASE_URL}/reviews/${reviewId}?user_name=${encodeURIComponent(userName)}&rating=${rating}&comment=${encodeURIComponent(comment)}`
    );
  },

  // Increment helpful count
  incrementHelpful: (reviewId) => {
    return axios.put(`${API_BASE_URL}/reviews/${reviewId}/helpful`);
  },

  // Get review statistics
  getStats: () => {
    return axios.get(`${API_BASE_URL}/reviews/stats/summary`);
  },

  // Delete a review (admin only)
  delete: (reviewId) => {
    return axios.delete(`${API_BASE_URL}/reviews/${reviewId}`);
  }
};
