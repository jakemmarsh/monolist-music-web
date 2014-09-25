/**
 * @jsx React.DOM
 */
'use strict';

var React               = require('react/addons');
var _                   = require('underscore');
var transitionTo        = require('react-router').transitionTo;

var TracklistControlBar = require('../components/TracklistControlBar');
var Tracklist           = require('../components/Tracklist');
var SearchBar           = require('../components/SearchBar');
var SearchAPI           = require('../utils/SearchAPI');

var SearchPage = React.createClass({

  sources: ['bandcamp', 'youtube', 'soundcloud'],

  statics: {
    willTransitionFrom: function(transition, component) {
      // If being redirected back to the same page, update query
      if ( /search/i.test(transition.path) ) {
        // Manually grab new search query from URL
        component.setState({
          query: transition.path.split('/')[2].replace(/(\+)|(%20)/gi, ' '),
          isSearching: true,
          results: null
        }, function() {
          component.componentDidMount();
        });
      }
    }
  },

  getInitialState: function() {
    return {
      query: this.props.params.query ? this.props.params.query.replace(/(\+)|(%20)/gi, ' ') : '',
      isSearching: this.props.params.query ? true : false,
      results: null,
      searchBandcamp: true,
      searchSoundCloud: true,
      searchYouTube: true
    };
  },

  componentDidMount: function() {
    this.props.updateHeader({
      title: 'Search Music',
      icon: 'fa-search'
    });

    if ( this.state.query.length ) {
      this.doSearch();
    }
  },

  doneSearching: function(data) {
    this.setState({
      isSearching: false,
      results: data
    });
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
      this.doSearch();
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
      this.doSearch();
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
      this.doSearch();
    });
  },

  submitOnEnter: function(evt) {
    var keyCode = evt.keyCode || evt.which;

    if ( keyCode === '13' || keyCode === 13 ) {
      this.reloadPage();
    }
  },

  reloadPage: function() {
    transitionTo('search', { query: this.state.query });
  },

  doSearch: function() {
    SearchAPI.get(this.state.query, _.uniq(this.sources)).then(function(data) {
      this.doneSearching(data);
    }.bind(this), function(err) {
      console.log('error doing search:', err);
    });
  },

  renderSearchSourceOptions: function() {
    var element = (
      <ul>
        <li>
          <label htmlFor="bandcamp">Bandcamp</label>
          <input type="checkbox"
                 name="bandcamp"
                 checked={this.state.searchBandcamp}
                 onChange={this.toggleBandcamp} />
        </li>
        <li>
          <label htmlFor="soundcloud">SoundCloud</label>
          <input type="checkbox"
                 name="soundcloud"
                 checked={this.state.searchSoundCloud}
                 onChange={this.toggleSoundCloud} />
        </li>
        <li>
          <label htmlFor="youtube">YouTube</label>
          <input type="checkbox"
                 name="youtube"
                 checked={this.state.searchYouTube}
                 onChange={this.toggleYouTube} />
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
        <Tracklist tracks={this.state.results}
                   selectTrack={this.props.selectTrack}
                   currentTrack={this.props.currentTrack} />
      );
    }

    return results;
  },

  render: function() {
    return (
      <section className="content">
        <TracklistControlBar type="search">
          <div className="search-container">
            <SearchBar ref="SearchBar"
                       value={this.state.query}
                       onChange={this.updateQuery}
                       onKeyPress={this.submitOnEnter}
                       placeholder="Search all music..." />
          </div>
          <div className="options-container">
            {this.renderSearchSourceOptions()}
          </div>
        </TracklistControlBar>
        {this.renderLoadingIndicator()}
        {this.renderResults()}
      </section>
    );
  }

});

module.exports = SearchPage;