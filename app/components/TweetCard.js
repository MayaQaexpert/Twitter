const TweetCard = ({ tweet }) => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {/* Placeholder avatar - replace with actual user avatar */}
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <p className="font-medium text-gray-900 truncate">
              {tweet.userId ? `User ${tweet.userId}` : 'Anonymous'}
            </p>
            <span className="text-gray-500 text-sm">·</span>
            <span className="text-gray-500 text-sm">Just now</span>
          </div>
          <p className="text-gray-800 mt-1">{tweet.body}</p>
          
          {/* Tweet actions */}
          <div className="flex items-center justify-start space-x-8 mt-3 text-gray-500">
            <button className="flex items-center space-x-2 hover:text-blue-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{tweet.reactions || 0}</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-green-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              <span>Retweet</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-red-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>Like</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetCard;