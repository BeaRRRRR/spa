import express from 'express';

const settingRouter = express.Router();

settingRouter.route('/')
  .get(async (req, res) => {
    console.log('user profile');
    console.log(req.user);
    res.json(req.user);
  });
export default settingRouter;
