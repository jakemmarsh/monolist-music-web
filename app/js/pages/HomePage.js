'use strict';

import React           from 'react';
import {ListenerMixin} from 'reflux';
import _               from 'lodash';
import DocumentTitle   from 'react-document-title';

import Helpers         from '../utils/Helpers';
import GlobalActions   from '../actions/GlobalActions';
import HomePageStore   from '../stores/HomePageStore';
import Title           from '../components/Title';
import PlaylistList    from '../components/PlaylistList';

const HomePage = React.createClass({

  mixins: [ListenerMixin],

  propTypes: {
    currentUser: React.PropTypes.object,
    userCollaborations: React.PropTypes.array,
    userLikes: React.PropTypes.array,
    playlist: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      userCollaborations: [],
      userLikes: []
    };
  },

  getInitialState() {
    return {
      playlists: {
        trending: [],
        newest: []
      }
    };
  },

  _onPlaylistsChange(err, playlists) {
    if ( err ) {
      this.setState({
        loading: false,
        error: err
      });
    } else if ( playlists ) {
      this.setState({
        loading: false,
        error: null,
        playlists: playlists
      });
    }
  },

  componentDidMount() {
    const userId = this.props.currentUser ? this.props.currentUser.id : null;

    this.listenTo(HomePageStore, this._onPlaylistsChange);
    GlobalActions.loadHomePage(userId);
  },

  componentDidUpdate(prevProps) {
    const isNewUser = !_.isEqual(prevProps.currentUser, this.props.currentUser);
    const userHasId = !!this.props.currentUser.id;

    if ( isNewUser && userHasId ) {
      GlobalActions.loadHomePage(this.props.currentUser.id);
    }
  },

  renderUserRecentlyPlayed() {
    if ( !_.isEmpty(this.state.playlists.userRecentlyPlayed) ) {
      return (
        <div>
          <Title text="Continue Listening" icon="play" />
          <PlaylistList playlists={this.state.playlists.userRecentlyPlayed}
                        cardClassName="pure-u-1-3" />
        </div>
      );
    }
  },

  renderGlobalRecentlyPlayed() {
    if ( !_.isEmpty(this.state.playlists.globalRecentlyPlayed) ) {
      return (
        <div>
          <Title text="Being Listened To Now" icon="volume-up" />
          <PlaylistList playlists={this.state.playlists.globalRecentlyPlayed}
                        cardClassName="pure-u-1-3"
                        currentlyPlaying={true} />
        </div>
      );
    }
  },

  renderNewestPlaylists() {
    if ( !_.isEmpty(this.state.playlists.newest) ) {
      return (
        <div>
          <Title text="Newest Playlists" icon="asterisk" />
          <PlaylistList playlists={this.state.playlists.newest} cardClassName="pure-u-1-3" />
        </div>
      );
    }
  },

  render() {
    return (
      <DocumentTitle title={Helpers.buildPageTitle('Playlists')}>
      <section className="content home fx-4 max-width-wrapper">

        {this.renderUserRecentlyPlayed()}

        {this.renderGlobalRecentlyPlayed()}

        {this.renderNewestPlaylists()}

      </section>
      </DocumentTitle>
    );
  }

});

export default HomePage;
