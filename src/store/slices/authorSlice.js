import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  authors: [],
  currentAuthor: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
}

const authorSlice = createSlice({
  name: 'authors',
  initialState,
  reducers: {
    fetchAuthorsStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchAuthorsSuccess: (state, action) => {
      state.isLoading = false
      state.authors = action.payload.data
      state.pagination = action.payload.pagination
    },
    fetchAuthorsFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
    setAuthorPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    setCurrentAuthor: (state, action) => {
      state.currentAuthor = action.payload
    },
    addAuthor: (state, action) => {
      state.authors.unshift(action.payload)
    },
    updateAuthor: (state, action) => {
      const index = state.authors.findIndex(a => a._id === action.payload._id)
      if (index !== -1) {
        state.authors[index] = action.payload
      }
    },
    deleteAuthor: (state, action) => {
      state.authors = state.authors.filter(a => a._id !== action.payload)
    },
  },
})

export const {
  fetchAuthorsStart,
  fetchAuthorsSuccess,
  fetchAuthorsFailure,
  setAuthorPagination,
  setCurrentAuthor,
  addAuthor,
  updateAuthor,
  deleteAuthor,
} = authorSlice.actions

export default authorSlice.reducer
