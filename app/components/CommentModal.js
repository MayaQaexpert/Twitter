'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function CommentModal({ tweet, isOpen, onClose, onCommentPosted }) {
  const { data: session } = useSession();
  const [comment, setComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const maxChars = 280;

  useEffect(() => {
    if (isOpen && tweet?._id) {
      fetchReplies();
    }
  }, [isOpen, tweet]);

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
        if (onCommentPosted) {
          onCommentPosted(data.comment);
        }
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

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
    
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!isOpen) return null;

  const charCount = comment.length;
  const charPercentage = (charCount / maxChars) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-12 px-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">Tweet Comments</h2>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 rounded-full p-2 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Original Tweet */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
              {tweet.author?.image ? (
                <img src={tweet.author.image} alt={tweet.author.name} className="w-full h-full object-cover" />
              ) : (
                tweet.author?.name?.[0]?.toUpperCase() || 'U'
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-gray-900">{tweet.author?.name || 'Anonymous'}</span>
                <span className="text-gray-500 text-sm">@{tweet.author?.username || 'anonymous'}</span>
                <span className="text-gray-500 text-sm">·</span>
                <span className="text-gray-500 text-sm">{formatTimeAgo(tweet.createdAt)}</span>
              </div>
              <p className="text-gray-900">{tweet.content}</p>
            </div>
          </div>
        </div>

        {/* Comment Input */}
        <div className="p-4 border-b border-gray-200">
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
                className="w-full outline-none text-lg placeholder-gray-500 resize-none bg-transparent min-h-[80px]"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={maxChars}
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
                  className="bg-blue-500 text-white font-bold px-5 py-2 rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
                >
                  {isPosting ? 'Posting...' : 'Reply'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Replies List */}
        <div className="flex-1 overflow-y-auto">
          {loadingReplies ? (
            <div className="p-8 text-center text-gray-500">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-gray-200 border-t-blue-500"></div>
              <p className="mt-2 text-sm">Loading comments...</p>
            </div>
          ) : replies.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-sm">No comments yet. Be the first to reply!</p>
            </div>
          ) : (
            <div>
              {replies.map((reply) => (
                <div key={reply._id} className="p-4 border-b border-gray-200 hover:bg-gray-50">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
                      {reply.author?.image ? (
                        <img src={reply.author.image} alt={reply.author.name} className="w-full h-full object-cover" />
                      ) : (
                        reply.author?.name?.[0]?.toUpperCase() || 'U'
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900">{reply.author?.name || 'Anonymous'}</span>
                        <span className="text-gray-500 text-sm">@{reply.author?.username || 'anonymous'}</span>
                        <span className="text-gray-500 text-sm">·</span>
                        <span className="text-gray-500 text-sm">{formatTimeAgo(reply.createdAt)}</span>
                      </div>
                      <p className="text-gray-900 text-[15px]">{reply.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
