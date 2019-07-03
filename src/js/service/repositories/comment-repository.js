import $ from 'jquery';

class CommentRepository {
  constructor() {
  }

  getAllByPostId(postId) {
    return $.get(`api/v1/comments/${postId}`);
  }

  save(comment) {
    $.post(`api/v1/comments/${comment.postId}`, comment);
  }
}

export default CommentRepository;
