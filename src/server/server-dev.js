import path from 'path';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import passport from 'passport';
import cookieSession from 'cookie-session';
import 'babel-polyfill';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from '../../webpack.dev.config';
import postRouter from './routes/api/v1/postRouter';
import userRouter from './routes/api/v1/userRouter';
import commentRouter from './routes/api/v1/commentRouter';
import settingRouter from './routes/settingRouter';
import getAutheticatedUserRouter from './routes/util/getAuthenticatedUserRouter';
import authentication from './routes/authentication';
import './config/passport-config';

const db = mongoose.connect('mongodb://localhost/spa-db', { useNewUrlParser: true });


const app = express();


const DIST_DIR = __dirname;


const HTML_FILE = path.join(DIST_DIR, 'index.html');


const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
}));
app.use(webpackHotMiddleware(compiler));

app.use(cors());

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: ['mykey'],
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
  compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
    if (err) {
      return next(err);
    }
    res.set('content-type', 'text/html');
    res.send(result);
    res.end();
  });
});

app.use('/auth/google', authentication);
app.use('/getAuthenticatedUser', getAutheticatedUserRouter);
app.use('/profile', settingRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/comments', commentRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`App listening to ${PORT}....`);
  console.log('Press Ctrl+C to quit.');
});
