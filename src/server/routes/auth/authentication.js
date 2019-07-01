import express from 'express';
// import passport from 'passport';
import googleAuthRouter from './strategies/google-auth';

const authRouter = express.Router();

authRouter.use('/google', googleAuthRouter);

authRouter.route('/logout')
  .get((req, res) => {
    req.logout();
    res.redirect('/');
  });

export default authRouter;
