const SideMenuItem = ({ text, Icon, badge, active }) => {
  return (
    <div className={`flex items-center space-x-4 p-3 hover:bg-gray-100 cursor-pointer rounded-full transition-all duration-200 relative group ${
      active ? 'font-bold' : ''
    }`}>
      <div className="relative">
        <Icon className={`h-7 w-7 ${active ? 'text-black' : 'text-gray-700'} group-hover:text-black transition-colors`} />
        {badge && badge > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-[#1d9bf0] text-white text-xs font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </div>
      <span className={`hidden xl:inline text-xl ${active ? 'font-bold' : 'font-normal'}`}>
        {text}
      </span>
    </div>
  );
};

export default SideMenuItem;
