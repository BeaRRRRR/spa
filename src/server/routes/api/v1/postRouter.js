import express from 'express';
import Post from '../../../models/post';
import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

const postRouter = express.Router();

postRouter.route('/')
  .get((req, res) => {
    console.log('Getting all posts');
    Post.find({}, (err, posts) => {
      res.json(posts);
    });
  })
  .post((req, res) => {
    console.log('Creating a new post ' + req.body);
    console.log(req.body);
    if (!req.body.author || !req.body.title || !req.body.content || !req.body.date || !req.body.readTime) {
      res.status(400).send('Please specify post title,post author and post content');
    } else {
      let newPost = Object.assign(req.body, {liked: []});
      let post = new Post(req.body);
      post.save();
      res.status(201).json(post);
    }
  })
  .put((req, res) => {
    console.log('Put request');
    console.log(req.body);
    const id = req.body._id;
    const details = {'_id': new ObjectId(id)};
    const post = {
      author: req.body.author,
      title: req.body.title,
      content: req.body.content,
      date: req.body.date,
      readTime: req.body.readTime,
      liked : req.body.liked
    };
    console.log(post);
    Post.update(details, post, (err, response) => {
      if (err) res.send(500, {error: err});
      else res.json(response);
    });
  })
  .delete((req,res) => {
    Post.deleteOne({_id : new ObjectId(req.body.id)},function (err, response) {
      if(err) res.send(500,{error : err});
      else res.json(response);
    })
  });
postRouter.get('/:postId', (req, res) => {
  console.log('Getting the post by id');
  Post.findById(req.params.postId, (err, post) => {
    res.json(post);
  });
});
export default postRouter;
