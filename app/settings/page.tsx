'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface UserPreferences {
  favoriteGenres: string[]
  emailNotifications: boolean
  language: string
  region: string
  contentMaturity: string
}

const GENRES = [
  { id: '28', name: 'Action' },
  { id: '12', name: 'Adventure' },
  { id: '16', name: 'Animation' },
  { id: '35', name: 'Comedy' },
  { id: '80', name: 'Crime' },
  { id: '99', name: 'Documentary' },
  { id: '18', name: 'Drama' },
  { id: '10751', name: 'Family' },
  { id: '14', name: 'Fantasy' },
  { id: '36', name: 'History' },
  { id: '27', name: 'Horror' },
  { id: '10402', name: 'Music' },
  { id: '9648', name: 'Mystery' },
  { id: '10749', name: 'Romance' },
  { id: '878', name: 'Science Fiction' },
  { id: '53', name: 'Thriller' },
  { id: '10752', name: 'War' },
  { id: '37', name: 'Western' }
]

const REGIONS = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'ES', name: 'Spain' },
]

const CONTENT_MATURITY = [
  { id: 'all', name: 'All Content' },
  { id: 'family', name: 'Family Friendly' },
  { id: 'teen', name: 'Teen' },
  { id: 'mature', name: 'Mature' },
]

export default function SettingsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [preferences, setPreferences] = useState<UserPreferences>({
    favoriteGenres: [],
    emailNotifications: true,
    language: 'en',
    region: 'US',
    contentMaturity: 'all'
  })

  useEffect(() => {
    if (!session) {
      router.push('/login')
    } else {
      fetchUserPreferences()
    }
  }, [session, router])

  const fetchUserPreferences = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setPreferences(data)
      }
    } catch (error) {
      console.error('Failed to fetch preferences:', error)
      toast.error('Failed to load preferences')
    } finally {
      setLoading(false)
    }
  }

  const handleGenreToggle = (genreId: string) => {
    setPreferences(prev => ({
      ...prev,
      favoriteGenres: prev.favoriteGenres.includes(genreId)
        ? prev.favoriteGenres.filter(id => id !== genreId)
        : [...prev.favoriteGenres, genreId]
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      })

      if (!response.ok) {
        throw new Error('Failed to save preferences')
      }
      toast.success('Preferences saved!')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save preferences'
      )
      console.error('Error saving preferences:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="space-y-8">
        {/* Favorite Genres */}
        <section className="bg-[#1e293b] p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Favorite Genres</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {GENRES.map(genre => (
              <button
                key={genre.id}
                onClick={() => handleGenreToggle(genre.id)}
                className={`p-2 rounded-lg text-sm transition-colors ${
                  preferences.favoriteGenres.includes(genre.id)
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-[#1e293b] p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={preferences.emailNotifications}
              onChange={e => setPreferences(prev => ({ ...prev, emailNotifications: e.target.checked }))}
              className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <span>Receive email notifications about new releases and recommendations</span>
          </label>
        </section>

        {/* Region and Language */}
        <section className="bg-[#1e293b] p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Region & Language</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <label htmlFor="region" className="text-sm font-medium">Region:</label>
              <select
                id="region"
                value={preferences.region}
                onChange={e => setPreferences(prev => ({ ...prev, region: e.target.value }))}
                className="bg-gray-700 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {REGIONS.map(region => (
                  <option key={region.code} value={region.code}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <label htmlFor="language" className="text-sm font-medium">Language:</label>
              <select
                id="language"
                value={preferences.language}
                onChange={e => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                className="bg-gray-700 text-white rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </section>

        {/* Content Maturity */}
        <section className="bg-[#1e293b] p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Content Maturity</h2>
          <div className="space-y-2">
            {CONTENT_MATURITY.map(rating => (
              <label key={rating.id} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="contentMaturity"
                  value={rating.id}
                  checked={preferences.contentMaturity === rating.id}
                  onChange={e => setPreferences(prev => ({ ...prev, contentMaturity: e.target.value }))}
                  className="form-radio h-5 w-5 text-purple-600"
                />
                <span>{rating.name}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-6 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors ${
              saving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
} 