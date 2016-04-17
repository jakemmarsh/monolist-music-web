'use strict';

import React       from 'react';
import _           from 'lodash';
import cx          from 'classnames';
import {Link}      from 'react-router';

import UserActions from '../actions/UserActions';
import Avatar      from './Avatar';

const UserActionDropdown = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      currentUser: {}
    };
  },

  getInitialState() {
    return {
      showDropdown: false
    };
  },

  componentWillUnmount() {
    document.removeEventListener('click', this.toggleDropdown);
  },

  logoutUser(evt) {
    if ( evt ) { evt.preventDefault(); }
    UserActions.logout();
  },

  toggleDropdown(evt) {
    evt.preventDefault();

    this.setState({
      showDropdown: !this.state.showDropdown
    }, () => {
      if ( this.state.showDropdown ) {
        document.addEventListener('click', this.toggleDropdown);
      } else {
        document.removeEventListener('click', this.toggleDropdown);
      }
    });
  },

  renderDropdown() {
    if ( !_.isEmpty(this.props.currentUser) && this.state.showDropdown ) {
      return (
        <ul className="dropdown-menu text-left">
          <li className="menu-item">
            <i className="icon-list" />
            My Playlists
            <Link to={`/profile/${this.props.currentUser.username}/playlists`} />
          </li>
          <li className="menu-item">
            <i className="icon-group" />
            My Collaborations
            <Link to={`/profile/${this.props.currentUser.username}/collaborations`} />
          </li>
          <li className="menu-item">
            <i className="icon-heart" />
            My Likes
            <Link to={`/profile/${this.props.currentUser.username}/likes`} />
          </li>
          <li className="menu-item">
            <i className="icon-star" />
            My Starred Tracks
            <Link to={`/profile/${this.props.currentUser.username}/starred`} />
          </li>
          <li className="menu-item">
            <i className="icon-cogs" />
            Settings
            <Link to="/settings" />
          </li>
          <li className="menu-item">
            <i className="icon-sign-out" />
            Sign Out
            <a ref="logoutLink" onClick={UserActions.logout.bind(null, () => {})} />
          </li>
        </ul>
      );
    }
  },

  render() {
    const dropdownToggleClasses = cx('user-action-dropdown', {
      'active': this.state.showDropdown
    });

    return (
      <div ref="dropdownToggle" className={dropdownToggleClasses} onClick={this.toggleDropdown}>

        <div className="user-action-dropdown-user-container">
          <Avatar user={this.props.currentUser} />
          <span className="username">{this.props.currentUser.username}</span>
        </div>

        <div className="user-action-dropdown-arrow-container">
          <i className="icon-chevron-down"></i>
        </div>

        {this.renderDropdown()}

      </div>
    );
  }

});

export default UserActionDropdown;
