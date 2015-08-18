'use strict';

import React                   from 'react/addons';
import {ListenerMixin}         from 'reflux';
import _                       from 'lodash';
import DocumentTitle           from 'react-document-title';

import Helpers                 from '../utils/Helpers';
import MetaTagsMixin           from '../mixins/MetaTagsMixin';
import UserActions             from '../actions/UserActions';
import ViewingProfileStore     from '../stores/ViewingProfileStore';
import AuthenticatedRouteMixin from '../mixins/AuthenticatedRouteMixin';
import Title                   from '../components/Title';
import PlaylistList            from '../components/PlaylistList';
import MiniTracklist           from '../components/MiniTracklist';
import ProfileSidebar          from '../components/ProfileSidebar';

var ProfilePage = React.createClass({

  mixins: [AuthenticatedRouteMixin, ListenerMixin, MetaTagsMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    currentTrack: React.PropTypes.object
  },

  getInitialState() {
    return {
      currentUser: {},
      user: {},
      error: null
    };
  },

  _onViewingProfileChange(err, user) {
    if ( err ) {
      this.setState({ error: err });
    } else {
      this.setState({ user: user }, () => {
        this.updateMetaTags({
          'url': 'http://www.monolist.co/profile/' + this.state.user.username,
          'title': this.state.user.username,
          'name': this.state.user.username,
          'image': this.state.user.imageUrl
        });
      });
    }
  },

  componentWillReceiveProps(nextProps) {
    if ( nextProps.params.username !== this.props.params.username || !_.isEqual(this.props.currentUser, nextProps.currentUser) ) {
      UserActions.openProfile(nextProps.params.username);
    }
  },

  componentDidMount() {
    this.listenTo(ViewingProfileStore, this._onViewingProfileChange);
    UserActions.openProfile(this.props.params.username);
  },

  renderUserPlaylists() {
    var element = null;

    if ( !_.isEmpty(this.state.user.playlists) ) {
      element = (
        <PlaylistList playlists={this.state.user.playlists} />
      );
    } else {
      element = (
        <h4 className="hard nudge--bottom light">This user has not created any public playlists yet!</h4>
      );
    }

    return element;
  },

  renderUserCollaborations() {
    var element = null;

    if ( !_.isEmpty(this.state.user.collaborations) ) {
      element = (
        <PlaylistList playlists={this.state.user.collaborations} />
      );
    } else {
      element = (
        <h4 className="hard nudge--bottom light">This user has not collaborated on any public playlists yet!</h4>
      );
    }

    return element;
  },

  renderUserPlaylistLikes() {
    var element = null;

    if ( !_.isEmpty(this.state.user.likes) ) {
      element = (
        <PlaylistList playlists={this.state.user.likes} />
      );
    } else {
      element = (
        <h4 className="hard nudge--bottom light">This user has not liked any playlists yet!</h4>
      );
    }

    return element;
  },

  renderUserStarredTracks() {
    var element = null;

    if ( !_.isEmpty(this.state.user.starredTracks) ) {
      element = (
        <MiniTracklist currentUser={this.props.currentUser}
                       profileUser={this.state.user}
                       currentTrack={this.props.currentTrack}
                       tracks={this.state.user.starredTracks} />
      );
    } else {
      element = (
        <h5 className="hard light">This user has not starred any tracks yet!</h5>
      );
    }

    return element;
  },

  render() {
    return (
      <DocumentTitle title={Helpers.buildPageTitle(this.state.user.username)}>
      <div>

        <section className="content profile has-right-sidebar">

          <div className="playlists-container">
            <Title text="Playlists" icon="list" />
            {this.renderUserPlaylists()}

            <Title text="Collaborations" icon="handshake" />
            {this.renderUserCollaborations()}

            <Title text="Liked" icon="heart" />
            {this.renderUserPlaylistLikes()}
          </div>


          <div className="stars-container">
            <Title text="Starred" icon="star" />
            {this.renderUserStarredTracks()}
          </div>

        </section>

        <nav className="sidebar right">
          <ProfileSidebar currentUser={this.props.currentUser} user={this.state.user} />
        </nav>

      </div>
      </DocumentTitle>
    );
  }

});

export default ProfilePage;