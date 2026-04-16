import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  galleries: [],
  currentGallery: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
}

const gallerySlice = createSlice({
  name: 'galleries',
  initialState,
  reducers: {
    fetchGalleriesStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchGalleriesSuccess: (state, action) => {
      state.isLoading = false
      state.galleries = action.payload.data
      state.pagination = action.payload.pagination
    },
    fetchGalleriesFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
    setGalleryPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    setCurrentGallery: (state, action) => {
      state.currentGallery = action.payload
    },
    addGallery: (state, action) => {
      state.galleries.unshift(action.payload)
    },
    updateGallery: (state, action) => {
      const index = state.galleries.findIndex(g => g._id === action.payload._id)
      if (index !== -1) {
        state.galleries[index] = action.payload
      }
    },
    deleteGallery: (state, action) => {
      state.galleries = state.galleries.filter(g => g._id !== action.payload)
    },
  },
})

export const {
  fetchGalleriesStart,
  fetchGalleriesSuccess,
  fetchGalleriesFailure,
  setGalleryPagination,
  setCurrentGallery,
  addGallery,
  updateGallery,
  deleteGallery,
} = gallerySlice.actions

export default gallerySlice.reducer
