import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import blogReducer from './slices/blogSlice'
import authorReducer from './slices/authorSlice'
import categoryReducer from './slices/categorySlice'
import bannerReducer from './slices/bannerSlice'
import voteReducer from './slices/voteSlice'
import galleryReducer from './slices/gallerySlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    blogs: blogReducer,
    authors: authorReducer,
    categories: categoryReducer,
    banners: bannerReducer,
    votes: voteReducer,
    galleries: galleryReducer,
  },
})

export default store
