import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import MainLayout from '../components/layout/MainLayout'
import CategoryForm from '../components/forms/CategoryForm'
import categoryService from '../services/categoryService'
import {
  addCategory,
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  updateCategory as updateCategoryInStore,
} from '../store/slices/categorySlice'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../utils/helpers'

const CategoriesCreate = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isEditMode = Boolean(id)
  const { categories } = useSelector((state) => state.categories)
  const [initialData, setInitialData] = useState(null)
  const [isFetching, setIsFetching] = useState(false)
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

    if (isEditMode) {
      setIsFetching(true)
      categoryService
        .getById(id)
        .then((response) => {
          setInitialData(response.data)
        })
        .catch((error) => {
          toast.error(getErrorMessage(error))
          navigate('/categories')
        })
        .finally(() => setIsFetching(false))
    }
  }, [dispatch, id, isEditMode, navigate])

  const handleSubmit = async (formData) => {
    setIsLoading(true)
    
    try {
      const preparedData = {
        name: formData.name,
        description: formData.description || null,
        parentCategory: formData.parentCategory ? parseInt(formData.parentCategory) : null,
        isActive: formData.isActive,
      }

      const response = isEditMode
        ? await categoryService.update(id, preparedData)
        : await categoryService.create(preparedData)

      if (response.success) {
        toast.success(response.message || (isEditMode ? 'Category updated successfully!' : 'Category created successfully!'))
        if (isEditMode) {
          dispatch(updateCategoryInStore(response.data))
        } else {
          dispatch(addCategory(response.data))
        }
        navigate('/categories')
      } else {
        toast.error(response.message || `Failed to ${isEditMode ? 'update' : 'create'} category`)
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
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Edit Category' : 'Create New Category'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode ? 'Update category or subcategory details.' : 'Add a new category or subcategory for organizing blogs.'}
          </p>
        </div>

        {isEditMode && isFetching ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
            Loading category details...
          </div>
        ) : (
          <CategoryForm
            onSubmit={handleSubmit}
            initialData={initialData}
            isLoading={isLoading}
            categories={categories}
          />
        )}
      </div>
    </MainLayout>
  )
}

export default CategoriesCreate
