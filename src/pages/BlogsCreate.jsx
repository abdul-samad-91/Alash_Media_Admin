import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import MainLayout from '../components/layout/MainLayout'
import BlogForm from '../components/forms/BlogForm'
import blogService from '../services/blogService'
import categoryService from '../services/categoryService'
import authorService from '../services/authorService'
import { addBlog, updateBlog as updateBlogInStore } from '../store/slices/blogSlice'
import { fetchCategoriesStart, fetchCategoriesSuccess } from '../store/slices/categorySlice'
import { fetchAuthorsStart, fetchAuthorsSuccess } from '../store/slices/authorSlice'
import { isBase64DataUrl, dataUrlToFile, uploadImage } from '../utils/imageUpload'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../utils/helpers'

const BlogsCreate = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isEditMode = Boolean(id)
  const { categories } = useSelector((state) => state.categories)
  const { authors } = useSelector((state) => state.authors)
  const [initialData, setInitialData] = useState(null)
  const [isFetching, setIsFetching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const parseReadTime = (value) => {
    if (!value) return '5'
    const numeric = String(value).match(/\d+/)
    return numeric ? numeric[0] : '5'
  }

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

    if (isEditMode) {
      setIsFetching(true)
      blogService
        .getById(id)
        .then((response) => {
          const blog = response.data
          setInitialData({
            title: blog.title || '',
            contentType: blog.contentType || 'blog',
            subtitle: blog.subtitle || '',
            slug: blog.slug || '',
            shortDescription: blog.shortDescription || '',
            content: blog.fullContent || '',
            mainContentOne: blog.mainContent?.contentOne || '',
            mainContentTwo: blog.mainContent?.contentTwo || '',
            featuredImage: blog.image || '',
            imageCaption: blog.imageCaption || '',
            author: blog.authorId ? String(blog.authorId) : '',
            category: blog.category?.id ? String(blog.category.id) : '',
            status: blog.status || 'draft',
            readTime: parseReadTime(blog.readTime),
            tags: blog.tags || [],
            contentBlocks: blog.content || [],
            sections: blog.sections || [],
          })
        })
        .catch((error) => {
          toast.error(getErrorMessage(error))
          navigate('/blogs')
        })
        .finally(() => setIsFetching(false))
    }
  }, [dispatch, id, isEditMode, navigate])

  const handleSubmit = async (formData) => {
    setIsLoading(true)
    
    try {
      let featuredImageUrl = null;
      
      if (formData.featuredImage) {
        try {
          toast.loading('Uploading image...')
          featuredImageUrl = await uploadImage(formData.featuredImage, 'blog_featured_image')
          toast.dismiss()
        } catch (uploadError) {
          toast.dismiss()
          toast.error('Featured image upload failed. Please check Cloudinary/upload settings and try again.')
          return
        }
      }
      console.log(featuredImageUrl)

      const preparedData = {
        title: formData.title,
        contentType: formData.contentType,
        subtitle: formData.subtitle,
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

      const response = isEditMode
        ? await blogService.update(id, preparedData)
        : await blogService.create(preparedData)

      if (response.success) {
        const itemLabel = formData.contentType === 'news' ? 'News' : 'Blog'
        toast.success(response.message || (isEditMode ? `${itemLabel} updated successfully!` : `${itemLabel} created successfully!`))
        if (isEditMode) {
          dispatch(updateBlogInStore(response.data))
        } else {
          dispatch(addBlog(response.data))
        }
        navigate('/blogs')
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
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? `Edit ${initialData?.contentType === 'news' ? 'News' : 'Blog'}` : 'Create New Blog/News'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode ? 'Update existing article details.' : 'Write and publish a new blog post or news item'}
          </p>
        </div>

        {isEditMode && isFetching ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
            Loading blog details...
          </div>
        ) : (
          <BlogForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            initialData={initialData}
            categories={categories}
            authors={authors}
          />
        )}
      </div>
    </MainLayout>
  )
}

export default BlogsCreate
