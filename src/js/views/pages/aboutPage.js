import $ from 'jquery';

const aboutPage = {
  async render() {
    return `
            <h1>My first single page application woohoo</h1>`;
  },
  afterRender: async () => {

  },
};

export default aboutPage;
