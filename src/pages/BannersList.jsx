import React, { useEffect, useState } from 'react'
import MainLayout from '../components/layout/MainLayout'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import { Card, Input, TextArea } from '../components/common/FormElements'
import bannerService from '../services/bannerService'
import toast from 'react-hot-toast'
import { formatDateTime, getErrorMessage, truncate } from '../utils/helpers'

const emptyBanner = {
  title: '',
  description: '',
  image: '',
  link: '',
  position: 0,
  startDate: '',
  endDate: '',
  isActive: true,
}

const toDateTimeInput = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 16)
}

const BannersList = ({ mode = 'list' }) => {
  const [banners, setBanners] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [pagination, setPagination] = useState({ total: 0, pages: 1, currentPage: 1 })
  const [filters, setFilters] = useState({ page: 1, limit: 10, activeOnly: false })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)
  const [formData, setFormData] = useState(emptyBanner)

  useEffect(() => {
    if (mode === 'create') {
      setEditingBanner(null)
      setFormData(emptyBanner)
      setIsModalOpen(true)
    }
  }, [mode])

  useEffect(() => {
    const fetchBanners = async () => {
      setIsLoading(true)
      try {
        const response = await bannerService.getAll(filters)
        setBanners(response.data || [])
        setPagination(response.pagination || { total: 0, pages: 1, currentPage: 1 })
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setIsLoading(false)
      }
    }

    fetchBanners()
  }, [filters])

  const openCreateModal = () => {
    setEditingBanner(null)
    setFormData(emptyBanner)
    setIsModalOpen(true)
  }

  const openEditModal = (banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title || '',
      description: banner.description || '',
      image: banner.image || '',
      link: banner.link || '',
      position: banner.position || 0,
      startDate: toDateTimeInput(banner.startDate),
      endDate: toDateTimeInput(banner.endDate),
      isActive: banner.isActive !== false,
    })
    setIsModalOpen(true)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.image.trim()) {
      toast.error('Title and image are required')
      return
    }

    setIsSaving(true)

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description?.trim() || null,
        image: formData.image.trim(),
        link: formData.link?.trim() || null,
        position: Number(formData.position) || 0,
        isActive: Boolean(formData.isActive),
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      }

      const response = editingBanner
        ? await bannerService.update(editingBanner.id, payload)
        : await bannerService.create(payload)

      toast.success(response.message || `Banner ${editingBanner ? 'updated' : 'created'} successfully`)
      setIsModalOpen(false)

      setFilters((prev) => ({ ...prev }))
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (banner) => {
    const shouldDelete = window.confirm(`Delete banner "${banner.title}"?`)
    if (!shouldDelete) {
      return
    }

    try {
      await bannerService.delete(banner.id)
      toast.success('Banner deleted successfully')
      setBanners((prev) => prev.filter((item) => item.id !== banner.id))
      setPagination((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }))
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Banners</h1>
            <p className="text-gray-600 mt-1">Create, schedule, and manage homepage banners.</p>
          </div>
          <Button onClick={openCreateModal}>Create Banner</Button>
        </div>

        <Card>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={filters.activeOnly}
                  onChange={(e) => setFilters((prev) => ({ ...prev, activeOnly: e.target.checked, page: 1 }))}
                />
                Active only
              </label>
            </div>

            {isLoading ? (
              <p className="text-gray-600">Loading banners...</p>
            ) : banners.length === 0 ? (
              <p className="text-gray-600">No banners found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2 pr-4">Title</th>
                      <th className="py-2 pr-4">Position</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Start</th>
                      <th className="py-2 pr-4">End</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {banners.map((banner) => (
                      <tr key={banner.id} className="border-b">
                        <td className="py-3 pr-4">
                          <p className="font-medium text-gray-900">{banner.title}</p>
                          <p className="text-xs text-gray-500">{truncate(banner.description, 80)}</p>
                        </td>
                        <td className="py-3 pr-4">{banner.position}</td>
                        <td className="py-3 pr-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              banner.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {banner.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 pr-4">{formatDateTime(banner.startDate)}</td>
                        <td className="py-3 pr-4">{formatDateTime(banner.endDate) || '-'}</td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <Button size="sm" variant="secondary" onClick={() => openEditModal(banner)}>
                              Edit
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => handleDelete(banner)}>
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
              <p className="text-sm text-gray-600">Total: {pagination.total || 0} banners</p>
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBanner ? 'Edit Banner' : 'Create Banner'}
        size="xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Top banner title"
            required
          />

          <TextArea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Optional short description"
          />

          <Input
            label="Image URL"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://..."
            required
          />

          <Input
            label="Target Link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://example.com/page"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Position"
              name="position"
              type="number"
              min="0"
              value={formData.position}
              onChange={handleChange}
            />
            <label className="flex items-center gap-2 text-sm text-gray-700 mt-8">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              Active banner
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              name="startDate"
              type="datetime-local"
              value={formData.startDate}
              onChange={handleChange}
            />
            <Input
              label="End Date"
              name="endDate"
              type="datetime-local"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {editingBanner ? 'Update Banner' : 'Create Banner'}
            </Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  )
}

export default BannersList
