import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import { Card } from '../components/common/FormElements'
import {
  FiFileText,
  FiUsers,
  FiList,
  FiImage,
  FiBarChart2,
} from 'react-icons/fi'
import apiClient from '../services/apiClient'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    totalAuthors: 0,
    totalCategories: 0,
    activeBanners: 0,
    totalVotes: 0,
    totalGalleries: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/dashboard/stats')
        setStats(response.data || {})
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Total Blogs',
      value: stats.totalBlogs,
      icon: FiFileText,
      color: 'blue',
      path: '/blogs',
    },
    {
      title: 'Published',
      value: stats.publishedBlogs,
      icon: FiFileText,
      color: 'green',
    },
    {
      title: 'Drafts',
      value: stats.draftBlogs,
      icon: FiFileText,
      color: 'yellow',
    },
    {
      title: 'Total Authors',
      value: stats.totalAuthors,
      icon: FiUsers,
      color: 'purple',
      path: '/authors',
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: FiList,
      color: 'indigo',
      path: '/categories',
    },
    {
      title: 'Active Banners',
      value: stats.activeBanners,
      icon: FiImage,
      color: 'red',
      path: '/banners',
    },
    {
      title: 'Active Polls',
      value: stats.totalVotes,
      icon: FiBarChart2,
      color: 'pink',
      path: '/votes',
    },
    {
      title: 'Galleries',
      value: stats.totalGalleries,
      icon: FiImage,
      color: 'indigo',
      path: '/gallery/photos',
    },
  ]

  const StatCard = ({ card }) => {
    const Icon = card.icon
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      yellow: 'bg-yellow-50 text-yellow-600',
      purple: 'bg-purple-50 text-purple-600',
      indigo: 'bg-indigo-50 text-indigo-600',
      red: 'bg-red-50 text-red-600',
      pink: 'bg-pink-50 text-pink-600',
    }

    return (
      <Card className="flex items-start gap-4 hover:shadow-lg transition-shadow">
        <div className={`p-3 rounded-lg ${colorClasses[card.color]}`}>
          <Icon size={24} />
        </div>
        <div className="flex-1">
          <p className="text-gray-600 text-sm">{card.title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {isLoading ? '-' : card.value}
          </p>
        </div>
      </Card>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your content overview.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, index) => (
            <StatCard key={index} card={card} />
          ))}
        </div>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Links
          </h2>
          <ul className="space-y-2">
            <li>
              <Link to="/blogs/create" className="text-blue-600 hover:text-blue-700 font-medium">
                Create New Blog
              </Link>
            </li>
            <li>
              <Link to="/authors/create" className="text-blue-600 hover:text-blue-700 font-medium">
                Add New Author
              </Link>
            </li>
            <li>
              <Link to="/banners/create" className="text-blue-600 hover:text-blue-700 font-medium">
                Create Banner
              </Link>
            </li>
            <li>
              <Link to="/votes/create" className="text-blue-600 hover:text-blue-700 font-medium">
                Create Poll
              </Link>
            </li>
          </ul>
        </Card>
      </div>
    </MainLayout>
  )
}

export default Dashboard
