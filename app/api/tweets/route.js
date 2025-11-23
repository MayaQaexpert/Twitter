import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Tweet from '@/models/Tweet';
import User from '@/models/User';

// GET all tweets
export async function GET() {
  try {
    await connectDB();
    
    const tweets = await Tweet.find({ isReply: false })
      .populate('userId', 'name username image')
      .sort({ createdAt: -1 })
      .limit(50);

    const formattedTweets = tweets.map(tweet => ({
      id: tweet._id.toString(),
      userId: tweet.userId._id.toString(),
      userName: tweet.userId.name,
      username: tweet.userId.username,
      userImage: tweet.userId.image,
      body: tweet.body,
      images: tweet.media || [],
      timestamp: tweet.createdAt.toISOString(),
      likes: tweet.likes.map(id => id.toString()),
      retweets: tweet.retweets.map(id => id.toString()),
      replies: tweet.replies.map(id => id.toString()),
      bookmarks: tweet.bookmarks.map(id => id.toString()),
    }));

    return NextResponse.json({ tweets: formattedTweets }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tweets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tweets' },
      { status: 500 }
    );
  }
}

// POST create a new tweet
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { body, replyTo, images } = await request.json();

    if ((!body || body.trim().length === 0) && (!images || images.length === 0)) {
      return NextResponse.json(
        { error: 'Tweet content or images required' },
        { status: 400 }
      );
    }

    if (body.length > 280) {
      return NextResponse.json(
        { error: 'Tweet must be 280 characters or less' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const tweet = await Tweet.create({
      userId: user._id,
      body: body?.trim() || '',
      media: images || [],
      isReply: !!replyTo,
      replyTo: replyTo || null,
    });

    // If it's a reply, update the parent tweet
    if (replyTo) {
      await Tweet.findByIdAndUpdate(replyTo, {
        $push: { replies: tweet._id }
      });
    }

    const populatedTweet = await Tweet.findById(tweet._id)
      .populate('userId', 'name username image');

    const formattedTweet = {
      id: populatedTweet._id.toString(),
      userId: populatedTweet.userId._id.toString(),
      userName: populatedTweet.userId.name,
      username: populatedTweet.userId.username,
      userImage: populatedTweet.userId.image,
      body: populatedTweet.body,
      images: populatedTweet.media || [],
      timestamp: populatedTweet.createdAt.toISOString(),
      likes: [],
      retweets: [],
      replies: [],
      bookmarks: [],
    };

    return NextResponse.json(
      { tweet: formattedTweet },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating tweet:', error);
    return NextResponse.json(
      { error: 'Failed to create tweet' },
      { status: 500 }
    );
  }
}
