import React from 'react'
import SideBar from './components/SideBar'
import Feeds from './components/Feeds'
import Widgets from './components/Widgets'

const Home = () => {
  return (
    <div>
      
      <main className='flex min-h-screen max-w-7xl mx-auto bg-white'>

       
        <SideBar />

         <Feeds />
          <Widgets />

      </main>

    </div>
  )
}

export default Home
