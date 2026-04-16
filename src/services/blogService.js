import apiClient from './apiClient'

const blogService = {
  getAll: (params) => apiClient.get('/blogs', { params }),
  
  getById: (id) => apiClient.get(`/blogs/${id}`),
  
  getBySlug: (slug) => apiClient.get(`/blogs/slug/${slug}`),
  
  create: (data) => apiClient.post('/blogs', data),
  
  update: (id, data) => apiClient.put(`/blogs/${id}`, data),
  
  delete: (id) => apiClient.delete(`/blogs/${id}`),
  
  publish: (id) => apiClient.patch(`/blogs/${id}/publish`, {}),
  
  saveDraft: (id) => apiClient.patch(`/blogs/${id}/draft`, {}),
  
  addComment: (id, comment) => apiClient.post(`/blogs/${id}/comments`, { comment }),
}

export default blogService
