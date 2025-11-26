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
        { error: 'You must be logged in to retweet' },
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

    // Check if user already retweeted this tweet
    const hasRetweeted = tweet.retweets.includes(user._id);

    if (hasRetweeted) {
      // Undo retweet
      tweet.retweets = tweet.retweets.filter(
        (retweetId) => retweetId.toString() !== user._id.toString()
      );
    } else {
      // Retweet
      tweet.retweets.push(user._id);
    }

    await tweet.save();

    return NextResponse.json(
      {
        message: hasRetweeted ? 'Retweet removed' : 'Retweeted',
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
