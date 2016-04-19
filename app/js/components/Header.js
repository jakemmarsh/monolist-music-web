'use strict';

import React              from 'react';
import LinkedStateMixin   from 'react-addons-linked-state-mixin';
import {Link, History}    from 'react-router';
import _                  from 'lodash';

import Modals             from '../utils/Modals';
import SearchBar          from './SearchBar';
import NotificationCenter from './NotificationCenter';
import UserActionDropdown from './UserActionDropdown';

const Header = React.createClass({

  mixins: [LinkedStateMixin, History],

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
      query: '',
      displayUserDropdown: false
    };
  },

  toggleUserDropdown() {
    this.setState({ displayUserDropdown: !this.state.displayUserDropdown });
  },

  handleKeyPress(evt) {
    const keyCode = evt.keyCode || evt.which;

    if ( keyCode === '13' || keyCode === 13 ) {
      this.doGlobalSearch();
    }
  },

  doGlobalSearch() {
    this.history.pushState(null, '/search/playlists', { q: this.state.query });

    this.setState({ query: '' }, () => {
      this.refs.searchBar.refs.input.blur();
    });
  },

  renderNotificationCenter() {
    if ( !_.isEmpty(this.props.currentUser) ) {
      return (
        <NotificationCenter ref="notificationCenter"
                            className="nudge-half--right float-right"
                            currentUser={this.props.currentUser} />
      );
    }
  },

  renderUserActionButton() {
    let element;

    if ( _.isEmpty(this.props.currentUser) ) {
      element = (
        <div className="text-right">
          <Link to="/register" className="btn nudge-half--right">Sign Up</Link>
          <a onClick={Modals.openLogin}>Login</a>
        </div>
      );
    } else {
      element = (
        <UserActionDropdown ref="userActionDropdown" currentUser={this.props.currentUser} />
      );
    }

    return element;
  },

  render() {
    return (
      <header>
        <div className="max-width-wrapper d-f fxd-r ai-c h-1-1">
          <div className="fx-1 d-f fxd-r ai-c text-left">
            <Link to="/" className="nudge--right">
              <img src="//assets.monolist.co/app/images/logo.png" className="header-logo" />
            </Link>
            <ul className="header-links-list nudge-half--right">
              <li className="header-link">
                <Link to="/charts">Charts</Link>
              </li>
            </ul>
            <SearchBar ref="searchBar"
                       className="header-search-bar"
                       valueLink={this.linkState('query')}
                       onKeyPress={this.handleKeyPress}
                       placeholder="Search Monolist..." />
          </div>

          <div className="header-links-container fx-1 d-f fxd-r ai-c text-right">
            <ul className="header-links-list">
              <li className="header-link">
                <Link to="/playlists/create">Create Playlist</Link>
              </li>
              <li className="header-link">
                <Link to="/groups/create">Create Group</Link>
              </li>
            </ul>
            {this.renderNotificationCenter()}
            {this.renderUserActionButton()}
          </div>
        </div>
      </header>
    );
  }

});

export default Header;
