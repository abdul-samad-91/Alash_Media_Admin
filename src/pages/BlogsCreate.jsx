import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import MainLayout from '../components/layout/MainLayout'
import BlogForm from '../components/forms/BlogForm'
import blogService from '../services/blogService'
import categoryService from '../services/categoryService'
import authorService from '../services/authorService'
import { addBlog } from '../store/slices/blogSlice'
import { fetchCategoriesStart, fetchCategoriesSuccess } from '../store/slices/categorySlice'
import { fetchAuthorsStart, fetchAuthorsSuccess } from '../store/slices/authorSlice'
import { isBase64DataUrl, dataUrlToFile, uploadImage } from '../utils/imageUpload'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../utils/helpers'

const BlogsCreate = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { categories } = useSelector((state) => state.categories)
  const { authors } = useSelector((state) => state.authors)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Fetch categories
    dispatch(fetchCategoriesStart())
    categoryService
      .getAll()
      .then((response) => {
        dispatch(fetchCategoriesSuccess(response.data || []))
      })
      .catch((error) => console.error('Failed to fetch categories:', error))

    // Fetch authors
    dispatch(fetchAuthorsStart())
    authorService
      .getAll({ limit: 100 })
      .then((response) => {
        dispatch(fetchAuthorsSuccess({
          data: response.data || [],
          pagination: response.pagination || {},
        }))
      })
      .catch((error) => console.error('Failed to fetch authors:', error))
  }, [dispatch])

  const handleSubmit = async (formData) => {
    setIsLoading(true)
    
    try {
      let featuredImageUrl = formData.featuredImage

      // If image is base64, try to upload it
      if (isBase64DataUrl(formData.featuredImage)) {
        try {
          toast.loading('Uploading image...')
          const file = dataUrlToFile(formData.featuredImage, `featured-${Date.now()}.png`)
          featuredImageUrl = await uploadImage(file, 'blog_featured_image')
          toast.dismiss()
        } catch (uploadError) {
          console.warn('Image upload failed, sending as base64:', uploadError)
          // Continue with base64 if upload fails
          toast.dismiss()
        }
      }

      const preparedData = {
        title: formData.title,
        subtitle: formData.subtitle,
        slug: formData.slug,
        shortDescription: formData.shortDescription,
        content: formData.content,
        mainContent: {
          contentOne: formData.mainContentOne,
          contentTwo: formData.mainContentTwo,
        },
        featuredImage: featuredImageUrl,
        imageCaption: formData.imageCaption,
        author: formData.author,
        category: formData.category,
        status: formData.status,
        readTime: formData.readTime,
        tags: formData.tags,
        contentBlocks: formData.contentBlocks,
        sections: formData.sections,
      }

      const response = await blogService.create(preparedData)
      console.log('Create blog response:', response)

      if (response.success) {
        toast.success(response.message || 'Blog created successfully!')
        dispatch(addBlog(response.data))
        
        // Navigate to blogs list
        setTimeout(() => {
          navigate('/blogs', { 
            state: { tab: formData.status === 'published' ? 'published' : 'draft' } 
          })
        }, 500)
      }
    } catch (error) {
      const message = getErrorMessage(error)
      toast.error(message)
      console.error('Create blog error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Blog</h1>
          <p className="text-gray-600 mt-1">Write and publish a new article</p>
        </div>

        <BlogForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          categories={categories}
          authors={authors}
        />
      </div>
    </MainLayout>
  )
}

export default BlogsCreate
