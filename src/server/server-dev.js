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
import postRouter from './routes/api/v1/post-router';
import userRouter from './routes/api/v1/user-router';
import commentRouter from './routes/api/v1/comment-router';
import getAutheticatedUserRouter from './routes/util/get-authenticated-user-router';
import authentication from './routes/auth/authentication';
import './config/passport-config';

// Use this example to connect to the database that is installed locally
// const db = mongoose.connect('mongodb://localhost/spa-db', { useNewUrlParser: true });

const db = mongoose.connect('mongodb+srv://BeaRRRRR:root@cluster0-gq7hv.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true });

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

app.use('/auth', authentication);
app.use('/getAuthenticatedUser', getAutheticatedUserRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/comments', commentRouter);

const PORT = process.env.PORT || 8080;

db.then(() => {
  app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`);
    console.log('Press Ctrl+C to quit.');
  });
});
