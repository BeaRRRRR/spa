import $ from 'jquery';
import utils from '../../service/utils';

async function getPost() {
  let id = utils.parseUrl().postName;
  const response = await fetch(`/api/v1/posts/${id}`);
  const json = await response.json();
  return json;
}

const updatePost = async (newPost) => {
  console.log(newPost);
  $.ajax({
    url: '/api/v1/posts',
    type: 'PUT',
    data: newPost,
    success: function (data) {
      console.log('Load was performed.');
      console.log(data);
    }
    // contentType : 'application/json'
  });
};
const getAuthor = async (post) => {
  const author = await $.get(`api/v1/users/${post.author}`);
  return author;
};


let postPage = {
  render: async function () {
    let post = await getPost();
    let author = await getAuthor(post);
    let user = await utils.getAuthenticatedUser();
    let isLiked = post.liked.includes(user._id);
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
              <h6 id="likesCount">Likes : ${post.liked.length-1}</h6>
              <button id="likeButton" type="button">
                <span id="heartIcon" class="${isLiked ? 'fas' : 'far'} fa-heart"></span>
              </button>
            </div>`;
  },
  afterRender: async () => {
    let post = await getPost();
    console.log(post);
    let user = await utils.getAuthenticatedUser();
    $('#likeButton').on('click', async function () {
      if (post.liked.includes(user._id)) {
        $('#heartIcon').removeClass('fas');
        $('#heartIcon').addClass('far');
        post.liked.splice(post.liked.indexOf(user._id), 1);
      } else {
        post.liked.push(user._id);
        $('#heartIcon').removeClass('far');
        $('#heartIcon').addClass('fas');
      }
      await updatePost(post);
      $('#likesCount').text(`Likes : ${post.liked.length-1}`)
    });
  }
};

export default postPage;
