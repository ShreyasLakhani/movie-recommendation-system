'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })
    if (res?.error) {
      setError(res.error)
    } else {
      router.push('/')   // on success, go home
    }
  }

  return (
    <div className="flex h-screen">
      <div className="relative w-1/2 h-full">
        <img
          src="/img/login.jpeg"
          alt="image"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-1/2 h-full flex items-center justify-center">
        <div>
          <h1 className="text-center mb-4 text-6xl font-bold">Welcome!</h1>
          <p className="text-lg text-center text-gray-300">How about you quickly enter to see all the features!</p>
          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500">{error}</p>}
            {/* inputs for email, password, and a submit button */}
          </form>
        </div>
      </div>
    </div>
  );
}
