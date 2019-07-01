import express from 'express';

const getAuthenticatedUserRouter = express.Router();

getAuthenticatedUserRouter.route('/')
  .get(async (req, res) => {
    if (req.user) {
      res.json(req.user);
    } else {
      res.json(false);
    }
  });
export default getAuthenticatedUserRouter;
