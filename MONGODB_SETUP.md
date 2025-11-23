# MongoDB Setup Guide for Twitter Clone

## 🚀 Getting Started with MongoDB

### Option 1: Local MongoDB (Recommended for Development)

1. **Install MongoDB**
   ```bash
   # macOS with Homebrew
   brew tap mongodb/brew
   brew install mongodb-community
   
   # Start MongoDB
   brew services start mongodb-community
   ```

2. **Verify Installation**
   ```bash
   mongosh
   ```

3. **Your `.env.local` is already configured for local MongoDB:**
   ```
   MONGODB_URI=mongodb://localhost:27017/twitter
   ```

### Option 2: MongoDB Atlas (Cloud - Free Tier Available)

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "Free" tier (M0)
   - Select your preferred region
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose authentication method (Password)
   - Create username and password
   - Give "Read and write to any database" permissions

4. **Whitelist IP Address**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Confirm

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<database>` with `twitter`

6. **Update `.env.local`**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/twitter?retryWrites=true&w=majority
   ```

## 📊 Database Schema

### Collections Created:

1. **users** - Stores user information
   - name, email, password, username, image
   - bio, location, website
   - followers, following arrays
   - OAuth provider info

2. **tweets** - Stores all tweets
   - userId (reference to users)
   - body (tweet content)
   - likes, retweets, bookmarks arrays
   - replies array
   - isReply, replyTo fields
   - timestamps

3. **notifications** - Stores notifications
   - recipientId, senderId
   - type (like, retweet, reply, follow)
   - tweetId reference
   - message, read status
   - timestamp

## 🔧 Testing the Setup

1. **Start the Application**
   ```bash
   npm run dev
   ```

2. **Check Console for MongoDB Connection**
   - You should see: `✅ Connected to MongoDB`

3. **Register a New User**
   - Go to http://localhost:3000
   - Click "Sign In" → "Sign up"
   - Create an account with email/password
   - Your user data will be saved to MongoDB!

4. **Create Tweets**
   - Once logged in, post a tweet
   - It will be saved to the database

## 📱 API Endpoints Created

- `POST /api/auth/register` - Register new user
- `GET /api/tweets` - Fetch all tweets
- `POST /api/tweets` - Create new tweet
- `POST /api/tweets/[id]/like` - Toggle like on tweet
- `POST /api/tweets/[id]/retweet` - Toggle retweet
- `POST /api/tweets/[id]/bookmark` - Toggle bookmark

## 🔍 View Your Data

### Using MongoDB Compass (GUI)
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your connection string
3. Browse collections: `users`, `tweets`, `notifications`

### Using mongosh (CLI)
```bash
mongosh "mongodb://localhost:27017/twitter"

# List collections
show collections

# View users
db.users.find().pretty()

# View tweets
db.tweets.find().pretty()

# Count documents
db.users.countDocuments()
db.tweets.countDocuments()
```

## 🎉 What's Working Now

✅ User registration with MongoDB storage
✅ Email/password authentication
✅ Google & GitHub OAuth (users stored in MongoDB)
✅ Tweet creation and storage
✅ Likes, retweets, bookmarks (persisted)
✅ Notifications system
✅ User profiles with followers/following
✅ Unique usernames generation

## 🚨 Troubleshooting

**Error: "MongoServerError: connection refused"**
- Make sure MongoDB is running: `brew services start mongodb-community`

**Error: "ECONNREFUSED"**
- Check your MongoDB URI in `.env.local`
- Ensure MongoDB is installed and running

**Error: "Authentication failed"**
- For MongoDB Atlas: verify username/password
- Check IP whitelist settings

## 📚 Next Steps

- Connect to MongoDB Atlas for production
- Add indexes for better performance
- Implement data pagination
- Add image upload for tweets
- Create user profile edit functionality

Enjoy your Twitter clone with MongoDB! 🎊
