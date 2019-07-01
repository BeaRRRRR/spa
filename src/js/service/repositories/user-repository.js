import $ from 'jquery';

class UserRepository {
  static getAll() {
    return $.get('api/v1/users');
  }

  static getById(id) {
    return $.get(`api/v1/users/${id}`);
  }

  static getByUsername(username) {
    return $.get(`/api/v1/users/?username=${username}`);
  }

  static update(user) {
    return $.ajax({
      url: `/api/v1/users/${user._id}`,
      type: 'PUT',
      data: user,
    });
  }
}

export default UserRepository;
