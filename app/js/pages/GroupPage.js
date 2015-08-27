'use strict';

import React                      from 'react/addons';
import _                          from 'lodash';
import {ListenerMixin}            from 'reflux';
import {RouteHandler, Navigation} from 'react-router';
import DocumentTitle              from 'react-document-title';

import MetaTagsMixin              from '../mixins/MetaTagsMixin';
import Helpers                    from '../utils/Helpers';
import ViewingGroupStore          from '../stores/ViewingGroupStore';
import ViewingPostListStore       from '../stores/ViewingPostListStore';
import GroupActions               from '../actions/GroupActions';
import GroupSidebar               from '../components/GroupSidebar';
import TabBar                     from '../components/TabBar';
import ListLink                   from '../components/ListLink';

var GroupPage = React.createClass({

  mixins: [React.addons.LinkedStateMixin, ListenerMixin, MetaTagsMixin, Navigation],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
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
      // TODO: ensure user is member if group is private
      this.setState({
        loading: false,
        error: null,
        group: group || {}
      }, () => {
        GroupActions.loadPosts(this.state.group.id, this._onPostsChange);
        GroupActions.loadPlaylists(this.state.group.id, this._onPlaylistsChange);
        this.updateMetaTags({
          'url': 'http://www.monolist.co/group/' + this.state.group.slug,
          'title': this.state.group.title,
          'name': this.state.group.title,
          'image': this.state.group.imageUrl
        });
      });
    } else {
      this.transitionTo('Groups');
    }
  },

  _userCanView(group) {
    // TODO: finish this
    return true;
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
          <TabBar className="nudge-half--bottom">
            <ListLink to="Group" params={{ slug: this.props.params.slug }}>
              Feed
            </ListLink>
            <ListLink to="GroupPlaylists" params={{ slug: this.props.params.slug }}>
              Playlists
            </ListLink>
          </TabBar>

          <RouteHandler {...this.props} {...this.state} />
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