/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');
var Link  = require('react-router').Link;

var HomePage = React.createClass({

  render: function() {
    return (
      <div>
        <Link to="user" params={{username: 'jakemmarsh'}} user={{username: 'jakemmarsh'}}>Go to profile</Link>
      </div>
    );
  }

});

module.exports = HomePage;