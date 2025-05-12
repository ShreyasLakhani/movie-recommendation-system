'use client'

import Link from 'next/link'

export default function AuthLanding() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white space-y-8 p-4">
      <h1 className="text-4xl font-bold">Welcome to MovieJS</h1>
      <p className="text-gray-400">Please register or login to continue</p>
      <div className="flex space-x-4">
        <Link
          href="/register"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
        >
          Register
        </Link>
        <Link
          href="/login"
          className="px-6 py-3 bg-gray-700 hover:bg-gray-800 rounded text-white font-semibold"
        >
          Login
        </Link>
      </div>
    </div>
  )
}
