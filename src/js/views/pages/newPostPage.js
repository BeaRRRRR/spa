import $ from 'jquery';
import showdown from 'showdown';

const converter = new showdown.Converter();
const getAuthenticatedUser = async () => {
  const response = await $.get('/getAuthenticatedUser');
  return response;
};

let newPostPage = {
  render: async function () {
    return `<div class="container">
              <form id="newPostForm">
               <div class="post container" id="post">
                   <div id="form-body" class="form-group">
        		       	<textarea class="post-title form-control" name="title" id="title" type="text" placeholder="Title" rows="1"></textarea>
        		       	<textarea class="post-content form-control" name="textarea" id="textarea" type="text" placeholder="Write your markdown here" rows="8"></textarea>
        		       </div>
	        	   </div>
	        	   <div class="container" style="display: flex; justify-content: flex-end">
        		    <button type="button" id="preview" class="btn btn-outline-secondary">Preview</button>
	        	    <button type="submit" id="publish" class="btn btn-outline-primary">Publish</button>
               </div> 
        		  </form>
            </div>`;
  },
  afterRender: async function () {
    $('textarea').autoResize();
    let markdown;
    let title;
    let $previewButton = $('#preview');
    $previewButton.on('click', function () {
      console.log('click');
      if ($previewButton.hasClass('btn-outline-secondary')) {
        title = $('#title').val();
        markdown = $('#textarea').val();
        let html = converter.makeHtml(markdown);
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
      let title = $('#title').val();
      let content = $('#textarea').val();
      let html = converter.makeHtml(content);
      let user = await getAuthenticatedUser();
      console.log(user);
      let author = user.username;
      let date = new Date().toLocaleDateString();
      let readTime = Math.round(content.split(" ").length/200);
      $.post('/api/v1/posts',
        {
          title: title,
          author: author,
          content: html,
          date : date,
          readTime : readTime
        },
        (data) => {
          window.location.href = `#/users/${author}/${data._id}`
        },
        'json'
      );
    });
  }
};

export default newPostPage;
