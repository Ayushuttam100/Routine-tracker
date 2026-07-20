import mongoose from 'mongoose';

const YouTubeLogSchema = new mongoose.Schema({
  videoTitle: { 
    type: String, 
    required: true 
  },
  url: { 
    type: String, 
    required: false 
  },
  durationWatched: { 
    type: Number, 
    required: true // in minutes
  },
  category: { 
    type: String, 
    required: true,
  },
  watchedAt: { 
    type: Date, 
    default: Date.now 
  },
});

export default mongoose.models.YouTubeLog || mongoose.model('YouTubeLog', YouTubeLogSchema);
