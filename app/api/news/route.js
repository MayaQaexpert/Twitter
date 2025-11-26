import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'general';
    const country = searchParams.get('country') || 'us';
    
    // Using NewsAPI - You'll need to sign up at https://newsapi.org/ for a free API key
    const apiKey = process.env.NEWS_API_KEY || 'YOUR_API_KEY_HERE';
    
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&pageSize=10&apiKey=${apiKey}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      // Fallback to mock data if API fails
      return NextResponse.json({
        articles: [
          {
            title: "Breaking: Tech Innovation Reaches New Heights",
            description: "Major breakthrough in AI technology announced today",
            url: "#",
            source: { name: "Tech News" },
            publishedAt: new Date().toISOString(),
            category: "Technology"
          },
          {
            title: "Global Markets Show Strong Performance",
            description: "Stock markets reach record highs across major indices",
            url: "#",
            source: { name: "Business Today" },
            publishedAt: new Date().toISOString(),
            category: "Business"
          },
          {
            title: "Climate Summit Brings World Leaders Together",
            description: "Major agreements reached on environmental policies",
            url: "#",
            source: { name: "World News" },
            publishedAt: new Date().toISOString(),
            category: "Environment"
          },
          {
            title: "Sports Championship Finals This Weekend",
            description: "Teams prepare for the biggest game of the season",
            url: "#",
            source: { name: "Sports Daily" },
            publishedAt: new Date().toISOString(),
            category: "Sports"
          },
          {
            title: "New Entertainment Series Breaks Records",
            description: "Streaming platform announces record viewership",
            url: "#",
            source: { name: "Entertainment Weekly" },
            publishedAt: new Date().toISOString(),
            category: "Entertainment"
          }
        ]
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching news:', error);
    
    // Return fallback data on error
    return NextResponse.json({
      articles: [
        {
          title: "Stay Updated with Latest News",
          description: "Connect your news API to get real-time updates",
          url: "#",
          source: { name: "Twitter" },
          publishedAt: new Date().toISOString(),
          category: "General"
        }
      ]
    });
  }
}
