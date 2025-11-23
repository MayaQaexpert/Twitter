import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Tweet from '@/models/Tweet';
import User from '@/models/User';
import Notification from '@/models/Notification';

// POST toggle like on a tweet
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

    const hasLiked = tweet.likes.includes(user._id);

    if (hasLiked) {
      // Unlike
      tweet.likes = tweet.likes.filter(userId => userId.toString() !== user._id.toString());
    } else {
      // Like
      tweet.likes.push(user._id);
      
      // Create notification if not liking own tweet
      if (tweet.userId.toString() !== user._id.toString()) {
        await Notification.create({
          recipientId: tweet.userId,
          senderId: user._id,
          type: 'like',
          tweetId: tweet._id,
          message: `${user.name} liked your tweet`,
        });
      }
    }

    await tweet.save();

    return NextResponse.json(
      { 
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
