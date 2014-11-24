/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');
var Link  = React.createFactory(require('react-router').Link);

var HomePage = React.createClass({

  render: function() {
    return (
      <div>
        <Link to="Login">Login</Link>
        <br /><br />
        <Link to="Register">Register</Link>
      </div>
    );
  }

});

module.exports = React.createFactory(HomePage);