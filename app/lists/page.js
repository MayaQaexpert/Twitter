'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { HiArrowLeft } from 'react-icons/hi'
import { RiFileListLine } from 'react-icons/ri'

export default function ListsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1d9bf0]"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen border-x border-gray-200">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center space-x-4 px-4 py-3">
          <button 
            onClick={() => router.push('/')}
            className="hover:bg-gray-100 rounded-full p-2 transition-colors"
          >
            <HiArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="font-bold text-xl">Lists</h2>
            <p className="text-gray-500 text-sm">@{session.user.username}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex">
          <button className="flex-1 py-4 font-bold text-gray-900 hover:bg-gray-100 transition-colors relative border-b-2 border-b-[#1d9bf0]">
            Your Lists
          </button>
          <button className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-100 transition-colors">
            Discover
          </button>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-16 px-8">
        <RiFileListLine className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          You haven't created any Lists yet
        </h3>
        <p className="text-gray-500 text-center max-w-sm mb-6">
          When you do, it'll show up here. Lists are a great way to curate posts and find the best of Twitter.
        </p>
        <button className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold px-6 py-3 rounded-full transition-colors shadow-lg hover:shadow-xl transform hover:scale-105">
          Create a List
        </button>
      </div>
    </div>
  )
}
