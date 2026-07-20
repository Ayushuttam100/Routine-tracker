import mongoose from 'mongoose';

const LeetCodeLogSchema = new mongoose.Schema({
  problemId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  optimalApproach: {
    type: String,
    required: true,
  },
  dateSolved: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.LeetCodeLog || mongoose.model('LeetCodeLog', LeetCodeLogSchema);
