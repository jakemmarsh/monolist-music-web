/**
 * @jsx React.DOM
 */
'use strict';

var React               = require('react/addons');
var Reflux              = require('reflux');
var _                   = require('lodash');
var Navigation          = require('react-router').Navigation;

var PlaylistSearchStore = require('../stores/PlaylistSearchStore');
var GlobalActions       = require('../actions/GlobalActions');
var DocumentTitle       = require('../components/DocumentTitle');
var PageControlBar      = require('../components/PageControlBar');
var SearchBar           = require('../components/SearchBar');
var Spinner             = require('../components/Spinner');
var PlaylistList        = require('../components/PlaylistList');

var PlaylistSearchPage = React.createClass({

  mixins: [Navigation, React.addons.LinkedStateMixin, Reflux.ListenerMixin],

  getInitialState: function() {
    return {
      query: this.props.query.q ? this.props.query.q.replace(/(\+)|(%20)/gi, ' ') : '',
      isSearching: false,
      results: []
    };
  },

  componentDidUpdate: function(prevProps) {
    var haveNewQuery = this.props.query.q && this.props.query.q.length && prevProps.query.q !== this.props.query.q;

    if ( haveNewQuery ) {
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
    this.listenTo(PlaylistSearchStore, this.doneSearching);
  },

  submitOnEnter: function(evt) {
    var keyCode = evt.keyCode || evt.which;

    if ( keyCode === '13' || keyCode === 13 ) {
      this.reloadPage();
    }
  },

  reloadPage: function() {
    this.transitionTo('PlaylistSearch', {}, { q: this.state.query });
  },

  doSearch: function() {
    this.setState({
      isSearching: true,
      results: []
    }, function() {
      GlobalActions.doPlaylistSearch(this.state.query, this.doneSearching);
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
    var element = null;

    if ( !_.isEmpty(this.state.results) ) {
      element = (
        <PlaylistList playlists={this.state.results} />
      );
    }

    return element;
  },

  render: function() {
    return (
      <section className="content search">

        <DocumentTitle title="Search Playlists" />

        <PageControlBar type="search">
          <div className="search-container">
            <SearchBar ref="SearchBar"
                       valueLink={this.linkState('query')}
                       onKeyPress={this.submitOnEnter}
                       placeholder="Search all playlists..." />
          </div>
          <div className="loading-container">
            {this.renderLoadingIndicator()}
          </div>
          <div className="options-container" />
        </PageControlBar>

        <div className="soft-half--top">
          {this.renderResults()}
        </div>

      </section>
    );
  }

});

module.exports = React.createFactory(PlaylistSearchPage);