import apiClient from './apiClient'

const authService = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  
  register: (name, email, password, role) =>
    apiClient.post('/auth/register', { name, email, password, role }),
  
  getProfile: () => apiClient.get('/auth/profile'),
  
  logout: () => {
    localStorage.removeItem('adminToken')
  },
  
  resetPassword: (email) => apiClient.post('/auth/reset-password', { email }),
  
  updatePassword: (oldPassword, newPassword) =>
    apiClient.put('/auth/update-password', { oldPassword, newPassword }),
}

export default authService
