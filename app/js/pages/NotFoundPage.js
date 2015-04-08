'use strict';

var React          = require('react/addons');
var Link           = require('react-router').Link;
var DocumentTitle  = require('react-document-title');

var NotFoundPage = React.createClass({

  propTypes: {
    playlist: React.PropTypes.object
  },

  render: function() {
    return (
      <DocumentTitle title="404: Page Not Found">
      <div className="text-center">

        <h1>404</h1>
        <h3>The page could not be found. Try <Link to="Explore">exploring</Link>!</h3>

        <Link to="Login" className="btn full">Log In</Link>

      </div>
      </DocumentTitle>
    );
  }

});

module.exports = NotFoundPage;