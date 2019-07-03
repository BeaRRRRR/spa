import $ from 'jquery';

class PostRepository {
  constructor() {
  }

  getById(id) {
    return $.get(`/api/v1/posts/${id}`);
  }

  getByPage(page) {
    return $.get(`api/v1/posts?page=${page}`);
  }

  count() {
    return $.get('api/v1/posts/count');
  }

  save(post) {
    return $.post('/api/v1/posts', post, 'json');
  }

  update(post) {
    return $.ajax({
      url: `/api/v1/posts/${post._id}`,
      type: 'PUT',
      data: post,
    });
  }

  delete(id) {
    return $.ajax({
      url: `/api/v1/posts/${id}`,
      type: 'DELETE',
    });
  }
}

export default PostRepository;
