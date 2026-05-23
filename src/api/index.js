import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: {'Content-Type': 'application/json'},
})

function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}

api.interceptors.request.use(config => {
  const csrfToken = getCookie('csrftoken')
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken
  }
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    const url = err.config?.url ?? ''
    const is401 = err.response?.status === 401
    const isAuthEndpoint = url.includes('/auth/login/') || url.includes('/auth/me/')
    if (is401 && !isAuthEndpoint) {
      window.location.href = '/login'
    }
    return Promise.reject(err)
  },
)

export const authApi = {
  csrf: () => api.get('/auth/csrf/'),
  login: (data) => api.post('/auth/login/', data),
  logout: () => api.post('/auth/logout/'),
  me: () => api.get('/auth/me/'),
}

export const kitsApi = {
  list: (params) => api.get('/kits/', {params}),
  retrieve: (id) => api.get(`/kits/${id}/`),
  create: (data) => api.post('/kits/', data),
  update: (id, data) => api.put(`/kits/${id}/`, data),
  destroy: (id) => api.delete(`/kits/${id}/`),
}

export const tagsApi = {
  list: () => api.get('/tags/'),
  create: (data) => api.post('/tags/', data),
  destroy: (id) => api.delete(`/tags/${id}/`),
}

export const makersApi = {
  list: () => api.get('/makers/'),
}

export const brandsApi = {
  list: () => api.get('/brands/'),
}

export const scalesApi = {
  list: () => api.get('/scales/'),
}

export default api
