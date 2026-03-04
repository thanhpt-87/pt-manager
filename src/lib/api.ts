/**
 * Axios instance — pre-wired for when a real backend is added.
 *
 * Usage example (future):
 *   import api from '@/lib/api'
 *   const clients = await api.get('/clients')
 *
 * All mock data still lives in Context/mockData.ts.
 * Replace context calls with api.* calls when backend is ready.
 */

import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Request interceptor — attach JWT when available ─────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pt_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── Response interceptor — global error handling ────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired → redirect to login
      localStorage.removeItem('pt_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
