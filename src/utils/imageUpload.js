import apiClient from '../services/apiClient'

/**
 * Upload image and get URL
 * @param {File} file - Image file to upload
 * @param {string} type - Optional type/category of image
 * @returns {Promise<string>} Image URL from backend
 */
export const uploadImage = async (file, type = 'blog_featured_image') => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type)

  try {
    const response = await apiClient.post('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data?.url || response.data?.data?.url
  } catch (error) {
    throw new Error(`Image upload failed: ${error.message}`)
  }
}

/**
 * Convert base64/data URL to File object
 * @param {string} dataUrl - Base64 data URL
 * @param {string} filename - Name for the file
 * @returns {File} File object
 */
export const dataUrlToFile = (dataUrl, filename = 'image.png') => {
  const arr = dataUrl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  const n = bstr.length
  const u8arr = new Uint8Array(n)
  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i)
  }
  return new File([u8arr], filename, { type: mime })
}

/**
 * Check if string is base64 data URL
 * @param {string} str - String to check
 * @returns {boolean}
 */
export const isBase64DataUrl = (str) => {
  if (typeof str !== 'string') return false
  return str.startsWith('data:') && str.includes('base64,')
}

export default {
  uploadImage,
  dataUrlToFile,
  isBase64DataUrl,
}
