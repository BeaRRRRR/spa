import mongoose from 'mongoose';

const { Schema } = mongoose;

const PostSchema = new Schema({
  title: { type: String },
  authorId: { type: Schema.Types.ObjectId },
  content: { type: String },
  date: { type: String },
  readTime: { type: Number },
  liked: [],
});

export default mongoose.model('posts', PostSchema);
