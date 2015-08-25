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
import Title                   from '../components/Title';
import SearchBar               from '../components/SearchBar';
import Spinner                 from '../components/Spinner';
import PlaylistList            from '../components/PlaylistList';

var PlaylistSearchPage = React.createClass({

  mixins: [AuthenticatedRouteMixin, Navigation, ListenerMixin],

  getInitialState() {
    return {
      isSearching: false,
      results: [],
      error: null
    };
  },

  componentDidUpdate(prevProps) {
    var haveNewQuery = this.props.query.q && prevProps.query.q !== this.props.query.q;

    if ( haveNewQuery ) {
      this.doSearch();
    }
  },

  componentDidMount() {
    this.listenTo(PlaylistSearchStore, this.doneSearching);

    if ( this.props.query.q ) {
      this.doSearch();
    }
  },

  doSearch() {
    this.setState({
      isSearching: true,
      results: []
    }, function() {
      GlobalActions.doPlaylistSearch(this.props.query.q, this.doneSearching);
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
        <Title text={'Playlist Results for: ' + this.props.query.q.replace(/(\+)|(%20)/gi, ' ')} icon="search" />
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

        {this.renderResults()}

      </section>
      </DocumentTitle>
    );
  }

});

export default PlaylistSearchPage;