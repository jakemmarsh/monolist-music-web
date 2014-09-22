/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

var NotFoundPage = React.createClass({

  render: function() {
    return (
      <div>
        404: Not Found
      </div>
    );
  }

});

module.exports = NotFoundPage;