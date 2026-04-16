import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Handle responses
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.log('API Error:', error.response)
    // if (error.response?.status === 401) {
    //   localStorage.removeItem('adminToken')
    //   // window.location.href = '/login'
    // }
    return Promise.reject(error.response?.data || error.message)
  }
)

export default apiClient
