const SideMenuItem = ({ text, Icon }) => {
  return (
    <div className="flex items-center space-x-3 p-3 hover:bg-gray-200 cursor-pointer rounded-full transition duration-200">
      <Icon className="h-6 w-6 text-gray-700" />
      <span className="hidden xl:inline text-lg font-medium">{text}</span>
    </div>
  );
};

export default SideMenuItem;
