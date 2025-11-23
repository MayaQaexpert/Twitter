'use client'

import { useTweets } from '../context/TweetContext'
import Image from 'next/image'
import { HiHeart } from 'react-icons/hi'
import { FaRetweet, FaUserPlus } from 'react-icons/fa'
import { HiOutlineChat } from 'react-icons/hi'

export default function NotificationDropdown({ onClose }) {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useTweets()

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <HiHeart className="text-red-500 text-xl" />
      case 'retweet':
        return <FaRetweet className="text-green-500 text-xl" />
      case 'reply':
        return <HiOutlineChat className="text-blue-500 text-xl" />
      case 'follow':
        return <FaUserPlus className="text-blue-500 text-xl" />
      default:
        return null
    }
  }

  const getNotificationText = (notification) => {
    switch (notification.type) {
      case 'like':
        return `liked your tweet: "${notification.tweetPreview}..."`
      case 'retweet':
        return `retweeted your tweet: "${notification.tweetPreview}..."`
      case 'reply':
        return `replied to your tweet: "${notification.replyText}..."`
      case 'follow':
        return 'started following you'
      default:
        return ''
    }
  }

  const getTimeAgo = (timestamp) => {
    const now = new Date()
    const notifTime = new Date(timestamp)
    const diffInSeconds = Math.floor((now - notifTime) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  return (
    <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[600px] overflow-hidden z-50">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <h3 className="font-bold text-lg">Notifications</h3>
        <div className="flex space-x-2">
          {notifications.some(n => !n.read) && (
            <button
              onClick={markAllNotificationsAsRead}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Mark all read
            </button>
          )}
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            ×
          </button>
        </div>
      </div>
      
      <div className="overflow-y-auto max-h-[520px]">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => markNotificationAsRead(notification.id)}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex space-x-3">
                <div className="flex-shrink-0 pt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Image
                      src={notification.fromImage || '/default-avatar.png'}
                      alt={notification.from}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div>
                      <span className="font-bold text-sm">{notification.from}</span>
                      <span className="text-gray-500 text-sm ml-1">@{notification.fromUsername}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    {getNotificationText(notification)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {getTimeAgo(notification.timestamp)}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>No notifications yet</p>
            <p className="text-sm mt-2">When you get notifications, they'll show up here</p>
          </div>
        )}
      </div>
    </div>
  )
}
