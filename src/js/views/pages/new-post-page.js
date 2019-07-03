import $ from 'jquery';
import showdown from 'showdown';
import utils from '../../service/utils';
import PostRepository from '../../service/repositories/post-repository';

const postRepository = new PostRepository();
const converter = new showdown.Converter();

let isEditing = false;
let post;

const getAuthenticatedUser = async () => {
  const response = await $.get('/getAuthenticatedUser');
  return response;
};

const newPostPage = {
  async render() {
    const { resource } = utils.parseUrl();
    const editId = resource.substr(11);
    const user = utils.getAuthenticatedUser();
    if (!user) window.location = 'auth/google';
    let html;
    if (editId) {
      isEditing = true;
      post = await postRepository.getById(editId);
      html = converter.makeMarkdown(post.content);
      console.log(post);
    }
    if (isEditing && !user._id.equals(post.authorId)) {
      return 'Only authors can edit their posts';
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
        console.log(markdown);
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
        // Making the textarea higher to fit all the text without scrolling
        $('#textarea').height($('#textarea').prop('scrollHeight'));
        $('#title').val(title);
        // The same with title
        $('#title').height($('#title').prop('scrollHeight'));
      }
      $previewButton.toggleClass('btn-outline-secondary');
      $previewButton.toggleClass('btn-secondary');
    });
    $('#newPostForm').on('submit', async (event) => {
      event.preventDefault();
      console.log('submit');
      title = $('#title').val();
      markdown = $('#textarea').val();
      const html = converter.makeHtml(markdown);
      const date = new Date().toLocaleDateString();
      const readTime = Math.round(markdown.split(' ').length / 200);
      const user = await getAuthenticatedUser();
      console.log(user);
      const authorId = user._id;
      if (isEditing) {
        postRepository.update({
          _id: post._id,
          title,
          authorId,
          content: html,
          date,
          readTime,
          liked: post.liked,
        })
          .then(() => {
            window.location.href = `#/users/${user.username}/${post._id}`;
          })
          .catch(err => console.log(err));
      } else {
        postRepository.save({
          title,
          authorId,
          content: html,
          date,
          readTime,
        })
          .then((data) => {
            window.location.href = `#/users/${user.username}/${data._id}`;
          })
          .catch(err => console.log(err));
      }
    });
  },
};

export default newPostPage;
