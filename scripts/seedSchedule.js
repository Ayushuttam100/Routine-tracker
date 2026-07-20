const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env.local');
  process.exit(1);
}

const ScheduleBlockSchema = new mongoose.Schema({
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  activityTitle: { type: String, required: true },
  focusArea: { type: String, required: true },
});

const ScheduleBlock = mongoose.models.ScheduleBlock || mongoose.model('ScheduleBlock', ScheduleBlockSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await ScheduleBlock.deleteMany({});
    console.log('Cleared existing ScheduleBlocks');

    const blocks = [
      { startTime: "05:30", endTime: "07:30", activityTitle: "Heavy Lifting & Gym Training", focusArea: "Physical" },
      { startTime: "07:30", endTime: "08:30", activityTitle: "Eggetarian Breakfast & Commute", focusArea: "Recovery" },
      { startTime: "08:30", endTime: "16:30", activityTitle: "PSIT College Academics", focusArea: "University" },
      { startTime: "16:30", endTime: "18:00", activityTitle: "DSA & LeetCode Practice", focusArea: "Problem Solving" },
      { startTime: "18:00", endTime: "20:00", activityTitle: "MERN Stack Development", focusArea: "Deep Work 1" },
      { startTime: "20:00", endTime: "21:00", activityTitle: "Dinner & Downtime - Anime/Cinema", focusArea: "Rest" },
      { startTime: "21:00", endTime: "22:30", activityTitle: "AKTU Prep - Java, Automata, OS", focusArea: "Deep Work 2" },
      { startTime: "22:30", endTime: "23:00", activityTitle: "Blueprint Review & Sleep", focusArea: "Planning" }
    ];

    await ScheduleBlock.insertMany(blocks);
    console.log('Successfully seeded database with schedule blocks');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
