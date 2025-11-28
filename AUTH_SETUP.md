# Authentication Setup Guide

## 🚨 Fix MongoDB Connection Error

The error you're seeing means **MongoDB is not running**. You have two options:

---

## Option 1: MongoDB Atlas (FREE & RECOMMENDED) ⭐

### Step 1: Create Free MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with your email or Google account
3. Choose the **FREE** tier (M0 Sandbox)

### Step 2: Create a Cluster

1. After signup, click **"Build a Database"**
2. Choose **FREE** tier (M0)
3. Select a cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region closest to you
5. Click **"Create Cluster"** (takes 3-5 minutes)

### Step 3: Create Database User

1. Click **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Create username and password (save these!)
   - Example: username: `twitteruser`, password: `Twitter123!`
5. Set user privileges to **"Read and write to any database"**
6. Click **"Add User"**

### Step 4: Whitelist IP Address

1. Click **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - This adds `0.0.0.0/0`
4. Click **"Confirm"**

### Step 5: Get Connection String

1. Go back to **"Database"** (left sidebar)
2. Click **"Connect"** button on your cluster
3. Select **"Connect your application"**
4. Choose **"Driver: Node.js"** and **"Version: 5.5 or later"**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://twitteruser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Update .env.local

1. Open `.env.local` file
2. Replace `MONGODB_URI` with your connection string
3. Replace `<password>` with your actual password
4. Add database name `/twitter` before the `?`:

```bash
# Replace this line:
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/twitter?retryWrites=true&w=majority

# With your actual connection string:
MONGODB_URI=mongodb+srv://twitteruser:Twitter123!@cluster0.abc123.mongodb.net/twitter?retryWrites=true&w=majority
```

**✅ Done! Your MongoDB Atlas is ready!**

---

## Option 2: Local MongoDB (Advanced Users)

### Install MongoDB on macOS

```bash
# Install using Homebrew
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB
brew services start mongodb-community@7.0

# Verify it's running
brew services list
```

### Install MongoDB on Windows

1. Download from: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install as a service (check the box)
5. Verify installation:
   ```cmd
   mongod --version
   ```

### Install MongoDB on Linux

```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Verify it's running
sudo systemctl status mongodb
```

### Update .env.local for Local MongoDB

```bash
MONGODB_URI=mongodb://localhost:27017/twitter
```

---

## 🔐 Setup OAuth Providers (Optional)

### Google OAuth Setup

1. Go to https://console.cloud.google.com/
2. Create a new project or select existing one
3. Go to **"APIs & Services"** > **"Credentials"**
4. Click **"Create Credentials"** > **"OAuth client ID"**
5. Configure consent screen if prompted
6. Choose **"Web application"**
7. Add authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
8. Copy **Client ID** and **Client Secret**
9. Update `.env.local`:
   ```bash
   GOOGLE_CLIENT_ID=your-actual-client-id
   GOOGLE_CLIENT_SECRET=your-actual-client-secret
   ```

### GitHub OAuth Setup

1. Go to https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in details:
   - Application name: `Twitter Clone`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Click **"Register application"**
5. Copy **Client ID**
6. Click **"Generate a new client secret"** and copy it
7. Update `.env.local`:
   ```bash
   GITHUB_ID=your-actual-client-id
   GITHUB_SECRET=your-actual-client-secret
   ```

---

## 🧪 Test Your Setup

### 1. Restart Development Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

### 2. Test Email Registration

1. Go to http://localhost:3000/auth/signin
2. Click **"Sign up"** at the bottom
3. Enter:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
4. Click **"Sign up"**
5. You should be redirected to the homepage, logged in!

### 3. Test Google Sign In (if configured)

1. Go to http://localhost:3000/auth/signin
2. Click **"Sign in with Google"**
3. Select your Google account
4. Authorize the app
5. You should be redirected to homepage

### 4. Test GitHub Sign In (if configured)

1. Go to http://localhost:3000/auth/signin
2. Click **"Sign in with GitHub"**
3. Authorize the app
4. You should be redirected to homepage

---

## 🔧 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED ::1:27017
```
**Solution**: MongoDB is not running. Use MongoDB Atlas (Option 1) or start local MongoDB.

### NextAuth Secret Error
```
Error: NEXTAUTH_SECRET environment variable is not set
```
**Solution**: Make sure `.env.local` has `NEXTAUTH_SECRET` set.

### OAuth Error - Redirect URI Mismatch
```
Error: redirect_uri_mismatch
```
**Solution**: Check that callback URLs in Google/GitHub console match:
- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

### Email Already Exists Error
```
Error: User with this email already exists
```
**Solution**: This email is already registered. Try signing in instead, or use a different email.

---

## 📝 Environment Variables Checklist

Required for basic functionality:
- ✅ `NEXTAUTH_URL` - Set to `http://localhost:3000`
- ✅ `NEXTAUTH_SECRET` - Any random string
- ✅ `MONGODB_URI` - Your MongoDB connection string

Optional for OAuth:
- ⬜ `GOOGLE_CLIENT_ID` - From Google Cloud Console
- ⬜ `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- ⬜ `GITHUB_ID` - From GitHub Settings
- ⬜ `GITHUB_SECRET` - From GitHub Settings

---

## 🎯 Quick Start (Recommended Path)

1. **Setup MongoDB Atlas** (FREE, 5 minutes)
   - Create account at mongodb.com/cloud/atlas
   - Create free cluster
   - Get connection string
   - Update MONGODB_URI in .env.local

2. **Test Email Authentication**
   - Restart server: `npm run dev`
   - Go to http://localhost:3000/auth/signin
   - Sign up with email/password
   - Start tweeting!

3. **Setup OAuth (Optional)**
   - Configure Google/GitHub later if needed
   - Email authentication works perfectly without them

---

## 🚀 After Setup

Once MongoDB is connected, you can:
- ✅ Sign up with email/password
- ✅ Sign in with email/password
- ✅ Sign in with Google (if configured)
- ✅ Sign in with GitHub (if configured)
- ✅ View your profile in sidebar
- ✅ Sign out
- ✅ All user data is stored in MongoDB

---

## 📞 Need Help?

If you're still having issues:
1. Check that `.env.local` is in the root directory
2. Make sure you restarted the dev server after updating `.env.local`
3. Verify MongoDB Atlas cluster is active (green status)
4. Check that IP address `0.0.0.0/0` is whitelisted in MongoDB Atlas

---

**🎉 You're all set! Now start the server and test authentication!**

```bash
npm run dev
```

Visit: http://localhost:3000/auth/signin
