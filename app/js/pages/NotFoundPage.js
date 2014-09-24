/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

var NotFoundPage = React.createClass({

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