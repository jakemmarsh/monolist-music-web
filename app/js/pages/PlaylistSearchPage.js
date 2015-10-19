'use strict';

import React               from 'react';
import {ListenerMixin}     from 'reflux';
import _                   from 'lodash';

import PlaylistSearchStore from '../stores/PlaylistSearchStore';
import SearchActions       from '../actions/SearchActions';
import PlaylistList        from '../components/PlaylistList';

var PlaylistSearchPage = React.createClass({

  mixins: [ListenerMixin],

  propTypes: {
    location: React.PropTypes.object,
    setSearchState: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      setSearchState: () => {}
    };
  },

  getInitialState() {
    return {
      results: []
    };
  },

  _onResultsChange(err, results) {
    if ( err ) {
      this.props.setSearchState({
        error: err,
        loading: false
      });
    } else {
      this.setState({ results: results }, () => {
        this.props.setSearchState({
          error: null,
          loading: false
        });
      });
    }
  },

  componentDidUpdate(prevProps) {
    let haveNewQuery = this.props.location.query.q && prevProps.location.query.q !== this.props.location.query.q;

    if ( haveNewQuery ) {
      this.doSearch();
    }
  },

  componentDidMount() {
    this.listenTo(PlaylistSearchStore, this._onResultsChange);

    if ( this.props.location.query.q ) {
      this.doSearch();
    }
  },

  doSearch() {
    this.setState({
      results: []
    }, () => {
      this.props.setSearchState({
        error: null,
        loading: true
      });
      SearchActions.searchPlaylists(this.props.location.query.q, this._onResultsChange);
    });
  },

  renderResults() {
    if ( !_.isEmpty(this.state.results) ) {
      return (
        <PlaylistList playlists={this.state.results} cardClassName="pure-u-1-3" />
      );
    }
  },

  render() {
    return (
      <div>

        {this.renderResults()}

      </div>
    );
  }

});

export default PlaylistSearchPage;