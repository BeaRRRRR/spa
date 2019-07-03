import $ from 'jquery';
import utils from '../../service/utils';
import PostRepository from '../../service/repositories/post-repository';
import UserRepository from '../../service/repositories/user-repository';
import CommentRepository from '../../service/repositories/comment-repository';

const postRepository = new PostRepository();
const userRepository = new UserRepository();
const commentRepository = new CommentRepository();

let post;
let authenticatedUser;

const postPage = {
  async render() {
    const postPromise = postRepository.getById(utils.parseUrl().postName)
      .then(async (post) => {
        const [author, comments] = await Promise.all([userRepository.getById(post.authorId), commentRepository.getAllByPostId(post._id)]);
        return [post, author, comments];
      });
    const [[_post, author, comments], _authenticatedUser] = await Promise.all([postPromise, utils.getAuthenticatedUser()]);
    post = _post;
    authenticatedUser = _authenticatedUser;
    const isLiked = post.liked.includes(authenticatedUser._id);
    let commentsHtml = await Promise.all(comments.map(async (comment) => {
      const author = await userRepository.getById(comment.authorId);
      return `<div class="comment card">
                     <div class="card-body">
                       <h6 class="card-subtitle mb-2 text-muted">Wrote by 
                         <a href="#/users/${author.username}">${author.name}</a>
                       </h6>
                       ${comment.content}
                     </div>
                   </div>`;
    }));
    commentsHtml = commentsHtml.join('\n');
    return `<div class="container">
              <div class="post container">
                <div class="card" style="border : 0 !important">
                 <div class="card-body">
                  <h5 class="card-title">${post.title}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">
                    Written by <a href="#/users/${author.username}">${author.name}</a> on ${post.date}
                  </h6>
                  ${post.content}
                 </div>
                </div>
              </div>
              <h6>
                <span id="heartIcon" class="${isLiked ? 'fas' : 'far'} fa-heart"></span>
                <span id="likeCount">${post.liked.length - 1}</span>
              </h6>
              ${authenticatedUser._id == post.authorId ? `
              <a id="edit" class="btn btn-outline-dark" href="#/new?editId=${post._id}">Edit</a>
              <a id="delete" class="btn btn-outline-danger">Delete</a>` : ''}
              <div class="container">
                <form id="newCommentForm">
                  <div class="form-group">
                    <label for="comment">${_authenticatedUser ? 'Write a comment' : 'Only authorized users can write comments'}</label>
                    <input id="commentContentInput" name="commentContentInput" type="text" class="form-control" ${authenticatedUser ? '' : 'disabled'}>
                  </div>
                  <button type="submit" class="btn btn-light">Send</button>
                </form>
                ${commentsHtml} 
              </div>
              </div>`;
  },
  afterRender: async () => {
    console.log(post);
    $(document).on('click', '#heartIcon', async () => {
      console.log('clicked');
      if (post.liked.includes(authenticatedUser._id)) {
        $('#heartIcon').removeClass('fas');
        $('#heartIcon').addClass('far');
        post.liked.splice(post.liked.indexOf(authenticatedUser._id), 1);
      } else {
        post.liked.push(authenticatedUser._id);
        $('#heartIcon').removeClass('far');
        $('#heartIcon').addClass('fas');
      }
      postRepository.update(post);
      $('#likeCount').text(
        `${post.liked.length - 1}`,
      );
    });
    $('#delete').on('click', async () => {
      const confirmed = confirm('You are sure you want to delete this post');
      if (confirmed) {
        postRepository.delete(post._id)
          .then(() => {
            window.location.href = '#';
          });
      }
    });
    $('#newCommentForm').on('submit', async (event) => {
      event.preventDefault();
      const content = $('#commentContentInput').val();
      const date = new Date().toLocaleDateString();
      commentRepository.save({
        postId: post._id,
        authorId: authenticatedUser._id,
        content,
        date,
      });
    });
  },
};

export default postPage;
