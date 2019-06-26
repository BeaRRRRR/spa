import express from 'express';
import mongoose from 'mongoose';
import User from './../../../models/user';

const userRouter = express.Router();
const ObjectId = mongoose.Types.ObjectId;

userRouter.route('/:username')
  .get(async (req, res) => {
    console.log('Getting the user by name');
    console.log(req.params.username);
    let user = await User.findOne({username: req.params.username});
    console.log(user);
    res.json(user);
  })
  .put((req, res) => {
    if (!req.user || req.user._id != req.body._id) {
      console.log(req.user);
      console.log(req.body);
      res.send(401);
    }
    else {
      console.log('Updating user data');
      const id = req.body._id;
      const details = {'_id': new ObjectId(id)};
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
        if (err) res.send(500,{error : err});
        res.json(data);
      });
    }
  });
userRouter.route('/')
  .get((req,res) => {
    User.find({},(err,users) => {
      if(err) res.send(500,{error : err});
      else res.json(users);
    })
  });
export default userRouter;
