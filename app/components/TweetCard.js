'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  ChatBubbleLeftIcon, 
  ArrowPathRoundedSquareIcon, 
  HeartIcon, 
  ShareIcon,
  BookmarkIcon,
  MapPinIcon,
  CalendarIcon
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";

const TweetCard = ({ tweet, onUpdate }) => {
  const { data: session } = useSession();
  const [isLiking, setIsLiking] = useState(false);
  const [isRetweeting, setIsRetweeting] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [localTweet, setLocalTweet] = useState(tweet);
  const maxChars = 280;

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
    
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    if (showComments && replies.length === 0) {
      fetchReplies();
    }
  }, [showComments]);

  const fetchReplies = async () => {
    setLoadingReplies(true);
    try {
      const response = await fetch(`/api/tweets/${tweet._id}/comments`);
      const data = await response.json();
      if (response.ok) {
        setReplies(data.replies || []);
      }
    } catch (error) {
      console.error('Error fetching replies:', error);
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!session || isLiking) return;

    setIsLiking(true);
    try {
      const response = await fetch(`/api/tweets/${tweet._id}/like`, {
        method: 'POST',
      });

      const data = await response.json();
      if (response.ok) {
        setLocalTweet({
          ...localTweet,
          likes: data.liked 
            ? [...(localTweet.likes || []), session.user.email]
            : (localTweet.likes || []).filter(id => id !== session.user.email),
        });
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error('Error liking tweet:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleRetweet = async (e) => {
    e.stopPropagation();
    if (!session || isRetweeting) return;

    setIsRetweeting(true);
    try {
      const response = await fetch(`/api/tweets/${tweet._id}/retweet`, {
        method: 'POST',
      });

      const data = await response.json();
      if (response.ok) {
        setLocalTweet({
          ...localTweet,
          retweets: data.retweeted 
            ? [...(localTweet.retweets || []), session.user.email]
            : (localTweet.retweets || []).filter(id => id !== session.user.email),
        });
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error('Error retweeting:', error);
    } finally {
      setIsRetweeting(false);
    }
  };

  const handleBookmark = async (e) => {
    e.stopPropagation();
    if (!session || isBookmarking) return;

    setIsBookmarking(true);
    try {
      const response = await fetch(`/api/tweets/${tweet._id}/bookmark`, {
        method: 'POST',
      });

      const data = await response.json();
      if (response.ok) {
        setLocalTweet({
          ...localTweet,
          bookmarks: data.bookmarked 
            ? [...(localTweet.bookmarks || []), session.user.email]
            : (localTweet.bookmarks || []).filter(id => id !== session.user.email),
        });
      }
    } catch (error) {
      console.error('Error bookmarking:', error);
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const tweetUrl = `${window.location.origin}/tweet/${tweet._id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Tweet by ${tweet.author?.name}`,
          text: tweet.content,
          url: tweetUrl,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          copyToClipboard(tweetUrl);
        }
      }
    } else {
      copyToClipboard(tweetUrl);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  const handleCommentClick = (e) => {
    e.stopPropagation();
    setShowComments(!showComments);
  };

  const handlePostComment = async () => {
    if (!comment.trim() || isPosting) return;

    if (!session) {
      alert("Please sign in to comment");
      return;
    }

    setIsPosting(true);

    try {
      const response = await fetch(`/api/tweets/${tweet._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: comment }),
      });

      const data = await response.json();

      if (response.ok) {
        setComment("");
        setReplies([data.comment, ...replies]);
        setLocalTweet({
          ...localTweet,
          replies: [...(localTweet.replies || []), data.comment._id]
        });
        if (onUpdate) onUpdate();
      } else {
        alert(data.error || 'Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleCommentPosted = (newComment) => {
    setLocalTweet({
      ...localTweet,
      replies: [...(localTweet.replies || []), newComment._id]
    });
    if (onUpdate) onUpdate();
  };

  const isLikedByUser = session && localTweet.likes?.some(id => id === session.user.email);
  const isRetweetedByUser = session && localTweet.retweets?.some(id => id === session.user.email);
  const isBookmarkedByUser = session && localTweet.bookmarks?.some(id => id === session.user.email);

  const charCount = comment.length;
  const charPercentage = (charCount / maxChars) * 100;

  return (
    <div className="border-b border-gray-200">
      <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
        <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
          {localTweet.author?.image ? (
            <img src={localTweet.author.image} alt={localTweet.author.name} className="w-full h-full object-cover" />
          ) : (
            localTweet.author?.name?.[0]?.toUpperCase() || 'U'
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-gray-900 hover:underline">{localTweet.author?.name || 'Anonymous'}</span>
            <span className="text-gray-500 text-sm">@{localTweet.author?.username || 'anonymous'}</span>
            <span className="text-gray-500 text-sm">·</span>
            <span className="text-gray-500 text-sm">{formatTimeAgo(localTweet.createdAt)}</span>
          </div>
          
          <p className="text-gray-900 text-[15px] leading-normal mb-3">
            {localTweet.content}
          </p>

          {/* Media Images */}
          {localTweet.media && localTweet.media.length > 0 && (
            <div className={`grid gap-2 mb-3 rounded-2xl overflow-hidden border border-gray-200 ${
              localTweet.media.length === 1 ? 'grid-cols-1' : 
              localTweet.media.length === 2 ? 'grid-cols-2' : 
              'grid-cols-2'
            }`}>
              {localTweet.media.map((mediaUrl, index) => (
                <img 
                  key={index}
                  src={mediaUrl} 
                  alt={`Media ${index + 1}`}
                  className="w-full h-64 object-cover"
                />
              ))}
            </div>
          )}

          {/* Location */}
          {localTweet.location && (
            <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
              <MapPinIcon className="h-4 w-4" />
              <span>{localTweet.location}</span>
            </div>
          )}

          {/* Scheduled Date */}
          {localTweet.scheduledDate && (
            <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
              <CalendarIcon className="h-4 w-4" />
              <span>Scheduled for {new Date(localTweet.scheduledDate).toLocaleString()}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between max-w-md text-gray-500">
            <button 
              onClick={handleCommentClick}
              className="flex items-center gap-2 hover:text-blue-500 group"
            >
              <div className="group-hover:bg-blue-50 rounded-full p-2 transition-colors">
                <ChatBubbleLeftIcon className="w-5 h-5" />
              </div>
              <span className="text-sm">{localTweet.replies?.length || 0}</span>
            </button>

            <button 
              onClick={handleRetweet}
              disabled={!session || isRetweeting}
              className={`flex items-center gap-2 group transition-colors ${
                isRetweetedByUser ? 'text-green-500' : 'hover:text-green-500'
              } disabled:opacity-50`}
            >
              <div className="group-hover:bg-green-50 rounded-full p-2 transition-colors">
                <ArrowPathRoundedSquareIcon className={`w-5 h-5 ${isRetweetedByUser ? 'font-bold' : ''}`} />
              </div>
              <span className="text-sm">{localTweet.retweets?.length || 0}</span>
            </button>

            <button 
              onClick={handleLike}
              disabled={!session || isLiking}
              className={`flex items-center gap-2 group transition-colors ${
                isLikedByUser ? 'text-red-500' : 'hover:text-red-500'
              } disabled:opacity-50`}
            >
              <div className="group-hover:bg-red-50 rounded-full p-2 transition-colors">
                {isLikedByUser ? (
                  <HeartSolidIcon className="w-5 h-5" />
                ) : (
                  <HeartIcon className="w-5 h-5" />
                )}
              </div>
              <span className="text-sm">{localTweet.likes?.length || 0}</span>
            </button>

            <button 
              onClick={handleBookmark}
              disabled={!session || isBookmarking}
              className={`group transition-colors ${
                isBookmarkedByUser ? 'text-blue-500' : 'hover:text-blue-500'
              } disabled:opacity-50`}
            >
              <div className="group-hover:bg-blue-50 rounded-full p-2 transition-colors">
                {isBookmarkedByUser ? (
                  <BookmarkSolidIcon className="w-5 h-5" />
                ) : (
                  <BookmarkIcon className="w-5 h-5" />
                )}
              </div>
            </button>

            <button 
              onClick={handleShare}
              className="hover:text-blue-500 group"
            >
              <div className="group-hover:bg-blue-50 rounded-full p-2 transition-colors">
                <ShareIcon className="w-5 h-5" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

      {/* Inline Comment Section */}
      {showComments && (
        <div className="border-t border-gray-100 bg-gray-50">
          {/* Comment Input */}
          <div className="p-4 border-b border-gray-100 bg-white">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
                {session?.user?.image ? (
                  <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                ) : (
                  session?.user?.name?.[0]?.toUpperCase() || 'U'
                )}
              </div>
              <div className="flex-1">
                <textarea
                  placeholder="Tweet your reply"
                  className="w-full outline-none text-base placeholder-gray-500 resize-none bg-transparent min-h-[60px] border border-gray-200 rounded-lg p-3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={maxChars}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex items-center justify-end gap-3 mt-2">
                  {charCount > 0 && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 -rotate-90" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                        <circle
                          cx="10" cy="10" r="8" fill="none"
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
                  <button
                    onClick={handlePostComment}
                    disabled={!comment.trim() || charCount > maxChars || isPosting || !session}
                    className="bg-blue-500 text-white font-bold px-5 py-1.5 rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
                  >
                    {isPosting ? 'Posting...' : 'Reply'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div>
            {loadingReplies ? (
              <div className="p-6 text-center text-gray-500">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-gray-200 border-t-blue-500"></div>
                <p className="mt-2 text-sm">Loading comments...</p>
              </div>
            ) : replies.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p className="text-sm">No comments yet. Be the first to reply!</p>
              </div>
            ) : (
              <div>
                {replies.map((reply) => (
                  <div key={reply._id} className="p-4 border-b border-gray-100 hover:bg-white transition-colors">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
                        {reply.author?.image ? (
                          <img src={reply.author.image} alt={reply.author.name} className="w-full h-full object-cover" />
                        ) : (
                          reply.author?.name?.[0]?.toUpperCase() || 'U'
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900 text-sm">{reply.author?.name || 'Anonymous'}</span>
                          <span className="text-gray-500 text-xs">@{reply.author?.username || 'anonymous'}</span>
                          <span className="text-gray-500 text-xs">·</span>
                          <span className="text-gray-500 text-xs">{formatTimeAgo(reply.createdAt)}</span>
                        </div>
                        <p className="text-gray-900 text-sm">{reply.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TweetCard;