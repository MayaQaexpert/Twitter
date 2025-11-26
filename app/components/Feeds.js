'use client';

import { useState, useEffect } from "react";
import TweetBox from "./TweetBox";
import TweetCard from "./TweetCard";
import { SparklesIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

const Feeds = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTweets = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const response = await fetch('/api/tweets');
      const data = await response.json();
      if (response.ok) {
        setTweets(data.tweets || []);
      }
    } catch (error) {
      console.error('Error fetching tweets:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  const handleTweetPosted = (newTweet) => {
    setTweets([newTweet, ...tweets]);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTweets(false);
  };

  return (
    <div className="flex-1 max-w-2xl min-h-screen border-x border-gray-200">
      {/* Header with tabs */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="font-bold text-xl">Home</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="hover:bg-blue-50 rounded-full p-2 transition-colors disabled:opacity-50"
              title="Refresh tweets"
            >
              <ArrowPathIcon className={`h-5 w-5 text-blue-500 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <SparklesIcon className="h-5 w-5 text-blue-500 cursor-pointer hover:bg-blue-50 rounded-full p-0.5 transition-colors" />
          </div>
        </div>
        <div className="flex border-b border-gray-200">
          <div className="flex-1 text-center py-3 font-semibold text-gray-900 border-b-4 border-blue-500 cursor-pointer hover:bg-gray-50 transition-colors">
            For you
          </div>
          <div className="flex-1 text-center py-3 font-semibold text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors">
            Following
          </div>
        </div>
      </div>

      {/* Tweet Box */}
      <TweetBox onTweetPosted={handleTweetPosted} />

      {/* Feed */}
      <div>
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-500"></div>
            <p className="mt-2">Loading tweets...</p>
          </div>
        ) : tweets.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg font-semibold mb-2">No tweets yet</p>
            <p className="text-sm">Be the first to post!</p>
          </div>
        ) : (
          tweets.map((tweet) => (
            <TweetCard 
              key={tweet._id} 
              tweet={tweet} 
              onUpdate={() => fetchTweets(false)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Feeds;
