'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useTweets } from '../context/TweetContext'
import Image from 'next/image'
import { HiArrowLeft, HiHeart } from 'react-icons/hi'
import { FaRetweet } from 'react-icons/fa'
import { HiOutlineChatBubbleLeft } from 'react-icons/hi2'
import { IoPersonAdd } from 'react-icons/io5'

export default function NotificationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { notifications } = useTweets()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1d9bf0]"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const getIcon = (type) => {
    switch (type) {
      case 'like':
        return <HiHeart className="h-8 w-8 text-pink-500" />
      case 'retweet':
        return <FaRetweet className="h-6 w-6 text-green-500" />
      case 'reply':
        return <HiOutlineChatBubbleLeft className="h-7 w-7 text-[#1d9bf0]" />
      case 'follow':
        return <IoPersonAdd className="h-7 w-7 text-[#1d9bf0]" />
      default:
        return null
    }
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
          <h2 className="font-bold text-xl">Notifications</h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button className="flex-1 py-4 font-bold text-gray-900 hover:bg-gray-100 transition-colors relative">
            All
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1d9bf0] rounded-full"></div>
          </button>
          <button className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-100 transition-colors">
            Verified
          </button>
          <button className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-100 transition-colors">
            Mentions
          </button>
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-8">
          <div className="text-gray-300 mb-4">
            <svg viewBox="0 0 24 24" className="h-16 w-16" fill="currentColor">
              <path d="M21.697 16.468c-.02-.016-2.14-1.64-2.103-6.03.02-2.532-.812-4.782-2.347-6.335C15.872 2.71 14.01 1.94 12.005 1.93h-.013c-2.004.01-3.866.78-5.242 2.174-1.534 1.553-2.368 3.802-2.346 6.334.037 4.33-2.02 5.967-2.102 6.03-.26.193-.366.53-.265.838.102.308.39.515.712.515h4.92c.102 2.31 1.997 4.16 4.33 4.16s4.226-1.85 4.327-4.16h4.922c.322 0 .61-.206.71-.514.103-.307-.003-.645-.263-.838zM12 20.478c-1.505 0-2.73-1.177-2.828-2.658h5.656c-.1 1.48-1.323 2.66-2.828 2.66zM4.38 16.32c.74-1.132 1.548-3.028 1.524-5.896-.018-2.16.644-3.982 1.913-5.267C8.91 4.05 10.397 3.437 12 3.43c1.603.008 3.087.62 4.18 1.728 1.27 1.285 1.933 3.106 1.915 5.267-.024 2.868.983 4.684 1.525 5.896H4.38z"/>
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Nothing to see here — yet
          </h3>
          <p className="text-gray-500 text-center max-w-sm">
            From likes to Retweets and a whole lot more, this is where all the action happens.
          </p>
        </div>
      ) : (
        <div>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`border-b border-gray-200 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                !notification.read ? 'bg-blue-50/30' : ''
              }`}
            >
              <div className="flex space-x-3">
                <div className="flex-shrink-0 pt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Image
                      src={notification.userImage || '/default-avatar.png'}
                      alt={notification.userName}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </div>
                  <p className="text-gray-900">
                    <span className="font-bold">{notification.userName}</span>
                    <span className="text-gray-600"> {notification.message}</span>
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {new Date(notification.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
