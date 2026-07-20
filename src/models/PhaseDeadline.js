import mongoose from 'mongoose';

const PhaseDeadlineSchema = new mongoose.Schema({
  phaseName: {
    type: String,
    required: true,
  },
  targetDate: {
    type: Date,
    required: true,
  },
  milestonesCompleted: {
    type: Number,
    default: 0,
  },
  totalMilestones: {
    type: Number,
    required: true,
  },
});

export default mongoose.models.PhaseDeadline || mongoose.model('PhaseDeadline', PhaseDeadlineSchema);
