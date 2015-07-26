'use strict';

import React                 from 'react/addons';
import _                     from 'lodash';
import $                     from 'jquery';
import cx                    from 'classnames';

import UserSearchStore       from '../stores/UserSearchStore';
import UserActions           from '../actions/UserActions';
import LayeredComponentMixin from './LayeredComponentMixin';
import Modal                 from '../components/Modal';
import Spinner               from '../components/Spinner';
import Avatar                from '../components/Avatar';

var UserSearchModalMixin = {

  // NOTE: LinkedStateMixin and ListenerMixin required, but already being loaded by components/pages where this mixin is used
  mixins: [LayeredComponentMixin],

  getInitialState() {
    return {
      showUserSearchModal: false,
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
        $(this).removeClass('fa-check');
        $(this).addClass('fa-remove');
      });

      $('.add-icon.inactive').mouseleave(function() {
        $(this).removeClass('fa-remove');
        $(this).addClass('fa-check');
      });
    }
  },

  doneSearching(err, users) {
    if ( err ) {
      this.setState({ userSearchError: err.message, userResultsLoading: false });
    } else {
      this.setState({ userResults: users, userSearchError: null, userResultsLoading: false });
    }
  },

  createFocusListeners() {
    let component = this;

    $('input#user-query').focus(function() {
      component.setState({ focusedInput: $(this).attr('id') });
    });

    $('input#user-query').blur(function() {
      component.setState({ focusedInput: null });
    });
  },

  toggleUserSearchModal() {
    this.setState({ showUserSearchModal: !this.state.showUserSearchModal }, () => {
      if ( this.state.showUserSearchModal ) {
        this.createFocusListeners();
      }
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
    let keyCode = evt.keyCode || evt.which;

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
          'fa-plus': !userIsSelected,
          'fa-check': userIsSelected,
          'inactive': userIsSelected
        });

        return (
          <li className="user" key={index}>
            <div className="avatar-container">
              <Avatar user={user} includeLink={false} size="40px" />
            </div>
            <div className="name-container">
              <h5>{user.username}</h5>
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

  renderLayer() {
    let element = (<span />);
    let labelClasses = cx({ 'active': this.state.focusedInput === 'user-query' });

    if ( this.state.showUserSearchModal ) {
      element = (
        <Modal className="user-search" onRequestClose={this.toggleUserSearchModal}>

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

        </Modal>
      );
    }

    return element;
  }

};

export default UserSearchModalMixin;