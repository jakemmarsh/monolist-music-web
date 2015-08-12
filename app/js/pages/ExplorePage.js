'use strict';

import React           from 'react/addons';
import {ListenerMixin} from 'reflux';
import DocumentTitle   from 'react-document-title';

import Helpers         from '../utils/Helpers';
import GlobalActions   from '../actions/GlobalActions';
import ExploreStore    from '../stores/ExploreStore';
import Title           from '../components/Title';
import PlaylistList    from '../components/PlaylistList';

var ExplorePage = React.createClass({

  mixins: [ListenerMixin],

  getInitialState() {
    return {
      playlists: {
        trending: [],
        newest: []
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
      <DocumentTitle title={Helpers.buildPageTitle('Explore')}>
      <section className="content explore">

        <Title text="Trending Playlists" icon="line-chart" />

        <PlaylistList playlists={this.state.playlists.trending} />

        <Title text="Newest Playlists" icon="asterisk" />

        <PlaylistList playlists={this.state.playlists.newest} />

      </section>
      </DocumentTitle>
    );
  }

});

export default ExplorePage;