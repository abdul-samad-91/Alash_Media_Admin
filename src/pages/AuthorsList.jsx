import React, { useEffect, useState } from 'react'
import MainLayout from '../components/layout/MainLayout'
import { Card } from '../components/common/FormElements'
import Button from '../components/common/Button'
import { useNavigate } from 'react-router-dom'
import authorService from '../services/authorService'
import toast from 'react-hot-toast'
import { formatDate, getErrorMessage, truncate } from '../utils/helpers'

const AuthorsList = () => {
  const navigate = useNavigate()
  const [authors, setAuthors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({ page: 1, limit: 10, search: '' })
  const [pagination, setPagination] = useState({ total: 0, pages: 1, currentPage: 1 })

  useEffect(() => {
    const fetchAuthors = async () => {
      setIsLoading(true)
      try {
        const response = await authorService.getAll(filters)
        setAuthors(response.data || [])
        setPagination(response.pagination || { total: 0, pages: 1, currentPage: 1 })
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setIsLoading(false)
      }
    }

    fetchAuthors()
  }, [filters])

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`Delete author "${name}"?`)
    if (!confirmDelete) {
      return
    }

    try {
      await authorService.delete(id)
      toast.success('Author deleted successfully')
      setAuthors((prev) => prev.filter((author) => author.id !== id))
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

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
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Search name or short bio..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
              />
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
              <p className="text-gray-600">Loading authors...</p>
            ) : authors.length === 0 ? (
              <p className="text-gray-600">No authors found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2 pr-4">Author</th>
                      <th className="py-2 pr-4">Short Bio</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Created</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {authors.map((author) => (
                      <tr key={author.id} className="border-b">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            {author.photo ? (
                              <img src={author.photo} alt={author.name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-200" />
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{author.name}</p>
                              <p className="text-xs text-gray-500">{author.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4">{truncate(author.shortBio, 90)}</td>
                        <td className="py-3 pr-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              author.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {author.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 pr-4">{formatDate(author.createdAt)}</td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <Button size="sm" variant="secondary" onClick={() => navigate(`/authors/${author.id}/edit`)}>
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDelete(author.id, author.name)}
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
                Total: {pagination.total || 0} authors
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

export default AuthorsList
