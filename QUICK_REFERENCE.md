# Quick Reference Guide - Alash Media Admin Dashboard

## 🚀 Quick Start

### Setup
```bash
cd admin
npm install
npm run dev
```

**Access:** http://localhost:3000
**Backend:** http://localhost:5000/api

### Login Credentials
```
Email: admin@alashmedia.com
Password: admin123
```

---

## 📁 Project Structure at a Glance

```
src/
├── components/      # Reusable UI components
│   ├── common/      # Base components (Button, Modal, Forms)
│   ├── layout/      # Layout structure (Header, Sidebar)
│   └── forms/       # Domain-specific forms
├── pages/           # Page components (route views)
├── services/        # API services (axios wrapper)
├── store/           # Redux state management
│   └── slices/      # Redux domain slices
├── utils/           # Utility functions
├── hooks/           # Custom React hooks
└── styles/          # Global CSS
```

---

## 🎯 Common Tasks

### Add a New Page
1. Create file in `src/pages/`
2. Import MainLayout
3. Use useAuth() hook for protection
4. Export in App.jsx routes

### Create a New List Page
```jsx
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MainLayout from '../components/layout/MainLayout'
import { fetchBlogsStart, fetchBlogsSuccess } from '../store/slices/blogSlice'
import blogService from '../services/blogService'

export default function BlogsList() {
  const dispatch = useDispatch()
  const { blogs, isLoading, pagination } = useSelector(state => state.blogs)
  
  useEffect(() => {
    dispatch(fetchBlogsStart())
    blogService.getAll({ page: 1, limit: 10 })
      .then(res => dispatch(fetchBlogsSuccess(res)))
      .catch(err => console.error(err))
  }, [])
  
  return (
    <MainLayout>
      {/* Content here */}
    </MainLayout>
  )
}
```

### Add API Service Method
```javascript
// src/services/blogService.js
import apiClient from './apiClient'

const blogService = {
  getAll: (params) => apiClient.get('/blogs', { params }),
  getById: (id) => apiClient.get(`/blogs/${id}`),
  create: (data) => apiClient.post('/blogs', data),
  // ... more methods
}

export default blogService
```

### Create Redux Slice
```javascript
// src/store/slices/mySlice.js
import { createSlice } from '@reduxjs/toolkit'

const mySlice = createSlice({
  name: 'myDomain',
  initialState: {
    items: [],
    isLoading: false,
    error: null
  },
  reducers: {
    fetchStart: (state) => { state.isLoading = true },
    fetchSuccess: (state, action) => {
      state.isLoading = false
      state.items = action.payload
    },
    fetchError: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    }
  }
})

export const { fetchStart, fetchSuccess, fetchError } = mySlice.actions
export default mySlice.reducer
```

### Add New Route
```javascript
// src/App.jsx
<Route
  path="/your-page"
  element={isAuthenticated ? <YourPage /> : <Navigate to="/login" />}
/>
```

### Show Toast Notification
```javascript
import toast from 'react-hot-toast'

// Success
toast.success('Blog created successfully!')

// Error
toast.error('Failed to create blog')

// Loading (experimental)
toast.loading('Saving...')
```

### Use Protected Admin Route
```javascript
import { useRequireAdmin } from '../hooks/useAuth'

export default function AdminOnlyPage() {
  useRequireAdmin() // Redirects non-admins
  
  return (
    <MainLayout>
      Admin content
    </MainLayout>
  )
}
```

---

## 🎨 Component Examples

### Button Variants
```jsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Delete</Button>
<Button variant="success">Save</Button>
<Button variant="outline">Outline</Button>
<Button isLoading={true}>Saving...</Button>
```

### Form Elements
```jsx
import { Input, Select, TextArea, Card } from '../components/common/FormElements'

<Input
  label="Email"
  type="email"
  error="Invalid email"
  placeholder="user@example.com"
/>

<Select
  label="Category"
  options={[
    { value: '1', label: 'Tech' },
    { value: '2', label: 'Business' }
  ]}
/>

<TextArea
  label="Description"
  rows={4}
  maxLength={500}
/>

<Card className="p-6">
  Card content
</Card>
```

### Modal
```jsx
import { useState } from 'react'
import Modal from '../components/common/Modal'

export default function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open</button>
      <Modal
        isOpen={isOpen}
        title="Confirm Action"
        onClose={() => setIsOpen(false)}
      >
        <p>Are you sure?</p>
      </Modal>
    </>
  )
}
```

---

## 🔌 API Usage Patterns

### Get List with Pagination
```javascript
const params = {
  page: 1,
  limit: 10,
  search: 'keyword',
  status: 'published',
  category: 'categoryId'
}
blogService.getAll(params)
```

### Create Resource
```javascript
const data = {
  title: 'New Blog',
  content: 'Content here',
  author: 'authorId',
  category: 'categoryId',
  status: 'draft'
}
blogService.create(data)
```

### Upload Image
```javascript
const formData = new FormData()
formData.append('file', fileInput.files[0])
formData.append('type', 'blog_featured_image')

apiClient.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
```

---

## 🎯 Redux Patterns

### Dispatch Actions
```javascript
dispatch(fetchBlogsStart())
dispatch(fetchBlogsSuccess(data))
dispatch(fetchBlogsFailure(error))
dispatch(setBlogPagination({ page: 2 }))
```

### Select State
```javascript
const { blogs, isLoading, error } = useSelector(state => state.blogs)
```

### Update State
```javascript
dispatch(addBlog(newBlog))
dispatch(updateBlog(updatedBlog))
dispatch(deleteBlog(blogId))
```

---

## 🛣️ Available Routes (Implemented)

- `/login` - Login page
- `/dashboard` - Dashboard with stats
- `/blogs` - Blogs list (structure ready)

## 📋 Routes to Implement

- `/blogs/create`, `/blogs/:id/edit` - Blog form
- `/authors`, `/authors/create`, `/authors/:id/edit` - Authors
- `/categories` - Categories management
- `/banners`, `/banners/create` - Banners
- `/votes`, `/votes/create` - Polls
- `/gallery/photos`, `/gallery/videos` - Galleries
- `/media` - Media manager
- `/settings` - Settings (optional)
- `/users` - User management (optional)

---

## 🧰 Utility Functions

```javascript
import { 
  slugify,           // 'Hello World' → 'hello-world'
  truncate,          // Limit text length
  formatDate,        // Format date nicely
  formatDateTime,    // Format date + time
  getErrorMessage    // Extract error from responses
} from '../utils/helpers'
```

---

## 🌐 Environment Variables

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Alash Media Admin
```

---

## 📞 API Interceptors

### Auto-included in every request:
- JWT token from localStorage
- Content-Type: application/json

### Auto-handled errors:
- 401 → Redirect to login
- Network errors → Console log

### To add custom headers:
```javascript
// In apiClient.js interceptors
config.headers['Custom-Header'] = 'value'
```

---

## 🐛 Debugging

### Check Redux State
```javascript
// In browser console
localStorage.getItem('adminToken')

// View all state
// Use Redux DevTools browser extension
```

### Check API Calls
- Open DevTools → Network tab
- Filter by "api"
- Check request/response

### Common Issues

**"No routes matched"**
- Check route path matches file structure
- Verify import in App.jsx

**"Redux slice not found"**
- Add to store/index.js reducer
- Check slice export

**"API 401 Unauthorized"**
- Check token in localStorage
- Login again if expired

**"Styles not working"**
- Run `npm run build` to rebuild Tailwind
- Check class names are correct
- Clear browser cache

---

## 📚 Useful Links

- [Vite Docs](https://vitejs.dev)
- [React Docs](https://react.dev)
- [Redux Toolkit Docs](https://redux-toolkit.js.org)
- [Tailwind Docs](https://tailwindcss.com)
- [React Router Docs](https://reactrouter.com)
- [Axios Docs](https://axios-http.com)

---

## 💡 Pro Tips

1. Use Redux DevTools extension for time-travel debugging
2. Use Axios network interceptor for auth errors
3. Keep components under 300 lines (split if needed)
4. Use custom hooks for repeated logic
5. Extract reusable form components
6. Use React.memo for heavy components
7. Lazy load pages with React.lazy()
8. Test localStorage for debugging auth

---

**Last Updated:** 2024
**Version:** 1.0.0
