import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  blogs: [],
  currentBlog: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
}

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    fetchBlogsStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchBlogsSuccess: (state, action) => {
      state.isLoading = false
      state.blogs = action.payload.data
      state.pagination = action.payload.pagination
    },
    fetchBlogsFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
    setBlogPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    setCurrentBlog: (state, action) => {
      state.currentBlog = action.payload
    },
    addBlog: (state, action) => {
      state.blogs.unshift(action.payload)
    },
    updateBlog: (state, action) => {
      const index = state.blogs.findIndex((b) => b.id === action.payload.id)
      if (index !== -1) {
        state.blogs[index] = action.payload
      }
    },
    deleteBlog: (state, action) => {
      state.blogs = state.blogs.filter((b) => b.id !== action.payload)
    },
  },
})

export const {
  fetchBlogsStart,
  fetchBlogsSuccess,
  fetchBlogsFailure,
  setBlogPagination,
  setCurrentBlog,
  addBlog,
  updateBlog,
  deleteBlog,
} = blogSlice.actions

export default blogSlice.reducer
