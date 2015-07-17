'use strict';

import React          from 'react/addons';
import {Link}         from 'react-router';
import DocumentTitle  from 'react-document-title';

import APIUtils       from '../utils/APIUtils';

var NotFoundPage = React.createClass({

  propTypes: {
    playlist: React.PropTypes.object
  },

  render() {
    return (
      <DocumentTitle title={APIUtils.buildPageTitle('404: Page Not Found')}>
      <div className="text-center">

        <h1>404</h1>
        <h3>The page could not be found. Try <Link to="Explore">exploring</Link>!</h3>

        <Link to="Login" className="btn full">Log In</Link>

      </div>
      </DocumentTitle>
    );
  }

});

export default NotFoundPage;