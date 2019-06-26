import $ from 'jquery';

let aboutPage = {
  render: async function () {
    return `
            <h1>My first single page application woohoo</h1>`;
  },
  afterRender: async () => {

  }
};

export default aboutPage;
