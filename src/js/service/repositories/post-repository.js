import $ from 'jquery';

class PostRepository {
  static getById(id) {
    return $.get(`/api/v1/posts/${id}`);
  }

  static getByPage(page) {
    return $.get(`api/v1/posts?page=${page}`);
  }

  static count() {
    return $.get('api/v1/posts/count');
  }

  static save(post) {
    return $.post('/api/v1/posts', post, 'json');
  }

  static update(post) {
    return $.ajax({
      url: `/api/v1/posts/${post._id}`,
      type: 'PUT',
      data: post,
    });
  }

  static delete(id) {
    return $.ajax({
      url: `/api/v1/posts/${id}`,
      type: 'DELETE',
    });
  }
}

export default PostRepository;
