import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: { 'Content-Type': 'application/json' },
})

export const kitsApi = {
  list: (params) => api.get('/kits/', { params }),
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
