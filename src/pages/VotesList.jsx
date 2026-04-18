import React, { useEffect, useMemo, useState } from 'react'
import MainLayout from '../components/layout/MainLayout'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import { Card, Input, TextArea } from '../components/common/FormElements'
import voteService from '../services/voteService'
import toast from 'react-hot-toast'
import { formatDateTime, getErrorMessage, truncate } from '../utils/helpers'

const emptyVote = {
  title: '',
  description: '',
  image: '',
  startDate: '',
  endDate: '',
  isActive: true,
  isExpired: false,
  optionsText: '',
}

const toDateTimeInput = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 16)
}

const parseOptions = (text) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

const VotesList = ({ mode = 'list' }) => {
  const [votes, setVotes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [pagination, setPagination] = useState({ total: 0, pages: 1, currentPage: 1 })
  const [filters, setFilters] = useState({ page: 1, limit: 10, activeOnly: false })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVote, setEditingVote] = useState(null)
  const [formData, setFormData] = useState(emptyVote)

  useEffect(() => {
    if (mode === 'create') {
      setEditingVote(null)
      setFormData(emptyVote)
      setIsModalOpen(true)
    }
  }, [mode])

  useEffect(() => {
    const fetchVotes = async () => {
      setIsLoading(true)
      try {
        const response = await voteService.getAll(filters)
        setVotes(response.data || [])
        setPagination(response.pagination || { total: 0, pages: 1, currentPage: 1 })
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setIsLoading(false)
      }
    }

    fetchVotes()
  }, [filters])

  const totalVotesCount = useMemo(
    () => votes.reduce((sum, vote) => sum + (vote.options || []).reduce((acc, option) => acc + (option.votes || 0), 0), 0),
    [votes],
  )

  const openCreateModal = () => {
    setEditingVote(null)
    setFormData(emptyVote)
    setIsModalOpen(true)
  }

  const openEditModal = (vote) => {
    setEditingVote(vote)
    setFormData({
      title: vote.title || '',
      description: vote.description || '',
      image: vote.image || '',
      startDate: toDateTimeInput(vote.startDate),
      endDate: toDateTimeInput(vote.endDate),
      isActive: vote.isActive !== false,
      isExpired: vote.isExpired === true,
      optionsText: (vote.options || []).map((option) => option.text).join('\n'),
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

    const options = parseOptions(formData.optionsText)
    if (!formData.title.trim()) {
      toast.error('Vote title is required')
      return
    }

    if (options.length < 2) {
      toast.error('Please provide at least 2 options')
      return
    }

    setIsSaving(true)

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description?.trim() || null,
        image: formData.image?.trim() || null,
        isActive: Boolean(formData.isActive),
        isExpired: Boolean(formData.isExpired),
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        options,
      }

      const response = editingVote
        ? await voteService.update(editingVote.id, payload)
        : await voteService.create(payload)

      toast.success(response.message || `Vote ${editingVote ? 'updated' : 'created'} successfully`)
      setIsModalOpen(false)
      setFilters((prev) => ({ ...prev }))
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (vote) => {
    const shouldDelete = window.confirm(`Delete vote "${vote.title}"?`)
    if (!shouldDelete) {
      return
    }

    try {
      await voteService.delete(vote.id)
      toast.success('Vote deleted successfully')
      setVotes((prev) => prev.filter((item) => item.id !== vote.id))
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
            <h1 className="text-3xl font-bold text-gray-900">Polls & Votes</h1>
            <p className="text-gray-600 mt-1">Manage homepage vote widgets and option sets.</p>
          </div>
          <Button onClick={openCreateModal}>Create Vote</Button>
        </div>

        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={filters.activeOnly}
                  onChange={(e) => setFilters((prev) => ({ ...prev, activeOnly: e.target.checked, page: 1 }))}
                />
                Active only
              </label>
              <p className="text-sm text-gray-600">Total cast votes in current page: {totalVotesCount}</p>
            </div>

            {isLoading ? (
              <p className="text-gray-600">Loading votes...</p>
            ) : votes.length === 0 ? (
              <p className="text-gray-600">No votes found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2 pr-4">Title</th>
                      <th className="py-2 pr-4">Options</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Start</th>
                      <th className="py-2 pr-4">End</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {votes.map((vote) => (
                      <tr key={vote.id} className="border-b">
                        <td className="py-3 pr-4">
                          <p className="font-medium text-gray-900">{vote.title}</p>
                          <p className="text-xs text-gray-500">{truncate(vote.description, 80)}</p>
                        </td>
                        <td className="py-3 pr-4">
                          <p>{(vote.options || []).length} options</p>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex gap-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                vote.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                              }`}
                            >
                              {vote.isActive ? 'Active' : 'Inactive'}
                            </span>
                            {vote.isExpired && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                Expired
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 pr-4">{formatDateTime(vote.startDate)}</td>
                        <td className="py-3 pr-4">{formatDateTime(vote.endDate) || '-'}</td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <Button size="sm" variant="secondary" onClick={() => openEditModal(vote)}>
                              Edit
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => handleDelete(vote)}>
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
              <p className="text-sm text-gray-600">Total: {pagination.total || 0} votes</p>
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
        title={editingVote ? 'Edit Vote' : 'Create Vote'}
        size="xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter vote title"
            required
          />

          <TextArea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Optional vote description"
          />

          <Input
            label="Image URL"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://..."
          />

          <TextArea
            label="Options (one per line)"
            name="optionsText"
            value={formData.optionsText}
            onChange={handleChange}
            rows={5}
            placeholder={'Option 1\nOption 2\nOption 3'}
            required
          />

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

          <div className="flex gap-4">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              Active vote
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="isExpired"
                checked={formData.isExpired}
                onChange={handleChange}
              />
              Mark as expired
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {editingVote ? 'Update Vote' : 'Create Vote'}
            </Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  )
}

export default VotesList
