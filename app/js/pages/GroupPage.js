'use strict';

import React                from 'react/addons';
import _                    from 'lodash';
import {ListenerMixin}      from 'reflux';
import {History}            from 'react-router';
import DocumentTitle        from 'react-document-title';

import MetaTagsMixin        from '../mixins/MetaTagsMixin';
import Helpers              from '../utils/Helpers';
import ViewingGroupStore    from '../stores/ViewingGroupStore';
import ViewingPostListStore from '../stores/ViewingPostListStore';
import GroupActions         from '../actions/GroupActions';
import GroupSidebar         from '../components/GroupSidebar';
import TabBar               from '../components/TabBar';
import ListLink             from '../components/ListLink';

var GroupPage = React.createClass({

  mixins: [React.addons.LinkedStateMixin, ListenerMixin, MetaTagsMixin, History],

  propTypes: {
    children: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    params: React.PropTypes.object
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
      this.setState({ loading: false, error: err.message });
    } else if ( group && this._userCanView(group) ) {
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
      this.history.pushState(null, `/groups`);
    }
  },

  _userCanView(group) {
    let membership = null;

    if ( !_.isEmpty(this.props.currentUser) ) {
      membership = _.find(group.memberships, { UserId: this.props.currentUser.id });
    }

    if ( group.privacy === 'public' || !_.isEmpty(membership) || group.Owner.id === this.props.currentUser.id ) {
      return true;
    }

    return false;
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

  // for UserSearchModalMixin
  isUserSelected(user) {
    return !!_.where(this.state.group.members, { id: user.id }).length;
  },

  // for UserSearchModalMixin
  selectUser(user) {
    let groupCopy = this.state.group;

    groupCopy.members.push({
      id: user.id
    });

    this.setState({ group: groupCopy }, GroupActions.addMember.bind(null, this.state.group.id, user));
  },

  // for UserSearchModalMixin
  deselectUser(user) {
    let groupCopy = this.state.group;

    groupCopy.members = _.reject(this.state.group.members, member => {
      return member.id === user.id;
    });

    this.setState({ group: groupCopy }, GroupActions.removeMember.bind(null, this.state.group.id, user));
  },

  componentDidMount() {
    this.listenTo(ViewingGroupStore, this._onViewingGroupChange);
    this.listenTo(ViewingPostListStore, this._onPostsChange);
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

  renderChildren() {
    return this.props.children && React.cloneElement(this.props.children, {
      currentUser: this.props.currentUser
    });
  },

  render() {
    return (
      <DocumentTitle title={Helpers.buildPageTitle(this.state.group.title)}>
      <div>

        <section className="content group">
          <TabBar className="nudge-half--bottom">
            <ListLink to={`/group/${this.props.params.slug}/feed`}>
              Feed
            </ListLink>
            <ListLink to={`/group/${this.props.params.slug}/playlists`}>
              Playlists
            </ListLink>
          </TabBar>

          {this.renderChildren()}
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