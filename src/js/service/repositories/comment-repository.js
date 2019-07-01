import $ from 'jquery';

class CommentRepository {
  static getAllByPostId(postId) {
    return $.get(`api/v1/comments/${postId}`);
  }

  static save(comment) {
    $.post(`api/v1/comments/${comment.postId}`, comment);
  }
}

export default CommentRepository;
