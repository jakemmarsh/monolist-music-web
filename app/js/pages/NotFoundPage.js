/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');
var Link  = require('react-router').Link;

var NotFoundPage = React.createClass({

  propTypes: {
    updatePageTitle: React.PropTypes.func.isRequired,
    playlist: React.PropTypes.object
  },

  componentDidMount: function() {
    this.props.updatePageTitle('404: Page Not Found');
  },

  render: function() {
    return (
      <section className="content is404">

        <h1>404</h1>
        <h3>The page could not be found. Try <Link to="Explore">exploring</Link>!</h3>

      </section>
    );
  }

});

module.exports = React.createFactory(NotFoundPage);