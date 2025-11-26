import React from 'react'
import SideBar from './components/SideBar'
import Feeds from './components/Feeds'
import Widgets from './components/Widgets'

const Home = () => {
  return (
    <div className="bg-white min-h-screen">
      <main className='flex max-w-7xl mx-auto bg-white'>
        {/* Compact Sidebar - Fixed width */}
        <div className="w-[68px] xl:w-[250px]">
          <SideBar />
        </div>

        {/* Main Feed - Takes remaining space */}
        <div className="flex-1">
          <Feeds />
        </div>
        
        {/* Widgets / News Section - Hidden on mobile */}
        <Widgets />
      </main>
    </div>
  )
}

export default Home
