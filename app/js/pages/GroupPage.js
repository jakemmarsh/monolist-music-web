'use strict';

import React                from 'react/addons';
import _                    from 'lodash';
import {ListenerMixin}      from 'reflux';
import DocumentTitle        from 'react-document-title';

import Helpers              from '../utils/Helpers';
import ViewingGroupStore    from '../stores/ViewingGroupStore';
import GroupActions         from '../actions/GroupActions';
import GroupSidebar         from '../components/GroupSidebar';
import PlaylistList         from '../components/PlaylistList';

var GroupPage = React.createClass({

  mixins: [React.addons.LinkedStateMixin, ListenerMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      group: {},
      playlists: [],
      error: null,
      loading: true
    };
  },

  _onViewingGroupChange(err, group) {
    if ( err ) {
      this.setState({ loading: false, error: err.message });
    } else if ( group ) {
      this.setState({
        loading: false,
        error: null,
        group: group
      }, () => {
        if ( !_.isEmpty(this.state.group) ) {
          GroupActions.loadPlaylists(this.state.group.id, this._onPlaylistsChange);
        }
      });
    }
  },

  _onPlaylistsChange(err, playlists) {
    if ( err ) {
      this.setState({ loading: false, error: err.message });
    } else if ( playlists ) {
      this.setState({
        loading: false,
        error: null,
        playlists: playlists
      });
    }
  },

  // for UserSearchModalMixin
  isUserSelected(user) {
    return !!_.where(this.state.group.memberships, { userId: user.id }).length;
  },

  // for UserSearchModalMixin
  selectUser(user) {
    let groupCopy = this.state.group;

    groupCopy.memberships.push({
      userId: user.id
    });

    this.setState({ group: groupCopy }, GroupActions.addMember.bind(null, this.state.group.id, user));
  },

  // for UserSearchModalMixin
  deselectUser(user) {
    let groupCopy = this.state.group;

    groupCopy.memberships = _.reject(this.state.group.memberships, membership => {
      return membership.userId === user.id;
    });

    this.setState({ group: groupCopy }, GroupActions.removeMember.bind(null, this.state.group.id, user));
  },

  componentDidMount() {
    this.listenTo(ViewingGroupStore, this._onViewingGroupChange);
    GroupActions.open(this.props.params.slug.toString());
  },

  getUserLevel(user) {
    let userMembership = _.find(this.state.group.memberships, membership => { return membership.userId === user.id; });
    let level;

    if ( this.state.group.ownerId === user.id ) {
      level = 3;
    } else {
      level = userMembership ? userMembership.level : 0;
    }

    return level;
  },

  render() {
    return (
      <DocumentTitle title={Helpers.buildPageTitle(this.state.group.title)}>
      <div>

        <section className="content group">
          <div className="title-container flush--bottom">
            <div className="icon-container">
              <i className="fa fa-list"></i>
            </div>
            <h5 className="title">Group Playlists</h5>
          </div>

          <PlaylistList playlists={this.state.playlists} />
        </section>

        <nav className="sidebar right">
          <GroupSidebar currentUser={this.props.currentUser}
                        group={this.state.group}
                        getUserLevel={this.getUserLevel}
                        isUserSelected={this.isUserSelected}
                        selectUser={this.selectUser}
                        deselectUser={this.deselectUser} />
        </nav>

      </div>
      </DocumentTitle>
    );
  }

});

export default GroupPage;