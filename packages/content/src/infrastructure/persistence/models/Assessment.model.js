import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
  context_type: { type: String, required: true },
  title: { type: String, required: true },
  state: { type: String, enum: ['active', 'inactive', 'archived'], default: 'active' },
  target_nodes: [String],
  difficulty_level: { type: Number, default: 1 },
  time_limit_minutes: { type: Number, default: 30 },
  passing_score: { type: Number, default: 70 },
  max_attempts: { type: Number, default: 3 },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const Assessment = mongoose.model('Assessment', assessmentSchema);
