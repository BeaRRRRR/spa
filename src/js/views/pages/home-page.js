import PostRepository from '../../service/repositories/post-repository';
import UserRepository from '../../service/repositories/user-repository';

const postRepository = new PostRepository();
const userRepository = new UserRepository();

const homePage = {
  async render() {
    const currentPage = parseInt(window.location.hash.substr(7), 10) || 1;
    const [count, posts] = await Promise.all([postRepository.count(), postRepository.getByPage(currentPage)]);
    console.log(currentPage);
    // Making html code with all the posts
    const postsHtml = await Promise.all(posts.map(async (post) => {
      const author = await userRepository.getById(post.authorId);
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
                  <h4 class="post-likes-count">Likes : ${post.liked.length - 1}</h4>
                  <h4 class="post-reading-time">Read time : ${post.readTime} min</h4>
                </div>        
              </div>`;
    }));
    const html = postsHtml.join('\n');
    return `<div>
               ${html} 
               <div>
                 <nav aria-label="Page navigation example">
                   <ul class="pagination justify-content-center">
                     <li class="page-item ${currentPage === 1 ? 'disabled ' : ''} previous-page"><a class="page-link" href="#?page=${currentPage - 1}">Previous</a></li>
                     <li class="page-item gray">
                       <a class="page-link">${currentPage} <span class="sr-only">(current)</span></a>
                     </li>
                     <li class="page-item ${count <= currentPage * 10 ? 'disabled' : ''} next-page"><a class="page-link" href="#?page=${parseInt(currentPage + 1, 10)}">Next</a></li>
                   </ul>
                 </nav> 
               </div>
            </div>`;
  },
  afterRender: async () => {
  },
};

export default homePage;
