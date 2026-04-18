import React, { useEffect, useMemo, useState } from 'react'
import MainLayout from '../components/layout/MainLayout'
import { Card } from '../components/common/FormElements'
import Button from '../components/common/Button'
import { useNavigate } from 'react-router-dom'
import categoryService from '../services/categoryService'
import toast from 'react-hot-toast'
import { formatDate, getErrorMessage, truncate } from '../utils/helpers'

const CategoriesList = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true)
      try {
        const response = await categoryService.getAll()
        setCategories(response.data || [])
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const filteredCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) {
      return categories
    }

    return categories.filter((category) => {
      const parentName = category.parentCategory?.name || ''
      return `${category.name} ${category.slug} ${category.description || ''} ${parentName}`
        .toLowerCase()
        .includes(keyword)
    })
  }, [categories, search])

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`Delete category "${name}"?`)
    if (!confirmDelete) {
      return
    }

    try {
      await categoryService.delete(id)
      toast.success('Category deleted successfully')
      setCategories((prev) => prev.filter((category) => category.id !== id))
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600 mt-1">Manage blog categories and subcategories.</p>
          </div>
          <Button onClick={() => navigate('/categories/create')}>
            Create Category
          </Button>
        </div>

        <Card>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Search name, slug or parent category..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {isLoading ? (
              <p className="text-gray-600">Loading categories...</p>
            ) : filteredCategories.length === 0 ? (
              <p className="text-gray-600">No categories found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Parent Category</th>
                      <th className="py-2 pr-4">Description</th>
                      <th className="py-2 pr-4">Created</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.map((category) => (
                      <tr key={category.id} className="border-b">
                        <td className="py-3 pr-4">
                          <p className="font-medium text-gray-900">{category.name}</p>
                          <p className="text-xs text-gray-500">{category.slug}</p>
                        </td>
                        <td className="py-3 pr-4">{category.parentCategory?.name || 'Top level'}</td>
                        <td className="py-3 pr-4">{truncate(category.description, 80) || '-'}</td>
                        <td className="py-3 pr-4">{formatDate(category.createdAt)}</td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <Button size="sm" variant="secondary" onClick={() => navigate(`/categories/${category.id}/edit`)}>
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDelete(category.id, category.name)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}

export default CategoriesList
