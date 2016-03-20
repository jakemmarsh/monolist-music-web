'use strict';

const FacebookAuthMixin = (submitFunction) => {

  return {
    getInitialState() {
      return {
        facebookProfile: null,
        accessToken: null
      };
    },

    checkFbState() {
      window.FB.getLoginStatus(response => {
        if ( response.status === 'connected' ) {
          this.setState({
            accessToken: response.authResponse.accessToken,
            facebookProfile: {
              id: response.authResponse.userID
            }
          }, (typeof submitFunction === 'undefined' ? this.handleSubmit : submitFunction));
        } else if ( response.status === 'not_authorized' ) {
          this.setState({ error: 'You must authorize Monolist via Facebook to log in using that method.' });
        } else {
          this.setState({ error: 'You must be logged in to Facebook to log in using that method.' });
        }
      });
    },

    doFbLogin() {
      window.FB.login(this.checkFbState, { scope: 'public_profile,email,user_friends' });
    }
  };

};

export default FacebookAuthMixin;
