'use strict';

import React            from 'react/addons';
import {ListenerMixin}  from 'reflux';
import _                from 'lodash';
import {Navigation}     from 'react-router';
import DocumentTitle    from 'react-document-title';

import APIUtils         from '../utils/APIUtils';
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
      playlistId: this.props.query.playlist || null,
      loading: false,
      results: null,
      searchBandcamp: _.indexOf(this.sources, 'bandcamp') !== -1,
      searchSoundCloud: _.indexOf(this.sources, 'soundcloud') !== -1,
      searchYouTube: _.indexOf(this.sources, 'youtube') !== -1,
      error: null
    };
  },

  componentDidUpdate(prevProps) {
    var haveNewQuery = this.props.query.q && this.props.query.q.length && prevProps.query.q !== this.props.query.q;
    var haveNewSources = prevProps.query.sources !== this.props.query.sources;

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
    var keyCode = evt.keyCode || evt.which;

    if ( keyCode === '13' || keyCode === 13 ) {
      this.reloadPage();
    }
  },

  reloadPage() {
    if ( this.state.query ) {
      this.replaceWith('TrackSearch', {}, { q: this.state.query, sources: this.sources.join(',') });
    }
  },

  doSearch() {
    this.setState({
      loading: true,
      results: null
    }, function() {
      GlobalActions.doTrackSearch(this.state.query, _.uniq(this.sources), this.doneSearching);
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

  addTrackToPlaylist(playlist, track) {
    PlaylistActions.addTrack(playlist, track);
  },

  renderStarTrackOption(track) {
    var userHasStarred = !_.isEmpty(this.props.currentUser) && !!_.where(this.props.currentUser.starredTracks, {
      sourceParam: track.sourceParam,
      sourceUrl: track.sourceUrl
    }).length;
    var iconClass = 'fa ' + (userHasStarred ? 'fa-star-o' : 'fa-star');
    var text = userHasStarred ? 'Unstar Track' : 'Star Track';
    var func = userHasStarred ? TrackActions.unstar : TrackActions.star;
    var element = null;

    if ( !_.isEmpty(this.props.currentUser) ) {
      element = (
        <li onClick={func.bind(null, track, null)}>
          <i className={iconClass} />
          {text}
        </li>
      );
    }

    return element;
  },

  renderPossiblePlaylists(playlists, track) {
    return _.map(playlists, function(playlist, index) {
      return (
        <li key={index} onClick={this.addTrackToPlaylist.bind(null, playlist, track)}>{playlist.title}</li>
      );
    }.bind(this));
  },

  renderAddTrackOption(track) {
    var element = null;

    if ( !!this.props.userCollaborations.length ) {
      element = (
        <li>
          <i className="fa fa-plus" />
          Add Track To Playlist
          <ul>
            {this.renderPossiblePlaylists(this.props.userCollaborations, track)}
          </ul>
        </li>
      );
    }

    return element;
  },

  showTrackContextMenu(track, e) {
    var menuItems = (
      <div>
        {this.renderStarTrackOption(track)}
        {this.renderAddTrackOption(track)}
      </div>
    );

    e.stopPropagation();
    e.preventDefault();

    this.props.showContextMenu(e, menuItems);
  },

  renderSearchSourceOptions() {
    var element = (
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

    return element;
  },

  renderSpinner() {
    var element = null;

    if ( this.state.loading ) {
      element = (
        <Spinner size={18} />
      );
    }

    return element;
  },

  renderError() {
    var element = null;

    if ( this.state.error ) {
      element = (
        <h4 className="title-container below-controls-bar error text-center">{this.state.error}</h4>
      );
    }

    return element;
  },

  renderTitle() {
    var element = null;

    if ( this.state.results && !this.state.loading ) {
      element = (
        <div className="title-container nudge-half--top flush--bottom">
          <div className="icon-container">
            <i className="fa fa-search"></i>
          </div>
          <h5 className="title">Track Results for: {this.props.query.q.replace(/(\+)|(%20)/gi, ' ')}</h5>
        </div>
      );
    }

    return element;
  },

  renderResults() {
    var results = null;

    if ( this.state.results && !this.state.loading ) {
      results = (
        <Tracklist type="search"
                   currentUser={this.props.currentUser}
                   playlist={{tracks: this.state.results}}
                   addToPlaylist={this.addToPlaylist}
                   currentTrack={this.props.currentTrack}
                   showContextMenu={this.showTrackContextMenu} />
      );
    }

    return results;
  },

  render() {
    return (
      <DocumentTitle title={APIUtils.buildPageTitle('Search Tracks')}>
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
      </DocumentTitle>
    );
  }

});

export default TrackSearchPage;