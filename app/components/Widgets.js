'use client';

import { MagnifyingGlassIcon, SparklesIcon, NewspaperIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

const Widgets = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('general');

  useEffect(() => {
    fetchNews(activeCategory);
  }, [activeCategory]);

  const fetchNews = async (category) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/news?category=${category}`);
      const data = await response.json();
      setNews(data.articles?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'General', value: 'general' },
    { name: 'Technology', value: 'technology' },
    { name: 'Business', value: 'business' },
    { name: 'Sports', value: 'sports' },
    { name: 'Entertainment', value: 'entertainment' }
  ];

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="hidden lg:flex flex-col p-4 xl:w-[400px]">
      <div className="w-[300px] xl:w-[350px] fixed h-screen overflow-y-auto pb-20 scrollbar-hide">
        {/* Modern Search bar */}
        <div className="sticky top-0 bg-white z-10 pb-3">
          <div className="bg-gray-50 hover:bg-gray-100 transition-all duration-300 p-3 rounded-full mb-4 flex items-center relative group border border-transparent focus-within:border-blue-500 focus-within:bg-white shadow-sm hover:shadow-md">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"/>
            <input
              type="text"
              placeholder="Search Twitter"
              aria-label="Search Twitter"
              className="bg-transparent outline-none ml-2 w-full placeholder-gray-400 text-sm"
            />
          </div>
        </div>

        {/* Subscribe Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-4 mb-4 shadow-lg">
          <h3 className="text-white font-bold text-lg mb-1">Subscribe to Premium</h3>
          <p className="text-blue-100 text-sm mb-3">Get the latest features and help support our work!</p>
          <button className="bg-white text-blue-600 font-bold px-4 py-2 rounded-full text-sm hover:bg-blue-50 transition-colors duration-200">
            Subscribe
          </button>
        </div>

        {/* What's happening section with news categories */}
        <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <SparklesIcon className="h-6 w-6 text-blue-500" />
              What's happening
            </h2>
          </div>

          {/* Category tabs */}
          <div className="flex overflow-x-auto px-4 py-3 gap-2 border-b border-gray-200 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat.value
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          
          {/* News items */}
          <div className="divide-y divide-gray-200">
            {loading ? (
              // Loading skeleton
              [...Array(3)].map((_, index) => (
                <div key={index} className="p-4 animate-pulse">
                  <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))
            ) : (
              news.map((article, index) => (
                <a
                  key={index}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:bg-gray-100 transition-all duration-200 px-4 py-3 cursor-pointer group"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-1">
                        <NewspaperIcon className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-xs text-gray-500 font-medium">
                          {article.source?.name || 'News'}
                        </span>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-xs text-gray-400">
                          {formatTimeAgo(article.publishedAt)}
                        </span>
                      </div>
                      <p className="font-bold text-sm leading-tight mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {article.title}
                      </p>
                      {article.description && (
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {article.description}
                        </p>
                      )}
                    </div>
                    {article.urlToImage && (
                      <img
                        src={article.urlToImage}
                        alt=""
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0 group-hover:opacity-90 transition-opacity"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    )}
                  </div>
                </a>
              ))
            )}
          </div>

          {/* Show more link */}
          <div className="p-4 hover:bg-gray-100 transition-colors duration-200 cursor-pointer rounded-b-2xl">
            <span className="text-blue-500 text-sm font-medium">Show more</span>
          </div>
        </div>

        {/* Who to follow section */}
        <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold p-4 border-b border-gray-200">Who to follow</h2>
          <div className="divide-y divide-gray-200">
            {[
              { name: 'Tech News', handle: '@technews', avatar: '🚀' },
              { name: 'World Updates', handle: '@worldnews', avatar: '🌍' },
              { name: 'Sports Daily', handle: '@sportsdaily', avatar: '⚽' }
            ].map((account, index) => (
              <div key={index} className="p-4 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xl">
                    {account.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-sm hover:underline cursor-pointer">{account.name}</p>
                    <p className="text-gray-500 text-sm">{account.handle}</p>
                  </div>
                </div>
                <button className="bg-black text-white px-4 py-1.5 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors duration-200">
                  Follow
                </button>
              </div>
            ))}
          </div>
          <div className="p-4 hover:bg-gray-100 transition-colors duration-200 cursor-pointer rounded-b-2xl">
            <span className="text-blue-500 text-sm font-medium">Show more</span>
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-4 px-4 pb-4">
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Cookie Policy</a>
            <a href="#" className="hover:underline">Accessibility</a>
            <a href="#" className="hover:underline">Ads info</a>
            <a href="#" className="hover:underline">More...</a>
          </div>
          <p className="text-xs text-gray-500 mt-2">© 2025 Twitter Clone</p>
        </div>
      </div>
    </div>
  );
};

export default Widgets;
