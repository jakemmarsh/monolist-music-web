'use strict';

import React                   from 'react/addons';
import {ListenerMixin}         from 'reflux';
import _                       from 'lodash';
import {Navigation}            from 'react-router';
import DocumentTitle           from 'react-document-title';

import Helpers                 from '../utils/Helpers';
import PlaylistSearchStore     from '../stores/PlaylistSearchStore';
import GlobalActions           from '../actions/GlobalActions';
import AuthenticatedRouteMixin from '../mixins/AuthenticatedRouteMixin';
import PageControlBar          from '../components/PageControlBar';
import SearchBar               from '../components/SearchBar';
import Spinner                 from '../components/Spinner';
import PlaylistList            from '../components/PlaylistList';

var PlaylistSearchPage = React.createClass({

  mixins: [AuthenticatedRouteMixin, Navigation, React.addons.LinkedStateMixin, ListenerMixin],

  getInitialState() {
    return {
      query: this.props.query.q ? this.props.query.q.replace(/(\+)|(%20)/gi, ' ') : '',
      isSearching: false,
      results: [],
      error: null
    };
  },

  componentDidUpdate(prevProps) {
    var haveNewQuery = this.props.query.q && this.props.query.q.length && prevProps.query.q !== this.props.query.q;

    if ( haveNewQuery ) {
      this.setState({
        query: this.props.query.q
      }, () => {
        this.doSearch();
      });
    }
  },

  componentDidMount() {
    if ( this.state.query.length ) {
      this.doSearch();
    }
    this.listenTo(PlaylistSearchStore, this.doneSearching);
  },

  handleKeyPress(evt) {
    var keyCode = evt.keyCode || evt.which;

    if ( keyCode === '13' || keyCode === 13 ) {
      this.reloadPage();
    }
  },

  reloadPage() {
    this.replaceWith('PlaylistSearch', {}, { q: this.state.query });
  },

  doSearch() {
    this.setState({
      isSearching: true,
      results: []
    }, function() {
      GlobalActions.doPlaylistSearch(this.state.query, this.doneSearching);
    });
  },

  doneSearching(err, data) {
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

  renderSpinner() {
    var element = null;

    if ( this.state.isSearching ) {
      element = (
        <Spinner size={18} />
      );
    }

    return element;
  },

  renderTitle() {
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

  renderResults() {
    var element = null;

    if ( !_.isEmpty(this.state.results) ) {
      element = (
        <PlaylistList playlists={this.state.results} />
      );
    }

    return element;
  },

  render() {
    return (
      <DocumentTitle title={Helpers.buildPageTitle('Search Playlists')}>
      <section className="content search">

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
      </DocumentTitle>
    );
  }

});

export default PlaylistSearchPage;