'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { BiHomeCircle, BiSolidHomeCircle } from 'react-icons/bi'
import { FaSearch } from 'react-icons/fa'
import { IoNotificationsOutline, IoNotifications } from 'react-icons/io5'
import { RiInboxLine, RiInboxFill } from 'react-icons/ri'

export default function MobileNav() {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  if (!session) return null

  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: BiHomeCircle,
      activeIcon: BiSolidHomeCircle,
    },
    {
      name: 'Explore',
      path: '/explore',
      icon: FaSearch,
      activeIcon: FaSearch,
    },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: IoNotificationsOutline,
      activeIcon: IoNotifications,
    },
    {
      name: 'Messages',
      path: '/messages',
      icon: RiInboxLine,
      activeIcon: RiInboxFill,
    },
  ]

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          const Icon = isActive ? item.activeIcon : item.icon
          
          return (
            <button
              key={item.name}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center justify-center p-3 hover:bg-gray-100 rounded-lg transition-colors flex-1"
            >
              <Icon className={`h-6 w-6 ${isActive ? 'text-[#1d9bf0]' : 'text-gray-700'}`} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
