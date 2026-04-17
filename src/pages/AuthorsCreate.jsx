import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import MainLayout from '../components/layout/MainLayout'
import AuthorForm from '../components/forms/AuthorForm'
import authorService from '../services/authorService'
import { addAuthor, updateAuthor as updateAuthorInStore } from '../store/slices/authorSlice'
import { isBase64DataUrl, dataUrlToFile, uploadImage } from '../utils/imageUpload'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../utils/helpers'

const AuthorsCreate = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isEditMode = Boolean(id)
  const [initialData, setInitialData] = useState(null)
  const [isFetching, setIsFetching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isEditMode) {
      return
    }

    setIsFetching(true)
    authorService
      .getById(id)
      .then((response) => {
        const author = response.data
        setInitialData({
          name: author.name || '',
          slug: author.slug || '',
          photo: author.photo || '',
          shortBio: author.shortBio || '',
          isActive: author.isActive !== false,
        })
      })
      .catch((error) => {
        toast.error(getErrorMessage(error))
        navigate('/authors')
      })
      .finally(() => setIsFetching(false))
  }, [id, isEditMode, navigate])

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
          toast.dismiss()
          toast.error('Photo upload failed. Please check Cloudinary/upload settings and try again.')
          return
        }
      }

      const preparedData = {
        name: formData.name,
        photo: photoUrl || null,
        shortBio: formData.shortBio,
        isActive: formData.isActive,
      }

      const response = isEditMode
        ? await authorService.update(id, preparedData)
        : await authorService.create(preparedData)

      if (response.success) {
        toast.success(response.message || (isEditMode ? 'Author updated successfully!' : 'Author created successfully!'))
        if (isEditMode) {
          dispatch(updateAuthorInStore(response.data))
        } else {
          dispatch(addAuthor(response.data))
        }
        navigate('/authors')
      } else {
        toast.error(response.message || `Failed to ${isEditMode ? 'update' : 'create'} author`)
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
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Edit Author' : 'Create New Author'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode ? 'Update poet / old century author information.' : 'Add a new author or contributor to your platform.'}
          </p>
        </div>

        {isEditMode && isFetching ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
            Loading author details...
          </div>
        ) : (
          <AuthorForm onSubmit={handleSubmit} initialData={initialData} isLoading={isLoading} />
        )}
      </div>
    </MainLayout>
  )
}

export default AuthorsCreate
