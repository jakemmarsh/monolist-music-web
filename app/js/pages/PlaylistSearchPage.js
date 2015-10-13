'use strict';

import React               from 'react/addons';
import {ListenerMixin}     from 'reflux';
import _                   from 'lodash';

import PlaylistSearchStore from '../stores/PlaylistSearchStore';
import SearchActions       from '../actions/SearchActions';
import PlaylistList        from '../components/PlaylistList';

var PlaylistSearchPage = React.createClass({

  mixins: [ListenerMixin],

  propTypes: {
    query: React.PropTypes.object,
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
    let haveNewQuery = this.props.query.q && prevProps.query.q !== this.props.query.q;

    if ( haveNewQuery ) {
      this.doSearch();
    }
  },

  componentDidMount() {
    this.listenTo(PlaylistSearchStore, this._onResultsChange);

    if ( this.props.query.q ) {
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
      SearchActions.searchPlaylists(this.props.query.q, this._onResultsChange);
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