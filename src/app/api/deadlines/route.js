import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import PhaseDeadline from '@/models/PhaseDeadline';

export async function GET() {
  try {
    await connectToDatabase();
    const deadlines = await PhaseDeadline.find({}).sort({ targetDate: 1 });
    return NextResponse.json(deadlines);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch deadlines' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    const updatePromises = body.map(phase => 
      PhaseDeadline.findByIdAndUpdate(phase._id, {
        phaseName: phase.phaseName,
        targetDate: new Date(phase.targetDate),
        totalMilestones: parseInt(phase.totalMilestones)
      }, { new: true })
    );
    
    const updatedPhases = await Promise.all(updatePromises);
    
    return NextResponse.json({ message: 'Goals updated', data: updatedPhases });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update deadlines' }, { status: 500 });
  }
}

