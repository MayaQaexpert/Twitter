import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const Widgets = () => {
  return (
    <div className="hidden lg:flex flex-col p-4 xl:w-[400px]">
      <div className="w-[300px] fixed">
        {/* Search bar */}
        <div className="bg-gray-100 hover:bg-gray-200 transition-colors duration-200 p-3 rounded-full mb-4 flex items-center relative group">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500"/>
          <input
            type="text"
            placeholder="Search Twitter"
            aria-label="Search Twitter"
            className="bg-transparent outline-none ml-2 w-full placeholder-gray-500 focus:outline-none"
          />
        </div>

        {/* Trending section */}
        <div className="bg-gray-100 rounded-xl">
          <h2 className="text-xl font-bold p-4">What's happening</h2>
          
          {/* Trending items */}
          <div className="space-y-3 pb-4">
            {['Trending in Tech', 'Sports · Trending', 'Entertainment · Live'].map((category, index) => (
              <div key={index} className="hover:bg-gray-200 transition-colors duration-200 px-4 py-2 cursor-pointer">
                <span className="text-xs text-gray-500">{category}</span>
                <p className="font-bold">{`#Trending${index + 1}`}</p>
                <span className="text-sm text-gray-500">{`${(index + 1) * 10}K Tweets`}</span>
              </div>
            ))}
          </div>

          {/* Show more link */}
          <div className="p-4 hover:bg-gray-200 transition-colors duration-200 cursor-pointer rounded-b-xl">
            <span className="text-blue-500">Show more</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Widgets;
