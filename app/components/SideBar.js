'use client';

import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SideMenuItem from './SideMenuItem';
import { BiHomeCircle } from 'react-icons/bi';
import { FaHashtag } from 'react-icons/fa';
import { RiInboxLine } from 'react-icons/ri';
import { IoNotificationsOutline } from 'react-icons/io5';
import { CgProfile } from 'react-icons/cg';
import { HiDotsHorizontal } from 'react-icons/hi';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Sidebar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const loading = status === 'loading';

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/auth/signin');
  };

  const handleSignIn = () => {
    router.push('/auth/signin');
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="fixed h-screen flex flex-col justify-between border-r border-gray-200 bg-white w-[68px] xl:w-[250px] p-2 xl:px-4">
      <div className="flex flex-col">
        {/* Logo */}
        <div className="hoverEffect p-3 xl:p-4 flex items-center justify-center xl:justify-start mb-2">
          <Image
            src="https://img.icons8.com/?size=100&id=fJp7hepMryiw&format=png"
            width={32}
            height={32}
            alt="Logo"
            className="xl:mr-3"
          />
          <span className="hidden xl:inline text-xl font-bold">Twitter</span>
        </div>

        {/* Menu */}
        <nav className="space-y-1">
          <SideMenuItem text="Home" Icon={BiHomeCircle} active={true} />
          <SideMenuItem text="Explore" Icon={FaHashtag} />
          <SideMenuItem text="Notifications" Icon={IoNotificationsOutline} badge={3} />
          <SideMenuItem text="Messages" Icon={RiInboxLine} />
          {session && <SideMenuItem text="Profile" Icon={CgProfile} />}
          <SideMenuItem text="More" Icon={HiDotsHorizontal} />
        </nav>

        {/* Tweet Button - Only show when logged in */}
        {session && (
          <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full py-3 px-4 xl:px-0 xl:w-full font-bold shadow-lg transition-all duration-200 hover:shadow-xl">
            <span className="hidden xl:inline">Tweet</span>
            <span className="xl:hidden text-xl">+</span>
          </button>
        )}

        {/* Sign In Button - Show when not logged in */}
        {!session && !loading && (
          <button 
            onClick={handleSignIn}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full py-3 px-4 xl:px-0 xl:w-full font-bold shadow-lg transition-all duration-200 hover:shadow-xl"
          >
            <span className="hidden xl:inline">Sign In</span>
            <span className="xl:hidden text-xl">→</span>
          </button>
        )}
      </div>

      {/* User profile section */}
      {session ? (
        <div className="relative mb-3">
          <div 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="hoverEffect p-2 xl:p-3 flex items-center justify-center xl:justify-between cursor-pointer rounded-full"
          >
            <div className="flex items-center gap-3">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {getUserInitials(session.user.name)}
                </div>
              )}
              <div className="hidden xl:block">
                <p className="font-bold text-sm line-clamp-1">{session.user.name}</p>
                <p className="text-gray-500 text-xs">@{session.user.username || session.user.email?.split('@')[0]}</p>
              </div>
            </div>
            <HiDotsHorizontal className="hidden xl:block h-5 w-5 text-gray-700" />
          </div>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute bottom-full mb-2 left-0 xl:left-auto xl:right-0 bg-white rounded-2xl shadow-2xl border border-gray-200 w-64 overflow-hidden z-50">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                      {getUserInitials(session.user.name)}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-sm">{session.user.name}</p>
                    <p className="text-gray-500 text-xs">@{session.user.username || session.user.email?.split('@')[0]}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full p-3 hover:bg-gray-50 cursor-pointer transition-colors text-left flex items-center gap-2"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-700" />
                <span className="font-bold text-sm">Log out @{session.user.username || session.user.email?.split('@')[0]}</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        !loading && (
          <div className="mb-3 p-3 bg-gray-50 rounded-2xl border border-gray-200">
            <p className="text-xs text-gray-600 mb-2 hidden xl:block">
              Sign in to see your profile and connect with others.
            </p>
            <button
              onClick={handleSignIn}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-full transition-all duration-200 text-sm"
            >
              Sign In
            </button>
          </div>
        )
      )}
    </div>
  );
}
