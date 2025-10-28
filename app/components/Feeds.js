import TweetBox from "./TweetBox";

const Feeds = () => {
  return (
    <div className="flex-1 border-l border-r max-w-2xl sm:ml-[90px] xl:ml-[370px] min-h-screen">
      {/* 🏠 Header */}
      <h1 className="font-bold text-xl p-4 border-b sticky top-0 bg-white z-10">
        Home
      </h1>

      {/* 🐦 Tweet Box */}
      <TweetBox />

      {/* 📰 Sample Feed */}
      <div className="p-4 border-b">
        <h2 className="font-semibold">@user123</h2>
        <p className="text-gray-700 mt-1">
          Tailwind CSS makes styling so easy! 🚀
        </p>
      </div>

      <div className="p-4 border-b">
        <h2 className="font-semibold">@react_dev</h2>
        <p className="text-gray-700 mt-1">
          Next.js 16 just dropped — App Router keeps getting better!
        </p>
      </div>
    </div>
  );
};

export default Feeds;
