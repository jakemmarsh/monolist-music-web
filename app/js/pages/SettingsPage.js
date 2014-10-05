/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

var SettingsPage = React.createClass({

  componentDidMount: function() {
    this.props.updatePageTitle('Account Settings');
  },

  render: function() {
    return (
      <section className="content settings">

        Account Settings Page

      </section>
    );
  }

});

module.exports = SettingsPage;