/**
 * @jsx React.DOM
 */
'use strict';

var React                 = require('react/addons');
var _                     = require('lodash');
var $                     = require('jquery');
var cx                    = React.addons.classSet;

var UserSearchStore       = require('../stores/UserSearchStore');
var PlaylistActions       = require('../actions/PlaylistActions');
var UserActions           = require('../actions/UserActions');
var LayeredComponentMixin = require('./LayeredComponentMixin');
var Modal                 = require('../components/Modal');
var Spinner               = require('../components/Spinner');
var Avatar                = require('../components/Avatar');

var AddCollaboratorMixin = {

  // NOTE: LinkedStateMixin and ListenerMixin required, but already being loaded by PlaylistPage.js where this mixin is used
  mixins: [LayeredComponentMixin],

  getInitialState: function() {
    return {
      showCollaboratorModal: false,
      userSearchQuery: '',
      users: [],
      loading: false,
      focusedInput: null
    };
  },

  componentDidMount: function() {
    this.timer = null;
    this.listenTo(UserSearchStore, this.doneSearching);
  },

  componentWillReceiveProps: function(nextProps) {
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

  doneSearching: function(err, users) {
    if ( err ) {
      this.setState({ error: err.message, loading: false });
    } else {
      this.setState({ users: users, error: null, loading: false });
    }
  },

  createFocusListeners: function() {
    var component = this;

    $('input#user-query').focus(function() {
      component.setState({ focusedInput: $(this).attr('id') });
    });

    $('input#user-query').blur(function() {
      component.setState({ focusedInput: null });
    });
  },

  toggleCollaboratorModal: function() {
    this.setState({ showCollaboratorModal: !this.state.showCollaboratorModal }, function() {
      if ( this.state.showCollaboratorModal ) {
        this.createFocusListeners();
      }
    }.bind(this));
  },

  doSearch: function() {
    if ( this.state.userSearchQuery.length ) {
      this.setState({ loading: true });
      UserActions.search(this.state.userSearchQuery);
    }
  },

  addCollaborator: function(user) {
    var playlistCopy = this.state.playlist;

    playlistCopy.collaborations.push({
      userId: user.id
    });

    this.setState({ playlist: playlistCopy }, PlaylistActions.addCollaborator(this.state.playlist, user));
  },

  removeCollaborator: function(user) {
    var playlistCopy = this.state.playlist;

    playlistCopy.collaborations = _.reject(this.state.playlist.collaborations, function(collaboration) {
      return collaboration.userId === user.id;
    });

    this.setState({ playlist: playlistCopy }, PlaylistActions.removeCollaborator(this.state.playlist, user));
  },

  handleKeyUp: function() {
    clearTimeout(this.timer);
    this.timer = setTimeout(this.doSearch, 1000);
  },

  handleKeyPress: function(evt) {
    var keyCode = evt.keyCode || evt.which;

    if ( keyCode === '13' || keyCode === 13 ) {
      clearTimeout(this.timer);
      this.doSearch();
    }
  },

  renderSpinner: function() {
    var element = null;

    if ( this.state.loading ) {
      element = (
        <Spinner size={10} />
      );
    }

    return element;
  },

  renderError: function() {
    var element = null;

    if ( this.state.error ) {
      element = (
        <div className="error-container nudge-half--ends">
          {this.state.error}
        </div>
      );
    }

    return element;
  },

  renderUserResults: function() {
    var element = null;
    var users;
    var userIsCollaborator;
    var addIconClasses;
    var addIconFunction;

    if ( this.state.users && this.state.users.length ) {
      users = _.map(this.state.users, function(user, index) {
        userIsCollaborator = !!_.where(this.state.playlist.collaborations, { userId: user.id }).length;
        addIconFunction = userIsCollaborator ? this.removeCollaborator.bind(null, user) : this.addCollaborator.bind(null, user);
        addIconClasses = cx({
          'add-icon': true,
          'fa': true,
          'fa-plus': !userIsCollaborator,
          'fa-check': userIsCollaborator,
          'inactive': userIsCollaborator
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

  renderLayer: function() {
    var element = (<span />);
    var labelClasses = cx({ 'active': this.state.focusedInput === 'user-query' });

    if ( this.state.showCollaboratorModal ) {
      element = (
        <Modal className="add-collaborators" onRequestClose={this.toggleCollaboratorModal}>

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
  },

};

module.exports = AddCollaboratorMixin;