import React, { useState, useEffect, useRef } from 'react'
import { Input, Select, TextArea, Card } from '../common/FormElements'
import Button from '../common/Button'
import Modal from '../common/Modal'
import { FiPlus, FiTrash2, FiImage } from 'react-icons/fi'
import { slugify } from '../../utils/helpers'
import toast from 'react-hot-toast'

const BlogForm = ({ onSubmit, initialData = null, isLoading = false, categories = [], authors = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    slug: '',
    shortDescription: '',
    content: '',
    mainContentOne: '',
    mainContentTwo: '',
    featuredImage: '',
    imageCaption: '',
    author: '',
    category: '',
    status: 'draft',
    readTime: '5',
    tags: [],
    contentBlocks: [],
    sections: [],
  })

  const [preview, setPreview] = useState(null)
  const [showContentBlockModal, setShowContentBlockModal] = useState(false)
  const [showSectionModal, setShowSectionModal] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const fileInputRef = useRef(null)

  const [currentBlock, setCurrentBlock] = useState({ heading: '', text: '' })
  const [currentSection, setCurrentSection] = useState({ heading: '', text: '' })
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
      setPreview(initialData.featuredImage)
    }
  }, [initialData])

  // Auto-generate slug
  useEffect(() => {
    if (formData.title) {
      setFormData((prev) => ({
        ...prev,
        slug: slugify(prev.title),
      }))
    }
  }, [formData.title])

  // Calculate read time
  useEffect(() => {
    const wordCount = (formData.content || '').split(/\s+/).length
    const readTime = Math.ceil(wordCount / 200) || 1
    setFormData((prev) => ({
      ...prev,
      readTime: readTime.toString(),
    }))
  }, [formData.content])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target.result)
        setFormData((prev) => ({
          ...prev,
          featuredImage: file,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const addTag = () => {
    if (tagInput.trim()) {
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }))
        setTagInput('')
      } else {
        toast.error('Tag already exists')
      }
    }
  }

  const removeTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }))
  }

  const addContentBlock = () => {
    if (currentBlock.heading && currentBlock.text) {
      setFormData((prev) => ({
        ...prev,
        contentBlocks: [
          ...prev.contentBlocks,
          { id: Date.now(), ...currentBlock },
        ],
      }))
      setCurrentBlock({ heading: '', text: '' })
      setShowContentBlockModal(false)
      toast.success('Content block added')
    } else {
      toast.error('Fill all fields')
    }
  }

  const removeContentBlock = (index) => {
    setFormData((prev) => ({
      ...prev,
      contentBlocks: prev.contentBlocks.filter((_, i) => i !== index),
    }))
  }

  const addSection = () => {
    if (currentSection.heading && currentSection.text) {
      setFormData((prev) => ({
        ...prev,
        sections: [...prev.sections, { id: Date.now(), ...currentSection }],
      }))
      setCurrentSection({ heading: '', text: '' })
      setShowSectionModal(false)
      toast.success('Section added')
    } else {
      toast.error('Fill all fields')
    }
  }

  const removeSection = (index) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.shortDescription.trim())
      newErrors.shortDescription = 'Short description is required'
    if (!formData.content.trim()) newErrors.content = 'Content is required'
    if (!formData.author) newErrors.author = 'Author is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.featuredImage) newErrors.featuredImage = 'Featured image is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <Card className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

          <Input
            label="Blog Title *"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter blog title"
            error={errors.title}
            required
          />

          <Input
            label="Slug *"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="Auto-generated from title"
            disabled
            help="This is automatically generated from the title"
          />

          <Input
            label="Subtitle"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder="Optional subtitle"
          />

          <TextArea
            label="Short Description *"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            placeholder="Brief description for preview (SEO)"
            rows={3}
            error={errors.shortDescription}
            maxLength={160}
            help={`${formData.shortDescription.length}/160 characters`}
            required
          />
        </Card>

        {/* Content */}
        <Card className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Content</h3>

          <TextArea
            label="Main Content *"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your blog content here..."
            rows={10}
            error={errors.content}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <TextArea
              label="Main Content - Part One"
              name="mainContentOne"
              value={formData.mainContentOne}
              onChange={handleChange}
              placeholder="Additional content section 1"
              rows={4}
            />
            <TextArea
              label="Main Content - Part Two"
              name="mainContentTwo"
              value={formData.mainContentTwo}
              onChange={handleChange}
              placeholder="Additional content section 2"
              rows={4}
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>📖 Read time: ~{formData.readTime} min</span>
          </div>
        </Card>

        {/* Featured Image */}
        <Card className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Featured Image</h3>

          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <div className="space-y-2">
                <img
                  src={preview}
                  alt="Featured"
                  className="w-full max-h-64 object-cover rounded"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                >
                  Change Image
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <FiImage className="mx-auto text-gray-400" size={40} />
                <p className="text-gray-600 font-medium">Click to upload featured image</p>
                <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {errors.featuredImage && (
            <p className="text-red-500 text-sm">{errors.featuredImage}</p>
          )}

          <Input
            label="Image Caption"
            name="imageCaption"
            value={formData.imageCaption}
            onChange={handleChange}
            placeholder="Caption for the featured image"
          />
        </Card>

        {/* Metadata */}
        <Card className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Metadata</h3>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Author *"
              name="author"
              value={formData.author}
              onChange={handleChange}
              options={[
                { value: '', label: 'Select Author' },
                ...authors.map((a) => ({
                  value: a._id || a.id,
                  label: a.name,
                })),
              ]}
              error={errors.author}
              required
            />

            <Select
              label="Category *"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={[
                { value: '', label: 'Select Category' },
                ...categories.map((c) => ({
                  value: c._id || c.id,
                  label: c.name,
                })),
              ]}
              error={errors.category}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'published', label: 'Published' },
              ]}
            />

            <Input
              label="Read Time (minutes)"
              name="readTime"
              type="number"
              value={formData.readTime}
              onChange={handleChange}
              disabled
            />
          </div>
        </Card>

        {/* Tags */}
        <Card className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Tags</h3>

          <div className="flex gap-2">
            <Input
              placeholder="Add a tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button type="button" onClick={addTag} size="sm">
              <FiPlus /> Add
            </Button>
          </div>

          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <div
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Content Blocks */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Content Blocks</h3>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowContentBlockModal(true)}
            >
              <FiPlus /> Add Block
            </Button>
          </div>

          {formData.contentBlocks.length > 0 && (
            <div className="space-y-2">
              {formData.contentBlocks.map((block, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg flex items-start justify-between"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{block.heading}</p>
                    <p className="text-gray-600 text-sm line-clamp-2">{block.text}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeContentBlock(index)}
                    className="text-red-600 hover:text-red-900 ml-2"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Sections */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Sections</h3>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowSectionModal(true)}
            >
              <FiPlus /> Add Section
            </Button>
          </div>

          {formData.sections.length > 0 && (
            <div className="space-y-2">
              {formData.sections.map((section, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg flex items-start justify-between"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{section.heading}</p>
                    <p className="text-gray-600 text-sm line-clamp-2">{section.text}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSection(index)}
                    className="text-red-600 hover:text-red-900 ml-2"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Actions */}
        <Card className="flex gap-3 justify-end">
          <Button type="button" variant="secondary" onClick={() => setShowPreview(true)}>
            Preview
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {initialData ? 'Update Blog' : 'Create Blog'}
          </Button>
        </Card>
      </form>

      {/* Modals */}
      <Modal
        isOpen={showContentBlockModal}
        title="Add Content Block"
        onClose={() => {
          setShowContentBlockModal(false)
          setCurrentBlock({ heading: '', text: '' })
        }}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Heading"
            value={currentBlock.heading}
            onChange={(e) => setCurrentBlock({ ...currentBlock, heading: e.target.value })}
            placeholder="Block heading"
          />
          <TextArea
            label="Text"
            value={currentBlock.text}
            onChange={(e) => setCurrentBlock({ ...currentBlock, text: e.target.value })}
            placeholder="Block content"
            rows={6}
          />
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowContentBlockModal(false)
                setCurrentBlock({ heading: '', text: '' })
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={addContentBlock}>
              Add Block
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showSectionModal}
        title="Add Section"
        onClose={() => {
          setShowSectionModal(false)
          setCurrentSection({ heading: '', text: '' })
        }}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Heading"
            value={currentSection.heading}
            onChange={(e) => setCurrentSection({ ...currentSection, heading: e.target.value })}
            placeholder="Section heading"
          />
          <TextArea
            label="Text"
            value={currentSection.text}
            onChange={(e) => setCurrentSection({ ...currentSection, text: e.target.value })}
            placeholder="Section content"
            rows={6}
          />
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowSectionModal(false)
                setCurrentSection({ heading: '', text: '' })
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={addSection}>
              Add Section
            </Button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreview}
        title="Blog Preview"
        onClose={() => setShowPreview(false)}
        size="2xl"
      >
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {preview && <img src={preview} alt="Preview" className="w-full rounded-lg" />}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{formData.title}</h1>
            {formData.subtitle && <p className="text-lg text-gray-600 mt-2">{formData.subtitle}</p>}
          </div>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>By {authors.find((a) => a._id === formData.author || a.id === formData.author)?.name}</span>
            <span>📖 {formData.readTime} min read</span>
          </div>
          <p className="text-gray-700 leading-relaxed">{formData.shortDescription}</p>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, i) => (
                <span key={i} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default BlogForm
