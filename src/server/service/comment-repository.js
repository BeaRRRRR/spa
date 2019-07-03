import mongoose from 'mongoose';
import Comment from '../models/comment';

const { ObjectId } = mongoose.Types;

class CommentRepository {
  constructor() {
  }

  getAllByPostId(postId) {
    return Comment.find({ postId: new ObjectId(postId) }).exec();
  }

  save(comment) {
    const newComment = new Comment(comment);
    return newComment.save();
  }
}

export default CommentRepository;
