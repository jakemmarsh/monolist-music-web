'use strict';

import React            from 'react/addons';
import {ListenerMixin}  from 'reflux';
import _                from 'lodash';
import {Navigation}     from 'react-router';

import Helpers          from '../utils/Helpers';
import GlobalActions    from '../actions/GlobalActions';
import TrackActions     from '../actions/TrackActions';
import TrackSearchStore from '../stores/TrackSearchStore';
import PlaylistActions  from '../actions/PlaylistActions';
import PageControlBar   from '../components/PageControlBar';
import Tracklist        from '../components/Tracklist';
import SearchBar        from '../components/SearchBar';
import Spinner          from '../components/Spinner';

var TrackSearchPage = React.createClass({

  sources: ['bandcamp', 'youtube', 'soundcloud'],

  mixins: [Navigation, React.addons.LinkedStateMixin, ListenerMixin],

  propTypes: {
    currentUser: React.PropTypes.object,
    currentTrack: React.PropTypes.object,
    showContextMenu: React.PropTypes.func.isRequired
  },

  getDefaultProps() {
    return {
      currentUser: {}
    };
  },

  getInitialState() {
    this.sources = this.props.query.sources ? this.props.query.sources.split(',') : ['bandcamp', 'soundcloud', 'youtube'];

    return {
      query: this.props.query.q ? this.props.query.q.replace(/(\+)|(%20)/gi, ' ') : '',
      loading: false,
      results: null,
      searchBandcamp: _.indexOf(this.sources, 'bandcamp') !== -1,
      searchSoundCloud: _.indexOf(this.sources, 'soundcloud') !== -1,
      searchYouTube: _.indexOf(this.sources, 'youtube') !== -1,
      error: null
    };
  },

  componentDidUpdate(prevProps) {
    let haveNewQuery = this.props.query.q && this.props.query.q.length && prevProps.query.q !== this.props.query.q;
    let haveNewSources = prevProps.query.sources !== this.props.query.sources;

    if ( haveNewQuery || haveNewSources ) {
      this.setState({
        query: this.props.query.q
      }, this.doSearch);
    }
  },

  componentDidMount() {
    if ( this.state.query.length ) {
      this.doSearch();
    }
    this.listenTo(TrackSearchStore, this.doneSearching);
  },

  toggleBandcamp() {
    this.setState({
      searchBandcamp: !this.state.searchBandcamp
    }, function() {
      if ( this.state.searchBandcamp ) {
        this.sources.push('bandcamp');
      } else {
        this.sources = _.without(this.sources, 'bandcamp');
      }
      this.reloadPage();
    });
  },

  toggleSoundCloud() {
    this.setState({
      searchSoundCloud: !this.state.searchSoundCloud
    }, function() {
      if ( this.state.searchSoundCloud ) {
        this.sources.push('soundcloud');
      } else {
        this.sources = _.without(this.sources, 'soundcloud');
      }
      this.reloadPage();
    });
  },

  toggleYouTube() {
    this.setState({
      searchYouTube: !this.state.searchYouTube
    }, function() {
      if ( this.state.searchYouTube ) {
        this.sources.push('youtube');
      } else {
        this.sources = _.without(this.sources, 'youtube');
      }
      this.reloadPage();
    });
  },

  handleKeyPress(evt) {
    let keyCode = evt.keyCode || evt.which;

    if ( keyCode === '13' || keyCode === 13 ) {
      this.reloadPage();
    }
  },

  reloadPage() {
    let queryObj = {
      q: this.state.query,
      sources: this.sources.join(',')
    };

    if ( !!parseInt(this.props.query.playlist) ) {
      queryObj.playlist = this.props.query.playlist;
    }

    if ( this.state.query ) {
      this.replaceWith('TrackSearch', {}, queryObj);
    }
  },

  doSearch() {
    this.setState({
      loading: true,
      results: null
    }, function() {
      GlobalActions.doTrackSearch(this.state.query, _.uniq(this.sources));
    });
  },

  doneSearching(err, data) {
    if ( err ) {
      console.log('error doing search:', err);
      this.setState({ error: err.message, loading: false });
    } else {
      this.setState({
        loading: false,
        results: data,
        error: null
      });
    }
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
        <li className="menu-item" onClick={func.bind(null, track, null)}>
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
            onClick={PlaylistActions.addTrack.bind(null, playlist, track)}>
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
          <ul>
            {this.renderPossiblePlaylists(this.props.userCollaborations, track)}
          </ul>
        </li>
      );
    }

    return element;
  },

  showTrackContextMenu(evt, track) {
    let menuItems = (
      <div>
        {this.renderStarTrackOption(track)}
        {this.renderAddTrackOption(track)}
      </div>
    );

    if ( evt ) {
      evt.stopPropagation();
      evt.preventDefault();
    }

    this.props.showContextMenu(evt, menuItems);
  },

  renderSearchSourceOptions() {
    return (
      <ul>
        <li>
          <input type="checkbox"
                 id="bandcamp"
                 checked={this.state.searchBandcamp}
                 onChange={this.toggleBandcamp} />
          <label htmlFor="bandcamp">Bandcamp</label>
        </li>
        <li>
          <input type="checkbox"
                 id="soundcloud"
                 checked={this.state.searchSoundCloud}
                 onChange={this.toggleSoundCloud} />
          <label htmlFor="soundcloud">SoundCloud</label>
        </li>
        <li>
          <input type="checkbox"
                 id="youtube"
                 checked={this.state.searchYouTube}
                 onChange={this.toggleYouTube} />
          <label htmlFor="youtube">YouTube</label>
        </li>
      </ul>
    );
  },

  renderSpinner() {
    if ( this.state.loading ) {
      return (
        <Spinner size={18} />
      );
    }
  },

  renderError() {
    if ( this.state.error ) {
      return (
        <h4 className="title-container below-controls-bar error text-center">{this.state.error}</h4>
      );
    }
  },

  renderTitle() {
    if ( this.state.results && !this.state.loading ) {
      return (
        <div className="title-container nudge-half--top flush--bottom">
          <div className="icon-container">
            <i className="icon-search"></i>
          </div>
          <h5 className="title">Track Results for: {this.props.query.q.replace(/(\+)|(%20)/gi, ' ')}</h5>
        </div>
      );
    }
  },

  renderResults() {
    let playlist = { tracks: this.state.results };
    let hasPlaylistId = !!parseInt(this.props.query.playlist);

    if ( hasPlaylistId ) {
      playlist.id = this.props.query.playlist;
    }

    if ( this.state.results && !this.state.loading ) {
      return (
        <Tracklist type="search"
                   currentUser={this.props.currentUser}
                   playlist={playlist}
                   addToPlaylist={this.addToPlaylist}
                   currentTrack={this.props.currentTrack}
                   showContextMenu={this.showTrackContextMenu}
                   shouldRenderAddButton={hasPlaylistId} />
      );
    }
  },

  render() {
    return (
      <section className="content search">

        <PageControlBar type="search">
          <div className="search-container">
            <SearchBar ref="SearchBar"
                       valueLink={this.linkState('query')}
                       onKeyPress={this.handleKeyPress}
                       placeholder="Search all tracks..." />
          </div>
          <div className="loading-container">
            {this.renderSpinner()}
          </div>
          <div className="options-container">
            {this.renderSearchSourceOptions()}
          </div>
        </PageControlBar>

        {this.renderTitle()}

        {this.renderResults()}

        {this.renderError()}

      </section>
    );
  }

});

export default TrackSearchPage;