import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor to normalize error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred.';
    if (error.response) {
      const data = error.response.data;
      if (typeof data?.detail === 'string') {
        message = data.detail;
      } else if (Array.isArray(data?.detail)) {
        message = data.detail.map((d) => d.msg || JSON.stringify(d)).join('; ');
      } else if (data?.message) {
        message = data.message;
      }
    } else if (error.request) {
      message = 'Unable to connect to the Drivora backend server. Please verify the API is running.';
    }
    const customError = new Error(message);
    customError.status = error.response?.status;
    customError.data = error.response?.data;
    return Promise.reject(customError);
  }
);

export const carService = {
  async getCars(params = {}) {
    const res = await apiClient.get('/cars/', { params });
    return res.data;
  },

  async getCarById(id) {
    const res = await apiClient.get(`/cars/${id}`);
    return res.data;
  },

  async getCarRentals(id) {
    const res = await apiClient.get(`/cars/${id}/rentals`);
    return res.data;
  },

  async createRental(carId, payload) {
    const res = await apiClient.post(`/cars/${carId}/rent`, payload);
    return res.data;
  },
};

export const rentalService = {
  async getRentals(params = {}) {
    const res = await apiClient.get('/rentals/', { params });
    return res.data;
  },

  async getRentalById(id) {
    const res = await apiClient.get(`/rentals/${id}`);
    return res.data;
  },

  async cancelRental(id) {
    const res = await apiClient.delete(`/rentals/${id}`);
    return res.data;
  },
};

export const systemService = {
  async getHealth() {
    const res = await apiClient.get('/health');
    return res.data;
  },
};
