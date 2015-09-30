'use strict';

import React       from 'react/addons';
import _           from 'lodash';
import $           from 'jquery';
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
    $(document).off('click', this.toggleDropdown);
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
        $(document).on('click', this.toggleDropdown);
      } else {
        $(document).off('click', this.toggleDropdown);
      }
    });
  },

  renderDropdown() {
    if ( !_.isEmpty(this.props.currentUser) && this.state.showDropdown ) {
      return (
        <ul className="dropdown-menu">
          <li className="menu-item">
            <i className="icon-user" />
            My Profile
            <Link to={`/profile/${this.props.currentUser.username}`} />
          </li>
          <li className="menu-item">
            <i className="icon-cogs" />
            Settings
            <Link to="/settings" />
          </li>
          <li className="menu-item">
            <i className="icon-sign-out" />
            Sign Out
            <a ref="logoutLink" onClick={UserActions.logout} />
          </li>
        </ul>
      );
    }
  },

  render() {
    let dropdownToggleClasses = cx({
      'user-action-dropdown': true,
      'active': this.state.showDropdown
    });

    return (
      <div ref="dropdownToggle" className={dropdownToggleClasses} onClick={this.toggleDropdown}>

        <div className="avatar-container">
          <Avatar user={this.props.currentUser} />
          <span className="username">{this.props.currentUser.username}</span>
        </div>

        <div className="arrow-container">
          <i className="icon-chevron-down"></i>
        </div>

        {this.renderDropdown()}

      </div>
    );
  }

});

export default UserActionDropdown;