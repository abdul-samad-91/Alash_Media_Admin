import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  categories: [],
  currentCategory: null,
  isLoading: false,
  error: null,
}

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    fetchCategoriesStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchCategoriesSuccess: (state, action) => {
      state.isLoading = false
      state.categories = action.payload
    },
    fetchCategoriesFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload
    },
    addCategory: (state, action) => {
      state.categories.push(action.payload)
    },
    updateCategory: (state, action) => {
      const index = state.categories.findIndex(c => c._id === action.payload._id)
      if (index !== -1) {
        state.categories[index] = action.payload
      }
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter(c => c._id !== action.payload)
    },
  },
})

export const {
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  setCurrentCategory,
  addCategory,
  updateCategory,
  deleteCategory,
} = categorySlice.actions

export default categorySlice.reducer
