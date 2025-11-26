import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Tweet from '@/models/Tweet';
import User from '@/models/User';

// GET - Fetch all tweets
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 20;
    const skip = parseInt(searchParams.get('skip')) || 0;

    const tweets = await Tweet.find({ replyTo: null }) // Only get top-level tweets, not replies
      .populate('author', 'name username image')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    return NextResponse.json({ tweets }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tweets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tweets' },
      { status: 500 }
    );
  }
}

// POST - Create a new tweet
export async function POST(request) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be logged in to post a tweet' },
        { status: 401 }
      );
    }

    const { content, replyTo, media } = await request.json();

    // Validation
    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Tweet content is required' },
        { status: 400 }
      );
    }

    if (content.length > 280) {
      return NextResponse.json(
        { error: 'Tweet cannot exceed 280 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the user by email
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create the tweet
    const tweet = await Tweet.create({
      content: content.trim(),
      author: user._id,
      replyTo: replyTo || null,
      media: media || []
    });

    // Populate author info for response
    await tweet.populate('author', 'name username image');

    // If this is a reply, add it to the parent tweet's replies array
    if (replyTo) {
      await Tweet.findByIdAndUpdate(replyTo, {
        $push: { replies: tweet._id }
      });
    }

    return NextResponse.json(
      {
        message: 'Tweet created successfully',
        tweet
      },
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
