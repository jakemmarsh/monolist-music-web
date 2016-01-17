'use strict';

import React            from 'react';
import {ListenerMixin}  from 'reflux';
import _                from 'lodash';

import SearchActions    from '../actions/SearchActions';
import TrackActions     from '../actions/TrackActions';
import GlobalActions    from '../actions/GlobalActions';
import TrackSearchStore from '../stores/TrackSearchStore';
import PlaylistActions  from '../actions/PlaylistActions';
import Tracklist        from '../components/Tracklist';
import NoDataBlock      from '../components/NoDataBlock';

var TrackSearchPage = React.createClass({

  mixins: [ListenerMixin],

  propTypes: {
    location: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    currentTrack: React.PropTypes.object,
    setSearchState: React.PropTypes.func,
    userCollaborations: React.PropTypes.array,
    isLoading: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      currentUser: {},
      location: {}
    };
  },

  getInitialState() {
    return {
      results: [],
      searchCompleted: false
    };
  },

  _onResultsChange(err, data) {
    if ( err ) {
      this.props.setSearchState({
        error: err,
        loading: false
      });
    } else {
      this.setState({
        results: data,
        searchCompleted: true
      }, () => {
        this.props.setSearchState({
          error: null,
          loading: false
        });
      });
    }
  },

  componentDidUpdate(prevProps) {
    let haveNewQuery = this.props.location.query.q && this.props.location.query.q.length && prevProps.location.query.q !== this.props.location.query.q;
    let haveNewSources = prevProps.location.query.sources !== this.props.location.query.sources;

    if ( haveNewQuery || haveNewSources ) {
      this.doSearch();
    }
  },

  componentDidMount() {
    if ( this.props.location.query.q ) {
      this.doSearch();
    }
    this.listenTo(TrackSearchStore, this._onResultsChange);
  },

  doSearch() {
    let sources = this.props.location.query.sources ? this.props.location.query.sources.split(',') : ['bandcamp', 'soundcloud', 'youtube'];

    this.setState({ results: [], searchCompleted: false }, () => {
      this.props.setSearchState({
        error: null,
        loading: true
      });
      SearchActions.searchTracks(this.props.location.query.q, _.uniq(sources));
    });
  },

  renderStarTrackOption(track) {
    let userHasStarred = !_.isEmpty(this.props.currentUser) && !!_.where(this.props.currentUser.starredTracks, {
      sourceParam: track.sourceParam,
      sourceUrl: track.sourceUrl
    }).length;
    let iconClass = 'fa ' + (userHasStarred ? 'icon-star-o' : 'icon-star');
    let text = userHasStarred ? 'Unstar Track' : 'Star Track';
    let func = userHasStarred ? TrackActions.unstar : TrackActions.star;
    let element = null;

    if ( !_.isEmpty(this.props.currentUser) ) {
      element = (
        <li className="menu-item" onClick={func.bind(null, track, () => {})}>
          <i className={iconClass} />
          {text}
        </li>
      );
    }

    return element;
  },

  renderPossiblePlaylists(playlists, track) {
    return _.map(playlists, (playlist, index) => {
      return (
        <li className="menu-item"
            key={index}
            onClick={PlaylistActions.addTrack.bind(null, playlist, track, () => {})}>
          {playlist.title}
        </li>
      );
    });
  },

  renderAddTrackOption(track) {
    let element = null;

    if ( !!this.props.userCollaborations.length ) {
      element = (
        <li className="menu-item">
          <i className="icon-plus" />
          Add Track To Playlist
          <i className="icon-chevron-right float-right flush--right" />
          <ul>
            {this.renderPossiblePlaylists(this.props.userCollaborations, track)}
          </ul>
        </li>
      );
    }

    return element;
  },

  showTrackContextMenu(evt, track) {
    const menuItems = (
      <div>
        {this.renderStarTrackOption(track)}
        {this.renderAddTrackOption(track)}
      </div>
    );

    if ( evt ) {
      evt.stopPropagation();
      evt.preventDefault();
    }

    GlobalActions.openContextMenu(menuItems, evt.pageX, evt.pageY);
  },

  renderResults() {
    const playlist = { tracks: this.state.results };

    if ( !_.isEmpty(playlist.tracks) ) {
      return (
        <Tracklist type="search"
                   currentUser={this.props.currentUser}
                   playlist={playlist}
                   addToPlaylist={this.addToPlaylist}
                   currentTrack={this.props.currentTrack}
                   showContextMenu={this.showTrackContextMenu} />
      );
    } else if ( this.state.searchCompleted ) {
      return (
        <NoDataBlock iconClass="icon-frown-o"
                     heading="No track results."
                     subheading="Maybe try a different query?" />
      );
    } else if ( !this.props.isLoading ) {
      return (
        <NoDataBlock iconClass="icon-search"
                     heading="Search for tracks" />
      );
    }
  },

  render() {
    return (
      <div>

        {this.renderResults()}

      </div>
    );
  }

});

export default TrackSearchPage;