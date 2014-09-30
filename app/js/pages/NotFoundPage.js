/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');
var Link  = require('react-router').Link;

var NotFoundPage = React.createClass({

  propTypes: {
    updateHeader: React.PropTypes.func.isRequired,
    playlist: React.PropTypes.object,
    currentTrack: React.PropTypes.object,
    selectTrack: React.PropTypes.func
  },

  componentDidMount: function() {
    this.props.updateHeader({
      title: '404: Page Not Found',
      icon: 'fa-warning'
    });
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

module.exports = NotFoundPage;