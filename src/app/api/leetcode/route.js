import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import LeetCodeLog from '@/models/LeetCodeLog';

export async function GET() {
  try {
    await connectToDatabase();
    const logs = await LeetCodeLog.find({}).sort({ dateSolved: -1 }).limit(5);
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const log = await LeetCodeLog.create(body);
    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create log' }, { status: 500 });
  }
}
