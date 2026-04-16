import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice'
import { Input } from '../components/common/FormElements'
import Button from '../components/common/Button'
import authService from '../services/authService'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../utils/helpers'

const Login = () => {
  const [email, setEmail] = useState('admin@alashmedia.com')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    dispatch(loginStart())

    try {
      const response = await authService.login(email, password)
      console.log('Login response:', response)
      
      if (response.data) {
        dispatch(loginSuccess({
          user: response.data,
          token: response.data.token,
        }))
        toast.success('Login successful!')
        navigate('/dashboard', { replace: true })
      }
    } catch (error) {
      const message = getErrorMessage(error)
      dispatch(loginFailure(message))
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Alash Media</h1>
          <p className="text-gray-600">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@alashmedia.com"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Demo Credentials:</strong><br />
            Email: admin@alashmedia.com<br />
            Password: admin123
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
