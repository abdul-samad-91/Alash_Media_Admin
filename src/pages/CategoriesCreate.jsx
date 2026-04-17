import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import MainLayout from '../components/layout/MainLayout'
import CategoryForm from '../components/forms/CategoryForm'
import categoryService from '../services/categoryService'
import { addCategory, fetchCategoriesStart, fetchCategoriesSuccess } from '../store/slices/categorySlice'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../utils/helpers'

const CategoriesCreate = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { categories } = useSelector((state) => state.categories)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Fetch all categories for parent category selection
    dispatch(fetchCategoriesStart())
    categoryService
      .getAll({ limit: 100 })
      .then((response) => {
        dispatch(fetchCategoriesSuccess(response.data || []))
      })
      .catch((error) => console.error('Failed to fetch categories:', error))
  }, [dispatch])

  const handleSubmit = async (formData) => {
    setIsLoading(true)
    
    try {
      const preparedData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || null,
        parentCategory: formData.parentCategory ? parseInt(formData.parentCategory) : null,
      }

      const response = await categoryService.create(preparedData)
      console.log('Create category response:', response)

      if (response.success) {
        toast.success(response.message || 'Category created successfully!')
        dispatch(addCategory(response.data))
        
        // Navigate to categories list
        setTimeout(() => {
          navigate('/categories')
        }, 500)
      } else {
        toast.error(response.message || 'Failed to create category')
      }
    } catch (error) {
      console.error('Error creating category:', error)
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage || 'Failed to create category')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Category</h1>
          <p className="text-gray-600 mt-1">Add a new category or subcategory for organizing blogs.</p>
        </div>

        <CategoryForm 
          onSubmit={handleSubmit} 
          isLoading={isLoading}
          categories={categories}
        />
      </div>
    </MainLayout>
  )
}

export default CategoriesCreate
