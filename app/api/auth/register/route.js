import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    await connectDB();
    
    const { email, password, name } = await request.json();

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate username from email
    let username = email.split('@')[0].toLowerCase();
    
    // Check if username exists, add number if needed
    let usernameExists = await User.findOne({ username });
    let counter = 1;
    while (usernameExists) {
      username = `${email.split('@')[0].toLowerCase()}${counter}`;
      usernameExists = await User.findOne({ username });
      counter++;
    }

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      username,
      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1d9bf0&color=fff`,
      provider: 'email',
    });

    return NextResponse.json(
      { 
        message: 'User registered successfully',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          username: user.username,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
