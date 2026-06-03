import mongoose from 'mongoose';

const userNoteSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  node_id: { type: String, required: true },
  title: { type: String, default: '' },
  markdown_content: { type: String, default: '' },
  tags: [String],
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

userNoteSchema.index({ user_id: 1, node_id: 1 }, { unique: true });

export const UserNote = mongoose.model('UserNote', userNoteSchema);
