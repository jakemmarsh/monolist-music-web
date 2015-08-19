'use strict';

import React              from 'react/addons';
import $                  from 'jquery';
import {Link, Navigation} from 'react-router';
import cx                 from 'classnames';
import _                  from 'lodash';

import LoginModalMixin    from '../mixins/LoginModalMixin';
import UserActions        from '../actions/UserActions';
import SearchBar          from './SearchBar';
import NotificationCenter from './NotificationCenter';
import Avatar             from './Avatar';

var Header = React.createClass({

  mixins: [React.addons.LinkedStateMixin, Navigation, LoginModalMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  getDefaultProps() {
    return {
      currentUser: {}
    };
  },

  getInitialState() {
    return {
      query: '',
      displayUserDropdown: false
    };
  },

  toggleUserDropdown() {
    this.setState({ displayUserDropdown: !this.state.displayUserDropdown });
  },

  handleKeyPress(evt) {
    let keyCode = evt.keyCode || evt.which;

    if ( keyCode === '13' || keyCode === 13 ) {
      this.doGlobalSearch();
    }
  },

  doGlobalSearch() {
    this.transitionTo('PlaylistSearch', {}, { q: this.state.query });

    this.setState({ query: '' }, () => {
      this.refs.SearchBar.refs.input.getDOMNode().blur();
    });
  },

  logoutUser() {
    UserActions.logout();
  },

  redirect(path = '', params = {}, query = {}) {
    this.transitionTo(path, params, query);
  },

  showUserDropdownMenu(e) {
    let profileUrl = '/profile/' + this.props.currentUser.username;
    let menuItems = (
      <div>
        <li>
          <i className="icon-user" />
          My Profile
          <a onClick={this.redirect.bind(this, profileUrl)} />
        </li>
        <li>
          <i className="icon-cogs" />
          Settings
          <a onClick={this.redirect.bind(this, 'Settings')} />
        </li>
        <li>
          <i className="icon-sign-out" />
          Sign Out
          <a onClick={this.logoutUser} />
        </li>
      </div>
    );
    let $dropdownToggle = $(this.refs.dropdownToggle.getDOMNode());
    let width = $dropdownToggle.outerWidth(true);
    let top = $dropdownToggle.offset().top + $dropdownToggle.outerHeight(true);
    let left = $dropdownToggle.offset().left;

    e.stopPropagation();
    e.preventDefault();

    e.pageX = left;
    e.pageY = top;

    this.props.showContextMenu(e, menuItems, width);
  },

  renderNotificationCenter() {
    if ( !_.isEmpty(this.props.currentUser) ) {
      return (
        <NotificationCenter className="nudge-half--right float-right"
                            currentUser={this.props.currentUser}
                            showContextMenu={this.props.showContextMenu} />
      );
    }
  },

  renderUserActionButton() {
    let element;
    let dropdownToggleClasses = cx({
      'dropdown-toggle-container': true,
      'active': this.state.displayUserDropdown
    });

    if ( _.isEmpty(this.props.currentUser) ) {
      element = (
        <div className="text-right">
          <Link to="Register" className="btn nudge-half--right">Sign Up</Link>
          <a onClick={this.toggleLoginModal}>Login</a>
        </div>
      );
    } else {
      element = (
        <div ref="dropdownToggle" className={dropdownToggleClasses} onClick={this.showUserDropdownMenu}>
          <div className="avatar-container">
            <Avatar user={this.props.currentUser} />
            <span className="username">{this.props.currentUser.username}</span>
          </div>
          <div className="arrow-container">
            <i className="icon-chevron-down"></i>
          </div>
        </div>
      );
    }

    return element;
  },

  render() {
    return (
      <header>

        <div className="logo-container">
          <img src="//assets.monolist.co/app/images/logo.png" className="logo" />
        </div>

        <div className="search-container">
          <SearchBar ref="SearchBar"
                     valueLink={this.linkState('query')}
                     onKeyPress={this.handleKeyPress}
                     placeholder="Search all playlists..." />
        </div>

        <div className="user-options-container">
          {this.renderUserActionButton()}
          {this.renderNotificationCenter()}
        </div>

      </header>
    );
  }

});

export default Header;