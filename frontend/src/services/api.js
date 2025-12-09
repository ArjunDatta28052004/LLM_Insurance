import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const companyAPI = {
  // Get all companies
  getAll: async () => {
    const response = await api.get('/companies');
    return response.data;
  },

  // Upload policy
  uploadPolicy: async (formData) => {
    const response = await api.post('/upload-policy', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete company
  delete: async (id) => {
    const response = await api.delete(`/companies/${id}`);
    return response.data;
  },
};

export const claimAPI = {
  // Query claim
  queryClaim: async (formData) => {
    const response = await api.post('/query-claim', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;