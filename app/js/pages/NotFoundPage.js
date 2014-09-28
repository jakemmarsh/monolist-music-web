/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

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
      <section className="content 404">

        404: Not Found

      </section>
    );
  }

});

module.exports = NotFoundPage;