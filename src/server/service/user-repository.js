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

  getByUsername(username) {
    return User.findOne({ username }).exec();
  }

  update(filter, doc) {
    return User.update(filter, doc).exec();
  }
}

export default UserRepository;
