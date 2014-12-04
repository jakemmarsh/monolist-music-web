/**
 * @jsx React.DOM
 */
'use strict';

var React            = require('react/addons');
var Reflux           = require('reflux');
var _                = require('lodash');
var Navigation       = require('react-router').Navigation;

var GlobalActions    = require('../actions/GlobalActions');
var TrackSearchStore = require('../stores/TrackSearchStore');
var DocumentTitle    = require('../components/DocumentTitle');
var PlaylistActions  = require('../actions/PlaylistActions');
var PageControlBar   = require('../components/PageControlBar');
var Tracklist        = require('../components/Tracklist');
var SearchBar        = require('../components/SearchBar');
var Spinner          = require('../components/Spinner');

var TrackSearchPage = React.createClass({

  sources: ['bandcamp', 'youtube', 'soundcloud'],

  mixins: [Navigation, React.addons.LinkedStateMixin, Reflux.ListenerMixin],

  propTypes: {
    playlist: React.PropTypes.object,
    currentTrack: React.PropTypes.object,
    showContextMenu: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    this.sources = this.props.query.sources ? this.props.query.sources.split(',') : ['bandcamp', 'soundcloud', 'youtube'];

    return {
      query: this.props.query.q ? this.props.query.q.replace(/(\+)|(%20)/gi, ' ') : '',
      isSearching: false,
      results: null,
      searchBandcamp: _.indexOf(this.sources, 'bandcamp') !== -1,
      searchSoundCloud: _.indexOf(this.sources, 'soundcloud') !== -1,
      searchYouTube: _.indexOf(this.sources, 'youtube') !== -1
    };
  },

  componentDidUpdate: function(prevProps) {
    var haveNewQuery = this.props.query.q && this.props.query.q.length && prevProps.query.q !== this.props.query.q;
    var haveNewSources = prevProps.query.sources !== this.props.query.sources;

    if ( haveNewQuery || haveNewSources ) {
      this.setState({
        query: this.props.query.q
      }, function() {
        this.doSearch();
      });
    }
  },

  componentDidMount: function() {
    if ( this.state.query.length ) {
      this.doSearch();
    }
    this.listenTo(TrackSearchStore, this.doneSearching);
  },

  toggleBandcamp: function() {
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

  toggleSoundCloud: function() {
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

  toggleYouTube: function() {
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

  submitOnEnter: function(evt) {
    var keyCode = evt.keyCode || evt.which;

    if ( keyCode === '13' || keyCode === 13 ) {
      this.reloadPage();
    }
  },

  reloadPage: function() {
    if ( this.state.query ) {
      this.transitionTo('TrackSearch', {}, { q: this.state.query, sources: this.sources.join(',') });
    }
  },

  doSearch: function() {
    this.setState({
      isSearching: true,
      results: null
    }, function() {
      GlobalActions.doTrackSearch(this.state.query, _.uniq(this.sources), this.doneSearching);
    });
  },

  doneSearching: function(err, data) {
    if ( err ) {

    } else {
      this.setState({
        isSearching: false,
        results: data
      });
    }
  },

  addTrackToPlaylist: function(playlist, track) {
    PlaylistActions.addTrack(playlist, track);
  },

  showAddTrackOptions: function(track) {
    return _.map(this.props.userCollaborations, function(playlist, index) {
      return (
        <li key={index} onClick={this.addTrackToPlaylist.bind(null, playlist, track)}>{playlist.title}</li>
      );
    }.bind(this));
  },

  showTrackContextMenu: function(track, e) {
    var menuItems = (
      <li>
        <i className="fa fa-plus"></i>
        Add Track To Playlist
        <ul>
          {this.showAddTrackOptions(track)}
        </ul>
      </li>
    );

    e.stopPropagation();
    e.preventDefault();

    this.props.showContextMenu(e, menuItems);
  },

  renderSearchSourceOptions: function() {
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

  renderLoadingIndicator: function() {
    var element = null;

    if ( this.state.isSearching ) {
      element = (
        <Spinner size={18} />
      );
    }

    return element;
  },

  renderResults: function() {
    var results = null;

    if ( this.state.results && !this.state.isSearching ) {
      results = (
        <Tracklist type="search"
                   playlist={{tracks: this.state.results}}
                   addToPlaylist={this.addToPlaylist}
                   currentTrack={this.props.currentTrack}
                   showContextMenu={this.showTrackContextMenu} />
      );
    }

    return results;
  },

  render: function() {
    return (
      <section className="content search">

        <DocumentTitle title="Search Tracks" />

        <PageControlBar type="search">
          <div className="search-container">
            <SearchBar ref="SearchBar"
                       valueLink={this.linkState('query')}
                       onKeyPress={this.submitOnEnter}
                       placeholder="Search all tracks..." />
          </div>
          <div className="loading-container">
            {this.renderLoadingIndicator()}
          </div>
          <div className="options-container">
            {this.renderSearchSourceOptions()}
          </div>
        </PageControlBar>

        {this.renderResults()}

      </section>
    );
  }

});

module.exports = React.createFactory(TrackSearchPage);