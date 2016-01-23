'use strict';

import React            from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import {ListenerMixin}  from 'reflux';
import $                from 'jquery';
import cx               from 'classnames';
import _                from 'lodash';

import UserSearchStore  from '../stores/UserSearchStore';
import UserActions      from '../actions/UserActions';
import Spinner          from '../components/Spinner';
import Avatar           from '../components/Avatar';

const INACTIVE_ICON_SELECTOR = '.add-icon.inactive';
const SEARCH_INPUT_SELECTOR = 'input#user-query';

const UserSearchForm = React.createClass({

  mixins: [LinkedStateMixin, ListenerMixin],

  propTypes: {
    currentUser: React.PropTypes.object,
    selectUser: React.PropTypes.func,
    deselectUser: React.PropTypes.func,
    isUserSelected: React.PropTypes.func,
    initialResults: React.PropTypes.array
  },

  getInitialState() {
    return {
      query: '',
      results: this.props.initialResults,
      loading: false,
      focusedInput: null,
      error: null,
      selectedUserIds: _.pluck(this.props.initialResults, 'id') || [],
      doneSearching: false
    };
  },

  componentDidMount() {
    this.timer = null;
    this.listenTo(UserSearchStore, this.doneSearching);
    this.createInputFocusListeners();
  },

  componentWillReceiveProps(nextProps) {
    if ( !_.isEqual(this.props, nextProps) ) {
      this.createIconMouseListeners();
    }
  },

  componentWillUnmount() {
    $(INACTIVE_ICON_SELECTOR).off('hover');
    $(INACTIVE_ICON_SELECTOR).off('mouseleave');
    $(SEARCH_INPUT_SELECTOR).off('focus');
    $(SEARCH_INPUT_SELECTOR).off('blur');
  },

  doneSearching(err, users) {
    if ( err ) {
      this.setState({
        error: err,
        loading: false
      });
    } else {
      this.setState({
        results: users,
        error: null,
        loading: false
      });
    }
  },

  createInputFocusListeners() {
    const component = this;

    $(SEARCH_INPUT_SELECTOR).on('focus', function() {
      component.setState({ focusedInput: $(this).attr('id') });
    });

    $(SEARCH_INPUT_SELECTOR).on('blur', function() {
      component.setState({ focusedInput: null });
    });
  },

  createIconMouseListeners() {
    $(INACTIVE_ICON_SELECTOR).on('hover', function() {
      $(this).removeClass('icon-check');
      $(this).addClass('icon-close');
    });

    $(INACTIVE_ICON_SELECTOR).on('mouseleave', function() {
      $(this).removeClass('icon-close');
      $(this).addClass('icon-check');
    });
  },

  isUserSelected(user) {
    return this.state.selectedUserIds.indexOf(user.id) !== -1;
  },

  doSearch() {
    if ( this.state.query.length ) {
      this.setState({
        loading: true,
        doneSearching: true
      }, UserActions.search.bind(null, this.state.query));
    }
  },

  selectUser(user) {
    let selectedUserIdsCopy = this.state.selectedUserIds;

    selectedUserIdsCopy.push(user.id);

    this.setState({
      selectedUserIds: _.uniq(selectedUserIdsCopy)
    }, this.props.selectUser.bind(null, user));
  },

  deselectUser(user) {
    let selectedUserIdsCopy = this.state.selectedUserIds;

    selectedUserIdsCopy = _.without(selectedUserIdsCopy, user.id);

    this.setState({
      selectedUserIds: _.uniq(selectedUserIdsCopy)
    }, this.props.deselectUser.bind(null, user));
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
    if ( this.state.loading ) {
      return (
        <Spinner size={10} />
      );
    }
  },

  renderError() {
    if ( this.state.error ) {
      return (
        <div className="error-container nudge-half--ends">
          {this.state.error}
        </div>
      );
    }
  },

  renderResults() {
    let element = null;

    if ( this.state.results && this.state.results.length ) {
      let users = _.map(this.state.results, function(user, index) {
        let userIsSelected = this.isUserSelected(user);
        let addIconFunction = userIsSelected ? this.deselectUser.bind(null, user) : this.selectUser.bind(null, user);
        let addIconClasses = cx({
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
    } else if ( this.state.doneSearching ) {
      element = (
        <h5 className="text-center nudge--ends">
          No users found.
        </h5>
      );
    }

    return element;
  },

  render() {
    const labelClasses = cx({ 'active': this.state.focusedInput === 'user-query' });

    return (
      <div className="user-search-form">
        <div className="input-label-container">
          <div>
            <label htmlFor="user-query" className={labelClasses}>Search Users</label>
          </div>
          <div className="input-container nudge-half--bottom">
            <input type="text"
                   id="user-query"
                   valueLink={this.linkState('query')}
                   onKeyUp={this.handleKeyUp}
                   onKeyPress={this.handleKeyPress}
                   placeholder="Search for users..." />
            {this.renderSpinner()}
          </div>
        </div>

        {this.renderError()}

        {this.renderResults()}
      </div>
    );
  }

});

export default UserSearchForm;
