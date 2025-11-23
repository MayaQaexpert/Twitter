"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useTweets } from "../context/TweetContext";
import { HiOutlinePhotograph, HiOutlineEmojiHappy, HiX } from "react-icons/hi";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { MdOutlinePoll, MdOutlineGifBox } from "react-icons/md";
import { HiGlobeAlt } from "react-icons/hi2";

export default function TweetBox() {
  const [tweet, setTweet] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const fileInputRef = useRef(null);
  const { data: session } = useSession();
  const { addTweet } = useTweets();

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 4) {
      alert('You can only upload up to 4 images');
      return;
    }

    setSelectedImages([...selectedImages, ...files]);
    
    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrls(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const sendTweet = async () => {
    if ((!tweet.trim() && selectedImages.length === 0) || !session) return;
    
    const tweetData = { 
      body: tweet,
      images: imagePreviewUrls // base64 encoded images
    };
    
    await addTweet(tweetData);
    setTweet("");
    setSelectedImages([]);
    setImagePreviewUrls([]);
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center border-b border-gray-200 p-12 bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Don't miss what's happening</h3>
          <p className="text-gray-600">People on Twitter are the first to know.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-gray-200 px-4 py-2">
      <div className="flex space-x-3 py-2">
        {/* 👤 User Image */}
        <Image
          src={session.user.image || '/default-avatar.png'}
          alt="User"
          width={48}
          height={48}
          className="rounded-full hover:opacity-90 transition-opacity cursor-pointer"
        />

        {/* 📝 Input + Button */}
        <div className="flex-1">
          <textarea
            placeholder="What's happening?"
            className="w-full outline-none text-[20px] placeholder-gray-500 resize-none bg-transparent"
            value={tweet}
            onChange={(e) => setTweet(e.target.value)}
            rows={2}
          />
          
          {/* Image Previews */}
          {imagePreviewUrls.length > 0 && (
            <div className={`mt-3 grid gap-2 ${
              imagePreviewUrls.length === 1 ? 'grid-cols-1' : 
              imagePreviewUrls.length === 2 ? 'grid-cols-2' : 
              imagePreviewUrls.length === 3 ? 'grid-cols-2' : 
              'grid-cols-2'
            }`}>
              {imagePreviewUrls.map((url, index) => (
                <div 
                  key={index} 
                  className={`relative rounded-2xl overflow-hidden ${
                    imagePreviewUrls.length === 3 && index === 0 ? 'col-span-2' : ''
                  }`}
                >
                  <img 
                    src={url} 
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover max-h-80"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-gray-900 bg-opacity-75 hover:bg-opacity-90 rounded-full p-1.5 transition-all"
                  >
                    <HiX className="h-5 w-5 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-center pt-1 pb-2 text-[#1d9bf0]">
            <button className="flex items-center text-sm hover:bg-blue-50 px-2 py-1 rounded-full transition-colors">
              <HiGlobeAlt className="h-4 w-4 mr-1" />
              <span className="font-semibold">Everyone can reply</span>
            </button>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex space-x-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                multiple
                className="hidden"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={selectedImages.length >= 4}
                className="hover:bg-blue-50 p-2 rounded-full transition-colors text-[#1d9bf0] disabled:opacity-50 disabled:cursor-not-allowed" 
                title="Media"
              >
                <HiOutlinePhotograph className="h-5 w-5" />
              </button>
              <button className="hover:bg-blue-50 p-2 rounded-full transition-colors text-[#1d9bf0]" title="GIF">
                <MdOutlineGifBox className="h-5 w-5" />
              </button>
              <button className="hover:bg-blue-50 p-2 rounded-full transition-colors text-[#1d9bf0]" title="Poll">
                <MdOutlinePoll className="h-5 w-5" />
              </button>
              <button className="hover:bg-blue-50 p-2 rounded-full transition-colors text-[#1d9bf0]" title="Emoji">
                <HiOutlineEmojiHappy className="h-5 w-5" />
              </button>
              <button className="hover:bg-blue-50 p-2 rounded-full transition-colors text-[#1d9bf0]" title="Schedule">
                <RiCalendarScheduleLine className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              {tweet.length > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="relative w-8 h-8">
                    <svg className="transform -rotate-90 w-8 h-8">
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                        fill="none"
                      />
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        stroke={tweet.length > 280 ? '#ef4444' : '#1d9bf0'}
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray={`${(tweet.length / 280) * 87.96} 87.96`}
                      />
                    </svg>
                    {tweet.length > 260 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-xs font-bold ${tweet.length > 280 ? 'text-red-500' : 'text-gray-500'}`}>
                          {280 - tweet.length}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="w-px h-8 bg-gray-300"></div>
                </div>
              )}
              
              <button
                onClick={sendTweet}
                disabled={(!tweet.trim() && selectedImages.length === 0) || tweet.length > 280}
                className="bg-[#1d9bf0] text-white font-bold px-5 py-2 rounded-full hover:bg-[#1a8cd8] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transform hover:scale-105 disabled:hover:scale-100"
              >
                Tweet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
