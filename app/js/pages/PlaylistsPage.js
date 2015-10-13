'use strict';

import React              from 'react';
import {ListenerMixin}    from 'reflux';
import {Link}             from 'react-router';
import _                  from 'lodash';
import DocumentTitle      from 'react-document-title';

import Helpers            from '../utils/Helpers';
import GlobalActions      from '../actions/GlobalActions';
import PlaylistsPageStore from '../stores/PlaylistsPageStore';
import Title              from '../components/Title';
import PlaylistList       from '../components/PlaylistList';

var PlaylistsPage = React.createClass({

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
    this.listenTo(PlaylistsPageStore, this._onPlaylistsChange);
    GlobalActions.loadPlaylistsPage();
  },

  renderCollaboratingPlaylists() {
    if ( !_.isEmpty(this.props.currentUser) ) {
      return (
        <div>
          <div className="pure-g">
            <div className="pure-u-5-6">
              <Title text="Your Collaborations" icon="handshake" className="hard" />
            </div>
            <div className="pure-u-1-6 text-right">
              <Link className="btn text-center" to="/playlists/create">
                <i className="icon-plus block" /> Create
              </Link>
            </div>
          </div>
          {!_.isEmpty(this.props.userCollaborations)
            ? <PlaylistList playlists={this.props.userCollaborations} cardClassName="pure-u-1-3" />
            : <h4 className="hard nudge--bottom light">You have not collaborated on any playlists yet!</h4>
          }
        </div>
      );
    }
  },

  renderLikedPlaylists() {
    if ( !_.isEmpty(this.props.currentUser) ) {
      return (
        <div>
          <Title text="Your Liked Playlists" icon="heart" />
          {!_.isEmpty(this.props.userLikes)
            ? <PlaylistList playlists={this.props.userLikes} cardClassName="pure-u-1-3" />
            : <h4 className="hard nudge--bottom light">You have not liked any playlists yet!</h4>
          }
        </div>
      );
    }
  },

  renderTrendingPlaylists() {
    return (
      <div>
        <Title text="Trending Playlists" icon="line-chart" />
        {!_.isEmpty(this.state.playlists.trending)
            ? <PlaylistList playlists={this.state.playlists.trending} cardClassName="pure-u-1-3" />
            : <h4 className="hard nudge--bottom light">There are no trending playlists yet!</h4>
          }
      </div>
    );
  },

  renderNewestPlaylists() {
    return (
      <div>
        <Title text="Newest Playlists" icon="asterisk" />
        {!_.isEmpty(this.state.playlists.newest)
            ? <PlaylistList playlists={this.state.playlists.newest} cardClassName="pure-u-1-3" />
            : <h4 className="hard nudge--bottom light">There are no new playlists yet!</h4>
          }
      </div>
    );
  },

  render() {
    return (
      <DocumentTitle title={Helpers.buildPageTitle('Playlists')}>
      <section className="content playlists">

        {this.renderCollaboratingPlaylists()}

        {this.renderLikedPlaylists()}

        {this.renderTrendingPlaylists()}

        {this.renderNewestPlaylists()}

      </section>
      </DocumentTitle>
    );
  }

});

export default PlaylistsPage;