import React from 'react'
import MainLayout from '../components/layout/MainLayout'
import { Card } from '../components/common/FormElements'
import Button from '../components/common/Button'
import { useNavigate } from 'react-router-dom'

const BlogsList = () => {
  const navigate = useNavigate()

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blogs & News</h1>
            <p className="text-gray-600 mt-1">Manage your blog posts and news articles.</p>
          </div>
          <Button onClick={() => navigate('/blogs/create')}>
            Create Blog
          </Button>
        </div>

        <Card>
          <p className="text-gray-600">Blog list will be displayed here with pagination and search functionality.</p>
        </Card>
      </div>
    </MainLayout>
  )
}

export default BlogsList
