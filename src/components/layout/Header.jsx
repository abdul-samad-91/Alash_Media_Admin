import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiMenu, FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi'
import { logout } from '../../store/slices/authSlice'

const Header = ({ onMenuToggle }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <FiMenu size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Alash Media Admin</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                <FiUser size={20} />
              </div>
              <span className="text-sm font-medium">{user?.name}</span>
              <FiChevronDown size={16} />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  <FiLogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
