import React from 'react'
import MainLayout from '../components/layout/MainLayout'
import { Card } from '../components/common/FormElements'
import Button from '../components/common/Button'
import { useNavigate } from 'react-router-dom'

const CategoriesList = () => {
  const navigate = useNavigate()

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
          <p className="text-gray-600">Category list will be displayed here with hierarchy view and pagination.</p>
        </Card>
      </div>
    </MainLayout>
  )
}

export default CategoriesList
