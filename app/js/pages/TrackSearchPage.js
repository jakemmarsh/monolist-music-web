/**
 * @jsx React.DOM
 */
'use strict';

var React               = require('react/addons');
var _                   = require('underscore');
var transitionTo        = require('react-router').transitionTo;

var PageControlBar      = require('../components/PageControlBar');
var Tracklist           = require('../components/Tracklist');
var SearchBar           = require('../components/SearchBar');
var SearchAPI           = require('../utils/SearchAPI');

var SearchPage = React.createClass({

  sources: ['bandcamp', 'youtube', 'soundcloud'],

  propTypes: {
    updateHeader: React.PropTypes.func.isRequired,
    playlist: React.PropTypes.object,
    currentTrack: React.PropTypes.object,
    selectTrack: React.PropTypes.func
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
    this.props.updateHeader({
      title: 'Search Tracks',
      icon: 'fa-search'
    });

    if ( this.state.query.length ) {
      this.doSearch();
    }
  },

  updateQuery: function(evt) {
    this.setState({
      query: evt.target.value
    });
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
      transitionTo('TrackSearch', {}, { q: this.state.query, sources: this.sources.join(',') });
    }
  },

  doSearch: function() {
    this.setState({
      isSearching: true,
      results: null
    }, function() {
      SearchAPI.get(this.state.query, _.uniq(this.sources)).then(function(data) {
        this.doneSearching(data);
      }.bind(this), function(err) {
        console.log('error doing search:', err);
      });
    });
  },

  doneSearching: function(data) {
    this.setState({
      isSearching: false,
      results: data
    });
  },

  selectTrack: function(track, index) {
    // TODO: only call this if its not already the current playlist
    this.props.selectPlaylist(this.state.results);

    this.props.selectTrack(track, index);
  },

  addToPlaylist: function(track) {
    console.log('add to playlist:', track);
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
        <h1>Searching...</h1>
      );
    }

    return element;
  },

  renderResults: function() {
    var results = null;

    if ( this.state.results && !this.state.isSearching ) {
      results = (
        <Tracklist type="search"
                   tracks={this.state.results}
                   selectTrack={this.selectTrack}
                   addToPlaylist={this.addToPlaylist}
                   currentTrack={this.props.currentTrack} />
      );
    }

    return results;
  },

  render: function() {
    return (
      <section className="content search">

        <PageControlBar type="search">
          <div className="search-container">
            <SearchBar ref="SearchBar"
                       value={this.state.query}
                       onChange={this.updateQuery}
                       onKeyPress={this.submitOnEnter}
                       placeholder="Search all tracks..." />
          </div>
          <div className="options-container">
            {this.renderSearchSourceOptions()}
          </div>
        </PageControlBar>

        {this.renderLoadingIndicator()}

        {this.renderResults()}

      </section>
    );
  }

});

module.exports = SearchPage;