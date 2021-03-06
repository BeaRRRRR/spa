import $ from 'jquery';

const utils = {
  parseUrl() {
    const location = window.location.hash;
    const url = window.location.hash.slice(2).split('/');
    const parsedUrl = {
      resource: location.includes('/') ? url[0] : undefined,
      name: url[1],
      postName: url[2],
    };
    return parsedUrl;
  },

  /**
   * Returns the user that is currently logged in.
   *
   * @return {User} The user object.
   */
  async getAuthenticatedUser() {
    const response = await $.get('/getAuthenticatedUser');
    return response;
  },
};

export default utils;
