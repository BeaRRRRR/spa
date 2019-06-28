import mongoose from 'mongoose';

const { Schema } = mongoose;
const CommentSchema = new Schema({
  postId: { type: Schema.Types.Object },
  authorId: { type: Schema.Types.ObjectId },
  content: { type: String },
  date: { type: String },
});

export default mongoose.model('comments', CommentSchema);
