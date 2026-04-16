# Alash Media Admin Dashboard

A modern, scalable admin dashboard for managing Alash Media CMS content. Built with React, Vite, Tailwind CSS, and Redux Toolkit.

## Features

### 🔐 Authentication
- Admin login/logout
- JWT-based authentication
- Role-based access control
- Password reset functionality

### 📊 Dashboard
- Content overview with statistics
- Total blogs, published, drafts
- Authors, categories, banners, polls count
- Quick access links

### 📝 Blogs & News Management
- Create, read, update, delete blogs
- Rich text editor for content
- Featured image upload
- Draft/published status management
- Category and author selection
- SEO fields (meta title, description)
- Search and pagination

### 👤 Authors Management
- Create author profiles
- Upload author photos
- Short biography
- View all blogs by author
- Search and list management

### 📂 Categories Management
- Create categories and subcategories
- Category hierarchy support
- Category tree view
- CRUD operations

### 🖼️ Banner Management
- Upload banner images
- Set banner position
- Active/inactive toggle
- Start/end date scheduling

### 🗳️ Polls & Voting System
- Create poll questions
- Add multiple voting options
- View live vote count
- Activate/deactivate polls

### 🖼️ Photo Gallery
- Upload multiple images
- Bulk upload support
- Category organization
- Image management

### 🎥 Video Gallery
- Add videos via URL (YouTube, Vimeo)
- Auto-thumbnail generation
- Video categorization
- Easy management

### 📁 Media Manager
- Centralized upload system
- Reusable media library
- Search functionality
- Unused media deletion

## Tech Stack

- **React 18** - UI library
- **Vite 5** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS
- **Redux Toolkit** - State management
- **React Router v6** - Routing
- **Axios** - HTTP client
- **React Quill** - Rich text editor
- **React Hot Toast** - Toast notifications
- **React Icons** - Icon library

## Project Structure

```
admin/
├── src/
│   ├── components/
│   │   ├── common/             # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── FormElements.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── ...
│   │   ├── layout/             # Layout components
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── MainLayout.jsx
│   │   └── forms/              # Form components
│   ├── pages/                  # Page components
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── BlogsList.jsx
│   │   ├── AuthorsList.jsx
│   │   └── ...
│   ├── store/                  # Redux store
│   │   ├── index.js
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── blogSlice.js
│   │       ├── authorSlice.js
│   │       └── ...
│   ├── services/               # API services
│   │   ├── apiClient.js
│   │   ├── authService.js
│   │   ├── blogService.js
│   │   └── ...
│   ├── utils/                  # Utility functions
│   │   └── helpers.js
│   ├── hooks/                  # Custom React hooks
│   │   └── useAuth.js
│   ├── styles/                 # Global styles
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── public/                     # Static assets
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create or update `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Alash Media Admin
```

### 3. Start Development Server

```bash
npm run dev
```

The admin dashboard will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

### 5. Preview Production Build

```bash
npm run preview
```

## Backend API Integration

The admin dashboard connects to the Alash Media backend API. Ensure the backend is running on `http://localhost:5000`.

### Backend URL
```
http://localhost:5000/api
```

### Authentication Headers

All protected endpoints require JWT token:

```
Authorization: Bearer <your_token_here>
```

## Features Overview

### Dashboard Statistics
- Real-time content count
- Recent activity display
- Quick navigation links

### Blog Management
- Full CRUD operations
- Rich text editor (React Quill)
- Image upload support
- Auto-slug generation
- Draft/publish workflow
- Search and filter

### Author Management
- CRUD operations
- Photo management
- Bio editing
- Author-blog relationship

### Category Management
- Hierarchical structure
- Parent/sub-categories
- CRUD operations

### Banner Management
- Image upload
- Schedule management
- Active/inactive toggle
- Position control

### Poll System
- Create questions
- Manage options
- View results
- Schedule polls

### Gallery Management
- Photo gallery with bulk upload
- Video gallery with URL support
- Category organization
- Media library

## Authentication Flow

1. User enters credentials on login page
2. Admin sends credentials to backend
3. Backend returns JWT token
4. Token stored in localStorage
5. Token sent with each API request
6. Auto-logout on token expiration

### Login Credentials (Demo)
```
Email: admin@alashmedia.com
Password: admin123
```

## State Management (Redux)

### Store Structure
```javascript
{
  auth: {user, token, isAuthenticated, isLoading, error},
  blogs: {blogs, currentBlog, pagination, isLoading, error},
  authors: {authors, currentAuthor, pagination, isLoading, error},
  categories: {categories, currentCategory, isLoading, error},
  banners: {banners, currentBanner, pagination, isLoading, error},
  votes: {votes, currentVote, pagination, isLoading, error},
  galleries: {galleries, currentGallery, pagination, isLoading, error}
}
```

## API Endpoints

### Auth
- `POST /auth/login` - User login
- `POST /auth/register` - Register new user
- `GET /auth/profile` - Get user profile
- `POST /auth/reset-password` - Reset password
- `PUT /auth/update-password` - Update password

### Blogs
- `GET /blogs` - Get all blogs (paginated)
- `GET /blogs/:id` - Get blog by ID
- `GET /blogs/slug/:slug` - Get blog by slug
- `POST /blogs` - Create blog
- `PUT /blogs/:id` - Update blog
- `DELETE /blogs/:id` - Delete blog

### Authors
- `GET /authors` - Get all authors
- `GET /authors/:id` - Get author with blogs
- `POST /authors` - Create author
- `PUT /authors/:id` - Update author
- `DELETE /authors/:id` - Delete author

### Categories
- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category
- `POST /categories` - Create category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

### Banners
- `GET /banners` - Get all banners
- `GET /banners/:id` - Get banner
- `POST /banners` - Create banner
- `PUT /banners/:id` - Update banner
- `DELETE /banners/:id` - Delete banner

### Polls/Votes
- `GET /votes` - Get all votes
- `GET /votes/:id` - Get vote
- `POST /votes` - Create vote
- `PUT /votes/:id` - Update vote
- `DELETE /votes/:id` - Delete vote
- `GET /votes/:id/results` - Get vote results

### Galleries
- `GET /galleries` - Get all galleries
- `GET /galleries/:id` - Get gallery
- `POST /galleries` - Create gallery
- `PUT /galleries/:id` - Update gallery
- `DELETE /galleries/:id` - Delete gallery
- `POST /galleries/:id/items` - Add gallery item
- `PUT /galleries/:id/items/:itemId` - Update gallery item
- `DELETE /galleries/:id/items/:itemId` - Delete gallery item

## Styling

### Tailwind CSS Configuration

- Custom primary color: Blue (500-700)
- Responsive grid system
- Utility-first approach
- Custom scrollbar styling

### Available Color Classes

```css
Primary: bg-blue-* text-blue-*
Secondary: bg-gray-* text-gray-*
Success: bg-green-* text-green-*
Warning: bg-yellow-* text-yellow-*
Danger: bg-red-* text-red-*
```

## Common Components

### Button
```jsx
<Button variant="primary" size="md">
  Click Me
</Button>
```

### Input
```jsx
<Input
  label="Email"
  error="Invalid email"
  type="email"
/>
```

### Modal
```jsx
<Modal
  isOpen={isOpen}
  title="Confirm Delete"
  onClose={handleClose}
>
  Content here
</Modal>
```

### Card
```jsx
<Card className="p-6">
  Content here
</Card>
```

## Custom Hooks

### useAuth
```javascript
const { user, token, isAuthenticated, isLoading } = useAuth()
```

### useRequireAdmin
```javascript
useRequireAdmin() // Protect admin-only routes
```

## Error Handling

- Global error interceptor in API client
- Toast notifications for user feedback
- Redux error state management
- Automatic logout on 401 errors

## Performance Optimization

- Code splitting with React Router
- Lazy loading of components
- Image optimization
- Pagination for large datasets
- Redux memoization

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Security Features

- JWT token authentication
- Protected routes and components
- CORS enabled backend
- Input validation
- XSS protection via React
- CSRF protection

## Development Guidelines

### File Naming
- Components: `PascalCase.jsx`
- Utility files: `camelCase.js`
- CSS: `camelCase.css`

### Import Organization
1. React imports
2. Third-party imports
3. Redux/Store imports
4. Local component imports
5. Service/Util imports
6. Style imports

### Component Structure
```jsx
// Props destructuring at top
// State hooks
// Effects
// Event handlers
// Return JSX
```

## Troubleshooting

### Backend Connection Issues
- Ensure backend is running on port 5000
- Check `VITE_API_BASE_URL` in `.env`
- Verify CORS is enabled on backend

### Authentication Issues
- Clear localStorage and retry
- Check JWT token expiration
- Verify backend is returning valid token

### Style Issues
- Clear Vite cache: `npm run build`
- Rebuild Tailwind: Check `tailwind.config.js`

## Future Enhancements

- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Batch operations
- [ ] API versioning
- [ ] GraphQL support
- [ ] Dark mode
- [ ] Internationalization (i18n)
- [ ] Advanced search with filters
- [ ] Activity logging
- [ ] Audit trail

## License

Proprietary - Alash Media

## Support

For issues, bugs, or feature requests, contact the development team.

---

**Last Updated:** 2024
**Version:** 1.0.0
