import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Tweet from '@/models/Tweet';
import User from '@/models/User';
import Notification from '@/models/Notification';

// POST toggle retweet
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

    const hasRetweeted = tweet.retweets.includes(user._id);

    if (hasRetweeted) {
      // Unretweet
      tweet.retweets = tweet.retweets.filter(userId => userId.toString() !== user._id.toString());
    } else {
      // Retweet
      tweet.retweets.push(user._id);
      
      // Create notification if not retweeting own tweet
      if (tweet.userId.toString() !== user._id.toString()) {
        await Notification.create({
          recipientId: tweet.userId,
          senderId: user._id,
          type: 'retweet',
          tweetId: tweet._id,
          message: `${user.name} retweeted your tweet`,
        });
      }
    }

    await tweet.save();

    return NextResponse.json(
      { 
        retweeted: !hasRetweeted,
        retweetCount: tweet.retweets.length 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error toggling retweet:', error);
    return NextResponse.json(
      { error: 'Failed to toggle retweet' },
      { status: 500 }
    );
  }
}
