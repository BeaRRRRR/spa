import $ from 'jquery';

async function getPosts() {
  const respone = await fetch('/api/v1/posts');
  const json = await respone.json();
  return json;
}

const getAuthor = async (post) => {
  const author = await $.get(`api/v1/users/${post.authorId}`);
  return author;
};

const homePage = {
  async render() {
    const posts = await getPosts();
    const postsHtml = await Promise.all(posts.map(async (post) => {
      const author = await getAuthor(post);
      console.log(author);
      return `<div class="post-preview card flex-row flex-wrap" style="cursor : pointer" onclick="window.location='#/users/${author.username}/${post._id}';">
                              <div class="card-header">
                                <a href="#/users/${author.username}">
                                  <img class="avatar-small" src="${author.avatar}" alt="well there must be a user picture">
                                </a>
                              </div>
                              <div class="card-body">
                               <h3 class="card-title">${post.title}</h3>
                               <h4 class="card-subtitle mb-2 text-muted">${author.name} on ${post.date}</h4>
                              </div>
                              <!--<div class="card-footer"></div>-->
                              <h4>Likes : ${post.liked != null ? post.liked.length : '0'}</h4>
                              <h4 class="post-reading-time">Read time : ${post.readTime} min</h4>
                            </div>        
                          </div>`;
    }));
    const html = postsHtml.join('\n');
    return `<div>
              <!--<ul>-->
               ${html} 
              <!--</ul>-->
            </div>`;
  },
  afterRender: async () => {
  },
};

export default homePage;
