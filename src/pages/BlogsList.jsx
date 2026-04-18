import React, { useEffect, useState } from 'react'
import MainLayout from '../components/layout/MainLayout'
import { Card } from '../components/common/FormElements'
import Button from '../components/common/Button'
import { useNavigate } from 'react-router-dom'
import blogService from '../services/blogService'
import toast from 'react-hot-toast'
import { getErrorMessage, formatDate, truncate } from '../utils/helpers'

const BlogsList = () => {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({ page: 1, limit: 10, search: '', status: '', contentType: '' })
  const [pagination, setPagination] = useState({ total: 0, pages: 1, currentPage: 1 })

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true)
      try {
        const response = await blogService.getAll(filters)
        setBlogs(response.data || [])
        setPagination(response.pagination || { total: 0, pages: 1, currentPage: 1 })
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogs()
  }, [filters])

  const handleDelete = async (id, title) => {
    const confirmDelete = window.confirm(`Delete blog "${title}"?`)
    if (!confirmDelete) {
      return
    }

    try {
      await blogService.delete(id)
      toast.success('Blog deleted successfully')
      setBlogs((prev) => prev.filter((blog) => blog.id !== id))
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blogs & News</h1>
            <p className="text-gray-600 mt-1">Manage your blog posts and news articles.</p>
          </div>
          <Button onClick={() => navigate('/blogs/create')}>
            Create Content
          </Button>
        </div>

        <Card>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Search title/content..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
              />
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={filters.status}
                onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value, page: 1 }))}
              >
                <option value="">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={filters.contentType}
                onChange={(e) => setFilters((prev) => ({ ...prev, contentType: e.target.value, page: 1 }))}
              >
                <option value="">All Types</option>
                <option value="blog">Blog</option>
                <option value="news">News</option>
              </select>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={filters.limit}
                onChange={(e) => setFilters((prev) => ({ ...prev, limit: Number(e.target.value), page: 1 }))}
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>

            {isLoading ? (
              <p className="text-gray-600">Loading blogs...</p>
            ) : blogs.length === 0 ? (
              <p className="text-gray-600">No blogs found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2 pr-4">Title</th>
                      <th className="py-2 pr-4">Author</th>
                      <th className="py-2 pr-4">Category</th>
                      <th className="py-2 pr-4">Type</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Published</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((blog) => (
                      <tr key={blog.id} className="border-b">
                        <td className="py-3 pr-4">
                          <p className="font-medium text-gray-900">{truncate(blog.title, 60)}</p>
                          <p className="text-xs text-gray-500">{truncate(blog.shortDescription, 70)}</p>
                        </td>
                        <td className="py-3 pr-4">{blog.author || '-'}</td>
                        <td className="py-3 pr-4">{blog.category?.name || '-'}</td>
                        <td className="py-3 pr-4 capitalize">{blog.contentType || 'blog'}</td>
                        <td className="py-3 pr-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              blog.status === 'published'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {blog.status}
                          </span>
                        </td>
                        <td className="py-3 pr-4">{formatDate(blog.publishedDate || blog.createdAt)}</td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <Button size="sm" variant="secondary" onClick={() => navigate(`/blogs/${blog.id}/edit`)}>
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDelete(blog.id, blog.title)}
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

            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-gray-600">
                Total: {pagination.total || 0} items
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={filters.page <= 1}
                  onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
                >
                  Previous
                </Button>
                <span className="px-2 py-1 text-sm text-gray-600">
                  Page {pagination.currentPage || 1} of {pagination.pages || 1}
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={(pagination.currentPage || 1) >= (pagination.pages || 1)}
                  onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}

export default BlogsList
