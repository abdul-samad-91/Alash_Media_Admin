import apiClient from './apiClient'

const bannerService = {
  getAll: (params) => apiClient.get('/banners', { params }),
  
  getById: (id) => apiClient.get(`/banners/${id}`),
  
  create: (data) => apiClient.post('/banners', data),
  
  update: (id, data) => apiClient.put(`/banners/${id}`, data),
  
  delete: (id) => apiClient.delete(`/banners/${id}`),
  
  toggle: (id) => apiClient.patch(`/banners/${id}/toggle`, {}),
}

export default bannerService
