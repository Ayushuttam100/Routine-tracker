import mongoose from 'mongoose';

const ScheduleBlockSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  activityTitle: {
    type: String,
    required: true,
  },
  focusArea: {
    type: String,
    required: true,
  },
});

// Avoid compiling model multiple times in Next.js development
export default mongoose.models.ScheduleBlock || mongoose.model('ScheduleBlock', ScheduleBlockSchema);
