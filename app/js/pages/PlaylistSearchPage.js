/**
 * @jsx React.DOM
 */
'use strict';

var React          = require('react/addons');
var transitionTo   = require('react-router').transitionTo;

var PageControlBar = require('../components/PageControlBar');
var SearchBar      = require('../components/SearchBar');
var Spinner        = require('../components/Spinner');

var PlaylistSearchPage = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    updatePageTitle: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      query: this.props.query.q ? this.props.query.q.replace(/(\+)|(%20)/gi, ' ') : '',
      isSearching: false,
      results: null
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
    this.props.updatePageTitle('Search Playlists');

    if ( this.state.query.length ) {
      this.doSearch();
    }
  },

  submitOnEnter: function(evt) {
    var keyCode = evt.keyCode || evt.which;

    if ( keyCode === '13' || keyCode === 13 ) {
      this.reloadPage();
    }
  },

  reloadPage: function() {
    transitionTo('PlaylistSearch', {}, { q: this.state.query });
  },

  doSearch: function() {
    this.setState({
      isSearching: true,
      results: null
    }, function() {
      console.log('did search');
      this.doneSearching();
    });
  },

  doneSearching: function(data) {
    this.setState({
      isSearching: false,
      results: data
    });
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

  render: function() {
    return (
      <section className="content search">

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

      </section>
    );
  }

});

module.exports = PlaylistSearchPage;