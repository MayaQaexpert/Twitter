'use client'

import TweetBox from "./TweetBox";
import TweetCard from "./TweetCard";
import { useTweets } from "../context/TweetContext";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { HiSparkles } from "react-icons/hi";
import { FaXTwitter } from "react-icons/fa6";
import SignInModal from "./SignInModal";

const Feeds = () => {
  const { tweets } = useTweets();
  const { data: session } = useSession();
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <>
      <div className="flex-1 border-l border-r border-gray-200 max-w-2xl sm:ml-[73px] xl:ml-[275px] min-h-screen">
        {/* 🏠 Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Mobile: Show profile pic on left, Twitter logo center, sparkles right */}
            <div className="sm:hidden flex items-center w-full">
              {session ? (
                <Image
                  src={session.user.image || '/default-avatar.png'}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full cursor-pointer"
                />
              ) : (
                <button 
                  onClick={() => setShowSignIn(true)}
                  className="text-[#1d9bf0] font-bold text-sm"
                >
                  Sign In
                </button>
              )}
              <div className="flex-1 flex justify-center">
                <FaXTwitter className="text-2xl text-[#1d9bf0]" />
              </div>
              <div className="hoverEffect p-2">
                <HiSparkles className="h-5 w-5 text-gray-700" />
              </div>
            </div>
            
            {/* Desktop: Original layout */}
            <h1 className="hidden sm:block font-bold text-xl">Home</h1>
            <div className="hidden sm:block hoverEffect p-2">
              <HiSparkles className="h-5 w-5 text-gray-700" />
            </div>
          </div>
        </div>

        {/* 🐦 Tweet Box */}
        <TweetBox />

        {/* 📰 Tweets Feed */}
        <div>
          {tweets.length > 0 ? (
            tweets.map((tweet) => <TweetCard key={tweet.id} tweet={tweet} />)
          ) : (
            <div className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <h2 className="text-3xl font-bold mb-3">Welcome to Twitter</h2>
                <p className="text-gray-500 text-lg mb-6">
                  This is the best place to see what's happening in your world.
                </p>
                <p className="text-gray-400">
                  Sign in and start tweeting to see content here!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} />}
    </>
  );
};

export default Feeds;
