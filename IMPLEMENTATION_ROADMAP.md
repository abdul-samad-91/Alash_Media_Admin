# Admin Dashboard Implementation Roadmap

## 🎯 What Has Been Created

### ✅ Core Infrastructure
- **Vite + React 18** Configuration
- **Redux Toolkit** with 7 domain slices
- **Tailwind CSS** styling setup
- **JWT Authentication** system
- **API Service Layer** with axios interceptors
- **Layout System** (Header, Sidebar, MainLayout)
- **Common Components** (Button, Modal, Input, Select, TextArea, Card)

### ✅ Pages Started
- **Login Page** - Fully functional
- **Dashboard** - Stats overview with quick links
- **BlogsList** - Structure ready

---

## 📋 Remaining Components to Build

### 1. Blogs Module (`/blogs`)
- [ ] **BlogsList.jsx** - List blogs with pagination & search
  - Features: Table with status, author, category columns
  - Actions: Edit, Delete, Preview, Publish/Draft toggle
  - Filters: By category, by status, date range
  - Pagination: 10 items per page
  
- [ ] **BlogsCreate.jsx** / **BlogsEdit.jsx** - Create/Edit blog
  - Rich text editor for content
  - Featured image upload
  - Author & category selection
  - Meta SEO fields
  - Auto slug generation
  - Preview functionality
  
- [ ] **BlogsView.jsx** - View single blog details

### 2. Authors Module (`/authors`)
- [ ] **AuthorsList.jsx** - List all authors
  - Table with name, email, bio columns
  - Photo thumbnail
  - Blog count
  - Actions: Edit, Delete, View Blogs
  - Search & pagination
  
- [ ] **AuthorsCreate.jsx** / **AuthorsEdit.jsx** - Create/Edit author
  - Name input
  - Photo upload
  - Short bio textarea
  - SocialLinks (optional)
  
- [ ] **AuthorBlogs.jsx** - View all blogs by author
  - Filterable list of author's blogs

### 3. Categories Module (`/categories`)
- [ ] **CategoriesList.jsx** - List categories
  - Tree view showing parent/child relationships
  - Actions: Add subcategory, Edit, Delete
  - Drag-and-drop reordering (optional)
  
- [ ] **CategoriesForm.jsx** - Create/Edit category
  - Name input
  - Description textarea
  - Parent category selector
  - Display order

### 4. Banners Module (`/banners`)
- [ ] **BannersList.jsx** - List all banners
  - Table with title, image, status columns
  - Thumbnail preview
  - Active/Inactive toggle
  - Actions: Edit, Delete
  - Pagination & search
  
- [ ] **BannersCreate.jsx** / **BannersEdit.jsx** - Create/Edit banner
  - Title input
  - Image upload
  - Link URL input (optional)
  - Position/Order selector
  - Start/End date picker
  - Active/Inactive toggle

### 5. Polls/Votes Module (`/votes`)
- [ ] **VotesList.jsx** - List all polls
  - Table with question, status, votes count columns
  - View results
  - Actions: Edit, Delete, Activate/Deactivate
  - Search & pagination
  
- [ ] **VotesCreate.jsx** / **VotesEdit.jsx** - Create/Edit poll
  - Question textarea
  - Dynamic options array (add/remove options)
  - Status toggle
  - Start/End date selection
  - Preview poll
  
- [ ] **VotesResults.jsx** - View poll results
  - Question display
  - Options with vote counts
  - Percentage bars
  - Total votes count
  - Export results option

### 6. Photo Gallery Module (`/gallery/photos`)
- [ ] **PhotoGallery.jsx** - List photos
  - Grid view of uploaded images
  - Bulk upload
  - Category filter
  - Delete image action
  - Search functionality
  
- [ ] **PhotoGalleryForm.jsx** - Upload photos
  - Drag-and-drop upload area
  - Multiple file selection
  - Image preview
  - Category assignment
  - Bulk metadata editor

### 7. Video Gallery Module (`/gallery/videos`)
- [ ] **VideoGallery.jsx** - List videos
  - Grid view with thumbnail
  - Video URL sources (YouTube, Vimeo)
  - Category filter
  - Delete video action
  - Search & pagination
  
- [ ] **VideoGalleryForm.jsx** - Add videos
  - Video URL input (YouTube/Vimeo)
  - Auto-fetch thumbnail
  - Title input
  - Description textarea
  - Category selection
  - Manual thumbnail upload (optional)

### 8. Media Manager Module (`/media`)
- [ ] **MediaManager.jsx** - Central media library
  - Grid/List view toggle
  - Upload new files
  - Search by filename
  - Filter by date
  - Delete unused media
  - Bulk operations (delete, move)
  - File info (size, upload date, usage)

### 9. Settings Module (Optional - `/settings`)
- [ ] **SettingsPage.jsx** - Site settings
  - General: Site title, logo, favicon
  - SEO: Default meta tags, keywords
  - Social: Links to social profiles
  - Contact: Email, phone, address
  - Features: Enable/disable modules

### 10. User Management (Optional - `/users`)
- [ ] **UsersList.jsx** - List admin users
  - Table with name, email, role columns
  - Status: Active/Inactive
  - Actions: Edit, Delete, Change Password
  
- [ ] **UsersCreate.jsx** / **UsersEdit.jsx** - Create/Edit user
  - Name input
  - Email input
  - Role selector (Admin, Editor, Viewer)
  - Status toggle

---

## 📁 Suggested Component Files to Create

```
src/pages/
├── blogs/
│   ├── BlogsList.jsx
│   ├── BlogsCreate.jsx
│   ├── BlogsEdit.jsx
│   ├── BlogsView.jsx
│   └── BlogsForm.jsx       (Reusable form component)
├── authors/
│   ├── AuthorsList.jsx
│   ├── AuthorsCreate.jsx
│   ├── AuthorsEdit.jsx
│   └── AuthorBlogs.jsx
├── categories/
│   ├── CategoriesList.jsx
│   ├── CategoriesForm.jsx
│   └── CategoryTree.jsx    (Tree view component)
├── banners/
│   ├── BannersList.jsx
│   ├── BannersCreate.jsx
│   ├── BannersEdit.jsx
│   └── BannersForm.jsx
├── votes/
│   ├── VotesList.jsx
│   ├── VotesCreate.jsx
│   ├── VotesEdit.jsx
│   ├── VotesForm.jsx
│   └── VotesResults.jsx
├── gallery/
│   ├── PhotoGallery.jsx
│   ├── PhotoGalleryForm.jsx
│   ├── VideoGallery.jsx
│   ├── VideoGalleryForm.jsx
│   ├── MediaManager.jsx
│   └── MediaUpload.jsx     (Reusable upload component)
├── settings/
│   └── SettingsPage.jsx
└── users/
    ├── UsersList.jsx
    ├── UsersCreate.jsx
    └── UsersEdit.jsx

src/components/
├── common/
│   ├── Pagination.jsx       (For list pages)
│   ├── SearchBar.jsx        (For filtering)
│   ├── DatePicker.jsx       (For date selection)
│   ├── RichEditor.jsx       (Wrapper for React Quill)
│   └── ImageUpload.jsx      (Reusable image upload)
└── forms/
    ├── BlogForm.jsx
    ├── AuthorForm.jsx
    ├── CategoryForm.jsx
    ├── BannerForm.jsx
    ├── VoteForm.jsx
    └── UserForm.jsx
```

---

## 🚀 Getting Started

### 1. Start Development Server
```bash
npm run dev
```
Access at: `http://localhost:3000`

### 2. Login
- Email: `admin@alashmedia.com`
- Password: `admin123`

### 3. Build Priority
Recommended order to build pages:
1. BlogsList & BlogsForm (Core feature)
2. AuthorsList & AuthorsForm
3. CategoriesList & CategoryForm
4. BannersList & BannersForm
5. VotesList & VotesForm
6. Gallery modules
7. Settings & Users (Optional)

---

## 🔧 Common Patterns to Use

### Fetch Data Pattern
```javascript
useEffect(() => {
  dispatch(fetchBlogsStart())
  blogService
    .getAll(params)
    .then(response => dispatch(fetchBlogsSuccess(response)))
    .catch(error => dispatch(fetchBlogsFailure(error)))
}, [deps])
```

### Form Pattern
```javascript
const [formData, setFormData] = useState(initialState)
const [errors, setErrors] = useState({})
const [isLoading, setIsLoading] = useState(false)

const handleSubmit = async (e) => {
  // Validation
  // API call
  // Success/Error handling
}
```

### List Pattern
```javascript
// Fetch on component mount
// Handle pagination changes
// Handle search/filter
// Render table with actions
// Display loading/empty states
```

---

## 📐 API Endpoints Reference

See `src/services/` for all available API methods.

Key services:
- `authService` - Authentication
- `blogService` - Blog CRUD
- `authorService` - Author CRUD
- `categoryService` - Category CRUD
- `bannerService` - Banner CRUD
- `voteService` - Vote/Poll CRUD
- `galleryService` - Gallery CRUD

---

## 🎨 Styling Guide

All pages use Tailwind CSS. Reference components:
- Button: `src/components/common/Button.jsx`
- Card: `src/components/common/FormElements.jsx`
- Input/Select/TextArea: `src/components/common/FormElements.jsx`
- Modal: `src/components/common/Modal.jsx`

---

## 🧪 Testing

Components should handle:
- Loading states
- Error states  
- Empty states
- Success messages
- Validation errors

Use `react-hot-toast` for notifications:
```javascript
import toast from 'react-hot-toast'
toast.success('Created successfully')
toast.error('Error message')
```

---

## 📝 Notes

- All timestamps use `date-fns` for formatting
- Use `slugify` utility for auto-slug generation
- Images are uploaded to backend (implement multipart/form-data)
- Pagination uses `limit=10` by default
- Environment variables in `.env`

---

**Current Status:** Framework complete, ready for page component development
**Estimated Time:** ~2-3 weeks for full implementation
