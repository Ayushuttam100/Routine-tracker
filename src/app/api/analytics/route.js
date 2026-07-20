import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import LeetCodeLog from '@/models/LeetCodeLog';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get date 7 days ago at midnight
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const logs = await LeetCodeLog.find({
      dateSolved: { $gte: sevenDaysAgo }
    }).select('dateSolved');

    // Initialize counts map for the last 7 days
    const countsMap = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });
      countsMap[dateStr] = 0;
    }

    logs.forEach(log => {
      const dateStr = new Date(log.dateSolved).toLocaleDateString('en-US', { weekday: 'short' });
      if (countsMap[dateStr] !== undefined) {
        countsMap[dateStr]++;
      }
    });

    // Format array and reverse it to be chronological (oldest to newest)
    const data = Object.keys(countsMap).map(key => ({
      date: key,
      count: countsMap[key]
    })).reverse();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
