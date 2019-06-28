import $ from 'jquery';
import showdown from 'showdown';
import utils from '../../service/utils';

const converter = new showdown.Converter();
let isEditing = false;
let post;
const getAuthenticatedUser = async () => {
  const response = await $.get('/getAuthenticatedUser');
  return response;
};
const getPost = async (id) => {
  const post = await $.get(`/api/v1/posts/${id}`);
  return post;
};

const newPostPage = {
  async render() {
    const { resource } = utils.parseUrl();
    const editId = resource.substr(11);
    let html;
    if (editId) {
      isEditing = true;
      post = await getPost(editId);
      html = converter.makeMarkdown(post.content);
      console.log(post);
    }
    return `<div class="container">
              <form id="newPostForm">
                <div class="post container" id="post">
                  <div id="form-body" class="form-group">
                    <textarea class="post-title form-control" name="title" id="title" type="text" placeholder="Title" rows="1">${editId ? post.title : ''}</textarea>
                    <textarea class="post-content form-control" name="textarea" id="textarea" type="text"
                              placeholder="Write your markdown here" rows="8">${editId ? html : ''}</textarea>
                  </div>
                </div>
                <div class="container" style="display: flex; justify-content: flex-end">
                  <button type="button" id="preview" class="btn btn-outline-secondary">Preview</button>
                  <button type="submit" id="publish" class="btn btn-outline-primary">Publish</button>
                </div>
              </form>
            </div>`;
  },
  async afterRender() {
    $('textarea').autoResize();
    let markdown;
    let title;
    const $previewButton = $('#preview');
    $previewButton.on('click', () => {
      console.log('click');
      if ($previewButton.hasClass('btn-outline-secondary')) {
        title = $('#title').val();
        markdown = $('#textarea').val();
        const html = converter.makeHtml(markdown);
        $('#post').html(`<div class="card" style="border : 0 !important;">
                            <div class="card-body">
                              <h5 class="card-title">${title}</h5>
                              ${html}
                            </div> 
                          </div>`);
      } else {
        console.log(markdown);
        $('#post').html(`<form>
                  <div id="form-body" class="form-group">
        		      	<textarea class="post-title form-control" name="title" id="title" type="text" placeholder="Title" rows="1"></textarea>
        		      	<textarea class="post-content form-control" name="textarea" id="textarea" type="text" placeholder="Write your markdown here" rows="8"></textarea>
        		      </div>
        		    </form>`);
        $('textarea').autoResize();
        $('#textarea').val(markdown);
        $('#title').val(title);
      }
      $previewButton.toggleClass('btn-outline-secondary');
      $previewButton.toggleClass('btn-secondary');
    });
    $('#newPostForm').on('submit', async (event) => {
      event.preventDefault();
      console.log('submit');
      const title = $('#title').val();
      const content = $('#textarea').val();
      const html = converter.makeHtml(content);
      const user = await getAuthenticatedUser();
      console.log(user);
      const authorId = user._id;
      const date = new Date().toLocaleDateString();
      const readTime = Math.round(content.split(' ').length / 200);
      if (isEditing) {
        await $.ajax({
          url: '/api/v1/posts',
          type: 'PUT',
          data: {
            _id: post._id,
            title,
            authorId,
            content: html,
            date,
            readTime,
            liked: post.liked,
          },
          success(data) {
            window.location.href = `#/users/${user.username}/${post._id}`;
            console.log(data);
          },
          error(err) {
            console.log(err);
          },
        });
      } else {
        await $.post('/api/v1/posts',
          {
            title,
            authorId,
            content: html,
            date,
            readTime,
          },
          (data) => {
            console.log(data);
            window.location.href = `#/users/${user.username}/${data._id}`;
          },
          'json');
      }
    });
  },
};

export default newPostPage;
