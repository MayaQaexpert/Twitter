import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Tweet from '@/models/Tweet';
import User from '@/models/User';

export async function POST(request, { params }) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be logged in to bookmark a tweet' },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { id } = await params;
    const tweet = await Tweet.findById(id);

    if (!tweet) {
      return NextResponse.json(
        { error: 'Tweet not found' },
        { status: 404 }
      );
    }

    // Check if user already bookmarked this tweet
    const hasBookmarked = tweet.bookmarks.includes(user._id);

    if (hasBookmarked) {
      // Remove bookmark
      tweet.bookmarks = tweet.bookmarks.filter(
        (bookmarkId) => bookmarkId.toString() !== user._id.toString()
      );
    } else {
      // Add bookmark
      tweet.bookmarks.push(user._id);
    }

    await tweet.save();

    return NextResponse.json(
      {
        message: hasBookmarked ? 'Bookmark removed' : 'Tweet bookmarked',
        bookmarked: !hasBookmarked
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
