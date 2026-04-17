import React from 'react'
import MainLayout from '../components/layout/MainLayout'
import { Card } from '../components/common/FormElements'
import Button from '../components/common/Button'
import { useNavigate } from 'react-router-dom'

const AuthorsList = () => {
  const navigate = useNavigate()

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Authors</h1>
            <p className="text-gray-600 mt-1">Manage your authors and contributors.</p>
          </div>
          <Button onClick={() => navigate('/authors/create')}>
            Create Author
          </Button>
        </div>

        <Card>
          <p className="text-gray-600">Author list will be displayed here with pagination and search functionality.</p>
        </Card>
      </div>
    </MainLayout>
  )
}

export default AuthorsList
