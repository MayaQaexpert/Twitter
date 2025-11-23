'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import TweetCard from '../components/TweetCard'
import { HiArrowLeft, HiOutlineCalendar, HiOutlineLocationMarker } from 'react-icons/hi'
import { MdVerified } from 'react-icons/md'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('tweets')
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  useEffect(() => {
    fetchUserTweets()
  }, [session])

  const fetchUserTweets = async () => {
    try {
      const response = await fetch('/api/tweets')
      const data = await response.json()
      if (session) {
        const userTweets = data.tweets.filter(tweet => tweet.userId === session.user.id)
        setTweets(userTweets)
      }
    } catch (error) {
      console.error('Error fetching tweets:', error)
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

  const userLikedTweets = tweets.filter(tweet => 
    tweet.likes?.includes(session.user.id)
  )

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
            <h2 className="font-bold text-xl">{session.user.name}</h2>
            <p className="text-gray-500 text-sm">{tweets.length} Tweets</p>
          </div>
        </div>
      </div>

      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>

      {/* Profile Info */}
      <div className="px-4 pb-4">
        <div className="flex justify-between items-start -mt-16 mb-4">
          <div className="relative">
            <Image
              src={session.user.image || '/default-avatar.png'}
              alt={session.user.name}
              width={133}
              height={133}
              className="rounded-full border-4 border-white"
            />
          </div>
          <button className="mt-20 border border-gray-300 hover:bg-gray-100 font-bold px-4 py-2 rounded-full transition-colors">
            Edit profile
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center space-x-1">
            <h2 className="font-bold text-xl">{session.user.name}</h2>
            <MdVerified className="text-[#1d9bf0] h-5 w-5" />
          </div>
          <p className="text-gray-500">@{session.user.username}</p>
        </div>

        <p className="text-gray-900 mb-3">
          Digital creator | Tech enthusiast | Building amazing things 🚀
        </p>

        <div className="flex items-center space-x-4 text-gray-500 text-sm mb-3">
          <div className="flex items-center space-x-1">
            <HiOutlineLocationMarker className="h-4 w-4" />
            <span>Earth</span>
          </div>
          <div className="flex items-center space-x-1">
            <HiOutlineCalendar className="h-4 w-4" />
            <span>Joined November 2025</span>
          </div>
        </div>

        <div className="flex space-x-4 text-sm">
          <div>
            <span className="font-bold text-gray-900">420</span>
            <span className="text-gray-500 ml-1">Following</span>
          </div>
          <div>
            <span className="font-bold text-gray-900">1.2K</span>
            <span className="text-gray-500 ml-1">Followers</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('tweets')}
            className={`flex-1 py-4 font-bold hover:bg-gray-100 transition-colors relative ${
              activeTab === 'tweets' ? 'text-gray-900' : 'text-gray-500'
            }`}
          >
            Tweets
            {activeTab === 'tweets' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1d9bf0] rounded-full"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('replies')}
            className={`flex-1 py-4 font-bold hover:bg-gray-100 transition-colors relative ${
              activeTab === 'replies' ? 'text-gray-900' : 'text-gray-500'
            }`}
          >
            Replies
            {activeTab === 'replies' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1d9bf0] rounded-full"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`flex-1 py-4 font-bold hover:bg-gray-100 transition-colors relative ${
              activeTab === 'media' ? 'text-gray-900' : 'text-gray-500'
            }`}
          >
            Media
            {activeTab === 'media' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1d9bf0] rounded-full"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('likes')}
            className={`flex-1 py-4 font-bold hover:bg-gray-100 transition-colors relative ${
              activeTab === 'likes' ? 'text-gray-900' : 'text-gray-500'
            }`}
          >
            Likes
            {activeTab === 'likes' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1d9bf0] rounded-full"></div>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'tweets' && tweets.map(tweet => (
          <TweetCard key={tweet.id} tweet={tweet} />
        ))}
        {activeTab === 'likes' && userLikedTweets.map(tweet => (
          <TweetCard key={tweet.id} tweet={tweet} />
        ))}
        {activeTab === 'media' && tweets.filter(t => t.images?.length > 0).map(tweet => (
          <TweetCard key={tweet.id} tweet={tweet} />
        ))}
        {activeTab === 'replies' && (
          <div className="p-8 text-center text-gray-500">
            <p>No replies yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
