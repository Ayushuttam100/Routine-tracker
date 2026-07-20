import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import YouTubeLog from '@/models/YouTubeLog';

function classifyCategory(title) {
  const lowerTitle = title.toLowerCase();
  
  if (['dbms'].some(k => lowerTitle.includes(k))) return 'DBMS';
  if (['dsa', 'leetcode'].some(k => lowerTitle.includes(k))) return 'DSA';
  if (['mern', 'react'].some(k => lowerTitle.includes(k))) return 'MERN';
  if (['gym', 'lifting', 'heavy lifting', 'powerlifting', 'workout', 'squat', 'deadlift', 'bench press', 'creatine', 'protein', 'form check'].some(k => lowerTitle.includes(k))) return 'Physical';
  
  return 'Entertainment';
}

export async function GET() {
  try {
    await connectToDatabase();
    const logs = await YouTubeLog.find({}).sort({ watchedAt: -1 });
    return NextResponse.json(logs);
  } catch (error) {
    console.error('YouTube log GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch YouTube logs' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const { videoTitle, url, durationWatched } = await request.json();
    
    if (!videoTitle || durationWatched === undefined) {
      return NextResponse.json({ error: 'videoTitle and durationWatched are required' }, { status: 400 });
    }
    
    const category = classifyCategory(videoTitle);
    
    const newLog = new YouTubeLog({
      videoTitle,
      url,
      durationWatched: Number(durationWatched),
      category,
    });
    
    const savedLog = await newLog.save();
    
    return NextResponse.json({ message: 'YouTube log saved successfully', data: savedLog }, { status: 201 });
  } catch (error) {
    console.error('YouTube log creation error:', error);
    return NextResponse.json({ error: 'Failed to create YouTube log' }, { status: 500 });
  }
}
