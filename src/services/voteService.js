import apiClient from './apiClient'

const voteService = {
  getAll: (params) => apiClient.get('/votes', { params }),
  
  getById: (id) => apiClient.get(`/votes/${id}`),
  
  create: (data) => apiClient.post('/votes', data),
  
  update: (id, data) => apiClient.put(`/votes/${id}`, data),
  
  delete: (id) => apiClient.delete(`/votes/${id}`),
  
  castVote: (id, optionIndex) => apiClient.post(`/votes/${id}/cast`, { optionIndex }),
  
  getResults: (id) => apiClient.get(`/votes/${id}/results`),
  
  toggle: (id) => apiClient.patch(`/votes/${id}/toggle`, {}),
}

export default voteService
