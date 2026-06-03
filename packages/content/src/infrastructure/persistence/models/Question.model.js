import mongoose from 'mongoose';

const dataSchema = new mongoose.Schema({
  question_text: String,
  variables: mongoose.Schema.Types.Mixed,
  options: [String],
  correct_answer: mongoose.Schema.Types.Mixed,
  explanation: String,
}, { _id: false });

const questionSchema = new mongoose.Schema({
  evaluation_id: { type: String, required: true },
  state: { type: String, enum: ['active', 'inactive', 'archived'], default: 'active' },
  related_node_id: { type: String, default: null },
  bloom_level: { type: String, default: 'APPLY' },
  question_type: { type: String, required: true },
  data: { type: dataSchema, default: () => ({}) },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

questionSchema.index({ evaluation_id: 1 });
questionSchema.index({ related_node_id: 1 });

export const Question = mongoose.model('Question', questionSchema);
