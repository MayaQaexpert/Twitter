'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import TweetCard from '../components/TweetCard'
import { HiArrowLeft } from 'react-icons/hi'
import { FaRegBookmark } from 'react-icons/fa'

export default function BookmarksPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchBookmarkedTweets()
    }
  }, [session])

  const fetchBookmarkedTweets = async () => {
    try {
      const response = await fetch('/api/tweets')
      const data = await response.json()
      const bookmarked = data.tweets.filter(tweet => 
        tweet.bookmarks?.includes(session.user.id)
      )
      setTweets(bookmarked)
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1d9bf0]"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen border-x border-gray-200">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center space-x-4 px-4 py-3">
          <button 
            onClick={() => router.push('/')}
            className="hover:bg-gray-100 rounded-full p-2 transition-colors"
          >
            <HiArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="font-bold text-xl">Bookmarks</h2>
            <p className="text-gray-500 text-sm">@{session.user.username}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      {tweets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-8">
          <FaRegBookmark className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Save Tweets for later
          </h3>
          <p className="text-gray-500 text-center max-w-sm">
            Bookmark Tweets to easily find them again in the future.
          </p>
        </div>
      ) : (
        <div>
          {tweets.map(tweet => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))}
        </div>
      )}
    </div>
  )
}
