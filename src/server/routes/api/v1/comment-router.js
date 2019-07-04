import express from 'express';
import mongoose from 'mongoose';
import CommentRepository from '../../../service/comment-repository';

const commentRouter = express.Router();
const { ObjectId } = mongoose.Types;
const commentRepository = new CommentRepository();

commentRouter.route('/:postId')
  .get(async (req, res) => {
    // Getting all comments by id of the post they belong to
    commentRepository.getAllByPostId(req.params.postId)
      .then(data => res.json(data))
      .catch(err => res.send(500, { error: err }));
  })
  .post(async (req, res) => {
    // Only authorized users can leave comments
    if (req.user) {
      res.sendStatus(401);
    }
    req.body.postId = new ObjectId(req.body.postId);
    commentRepository.save(req.body)
      .then(data => res.send(201).json(data))
      .catch(err => res.send(500, { error: err }));
  });

export default commentRouter;
