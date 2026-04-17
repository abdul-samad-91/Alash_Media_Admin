import React, { useState, useEffect } from 'react'
import { Input, TextArea, Select, Card } from '../common/FormElements'
import Button from '../common/Button'
import { slugify } from '../../utils/helpers'
import toast from 'react-hot-toast'

const CategoryForm = ({ onSubmit, initialData = null, isLoading = false, categories = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parentCategory: '',
    isActive: true,
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        slug: initialData.slug || '',
        description: initialData.description || '',
        parentCategory: initialData.parentCategoryId ? initialData.parentCategoryId.toString() : '',
        isActive: initialData.isActive !== false,
      })
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

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required'
    }
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required'
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

  // Filter out the current category from parent options to avoid circular references
  const availableParents = initialData
    ? categories.filter(c => c.id !== initialData.id)
    : categories

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Category Information</h3>
          
          <Input
            label="Category Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter category name"
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
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter category description (optional)"
            rows="4"
          />

          {availableParents.length > 0 && (
            <Select
              label="Parent Category"
              name="parentCategory"
              value={formData.parentCategory}
              onChange={handleChange}
              options={[
                { value: '', label: 'No Parent (Top Level)' },
                ...availableParents.map(cat => ({
                  value: cat.id.toString(),
                  label: cat.name,
                })),
              ]}
            />
          )}

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
              Active Category
            </label>
          </div>
        </div>
      </Card>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Category'}
        </Button>
      </div>
    </form>
  )
}

export default CategoryForm
