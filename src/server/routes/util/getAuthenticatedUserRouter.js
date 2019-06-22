import express from 'express';

const getAuthenticatedUserRouter = express.Router();

getAuthenticatedUserRouter.route('/')
  .get(async (req, res) => {
    res.json(req.user);
  });
export default getAuthenticatedUserRouter;
