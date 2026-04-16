import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import BlogsList from './pages/BlogsList'
import BlogsCreate from './pages/BlogsCreate'
import { setUser } from './store/slices/authSlice'
import authService from './services/authService'

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('adminToken')
      if (token) {
        try {
          const response = await authService.getProfile()
          dispatch(setUser(response.data))
        } catch (error) {
          localStorage.removeItem('adminToken')
        }
      }
    }

    initAuth()
  }, [dispatch])

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/blogs"
          element={isAuthenticated ? <BlogsList /> : <Navigate to="/login" />}
        />
        <Route
          path="/blogs/create"
          element={isAuthenticated ? <BlogsCreate /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />}
        />
      </Routes>
    </>
  )
}

export default App
