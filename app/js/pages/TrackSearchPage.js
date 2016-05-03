'use strict';

import React            from 'react';
import {ListenerMixin}  from 'reflux';
import _                from 'lodash';

import SearchActions    from '../actions/SearchActions';
import TrackSearchStore from '../stores/TrackSearchStore';
import Tracklist        from '../components/Tracklist';
import NoDataBlock      from '../components/NoDataBlock';

const TrackSearchPage = React.createClass({

  mixins: [ListenerMixin],

  propTypes: {
    location: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    currentTrack: React.PropTypes.object,
    setSearchState: React.PropTypes.func,
    userCollaborations: React.PropTypes.array,
    isLoading: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      currentUser: {},
      location: {}
    };
  },

  getInitialState() {
    return {
      results: [],
      searchCompleted: false
    };
  },

  _onResultsChange(err, data) {
    if ( err ) {
      this.props.setSearchState({
        error: err,
        loading: false
      });
    } else {
      this.setState({
        results: data,
        searchCompleted: true
      }, () => {
        this.props.setSearchState({
          error: null,
          loading: false
        });
      });
    }
  },

  componentDidUpdate(prevProps) {
    const haveNewQuery = this.props.location.query.q && this.props.location.query.q.length && prevProps.location.query.q !== this.props.location.query.q;
    const haveNewSources = prevProps.location.query.sources !== this.props.location.query.sources;

    if ( haveNewQuery || haveNewSources ) {
      this.doSearch();
    }
  },

  componentDidMount() {
    if ( this.props.location.query.q ) {
      this.doSearch();
    }
    this.listenTo(TrackSearchStore, this._onResultsChange);
  },

  doSearch() {
    const sources = this.props.location.query.sources ? this.props.location.query.sources.split(',') : ['audiomack', 'bandcamp', 'soundcloud', 'youtube'];

    this.setState({ results: [], searchCompleted: false }, () => {
      this.props.setSearchState({
        error: null,
        loading: true
      });
      SearchActions.searchTracks(this.props.location.query.q, _.uniq(sources));
    });
  },

  renderResults() {
    const playlist = { tracks: this.state.results };

    if ( !_.isEmpty(playlist.tracks) ) {
      return (
        <Tracklist type="search"
                   currentUser={this.props.currentUser}
                   playlist={playlist}
                   addToPlaylist={this.addToPlaylist}
                   currentTrack={this.props.currentTrack}
                   userCollaborations={this.props.userCollaborations} />
      );
    } else if ( this.state.searchCompleted ) {
      return (
        <NoDataBlock iconClass="icon-frown-o"
                     heading="No track results."
                     subheading="Maybe try a different query?" />
      );
    } else if ( !this.props.isLoading ) {
      return (
        <NoDataBlock iconClass="icon-search"
                     heading="Search for tracks" />
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

export default TrackSearchPage;
