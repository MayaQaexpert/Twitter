'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { FaGoogle, FaGithub, FaXTwitter } from 'react-icons/fa6'
import { HiMail, HiLockClosed, HiUser } from 'react-icons/hi'

export default function SignInModal({ onClose }) {
  const [mode, setMode] = useState('signin') // 'signin' or 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'signup') {
        // Register new user
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Registration failed')
          setLoading(false)
          return
        }

        // After successful registration, sign in
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })

        if (result?.error) {
          setError(result.error)
        } else {
          window.location.href = '/'
        }
      } else {
        // Sign in existing user
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })

        if (result?.error) {
          setError('Invalid email or password')
        } else {
          window.location.href = '/'
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition-all text-xl font-light"
        >
          ×
        </button>
        
        <div className="text-center mb-6">
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaXTwitter className="text-white text-3xl" />
          </div>
          <h2 className="text-3xl font-bold mb-2">
            {mode === 'signin' ? 'Sign in to Twitter' : 'Join Twitter today'}
          </h2>
          <p className="text-gray-600">
            {mode === 'signin' 
              ? 'Welcome back! Please sign in to continue' 
              : 'Create your account to start tweeting'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4 mb-4">
          {mode === 'signup' && (
            <div className="relative">
              <HiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1d9bf0] focus:outline-none transition-colors"
              />
            </div>
          )}
          
          <div className="relative">
            <HiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1d9bf0] focus:outline-none transition-colors"
            />
          </div>

          <div className="relative">
            <HiLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1d9bf0] focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold py-3 px-4 rounded-full transition-all shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold py-3 px-4 rounded-full transition-all shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <FaGoogle className="text-xl text-red-500" />
            Continue with Google
          </button>

          <button
            onClick={() => signIn('github', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-full transition-all shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <FaGithub className="text-xl" />
            Continue with GitHub
          </button>
        </div>

        {/* Toggle between Sign In and Sign Up */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin')
              setError('')
            }}
            className="text-[#1d9bf0] hover:underline font-semibold"
          >
            {mode === 'signin' 
              ? "Don't have an account? Sign up" 
              : 'Already have an account? Sign in'}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          By continuing, you agree to our{' '}
          <a href="#" className="text-[#1d9bf0] hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-[#1d9bf0] hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}
