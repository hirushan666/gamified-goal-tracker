import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Goal', goalSchema);
