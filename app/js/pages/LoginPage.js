/**
 * @jsx React.DOM
 */
'use strict';

var React            = require('react/addons');
var Reflux           = require('reflux');
var Navigation       = require('react-router').Navigation;

var PageTitleMixin   = require('../mixins/PageTitleMixin');
var CurrentUserStore = require('../stores/CurrentUserStore');
var LoginForm        = require('../components/LoginForm');

var LoginPage = React.createClass({

  mixins: [PageTitleMixin, Reflux.ListenerMixin, Navigation],

  _onUserChange: function(user) {
    if ( user !== null ) {
      // TODO: change this to 'Explore'
      this.transitionTo('Playlists');
    }
  },

  componentDidMount: function() {
    if ( CurrentUserStore.user !== null ) {
      // TODO: change this to 'Explore'
      this.transitionTo('Playlists');
    } else {
      this.listenTo(CurrentUserStore, this._onUserChange);
      this.updatePageTitle('Login');
    }
  },

  render: function() {
    return (
      <section className="login">
        <h1>Login to Monolist</h1>
        <LoginForm />
      </section>
    );
  }

});

module.exports = React.createFactory(LoginPage);