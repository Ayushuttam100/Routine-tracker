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
    
    if (!Array.isArray(body) && body.id) {
      const updatedPhase = await PhaseDeadline.findByIdAndUpdate(body.id, {
        phaseName: body.phaseName,
        description: body.description,
        targetDate: new Date(body.targetDate),
        totalMilestones: parseInt(body.totalMilestones)
      }, { new: true });
      return NextResponse.json({ message: 'Goal updated', data: updatedPhase });
    }
    
    const updatePromises = body.map(phase => 
      PhaseDeadline.findByIdAndUpdate(phase._id, {
        phaseName: phase.phaseName,
        description: phase.description,
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

