import React, { useEffect, useState } from 'react'
import MainLayout from '../components/layout/MainLayout'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import { Card, Input, TextArea } from '../components/common/FormElements'
import galleryService from '../services/galleryService'
import toast from 'react-hot-toast'
import { formatDateTime, getErrorMessage, truncate } from '../utils/helpers'

const emptyGallery = {
  title: '',
  description: '',
  category: 'general',
  isActive: true,
  itemsText: '',
}

const parseItems = (text) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [title = '', url = '', thumbnail = '', description = ''] = line.split('|').map((part) => part.trim())
      return {
        title: title || null,
        url,
        thumbnail: thumbnail || null,
        description: description || null,
        displayOrder: index,
      }
    })
    .filter((item) => item.url)

const toItemsText = (items = []) =>
  items
    .map((item) => [item.title || '', item.url || '', item.thumbnail || '', item.description || ''].join('|'))
    .join('\n')

const GalleriesList = ({ type = 'photo' }) => {
  const typeLabel = type === 'video' ? 'Video Gallery' : 'Photo Gallery'
  const [galleries, setGalleries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [pagination, setPagination] = useState({ total: 0, pages: 1, currentPage: 1 })
  const [filters, setFilters] = useState({ page: 1, limit: 10, type })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGallery, setEditingGallery] = useState(null)
  const [formData, setFormData] = useState(emptyGallery)

  useEffect(() => {
    setFilters((prev) => ({ ...prev, type, page: 1 }))
  }, [type])

  useEffect(() => {
    const fetchGalleries = async () => {
      setIsLoading(true)
      try {
        const response = await galleryService.getAll(filters)
        setGalleries(response.data || [])
        setPagination(response.pagination || { total: 0, pages: 1, currentPage: 1 })
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setIsLoading(false)
      }
    }

    fetchGalleries()
  }, [filters])

  const openCreateModal = () => {
    setEditingGallery(null)
    setFormData(emptyGallery)
    setIsModalOpen(true)
  }

  const openEditModal = (gallery) => {
    setEditingGallery(gallery)
    setFormData({
      title: gallery.title || '',
      description: gallery.description || '',
      category: gallery.category || 'general',
      isActive: gallery.isActive !== false,
      itemsText: toItemsText(gallery.items || []),
    })
    setIsModalOpen(true)
  }

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value,
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()

    const items = parseItems(formData.itemsText)
    if (!formData.title.trim()) {
      toast.error('Gallery title is required')
      return
    }

    if (items.length === 0) {
      toast.error('Please add at least one gallery item with a URL')
      return
    }

    setIsSaving(true)

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description?.trim() || null,
        category: formData.category?.trim() || 'general',
        isActive: Boolean(formData.isActive),
        items,
      }

      if (!editingGallery) {
        payload.type = type
      } else {
        payload.type = type
      }

      const response = editingGallery
        ? await galleryService.update(editingGallery.id, payload)
        : await galleryService.create(payload)

      toast.success(response.message || `Gallery ${editingGallery ? 'updated' : 'created'} successfully`)
      setIsModalOpen(false)
      setFilters((prev) => ({ ...prev }))
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (gallery) => {
    const shouldDelete = window.confirm(`Delete gallery "${gallery.title}"?`)
    if (!shouldDelete) {
      return
    }

    try {
      await galleryService.delete(gallery.id)
      toast.success('Gallery deleted successfully')
      setGalleries((prev) => prev.filter((item) => item.id !== gallery.id))
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
            <h1 className="text-3xl font-bold text-gray-900">{typeLabel}</h1>
            <p className="text-gray-600 mt-1">
              Manage {type} galleries and item URLs. Format per item: title|url|thumbnail|description
            </p>
          </div>
          <Button onClick={openCreateModal}>Create {type === 'video' ? 'Video' : 'Photo'} Gallery</Button>
        </div>

        <Card>
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-gray-600">Loading galleries...</p>
            ) : galleries.length === 0 ? (
              <p className="text-gray-600">No {type} galleries found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2 pr-4">Title</th>
                      <th className="py-2 pr-4">Category</th>
                      <th className="py-2 pr-4">Items</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Created</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {galleries.map((gallery) => (
                      <tr key={gallery.id} className="border-b">
                        <td className="py-3 pr-4">
                          <p className="font-medium text-gray-900">{gallery.title}</p>
                          <p className="text-xs text-gray-500">{truncate(gallery.description, 80)}</p>
                        </td>
                        <td className="py-3 pr-4">{gallery.category}</td>
                        <td className="py-3 pr-4">{(gallery.items || []).length}</td>
                        <td className="py-3 pr-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              gallery.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {gallery.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 pr-4">{formatDateTime(gallery.createdAt)}</td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <Button size="sm" variant="secondary" onClick={() => openEditModal(gallery)}>
                              Edit
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => handleDelete(gallery)}>
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
              <p className="text-sm text-gray-600">Total: {pagination.total || 0} galleries</p>
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
        title={editingGallery ? `Edit ${typeLabel}` : `Create ${typeLabel}`}
        size="xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Gallery title"
            required
          />

          <TextArea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Optional description"
          />

          <Input
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="general"
          />

          <TextArea
            label="Items (one per line: title|url|thumbnail|description)"
            name="itemsText"
            value={formData.itemsText}
            onChange={handleChange}
            rows={8}
            placeholder={
              type === 'video'
                ? 'Interview Ep 1|https://youtube.com/watch?v=xxx|https://img.youtube.com/.../0.jpg|Poet interview'
                : 'Historic Archive 1|https://example.com/photo.jpg|https://example.com/thumb.jpg|Old century document'
            }
            help="URL is required for each line. Title, thumbnail, and description are optional."
            required
          />

          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            Active gallery
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {editingGallery ? 'Update Gallery' : 'Create Gallery'}
            </Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  )
}

export default GalleriesList
