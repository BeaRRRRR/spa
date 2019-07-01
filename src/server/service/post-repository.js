import mongoose from 'mongoose';
import Post from '../models/post';

const { ObjectId } = mongoose.Types;

class PostRepository {
  constructor() {
  }

  getAll(page) {
    console.log(page);
    if (page) return Post.find({}, null, { skip: (page - 1) * 10, limit: 10 }).exec();
    return Post.find({}).exec();
  }

  getById(id) {
    return Post.findById(id).exec();
  }

  save(post) {
    const newPost = new Post(post);
    return newPost.save();
  }

  update(where, post) {
    return Post.update(where, post).exec();
  }

  deleteById(id) {
    return Post.deleteOne({ _id: new ObjectId(id) }).exec();
  }

  count() {
    return Post.count({}).exec();
  }
}

export default PostRepository;
