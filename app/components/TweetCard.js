'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTweets } from '../context/TweetContext'
import Image from 'next/image'
import { HiOutlineChat, HiOutlineHeart, HiHeart } from 'react-icons/hi'
import { FaRetweet, FaRegBookmark, FaBookmark } from 'react-icons/fa'
import { RiShareForwardLine } from 'react-icons/ri'
import { IoStatsChart } from 'react-icons/io5'

const TweetCard = ({ tweet }) => {
  const { data: session } = useSession()
  const { toggleLike, toggleRetweet, toggleBookmark, addReply } = useTweets()
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState('')

  const hasLiked = session && tweet.likes?.includes(session.user.id)
  const hasRetweeted = session && tweet.retweets?.includes(session.user.id)
  const hasBookmarked = session && tweet.bookmarks?.includes(session.user.id)

  const handleReply = () => {
    if (!replyText.trim() || !session) return
    addReply(tweet.id, replyText)
    setReplyText('')
    setShowReply(false)
  }

  const getTimeAgo = (timestamp) => {
    const now = new Date()
    const tweetTime = new Date(timestamp)
    const diffInSeconds = Math.floor((now - tweetTime) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    return `${Math.floor(diffInSeconds / 86400)}d`
  }

  return (
    <div className="border-b border-gray-200 px-4 py-3 hover:bg-gray-50/50 transition-colors duration-150 cursor-pointer">
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <Image
            src={tweet.userImage || 'https://via.placeholder.com/40'}
            alt={tweet.userName}
            width={48}
            height={48}
            className="rounded-full hover:opacity-90 transition-opacity"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1">
            <p className="font-bold text-[15px] text-gray-900 hover:underline cursor-pointer">
              {tweet.userName}
            </p>
            <span className="text-gray-500 text-[15px]">@{tweet.username}</span>
            <span className="text-gray-500 text-[15px]">·</span>
            <span className="text-gray-500 text-[15px] hover:underline cursor-pointer">
              {getTimeAgo(tweet.timestamp)}
            </span>
          </div>
          
          <p className="text-gray-900 mt-0.5 text-[15px] leading-normal break-words">
            {tweet.body}
          </p>
          
          {/* Tweet Images */}
          {tweet.images && tweet.images.length > 0 && (
            <div className={`mt-3 rounded-2xl overflow-hidden border border-gray-200 ${
              tweet.images.length === 1 ? 'grid grid-cols-1' : 
              tweet.images.length === 2 ? 'grid grid-cols-2 gap-0.5' : 
              tweet.images.length === 3 ? 'grid grid-cols-2 gap-0.5' : 
              'grid grid-cols-2 gap-0.5'
            }`}>
              {tweet.images.map((img, index) => (
                <div 
                  key={index} 
                  className={`relative ${
                    tweet.images.length === 3 && index === 0 ? 'col-span-2' : ''
                  } ${tweet.images.length === 1 ? 'h-96' : 'h-48'}`}
                >
                  <img 
                    src={img} 
                    alt={`Tweet image ${index + 1}`}
                    className="w-full h-full object-cover hover:opacity-95 transition-opacity"
                  />
                </div>
              ))}
            </div>
          )}
          
          {/* Tweet actions */}
          <div className="flex items-center justify-between mt-3 max-w-md text-gray-500">
            <button 
              onClick={(e) => {
                e.stopPropagation()
                setShowReply(!showReply)
              }}
              className="flex items-center space-x-2 hover:text-[#1d9bf0] group transition-colors"
            >
              <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 transition-all">
                <HiOutlineChat className="w-[18px] h-[18px]" />
              </div>
              {tweet.replies?.length > 0 && (
                <span className="text-[13px]">{tweet.replies.length}</span>
              )}
            </button>
            
            <button 
              onClick={(e) => {
                e.stopPropagation()
                session && toggleRetweet(tweet.id)
              }}
              className={`flex items-center space-x-2 group transition-colors ${
                hasRetweeted ? 'text-green-600' : 'hover:text-green-600'
              }`}
              disabled={!session}
            >
              <div className={`p-2 rounded-full transition-all ${
                hasRetweeted ? 'bg-green-100' : 'group-hover:bg-green-50'
              }`}>
                <FaRetweet className="w-[18px] h-[18px]" />
              </div>
              {tweet.retweets?.length > 0 && (
                <span className="text-[13px]">{tweet.retweets.length}</span>
              )}
            </button>
            
            <button 
              onClick={(e) => {
                e.stopPropagation()
                session && toggleLike(tweet.id)
              }}
              className={`flex items-center space-x-2 group transition-all ${
                hasLiked ? 'text-pink-600' : 'hover:text-pink-600'
              }`}
              disabled={!session}
            >
              <div className={`p-2 rounded-full transition-all ${
                hasLiked ? 'bg-pink-100' : 'group-hover:bg-pink-50'
              }`}>
                {hasLiked ? (
                  <HiHeart className="w-[18px] h-[18px] animate-in zoom-in duration-200" />
                ) : (
                  <HiOutlineHeart className="w-[18px] h-[18px]" />
                )}
              </div>
              {tweet.likes?.length > 0 && (
                <span className="text-[13px]">{tweet.likes.length}</span>
              )}
            </button>

            <button 
              className="flex items-center space-x-2 hover:text-[#1d9bf0] group transition-colors"
            >
              <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 transition-all">
                <IoStatsChart className="w-[18px] h-[18px]" />
              </div>
            </button>

            <div className="flex items-center space-x-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  session && toggleBookmark(tweet.id)
                }}
                className={`flex items-center space-x-2 group transition-colors ${
                  hasBookmarked ? 'text-[#1d9bf0]' : 'hover:text-[#1d9bf0]'
                }`}
                disabled={!session}
              >
                <div className={`p-2 rounded-full transition-all ${
                  hasBookmarked ? 'bg-[#1d9bf0]/10' : 'group-hover:bg-[#1d9bf0]/10'
                }`}>
                  {hasBookmarked ? (
                    <FaBookmark className="w-[16px] h-[16px]" />
                  ) : (
                    <FaRegBookmark className="w-[16px] h-[16px]" />
                  )}
                </div>
              </button>

              <button className="flex items-center space-x-2 hover:text-[#1d9bf0] group transition-colors">
                <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 transition-all">
                  <RiShareForwardLine className="w-[18px] h-[18px]" />
                </div>
              </button>
            </div>
          </div>

          {/* Reply box */}
          {showReply && session && (
            <div className="mt-3 flex space-x-3 pt-3 border-t border-gray-100 animate-in slide-in-from-top-2">
              <Image
                src={session.user.image || '/default-avatar.png'}
                alt="Your avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Tweet your reply"
                  className="w-full outline-none text-[15px] placeholder-gray-500 py-2"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleReply()}
                  autoFocus
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleReply}
                    disabled={!replyText.trim()}
                    className="bg-[#1d9bf0] text-white font-bold px-4 py-1.5 rounded-full hover:bg-[#1a8cd8] transition-colors text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TweetCard;