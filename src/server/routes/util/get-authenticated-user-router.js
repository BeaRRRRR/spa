import express from 'express';

const getAuthenticatedUserRouter = express.Router();

getAuthenticatedUserRouter.route('/')
  .get(async (req, res) => {
    // If the current user is logged in - return it, false otherwise
    if (req.user) {
      res.json(req.user);
    } else {
      res.json(false);
    }
  });
export default getAuthenticatedUserRouter;
