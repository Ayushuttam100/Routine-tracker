import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import DailyTask from '@/models/DailyTask';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Only fetch tasks from the last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const tasks = await DailyTask.find({
      createdAt: { $gte: twentyFourHoursAgo }
    }).sort({ createdAt: -1 });
    
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const task = await DailyTask.create(body);
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { _id, ...updateData } = body;
    
    if (!_id) {
      return NextResponse.json({ error: 'Missing task ID' }, { status: 400 });
    }

    const updatedTask = await DailyTask.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing task ID' }, { status: 400 });
    }

    await DailyTask.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
