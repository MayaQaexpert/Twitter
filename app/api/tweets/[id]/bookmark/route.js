import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Tweet from '@/models/Tweet';
import User from '@/models/User';

// POST toggle bookmark
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = params;
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const tweet = await Tweet.findById(id);
    
    if (!tweet) {
      return NextResponse.json(
        { error: 'Tweet not found' },
        { status: 404 }
      );
    }

    const hasBookmarked = tweet.bookmarks.includes(user._id);

    if (hasBookmarked) {
      // Remove bookmark
      tweet.bookmarks = tweet.bookmarks.filter(userId => userId.toString() !== user._id.toString());
    } else {
      // Add bookmark
      tweet.bookmarks.push(user._id);
    }

    await tweet.save();

    return NextResponse.json(
      { 
        bookmarked: !hasBookmarked,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to toggle bookmark' },
      { status: 500 }
    );
  }
}
