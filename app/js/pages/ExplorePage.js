'use strict';

import React           from 'react/addons';
import {ListenerMixin} from 'reflux';
import DocumentTitle   from 'react-document-title';

import APIUtils        from '../utils/APIUtils';
import GlobalActions   from '../actions/GlobalActions';
import ExploreStore    from '../stores/ExploreStore';
import PlaylistList    from '../components/PlaylistList';

var ExplorePage = React.createClass({

  mixins: [ListenerMixin],

  getInitialState() {
    return {
      playlists: {
        trending: [],
        newnest: []
      },
      error: null
    };
  },

  _onExplorePlaylistsChange(err, playlists) {
    if ( err ) {
      this.setState({ error: err });
    } else {
      this.setState({ error: null, playlists: playlists });
    }
  },

  componentWillMount() {
    GlobalActions.loadExplorePlaylists(this._onExplorePlaylistsChange);
    this.listenTo(ExploreStore, this._onExplorePlaylistsChange);
  },

  render() {
    return (
      <DocumentTitle title={APIUtils.buildPageTitle('Explore')}>
      <section className="content explore">

        <div className="title-container">
          <div className="icon-container">
            <i className="fa fa-line-chart"></i>
          </div>
          <h5 className="title">Trending Playlists</h5>
        </div>

        <PlaylistList playlists={this.state.playlists.trending} />

        <div className="title-container">
          <div className="icon-container">
            <i className="fa fa-asterisk"></i>
          </div>
          <h5 className="title">Newest Playlists</h5>
        </div>

        <PlaylistList playlists={this.state.playlists.newest} />

      </section>
      </DocumentTitle>
    );
  }

});

export default ExplorePage;