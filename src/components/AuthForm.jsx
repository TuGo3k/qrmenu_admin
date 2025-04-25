'use client'

import { useState } from 'react'

export default function AuthForm({ isLogin = false, onSubmit }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(email, password)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-md max-w-md mx-auto mt-10"
    >
      <h2 className="text-2xl font-bold text-center mb-6">
        {isLogin ? 'Provider Login' : 'Provider Sign Up'}
      </h2>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          className="w-full p-3 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">Password</label>
        <input
          type="password"
          className="w-full p-3 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
      >
        {isLogin ? 'Login' : 'Sign Up'}
      </button>
    </form>
  )
}
