import React, { useState, useEffect, useRef } from 'react'
import { Input, TextArea, Card } from '../common/FormElements'
import Button from '../common/Button'
import { FiImage, FiTrash2 } from 'react-icons/fi'
import { slugify } from '../../utils/helpers'
import toast from 'react-hot-toast'

const AuthorForm = ({ onSubmit, initialData = null, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    photo: '',
    shortBio: '',
    isActive: true,
  })

  const [preview, setPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
      setPreview(initialData.photo)
    }
  }, [initialData])

  // Auto-generate slug
  useEffect(() => {
    if (formData.name) {
      setFormData((prev) => ({
        ...prev,
        slug: slugify(prev.name),
      }))
    }
  }, [formData.name])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target.result)
        setFormData((prev) => ({
          ...prev,
          photo: event.target.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setPreview(null)
    setFormData((prev) => ({
      ...prev,
      photo: '',
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required'
    }
    if (!formData.shortBio.trim()) {
      newErrors.shortBio = 'Short bio is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    } else {
      toast.error('Please fill in all required fields')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Author Photo */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Author Photo</h3>
          
          <div className="flex items-center gap-6">
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Author preview"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <FiImage size={32} className="text-gray-400" />
              </div>
            )}
            
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mb-2"
              >
                Upload Photo
              </Button>
              <p className="text-sm text-gray-600">
                Recommended size: 400x400px. Formats: JPG, PNG
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Basic Information */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
          
          <Input
            label="Author Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter author name"
            error={errors.name}
            required
          />

          <Input
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="Auto-generated from name"
            error={errors.slug}
            readOnly
          />

          <TextArea
            label="Short Bio"
            name="shortBio"
            value={formData.shortBio}
            onChange={handleChange}
            placeholder="Write a brief bio about the author"
            rows="4"
            error={errors.shortBio}
            required
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active Author
            </label>
          </div>
        </div>
      </Card>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Author'}
        </Button>
      </div>
    </form>
  )
}

export default AuthorForm
