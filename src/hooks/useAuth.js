import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export const useAuth = () => {
  const auth = useSelector((state) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (!auth.isAuthenticated && window.location.pathname !== '/login') {
      navigate('/login', { replace: true })
    }
  }, [auth.isAuthenticated, navigate])

  return {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
  }
}

export const useRequireAdmin = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated && user?.role !== 'admin') {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, user, navigate])
}
