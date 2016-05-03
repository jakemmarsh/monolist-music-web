'use strict';

import React                from 'react';
import _                    from 'lodash';
import {ListenerMixin}      from 'reflux';
import {History}            from 'react-router';
import DocumentTitle        from 'react-document-title';

import MetaTagsMixin        from '../mixins/MetaTagsMixin';
import Helpers              from '../utils/Helpers';
import PermissionsHelpers   from '../utils/PermissionsHelpers';
import ViewingGroupStore    from '../stores/ViewingGroupStore';
import ViewingPostListStore from '../stores/ViewingPostListStore';
import GroupActions         from '../actions/GroupActions';
import GroupSubheader       from '../components/GroupSubheader';
import TabBar               from '../components/TabBar';
import ListLink             from '../components/ListLink';

const GroupPage = React.createClass({

  mixins: [ListenerMixin, MetaTagsMixin, History],

  propTypes: {
    children: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    currentTrack: React.PropTypes.object,
    params: React.PropTypes.object,
    query: React.PropTypes.object,
    userCollaborations: React.PropTypes.array,
    userLikes: React.PropTypes.array
  },

  getInitialState() {
    return {
      group: {
        owner: {}
      },
      posts: [],
      playlists: [],
      error: null,
      loading: true
    };
  },

  _onViewingGroupChange(err, group) {
    if ( err ) {
      this.setState({ loading: false, error: err });
      return;
    }

    const hasGroup = !_.isEmpty(group);
    const hasNewSlug = group.id === this.state.group.id && group.slug !== this.state.group.slug;
    const userCanView = PermissionsHelpers.userCanViewGroup(group, this.props.currentUser);

    if ( hasGroup && userCanView ) {
      if ( hasNewSlug ) {
        this.history.replaceState(null, `/group/${group.slug}`);
      }

      this.setState({
        loading: false,
        error: null,
        group: group || {}
      }, () => {
        GroupActions.loadPosts(this.state.group.id);
        GroupActions.loadPlaylists(this.state.group.id, this._onPlaylistsChange);
        this.updateMetaTags({
          'url': 'http://www.monolist.co/group/' + this.state.group.slug,
          'title': this.state.group.title,
          'name': this.state.group.title,
          'image': this.state.group.imageUrl
        });
      });
    } else {
      this.history.pushState(null, '/groups');
    }
  },

  _onPostsChange(err, posts) {
    if ( !err ) {
      this.setState({
        posts: posts || []
      });
    }
  },

  _onPlaylistsChange(err, playlists) {
    if ( !err ) {
      this.setState({
        playlists: playlists || []
      });
    }
  },

  isUserMember(user) {
    return user && _.some(this.state.group.members, { id: user.id });
  },

  addMember(user) {
    GroupActions.addMember(this.state.group.id, user);
  },

  removeMember(user) {
    GroupActions.removeMember(this.state.group.id, user);
  },

  componentDidMount() {
    this.listenTo(ViewingGroupStore, this._onViewingGroupChange);
    this.listenTo(ViewingPostListStore, this._onPostsChange);
    GroupActions.open(this.props.params.slug.toString());
  },

  getUserLevel(user) {
    const userMembership = _.find(this.state.group.memberships, membership => { return membership.userId === user.id; });
    let level;

    if ( this.state.group.ownerId === user.id ) {
      level = 3;
    } else {
      level = userMembership ? userMembership.level : 0;
    }

    return level;
  },

  renderChildren() {
    return this.props.children && React.cloneElement(this.props.children, {
      params: this.props.params,
      query: this.props.query,
      currentUser: this.props.currentUser,
      currentTrack: this.props.currentTrack,
      group: this.state.group,
      posts: this.state.posts,
      playlists: this.state.playlists,
      isUserMember: this.isUserMember,
      userCollaborations: this.props.userCollaborations,
      userLikes: this.props.userLikes
    });
  },

  render() {
    return (
      <DocumentTitle title={Helpers.buildPageTitle(this.state.group.title)}>
      <div className="d-f fx-4">
        <section className="content group fx-3">
          <GroupSubheader currentUser={this.props.currentUser}
                          group={this.state.group}
                          getUserLevel={this.getUserLevel}
                          isUserMember={this.isUserMember}
                          addMember={this.addMember}
                          removeMember={this.removeMember} />
          <div className="max-width-wrapper">
            <TabBar className="nudge-half--bottom">
              <ListLink to={`/group/${this.props.params.slug}/feed`}>
                Feed
              </ListLink>
              <ListLink to={`/group/${this.props.params.slug}/playlists`}>
                Playlists
              </ListLink>
            </TabBar>
            {this.renderChildren()}
          </div>
        </section>

      </div>
      </DocumentTitle>
    );
  }

});

export default GroupPage;
