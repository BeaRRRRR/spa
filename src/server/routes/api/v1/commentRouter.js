import express from 'express';
import mongoose from 'mongoose';
import Comment from '../../../models/comment';

const commentRouter = express.Router();
const {ObjectId} = mongoose.Types;

commentRouter.route('/:postId')
  .get(async (req, res) => {
    console.log('Getting all post comments by postId');
    console.log(req);
    console.log(req.params.postId);
    Comment.find({postId: new ObjectId(req.params.postId)}, (err, comments) => {
      if (err) res.send(500, {error: err});
      else {
        console.log(comments);
        res.json(comments);
      }
    });
  })
  .post(async (req, res) => {
    try {
      console.log('creating a comment');
      console.log(req.body);
      req.body.postId = new ObjectId(req.body.postId);
      const comment = new Comment(req.body);
      await comment.save();
      res.send(201).json(comment);
    } catch (e) {
      console.error(e);
    }
  });

export default commentRouter;
