import express from 'express';
import mongoose from 'mongoose';
import PostRepository from '../../../service/post-repository';

const { ObjectId } = mongoose.Types;

const postRouter = express.Router();
const postRepository = new PostRepository();

postRouter.route('/')
  .get(async (req, res) => {
    // Getting all posts
    postRepository.getAll(req.query.page)
      .then(data => res.json(data))
      .catch(err => console.log(err));
  })
  .post(async (req, res) => {
    if (!req.body.authorId || !req.body.title || !req.body.content || !req.body.date || !req.body.readTime) {
      res.status(400).send('Please specify post title,post author and post content');
    } else {
      console.log(req.body);
      const newPost = Object.assign(req.body, { liked: [''] });
      postRepository.save(newPost)
        .then(post => res.status(201).json(post))
        .catch(err => res.send(500, { error: err }));
    }
  });

postRouter.route('/count')
  .get((req, res) => {
    // Count all the posts available for pagination
    postRepository.count()
      .then(data => res.send(data.toString()))
      .catch(err => res.send(500, { error: err }));
  });
postRouter.route('/:postId')
  .get((req, res) => {
    // Getting the post by id
    postRepository.getById(req.params.postId)
      .then(data => res.json(data))
      .catch(err => res.send(500, { error: err }));
  })
  .put((req, res) => {
    // Only authorized authors of post can change its content
    if (req.user._id != req.body.authorId) {
      res.sendStatus(401);
    }
    console.log('Put request');
    const id = req.body._id;
    const filter = { _id: new ObjectId(id) };
    const doc = {
      authorId: new ObjectId(req.body.authorId),
      title: req.body.title,
      content: req.body.content,
      date: req.body.date,
      readTime: req.body.readTime,
      liked: req.body.liked,
    };
    console.log(doc);
    postRepository.update(filter, doc)
      .then(data => res.json(data))
      .catch(err => res.send(500, { error: err }));
  })
  .delete(async (req, res) => {
    const { authorId } = await postRepository.getById(req.params.postId);
    if (!req.user._id.equals(authorId)) {
      res.sendStatus(401);
    } else {
      console.log(req.body.id);
      postRepository.deleteById(req.body.id)
        .then(res.sendStatus(200))
        .catch(err => res.status(500).send({ error: err }));
    }
  });

export default postRouter;
