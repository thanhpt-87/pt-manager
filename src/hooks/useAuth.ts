import { useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { MOCK_PT } from '@/data/mockData'

export function useAuth() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()

  const login = (email: string, password: string): boolean => {
    if (email === MOCK_PT.email && password === MOCK_PT.password) {
      dispatch({ type: 'LOGIN' })
      navigate('/dashboard')
      return true
    }
    return false
  }

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
    navigate('/login')
  }

  return {
    isLoggedIn: state.isLoggedIn,
    pt: state.pt,
    login,
    logout,
  }
}
