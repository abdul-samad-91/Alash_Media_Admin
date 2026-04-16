import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  banners: [],
  currentBanner: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
}

const bannerSlice = createSlice({
  name: 'banners',
  initialState,
  reducers: {
    fetchBannersStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchBannersSuccess: (state, action) => {
      state.isLoading = false
      state.banners = action.payload.data
      state.pagination = action.payload.pagination
    },
    fetchBannersFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
    setBannerPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    setCurrentBanner: (state, action) => {
      state.currentBanner = action.payload
    },
    addBanner: (state, action) => {
      state.banners.unshift(action.payload)
    },
    updateBanner: (state, action) => {
      const index = state.banners.findIndex(b => b._id === action.payload._id)
      if (index !== -1) {
        state.banners[index] = action.payload
      }
    },
    deleteBanner: (state, action) => {
      state.banners = state.banners.filter(b => b._id !== action.payload)
    },
  },
})

export const {
  fetchBannersStart,
  fetchBannersSuccess,
  fetchBannersFailure,
  setBannerPagination,
  setCurrentBanner,
  addBanner,
  updateBanner,
  deleteBanner,
} = bannerSlice.actions

export default bannerSlice.reducer
