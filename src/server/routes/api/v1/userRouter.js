import express from 'express';
import User from './../../../models/user';

const userRouter = express.Router();

userRouter.route('/:username')
  .get(async (req, res) => {
  console.log('Getting the user by name');
  console.log(req.params.username);
  let username = req.params.username.replace(/-/g, ' ');
  console.log(username);
  let user = await User.findOne({username: req.params.username});
  console.log(user);
  res.json(user);
});
export default userRouter;
