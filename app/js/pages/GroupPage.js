'use strict';

import React             from 'react/addons';
import _                 from 'lodash';
import {ListenerMixin}   from 'reflux';
import {Link}            from 'react-router';
import DocumentTitle     from 'react-document-title';

import APIUtils          from '../utils/APIUtils';
import ViewingGroupStore from '../stores/ViewingGroupStore';
import GroupActions      from '../actions/GroupActions';
import GroupSidebar      from '../components/GroupSidebar';
import PlaylistList      from '../components/PlaylistList';

var GroupPage = React.createClass({

  mixins: [ListenerMixin],

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

  componentDidMount() {
    this.listenTo(ViewingGroupStore, this._onViewingGroupChange);
    GroupActions.open(this.props.params.slug.toString());
  },

  getUserLevel(user) {
    let membership = _.find(this.props.group.members, member => { return member.id === this.props.currentUser.id });
    let level;

    if ( this.props.group.ownerId === this.props.currentUser.id ) {
      level = 'owner';
    } else {
      level = membership ? membership.level.toLowerCase() : 'member';
    }

    return level;
  },

  render() {
    return (
      <DocumentTitle title={APIUtils.buildPageTitle(this.state.group.title)}>
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
                        getUserLevel={this.getUserLevel} />
        </nav>

      </div>
      </DocumentTitle>
    );
  }

});

export default GroupPage;