import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  email : {type : String},
  name : {type : String},
  username: {type : String},
  googleId: {type : String},
  thumbnailUrl: {type : String}
});

export default mongoose.model('users', UserSchema);
