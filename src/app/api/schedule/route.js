import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ScheduleBlock from '@/models/ScheduleBlock';

export async function GET() {
  try {
    await connectToDatabase();
    const blocks = await ScheduleBlock.find({}).sort({ startTime: 1 });
    return NextResponse.json(blocks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch schedule blocks' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const block = await ScheduleBlock.create(body);
    return NextResponse.json(block, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create schedule block' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { _id, ...updateData } = body;
    
    if (!_id) {
      return NextResponse.json({ error: 'Missing block ID' }, { status: 400 });
    }

    const updatedBlock = await ScheduleBlock.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(updatedBlock);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update schedule block' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing block ID' }, { status: 400 });
    }

    await ScheduleBlock.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Block deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete schedule block' }, { status: 500 });
  }
}
