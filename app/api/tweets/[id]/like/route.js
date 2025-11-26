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
        { error: 'You must be logged in to like a tweet' },
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

    // Check if user already liked this tweet
    const hasLiked = tweet.likes.includes(user._id);

    if (hasLiked) {
      // Unlike
      tweet.likes = tweet.likes.filter(
        (likeId) => likeId.toString() !== user._id.toString()
      );
    } else {
      // Like
      tweet.likes.push(user._id);
    }

    await tweet.save();

    return NextResponse.json(
      {
        message: hasLiked ? 'Tweet unliked' : 'Tweet liked',
        liked: !hasLiked,
        likeCount: tweet.likes.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}
