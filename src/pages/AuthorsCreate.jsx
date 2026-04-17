import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import MainLayout from '../components/layout/MainLayout'
import AuthorForm from '../components/forms/AuthorForm'
import authorService from '../services/authorService'
import { addAuthor } from '../store/slices/authorSlice'
import { isBase64DataUrl, dataUrlToFile, uploadImage } from '../utils/imageUpload'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../utils/helpers'

const AuthorsCreate = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (formData) => {
    setIsLoading(true)
    
    try {
      let photoUrl = formData.photo

      // If image is base64, try to upload it
      if (formData.photo && isBase64DataUrl(formData.photo)) {
        try {
          toast.loading('Uploading photo...')
          const file = dataUrlToFile(formData.photo, `author-${Date.now()}.png`)
          photoUrl = await uploadImage(file, 'author_photo')
          toast.dismiss()
        } catch (uploadError) {
          console.warn('Image upload failed, sending as base64:', uploadError)
          // Continue with base64 if upload fails
          toast.dismiss()
        }
      }

      const preparedData = {
        name: formData.name,
        slug: formData.slug,
        photo: photoUrl || null,
        shortBio: formData.shortBio,
        isActive: formData.isActive,
      }

      const response = await authorService.create(preparedData)
      console.log('Create author response:', response)

      if (response.success) {
        toast.success(response.message || 'Author created successfully!')
        dispatch(addAuthor(response.data))
        
        // Navigate to authors list
        setTimeout(() => {
          navigate('/authors')
        }, 500)
      } else {
        toast.error(response.message || 'Failed to create author')
      }
    } catch (error) {
      console.error('Error creating author:', error)
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage || 'Failed to create author')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Author</h1>
          <p className="text-gray-600 mt-1">Add a new author or contributor to your platform.</p>
        </div>

        <AuthorForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </MainLayout>
  )
}

export default AuthorsCreate
