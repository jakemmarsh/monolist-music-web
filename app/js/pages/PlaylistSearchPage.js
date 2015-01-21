/**
 * @jsx React.DOM
 */
'use strict';

var React                   = require('react/addons');
var Reflux                  = require('reflux');
var _                       = require('lodash');
var Navigation              = require('react-router').Navigation;

var PlaylistSearchStore     = require('../stores/PlaylistSearchStore');
var GlobalActions           = require('../actions/GlobalActions');
var AuthenticatedRouteMixin = require('../mixins/AuthenticatedRouteMixin');
var DocumentTitle           = require('../components/DocumentTitle');
var PageControlBar          = require('../components/PageControlBar');
var SearchBar               = require('../components/SearchBar');
var Spinner                 = require('../components/Spinner');
var PlaylistList            = require('../components/PlaylistList');

var PlaylistSearchPage = React.createClass({

  mixins: [AuthenticatedRouteMixin, Navigation, React.addons.LinkedStateMixin, Reflux.ListenerMixin],

  getInitialState: function() {
    return {
      query: this.props.query.q ? this.props.query.q.replace(/(\+)|(%20)/gi, ' ') : '',
      isSearching: false,
      results: [],
      error: null
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

  handleKeyPress: function(evt) {
    var keyCode = evt.keyCode || evt.which;

    if ( keyCode === '13' || keyCode === 13 ) {
      this.reloadPage();
    }
  },

  reloadPage: function() {
    this.replaceWith('PlaylistSearch', {}, { q: this.state.query });
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
      this.setState({
        error: err.message,
        isSearching: false
      });
    } else {
      this.setState({
        isSearching: false,
        results: data,
        error: null
      });
    }
  },

  renderSpinner: function() {
    var element = null;

    if ( this.state.isSearching ) {
      element = (
        <Spinner size={18} />
      );
    }

    return element;
  },

  renderTitle: function() {
    var element = null;

    if ( this.state.results && !this.state.isSearching ) {
      element = (
        <div className="title-container below-controls-bar">
          <div className="icon-container">
            <i className="fa fa-search"></i>
          </div>
          <h5 className="title">Playlist Results for: {this.props.query.q.replace(/(\+)|(%20)/gi, ' ')}</h5>
        </div>
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
                       onKeyPress={this.handleKeyPress}
                       placeholder="Search all playlists..." />
          </div>
          <div className="loading-container">
            {this.renderSpinner()}
          </div>
          <div className="options-container" />
        </PageControlBar>

        {this.renderTitle()}

        {this.renderResults()}

      </section>
    );
  }

});

module.exports = React.createFactory(PlaylistSearchPage);