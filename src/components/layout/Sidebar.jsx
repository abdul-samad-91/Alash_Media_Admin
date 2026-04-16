import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  FiHome,
  FiFileText,
  FiUsers,
  FiList,
  FiImage,
  FiBarChart2,
  FiVideo,
  FiChevronDown,
  FiX,
} from 'react-icons/fi'

const Sidebar = ({ isOpen, onClose }) => {
  const [expandedMenu, setExpandedMenu] = useState(null)

  const menuItems = [
    {
      title: 'Dashboard',
      icon: FiHome,
      path: '/dashboard',
    },
    {
      title: 'Blogs & News',
      icon: FiFileText,
      path: '/blogs',
      submenu: [
        { title: 'All Blogs', path: '/blogs' },
        { title: 'Create Blog', path: '/blogs/create' },
        { title: 'Categories', path: '/categories' },
      ],
    },
    {
      title: 'Authors',
      icon: FiUsers,
      path: '/authors',
      submenu: [
        { title: 'All Authors', path: '/authors' },
        { title: 'Add Author', path: '/authors/create' },
      ],
    },
    {
      title: 'Banners',
      icon: FiImage,
      path: '/banners',
      submenu: [
        { title: 'All Banners', path: '/banners' },
        { title: 'Create Banner', path: '/banners/create' },
      ],
    },
    {
      title: 'Polls & Votes',
      icon: FiBarChart2,
      path: '/votes',
      submenu: [
        { title: 'All Polls', path: '/votes' },
        { title: 'Create Poll', path: '/votes/create' },
      ],
    },
    {
      title: 'Photo Gallery',
      icon: FiImage,
      path: '/gallery/photos',
    },
    {
      title: 'Video Gallery',
      icon: FiVideo,
      path: '/gallery/videos',
    },
    {
      title: 'Media Manager',
      icon: FiList,
      path: '/media',
    },
  ]

  const MenuItem = ({ item, level = 0 }) => {
    const Icon = item.icon
    const hasSubmenu = item.submenu && item.submenu.length > 0
    const isExpanded = expandedMenu === item.path

    return (
      <div key={item.path}>
        <NavLink
          to={item.path}
          onClick={() => hasSubmenu && setExpandedMenu(isExpanded ? null : item.path)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            } ${level > 0 ? 'ml-4' : ''}`
          }
        >
          <Icon size={20} />
          {item.title}
          {hasSubmenu && (
            <FiChevronDown
              size={16}
              className={`ml-auto transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          )}
        </NavLink>
        {hasSubmenu && isExpanded && (
          <div className="mt-2 space-y-1">
            {item.submenu.map((subitem) => (
              <NavLink
                key={subitem.path}
                to={subitem.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-colors ml-4 ${
                    isActive
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                {subitem.title}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 overflow-y-auto transition-transform lg:translate-x-0 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 px-4 py-4 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Menu</h2>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <MenuItem key={item.path} item={item} />
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
