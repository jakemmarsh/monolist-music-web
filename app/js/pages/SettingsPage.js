/**
 * @jsx React.DOM
 */
'use strict';

var React                   = require('react/addons');

var DocumentTitle           = require('../components/DocumentTitle');
var AuthenticatedRouteMixin = require('../mixins/AuthenticatedRouteMixin');

var SettingsPage = React.createClass({

  mixins: [AuthenticatedRouteMixin],

  render: function() {
    return (
      <section className="content settings">

        <DocumentTitle title="Settings" />

        Account Settings Page

      </section>
    );
  }

});

module.exports = React.createFactory(SettingsPage);