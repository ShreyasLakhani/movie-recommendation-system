'use client'

import { useState } from 'react'
import { FiSettings, FiBell, FiEye, FiGlobe } from 'react-icons/fi'

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [privateProfile, setPrivateProfile] = useState(false)
  const [language, setLanguage] = useState('en')

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center space-x-3 mb-8">
        <FiSettings className="w-8 h-8" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="space-y-6">
        {/* Notifications */}
        <section className="bg-[#1e293b] rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FiBell className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-400">Receive email updates about your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-400">Receive push notifications about new releases</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushNotifications}
                  onChange={(e) => setPushNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section className="bg-[#1e293b] rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FiEye className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-semibold">Privacy</h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Private Profile</p>
              <p className="text-sm text-gray-400">Make your profile visible to only your friends</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privateProfile}
                onChange={(e) => setPrivateProfile(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </section>

        {/* Language */}
        <section className="bg-[#1e293b] rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FiGlobe className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-semibold">Language</h2>
          </div>

          <div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-[#0f172a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </section>
      </div>
    </div>
  )
} 