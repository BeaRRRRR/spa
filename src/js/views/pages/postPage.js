import $ from 'jquery';
import utils from '../../service/utils';

async function getPost() {
  const id = utils.parseUrl().postName;
  const response = await fetch(`/api/v1/posts/${id}`);
  const json = await response.json();
  return json;
}

const updatePost = async (newPost) => {
  console.log(newPost);
  await $.ajax({
    url: '/api/v1/posts',
    type: 'PUT',
    data: newPost,
    success(data) {
      console.log('Load was performed.');
      console.log(data);
    },
    // contentType : 'application/json'
  });
};
const getAuthor = async (post) => {
  const author = await $.get(`api/v1/users/${post.authorId}`);
  return author;
};

async function getUserById(userId) {
  const user = await $.get(`api/v1/users/${userId}`);
  return user;
}


async function getComments(post) {
  const comments = await $.get(`api/v1/comments/${post._id}`);
  return comments;
}


const postPage = {
  async render() {
    const post = await getPost();
    const author = await getAuthor(post);
    const comments = await getComments(post);
    const user = await utils.getAuthenticatedUser();
    const isLiked = post.liked.includes(user._id);
    let commentsHtml =await Promise.all(comments.map(async (comment) => {
      let author = await getUserById(comment.authorId);
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
              <a id="edit" class="btn btn-outline-dark" href="#/new?editId=${post._id}">Edit</a>
              <a id="delete" class="btn btn-outline-danger">Delete</a>
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
  }
  ,
  afterRender: async () => {
    const post = await getPost();
    console.log(post);
    const user = await utils.getAuthenticatedUser();
    $(document).on('click', '#heartIcon', async () => {
      console.log('clicked');
      if (post.liked.includes(user._id)) {
        $('#heartIcon').removeClass('fas');
        $('#heartIcon').addClass('far');
        post.liked.splice(post.liked.indexOf(user._id), 1);
      }
      // else if(post.liked == null){
      //   post.liked = [user._id];
      //   $('#heartIcon').removeClass('far');
      //   $('#heartIcon').addClass('fas');
      // }
      else {
        post.liked.push(user._id);
        $('#heartIcon').removeClass('far');
        $('#heartIcon').addClass('fas');
      }
      updatePost(post);
      $('#likesCount').text(
        `Likes : ${post.liked.length - 1}`
      );
    });
    $('#delete').on('click', async () => {
      const confirmed = confirm('You are sure you want to delete this post');
      if (confirmed) {
        await $.ajax({
          url:
            `/api/v1/posts/${post._id}`
          ,
          type: 'DELETE',
          success(data) {
            console.log('The post was deleted');
            console.log(data);
            window.location.href = '#';
          },
        });
      }
    });
    $('#newCommentForm').on('submit', async (event) => {
      event.preventDefault();
      const content = $('#commentContentInput').val();
      const date = new Date().toLocaleDateString();
      await $.post(
        `api/v1/comments/${post._id}`
        ,
        {
          postId: post._id,
          authorId: user._id,
          content,
          date,
        },
        (data) => {
          console.log(data);
        });
    });
  },
};

export default postPage;
