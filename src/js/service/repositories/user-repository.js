import $ from 'jquery';

class UserRepository {
  constructor() {
  }

  getAll() {
    return $.get('api/v1/users');
  }

  getById(id) {
    return $.get(`api/v1/users/${id}`);
  }

  getByUsername(username) {
    return $.get(`/api/v1/users/?username=${username}`);
  }

  update(user) {
    return $.ajax({
      url: `/api/v1/users/${user._id}`,
      type: 'PUT',
      data: user,
    });
  }
}

export default UserRepository;
