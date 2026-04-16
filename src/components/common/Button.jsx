import React from 'react'
import { FiLoader } from 'react-icons/fi'

const Button = ({
  children,
  isLoading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2'
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
    success: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300',
    outline: 'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-50',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading && <FiLoader className="animate-spin" />}
      {children}
    </button>
  )
}

export default Button
