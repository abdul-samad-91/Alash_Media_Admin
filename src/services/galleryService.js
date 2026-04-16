import apiClient from './apiClient'

const galleryService = {
  getAll: (params) => apiClient.get('/galleries', { params }),
  
  getById: (id) => apiClient.get(`/galleries/${id}`),
  
  create: (data) => apiClient.post('/galleries', data),
  
  update: (id, data) => apiClient.put(`/galleries/${id}`, data),
  
  delete: (id) => apiClient.delete(`/galleries/${id}`),
  
  addItem: (id, item) => apiClient.post(`/galleries/${id}/items`, item),
  
  updateItem: (id, itemId, item) => apiClient.put(`/galleries/${id}/items/${itemId}`, item),
  
  deleteItem: (id, itemId) => apiClient.delete(`/galleries/${id}/items/${itemId}`),
}

export default galleryService
