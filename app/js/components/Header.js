'use strict';

import React              from 'react';
import LinkedStateMixin   from 'react-addons-linked-state-mixin';
import {Link, History}    from 'react-router';
import _                  from 'lodash';

import LoginModalMixin    from '../mixins/LoginModalMixin';
import SearchBar          from './SearchBar';
import NotificationCenter from './NotificationCenter';
import UserActionDropdown from './UserActionDropdown';

var Header = React.createClass({

  mixins: [LinkedStateMixin, History, LoginModalMixin],

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
    let keyCode = evt.keyCode || evt.which;

    if ( keyCode === '13' || keyCode === 13 ) {
      this.doGlobalSearch();
    }
  },

  doGlobalSearch() {
    this.history.pushState(null, `/search/tracks`, { q: this.state.query });

    this.setState({ query: '' }, () => {
      this.refs.SearchBar.refs.input.blur();
    });
  },

  renderNotificationCenter() {
    if ( !_.isEmpty(this.props.currentUser) ) {
      return (
        <NotificationCenter className="nudge-half--right float-right"
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
          <a onClick={this.openLoginModal}>Login</a>
        </div>
      );
    } else {
      element = (
        <UserActionDropdown ref="dropdownToggle" currentUser={this.props.currentUser} />
      );
    }

    return element;
  },

  render() {
    return (
      <header>

        <div className="logo-container">
          <Link to="/">
            <img src="//assets.monolist.co/app/images/logo.png" className="logo" />
          </Link>
        </div>

        <div className="search-container">
          <SearchBar ref="SearchBar"
                     valueLink={this.linkState('query')}
                     onKeyPress={this.handleKeyPress}
                     placeholder="Search Monolist..." />
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