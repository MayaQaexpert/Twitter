'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import TweetCard from '../components/TweetCard'
import { FaSearch } from 'react-icons/fa'
import { HiArrowLeft } from 'react-icons/hi'

export default function ExplorePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [tweets, setTweets] = useState([])
  const [filteredTweets, setFilteredTweets] = useState([])
  const [activeTab, setActiveTab] = useState('top')

  useEffect(() => {
    fetchTweets()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = tweets.filter(tweet => 
        tweet.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tweet.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tweet.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredTweets(filtered)
    } else {
      setFilteredTweets(tweets)
    }
  }, [searchQuery, tweets])

  const fetchTweets = async () => {
    try {
      const response = await fetch('/api/tweets')
      const data = await response.json()
      setTweets(data.tweets || [])
      setFilteredTweets(data.tweets || [])
    } catch (error) {
      console.error('Error fetching tweets:', error)
    }
  }

  return (
    <div className="min-h-screen border-x border-gray-200">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center space-x-4 mb-3">
            <button 
              onClick={() => router.push('/')}
              className="hover:bg-gray-100 rounded-full p-2 transition-colors"
            >
              <HiArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="font-bold text-xl">Explore</h2>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <input
              type="text"
              placeholder="Search Twitter"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 rounded-full py-3 pl-12 pr-4 outline-none focus:bg-white focus:ring-2 focus:ring-[#1d9bf0] transition-all"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('top')}
            className={`flex-1 py-4 font-bold hover:bg-gray-100 transition-colors relative ${
              activeTab === 'top' ? 'text-gray-900' : 'text-gray-500'
            }`}
          >
            Top
            {activeTab === 'top' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1d9bf0] rounded-full"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('latest')}
            className={`flex-1 py-4 font-bold hover:bg-gray-100 transition-colors relative ${
              activeTab === 'latest' ? 'text-gray-900' : 'text-gray-500'
            }`}
          >
            Latest
            {activeTab === 'latest' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1d9bf0] rounded-full"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('people')}
            className={`flex-1 py-4 font-bold hover:bg-gray-100 transition-colors relative ${
              activeTab === 'people' ? 'text-gray-900' : 'text-gray-500'
            }`}
          >
            People
            {activeTab === 'people' && (
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
        </div>
      </div>

      {/* Results */}
      <div>
        {filteredTweets.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-lg font-bold mb-2">
              {searchQuery ? 'No results found' : 'Start searching'}
            </p>
            <p className="text-gray-500 text-sm">
              {searchQuery 
                ? 'Try searching for something else' 
                : 'Search for people, topics, or keywords'}
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'top' && filteredTweets.map(tweet => (
              <TweetCard key={tweet.id} tweet={tweet} />
            ))}
            {activeTab === 'latest' && filteredTweets
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map(tweet => (
                <TweetCard key={tweet.id} tweet={tweet} />
              ))}
            {activeTab === 'media' && filteredTweets
              .filter(t => t.images?.length > 0)
              .map(tweet => (
                <TweetCard key={tweet.id} tweet={tweet} />
              ))}
            {activeTab === 'people' && (
              <div className="p-8 text-center text-gray-500">
                <p>People search coming soon</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
