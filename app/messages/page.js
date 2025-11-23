'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { HiArrowLeft, HiOutlineMail } from 'react-icons/hi'
import { RiSettings4Line } from 'react-icons/ri'

export default function MessagesPage() {
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
    <div className="flex h-screen border-x border-gray-200">
      {/* Conversations List */}
      <div className="w-96 border-r border-gray-200">
        <div className="sticky top-0 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/')}
                className="hover:bg-gray-100 rounded-full p-2 transition-colors"
              >
                <HiArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="font-bold text-xl">Messages</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button className="hover:bg-gray-100 rounded-full p-2 transition-colors">
                <RiSettings4Line className="h-5 w-5" />
              </button>
              <button className="hover:bg-gray-100 rounded-full p-2 transition-colors">
                <HiOutlineMail className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center h-[calc(100vh-70px)] px-8">
          <div className="text-gray-300 mb-4">
            <HiOutlineMail className="h-16 w-16" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Select a message
          </h3>
          <p className="text-gray-500 text-center max-w-sm text-sm">
            Choose from your existing conversations, start a new one, or just keep swimming.
          </p>
          <button className="mt-6 bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold px-6 py-3 rounded-full transition-colors">
            New message
          </button>
        </div>
      </div>

      {/* Message View */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to your inbox!
          </h2>
          <p className="text-gray-500 max-w-md mb-6">
            Drop a line, share posts and more with private conversations between you and others on Twitter.
          </p>
          <button className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold px-8 py-3 rounded-full transition-colors shadow-lg hover:shadow-xl transform hover:scale-105">
            Write a message
          </button>
        </div>
      </div>
    </div>
  )
}
