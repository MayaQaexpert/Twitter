import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Tweet from '@/models/Tweet';
import User from '@/models/User';

// POST - Add a comment/reply to a tweet
export async function POST(request, { params }) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be logged in to comment' },
        { status: 401 }
      );
    }

    const { content } = await request.json();

    // Validation
    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    if (content.length > 280) {
      return NextResponse.json(
        { error: 'Comment cannot exceed 280 characters' },
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

    const { id } = await params;
    const parentTweet = await Tweet.findById(id);

    if (!parentTweet) {
      return NextResponse.json(
        { error: 'Tweet not found' },
        { status: 404 }
      );
    }

    // Create the reply/comment
    const reply = await Tweet.create({
      content: content.trim(),
      author: user._id,
      replyTo: id
    });

    // Add reply to parent tweet's replies array
    parentTweet.replies.push(reply._id);
    await parentTweet.save();

    // Populate author info for response
    await reply.populate('author', 'name username image');

    return NextResponse.json(
      {
        message: 'Comment posted successfully',
        comment: reply
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error posting comment:', error);
    return NextResponse.json(
      { error: 'Failed to post comment' },
      { status: 500 }
    );
  }
}

// GET - Fetch all comments/replies for a tweet
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    
    const replies = await Tweet.find({ replyTo: id })
      .populate('author', 'name username image')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ replies }, { status: 200 });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}
