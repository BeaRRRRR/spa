import utils from '../../service/utils';

async function getPost() {
  let id = utils.parseUrl().postName;
  const response =await fetch(`/api/v1/posts/${id}`);
  const json = await response.json();
  return json;
}

let postPage = {
  render: async function () {
    let post = await getPost();
    return `<a href="#">Home</a>
            <a href="#/about">About</a>
            <p>Post title : ${post.title}</p>
            <p>Post author : ${post.author}</p>
            <p>Post content : ${post.content}</p>`;
  },
  afterRender: async () => {
  }
};

export default postPage;
