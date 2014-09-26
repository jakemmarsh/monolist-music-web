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
      <div>
        404: Not Found
      </div>
    );
  }

});

module.exports = NotFoundPage;