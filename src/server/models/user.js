import mongoose from 'mongoose';

const { Schema } = mongoose;
const UserSchema = new Schema({
  email: { type: String },
  name: { type: String },
  username: { type: String },
  profileDescription: { type: String },
  googleId: { type: String },
  avatar: { type: String },
});

export default mongoose.model('users', UserSchema);
