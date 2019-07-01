import express from 'express';
import mongoose from 'mongoose';
import UserRepository from '../../../service/user-repository';
// import User from '../../../models/user';

const userRouter = express.Router();
const { ObjectId } = mongoose.Types;
const userRepository = new UserRepository();

userRouter.route('/:userId')
  .get(async (req, res) => {
    console.log('Getting the user by id');
    userRepository.getById(req.params.userId)
      .then(data => res.json(data))
      .catch(err => res.send(500, { error: err }));
  })
  .put((req, res) => {
    if (!req.user || req.user._id != req.body._id) {
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
      userRepository.update(details, user)
        .then(data => res.json(data))
        .catch(err => res.send(500, { error: err }));
    }
  });

userRouter.route('/')
  .get(async (req, res) => {
    if (req.query.username) {
      console.log('Getting the user by name');
      userRepository.getByUsername(req.query.username)
        .then(data => res.json(data))
        .catch(err => res.send(500, { error: err }));
    } else {
      userRepository.getAll()
        .then(data => res.json(data))
        .catch(err => res.send(500, { error: err }));
    }
  });
export default userRouter;
