/**
 * @jsx React.DOM
 */
'use strict';

var React          = require('react/addons');
var Link           = require('react-router').Link;

var DocumentTitle  = require('../components/DocumentTitle');

var NotFoundPage = React.createClass({

  propTypes: {
    playlist: React.PropTypes.object
  },

  render: function() {
    return (
      <section className="content is404">

        <DocumentTitle title="404: Page Not Found" />

        <h1>404</h1>
        <h3>The page could not be found. Try <Link to="Explore">exploring</Link>!</h3>

      </section>
    );
  }

});

module.exports = React.createFactory(NotFoundPage);