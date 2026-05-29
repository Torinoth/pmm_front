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
    // /auth/ 配下のエンドポイントは各コンポーネントでエラーハンドリングする
    const isAuthEndpoint = url.includes('/auth/')
    if (is401 && !isAuthEndpoint) {
      window.location.href = '/login'
    }
    return Promise.reject(err)
  },
)

export const summaryApi = {
  get: () => api.get('/kits/summary/'),
}

export const authApi = {
  csrf: () => api.get('/auth/csrf/'),
  login: (data) => api.post('/auth/login/', data),
  logout: () => api.post('/auth/logout/'),
  me: () => api.get('/auth/me/'),
  register: (data) => api.post('/auth/register/', data),
  verifyEmail: (token) => api.get('/auth/verify-email/', {params: {token}}),
  users: () => api.get('/auth/users/'),
  approveUser: (id) => api.post(`/auth/users/${id}/approve/`),
  suspendUser: (id) => api.put(`/auth/users/${id}/suspend/`),
  deleteUser: (id) => api.delete(`/auth/users/${id}/`),
}

function multipartConfig(data) {
  // FormData 送信時は axios のデフォルト Content-Type を外してブラウザに任せる
  return data instanceof FormData ? {headers: {'Content-Type': undefined}} : {}
}

export const userApi = {
  kits: (username, params) => api.get(`/u/${username}/`, {params}),
  kit: (username, id) => api.get(`/u/${username}/kits/${id}/`),
  summary: (username) => api.get(`/u/${username}/summary/`),
}

export const kitsApi = {
  list: (params) => api.get('/kits/', {params}),
  retrieve: (id) => api.get(`/kits/${id}/`),
  create: (data) => api.post('/kits/', data, multipartConfig(data)),
  update: (id, data) => api.patch(`/kits/${id}/`, data, multipartConfig(data)),
  destroy: (id) => api.delete(`/kits/${id}/`),
}

export const tagsApi = {
  list: () => api.get('/tags/'),
  create: (data) => api.post('/tags/', data),
  destroy: (id) => api.delete(`/tags/${id}/`),
}

export const makersApi = {
  list: () => api.get('/makers/'),
  create: (data) => api.post('/makers/', data),
  update: (id, data) => api.put(`/makers/${id}/`, data),
  destroy: (id) => api.delete(`/makers/${id}/`),
  favorite: (id) => api.post(`/makers/${id}/favorite/`),
  unfavorite: (id) => api.delete(`/makers/${id}/favorite/`),
}

export const brandsApi = {
  list: () => api.get('/brands/'),
  create: (data) => api.post('/brands/', data),
  update: (id, data) => api.put(`/brands/${id}/`, data),
  destroy: (id) => api.delete(`/brands/${id}/`),
  favorite: (id) => api.post(`/brands/${id}/favorite/`),
  unfavorite: (id) => api.delete(`/brands/${id}/favorite/`),
}

export const scalesApi = {
  list: () => api.get('/scales/'),
  create: (data) => api.post('/scales/', data),
  update: (id, data) => api.put(`/scales/${id}/`, data),
  destroy: (id) => api.delete(`/scales/${id}/`),
}

export default api
