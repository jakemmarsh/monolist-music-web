/**
 * @jsx React.DOM
 */
'use strict';

var React           = require('react/addons');
var Reflux          = require('reflux');
var Navigation      = require('react-router').Navigation;

var PageTitleMixin = require('../mixins/PageTitleMixin');
var RegisterForm   = require('../components/RegisterForm');

var LoginPage = React.createClass({

  mixins: [PageTitleMixin, React.addons.LinkedStateMixin, Reflux.ListenerMixin, Navigation],

  componentDidMount: function() {
    this.updatePageTitle('Register');
  },

  render: function() {
    return (
      <section className="register">
        <h1>Register for Monolist</h1>
        <RegisterForm />
      </section>
    );
  }

});

module.exports = React.createFactory(LoginPage);