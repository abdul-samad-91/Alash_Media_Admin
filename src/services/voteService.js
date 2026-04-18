import apiClient from './apiClient'

const voteService = {
  getAll: (params) => apiClient.get('/votes', { params }),
  
  getById: (id) => apiClient.get(`/votes/${id}`),
  
  create: (data) => apiClient.post('/votes', data),
  
  update: (id, data) => apiClient.put(`/votes/${id}`, data),
  
  delete: (id) => apiClient.delete(`/votes/${id}`),

  castVote: (id, optionId) => apiClient.post(`/votes/${id}/cast`, { optionId }),
}

export default voteService
