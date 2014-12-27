/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

var Footer = React.createClass({

  render: function() {
    return (
      <footer>

        <div>
          Copyright &copy; {new Date().getFullYear()} Monolist
        </div>

        <div />

        <div />

        <div />

      </footer>
    );
  }

});

module.exports = React.createFactory(Footer);