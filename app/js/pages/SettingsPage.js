/**
 * @jsx React.DOM
 */
'use strict';

var React                   = require('react/addons');

var AuthenticatedRouteMixin = require('../mixins/AuthenticatedRouteMixin');

var SettingsPage = React.createClass({

  mixins: [AuthenticatedRouteMixin],

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

module.exports = React.createFactory(SettingsPage);