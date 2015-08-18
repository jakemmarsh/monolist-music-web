'use strict';

import React           from 'react/addons';
import _               from 'lodash';
import {ListenerMixin} from 'reflux';
import DocumentTitle   from 'react-document-title';

import Helpers         from '../utils/Helpers';
import GlobalActions   from '../actions/GlobalActions';
import ExploreStore    from '../stores/ExploreStore';
import Title           from '../components/Title';
import PlaylistList    from '../components/PlaylistList';
import CreatePostForm  from '../components/CreatePostForm';

var ExplorePage = React.createClass({

  mixins: [ListenerMixin],

  getInitialState() {
    return {
      posts: [],
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
    this.listenTo(ExploreStore, this._onExplorePlaylistsChange);
    GlobalActions.loadExplorePlaylists();
  },

  componentWillReceiveProps(nextProps) {
    if ( !_.isEqual(this.props.currentUser, nextProps.currentUser) ) {
      GlobalActions.loadExplorePlaylists();
    }
  },

  handlePostCreation(post) {
    let postsCopy = this.state.posts;

    postsCopy.unshift(post);

    this.setState({ posts: postsCopy });
  },

  render() {
    return (
      <DocumentTitle title={Helpers.buildPageTitle('Explore')}>
      <section className="content explore">

        <CreatePostForm handlePostCreation={this.handlePostCreation} />

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