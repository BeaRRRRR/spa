import User from '../models/user';

class UserRepository {
  constructor() {
  }

  getAll() {
    return User.find({}).exec();
  }

  getById(id) {
    return User.findById(id).exec();
  }

  getByGoogleId(googleId) {
    return User.findOne({ googleId }).exec();
  }

  getByUsername(username) {
    return User.findOne({ username }).exec();
  }

  save(user) {
    const newUser = new User(user);
    return newUser.save();
  }

  update(filter, doc) {
    return User.update(filter, doc).exec();
  }
}

export default UserRepository;
