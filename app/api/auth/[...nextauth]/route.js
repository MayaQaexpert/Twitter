import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectDB();
        
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await User.findOne({ email: credentials.email.toLowerCase() });
        
        if (!user) {
          throw new Error("No user found with this email");
        }

        if (!user.password) {
          throw new Error("Please use social login for this account");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          username: user.username,
        };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "demo",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "demo",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "demo",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "demo",
    }),
  ],
  pages: {
    signIn: '/',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google' || account.provider === 'github') {
        await connectDB();
        
        // Check if user exists
        let existingUser = await User.findOne({ email: user.email.toLowerCase() });
        
        if (!existingUser) {
          // Create new user for OAuth
          let username = user.email.split('@')[0].toLowerCase();
          
          // Check if username exists
          let usernameExists = await User.findOne({ username });
          let counter = 1;
          while (usernameExists) {
            username = `${user.email.split('@')[0].toLowerCase()}${counter}`;
            usernameExists = await User.findOne({ username });
            counter++;
          }
          
          existingUser = await User.create({
            email: user.email.toLowerCase(),
            name: user.name,
            username,
            image: user.image,
            provider: account.provider,
          });
        }
        
        user.id = existingUser._id.toString();
        user.username = existingUser.username;
      }
      
      return true;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
