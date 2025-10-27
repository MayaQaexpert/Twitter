const SideMenuItem = ({ text, Icon }) => {
  return (
    <div className="flex items-center space-x-2 p-2 hover:bg-gray-200 cursor-pointer rounded">
      <Icon className="h-6 w-6" />
      <br />
      <span>{text}</span>
    </div>
  )
}

export default SideMenuItem;
