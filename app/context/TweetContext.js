'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

const TweetContext = createContext()

export function useTweets() {
  return useContext(TweetContext)
}

export function TweetProvider({ children }) {
  const { data: session } = useSession()
  const [tweets, setTweets] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch tweets from API
  useEffect(() => {
    fetchTweets()
  }, [])

  const fetchTweets = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/tweets')
      if (response.ok) {
        const data = await response.json()
        setTweets(data.tweets || [])
      }
    } catch (error) {
      console.error('Error fetching tweets:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTweet = async (tweetData) => {
    if (!session) return

    try {
      const response = await fetch('/api/tweets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tweetData),
      })

      if (response.ok) {
        const data = await response.json()
        setTweets([data.tweet, ...tweets])
      }
    } catch (error) {
      console.error('Error creating tweet:', error)
    }
  }

  const toggleLike = async (tweetId) => {
    if (!session) return

    try {
      const response = await fetch(`/api/tweets/${tweetId}/like`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        
        setTweets(tweets.map(tweet => {
          if (tweet.id === tweetId) {
            const newLikes = data.liked
              ? [...tweet.likes, session.user.id]
              : tweet.likes.filter(id => id !== session.user.id)
            return { ...tweet, likes: newLikes }
          }
          return tweet
        }))
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const toggleRetweet = async (tweetId) => {
    if (!session) return

    try {
      const response = await fetch(`/api/tweets/${tweetId}/retweet`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        
        setTweets(tweets.map(tweet => {
          if (tweet.id === tweetId) {
            const newRetweets = data.retweeted
              ? [...tweet.retweets, session.user.id]
              : tweet.retweets.filter(id => id !== session.user.id)
            return { ...tweet, retweets: newRetweets }
          }
          return tweet
        }))
      }
    } catch (error) {
      console.error('Error toggling retweet:', error)
    }
  }

  const toggleBookmark = async (tweetId) => {
    if (!session) return

    try {
      const response = await fetch(`/api/tweets/${tweetId}/bookmark`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        
        setTweets(tweets.map(tweet => {
          if (tweet.id === tweetId) {
            const newBookmarks = data.bookmarked
              ? [...tweet.bookmarks, session.user.id]
              : tweet.bookmarks.filter(id => id !== session.user.id)
            return { ...tweet, bookmarks: newBookmarks }
          }
          return tweet
        }))
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error)
    }
  }

  const addReply = async (tweetId, replyText) => {
    if (!session) return

    try {
      const response = await fetch('/api/tweets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          body: replyText,
          replyTo: tweetId 
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setTweets([data.tweet, ...tweets])
        
        // Update parent tweet replies count
        setTweets(tweets.map(tweet => {
          if (tweet.id === tweetId) {
            return { ...tweet, replies: [...tweet.replies, data.tweet.id] }
          }
          return tweet
        }))
      }
    } catch (error) {
      console.error('Error adding reply:', error)
    }
  }

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      ...notification,
      timestamp: new Date().toISOString(),
      read: false
    }
    setNotifications([newNotification, ...notifications])
  }

  const markNotificationAsRead = (notificationId) => {
    setNotifications(notifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ))
  }

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })))
  }

  const value = {
    tweets,
    notifications,
    loading,
    addTweet,
    toggleLike,
    toggleRetweet,
    toggleBookmark,
    addReply,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    fetchTweets,
  }

  return <TweetContext.Provider value={value}>{children}</TweetContext.Provider>
}
