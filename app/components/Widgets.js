'use client'

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { HiTrendingUp } from "react-icons/hi";
import { useState } from "react";

const Widgets = () => {
  const [searchFocused, setSearchFocused] = useState(false);

  const trendingTopics = [
    { category: 'Technology', hashtag: '#NextJS16', tweets: '125K' },
    { category: 'Sports', hashtag: '#SuperBowl', tweets: '2.3M' },
    { category: 'Entertainment', hashtag: '#Oscars2025', tweets: '890K' },
    { category: 'Programming', hashtag: '#ReactJS', tweets: '456K' },
    { category: 'Tech News', hashtag: '#AI', tweets: '1.2M' },
  ];

  const whoToFollow = [
    { name: 'Tech Insider', username: 'techinsider', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Code Academy', username: 'codeacademy', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'Design Daily', username: 'designdaily', image: 'https://randomuser.me/api/portraits/men/67.jpg' },
  ];

  return (
    <div className="hidden lg:flex flex-col p-4 xl:w-[400px]">
      <div className="w-[350px] fixed space-y-4">
        {/* Search bar */}
        <div className={`bg-gray-100 transition-all duration-200 p-3 rounded-full flex items-center ${
          searchFocused ? 'bg-white border-2 border-[#1d9bf0]' : 'hover:bg-gray-200'
        }`}>
          <MagnifyingGlassIcon className={`h-5 w-5 transition-colors ${
            searchFocused ? 'text-[#1d9bf0]' : 'text-gray-500'
          }`}/>
          <input
            type="text"
            placeholder="Search Twitter"
            aria-label="Search Twitter"
            className="bg-transparent outline-none ml-2 w-full placeholder-gray-500"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        {/* Trending section */}
        <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
          <div className="px-4 py-3 flex items-center space-x-2">
            <HiTrendingUp className="text-gray-700 h-5 w-5" />
            <h2 className="text-xl font-bold">What's happening</h2>
          </div>
          
          {/* Trending items */}
          <div>
            {trendingTopics.map((item, index) => (
              <div 
                key={index} 
                className="hover:bg-gray-100 transition-colors duration-150 px-4 py-3 cursor-pointer border-b border-gray-100 last:border-0"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <span className="text-xs text-gray-500 font-medium">{item.category} · Trending</span>
                    <p className="font-bold text-[15px] mt-0.5">{item.hashtag}</p>
                    <span className="text-xs text-gray-500">{item.tweets} Tweets</span>
                  </div>
                  <button className="text-gray-500 hover:text-[#1d9bf0] hover:bg-[#1d9bf0]/10 p-2 rounded-full transition-all">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Show more link */}
          <div className="px-4 py-3 hover:bg-gray-100 transition-colors duration-150 cursor-pointer">
            <span className="text-[#1d9bf0] text-[15px]">Show more</span>
          </div>
        </div>

        {/* Who to follow section */}
        <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
          <h2 className="text-xl font-bold px-4 py-3">Who to follow</h2>
          
          <div>
            {whoToFollow.map((user, index) => (
              <div 
                key={index} 
                className="hover:bg-gray-100 transition-colors duration-150 px-4 py-3 flex items-center justify-between border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center space-x-3">
                  <img 
                    src={user.image} 
                    alt={user.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-bold text-[15px] hover:underline cursor-pointer">
                      {user.name}
                    </p>
                    <p className="text-gray-500 text-[15px]">@{user.username}</p>
                  </div>
                </div>
                <button className="bg-black hover:bg-gray-800 text-white font-bold px-4 py-1.5 rounded-full text-sm transition-colors">
                  Follow
                </button>
              </div>
            ))}
          </div>

          <div className="px-4 py-3 hover:bg-gray-100 transition-colors duration-150 cursor-pointer">
            <span className="text-[#1d9bf0] text-[15px]">Show more</span>
          </div>
        </div>

        {/* Footer links */}
        <div className="px-4 py-2">
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
