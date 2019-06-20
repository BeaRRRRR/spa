import express from 'express';
import Post from '../../../models/post';

const postRouter = express.Router();

postRouter.route('/')
  .get((req, res) => {
    console.log('Getting all posts');
    Post.find({}, (err, posts) => {
      res.json(posts);
    });
  })
  .post((req, res) => {
    console.log('Creating a new post ' + req.body.author);
    let post = new Post(req.body);
    post.save();
    res.status(201).send(post);
  });
postRouter.get('/:postId', (req, res) => {
  console.log('Getting the post by id');
  Post.findById(req.params.postId, (err, post) => {
    res.json(post);
  });
});
export default postRouter;
