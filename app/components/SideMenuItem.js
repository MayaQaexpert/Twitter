const SideMenuItem = ({ text, Icon, active = false, badge = null }) => {
  return (
    <div className={`group flex items-center justify-center xl:justify-start gap-3 p-3 hover:bg-gray-100 cursor-pointer rounded-full transition-all duration-200 ${
      active ? 'font-bold' : ''
    }`}>
      <div className="relative">
        <Icon className={`h-6 w-6 ${active ? 'text-gray-900' : 'text-gray-700'} group-hover:text-gray-900 transition-colors`} />
        {badge && (
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {badge}
          </span>
        )}
      </div>
      <span className={`hidden xl:inline text-lg ${active ? 'font-bold' : 'font-normal'}`}>
        {text}
      </span>
    </div>
  );
};

export default SideMenuItem;
