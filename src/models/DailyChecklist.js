import mongoose from 'mongoose';

const ChecklistItemSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['red', 'orange', 'green'], 
    default: 'red' 
  },
});

const DailyChecklistSchema = new mongoose.Schema({
  date: { 
    type: String, 
    required: true, 
    unique: true 
  },
  items: [ChecklistItemSchema],
});

export default mongoose.models.DailyChecklist || mongoose.model('DailyChecklist', DailyChecklistSchema);
