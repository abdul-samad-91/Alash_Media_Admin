import React from 'react'

export const Card = ({ children, className = '', ...props }) => (
  <div className={`bg-white rounded-lg shadow p-6 ${className}`} {...props}>
    {children}
  </div>
)

export const Input = React.forwardRef(
  ({ label, error, type = 'text', className = '', help = '', ...props }, ref) => (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {help && !error && <p className="text-gray-500 text-xs mt-1">{help}</p>}
    </div>
  )
)

Input.displayName = 'Input'

export const Select = React.forwardRef(
  ({ label, options = [], error, className = '', ...props }, ref) => (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
)

Select.displayName = 'Select'

export const TextArea = React.forwardRef(
  ({ label, error, className = '', rows = 4, help = '', ...props }, ref) => (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {help && !error && <p className="text-gray-500 text-xs mt-1">{help}</p>}
    </div>
  )
)

TextArea.displayName = 'TextArea'
