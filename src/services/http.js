import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8002'
})

// Request: add token from localStorage
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response: auto logout on 401 (token expired / invalid)
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token')
      // redirect to login page to force re-auth
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
