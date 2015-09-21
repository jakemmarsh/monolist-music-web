'use strict';

import React         from 'react/addons';
import {Link}        from 'react-router';
import DocumentTitle from 'react-document-title';

import Helpers       from '../utils/Helpers';

var NotFoundPage = React.createClass({

  propTypes: {
    playlist: React.PropTypes.object
  },

  render() {
    return (
      <DocumentTitle title={Helpers.buildPageTitle('404: Page Not Found')}>
      <div className="text-center soft--ends nudge--ends">

        <h1>404</h1>
        <h3>The page could not be found. Try <Link to="/">exploring</Link>!</h3>

        <Link to="/login" className="btn full">Log In</Link>

      </div>
      </DocumentTitle>
    );
  }

});

export default NotFoundPage;