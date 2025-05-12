'use client'

import { useSession } from 'next-auth/react'
import { FiUser, FiMail } from 'react-icons/fi'

export default function ProfilePage() {
  const { data: session } = useSession()

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      
      <div className="bg-[#1e293b] rounded-lg p-6 shadow-lg">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-purple-600 rounded-full p-4">
            <FiUser className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{session?.user?.name || 'User'}</h2>
            <div className="flex items-center text-gray-400 mt-1">
              <FiMail className="w-4 h-4 mr-2" />
              <span>{session?.user?.email}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Account Information</h3>
            <div className="bg-[#0f172a] rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="mt-1">{session?.user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Member Since</p>
                  <p className="mt-1">January 2024</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Activity</h3>
            <div className="bg-[#0f172a] rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-gray-400">Movies Watched</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-gray-400">Reviews</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-gray-400">Watchlist</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 