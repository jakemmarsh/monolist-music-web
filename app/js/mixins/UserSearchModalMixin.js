'use strict';

import React           from 'react';
import _               from 'lodash';
import $               from 'jquery';
import cx              from 'classnames';

import UserSearchStore from '../stores/UserSearchStore';
import UserActions     from '../actions/UserActions';
import GlobalActions   from '../actions/GlobalActions';
import Spinner         from '../components/Spinner';
import Avatar          from '../components/Avatar';

const UserSearchModalMixin = {

  // NOTE: LinkedStateMixin and ListenerMixin required, but already being loaded by components/pages where this mixin is used

  getInitialState() {
    return {
      userSearchQuery: '',
      userResults: [],
      userResultsLoading: false,
      focusedInput: null,
      userSearchError: null
    };
  },

  componentDidMount() {
    this.timer = null;
    this.listenTo(UserSearchStore, this.doneSearching);
  },

  componentWillReceiveProps(nextProps) {
    if ( !_.isEqual(this.props, nextProps) ) {
      $('.add-icon.inactive').hover(function() {
        $(this).removeClass('icon-check');
        $(this).addClass('icon-close');
      });

      $('.add-icon.inactive').mouseleave(function() {
        $(this).removeClass('icon-close');
        $(this).addClass('icon-check');
      });
    }
  },

  doneSearching(err, users) {
    if ( err ) {
      this.setState({ userSearchError: err, userResultsLoading: false });
    } else {
      this.setState({ userResults: users, userSearchError: null, userResultsLoading: false });
    }
  },

  createFocusListeners() {
    const component = this;

    $('input#user-query').focus(function() {
      component.setState({ focusedInput: $(this).attr('id') });
    });

    $('input#user-query').blur(function() {
      component.setState({ focusedInput: null });
    });
  },

  doSearch() {
    if ( this.state.userSearchQuery.length ) {
      this.setState({ userResultsLoading: true }, UserActions.search.bind(null, this.state.userSearchQuery));
    }
  },

  handleKeyUp() {
    clearTimeout(this.timer);
    this.timer = setTimeout(this.doSearch, 1000);
  },

  handleKeyPress(evt) {
    const keyCode = evt.keyCode || evt.which;

    if ( keyCode === '13' || keyCode === 13 ) {
      clearTimeout(this.timer);
      this.doSearch();
    }
  },

  renderSpinner() {
    if ( this.state.userResultsLoading ) {
      return (
        <Spinner size={10} />
      );
    }
  },

  renderError() {
    if ( this.state.userSearchError ) {
      return (
        <div className="error-container nudge-half--ends">
          {this.state.userSearchError}
        </div>
      );
    }
  },

  renderUserResults() {
    let element = null;
    let users;
    let userIsSelected;
    let addIconClasses;
    let addIconFunction;

    if ( this.state.userResults && this.state.userResults.length ) {
      users = _.map(this.state.userResults, function(user, index) {
        userIsSelected = this.isUserSelected(user);
        addIconFunction = userIsSelected ? this.deselectUser.bind(null, user) : this.selectUser.bind(null, user);
        addIconClasses = cx({
          'add-icon': true,
          'fa': true,
          'icon-plus': !userIsSelected,
          'icon-check': userIsSelected,
          'inactive': userIsSelected
        });

        return (
          <li className="user" key={index}>
            <div className="avatar-container">
              <Avatar user={user} includeLink={false} size="40px" />
            </div>
            <div className="name-container">
              <h6>{user.username}</h6>
            </div>
            <div className="add-icon-container">
              <i className={addIconClasses} onClick={addIconFunction}  />
            </div>
          </li>
        );
      }.bind(this));

      element = (
        <ul className="users-container nudge-half--top">
          {users}
        </ul>
      );
    }

    return element;
  },

  openUserSearchModal(initialResults) {
    const labelClasses = cx({ 'active': this.state.focusedInput === 'user-query' });

    initialResults = _.reject(initialResults || [], user => {
      return user.id === this.props.currentUser.id;
    });

    this.setState({
      userResults: initialResults
    }, () => {
      GlobalActions.openModal('user-search',
        <div>
          <div className="input-label-container">
            <div>
              <label htmlFor="user-query" className={labelClasses}>Search Users</label>
            </div>
            <div className="input-container nudge-half--bottom">
              <input type="text"
                     id="user-query"
                     valueLink={this.linkState('userSearchQuery')}
                     onKeyUp={this.handleKeyUp}
                     onKeyPress={this.handleKeyPress}
                     placeholder="Search for users..." />
              {this.renderSpinner()}
            </div>
          </div>

          {this.renderError()}

          {this.renderUserResults()}
        </div>
      );

      this.createFocusListeners();
    });
  }

};

export default UserSearchModalMixin;
