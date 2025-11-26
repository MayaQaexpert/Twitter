"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { PhotoIcon, GifIcon, FaceSmileIcon, CalendarIcon, MapPinIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function TweetBox({ onTweetPosted }) {
  const { data: session } = useSession();
  const [tweet, setTweet] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [scheduledDate, setScheduledDate] = useState("");
  const [location, setLocation] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const fileInputRef = useRef(null);
  const maxChars = 280;

  const sendTweet = async () => {
    if (!tweet.trim() || isPosting) return;

    if (!session) {
      alert("Please sign in to post a tweet");
      return;
    }

    setIsPosting(true);

    try {
      // Convert images to base64 for storage (in production, use proper file upload service)
      const mediaUrls = await Promise.all(
        selectedImages.map(async (image) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(image);
          });
        })
      );

      const response = await fetch('/api/tweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: tweet,
          media: mediaUrls.length > 0 ? mediaUrls : undefined,
          scheduledDate: scheduledDate || undefined,
          location: location || undefined
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTweet("");
        setSelectedImages([]);
        setScheduledDate("");
        setLocation("");
        setShowDatePicker(false);
        setShowLocationInput(false);
        // Notify parent component to refresh the feed
        if (onTweetPosted) {
          onTweetPosted(data.tweet);
        }
      } else {
        alert(data.error || 'Failed to post tweet');
      }
    } catch (error) {
      console.error('Error posting tweet:', error);
      alert('Failed to post tweet. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 4) {
      alert('You can only upload up to 4 images');
      return;
    }
    setSelectedImages([...selectedImages, ...files]);
  };

  const removeImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const charCount = tweet.length;
  const charPercentage = (charCount / maxChars) * 100;

  return (
    <div className="border-b border-gray-200 p-4 hover:bg-gray-50/30 transition-colors">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
          {session?.user?.image ? (
            <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
          ) : (
            session?.user?.name?.[0]?.toUpperCase() || 'U'
          )}
        </div>

        {/* Input Area */}
        <div className="flex-1">
          <textarea
            placeholder="What's happening?"
            className="w-full outline-none text-xl placeholder-gray-500 resize-none bg-transparent min-h-[60px]"
            value={tweet}
            onChange={(e) => setTweet(e.target.value)}
            maxLength={maxChars}
          />

          {/* Image Preview */}
          {selectedImages.length > 0 && (
            <div className={`grid gap-2 mt-3 ${
              selectedImages.length === 1 ? 'grid-cols-1' : 
              selectedImages.length === 2 ? 'grid-cols-2' : 
              'grid-cols-2'
            }`}>
              {selectedImages.map((image, index) => (
                <div key={index} className="relative rounded-2xl overflow-hidden border border-gray-200">
                  <img 
                    src={URL.createObjectURL(image)} 
                    alt={`Upload ${index + 1}`}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-gray-900/70 hover:bg-gray-900 text-white rounded-full p-1.5 transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Scheduled Date Display */}
          {scheduledDate && (
            <div className="mt-3 flex items-center gap-2 text-sm text-blue-500 bg-blue-50 px-3 py-2 rounded-full w-fit">
              <CalendarIcon className="h-4 w-4" />
              <span>Scheduled for {new Date(scheduledDate).toLocaleString()}</span>
              <button onClick={() => setScheduledDate("")} className="hover:text-blue-700">
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Location Display */}
          {location && (
            <div className="mt-3 flex items-center gap-2 text-sm text-green-500 bg-green-50 px-3 py-2 rounded-full w-fit">
              <MapPinIcon className="h-4 w-4" />
              <span>{location}</span>
              <button onClick={() => setLocation("")} className="hover:text-green-700">
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Media Options & Tweet Button */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
            <div className="flex items-center gap-1">
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
                className="hover:bg-blue-50 p-2 rounded-full transition-colors group" 
                title="Media"
                disabled={selectedImages.length >= 4}
              >
                <PhotoIcon className="h-5 w-5 text-blue-500 group-hover:text-blue-600 group-disabled:text-gray-300" />
              </button>
              <button className="hover:bg-blue-50 p-2 rounded-full transition-colors group" title="GIF">
                <GifIcon className="h-5 w-5 text-blue-500 group-hover:text-blue-600" />
              </button>
              <button className="hover:bg-blue-50 p-2 rounded-full transition-colors group" title="Emoji">
                <FaceSmileIcon className="h-5 w-5 text-blue-500 group-hover:text-blue-600" />
              </button>
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowDatePicker(!showDatePicker);
                    setShowLocationInput(false);
                  }}
                  className="hover:bg-blue-50 p-2 rounded-full transition-colors group" 
                  title="Schedule"
                >
                  <CalendarIcon className="h-5 w-5 text-blue-500 group-hover:text-blue-600" />
                </button>
                {showDatePicker && (
                  <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-20">
                    <input
                      type="datetime-local"
                      value={scheduledDate}
                      onChange={(e) => {
                        setScheduledDate(e.target.value);
                        setShowDatePicker(false);
                      }}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                )}
              </div>
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowLocationInput(!showLocationInput);
                    setShowDatePicker(false);
                  }}
                  className="hover:bg-blue-50 p-2 rounded-full transition-colors group" 
                  title="Location"
                >
                  <MapPinIcon className="h-5 w-5 text-blue-500 group-hover:text-blue-600" />
                </button>
                {showLocationInput && (
                  <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-20 w-64">
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Add location..."
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setShowLocationInput(false);
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Character Counter */}
              {charCount > 0 && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 -rotate-90" viewBox="0 0 20 20">
                    <circle
                      cx="10"
                      cy="10"
                      r="8"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <circle
                      cx="10"
                      cy="10"
                      r="8"
                      fill="none"
                      stroke={charPercentage > 100 ? "#ef4444" : charPercentage > 90 ? "#f59e0b" : "#1d9bf0"}
                      strokeWidth="2"
                      strokeDasharray={`${(charPercentage / 100) * 50.27} 50.27`}
                      className="transition-all"
                    />
                  </svg>
                  {charPercentage > 90 && (
                    <span className={`text-xs font-medium ${charPercentage > 100 ? 'text-red-500' : 'text-amber-500'}`}>
                      {maxChars - charCount}
                    </span>
                  )}
                </div>
              )}

              {/* Tweet Button */}
              <button
                onClick={sendTweet}
                disabled={!tweet.trim() || charCount > maxChars || isPosting || !session}
                className="bg-blue-500 text-white font-bold px-5 py-2 rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
              >
                {isPosting ? 'Posting...' : 'Tweet'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
