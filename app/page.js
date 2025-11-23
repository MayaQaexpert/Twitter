import React from 'react'
import SideBar from './components/SideBar'
import Feeds from './components/Feeds'
import Widgets from './components/Widgets'

const Home = () => {
  return (
    <div className="bg-white min-h-screen pb-16 sm:pb-0">
      
      <main className='flex min-h-screen max-w-[1400px] mx-auto relative'>

       {/* Sidebar */}
        <div className="hidden sm:flex sm:flex-col">
          <SideBar />
        </div>

        {/* Feeds */}
        <div className="flex-1 w-full sm:ml-0">
          <Feeds />
        </div>
        
        {/* Widgets */}
        <div className="hidden lg:flex lg:flex-col">
          <Widgets />
        </div>

      </main>

    </div>
  )
}

export default Home
