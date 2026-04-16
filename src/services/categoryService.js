import apiClient from './apiClient'

const categoryService = {
  getAll: (params) => apiClient.get('/categories', { params }),
  
  getById: (id) => apiClient.get(`/categories/${id}`),
  
  create: (data) => apiClient.post('/categories', data),
  
  update: (id, data) => apiClient.put(`/categories/${id}`, data),
  
  delete: (id) => apiClient.delete(`/categories/${id}`),
  
  getTree: () => apiClient.get('/categories/tree'),
}

export default categoryService
