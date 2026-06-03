import mongoose from 'mongoose';

const blockSchema = new mongoose.Schema({
  type: { type: String, required: true },
  order: { type: Number, required: true },
  content: { type: String, default: '' },
  question: String,
  steps: String,
  solution: String,
  hints: [String],
  image: {
    type: { type: String },
    url: String,
    file_size: Number,
    mime_type: String,
  },
}, { _id: false });

const contentNodeSchema = new mongoose.Schema({
  node_id: { type: String, required: true, unique: true },
  estimated_duration_minutes: { type: Number, default: 15 },
  version: { type: Number, default: 1 },
  version_status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], default: 'PUBLISHED' },
  search_text: { type: String, default: '' },
  blocks: [blockSchema],
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const ContentNode = mongoose.model('ContentNode', contentNodeSchema);
