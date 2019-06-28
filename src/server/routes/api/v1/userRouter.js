import express from 'express';
import mongoose from 'mongoose';
import User from '../../../models/user';

const userRouter = express.Router();
const { ObjectId } = mongoose.Types;

userRouter.route('/:userId')
  .get(async (req, res) => {
    console.log('Getting the user by id');
    console.log(req.params.userId);
    const user = await User.findOne({ _id: new ObjectId(req.params.userId) });
    console.log(user);
    res.json(user);
  })
  .put((req, res) => {
    if (!req.user || req.user._id != req.body._id) {
      console.log(req.user);
      console.log(req.body);
      res.send(401);
    } else {
      console.log('Updating user data');
      const id = req.body._id;
      const details = { _id: new ObjectId(id) };
      const user = {
        email: req.body.email,
        name: req.body.name,
        username: req.body.username,
        profileDescription: req.body.profileDescription,
        googleId: req.body.googleId,
        avatar: req.body.avatar,
      };
      console.log(user);
      User.update(details, user, (err, data) => {
        if (err) res.send(500, { error: err });
        res.json(data);
      });
    }
  });
userRouter.route('/:username')
  .get(async (req, res) => {
    console.log('Getting the user by name');
    console.log(req.params.username);
    const user = await User.findOne({ username: req.params.username });
    console.log(user);
    res.json(user);
  });

userRouter.route('/')
  .get(async (req, res) => {
    if (req.query.username) {
      console.log('Getting the user by name');
      console.log(req.query.username);
      const user = await User.findOne({ username: req.query.username });
      console.log(user);
      res.json(user);
    } else {
      User.find({}, (err, users) => {
        if (err) res.send(500, { error: err });
        else res.json(users);
      });
    }
  });
export default userRouter;
