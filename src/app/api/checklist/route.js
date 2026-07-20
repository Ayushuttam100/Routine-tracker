import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import DailyChecklist from '@/models/DailyChecklist';

function getLocalDateString() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  date.setMinutes(date.getMinutes() - offset);
  return date.toISOString().split('T')[0];
}

const DEFAULT_HABITS = [
  { taskName: 'Heavy Lifting', status: 'red' },
  { taskName: 'LeetCode DSA', status: 'red' },
  { taskName: 'MERN Deep Work', status: 'red' }
];

export async function GET(request) {
  try {
    await connectToDatabase();
    
    const todayStr = getLocalDateString();
    
    // Fetch last 30 days for history
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
    
    const history = await DailyChecklist.find({
      date: { $gte: thirtyDaysAgoStr }
    }).sort({ date: 1 });

    let todayChecklist = history.find(c => c.date === todayStr);

    // Auto-generate if today doesn't exist
    if (!todayChecklist) {
      todayChecklist = new DailyChecklist({
        date: todayStr,
        items: DEFAULT_HABITS
      });
      await todayChecklist.save();
      history.push(todayChecklist);
    }

    return NextResponse.json({ today: todayChecklist, history });
  } catch (error) {
    console.error('Checklist GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch checklist' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectToDatabase();
    const { date, items } = await request.json();
    
    if (!date || !items) {
      return NextResponse.json({ error: 'Date and items are required' }, { status: 400 });
    }

    const updatedChecklist = await DailyChecklist.findOneAndUpdate(
      { date },
      { items },
      { new: true, upsert: true }
    );

    return NextResponse.json(updatedChecklist);
  } catch (error) {
    console.error('Checklist PUT Error:', error);
    return NextResponse.json({ error: 'Failed to update checklist' }, { status: 500 });
  }
}
