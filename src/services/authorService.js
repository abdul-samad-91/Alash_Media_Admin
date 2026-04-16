import apiClient from './apiClient'

const authorService = {
  getAll: (params) => apiClient.get('/authors', { params }),
  
  getById: (id, params) => apiClient.get(`/authors/${id}`, { params }),
  
  getBySlug: (slug, params) => apiClient.get(`/authors/slug/${slug}`, { params }),
  
  create: (data) => apiClient.post('/authors', data),
  
  update: (id, data) => apiClient.put(`/authors/${id}`, data),
  
  delete: (id) => apiClient.delete(`/authors/${id}`),
  
  getAuthorBlogs: (id, params) => apiClient.get(`/authors/${id}/blogs`, { params }),
}

export default authorService
