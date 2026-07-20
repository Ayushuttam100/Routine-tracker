const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env.local');
  process.exit(1);
}

const PhaseDeadlineSchema = new mongoose.Schema({
  phaseName: { type: String, required: true },
  targetDate: { type: Date, required: true },
  milestonesCompleted: { type: Number, default: 0 },
  totalMilestones: { type: Number, required: true },
  description: { type: String, required: false },
});

const PhaseDeadline = mongoose.models.PhaseDeadline || mongoose.model('PhaseDeadline', PhaseDeadlineSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await PhaseDeadline.deleteMany({});
    console.log('Cleared existing PhaseDeadlines');

    const now = new Date();
    
    const phases = [
      {
        phaseName: 'Phase 1: Foundation',
        targetDate: new Date(new Date().setMonth(now.getMonth() + 2)),
        milestonesCompleted: 0,
        totalMilestones: 5,
        description: 'React, Node.js, and DBMS foundations.',
      },
      {
        phaseName: 'Phase 2: Advanced Concepts',
        targetDate: new Date(new Date().setMonth(now.getMonth() + 4)),
        milestonesCompleted: 0,
        totalMilestones: 8,
        description: 'Advanced Next.js, authentication, and core subjects (OS/Networking).',
      },
      {
        phaseName: 'Phase 3: Mastery & Interviews',
        targetDate: new Date(new Date().setMonth(now.getMonth() + 6)),
        milestonesCompleted: 0,
        totalMilestones: 10,
        description: 'System design and intensive AKTU exam preparation.',
      }
    ];

    await PhaseDeadline.insertMany(phases);
    console.log('Successfully seeded database with 3 phases');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
