/**
 * @jsx React.DOM
 */
'use strict';

var React        = require('react/addons');
var _            = require('lodash');
var $            = require('jquery');
var Navigation   = require('react-router').Navigation;

var LoginModalMixin = require('../mixins/LoginModalMixin');
var UserActions  = require('../actions/UserActions');
var ListLink     = require('./ListLink');
var SearchBar    = require('./SearchBar');
var Avatar       = require('./Avatar');

var cx           = React.addons.classSet;

var Header = React.createClass({

  mixins: [Navigation, React.addons.LinkedStateMixin, LoginModalMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      currentUser: {}
    };
  },

  getInitialState: function() {
    return {
      query: '',
      displayUserDropdown: false
    };
  },

  toggleUserDropdown: function() {
    this.setState({ displayUserDropdown: !this.state.displayUserDropdown });
  },

  logoutUser: function() {
    UserActions.logout(function() {
      this.replaceWith('Login');
    }.bind(this));
  },

  handleKeyPress: function(evt) {
    var keyCode = evt.keyCode || evt.which;

    if ( keyCode === '13' || keyCode === 13 ) {
      this.doGlobalSearch();
    }
  },

  doGlobalSearch: function() {
    this.transitionTo('PlaylistSearch', {}, { q: this.state.query });

    this.setState({ query: '' }, function() {
      this.refs.SearchBar.refs.input.getDOMNode().blur();
    }.bind(this));
  },

  renderUserOptions: function() {
    var element = null;
    var dropdownToggleClassess = cx({
      'dropdown-toggle-container': true,
      'active': this.state.displayUserDropdown
    });

    if ( !_.isEmpty(this.props.currentUser) ) {
      element = (
        <div ref="dropdownToggle" className={dropdownToggleClassess} onClick={this.showUserDropdownMenu}>
          <div className="avatar-container">
            <Avatar user={this.props.currentUser} />
            <span className="username">{this.props.currentUser.username}</span>
          </div>
          <div className="arrow-container">
            <i className="fa fa-chevron-down"></i>
          </div>
        </div>
      );
    } else {
      element = (
        <ul className="register-login-container">
          <ListLink to="Register" className="btn">Register</ListLink>
          <li className="login-modal-link" onClick={this.toggleLoginModal}>Login</li>
        </ul>
      );
    }

    return element;
  },

  showUserDropdownMenu: function(e) {
    var menuItems = (
      <div>
        <li>
          <i className="fa fa-sign-out"></i>
          Sign Out
          <a onClick={this.logoutUser} />
        </li>
      </div>
    );
    var $dropdownToggle = $(this.refs.dropdownToggle.getDOMNode());
    var width = $dropdownToggle.outerWidth(true);
    var top = $dropdownToggle.offset().top + $dropdownToggle.outerHeight(true);
    var left = $dropdownToggle.offset().left;

    e.stopPropagation();
    e.preventDefault();

    e.pageX = left;
    e.pageY = top;

    this.props.showContextMenu(e, menuItems, width);
  },

  render: function() {
    return (
      <header>

        <div className="logo-container">
          <img className="logo" src="https://assets.monolist.co/images/logo.png" alt="Monolist logo" />
        </div>

        <div className="search-container">
          <SearchBar ref="SearchBar"
                     valueLink={this.linkState('query')}
                     onKeyPress={this.handleKeyPress}
                     placeholder="Search all playlists..." />
        </div>

        <div className="user-options-container">
          {this.renderUserOptions()}
        </div>

      </header>
    );
  }

});

module.exports = React.createFactory(Header);