import $ from 'jquery';
import utils from '../../service/utils';
import postRepository from '../../service/repositories/post-repository';
import userRepository from '../../service/repositories/user-repository';
import commmentRepository from '../../service/repositories/comment-repository';

const postPage = {
  async render() {
    const date1 = new Date();
    const [post, user] = await Promise.all([postRepository.getById(utils.parseUrl().postName), utils.getAuthenticatedUser()]);
    const [author, comments] = await Promise.all([userRepository.getById(post.authorId), commmentRepository.getAllByPostId(post._id)]);
    const isLiked = post.liked.includes(user._id);
    const date2 = new Date();
    console.log(date2 - date1);
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
              <h6 id="likesCount">Likes : ${post.liked.length - 1}</h6>
              <span id="heartIcon" class="${isLiked ? 'fas' : 'far'} fa-heart"></span>
              ${user._id == post.authorId ? `
              <a id="edit" class="btn btn-outline-dark" href="#/new?editId=${post._id}">Edit</a>
              <a id="delete" class="btn btn-outline-danger">Delete</a>` : ''}
              <div class="container">
                <form id="newCommentForm">
                  <div class="form-group">
                    <label for="comment">Write a comment</label>
                    <input id="commentContentInput" name="commentContentInput" type="text" class="form-control">
                  </div>
                  <button type="submit" class="btn btn-light">Send</button>
                </form>
                ${commentsHtml} 
              </div>
              </div>`;
  },
  afterRender: async () => {
    const post = postRepository.getById(utils.parseUrl().postName);
    console.log(post);
    const user = await utils.getAuthenticatedUser();
    $(document).on('click', '#heartIcon', async () => {
      console.log('clicked');
      if (post.liked.includes(user._id)) {
        $('#heartIcon').removeClass('fas');
        $('#heartIcon').addClass('far');
        post.liked.splice(post.liked.indexOf(user._id), 1);
      }
      else {
        post.liked.push(user._id);
        $('#heartIcon').removeClass('far');
        $('#heartIcon').addClass('fas');
      }
      postRepository.update(post);
      $('#likesCount').text(
        `Likes : ${post.liked.length - 1}`,
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
      commmentRepository.save({
        postId: post._id,
        authorId: user._id,
        content,
        date,
      });
    });
  },
};

export default postPage;
