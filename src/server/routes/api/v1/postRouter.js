import express from 'express';
import mongoose from 'mongoose';
import Post from '../../../models/post';

const { ObjectId } = mongoose.Types;

const postRouter = express.Router();

postRouter.route('/')
  .get((req, res) => {
    console.log('Getting all posts');
    Post.find({}, (err, posts) => {
      res.json(posts);
    });
  })
  .post((req, res) => {
    console.log(`Creating a new post ${req.body}`);
    console.log(req.body);
    if (!req.body.authorId || !req.body.title || !req.body.content || !req.body.date || !req.body.readTime) {
      res.status(400).send('Please specify post title,post author and post content');
    } else {
      const newPost = Object.assign(req.body, { liked: [''] });
      const post = new Post(newPost);
      post.save();
      res.status(201).json(post);
    }
  })
  .put((req, res) => {
    if (req.user._id != req.body.authorId) {
      res.status(401);
    }
    console.log('Put request');
    console.log(req.body);
    const id = req.body._id;
    const details = { _id: new ObjectId(id) };
    const post = {
      authorId: new ObjectId(req.body.authorId),
      title: req.body.title,
      content: req.body.content,
      date: req.body.date,
      readTime: req.body.readTime,
      liked: req.body.liked,
    };
    console.log(post);
    Post.update(details, post, (err, response) => {
      if (err) res.send(500, { error: err });
      else res.json(response);
    });
  });

postRouter.route('/:postId')
  .get((req, res) => {
    console.log('Getting the post by id');
    Post.findById(req.params.postId, (err, post) => {
      res.json(post);
    });
  })
  .delete(async (req, res) => {
    let authorId;
    await Post.findById(req.params.postId, (err, post) => {
      authorId = post.authorId;
    });
    // Id's in mongoose need to be compared using ObjectId.equals(),see https://stackoverflow.com/questions/11637353/comparing-mongoose-id-and-strings
    if (!req.user._id.equals(authorId)) {
      res.send(401);
    } else {
      console.log(req.body.id);
      Post.deleteOne({ _id: new ObjectId(req.params.postId) }, (err, response) => {
        if (err) res.send(500, { error: err });
        else res.json(response);
      });
    }
  });
export default postRouter;
